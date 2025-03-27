import config from 'config';
import Block from '../models/block.js';
import Transaction from '../models/transaction.js';
import Account from '../models/account.js';
import { connection } from './solana.js';
import logger from '../utils/logger.js';
import decodeLookupTableData from './lookupTable.js';
import account from '../models/account.js';

async function indexLatestBlocks(count = 10) {
  try {
    const latestSlot = await connection.getSlot();
    logger.info(`Indexing from slot ${latestSlot - count + 1} to ${latestSlot}`);

    for (let i = 0; i < count; i++) {
      const slot = latestSlot - i;
      await indexBlock(slot);
    }
  } catch (error) {
    logger.error('Error indexing latest blocks:', error);
  }
}

async function indexBlock(slot) {
  try {
    const existingBlock = await Block.findOne({ slot });
    if (existingBlock) {
      return;
    }

    const blockInfo = await connection.getBlock(slot, {
      maxSupportedTransactionVersion: 0,
    });
    if (!blockInfo) {
      logger.info(`Block ${slot} not found`);
      return;
    }

    const block = new Block({
      slot,
      blockhash: blockInfo.blockhash,
      parentSlot: blockInfo.parentSlot,
      blockTime: blockInfo.blockTime,
      blockHeight: blockInfo.blockHeight,
      transactionCount: blockInfo.transactions.length,
    });

    await block.save();
    logger.info(`Indexed block ${slot} number of transactions: ${blockInfo.transactions.length}`);

    const transactionPromises = blockInfo.transactions.map((tx) => indexTransaction(tx, slot, blockInfo.blockTime));

    const transactions = await Promise.all(transactionPromises);

    block.transactions = transactions.map((tx) => tx._id);
    await block.save();
  } catch (error) {
    logger.error(`Error indexing block ${slot}:`, error);
  }
}

async function indexTransaction(tx, slot, blockTime) {
  try {
    const signature = tx.transaction.signatures[0];

    // Check if transaction already exists
    let transaction = await Transaction.findOne({ signature });
    if (transaction) {
      return transaction;
    }

    let accountKeys = [];
    let instructions = [];

    // Check if we're dealing with a versioned transaction
    const isVersioned = 'version' in tx.transaction.message;

    if (isVersioned) {
      // Versioned transaction format
      accountKeys = tx.transaction.message.staticAccountKeys.map((key) => key.toString());

      // Add address lookup table accounts if they exist
      if (tx.transaction.message.addressTableLookups && tx.transaction.message.addressTableLookups.length > 0) {

        
        for (const lookupTableEntry of tx.transaction.message.addressTableLookups) {
          const lookupTableAddress = lookupTableEntry.accountKey;

          // Fetch the lookup table from the blockchain using your solana connection
          let lookupTable = null;
          try {
            logger.info(`Fetching lookup table ${lookupTableAddress.toString()}`);
            lookupTable = await connection.getAccountInfo(lookupTableAddress);
          } catch (error) {
            logger.error(`Error fetching lookup table ${lookupTableAddress}:`, error);
          }

          if (lookupTable && lookupTable.data) {
            const addresses = decodeLookupTableData(lookupTable.data);
            const accountsInfo = await getPaginatedAccountsInfo(addresses)
            for (const accountData of accountsInfo) {
              const tokenAccount = await connection.getTokenAccountsByOwner(pubkeyAccount);
              account = new Account({
                address,
                owner: accountData.owner.toString(),
                lamports: accountData.lamports,
                executable: accountData.executable,
                rentEpoch: accountData.rentEpoch,
                data: accountData.data,
                tokenAccounts: tokenAccount.value.map((account) => ({
                  mint: account.account.data.parsed.info.mint,
                  amount: account.account.data.parsed.info.tokenAmount.amount,
                  decimals: account.account.data.parsed.info.tokenAmount.decimals,
                })),
              });
              account.save();
            }

            logger.info(`Decoded lookup table addresses ${addresses.length}`);
            // Process writable indexes
            for (const index of lookupTableEntry.writableIndexes) {
              if (index < addresses.length) {
                accountKeys.push(addresses[index].toString());
              }
            }

            // Process readonly indexes
            for (const index of lookupTableEntry.readonlyIndexes) {
              if (index < addresses.length) {
                accountKeys.push(addresses[index].toString());
              }
            }
          }
        }
      }

      // Handle instructions for versioned transactions
      instructions = tx.transaction.message.compiledInstructions.map((ix) => ({
        programId: accountKeys[ix.programIdIndex].toString(),
        data: ix.data,
        accounts: ix.accountKeyIndexes.map((idx) => accountKeys[idx].toString()),
      }));
    } else if (tx.transaction.message.accountKeys) {
      // Legacy transaction format
      accountKeys = tx.transaction.message.accountKeys.map((key) => key.toString());

      instructions = tx.transaction.message.instructions.map((ix) => ({
        programId: accountKeys[ix.programIdIndex].toString(),
        data: ix.data,
        accounts: ix.accounts.map((idx) => accountKeys[idx].toString()),
      }));
    } else {
      logger.error('Unknown transaction format:', tx.transaction);
      throw new Error('Unknown transaction format - cannot extract account keys');
    }

    transaction = new Transaction({
      signature,
      blockSlot: slot,
      blockTime: blockTime,
      status: tx.meta.err ? 'failed' : 'success',
      fee: tx.meta.fee,
      accounts: accountKeys,
      instructions: instructions,
      logs: tx.meta.logMessages || [],
    });

    await transaction.save();
    return transaction;
  } catch (error) {
    logger.error(`Error indexing transaction:`, error);
    throw error;
  }
}

async function getPaginatedAccountsInfo(addresses, limit = 100) {
  const accounts = [];
  let max = addresses.length / limit
  max += addresses.length % limit > 0 ? 1 : 0
  for (let i = 0; i < max; i++) {
    const start = i * limit
    const end = start + limit
    const slicedArray = addresses.slice(start, end)
    const promises = connection.getMultipleAccountsInfo(slicedArray);
    try {
      const results = await Promise.all(promises);
      accounts.push(...results);
    } catch (error) {
      logger.error(`Error fetching accounts in batch ${i} to ${i + limit}:`, error);
    }
  }
  return accounts;
}

async function getAccountInfoWithRetry(publicKey, retries = 3, delay = 1000) {
  try {
    return await connection.getAccountInfo(publicKey);
  } catch (error) {
    if (retries > 0) {
      logger.warn(`Retrying getAccountInfo for ${publicKey.toString()} (retries left: ${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return getAccountInfoWithRetry(publicKey, retries - 1, delay * 2); // Exponential backoff
    } else {
      logger.error(`Failed to get account info for ${publicKey.toString()} after multiple retries:`, error);
      throw error;
    }
  }
}

function startIndexing(io) {
  // Initial indexing when server starts
  indexLatestBlocks(10);

  // Set up recurring indexing job
  const indexRate = config.get('indexRate');
  setInterval(async () => {
    await indexLatestBlocks(5);

    // Emit an event to connected clients
    io.emit('newBlocks', { updated: true });
  }, indexRate);
}

export { startIndexing, indexBlock, indexTransaction };
