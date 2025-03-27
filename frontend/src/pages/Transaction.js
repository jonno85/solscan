import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LogMessages from '../components/LogMessages';
import Instructions from '../components/Instructions';
import Accounts from '../components/Accounts';
import TransactionDetails from '../components/TransactionDetails';
import { fetchTransactionBySignature } from '../services/api';
import { formatTimestamp } from '../utils/helpers';

const Transaction = () => {
  const { signature } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const response = await fetchTransactionBySignature(signature);
        setTransaction(response);
        setError(null);
      } catch (err) {
        setError('Failed to load transaction details');
        console.error('Error fetching transaction:', err);
      } finally {
        setLoading(false);
      }
    };

    if (signature) {
      fetchTransaction();
    }
  }, [signature]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderStatus = (status) => {
    if (status === 'confirmed') {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Confirmed</span>;
    } else if (status === 'failed') {
      return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Failed</span>;
    } else {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Processing</span>;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="alert alert-warning" role="alert">
        Transaction not found
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="h2 mb-4 ms-2">Transaction Details</h1>
      
      <TransactionDetails 
        transaction={transaction} 
        copyToClipboard={copyToClipboard} 
        formatTimestamp={formatTimestamp} 
        renderStatus={renderStatus} 
      />

      <Accounts accounts={transaction.accounts} />
      
      <Instructions instructions={transaction.instructions} />
      
      <LogMessages logMessages={transaction.logMessages} />
    </div>
  );
};

export default Transaction;
