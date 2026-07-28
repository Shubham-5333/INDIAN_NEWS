import React from 'react';

export const ToggleSwitch = ({
  label,
  checked,
  onChange,
  disabled = false,
  activeColor = 'bg-red-600',
}) => {
  return (
    <div className="flex items-center justify-between font-sans">
      {label && <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? activeColor : 'bg-slate-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
