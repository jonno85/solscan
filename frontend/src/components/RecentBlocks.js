import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import { fetchBlocks } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

const RecentBlocks = () => {
  const [blocks, setBlocks] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [totalPagesBlock, setTotalPagesBlock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const blocksPerPage = 10;

  const handlePageChange = (newPage) => setPage(newPage);

  const handleRefresh = async () => {
    setIsRefreshing(true);
      try {
        const blocksRes = await fetchBlocks(page, blocksPerPage);
        setBlocks(blocksRes.blocks);
        setTotalPagesBlock(blocksRes.totalPages);
      } catch (error) {
        console.error('Error refreshing blocks:', error);
      } finally {
        setIsRefreshing(false);
      }
    };

  useEffect(() => {
    const fetchBlocksData = async () => {
      setLoading(true);
      try {
        const blocksRes = await fetchBlocks(page, blocksPerPage);
        setBlocks(blocksRes.blocks);
        setTotalPagesBlock(blocksRes.totalPages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching block data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlocksData();
  }, [page]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="mb-5 mt-5 ml-2 mr-2 rounded shadow">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h3 mb-4 ms-2 flex-grow-1">Recent Blocks</h2>
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
              <th scope="col">Slot</th>
              <th scope="col">Hash</th>
              <th scope="col">Time</th>
              <th scope="col">Transactions</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) => (
              <tr key={block.slot}>
                <td>
                  <Link to={`/block/${block.slot}`} className="link-primary">
                    {block.slot}
                  </Link>
                </td>
                <td>{block.blockhash}</td>
                <td>{new Date(block.blockTime * 1000).toLocaleString()}</td>
                <td>{block.transactionCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPagesBlock > 1 && (
        <Pagination
          activePage={page}
          itemsCountPerPage={blocksPerPage}
          totalItemsCount={totalPagesBlock}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
        />
      )}
    </section>
  );
};

export default RecentBlocks;
