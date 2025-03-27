import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Block from './pages/Block';
import Transaction from './pages/Transaction';
import Account from './pages/Account';
import Token from './pages/Token';

const socket = io('http://localhost:5001', { transports: ['websocket'] });

function App() {
  React.useEffect(() => {
    // Listen for real-time updates
    socket.on('newBlocks', (data) => {
      console.log('New blocks indexed:', data);
      // Could trigger a refresh of data here
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <div className="d-flex flex-column min-h-100">
        <Header />
        <main className="flex-grow-1">
          <div className="container">
            <div className="max-w-5xl rounded mx-auto rounded-lg shadow-lg bg-white p-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/block/:slot" element={<Block />} />
                <Route path="/tx/:signature" element={<Transaction />} />
                <Route path="/address/:address" element={<Account />} />
                <Route path="/token/:mint" element={<Token />} />
              </Routes>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
