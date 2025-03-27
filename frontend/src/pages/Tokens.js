import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTokens } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import TokenCard from '../components/TokenCard';

const Tokens = () => {
  const { address } = useParams();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTokensData = async () => {
      try {
        setLoading(true);
        const tokensData = await fetchTokens();
        setTokens(tokensData.tokens);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tokens data:', err);
        setError('Failed to load tokens data. Please try again later.');
        setLoading(false);
      }
    };

    fetchTokensData();
  }, [address]);
  
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="h2 mb-4">Tokens</h1>
      {tokens.length === 0 ? (
        <div className="text-center py-8">
          <span role='img' className="large-emoji" aria-label='No tokens found'>😶‍🌫️</span>
          <p className="mt-3 text-muted">No tokens found.</p>
        </div>
      ) : (
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {tokens.map((token) => (
          <div key={token.address} className="col">
            <TokenCard token={token} />
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default Tokens;
