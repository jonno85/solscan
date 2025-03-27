import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import RecentBlocks from '../components/RecentBlocks';
import RecentTransactions from '../components/RecentTransactions';
import { fetchBlocks, fetchTransactions } from '../services/api';

function Home() {
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState([]);
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [blocksPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blocksRes, transactionsRes] = await Promise.all([
          fetchBlocks(currentPage, blocksPerPage),
          fetchTransactions(),
        ]);

        setBlocks(blocksRes.blocks);
        setTotalBlocks(blocksRes.totalBlocks);
        setTotalPages(blocksRes.totalPages);
        setTransactions(transactionsRes.transactions);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [blocksPerPage, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <RecentBlocks blocks={blocks} onPageChange={handlePageChange} currentPage={currentPage} totalPages={totalPages} />
      <RecentTransactions transactions={transactions} />
    </div>
  );
}

export default Home;
