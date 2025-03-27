import React from 'react';
import { Link } from 'react-router-dom';
import { shortenAddress } from '../utils/helpers';

const AccountTransactionHistory = ({ transactions, formatTimestamp, loadMoreTransactions, transactionsLoading, hasMore }) => {
  if (!transactions || transactions.length === 0) {
    return <p>No transactions found for this account.</p>;
  }

  return (
    <div className="card mb-4">
      <div className="card-header">Transaction History</div>
      <div className="card-body">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Signature</th>
              <th>Block</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index}>
                <td>
                  <Link to={`/tx/${tx.signature}`} className="link-primary font-monospace">
                    {shortenAddress(tx.signature)}
                  </Link>
                </td>
                <td>
                  <Link to={`/block/${tx.slot}`} className="link-primary">
                    {tx.slot}
                  </Link>
                </td>
                <td>{formatTimestamp(tx.timestamp)}</td>
                <td>
                  {['confirmed', 'finalized', 'success'].includes(tx.status)  ? (
                    <span className="badge bg-success">Confirmed</span>
                  ) : (
                    <span className="badge bg-danger">Failed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {hasMore && (
          <div className="text-center mt-3">
            <button className="btn btn-primary" onClick={loadMoreTransactions} disabled={transactionsLoading}>
              {transactionsLoading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountTransactionHistory;
