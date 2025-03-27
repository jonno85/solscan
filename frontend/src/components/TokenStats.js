import React from 'react';

const TokenStats = ({ token }) => {
  if (!token) return null;

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3 className="h5">Statistics</h3>
      </div>
      <div className="card-body">
        <dl className="row">
          <dt className="col-sm-3">Holders:</dt>
          <dd className="col-sm-9">{token.holdersCount.toLocaleString()}</dd>

          <dt className="col-sm-3">Transactions:</dt>
          <dd className="col-sm-9">{token.txCount.toLocaleString()}</dd>

          <dt className="col-sm-3">Created:</dt>
          <dd className="col-sm-9">{new Date(token.createdAt).toLocaleDateString()}</dd>
        </dl>
      </div>
    </div>
  );
};

export default TokenStats;
