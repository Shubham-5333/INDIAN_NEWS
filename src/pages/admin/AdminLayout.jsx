import React, { useState } from 'react';
import { getAdminUser, removeAuthToken, removeAdminUser } from '../../api/client';
import { AdminDashboard } from './AdminDashboard';
import { NewsManager } from './NewsManager';
import { FactsManager } from './FactsManager';
import { CategoryManager } from './CategoryManager';
import { MediaManager } from './MediaManager';
import { SettingsManager } from './SettingsManager';
import { ProfileManager } from './ProfileManager';
import {
  LayoutDashboard,
  Newspaper,
  Lightbulb,
  FolderTree,
  Image as ImageIcon,
  Settings,
  User,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';

export const AdminLayout = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const adminUser = getAdminUser() || { name: 'Administrator', username: 'admin' };

  const handleLogoutClick = () => {
    removeAuthToken();
    removeAdminUser();
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/admin';
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'news', label: 'News Management', icon: Newspaper },
    { id: 'facts', label: 'Facts & Trivia', icon: Lightbulb },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 px-4 lg:px-8 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span className="font-extrabold uppercase tracking-wider text-base text-white">INDIAN NEWS</span>
              <span className="ml-2 text-[10px] bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded font-bold tracking-widest uppercase">
                ADMIN PANEL
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/';
            }}
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
          >
            <span>View Public Site</span>
            <ExternalLink size={14} />
          </a>

          <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-white">{adminUser.name}</p>
              <p className="text-[10px] text-slate-400 font-mono">@{adminUser.username}</p>
            </div>

            <button
              onClick={handleLogoutClick}
              className="p-2 text-slate-400 hover:text-red-400 bg-slate-900 hover:bg-red-950/50 rounded-lg border border-slate-800 hover:border-red-900/60 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-950 border-r border-slate-800 transform ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } transition-transform duration-200 ease-in-out flex flex-col`}
        >
          <div className="p-4 space-y-1 flex-1 overflow-y-auto pt-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">NAVIGATION</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-800/80 bg-slate-950">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400">
              <p className="font-semibold text-slate-300">Logged in as Superadmin</p>
              <p className="text-[10px] text-slate-500 mt-0.5">JWT Session Active</p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-900">
          {activeTab === 'dashboard' && <AdminDashboard setActiveTab={setActiveTab} />}
          {activeTab === 'news' && <NewsManager />}
          {activeTab === 'facts' && <FactsManager />}
          {activeTab === 'categories' && <CategoryManager />}
          {activeTab === 'media' && <MediaManager />}
          {activeTab === 'settings' && <SettingsManager />}
          {activeTab === 'profile' && <ProfileManager />}
        </main>
      </div>
    </div>
  );
};
