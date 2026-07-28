import React from 'react';

export const Textarea = ({
  label,
  name,
  value,
  onChange,
  rows = 4,
  placeholder = '',
  error,
  required = false,
  disabled = false,
  className = '',
  helperText,
  fontMono = false,
  ...props
}) => {
  return (
    <div className={`space-y-1.5 font-sans ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full bg-slate-900 border text-white rounded-lg p-3 text-sm focus:outline-none transition-colors ${
          fontMono ? 'font-mono' : ''
        } ${
          error
            ? 'border-red-500 focus:border-red-400'
            : 'border-slate-700 focus:border-red-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-slate-400">{helperText}</p>}
    </div>
  );
};
