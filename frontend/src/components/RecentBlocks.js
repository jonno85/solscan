import React from 'react';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';

const RecentBlocks = ({ blocks, onPageChange, currentPage, totalPages }) => {
  
  return (
    <section className="mb-5 mt-5 ml-2 mr-2 rounded shadow">
      <h2 className="h3 mb-4 ms-2">Recent Blocks</h2>
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
      <Pagination
        activePage={currentPage}
        itemsCountPerPage={10}
        totalItemsCount={totalPages}
        onChange={onPageChange}
        itemClass="page-item"
        linkClass="page-link"
      />
    </section>
  );
};

export default RecentBlocks;
