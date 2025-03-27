import { Router } from 'express';
import { PublicKey } from '@solana/web3.js';
import Token from '../models/token.js';
import * as cacheService from '../services/redisCache.js';
import { connection } from '../services/solana.js';
import logger from '../utils/logger.js';

const router = Router();

// Get popular tokens
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const cachedData = await cacheService.get(`tokens_${page}_${limit}`);
    if (cachedData) {
      return res.json(cachedData);
    }
    
    const tokens = await Token.find()
      .sort({ holders: -1 })
      .skip(skip)
      .limit(limit);
      
    const totalTokens = await Token.countDocuments();
    
    const result = {
      tokens,
      currentPage: page,
      totalPages: Math.ceil(totalTokens / limit),
      totalTokens
    };
    
    await cacheService.set(`tokens_${page}_${limit}`, result);
    res.json(result);
  } catch (error) {
    logger.error('Error fetching tokens:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get token by mint address
router.get('/:mint', async (req, res) => {
  try {
    const mint = req.params.mint;
    
    // Validate Solana address
    try {
      new PublicKey(mint);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid token mint address' });
    }
    
    const cachedData = await cacheService.get(`token_${mint}`);
    if (cachedData) {
      return res.json(cachedData);
    }
    
    let token = await Token.findOne({ mint });
      
    if (!token) {
      // Try to fetch from Solana if not in our DB
      try {
        const mintInfo = await connection.getParsedAccountInfo(new PublicKey(mint));
        if (!mintInfo || !mintInfo.value) {
          return res.status(404).json({ error: 'Token not found' });
        }
        
        // Check if it's actually a token mint account
        if (mintInfo.value.owner.toString() !== 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') {
          return res.status(400).json({ error: 'Not a token mint account' });
        }
        
        const parsedData = mintInfo.value.data.parsed;
        
        // Format token data
        token = {
          mint,
          decimals: parsedData.info.decimals,
          supply: parsedData.info.supply,
          name: "Unknown", // Would need to fetch from token registry
          symbol: "UNK"    // Would need to fetch from token registry
        };
      } catch (error) {
        logger.error('Error fetching token info:', error);
        return res.status(404).json({ error: 'Token not found' });
      }
    }
    
    await cacheService.set(`token_${mint}`, token);
    res.json(token);
  } catch (error) {
    logger.error('Error fetching token:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;