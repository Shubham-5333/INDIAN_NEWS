import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Newspaper,
  Lightbulb,
  FolderTree,
  Image as ImageIcon,
  Settings,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const Sidebar = ({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) => {
  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/news', label: 'News Articles', icon: Newspaper },
    { path: '/admin/categories', label: 'Categories', icon: FolderTree },
    { path: '/admin/media', label: 'Media Library', icon: ImageIcon },
    { path: '/admin/settings', label: 'Site Settings', icon: Settings },
    { path: '/admin/profile', label: 'Admin Profile', icon: User },
  ];

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-30 bg-slate-950 border-r border-slate-800 transition-all duration-300 ease-in-out flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      } ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-600/30">
            <ShieldCheck size={24} />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="font-extrabold uppercase tracking-wider text-sm text-white block">INDIAN NEWS</span>
              <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded font-bold tracking-widest uppercase inline-block mt-0.5">
                ADMIN PANEL
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex items-center justify-center w-7 h-7 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav Menu Items */}
      <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto font-sans">
        {!isCollapsed && (
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">MAIN MENU</p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950 font-sans">
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400">
            <p className="font-semibold text-slate-300">Superadmin Session</p>
            <p className="text-[10px] text-slate-500 mt-0.5">JWT Token Encrypted</p>
          </div>
        </div>
      )}
    </aside>
  );
};
