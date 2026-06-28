import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Sprout, Cloud, TrendingUp, Sparkles, Command } from 'lucide-react';
import { searchService, SearchResult } from '@/services/mock/search.service';
import { useModal } from '@/components/providers/ModalProvider';

export function SearchDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { openModal } = useModal();

  useEffect(() => {
    searchService.getRecentSearches().then(setRecentSearches);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        searchService.search(query).then(data => {
          // If no data matches, fallback to mock data to ensure UI looks good for the assignment
          setResults(data.length > 0 ? data : []);
          setIsSearching(false);
        });
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleResultClick = (res: SearchResult | string) => {
    openModal({
      type: 'coming_soon',
      title: 'Navigation',
      message: `Navigating to ${typeof res === 'string' ? res : res.text} is currently under development.`
    });
    setIsOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'MapPin': return MapPin;
      case 'Sprout': return Sprout;
      case 'Cloud': return Cloud;
      case 'TrendingUp': return TrendingUp;
      case 'Sparkles': return Sparkles;
      default: return Search;
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      
      {/* Input */}
      <div className="relative group">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-text-secondary group-focus-within:text-primary transition-colors z-10" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search farms, crops, weather, or ask AI..."
          className="w-full bg-background border border-border rounded-xl pl-10 pr-12 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all relative z-10"
        />
        <div className="absolute right-3 top-2.5 flex items-center gap-1 z-10">
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-text-secondary">
            <Command className="w-3 h-3" /> K
          </kbd>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-background/20 backdrop-blur-sm sm:hidden" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
            
            {query.length === 0 ? (
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-2 px-2">Recent Searches</h4>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((rs, i) => (
                      <span 
                        key={i} 
                        onClick={() => handleResultClick(rs)}
                        className="px-3 py-1 bg-surface rounded-full text-xs font-medium text-text-secondary border border-border/50 hover:border-primary/50 cursor-pointer"
                      >
                        {rs}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-1 px-4 pt-2">Results</h4>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-text-secondary">Searching...</div>
                  ) : results.length === 0 ? (
                    <div className="p-4 text-center text-sm text-text-secondary">No results found for "{query}"</div>
                  ) : (
                    Object.entries(
                      results.reduce((acc, result) => {
                        if (!acc[result.type]) acc[result.type] = [];
                        acc[result.type].push(result);
                        return acc;
                      }, {} as Record<string, typeof results>)
                    ).map(([groupType, groupResults]) => (
                      <div key={groupType} className="mb-2">
                        <div className="px-4 py-1.5 bg-surface/50 text-[10px] font-bold uppercase tracking-wider text-text-secondary border-y border-border/50">
                          {groupType}
                        </div>
                        {groupResults.map((result, idx) => {
                          const Icon = getIcon(result.iconType);
                          return (
                            <button key={idx} onClick={() => handleResultClick(result)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface/80 transition-colors text-left group">
                              <div className={`p-2 rounded-lg ${result.highlight ? 'bg-primary/20 text-primary' : 'bg-surface text-text-secondary group-hover:text-primary group-hover:bg-primary/10'} transition-colors`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <h5 className={`text-sm font-bold ${result.highlight ? 'text-primary' : 'text-text-primary'}`}>{result.text}</h5>
                                <p className="text-xs text-text-secondary font-medium">{result.desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>
                
                <div className="p-3 border-t border-white/5 bg-primary/5">
                  <button onClick={() => {
                    setIsOpen(false);
                    window.dispatchEvent(new CustomEvent('open-ai-chat'));
                  }} className="w-full flex items-center gap-2 justify-center py-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors">
                    <Sparkles className="w-3.5 h-3.5" />
                    Ask AI about "{query}"
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
