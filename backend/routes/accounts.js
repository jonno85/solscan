import { Router } from 'express';
import { PublicKey } from '@solana/web3.js';
import Account from '../models/account.js';
import Transaction from '../models/transaction.js';
import * as cacheService from '../services/redisCache.js';
import { connection } from '../services/solana.js';
import logger from '../utils/logger.js';

const router = Router();

// Get account information by address
router.get('/:address', async (req, res) => {
  try {
    const address = req.params.address;
    
    // Validate Solana address
    try {
      new PublicKey(address);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid Solana address' });
    }
    
    const cachedData = await cacheService.get(`account_${address}`);
    if (cachedData) {
      return res.json(cachedData);
    }
    
    let account = await Account.findOne({ address });
      
    if (!account) {
      // Try to fetch from Solana if not in our DB
      const accountInfo = await connection.getAccountInfo(new PublicKey(address));
      if (!accountInfo) {
        return res.status(404).json({ error: 'Account not found' });
      }
      
      const balance = await connection.getBalance(new PublicKey(address));
      
      account = {
        address,
        lamports: balance,
        owner: accountInfo.owner.toString(),
        executable: accountInfo.executable,
        rentEpoch: accountInfo.rentEpoch,
        data: accountInfo.data.toString()
      };
    }
    
    // Get recent transactions for this account
    const recentTransactions = await Transaction.find({ accounts: address })
      .sort({ blockTime: -1 })
      .limit(10)
      .select('signature blockTime status fee');
      
    const result = {
      account,
      recentTransactions
    };
    
    await cacheService.set(`account_${address}`, result);
    res.json(result);
  } catch (error) {
    logger.error('Error fetching account:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get token accounts for an address
router.get('/:address/tokens', async (req, res) => {
  try {
    const address = req.params.address;
    
    // Validate Solana address
    try {
      new PublicKey(address);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid Solana address' });
    }
    
    const cachedData = await cacheService.get(`account_tokens_${address}`);
    if (cachedData) {
      return res.json(cachedData);
    }
    
    // Get token accounts owned by this address
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      new PublicKey(address),
      { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
    );
    
    const tokens = tokenAccounts.value.map(item => {
      const accountData = item.account.data.parsed.info;
      return {
        mint: accountData.mint,
        tokenAccount: item.pubkey.toString(),
        amount: accountData.tokenAmount.amount,
        decimals: accountData.tokenAmount.decimals,
        uiAmount: accountData.tokenAmount.uiAmount
      };
    });
    
    await cacheService.set(`account_tokens_${address}`, tokens);
    res.json(tokens);
  } catch (error) {
    logger.error('Error fetching token accounts:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;