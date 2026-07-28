import React from 'react';

export const Loader = ({ label = 'Loading...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-slate-400 font-sans">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mb-3"></div>
      <span className="text-xs uppercase tracking-wider font-semibold">{label}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
