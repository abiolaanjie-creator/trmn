import React, { useState } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  icon?: React.ReactNode;
  isTextArea?: boolean;
}

export const InputField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputFieldProps>(
  ({ label, icon, isTextArea, className = '', onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== null && props.value.toString().length > 0;

    // Determine state
    let stateClass = '';
    if (focused) {
      // Focused State - vibrant border, subtle active tint
      stateClass = 'border-violet-500/80 ring-2 ring-violet-500/10 bg-violet-50/5 dark:bg-violet-950/10 text-slate-800 dark:text-slate-100 shadow-sm';
    } else if (hasValue) {
      // Filled State - crisp solid border confidence, solid container
      stateClass = 'border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-900/90 text-slate-850 dark:text-slate-100 shadow-sm';
    } else {
      // Default / Normal State - subtle neutral borders
      stateClass = 'border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300';
    }

    const handleFocus = (e: any) => {
      setFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: any) => {
      setFocused(false);
      if (onBlur) onBlur(e);
    };

    return (
      <div className="space-y-1.5 w-full text-left">
        {label && (
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {icon && (
            <div className={`absolute left-3.5 pointer-events-none transition-colors duration-200 z-10 ${
              focused ? 'text-violet-500' : hasValue ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400'
            }`}>
              {icon}
            </div>
          )}
          
          {isTextArea ? (
            <textarea
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`w-full text-xs rounded-xl px-4 py-3 transition-all duration-200 border outline-none min-h-[90px] ${icon ? 'pl-10' : ''} ${stateClass} ${className}`}
            />
          ) : (
            <input
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={`w-full h-11 text-xs rounded-xl px-4 transition-all duration-200 border outline-none ${icon ? 'pl-10' : ''} ${stateClass} ${className}`}
            />
          )}

          {/* Filled state marker - a extremely subtle pill dot indicator */}
          {!focused && hasValue && (
            <div className="absolute right-3.5 flex items-center pointer-events-none animate-fade-in z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          )}
        </div>
      </div>
    );
  }
);

InputField.displayName = 'InputField';

interface SelectFieldProps {
  label?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}

export const SelectField = ({ label, icon, className = '', children, onFocus, onBlur, value, ...props }: SelectFieldProps) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  let stateClass = '';
  if (focused) {
    stateClass = 'border-violet-500/80 ring-2 ring-violet-500/10 bg-violet-50/5 dark:bg-violet-950/10 text-slate-800 dark:text-slate-100 shadow-sm';
  } else if (hasValue) {
    stateClass = 'border-slate-300 dark:border-slate-700/80 bg-white dark:bg-slate-900/90 text-slate-850 dark:text-slate-100 shadow-sm';
  } else {
    stateClass = 'border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30 text-slate-700 dark:text-slate-300';
  }

  return (
    <div className="space-y-1.5 w-full text-left">
      {label && (
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {icon && (
          <div className={`absolute left-3.5 pointer-events-none transition-colors duration-200 z-10 ${
            focused ? 'text-violet-500' : hasValue ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400'
          }`}>
            {icon}
          </div>
        )}
        <select
          {...props}
          value={value}
          onFocus={(e) => {
            setFocused(true);
            if (onFocus) onFocus(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            if (onBlur) onBlur(e);
          }}
          className={`w-full h-11 text-xs rounded-xl px-4 transition-all duration-200 border outline-none appearance-none cursor-pointer ${icon ? 'pl-10 relative pr-10' : 'pr-10'} ${stateClass} ${className}`}
        >
          {children}
        </select>
        <div className="absolute right-3.5 pointer-events-none text-slate-400 z-10">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
