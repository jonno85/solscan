import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import { fetchTransactions } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalPagesTransactions, setTotalPagesTransactions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const transactionsPerPage = 10;

  const handlePageChange = (newPage) => setPage(newPage);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const transactionsRes = await fetchTransactions(page, transactionsPerPage);
        setTransactions(transactionsRes.transactions);
        setLoading(false);
        setTotalPagesTransactions(transactionsRes.totalPages);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const transactionsRes = await fetchTransactions(page, transactionsPerPage);
      setTransactions(transactionsRes.blocks);
      setTotalPagesTransactions(transactionsRes.totalPages);
      setIsRefreshing(false);
    } catch (error) {
      console.error('Error refreshing blocks:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="mb-5 mt-5 ml-2 mr-2 rounded shadow">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h3 mb-4 ms-2 flex-grow-1">Recent Transactions</h2>
        <button className="btn btn-primary btn-lg" onClick={handleRefresh} disabled={isRefreshing}>
          {isRefreshing ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            <i className="bi bi-arrow-clockwise"></i>
          )}
        </button>
      </div>
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
                  <span className="me-2">
                    {tx.status === 'success' ? '✅' : '⚠️'}
                  </span>
                  <Link to={`/tx/${tx.signature}`} className="link-primary font-monospace">
                    {tx.signature.substring(0, 24)}...
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
      {totalPagesTransactions > 1 && (
        <Pagination
          activePage={page}
          itemsCountPerPage={10}
          totalItemsCount={totalPagesTransactions}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
        />
      )}
    </section>
  );
};

export default RecentTransactions;
