import React, { useState, useEffect } from 'react';
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
import { api, formatImageUrl } from './api/client.js';

// Dedicated Admin Router import
import { AdminAppRoutes } from './admin/routes/AdminRoutes.jsx';

function PublicApp() {
  const [activePage, setActivePage] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleLoading, setArticleLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareArticle, setShareArticle] = useState(null);

  // Load only categories fetched from DB
  useEffect(() => {
    api.getCategories()
      .then((res) => {
        if (Array.isArray(res)) {
          const names = res.map((c) => (typeof c === 'string' ? c : c.name)).filter(Boolean);
          setCategories(['All', ...names]);
        }
      })
      .catch((err) => {
        console.error('Failed to load categories:', err);
      });
  }, []);

  // Check URL on mount or back/forward navigation for ?article=<id>
  useEffect(() => {
    const checkUrlForArticle = () => {
      const params = new URLSearchParams(window.location.search);
      const articleId = params.get('article');
      if (articleId) {
        setArticleLoading(true);
        setActivePage('article');
        api.getNewsById(articleId)
          .then((res) => {
            const item = res?.news || res;
            if (item && (item._id || item.id)) {
              setSelectedArticle({
                ...item,
                id: item._id || item.id,
                imageUrl: formatImageUrl(item.featuredImage || item.imageUrl || ''),
              });
            }
          })
          .catch((err) => {
            console.error('Failed to load shared article:', err);
          })
          .finally(() => {
            setArticleLoading(false);
          });
      }
    };

    checkUrlForArticle();

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const articleId = params.get('article');
      if (articleId) {
        checkUrlForArticle();
      } else {
        setActivePage('home');
        setSelectedArticle(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToPage = (pageName) => {
    setActivePage(pageName);
    if (pageName !== 'article') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('article')) {
        url.searchParams.delete('article');
        window.history.pushState({}, '', url.pathname);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (article) => {
    setSelectedArticle(article);
    setActivePage('article');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const artId = article?.id || article?._id;
    if (artId) {
      const url = new URL(window.location.href);
      url.searchParams.set('article', artId);
      window.history.pushState({}, '', url.toString());
    }
  };

  const handleBackFromArticle = () => {
    setActivePage('home');
    setSelectedArticle(null);
    const url = new URL(window.location.href);
    if (url.searchParams.has('article')) {
      url.searchParams.delete('article');
      window.history.pushState({}, '', url.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
    navigateToPage('video');
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    navigateToPage('search');
  };

  const handleOpenShare = (article) => {
    setShareArticle(article);
    setIsShareOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans pb-16 md:pb-0 overflow-x-hidden">
      {/* Header */}
      <Header
        activePage={activePage}
        setActivePage={navigateToPage}
        onSelectCategory={handleSelectCategory}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenSearch={() => {
          setSelectedCategory('All');
          navigateToPage('search');
        }}
      />

      {/* Navigation Drawer Modal */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        setActivePage={navigateToPage}
        onSelectCategory={handleSelectCategory}
        categories={categories}
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
            availableCategories={categories}
            onSelectArticle={handleSelectArticle}
            onShare={handleOpenShare}
          />
        )}

        {activePage === 'article' && (
          <ArticlePage
            article={selectedArticle}
            loading={articleLoading}
            onBack={handleBackFromArticle}
            onSelectArticle={handleSelectArticle}
            onShare={handleOpenShare}
          />
        )}
      </div>

      {/* Footer */}
      <Footer
        setActivePage={navigateToPage}
        categories={categories}
        onSelectCategory={handleSelectCategory}
        onOpenSearch={() => {
          setSelectedCategory('All');
          navigateToPage('search');
        }}
      />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activePage={activePage}
        setActivePage={navigateToPage}
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
