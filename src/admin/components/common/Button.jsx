import React from 'react';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary', // primary | secondary | danger | success | outline | ghost
  size = 'md', // sm | md | lg
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold tracking-wider uppercase transition-all rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-lg shadow-red-600/30',
    secondary: 'bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-200',
    danger: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-lg shadow-rose-600/30',
    success: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-lg shadow-emerald-600/30',
    outline: 'border border-slate-700 hover:border-slate-500 text-slate-200 hover:bg-slate-800',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-800',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs gap-2',
    lg: 'px-6 py-3 text-sm gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-1"></span>
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />
      ) : null}
      <span>{children}</span>
    </button>
  );
};
