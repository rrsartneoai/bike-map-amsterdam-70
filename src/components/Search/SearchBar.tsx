
import { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Bike } from 'lucide-react';
import { SearchResult } from '@/types';
import { searchLocations } from '@/lib/api';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSelect: (result: SearchResult) => void;
}

const SearchBar = ({ onSelect }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Handle search input changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        try {
          const searchResults = await searchLocations(query);
          console.log('Search results:', searchResults); // Debug search results
          setResults(searchResults);
          setIsOpen(searchResults.length > 0);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);
    
    return () => clearTimeout(delayDebounceFn);
  }, [query]);
  
  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle result selection
  const handleResultSelect = (result: SearchResult) => {
    console.log('Selected search result:', result); // Debug selected result
    onSelect(result);
    setQuery(result.name);
    setIsOpen(false);
  };
  
  // Clear search
  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };
  
  return (
    <div className="search-container max-w-md mx-auto px-4 pt-16 z-[1002] relative">
      <div className="relative w-full">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-muted-foreground" />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="w-full py-3 pl-10 pr-10 bg-background/90 backdrop-blur-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            placeholder="Search for bike rentals in Amsterdam..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setIsOpen(true)}
          />
          {query && (
            <button
              className="absolute inset-y-0 right-0 flex items-center pr-3 transition-opacity hover:text-primary"
              onClick={handleClear}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Search results dropdown */}
        {isOpen && (
          <div
            ref={resultsRef}
            className="absolute z-50 w-full mt-1 bg-card/95 backdrop-blur-md border rounded-lg shadow-lg overflow-hidden"
          >
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="flex justify-center items-center">
                  <div className="loader w-5 h-5"></div>
                </div>
              </div>
            ) : results.length > 0 ? (
              <ul className="max-h-60 overflow-auto">
                {results.map((result) => (
                  <li key={result.id}>
                    <button
                      className="w-full px-4 py-3 text-left hover:bg-accent/60 transition-colors flex items-start gap-3"
                      onClick={() => handleResultSelect(result)}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {result.type === 'bikeRental' ? (
                          <Bike className="w-5 h-5 text-green-500" />
                        ) : (
                          <MapPin className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{result.name}</p>
                        {result.address && (
                          <p className="text-sm text-muted-foreground truncate">
                            {result.address}
                          </p>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : query.length >= 2 ? (
              <div className="p-4 text-center text-muted-foreground">
                No results found
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
