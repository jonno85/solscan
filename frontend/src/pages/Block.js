import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import CopyableText from '../components/CopyableText';
import { fetchBlockBySlot } from '../services/api';
import { shortenSignature } from '../utils/helpers';

function Block() {
  const { slot } = useParams();
  const [loading, setLoading] = useState(true);
  const [block, setBlock] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlock = async () => {
      try {
        setLoading(true);
        const response = await fetchBlockBySlot(slot);
        setBlock(response);
        setError(null);
      } catch (error) {
        console.error('Error fetching block:', error);
        setError(error.response?.data?.error || 'Failed to fetch block data');
      } finally {
        setLoading(false);
      }
    };

    fetchBlock();
  }, [slot]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );

  }

  return (
    <div>
      <div className="card mb-4 mt-2 shadow">
        <div className="card-header">
          <h2 className="h4">Block #{block.slot}</h2>
        </div>
        <div className="card-body">
          <dl className="row">
            <dt className="col-sm-3">Slot</dt>
            <dd className="col-sm-9">{block.slot}</dd>

            <dt className="col-sm-3">Blockhash</dt>
            <dd className="col-sm-9 font-monospace"><CopyableText text={block.blockhash} /></dd>

            <dt className="col-sm-3">Parent Slot</dt>
            <dd className="col-sm-9">
              <Button to={`/block/${block.parentSlot}`} className="btn btn-link">{block.parentSlot}</Button>
            </dd>

            <dt className="col-sm-3">Block Time</dt>
            <dd className="col-sm-9">{new Date(block.blockTime * 1000).toLocaleString()}</dd>

            <dt className="col-sm-3">Transaction Count</dt>
            <dd className="col-sm-9">{block.transactionCount}</dd>
          </dl>
        </div>
      </div>

      <div className="card mb-6 shadow">
        <h3 className="h5 mb-4 ms-2">Transactions ({block.transactions?.length || 0})</h3>
        {block.transactions && block.transactions.length > 0 ? (
          <div className="table-responsive"> {/* Bootstrap responsive table */}
            <table className="table table-striped table-hover"> {/* Bootstrap table styles */}
              <thead>
                <tr>
                  <th>Signature</th>
                  <th>Status</th>
                  <th>Fee (SOL)</th>
                </tr>
              </thead>
              <tbody>
                {block.transactions.map((tx) => (
                  <tr key={tx.signature}>
                    <td><Button to={`/tx/${tx.signature}`} className="btn btn-link">{shortenSignature(tx.signature)}</Button></td>
                    <td>
                      <span className={`badge ${tx.status === 'success' ? 'bg-success' : 'bg-danger'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td>{(tx.fee / 1000000000).toFixed(9)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-info" role="alert">No transactions in this block</div>
        )}
      </div>
    </div>
  );
}

export default Block;
