import React from 'react';
import RecentBlocks from '../components/RecentBlocks';
import RecentTransactions from '../components/RecentTransactions';

function Home() {
  
  return (
    <div>
      <RecentBlocks />
      <RecentTransactions />
    </div>
  );
}

export default Home;
