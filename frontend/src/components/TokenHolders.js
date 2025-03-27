import React from 'react';
import { Link } from 'react-router-dom';

const TokenHolders = ({ holders, token }) => {
  if (holders.length === 0) {
    return <div className="text-center py-8">No holders found for this token.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-striped table-hover"> {/* Bootstrap table */}
        <thead>
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">Address</th>
            <th scope="col">Balance</th>
            <th scope="col">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {holders.map((holder, index) => (
            <tr key={holder.address}>
              <td>{index + 1}</td>
              <td>
                <Link to={`/account/${holder.address}`} className="link-primary font-monospace">
                  {holder.address.substring(0, 8)}...{holder.address.substring(holder.address.length - 8)}
                </Link>
              </td>
              <td>
                {(holder.balance / Math.pow(10, token?.decimals || 0)).toLocaleString()} {token?.symbol}
              </td>
              <td>{((holder.balance / token?.supply) * 100).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TokenHolders;
