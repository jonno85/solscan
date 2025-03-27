import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Link } from 'react-router-dom';
import { formatRentEpoch } from '../utils/helpers';

const AccountOverview = ({ account, copyToClipboard, formatBalance, copied }) => {

  return (
    <div className="card mb-4">
      <div className="card-header">Overview</div>
      <div className="card-body">
        <div className="row">
          <div className="col-sm-3">Address</div>
          <div className="col-sm-9">
            <CopyToClipboard text={account.address} onCopy={() => copyToClipboard(account.address)}>
              <div className="d-flex align-items-center">
                <span className="font-monospace break-all flex-grow-1">{account.address}</span>
                <button className="btn btn-sm btn-outline-secondary ms-2">
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </CopyToClipboard>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-3">Balance</div>
          <div className="col-sm-9">{formatBalance(account.lamports)}</div>
        </div>
        <div className="row">
          <div className="col-sm-3">Executable</div>
          <div className="col-sm-9">{account.executable ? 'Yes' : 'No'}</div>
        </div>
        <div className="row">
          <div className="col-sm-3">Rent Epoch</div>
          <div className="col-sm-9">{formatRentEpoch(account.rentEpoch) || 'N/A'}</div>
        </div>
        <div className="row">
          <div className="col-sm-3">Owner</div>
          <div className="col-sm-9">
            <Link 
              to={`/account/${account.owner}`}
              className="text-blue-600 hover:text-blue-800"
            >
              {account.owner}
            </Link>
            </div>
        </div>
        <div className="row">
          <div className="col-sm-3">Data Size</div>
          <div className="col-sm-9">{account.length} bytes</div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
