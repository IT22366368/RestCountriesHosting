import { useState, useEffect, useRef } from 'react';
import { 
  MagnifyingGlassIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FunnelIcon,
  GlobeAmericasIcon,
  UsersIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
const populationFilters = [
  { label: 'Any population', value: '' },
  { label: 'Less than 1M', value: 'lt1m' },
  { label: '1M to 10M', value: '1m-10m' },
  { label: '10M to 100M', value: '10m-100m' },
  { label: 'More than 100M', value: 'gt100m' }
];

const SearchAndFilter = ({ 
  onSearch, 
  onRegionFilter, 
  onPopulationFilter, 
  disabled = false,
  currentFilters = { search: '', region: '', population: '' }
}) => {
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');
  const [selectedRegion, setSelectedRegion] = useState(currentFilters.region || '');
  const [selectedPopulation, setSelectedPopulation] = useState(currentFilters.population || '');
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [isPopulationDropdownOpen, setIsPopulationDropdownOpen] = useState(false);
  const regionDropdownRef = useRef(null);
  const populationDropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Update local state when props change
  useEffect(() => {
    setSearchTerm(currentFilters.search || '');
    setSelectedRegion(currentFilters.region || '');
    setSelectedPopulation(currentFilters.population || '');
  }, [currentFilters]);

  // Handle search with debounce
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      onSearch(value);
    }, 300);
  };
  
  // Clear the timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target)) {
        setIsRegionDropdownOpen(false);
      }
      if (populationDropdownRef.current && !populationDropdownRef.current.contains(event.target)) {
        setIsPopulationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRegionFilter = (region) => {
    setSelectedRegion(region);
    setIsRegionDropdownOpen(false);
    onRegionFilter(region);
  };

  const handlePopulationFilter = (filter) => {
    setSelectedPopulation(filter);
    setIsPopulationDropdownOpen(false);
    onPopulationFilter(filter);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearchChange(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    onSearch(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    onSearch('');
  };

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="sm:w-2/3 lg:w-3/4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search for a country..."
              className={`w-full pl-12 pr-10 py-3 rounded-lg shadow-sm bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                disabled ? 'opacity-75 cursor-not-allowed bg-gray-50' : 'hover:border-gray-300'
              }`}
              value={searchTerm}
              onChange={handleSearchInputChange}
              disabled={disabled}
            />
            {/* Search Icon */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            
            {/* Clear Search Button */}
            {searchTerm && !disabled && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </form>
        </div>

        {/* Filter Container */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-1/2 lg:w-3/5 justify-end">
          {/* Region Filter */}
          <div className="relative w-full sm:w-48" ref={regionDropdownRef}>
            <button
              type="button"
              onClick={() => !disabled && setIsRegionDropdownOpen(!isRegionDropdownOpen)}
              className={`flex items-center justify-between w-full px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                disabled ? 'opacity-75 cursor-not-allowed bg-gray-50' : 'hover:border-gray-300'
              }`}
              aria-haspopup="true"
              aria-expanded={isRegionDropdownOpen}
              disabled={disabled}
            >
              <div className="flex items-center space-x-2">
                <GlobeAmericasIcon className="h-5 w-5 text-gray-400" />
                <span className="truncate">{selectedRegion || 'Filter by Region'}</span>
              </div>
              {isRegionDropdownOpen ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {isRegionDropdownOpen && !disabled && (
              <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-60 overflow-auto">
                {regions.map((region) => (
                  <button
                    key={region}
                    type="button"
                    className={`flex items-center w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                      selectedRegion === region ? 'bg-blue-50 text-blue-700 font-medium' : ''
                    }`}
                    onClick={() => handleRegionFilter(region)}
                  >
                    <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                    {region}
                  </button>
                ))}
                {selectedRegion && (
                  <button
                    type="button"
                    className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-50 text-red-500 font-medium border-t border-gray-200"
                    onClick={() => handleRegionFilter('')}
                  >
                    <XMarkIcon className="h-5 w-5 mr-2" />
                    Clear region
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Population Filter */}
          <div className="relative w-full sm:w-56" ref={populationDropdownRef}>
            <button
              type="button"
              onClick={() => !disabled && setIsPopulationDropdownOpen(!isPopulationDropdownOpen)}
              className={`flex items-center justify-between w-full px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                disabled ? 'opacity-75 cursor-not-allowed bg-gray-50' : 'hover:border-gray-300'
              }`}
              aria-haspopup="true"
              aria-expanded={isPopulationDropdownOpen}
              disabled={disabled}
            >
              <div className="flex items-center space-x-2">
                <UsersIcon className="h-5 w-5 text-gray-400" />
                <span className="truncate">
                  {populationFilters.find(f => f.value === selectedPopulation)?.label || 'Filter by Population'}
                </span>
              </div>
              {isPopulationDropdownOpen ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {isPopulationDropdownOpen && !disabled && (
              <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-60 overflow-auto">
                {populationFilters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    className={`flex items-center w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                      selectedPopulation === filter.value ? 'bg-blue-50 text-blue-700 font-medium' : ''
                    }`}
                    onClick={() => handlePopulationFilter(filter.value)}
                  >
                    <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" />
                    {filter.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {(selectedRegion || selectedPopulation) && (
        <div className="flex flex-wrap gap-2 pt-2">
          {selectedRegion && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-800 border border-blue-100">
              <GlobeAmericasIcon className="h-4 w-4 mr-1" />
              {selectedRegion}
              <button 
                onClick={() => !disabled && handleRegionFilter('')}
                className={`ml-1 focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={disabled}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </span>
          )}
          {selectedPopulation && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-50 text-green-800 border border-green-100">
              <UsersIcon className="h-4 w-4 mr-1" />
              {populationFilters.find(f => f.value === selectedPopulation)?.label}
              <button 
                onClick={() => !disabled && handlePopulationFilter('')}
                className={`ml-1 focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={disabled}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;