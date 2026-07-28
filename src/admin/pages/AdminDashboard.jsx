import React, { useEffect, useState } from 'react';
import { adminService } from '../services/settingsService';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/common/Button';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { FormError } from '../components/common/FormError';
import { StatusChip } from '../components/common/StatusChip';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Newspaper,
  Lightbulb,
  FolderTree,
  Clock,
  Plus,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data.stats);
      setRecentActivity(data.recentActivity || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <SkeletonLoader rows={4} type="card" />;
  }

  const statCards = [
    {
      title: 'Total News',
      value: stats?.totalNews || 0,
      sub: 'All News Articles',
      icon: Newspaper,
      color: 'from-red-600 to-rose-600',
      path: '/admin/news',
    },
    {
      title: 'Published Count',
      value: stats?.publishedNews || 0,
      sub: 'Live Articles',
      icon: Newspaper,
      color: 'from-emerald-600 to-green-600',
      path: '/admin/news',
    },
    {
      title: 'Draft Count',
      value: stats?.draftNews || 0,
      sub: 'Unpublished Drafts',
      icon: Newspaper,
      color: 'from-amber-600 to-yellow-600',
      path: '/admin/news',
    },
    {
      title: 'Total Facts',
      value: stats?.totalFacts || 0,
      sub: 'Fast Facts Database',
      icon: Lightbulb,
      color: 'from-blue-500 to-indigo-500',
      path: '/admin/facts',
    },
    {
      title: 'Total Categories',
      value: stats?.totalCategories || 0,
      sub: 'Active Taxonomies',
      icon: FolderTree,
      color: 'from-teal-500 to-cyan-500',
      path: '/admin/categories',
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Dashboard"
        description="CMS Overview for news stories, facts, and categories."
        icon={LayoutDashboard}
        actions={
          <Button icon={Plus} onClick={() => navigate('/admin/news/new')}>
            Create News
          </Button>
        }
      />

      <FormError message={error} />

      {/* Primary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => card.path && navigate(card.path)}
              className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-sm hover:border-slate-500 cursor-pointer transition-all flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</p>
                <h3 className="text-3xl font-extrabold text-white mt-1">{card.value}</h3>
                <p className="text-xs text-slate-400 mt-1">{card.sub}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-md`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent News Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock size={18} className="text-red-500" />
            <span>Recent News</span>
          </h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/admin/news')}>
            View All News →
          </Button>
        </div>

        {recentActivity.length === 0 ? (
          <p className="text-slate-400 text-sm py-4">No recent news found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/60 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {recentActivity.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-700/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-white max-w-md truncate">{item.title}</td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-900 text-slate-300 border border-slate-700 text-xs px-2 py-0.5 rounded font-semibold uppercase">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusChip status={item.status} />
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs">
                      {new Date(item.timestamp).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
