import React from 'react';

function Instructions({ instructions }) {
  if (!instructions || instructions.length === 0) {
    return <p>No instructions found.</p>;
  }

  const formatData = (data) => {
    return Array.from(data)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join(' ');
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3 className="h5">Instructions</h3>
      </div>
      <div className="card-body">
        {instructions.map((instruction, index) => (
          <div key={index} className="mb-3">
            <h4 className="h6">Instruction {index + 1}</h4>
            <dl className="row">
              <dt className="col-sm-3">Program</dt>
              <dd className="col-sm-9 font-monospace">{instruction.programId}</dd>

              <dt className="col-sm-3">Data</dt>
              <dd className="col-sm-9 font-monospace break-all">
                {formatData(instruction.data)}</dd>

              <dt className="col-sm-3">Accounts</dt>
              <dd className="col-sm-9">
                <ul>
                  {instruction.accounts.map((account, accIndex) => (
                    <li key={accIndex} className="font-monospace">{account}</li>
                  ))}
                </ul>
              </dd>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Instructions;
