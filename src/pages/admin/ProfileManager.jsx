import React, { useState, useEffect } from 'react';
import { api, getAdminUser, setAdminUser } from '../../api/client';
import { UserCheck, Key, Save, Shield, CheckCircle } from 'lucide-react';

export const ProfileManager = () => {
  const [admin, setAdmin] = useState(null);

  // Profile Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getProfile();
        setAdmin(data);
        setName(data.name || '');
        setEmail(data.email || '');
        setUsername(data.username || '');
      } catch (err) {
        const localUser = getAdminUser();
        if (localUser) {
          setName(localUser.name || '');
          setEmail(localUser.email || '');
          setUsername(localUser.username || '');
        }
      }
    };

    fetchProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    try {
      const res = await api.updateProfile({ name, email, username });
      setAdminUser(res);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      setProfileError(err.message || 'Profile update failed');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match');
      return;
    }

    try {
      await api.changePassword({ currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err.message || 'Password update failed');
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-4xl">
      {/* Header */}
      <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <UserCheck className="text-red-500" size={24} />
          <span>Administrator Profile & Security</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Manage admin credentials and account password security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info Form */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-3 flex items-center gap-2">
            <Shield size={18} className="text-blue-400" />
            <span>Admin Details</span>
          </h2>

          {profileSuccess && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle size={16} />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {profileError && (
            <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-lg">
              {profileError}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider shadow-md transition-colors"
            >
              Update Profile Details
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-3 flex items-center gap-2">
            <Key size={18} className="text-amber-400" />
            <span>Change Password</span>
          </h2>

          {passwordSuccess && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle size={16} />
              <span>Password changed successfully!</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-lg">
              {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-2">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs uppercase tracking-wider shadow-md transition-colors"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
