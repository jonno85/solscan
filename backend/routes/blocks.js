import { Router } from 'express';
import Block from '../models/block.js';
import * as cacheService from '../services/redisCache.js';
import { connection } from '../services/solana.js';
import logger from '../utils/logger.js';

const router = Router();

// Get recent blocks (paginated)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const cachedData = await cacheService.get(`blocks_${page}_${limit}`);
    if (cachedData) {
      return res.json(cachedData);
    }
    
    const blocks = await Block.find()
      .sort({ slot: -1 })
      .skip(skip)
      .limit(limit)
      .select('slot blockhash blockTime transactionCount');
      
    const totalBlocks = await Block.countDocuments();
    
    const result = {
      blocks,
      currentPage: page,
      totalPages: Math.ceil(totalBlocks / limit),
      totalBlocks
    };
    
    await cacheService.set(`blocks_${page}_${limit}`, result);
    res.json(result);
  } catch (error) {
    logger.error('Error fetching blocks:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get block by slot
router.get('/:slot', async (req, res) => {
  try {
    const slot = parseInt(req.params.slot);
    
    const cachedData = await cacheService.get(`block_${slot}`);
    if (cachedData) {
      return res.json(cachedData);
    }
    
    let block = await Block.findOne({ slot })
      .populate('transactions', 'signature blockTime status fee');
      
    if (!block) {
      // Try to fetch from Solana if not in our DB
      const blockInfo = await connection.getBlock(slot, {
        maxSupportedTransactionVersion: 0,
      });
      if (!blockInfo) {
        return res.status(404).json({ error: 'Block not found' });
      }
      
      // Format block data (simplified for this example)
      block = {
        slot,
        blockhash: blockInfo.blockhash,
        parentSlot: blockInfo.parentSlot,
        blockTime: blockInfo.blockTime,
        blockHeight: blockInfo.blockHeight,
        transactionCount: blockInfo.transactions.length,
        transactions: blockInfo.transactions.map(tx => ({
          signature: tx.transaction.signatures[0],
          blockTime: blockInfo.blockTime,
          status: tx.meta.err ? 'failed' : 'success',
          fee: tx.meta.fee
        }))
      };
    }
    
    await cacheService.set(`block_${slot}`, block);
    res.json(block);
  } catch (error) {
    logger.error('Error fetching block:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;