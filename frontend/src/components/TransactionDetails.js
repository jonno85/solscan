import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

function TransactionDetails({ transaction, copyToClipboard, formatTimestamp, renderStatus }) {
  const time = formatTimestamp(transaction.timestamp);

  return (
    <div className="card mb-4">
      <div className="card-header">
        Overview
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-sm-3">Status</div>
          <div className="col-sm-9">{renderStatus(transaction.status)}</div>
        </div>
        <div className="row">
          <div className="col-sm-3">Signature</div>
          <div className="col-sm-9">
            <CopyToClipboard text={transaction.signature} onCopy={() => alert('Copied!')}>
              <span className="d-inline-flex align-items-center">
                <span>{transaction.signature}</span>
                <button className="btn btn-sm btn-outline-secondary ms-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h1V1.5zM9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                  </svg>
                </button>
              </span>
            </CopyToClipboard>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-3">Timestamp</div>
          <div className="col-sm-9">{time.absolute} ({time.relative})</div>
        </div>
        <div className="row">
          <div className="col-sm-3">Block</div>
          <div className="col-sm-9">{transaction.slot}</div>
        </div>
        <div className="row">
          <div className="col-sm-3">Fee</div>
          <div className="col-sm-9">{transaction.fee} SOL</div>
        </div>
        <div className="row">
          <div className="col-sm-3">Recent Blockhash</div>
          <div className="col-sm-9 font-monospace break-all">{transaction.recentBlockhash || 'N/A'}</div>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetails;
