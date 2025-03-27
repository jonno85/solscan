import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTokenDetails, getTokenTransactions, getTokenHolders } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import TokenInfo from '../components/TokenInfo';
import TokenStats from '../components/TokenStats';
import TokenHolders from '../components/TokenHolders';
import TokenTransactions from '../components/TokenTransactions';

const Token = () => {
  const { address } = useParams();
  const [token, setToken] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [holders, setHolders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        setLoading(true);
        const tokenData = await getTokenDetails(address);
        setToken(tokenData);
        
        // Fetch initial transactions
        const txs = await getTokenTransactions(address, 1, 10);
        setTransactions(txs);
        
        // Fetch top holders
        const holdersData = await getTokenHolders(address, 1, 20);
        setHolders(holdersData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching token data:', err);
        setError('Failed to load token data. Please try again later.');
        setLoading(false);
      }
    };

    fetchTokenData();
  }, [address]);

  const renderOverview = () => {
    if (!token) return null;
    
    return (
      <div className="mb-6">
        <TokenInfo token={token} />
        <TokenStats token={token} />  
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Token not found!</strong>
        <span className="block sm:inline"> The requested token could not be found.</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center">
            {token.logoUrl && (
              <img src={token.logoUrl} alt={token.name} className="w-10 h-10 rounded-full mr-4" />
            )}
            <div>
              <h1 className="text-2xl font-bold">{token.name} ({token.symbol})</h1>
              <p className="text-gray-600 break-all">{address}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-6 text-center border-b-2 font-medium ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-6 text-center border-b-2 font-medium ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('holders')}
              className={`py-4 px-6 text-center border-b-2 font-medium ${
                activeTab === 'holders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Holders
            </button>
          </nav>
        </div>
      </div>

      <div className="mb-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'transactions' && <TokenTransactions transactions={transactions} token={token} />}
        {activeTab === 'holders' && <TokenHolders holders={holders} token={token} />}
      </div>
    </div>
  );
};

export default Token;
