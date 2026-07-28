import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import { PageHeader } from '../components/layout/PageHeader';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { FormError } from '../components/common/FormError';
import { UserCheck, Shield, Key, LogOut } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateUserProfile, logout } = useAuth();
  const { showToast } = useToast();

  // Details state
  const [username, setUsername] = useState(user?.username || 'admin');
  const [name, setName] = useState(user?.name || 'Administrator');
  const [email, setEmail] = useState(user?.email || 'admin@indiannews.com');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    authService.getProfile().then((data) => {
      if (data) {
        setUsername(data.username || 'admin');
        setName(data.name || 'Administrator');
        setEmail(data.email || 'admin@indiannews.com');
      }
    }).catch(() => {});
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    try {
      setProfileSaving(true);
      const res = await authService.updateProfile({ username, name, email });
      updateUserProfile(res);
      showToast('success', 'Profile details updated successfully!');
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
      showToast('error', err.message || 'Profile error');
    } fontFinally: {
      setProfileSaving(false);
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
      setPasswordSaving(true);
      await authService.changePassword({ currentPassword, newPassword });
      showToast('success', 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Password update failed');
      showToast('error', err.message || 'Password error');
    } fontFinally: {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      <PageHeader
        title="Admin Profile & Account Settings"
        description="Manage administrator profile, update username, and configure account security password."
        icon={UserCheck}
        actions={
          <Button variant="danger" icon={LogOut} onClick={logout}>
            Sign Out
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Info Form */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-3 flex items-center gap-2">
            <Shield size={18} className="text-blue-400" />
            <span>Admin Account Details</span>
          </h2>

          <FormError message={profileError} />

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Input
              label="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              label="Display Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button type="submit" variant="primary" loading={profileSaving} className="w-full">
              Update Profile Details
            </Button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-3 flex items-center gap-2">
            <Key size={18} className="text-amber-400" />
            <span>Security & Password</span>
          </h2>

          <FormError message={passwordError} />

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Input
              label="New Password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimum 6 characters"
            />

            <Input
              label="Confirm New Password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
            />

            <Button type="submit" variant="success" loading={passwordSaving} className="w-full">
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
