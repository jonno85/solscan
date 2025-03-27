import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!searchValue.trim()) {
      setIsLoading(false);
      return;
    }

    let type;
    try {
      if (/^\d+$/.test(searchValue)) {
        type = 'block';
      } else if (searchValue.length === 64) {
        type = 'tx';
      } else if (searchValue.length === 44) {
        type = 'address';
      } else {
        type = 'address';
      }

      await onSearch(searchValue, type);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError('Search failed. Please try again.');
      console.error("Search error:", err);
    }
  };

  const handleClear = () => {
    setSearchValue('');
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex">
      <input
        type="text"
        placeholder="Search by block, transaction, address..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="form-control me-2"
      />
      {isLoading ? (
        <button className="btn btn-primary" type="button" disabled>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Loading...
        </button>
      ) : (
        <>
          <button type="submit" className="btn btn-primary">Search</button>
          <button type="button" onClick={handleClear} className="btn btn-secondary ms-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
            </svg>
          </button>
        </>
      )}
      {error && <div className="text-danger text-sm ms-2">{error}</div>}
    </form>
  );
}

export default SearchBar;
