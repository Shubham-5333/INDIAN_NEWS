import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { AdminLayout } from '../components/layout/AdminLayout';
import { AdminLogin } from '../pages/AdminLogin';
import { AdminDashboard } from '../pages/AdminDashboard';
import { NewsList } from '../pages/news/NewsList';
import { NewsForm } from '../pages/news/NewsForm';
import { FactsList } from '../pages/facts/FactsList';
import { CategoriesPage } from '../pages/categories/CategoriesPage';
import { MediaLibraryPage } from '../pages/media/MediaLibraryPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { NotFound } from '../pages/NotFound';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

const PublicLoginRoute = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <AdminLogin />;
};

export const AdminAppRoutes = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public Login Route */}
          <Route path="/" element={<PublicLoginRoute />} />

          {/* Protected Admin Routes inside AdminLayout Shell */}
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="news" element={<NewsList />} />
            <Route path="news/new" element={<NewsForm />} />
            <Route path="news/edit/:id" element={<NewsForm />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="media" element={<MediaLibraryPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
};
