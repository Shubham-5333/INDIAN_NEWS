import React, { useState } from 'react';
import { api, setAuthToken, setAdminUser } from '../../api/client';
import { ShieldCheck, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

export const AdminLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.login(username, password);
      if (response.token) {
        setAuthToken(response.token);
        setAdminUser({
          id: response._id,
          username: response.username,
          name: response.name,
          email: response.email,
          role: response.role,
        });
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-slate-800/90 border border-slate-700 rounded-xl shadow-2xl p-8 backdrop-blur-sm relative overflow-hidden">
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-amber-500"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600/20 text-red-500 mb-4 border border-red-500/30">
            <ShieldCheck size={36} />
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-white">INDIAN NEWS</h1>
          <p className="text-slate-400 text-sm mt-1">Admin Portal Authentication</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-950/60 border border-red-800/80 rounded-lg flex items-start gap-3 text-red-300 text-sm">
            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Info Box */}
        <div className="mb-6 p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg text-xs text-slate-400 flex justify-between items-center">
          <div>
            <span className="font-semibold text-slate-300">Default Admin:</span> admin
          </div>
          <div>
            <span className="font-semibold text-slate-300">Password:</span> Admin@123
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Username
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full bg-slate-900 border border-slate-700 focus:border-red-500 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-slate-900 border border-slate-700 focus:border-red-500 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 tracking-wide uppercase text-sm transition-all shadow-lg shadow-red-600/30"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-700/60 pt-4">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/';
            }}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Public Website
          </a>
        </div>
      </div>
    </div>
  );
};
