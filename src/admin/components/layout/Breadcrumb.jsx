import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x && x !== 'admin');

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-sans mb-4 uppercase tracking-wider">
      <Link to="/admin/dashboard" className="flex items-center gap-1 hover:text-white transition-colors">
        <Home size={12} />
        <span>Admin</span>
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/admin/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight size={12} className="text-slate-600" />
            {isLast ? (
              <span className="font-bold text-white uppercase">{name.replace('-', ' ')}</span>
            ) : (
              <Link to={routeTo} className="hover:text-white transition-colors uppercase">
                {name.replace('-', ' ')}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
