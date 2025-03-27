import React from 'react';
import { Link } from 'react-router-dom';

const TokenCard = ({ token }) => {
  return (
    <div className="card h-100">
      <Link to={`/token/${token.address}`}>
        <img src={token.logoUrl || '/placeholder.png'} className="card-img-top" alt={token.name} />
        <div className="card-body">
          <h5 className="card-title">{token.name} ({token.symbol})</h5>
          <p className="card-text">Address: {token.address}</p>
        </div>
      </Link>
    </div>
  );
};

export default TokenCard;
