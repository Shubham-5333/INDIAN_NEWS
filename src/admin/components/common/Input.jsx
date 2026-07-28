import React from 'react';

export const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error,
  required = false,
  disabled = false,
  icon: Icon,
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
      <div className="relative">
        {Icon && <Icon size={18} className="absolute left-3.5 top-2.5 text-slate-400" />}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full bg-slate-900 border text-white rounded-lg py-2 text-sm focus:outline-none transition-colors ${
            Icon ? 'pl-10 pr-4' : 'px-4'
          } ${
            error
              ? 'border-red-500 focus:border-red-400'
              : 'border-slate-700 focus:border-red-500'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-slate-400">{helperText}</p>}
    </div>
  );
};
