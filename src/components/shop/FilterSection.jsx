import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function FilterSection({ title, options, selectedOptions, onChange, searchable = false, colorDots = false }) {
  const [isOpen, setIsOpen] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!options || options.length === 0) return null;

  const filteredOptions = searchable 
    ? options.filter(opt => opt.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  const visibleOptions = showAll ? filteredOptions : filteredOptions.slice(0, 5);
  const hasMore = filteredOptions.length > 5;

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      onChange(selectedOptions.filter(o => o !== option));
    } else {
      onChange([...selectedOptions, option]);
    }
  };

  const colorMap = {
    'Red': '#ef4444', 'Blue': '#3b82f6', 'Green': '#22c55e', 'Black': '#000000', 
    'White': '#ffffff', 'Yellow': '#eab308', 'Pink': '#ec4899', 'Purple': '#a855f7', 
    'Grey': '#6b7280', 'Brown': '#78350f', 'Navy': '#1e3a8a', 'Olive': '#4d7c0f', 
    'Beige': '#f5f5dc', 'Maroon': '#831843', 'Teal': '#0d9488', 'Neutral': '#a3a3a3'
  };

  return (
    <div className="border-b border-brand-100 py-4">
      <button 
        className="flex items-center justify-between w-full text-left font-semibold text-brand-950 mb-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm uppercase tracking-wider">{title}</span>
        {isOpen ? <ChevronUp size={16} className="text-brand-500" /> : <ChevronDown size={16} className="text-brand-500" />}
      </button>

      {isOpen && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {searchable && (
            <div className="relative mb-3">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-400" />
              <input 
                type="text" 
                placeholder={`Search ${title}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-brand-200 rounded-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          )}

          <ul className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
            {visibleOptions.map((option, idx) => (
              <li key={idx} className="flex items-center">
                <label className={cn(
                  "flex items-center space-x-3 cursor-pointer group w-full p-1.5 rounded-md transition-all duration-200 active:scale-95 hover:scale-[1.03] hover:shadow-sm",
                  selectedOptions.includes(option) ? "bg-brand-50" : "hover:bg-gray-50"
                )}>
                  <input 
                    type="checkbox" 
                    checked={selectedOptions.includes(option)}
                    onChange={() => toggleOption(option)}
                    className="w-4 h-4 accent-brand-950 border-brand-200 rounded-sm group-hover:border-brand-500 transition-colors"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    {colorDots && colorMap[option] && (
                      <span 
                        className="w-3 h-3 rounded-full border border-gray-200 shadow-sm"
                        style={{ backgroundColor: colorMap[option] }}
                      />
                    )}
                    <span className={cn(
                      "text-sm transition-colors truncate",
                      selectedOptions.includes(option) ? "text-brand-950 font-bold" : "text-brand-600 group-hover:text-brand-950"
                    )}>
                      {option}
                    </span>
                  </div>
                </label>
              </li>
            ))}
            {filteredOptions.length === 0 && (
              <li className="text-xs text-brand-400 italic">No matches found</li>
            )}
          </ul>

          {hasMore && !searchQuery && (
            <button 
              onClick={() => setShowAll(!showAll)}
              className="text-xs font-semibold text-brand-950 hover:text-brand-500 underline underline-offset-2 transition-colors mt-2"
            >
              {showAll ? '- Show Less' : `+ ${filteredOptions.length - 5} More`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
