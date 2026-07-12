import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { authApi } from '../../services/authApi';
import { X } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Dispatcher');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authApi.login({ email, password, role });
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0b1120] text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <img src="/favicon.svg" alt="TransitOps Logo" className="w-14 h-14 drop-shadow-lg" />
            <h1 className="text-4xl font-extrabold tracking-tight">Transit<span className="font-light text-slate-300">Ops</span></h1>
          </div>
          <p className="text-slate-400 text-base font-medium tracking-wide">Smart Transport Operations Platform</p>
          
          <div className="mt-24">
            <h3 className="text-lg font-semibold mb-6 text-slate-200">One login, four roles:</h3>
            <ul className="space-y-4">
              {['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'].map(r => (
                <li key={r} className="flex items-center gap-4 text-base font-medium text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="text-xs text-slate-500 font-semibold uppercase tracking-widest relative z-10">
          TRANSITOPS © 2026 • RBAC ENABLED
        </div>
      </div>

      {/* Right Panel - Login Form with Attractive Background */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-slate-50">
        
        {/* Unique Attractive Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <svg className="absolute left-0 top-0 h-full w-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="bg-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e0e7ff" />
                <stop offset="100%" stopColor="#f3e8ff" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#bg-grad-1)" />
            <circle cx="20" cy="80" r="40" fill="#bae6fd" filter="blur(30px)" opacity="0.6"/>
            <circle cx="80" cy="20" r="30" fill="#ddd6fe" filter="blur(30px)" opacity="0.6"/>
            <circle cx="90" cy="90" r="25" fill="#fbcfe8" filter="blur(30px)" opacity="0.5"/>
          </svg>
        </div>

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

          {/* Glassmorphic Login Card */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 sm:p-10">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 text-sm mb-8 font-medium">Enter your credentials to continue</p>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium text-slate-700 transition-all hover:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@transitops.in"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium text-slate-700 transition-all hover:bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role (RBAC)</label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-semibold text-slate-700 transition-all hover:bg-white appearance-none cursor-pointer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="Fleet Manager">Fleet Manager</option>
                    <option value="Dispatcher">Dispatcher</option>
                    <option value="Safety Officer">Safety Officer</option>
                    <option value="Financial Analyst">Financial Analyst</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 font-semibold cursor-pointer">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full flex justify-center py-3.5 px-4 mt-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
              <p className="font-semibold text-xs text-slate-500 mb-3 uppercase tracking-wider">Access Scope Reference</p>
              <ul className="space-y-2 text-[13px] font-medium text-slate-600">
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></div><span className="font-bold text-slate-700">Fleet Manager:</span> Fleet, Maintenance</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></div><span className="font-bold text-slate-700">Dispatcher:</span> Dashboard, Trips</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></div><span className="font-bold text-slate-700">Safety Officer:</span> Drivers, Compliance</li>
                <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></div><span className="font-bold text-slate-700">Financial Analyst:</span> Fuel & Expenses, Analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
