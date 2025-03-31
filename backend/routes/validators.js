import express from 'express';
import Validator from '../models/validator.js';
import { getPaginationParams } from '../utils/helpers.js';
import logger from '../utils/logger.js';
import * as cacheService from '../services/redisCache.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);

    const cachedData = await cacheService.get(`validators_${page}_${limit}`);
    if (cachedData) {
      return res.json(cachedData);
    }

    const validators = await Validator.find()
      .sort({ commission: -1 })
      .skip(skip)
      .limit(limit)
      .select('identity voteAccount commission activatedStake lastVote');
            
    const totalValidators = await Validator.countDocuments();

    const result = {
      validators,
      currentPage: page,
      totalPages: Math.ceil(totalValidators / limit),
      totalValidators
    };
    
    await cacheService.set(`validators_${page}_${limit}`, result);
    res.json(validators);
  } catch (err) {
    logger.error('Error fetching validators:', err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const validator = await Validator.findById(req.params.id);
    if (validator == null) {
      return res.status(404).json({ message: 'Cannot find validator' });
    }
    res.json(validator);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
