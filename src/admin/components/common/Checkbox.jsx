import React from 'react';

export const Checkbox = ({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  className = '',
}) => {
  return (
    <label className={`flex items-center gap-2 cursor-pointer text-xs font-semibold uppercase text-slate-300 ${className}`}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-red-600 focus:ring-0 accent-red-600"
      />
      <span>{label}</span>
    </label>
  );
};
