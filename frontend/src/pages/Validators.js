import React, { useState, useEffect } from 'react';
import { fetchValidators } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ValidatorCard from '../components/ValidatorCard';
import Pagination from 'react-js-pagination';

const Validators = () => {
  const [validators, setValidators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalValidators, setTotalValidators] = useState(0);
  const perPage = 9;

  useEffect(() => {
    const fetchValidatorsData = async () => {
      setLoading(true);
      try {
        const validatorsData = await fetchValidators(page, perPage);
        setValidators(validatorsData.validators);
        setTotalValidators(validatorsData.totalValidators);
        setError(null);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching validators data:', error);
        setError('Failed to load validators data. Please try again later.');
        setLoading(false);
      }
    };

    fetchValidatorsData();
  }, [page]);

  const handlePageChange = (newPage) => setPage(newPage);

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="h2 mb-4">Validators</h1>
      {!validators || validators.length === 0 ? (
        <div className="text-center py-8">
          <span role="img" className="large-emoji" aria-label="No validators found">
            😶‍🌫️
          </span>
          <p className="mt-3 text-muted">No validators found.</p>
        </div>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {validators.map((validator) => (
              <div key={validator.identity} className="col">
                <ValidatorCard validator={validator} />
              </div>
            ))}
          </div>
          {totalValidators > perPage && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination
                activePage={page}
                itemsCountPerPage={perPage}
                totalItemsCount={totalValidators}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
                itemClass="page-item"
                linkClass="page-link"
              />
            </div>
          )}
        </>
      )}
      {loading && <LoadingSpinner />}
    </div>
  );
};

export default Validators;
