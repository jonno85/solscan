import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api/v1';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Blocks API
export const fetchBlocks = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(`/blocks?page=${page}&limit=${limit}`);
    console.log('Blocks:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching blocks:', error);
    throw error;
  }
};

export const fetchBlockBySlot = async (slot) => {
  try {
    const response = await apiClient.get(`/blocks/${slot}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching block with slot ${slot}:`, error);
    throw error;
  }
};

// Transactions API
export const fetchTransactions = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(`/transactions?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const fetchTransactionBySignature = async (signature) => {
  try {
    const response = await apiClient.get(`/transactions/${signature}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transaction with signature ${signature}:`, error);
    throw error;
  }
};

export const fetchTransactionsByAccount = async (address, page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(`/transactions/account/${address}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching transactions for account ${address}:`, error);
    throw error;
  }
};

// Accounts API
export const fetchAccountByAddress = async (address) => {
  try {
    const response = await apiClient.get(`/accounts/${address}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching account with address ${address}:`, error);
    throw error;
  }
};

export const fetchAccountTokens = async (address, page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(`/accounts/${address}/tokens?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tokens for account ${address}:`, error);
    throw error;
  }
};

// Tokens API
export const fetchTokens = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(`/tokens?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tokens:', error);
    throw error;
  }
};

export const fetchTokenByMint = async (mintAddress) => {
  try {
    const response = await apiClient.get(`/tokens/${mintAddress}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching token with mint address ${mintAddress}:`, error);
    throw error;
  }
};

export const fetchTokenHolders = async (mintAddress, page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(`/tokens/${mintAddress}/holders?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching holders for token ${mintAddress}:`, error);
    throw error;
  }
};

export const getTokenDetails = async (mintAddress) => {
  try {
    const response = await apiClient.get(`/tokens/${mintAddress}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching token details:', error);
    throw error;
  }
};

export const getTokenTransactions = async (mintAddress) => {
  try {
    const response = await apiClient.get(`/tokens/${mintAddress}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching network stats:', error);
    throw error;
  }
};

export const getTokenHolders = async (mintAddress) => {
  try {
    const response = await apiClient.get(`/tokens/${mintAddress}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching network stats:', error);
    throw error;
  }
};

// Search API
export const search = async (query) => {
  try {
    const response = await apiClient.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching for ${query}:`, error);
    throw error;
  }
};

// Stats API
export const fetchNetworkStats = async () => {
  try {
    const response = await apiClient.get('/stats/network');
    return response.data;
  } catch (error) {
    console.error('Error fetching network stats:', error);
    throw error;
  }
};
