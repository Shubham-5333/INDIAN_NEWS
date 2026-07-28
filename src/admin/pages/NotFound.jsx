import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound = () => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center text-slate-300 font-sans max-w-lg mx-auto my-12 shadow-2xl">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-950/60 border border-red-800 text-red-400 mb-4">
        <AlertCircle size={32} />
      </div>
      <h1 className="text-4xl font-extrabold text-white">404</h1>
      <h2 className="text-lg font-bold uppercase text-slate-200 mt-2">Admin Route Not Found</h2>
      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
        The admin panel page you are looking for does not exist or has been relocated.
      </p>
      <div className="mt-6">
        <Link to="/admin/dashboard">
          <Button variant="primary" icon={ArrowLeft}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
