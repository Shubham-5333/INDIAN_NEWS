import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, LogOut, ExternalLink, User, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Topbar = ({ onToggleMobile, isMobileOpen }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-20 px-4 lg:px-8 py-3 flex items-center justify-between shadow-md font-sans">
      <div className="flex items-center gap-4">
        {/* Mobile Drawer Hamburger Toggle */}
        <button
          onClick={onToggleMobile}
          className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>System Online • Port 5001</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors font-semibold uppercase tracking-wider"
        >
          <span>Public Site</span>
          <ExternalLink size={14} />
        </a>

        <div className="h-4 w-px bg-slate-800"></div>

        {/* Admin User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-900 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center font-bold text-xs">
              <User size={16} />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-white leading-none">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">@{user?.username || 'admin'}</p>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in">
              <div className="px-4 py-2 border-b border-slate-800 md:hidden">
                <p className="text-xs font-semibold text-white">{user?.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">@{user?.username}</p>
              </div>

              <Link
                to="/admin/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Shield size={14} />
                <span>Admin Profile</span>
              </Link>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/60 transition-colors border-t border-slate-800"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
