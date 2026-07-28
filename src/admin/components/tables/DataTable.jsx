import React from 'react';
import { SkeletonLoader } from '../common/SkeletonLoader';
import { EmptyState } from '../common/EmptyState';

export const DataTable = ({
  columns = [], // Array of { key, header, render, align }
  data = [],
  loading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items matching your criteria.',
}) => {
  if (loading) {
    return <SkeletonLoader rows={5} type="table" />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-md font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300 border-collapse">
          <thead className="bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`py-3.5 px-4 ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60">
            {data.map((row, rowIdx) => (
              <tr key={row._id || row.id || rowIdx} className="hover:bg-slate-700/40 transition-colors">
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`py-3.5 px-4 ${
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                    }`}
                  >
                    {col.render ? col.render(row, rowIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
