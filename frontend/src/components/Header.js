import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

function Header() {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand fs-4 fw-bold">
        <img src="/logo192.png" alt="Blockchain Explorer Logo" width="50" height="50" className="me-2" />
        <span>Blockchain Explorer</span></Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

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
    </nav>
  );
}

export default Header;
