import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Vehicle from './pages/Vehicle';
import Driver from './pages/Driver';
import Trip from './pages/Trip';
import Maintenance from './pages/Maintenance';
import Fuel from './pages/Fuel';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ErrorBoundary } from 'react-error-boundary';
import GlobalErrorFallback from './components/GlobalErrorFallback';

function App() {
  return (
    <ErrorBoundary FallbackComponent={GlobalErrorFallback} onReset={() => window.location.replace('/')}>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/vehicles" element={<Vehicle />} />
              <Route path="/drivers" element={<Driver />} />
              <Route path="/trips" element={<Trip />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/fuel" element={<Fuel />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
