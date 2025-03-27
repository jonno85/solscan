import Redis from 'ioredis';
import config from 'config';
import logger from '../utils/logger.js';

const redis = new Redis(config.get('redis'));

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

async function get(key) {
  try {
    const result = await redis.get(key);
    return result ? JSON.parse(result) : null;
  } catch (error) {
    logger.error('Error getting data from Redis:', error);
    return null;
  }
}

async function set(key, data, ttl = config.get('cacheExpiry')) {
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttl);
    return true;
  } catch (error) {
    logger.error('Error setting data in Redis:', error);
    return false;
  }
}

async function del(key) {
  try {
    const result = await redis.del(key);
    return result > 0;
  } catch (error) {
    logger.error('Error deleting data from Redis:', error);
    return false;
  }
}

async function flush() {
  try {
    await redis.flushdb();
    return true;
  } catch (error) {
    logger.error('Error flushing Redis database:', error);
    return false;
  }
}

export {
  get,
  set,
  del,
  flush,
};
