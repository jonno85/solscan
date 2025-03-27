import { PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';
import logger from '../utils/logger.js';

function decodeLookupTableData(data) {
  if (!data || data.length < 4) {
    logger.warn('Invalid or empty lookup table data');
    return [];
  }

  const featureFlags = data.readUInt32LE(0); // First 4 bytes are feature flags (usually 0)
  logger.info(`Feature flags: ${featureFlags}`);
  const stateOffset = 4;

  if (data.length <= stateOffset) {
    logger.warn('Lookup table data too short to contain state');
    return [];
  }

  const accountData = data.slice(stateOffset);
  const addresses = [];
  const addressLength = 32; // PublicKey length

  for (let i = 0; i < accountData.length; i += addressLength) {
    if (i + addressLength <= accountData.length) {
      const addressBuffer = accountData.slice(i, i + addressLength);
      addresses.push(new PublicKey(addressBuffer));
    }
  }

  return addresses;
}

export default decodeLookupTableData;
