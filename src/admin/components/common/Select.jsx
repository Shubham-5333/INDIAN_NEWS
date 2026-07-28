import React from 'react';

export const Select = ({
  label,
  name,
  value,
  onChange,
  options = [], // array of { value, label } or strings
  error,
  required = false,
  disabled = false,
  className = '',
  helperText,
  ...props
}) => {
  return (
    <div className={`space-y-1.5 font-sans ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full bg-slate-900 border text-white rounded-lg px-4 py-2 text-sm focus:outline-none transition-colors ${
          error
            ? 'border-red-500 focus:border-red-400'
            : 'border-slate-700 focus:border-red-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...props}
      >
        {options.map((opt, idx) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={idx} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-slate-400">{helperText}</p>}
    </div>
  );
};
