import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { shortenAddress } from '../utils/helpers';
import {fetchAccountTokens} from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const AccountTokenHoldings = ({ account }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
      const fetchTokensByAccount = async (address) => {
        try {
          setLoading(true);
          const response = await fetchAccountTokens(address);
          console.log('tokens details:', response);
          setTokens(response);
          setError(null);
        } catch (err) {
          setError('Failed to load account tokens');
          console.error('Error fetching account tokens:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchTokensByAccount(account.address);
  }, [account]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!account || !tokens || tokens.length === 0) {
    return <p>No token holdings found.</p>;
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

  return (
    <div className="card mb-4">
      <div className="card-header">Token Holdings</div>
      <div className="card-body">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Token</th>
              <th>Symbol</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token, index) => (
              <tr key={index}>
                <td>
                  <Link to={`/token/${token.mint}`} className="link-primary font-monospace">
                    {shortenAddress(token.mint)}
                  </Link>
                </td>
                <td>{token.symbol || 'Unknown'}</td>
                <td>{(token.amount / (10 ** (token.decimals || 0))).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountTokenHoldings;
