import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/get-all-packages`);
        if (!response.ok) throw new Error('Failed to fetch packages');
        const data = await response.json();
        setPackages(data);
      } catch (error) {
        console.error('Failed to fetch packages:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Function to determine latest status
  const getLatestStatus = (pkg) => {
    const statusTimeline = [
      { status: 'Cancelled', date: pkg.cancelledDateTime },
      { status: 'Delivered', date: pkg.deliveredDateTime },
      { status: 'Departed', date: pkg.departedDateTime },
      { status: 'Picked Up', date: pkg.pickedUpDataTime },
      { status: 'Processing', date: pkg.processingDateTime },
    ].filter(item => item.date);

    if (statusTimeline.length === 0) return { status: 'Created', date: pkg.createdAt };

    // Sort by date descending and get most recent
    const latest = statusTimeline.sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    )[0];

    return latest;
  };

  // Function to get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'success';
      case 'Cancelled': return 'danger';
      case 'Processing': return 'info';
      case 'Picked Up': return 'primary';
      case 'Departed': return 'warning';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          {error}
        </div>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Package Management</h2>
      </div>

      {packages.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
          <h4>No packages found</h4>
        </div>
      ) : (
        <div className="row g-4">
          {packages.map((pkg) => {
            const latestStatus = getLatestStatus(pkg);
            const statusColor = getStatusColor(latestStatus.status);
            
            return (
              <div className="col-md-6 col-xl-4" key={pkg._id}>
                <div className="card shadow-sm h-100">
                  <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <small className="text-muted">#{pkg._id.slice(-6)}</small>
                    <span className={`badge bg-${statusColor}-subtle text-${statusColor}`}>
                      {latestStatus.status}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="flex-grow-1">
                        <h6 className="mb-1">
                          <i className="fas fa-user me-2 text-primary"></i>
                          {pkg.senderFullName}
                        </h6>
                        <small className="text-muted">Sender</small>
                      </div>
                      <i className="fas fa-arrow-right mx-2 text-muted"></i>
                      <div className="flex-grow-1 text-end">
                        <h6 className="mb-1">
                          <i className="fas fa-user me-2 text-success"></i>
                          {pkg.receiverFullName}
                        </h6>
                        <small className="text-muted">Receiver</small>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">Type:</small>
                        <span className="fw-medium">{pkg.packageType}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <small className="text-muted">Last Update:</small>
                        <span className="fw-medium">
                          {latestStatus.date ? format(parseISO(latestStatus.date), 'PPpp') : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <Link 
                        to={`${import.meta.env.VITE_CLIENT_IP}/package/${pkg._id}`} 
                        className="btn btn-sm btn-outline-secondary"
                      >
                        <i className="fas fa-eye me-1"></i> Details
                      </Link>
                      <Link
                        to={`/update/${pkg._id}`}
                        className="btn btn-sm btn-primary"
                      >
                        <i className="fas fa-edit me-1"></i> Update
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Packages;