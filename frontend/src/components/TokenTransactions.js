import React from 'react';
import { Link } from 'react-router-dom';

const TokenTransactions = ({ transactions, token }) => {
  if (transactions.length === 0) {
    return <div className="text-center py-8">No transactions found for this token.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-striped table-hover"> {/* Bootstrap table */}
        <thead>
          <tr>
            <th scope="col">Signature</th>
            <th scope="col">Block</th>
            <th scope="col">Time</th>
            <th scope="col">From</th>
            <th scope="col">To</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.signature}>
              <td>
                <Link to={`/tx/${tx.signature}`} className="link-primary font-monospace">
                  {tx.signature.substring(0, 8)}...{tx.signature.substring(tx.signature.length - 8)}
                </Link>
              </td>
              <td>
                <Link to={`/block/${tx.blockNumber}`} className="link-primary">
                  {tx.blockNumber}
                </Link>
              </td>
              <td>{new Date(tx.timestamp).toLocaleString()}</td>
              <td>
                <Link to={`/account/${tx.fromAddress}`} className="link-primary font-monospace">
                  {tx.fromAddress.substring(0, 8)}...{tx.fromAddress.substring(tx.fromAddress.length - 8)}
                </Link>
              </td>
              <td>
                <Link to={`/account/${tx.toAddress}`} className="link-primary font-monospace">
                  {tx.toAddress.substring(0, 8)}...{tx.toAddress.substring(tx.toAddress.length - 8)}
                </Link>
              </td>
              <td>
                {(tx.amount / Math.pow(10, token?.decimals || 0)).toLocaleString()} {token?.symbol}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TokenTransactions;
