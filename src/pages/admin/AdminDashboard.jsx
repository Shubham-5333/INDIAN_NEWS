import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { Newspaper, Lightbulb, FolderTree, Users, Eye, Image as ImageIcon, TrendingUp, Clock, Plus } from 'lucide-react';

export const AdminDashboard = ({ setActiveTab }) => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data.stats);
      setRecentActivity(data.recentActivity || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mr-3"></div>
        <span>Loading dashboard statistics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-950/40 border border-red-800 rounded-xl text-red-300">
        <p>{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded bg-sm font-semibold text-xs uppercase tracking-wider"
        >
          Retry
        </button>
      </div>
    );
  }

  const statCards = [
    { title: 'Total News Articles', value: stats?.totalNews || 0, sub: `${stats?.publishedNews || 0} published, ${stats?.draftNews || 0} drafts`, icon: Newspaper, color: 'from-blue-600 to-indigo-600', tab: 'news' },
    { title: 'Facts & Trivia', value: stats?.totalFacts || 0, sub: 'Active fact database entries', icon: Lightbulb, color: 'from-amber-500 to-orange-600', tab: 'facts' },
    { title: 'News Categories', value: stats?.totalCategories || 0, sub: 'Organized content tags', icon: FolderTree, color: 'from-emerald-500 to-teal-600', tab: 'categories' },
    { title: 'Total Article Views', value: stats?.totalViews ? stats.totalViews.toLocaleString() : 0, sub: 'Cumulative reader engagement', icon: Eye, color: 'from-purple-600 to-pink-600' },
    { title: 'Media Library Assets', value: stats?.totalMedia || 0, sub: 'Uploaded images & graphics', icon: ImageIcon, color: 'from-cyan-600 to-blue-700', tab: 'media' },
    { title: 'Admin Users', value: stats?.totalAdmins || 1, sub: 'Superadmin accounts', icon: Users, color: 'from-red-600 to-rose-700', tab: 'profile' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span>Dashboard Overview</span>
            <span className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Live System</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage news stories, facts, categories, media, and site configuration.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab('news')}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs uppercase tracking-wider rounded-lg shadow-md transition-colors"
          >
            <Plus size={16} />
            <span>Create News</span>
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => card.tab && setActiveTab(card.tab)}
              className={`bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md hover:shadow-xl transition-all ${
                card.tab ? 'cursor-pointer hover:border-slate-500' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</p>
                  <h3 className="text-3xl font-extrabold text-white mt-2">{card.value}</h3>
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <TrendingUp size={12} className="text-emerald-400" />
                    <span>{card.sub}</span>
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-md`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock size={20} className="text-red-500" />
            <span>Recent Content Updates</span>
          </h2>
          <button
            onClick={() => setActiveTab('news')}
            className="text-xs font-semibold text-red-400 hover:text-red-300 uppercase tracking-wider"
          >
            View All News →
          </button>
        </div>

        {recentActivity.length === 0 ? (
          <p className="text-slate-400 text-sm py-4">No recent activity logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/60 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {recentActivity.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-700/40 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-white max-w-md truncate">{item.title}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-slate-900 text-slate-300 border border-slate-700 text-xs px-2.5 py-1 rounded font-semibold uppercase">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded font-semibold uppercase tracking-wider border ${
                          item.status === 'published'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                            : 'bg-amber-950/60 text-amber-400 border-amber-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono">{item.views.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs">
                      {new Date(item.timestamp).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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
