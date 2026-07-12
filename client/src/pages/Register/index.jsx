import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { authApi } from '../../services/authApi';
import { X } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Driver');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authApi.register({ email, password, role });
      // Log them in immediately after successful registration
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to register account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex w-full font-sans bg-slate-900">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-between p-12 lg:p-16">
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <img src="/favicon.svg" alt="TransitOps Logo" className="w-10 h-10" />
            <h1 className="text-3xl font-bold tracking-tight">TransitOps</h1>
          </div>
          <p className="text-slate-400 text-lg">Smart Transport Operations Platform</p>
          
          <div className="mt-24">
            <div className="grid gap-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Real-time Operations</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Monitor your entire fleet, track active trips, and manage dispatching with zero latency.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Advanced Analytics</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Make data-driven decisions with comprehensive financial reporting and performance metrics.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-slate-500 font-semibold uppercase tracking-widest">
          TRANSITOPS © 2026 • RBAC ENABLED
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 relative overflow-y-auto overflow-x-hidden bg-slate-50">
        
        {/* Premium Tech Background: Dot Grid & Animated Glows */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-400/20 blur-[100px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-purple-400/20 blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="w-full max-w-[440px] relative z-10">
          
          {error && (
            <div className="absolute -top-4 -right-2 lg:-right-12 lg:-top-16 w-72 bg-red-50/90 backdrop-blur-md border border-red-200 rounded-2xl p-4 shadow-lg z-20 animate-fade-in text-sm text-red-600 font-medium">
              <div className="text-xs text-red-500 font-bold uppercase tracking-wider mb-1">Error state</div>
              <div className="flex gap-3 items-start">
                <X className="w-5 h-5 text-red-600 shrink-0 mt-0.5 bg-red-100 rounded-full p-0.5" strokeWidth={3} />
                <p className="text-sm leading-snug">{error}</p>
              </div>
            </div>
          )}

          {/* Premium Floating Card */}
          <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-3xl p-8 sm:p-10 relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.2)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

            <h2 className="text-3xl font-extrabold text-slate-800 mb-1 tracking-tight">Create account</h2>
            <p className="text-slate-500 text-sm mb-8 font-medium">Register for a new TransitOps account</p>
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@transitops.in"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength="6"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Your Role</label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 appearance-none cursor-pointer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="Fleet Manager">Fleet Manager</option>
                    <option value="Driver">Driver</option>
                    <option value="Safety Officer">Safety Officer</option>
                    <option value="Financial Analyst">Financial Analyst</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-blue-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full flex justify-center py-4 px-4 mt-8 border border-transparent rounded-xl shadow-xl shadow-blue-500/20 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-sm font-semibold text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
