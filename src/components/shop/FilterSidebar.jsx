import React from 'react';
import FilterSection from './FilterSection';
import { RotateCcw, Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function FilterSidebar({ 
  availableFilters, 
  activeFilters, 
  onFilterChange, 
  onClearAll 
}) {
  
  const hasActiveFilters = Object.values(activeFilters).some(val => 
    (Array.isArray(val) && val.length > 0) || 
    (typeof val === 'number' && val > 0 && val !== 50000)
  );

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-950">Refine By</h3>
        {hasActiveFilters && (
          <button 
            onClick={onClearAll}
            className="flex items-center text-[10px] font-bold text-red-600 hover:text-red-700 transition-colors uppercase tracking-widest"
          >
            <RotateCcw size={12} className="mr-1.5" />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-2">
        {/* Price Filter */}
        <div className="py-6 border-b border-brand-50">
          <h4 className="text-[10px] font-black tracking-[0.2em] uppercase mb-6 text-brand-950">Price Range</h4>
          <div className="space-y-6 px-1">
            <div className="relative h-2 bg-brand-50 rounded-full">
              <input 
                type="range" 
                className="absolute w-full h-full opacity-0 cursor-pointer z-10" 
                min="0" 
                max="50000" 
                step="500"
                value={activeFilters.priceMax}
                onChange={(e) => onFilterChange('priceMax', parseInt(e.target.value))}
              />
              <div 
                className="absolute h-full bg-brand-950 rounded-full transition-all duration-300" 
                style={{ width: `${(activeFilters.priceMax / 50000) * 100}%` }}
              />
              <div 
                className="absolute w-5 h-5 bg-white border-4 border-brand-950 rounded-full shadow-lg -top-1.5 -translate-x-1/2 transition-all duration-300 pointer-events-none"
                style={{ left: `${(activeFilters.priceMax / 50000) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100">
                 <span className="text-[10px] font-bold text-brand-400 block uppercase">Min</span>
                 <span className="text-xs font-black text-brand-950">₹0</span>
              </div>
              <div className="bg-brand-950 px-3 py-1.5 rounded-lg shadow-lg">
                 <span className="text-[10px] font-bold text-brand-400 block uppercase">Max</span>
                 <span className="text-xs font-black text-white">₹{activeFilters.priceMax >= 50000 ? '50,000+' : activeFilters.priceMax.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <FilterSection 
          title="Brand" 
          options={availableFilters.brands} 
          selectedOptions={activeFilters.brands}
          onChange={(val) => onFilterChange('brands', val)}
          searchable
        />
        


        {/* Rating Filter Custom */}
        {availableFilters.ratings && availableFilters.ratings.length > 0 && (
          <div className="py-6 border-b border-brand-50">
            <h4 className="text-[10px] font-black tracking-[0.2em] uppercase mb-4 text-brand-950">Customer Reviews</h4>
            <div className="space-y-2">
              {[4, 3, 2, 1].map(rating => (
                <label key={rating} className="flex items-center space-x-3 cursor-pointer group p-2 rounded-xl hover:bg-brand-50 transition-colors">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="radio" 
                      name="rating"
                      checked={activeFilters.minRating === rating}
                      onChange={() => onFilterChange('minRating', rating)}
                      className="w-5 h-5 opacity-0 absolute cursor-pointer z-10"
                    />
                    <div className={cn(
                      "w-5 h-5 border-2 rounded-full transition-all flex items-center justify-center",
                      activeFilters.minRating === rating ? "border-brand-950 bg-brand-950" : "border-brand-200"
                    )}>
                      {activeFilters.minRating === rating && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-brand-950">{rating}★ & Up</span>
                    <div className="flex gap-0.5">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} size={10} className={cn(i < rating ? "fill-brand-950 text-brand-950" : "fill-brand-50 text-brand-100")} />
                       ))}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
