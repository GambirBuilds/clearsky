import React, { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { useLocation } from '../../hooks/useLocation';

/**
 * Search input with live suggestion popover for Nepal locations
 */
export function SearchInput({
  placeholder = 'Search Nepal cities (e.g. Kathmandu, Pokhara)...',
  className = '',
  onSelectCity
}) {
  const { searchQuery, setSearchQuery, filteredLocations, setSelectedLocation } = useLocation();
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

  const handleSelect = (loc) => {
    setSelectedLocation(loc);
    if (onSelectCity) onSelectCity(loc);
    setSearchQuery('');
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-2 text-xs md:text-sm bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Suggestion Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-64 overflow-y-auto z-50 py-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
            Suggested Nepal Municipalities
          </div>
          {filteredLocations.length > 0 ? (
            filteredLocations.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleSelect(loc)}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between text-xs transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <div>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{loc.name}</span>
                    <span className="text-slate-400 ml-1.5 font-normal">({loc.nepaliName})</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400">{loc.province}</span>
              </button>
            ))
          ) : (
            <div className="px-3 py-4 text-center text-xs text-slate-400">
              No matching Nepal municipality found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
