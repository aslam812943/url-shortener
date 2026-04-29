import React from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  register: UseFormRegisterReturn;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, type = 'text', placeholder, error, register, icon }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          {...register}
          className={`w-full bg-slate-800/50 border ${
            error ? 'border-red-500/50' : 'border-slate-700'
          } rounded-xl py-2.5 ${icon ? 'pl-10' : 'pl-4'} pr-4 text-slate-100 placeholder:text-slate-600 input-focus glass`}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-400 ml-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
