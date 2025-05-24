import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container py-5">
      <h2 className="mb-5 text-center fw-bold">Admin Dashboard</h2>

      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 bg-light h-100">
            <div className="card-body text-center py-5">
              <div className="mb-3">
                <i className="fas fa-box-open fs-1 text-primary"></i>
              </div>
              <h5 className="card-title fw-bold mb-3">Manage Packages</h5>
              <p className="card-text text-muted mb-4 px-2">
                View, update, or delete shipping packages in the system with ease.
              </p>
              <Link to="/packages">
                <button className="btn btn-primary rounded-pill px-4 py-2 shadow-sm">
                  Go to Package Manager
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
