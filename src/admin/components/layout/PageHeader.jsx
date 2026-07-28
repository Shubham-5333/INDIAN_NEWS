import React from 'react';
import { Breadcrumb } from './Breadcrumb';

export const PageHeader = ({ title, description, icon: Icon, actions }) => {
  return (
    <div className="mb-6 font-sans">
      <Breadcrumb />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-md">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            {Icon && <Icon className="text-red-500" size={24} />}
            <span>{title}</span>
          </h1>
          {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
        </div>

        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
};
