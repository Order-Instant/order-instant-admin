import React from 'react';
import { BrowserRouter, Route, Routes, Navigate, Outlet, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Nav from './components/Nav';
import Packages from './pages/Packages';
import Update from './pages/Update';
import Login from './pages/Login';

const ProtectedRoute = () => {
  const isValid = localStorage.getItem('valid_admin') === 'true';
  const location = useLocation();

  if (!isValid && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        {/* Login route is public */}
        <Route path="/login" element={<Login />} />

        {/* All other routes protected */}
        <Route element={<ProtectedRoute />}>
          <Route index path="/" element={<Home />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/update/:packageId" element={<Update />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
