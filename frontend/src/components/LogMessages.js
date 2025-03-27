import React from 'react';

function LogMessages({ logMessages }) {
  if (!logMessages || logMessages.length === 0) {
    return null;
  }

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3 className="h5">Log Messages</h3>
      </div>
      <div className="card-body">
        <pre className="bg-dark text-light p-3 rounded overflow-auto">
          {logMessages.join('\n')}
        </pre>
      </div>
    </div>
  );
}

export default LogMessages;
