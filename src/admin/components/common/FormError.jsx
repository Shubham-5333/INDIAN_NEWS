import React from 'react';
import { AlertCircle } from 'lucide-react';

export const FormError = ({ message }) => {
  if (!message) return null;

  return (
    <div className="p-4 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-lg flex items-start gap-3 font-sans">
      <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
};
