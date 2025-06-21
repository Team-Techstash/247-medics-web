"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { countryService } from '@/api/services/service';

interface SearchableCitySelectorProps {
  selectedCity: string;
  onCitySelect: (city: string) => void;
  onCityClear: () => void;
  countryCode: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  'aria-label'?: string;
}

type ComponentState = 'idle' | 'searching' | 'editing';

export default function SearchableCitySelector({
  selectedCity,
  onCitySelect,
  onCityClear,
  countryCode,
  placeholder = "City...",
  className = "",
  disabled = false,
  label,
  'aria-label': ariaLabel
}: SearchableCitySelectorProps) {
  const [state, setState] = useState<ComponentState>('idle');
  const [searchTerm, setSearchTerm] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isOpen = state === 'searching' || state === 'editing';
  const isEditing = state === 'editing';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setState('idle');
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search cities when search term changes
  useEffect(() => {
    if (!countryCode || !searchTerm.trim()) {
      setCities([]);
      return;
    }

    const searchCities = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await countryService.getCities(searchTerm, countryCode);
        setCities(response.data[0]?.cities || []);
      } catch (err: any) {
        setError('Failed to fetch cities. Please try again.');
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchCities, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, countryCode]);

  const handleCitySelect = useCallback((city: string) => {
    onCitySelect(city);
    setState('idle');
    setSearchTerm('');
  }, [onCitySelect]);

  const handleClear = useCallback(() => {
    onCityClear();
    setSearchTerm('');
    setState('idle');
  }, [onCityClear]);

  const handleInputFocus = useCallback(() => {
    if (!disabled && countryCode) {
      setState('searching');
    }
  }, [disabled, countryCode]);

  const handleSelectedCityClick = useCallback(() => {
    if (!disabled && countryCode) {
      setState('editing');
      setSearchTerm(selectedCity);
      // Focus the input after state change
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [disabled, countryCode, selectedCity]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setState('idle');
      setSearchTerm('');
    }
  }, []);

  // Memoized dropdown content to avoid duplication
  const dropdownContent = useMemo(() => {
    if (!isOpen || disabled || !countryCode || !searchTerm) return null;

    return (
      <div className="absolute z-50 w-full mt-1 bg-white border border-primary rounded-md shadow-lg max-h-60 overflow-auto">
        {error ? (
          <div className="p-3 text-red-600 text-sm" role="alert">{error}</div>
        ) : loading ? (
          <div className="p-3 text-gray-500 text-sm">Searching cities...</div>
        ) : cities.length === 0 ? (
          <div className="p-3 text-gray-500 text-sm">
            {searchTerm ? "No cities found" : ""}
          </div>
        ) : (
          <div role="listbox">
            {cities.map((city, index) => (
              <button
                key={`${city}-${index}`}
                onClick={() => handleCitySelect(city)}
                className="w-full text-left p-3 hover:bg-primary/[.1] border-b border-gray-100 last:border-b-0 focus:bg-primary/[.1] focus:outline-none"
                role="option"
                aria-selected={false}
              >
                <div className="text-gray-900 text-sm">{city}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }, [isOpen, disabled, countryCode, searchTerm, error, loading, cities, handleCitySelect]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {selectedCity && !isEditing ? (
        <div 
          className="flex items-center justify-between px-3 py-2 border border-primary rounded-md shadow-sm bg-white min-w-0 cursor-text"
          onClick={handleSelectedCityClick}
          role="button"
          tabIndex={0}
          aria-label={`Selected city: ${selectedCity}. Click to edit.`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSelectedCityClick();
            }
          }}
        >
          <div className="flex-1 min-w-0">
            <div className="text-gray-700 truncate">{selectedCity}</div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
            disabled={disabled}
            aria-label="Clear selected city"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            className="appearance-none block w-full px-3 py-2 pr-10 border border-primary rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary hover:bg-primary/[.1] text-gray-700 disabled:cursor-not-allowed"
            disabled={disabled || !countryCode}
            aria-label={ariaLabel || "Search for a city"}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            role="combobox"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" aria-label="Loading cities" />
            ) : (
              <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
            )}
          </div>
        </div>
      )}

      {dropdownContent}
    </div>
  );
} 