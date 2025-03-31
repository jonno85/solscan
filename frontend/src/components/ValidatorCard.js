import React, { useState } from 'react';
import { formatBalance, shortenAddress } from '../utils/helpers';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ValidatorCard = ({ validator }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-header d-flex align-items-center">
        <img
          src={validator.logoUrl || '/validator.jpg'}
          className="rounded-circle me-3"
          alt={validator.name}
          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
        />
        <h5 className="card-title mb-0">{validator.name || shortenAddress(validator.identity)}</h5>
      </div>
      <div className="card-body">
        <p className="card-text mb-2 d-flex align-items-center">
          <span className="fw-bold me-2">Identity:</span>
          <CopyToClipboard text={validator.identity} onCopy={handleCopy}>
            <span className="d-flex align-items-center">
              {shortenAddress(validator.identity)}
              <button className="btn btn-sm btn-outline-secondary ms-2" type="button">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </span>
          </CopyToClipboard>
        </p>
        <p className="card-text mb-2">
          <span className="fw-bold">Commission:</span> {validator.commission}%
        </p>
        <p className="card-text mb-2">
          <span className="fw-bold">Activated Stake:</span> {formatBalance(validator.activatedStake)}
        </p>
        <p className="card-text mb-0">
          <span className="fw-bold">Last Vote:</span> {new Date(validator.lastVote * 1000).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ValidatorCard;
