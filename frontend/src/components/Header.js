import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand fs-4 fw-bold">
        <img src="/logo192.png" alt="Blockchain Explorer Logo" width="50" height="50" className="me-2" />
        <span>Blockchain Explorer</span></Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/validators" className="nav-link">Validators</Link>
            </li>
          </ul>

          <SearchBar
            onSearch={(value, type) => {
              console.log('Search:', value, type);
              if (type === 'block') {
                navigate(`/block/${value}`);
              } else if (type === 'tx') {
                navigate(`/tx/${value}`);
              } else if (type === 'address') {
                navigate(`/address/${value}`);
              }
            }}
          />
        </div>
      </div>
    </nav>
  );
}

export default Header;
