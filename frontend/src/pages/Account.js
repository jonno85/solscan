import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchAccountByAddress } from '../services/api';
import AccountOverview from '../components/AccountOverview';
import AccountTokenHoldings from '../components/AccountTokenHoldings';
import AccountTransactionHistory from '../components/AccountTransactionHistory';

const Account = () => {
  const { address } = useParams();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        setLoading(true);
        const response = await fetchAccountByAddress(address);
        console.log('Account details:', response);
        setAccount(response.account);
        setTransactions(response.recentTransactions);
        setError(null);
      } catch (err) {
        setError('Failed to load account details');
        console.error('Error fetching account:', err);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchAccount();
    }
  }, [address]);

  const loadMoreTransactions = () => {
    setPage(prevPage => prevPage + 1);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const formatBalance = (balance) => {
    if (balance === undefined || balance === null) return 'Unknown';
    const solBalance = balance / 1000000000;
    return `${solBalance.toLocaleString()} SOL`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && !account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">No data: </strong>
          <span className="block sm:inline">Account not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Account Details</h1>
      <AccountOverview account={account} copyToClipboard={copyToClipboard} formatBalance={formatBalance} copied={copied} />
      <AccountTokenHoldings account={account} />
      <AccountTransactionHistory transactions={transactions} formatTimestamp={formatTimestamp} loadMoreTransactions={loadMoreTransactions} transactionsLoading={transactionsLoading} hasMore={hasMore} />
    </div>
  );
};

export default Account;
