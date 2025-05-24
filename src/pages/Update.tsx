import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

const Update = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    lastKnownLocation: '',
    estimatedDeliveryTime: '',
    processingDateTime: '',
    pickedUpDataTime: '',
    departedDateTime: '',
    deliveredDateTime: '',
    cancelledDateTime: '',
  });

  // Field configuration with validation
  const fields = [
    { 
      key: 'lastKnownLocation', 
      label: 'Last Known Location', 
      icon: 'fas fa-map-marker-alt',
      type: 'text',
    },
    { 
      key: 'estimatedDeliveryTime', 
      label: 'Estimated Delivery Time', 
      icon: 'fas fa-clock',
      type: 'datetime-local',
      validate: (value) => new Date(value) > new Date()
    },
    { 
      key: 'processingDateTime', 
      label: 'Processing Date Time', 
      icon: 'fas fa-cog',
      type: 'datetime-local',
      validate: (value) => !form.departedDateTime || new Date(value) < new Date(form.departedDateTime)
    },
    { 
      key: 'pickedUpDataTime', 
      label: 'Picked Up Date Time', 
      icon: 'fas fa-hand-paper',
      type: 'datetime-local',
      validate: (value) => !form.processingDateTime || new Date(value) > new Date(form.processingDateTime)
    },
    { 
      key: 'departedDateTime', 
      label: 'Departed Date Time', 
      icon: 'fas fa-truck',
      type: 'datetime-local',
      validate: (value) => !form.deliveredDateTime || new Date(value) < new Date(form.deliveredDateTime)
    },
    { 
      key: 'deliveredDateTime', 
      label: 'Delivered Date Time', 
      icon: 'fas fa-box-open',
      type: 'datetime-local',
      validate: (value) => !form.cancelledDateTime || !value
    },
    { 
      key: 'cancelledDateTime', 
      label: 'Cancelled Date Time', 
      icon: 'fas fa-ban',
      type: 'datetime-local',
      validate: (value) => !form.deliveredDateTime || !value
    },
  ];

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_IP}/get-package/${packageId}`);
        if (!res.ok) throw new Error('Package not found');
        
        const data = await res.json();
        setPkg(data);
        
        // Format dates for datetime-local inputs
        const formattedData = {};
        fields.forEach(field => {
          if (field.type === 'datetime-local' && data[field.key]) {
            formattedData[field.key] = format(parseISO(data[field.key]), "yyyy-MM-dd'T'HH:mm");
          } else {
            formattedData[field.key] = data[field.key] || '';
          }
        });
        
        setForm(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching package:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPackage();
  }, [packageId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    for (const field of fields) {
      if (field.required && !form[field.key]) {
        return `${field.label} is required`;
      }
      if (field.validate && form[field.key] && !field.validate(form[field.key])) {
        return `${field.label} is invalid`;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_IP}/update-package/${packageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Update failed');
      }

      setSuccess(true);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || 'Update failed');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3">Loading package details...</span>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          Package not found or you don't have permission to view it
        </div>
        <Link to="/packages" className="btn btn-primary mt-3">
          Back to Packages
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-0">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h6 className="mb-0">
                  <i className="fas fa-box me-2 text-primary"></i>
                  Update Package #{packageId}
                </h6>
                <div className="btn-group">
                  <Link 
                    to={`${import.meta.env.VITE_CLIENT_IP}/track/${packageId}`} 
                    className="btn btn-outline-info"
                    target="_blank"
                  >
                    <i className="fas fa-search me-2"></i>
                    Track Package
                  </Link>
                  <Link 
                    to={`${import.meta.env.VITE_CLIENT_IP}/package/${packageId}`} 
                    className="btn btn-outline-secondary"
                  >
                    <i className="fas fa-eye me-2"></i>
                    View Details
                  </Link>
                </div>
              </div>
            </div>

            <div className="card-body">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setError(null)}
                  ></button>
                </div>
              )}

              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  Package updated successfully!
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {fields.map(({ key, label, icon, type, required }) => (
                    <div className="col-md-6" key={key}>
                      <div className="form-floating">
                        <input
                          type={type}
                          id={key}
                          name={key}
                          value={form[key]}
                          onChange={handleChange}
                          className={`form-control ${error?.includes(label) ? 'is-invalid' : ''}`}
                          placeholder={label}
                          required={required}
                        />
                        <label htmlFor={key}>
                          <i className={`${icon} me-2`}></i>
                          {label} {required && <span className="text-danger">*</span>}
                        </label>
                        {error?.includes(label) && (
                          <div className="invalid-feedback">
                            {error}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="col-12 mt-4">
                    <div className="d-flex justify-content-between">
                      <Link to="/packages" className="btn btn-outline-secondary">
                        <i className="fas fa-arrow-left me-2"></i>
                        Cancel
                      </Link>
                      <button type="submit" className="btn btn-primary px-4">
                        <i className="fas fa-save me-2"></i>
                        Update Package
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Update;