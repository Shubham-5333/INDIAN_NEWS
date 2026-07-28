import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { MobileNav } from './components/layout/MobileNav.jsx';
import { NavigationDrawer } from './components/layout/NavigationDrawer.jsx';
import { ShareModal } from './components/modals/ShareModal.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { VideoFeedPage } from './pages/VideoFeedPage.jsx';
import { SearchPage } from './pages/SearchPage.jsx';
import { ArticlePage } from './pages/ArticlePage.jsx';

// Dedicated Admin Router import
import { AdminAppRoutes } from './admin/routes/AdminRoutes.jsx';

function PublicApp() {
  const [activePage, setActivePage] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareArticle, setShareArticle] = useState(null);

  const handleSelectArticle = (article) => {
    setSelectedArticle(article);
    setActivePage('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
    setActivePage('video');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setActivePage('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenShare = (article) => {
    setShareArticle(article);
    setIsShareOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans pb-16 md:pb-0">
      {/* Header */}
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        onSelectCategory={handleSelectCategory}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenSearch={() => {
          setSelectedCategory('All');
          setActivePage('search');
        }}
      />

      {/* Navigation Drawer Modal */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        setActivePage={setActivePage}
        onSelectCategory={handleSelectCategory}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        article={shareArticle}
      />

      {/* Main Active View Page */}
      <div className="flex-1 flex flex-col">
        {activePage === 'home' && (
          <HomePage
            onSelectArticle={handleSelectArticle}
            onSelectCategory={handleSelectCategory}
            onSelectVideo={handleSelectVideo}
            onShare={handleOpenShare}
          />
        )}

        {activePage === 'video' && (
          <VideoFeedPage selectedVideo={selectedVideo} />
        )}

        {activePage === 'search' && (
          <SearchPage
            initialCategory={selectedCategory}
            onSelectArticle={handleSelectArticle}
            onShare={handleOpenShare}
          />
        )}

        {activePage === 'article' && (
          <ArticlePage
            article={selectedArticle}
            onBack={() => setActivePage('home')}
            onSelectArticle={handleSelectArticle}
            onShare={handleOpenShare}
          />
        )}
      </div>

      {/* Footer */}
      <Footer setActivePage={setActivePage} />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activePage={activePage}
        setActivePage={setActivePage}
        onSelectCategory={handleSelectCategory}
      />
    </div>
  );
}

export function App() {
  return (
    <Routes>
      {/* Admin Panel Frontend Sub-routes */}
      <Route path="/admin/*" element={<AdminAppRoutes />} />

      {/* Public React Website */}
      <Route path="/*" element={<PublicApp />} />
    </Routes>
  );
}

export default App;
