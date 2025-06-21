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