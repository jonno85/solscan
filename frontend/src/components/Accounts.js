import React from 'react';

function Accounts({ accounts }) {
  if (!accounts || accounts.length === 0) {
    return <p>No accounts found.</p>;
  }

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3 className="h5">Account Inputs</h3>
      </div>
      <div className="card-body">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Index</th>
              <th scope="col">Address</th>
              <th scope="col">Signer</th>
              <th scope="col">Writable</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => (
              <tr key={index}>
                <td>{index}</td>
                <td className="font-monospace">{account}</td>
                <td>{account.signer ? 'Yes' : 'No'}</td>
                <td>{account.writable ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Accounts;
