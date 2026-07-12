import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import Vehicle from './pages/Vehicle';
import Driver from './pages/Driver';
import Trip from './pages/Trip';

const RoleBasedRedirect = () => {
  const { user } = useContext(AuthContext);
  
  if (user?.role === 'Fleet Manager') return <Navigate to="/vehicles" replace />;
  if (user?.role === 'Dispatcher') return <Navigate to="/trips" replace />;
  if (user?.role === 'Safety Officer') return <Navigate to="/drivers" replace />;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2 font-[cursive]">Welcome, {user?.name}!</h2>
      <p className="text-slate-500 max-w-md font-[cursive]">
        The dashboard and tools for <strong className="text-slate-700">{user?.role}s</strong> are currently being built by the backend team in another branch. Check back soon!
      </p>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<RoleBasedRedirect />} />
              <Route path="/vehicles" element={<Vehicle />} />
              <Route path="/drivers" element={<Driver />} />
              <Route path="/trips" element={<Trip />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
