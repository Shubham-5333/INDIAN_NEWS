import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { FormError } from '../components/common/FormError';

export const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password);
      showToast('success', 'Logged in as administrator successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Invalid username or password.');
      showToast('error', err.message || 'Authentication error');
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
          <h1 className="text-2xl font-bold uppercase tracking-wider text-white">BREAKING HOURS</h1>
          <p className="text-slate-400 text-sm mt-1">Admin Portal Authentication</p>
        </div>

        {/* Error Alert */}
        <FormError message={error} />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Username"
            required
            icon={User}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter admin username"
          />

          <Input
            label="Password"
            type="password"
            required
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
          />

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            icon={ArrowRight}
            className="w-full py-3"
          >
            Sign In to Dashboard
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-slate-700/60 pt-4">
          <a href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Return to Public Website
          </a>
        </div>
      </div>
    </div>
  );
};
