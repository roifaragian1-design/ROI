import React, { useState, useRef, useEffect, createContext, useContext } from 'react';

const SelectContext = createContext(null);

export function Select({ value, onValueChange, children }) {
  const [open, setOpen] = useState(false);
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className = '', children }) {
  const { open, setOpen } = useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => setOpen(o => !o)}
      className={`inline-flex items-center justify-between px-3 border border-gray-200 rounded-md text-sm focus:outline-none ${className}`}
    >
      {children}
      <svg className={`w-4 h-4 ml-1 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
      </svg>
    </button>
  );
}

export function SelectValue({ placeholder }) {
  const { value } = useContext(SelectContext);
  return <span>{value || placeholder}</span>;
}

export function SelectContent({ children }) {
  const { open, setOpen } = useContext(SelectContext);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, setOpen]);

  if (!open) return null;
  return (
    <div
      ref={ref}
      className="absolute z-50 mt-1 min-w-full bg-white border border-gray-200 rounded-md shadow-lg py-1"
    >
      {children}
    </div>
  );
}

export function SelectItem({ value, children }) {
  const { value: selected, onValueChange, setOpen } = useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => { onValueChange(value); setOpen(false); }}
      className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 ${selected === value ? 'font-semibold bg-gray-50' : ''}`}
    >
      {children}
    </button>
  );
}
