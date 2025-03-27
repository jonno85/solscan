import { Router } from 'express';
import Transaction from '../models/transaction.js';
import * as cacheService from '../services/redisCache.js';
import { connection } from '../services/solana.js';
import logger from '../utils/logger.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const cachedData = await cacheService.get(`transactions_${page}_${limit}`);
    if (cachedData) {
      return res.json(cachedData);
    }

    const transactions = await Transaction.find()
      .sort({ blockTime: -1 })
      .skip(skip)
      .limit(limit)
      .select('signature blockSlot blockTime status fee');

    const totalTransactions = await Transaction.countDocuments();

    const result = {
      transactions,
      currentPage: page,
      totalPages: Math.ceil(totalTransactions / limit),
      totalTransactions,
    };

    await cacheService.set(`transactions_${page}_${limit}`, result);
    res.json(result);
  } catch (error) {
    logger.error('Error fetching transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get transaction by signature
router.get('/:signature', async (req, res) => {
  try {
    const signature = req.params.signature;

    const cachedData = await cacheService.get(`transaction_${signature}`);
    if (cachedData) {
      return res.json(cachedData);
    }

    let transaction = await Transaction.findOne({ signature });

    if (!transaction) {
      // Try to fetch from Solana if not in our DB
      const txInfo = await connection.getTransaction(signature, {
        maxSupportedTransactionVersion: 0,
      });
      if (!txInfo) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      transaction = {
        signature,
        blockSlot: txInfo.slot,
        blockTime: txInfo.blockTime,
        status: txInfo.meta.err ? 'failed' : 'success',
        fee: txInfo.meta.fee,
        accounts: txInfo.transaction.message.accountKeys.map((key) => key.toString()),
        instructions: txInfo.transaction.message.instructions.map((ix) => ({
          programId: txInfo.transaction.message.accountKeys[ix.programIdIndex].toString(),
          data: ix.data,
          accounts: ix.accounts.map((idx) => txInfo.transaction.message.accountKeys[idx].toString()),
        })),
        logs: txInfo.meta.logMessages || [],
      };
    }

    await cacheService.set(`transaction_${signature}`, transaction);
    
    res.json(transaction);
  } catch (error) {
    logger.error('Error fetching transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
