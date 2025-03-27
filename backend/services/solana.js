import { Connection, PublicKey } from '@solana/web3.js';
import config from 'config';
import logger from '../utils/logger.js';

// Create a connection to the Solana cluster
const connection = new Connection(config.get('solanaRPC'), {
  maxSupportedTransactionVersion: 0,
  commitment: 'confirmed',
});

// Get account info with retry mechanism
async function getAccountInfo(address, retries = 3) {
  try {
    return await connection.getAccountInfo(new PublicKey(address));
  } catch (error) {
    if (retries > 0) {
      logger.info(`Retrying getAccountInfo for ${address}, ${retries} retries left`);
      return getAccountInfo(address, retries - 1);
    }
    throw error;
  }
}

// Get token accounts with retry mechanism
async function getTokenAccounts(owner, retries = 3) {
  try {
    return await connection.getParsedTokenAccountsByOwner(new PublicKey(owner), {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    });
  } catch (error) {
    if (retries > 0) {
      logger.info(`Retrying getTokenAccounts for ${owner}, ${retries} retries left`);
      return getTokenAccounts(owner, retries - 1);
    }
    throw error;
  }
}

export { connection, getAccountInfo, getTokenAccounts };
