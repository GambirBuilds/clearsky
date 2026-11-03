import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Reusable accessible dropdown menu
 */
export function Dropdown({
  trigger,
  items = [],
  value,
  onChange,
  className = '',
  align = 'right'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (item) => {
    if (onChange) onChange(item.value ?? item.id ?? item);
    setIsOpen(false);
  };

  const selectedItem = items.find(i => (i.value ?? i.id) === value);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      {trigger ? (
        <div onClick={() => setIsOpen(!isOpen)} role="button" tabIndex={0}>
          {typeof trigger === 'function' ? trigger({ isOpen, selectedItem }) : trigger}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors shadow-2xs cursor-pointer"
        >
          <span>{selectedItem?.label || selectedItem?.name || 'Select option'}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {isOpen && (
        <div
          className={`absolute z-40 mt-1 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1 focus:outline-none animate-in fade-in zoom-in-95 duration-100 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {items.map((item, idx) => {
            const itemVal = item.value ?? item.id;
            const isSelected = itemVal === value;
            return (
              <button
                key={itemVal || idx}
                onClick={() => handleSelect(item)}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="font-medium">{item.label || item.name}</div>
                  {item.description && (
                    <div className="text-[11px] text-slate-400 font-normal">{item.description}</div>
                  )}
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
