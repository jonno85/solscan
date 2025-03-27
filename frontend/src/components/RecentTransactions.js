import React from 'react';
import { Link } from 'react-router-dom';
import { shortenSignature } from '../utils/helpers';

const RecentTransactions = ({ transactions }) => {
  return (
    <section className="mb-5 ml-2 mr-2 rounded shadow">
      <h2 className="h3 mb-4 ms-2">Recent Transactions</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Signature</th>
              <th scope="col">Block</th>
              <th scope="col">Time</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.signature}>
                <td>
                  <Link to={`/tx/${tx.signature}`} className="link-primary font-monospace">
                    {shortenSignature(tx.signature)}
                  </Link>
                </td>
                <td>
                  <Link to={`/block/${tx.blockSlot}`} className="link-primary">
                    {tx.blockSlot}
                  </Link>
                </td>
                <td>{new Date(tx.blockTime * 1000).toLocaleString()}</td>
                <td>
                  <span
                    className={`badge ${tx.status === 'success' ? 'bg-success' : 'bg-danger'}`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentTransactions;
