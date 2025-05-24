import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [securityKey, setSecurityKey] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(false);

  const envKey = import.meta.env.VITE_SECURITY_KEY || '';

  const handleChange = (e) => {
    setSecurityKey(e.target.value);
    setError('');
    setIsValid(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (securityKey === envKey) {
      // Correct key: set localStorage and redirect
      localStorage.setItem('valid_admin', 'true');
      setIsValid(true);
      setError('');
      navigate('/');
    } else {
      // Wrong key: clear localStorage and show error
      localStorage.removeItem('valid_admin');
      setIsValid(false);
      setError('Invalid security key. Please try again.');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 position-relative">
          <label htmlFor="securityKey" className="form-label">
            Security Key
          </label>
          <input
            type="password"
            id="securityKey"
            className="form-control"
            value={securityKey}
            onChange={handleChange}
            placeholder="Enter security key"
            required
          />
          {isValid && (
            <strong
              style={{
                position: 'absolute',
                top: '38px',
                right: '12px',
                color: 'green',
                fontWeight: 'bold',
                userSelect: 'none',
              }}
            >
              valid_admin
            </strong>
          )}
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
