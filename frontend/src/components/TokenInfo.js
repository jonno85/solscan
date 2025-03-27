import React from 'react';

const TokenInfo = ({ token }) => {
  if (!token) return null;

  return (
    <div className="card mb-4"> {/* Bootstrap card */}
      <div className="card-header">
        <h3 className="h5">Token Information</h3>
      </div>
      <div className="card-body">
        <dl className="row"> {/* Bootstrap definition list */}
          <dt className="col-sm-3">Token Name:</dt>
          <dd className="col-sm-9">{token.name}</dd>

          <dt className="col-sm-3">Symbol:</dt>
          <dd className="col-sm-9">{token.symbol}</dd>

          <dt className="col-sm-3">Decimals:</dt>
          <dd className="col-sm-9">{token.decimals}</dd>

          <dt className="col-sm-3">Total Supply:</dt>
          <dd className="col-sm-9">
            {(token.supply / Math.pow(10, token.decimals)).toLocaleString()} {token.symbol}
          </dd>
          {token.website && (
            <>
              <dt className="col-sm-3">Website:</dt>
              <dd className="col-sm-9">
                <a href={token.website} target="_blank" rel="noopener noreferrer" className="link-primary">
                  {token.website}
                </a>
              </dd>
            </>
          )}
        </dl>
      </div>
    </div>
  );
};

export default TokenInfo;
