import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllCountries, getCountryByName, getCountriesByRegion } from '../services/countries';
import CountryCard from '../components/CountryCard';
import SearchAndFilter from '../components/SearchAndFilter';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [displayedCountries, setDisplayedCountries] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    region: '',
    population: ''
  });
  const { user } = useAuth();

  // Initial data fetch - only runs once
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setInitialLoading(true);
        const data = await getAllCountries();
        setAllCountries(data);
        setDisplayedCountries(data);
      } catch (err) {
        setError(err.message);
        setDisplayedCountries([]);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Memoized filter function to prevent unnecessary re-filters
  const applyFilters = useCallback(async () => {
    if (initialLoading) return; // Don't filter while initial data is loading
    
    setFilterLoading(true);
    
    try {
      let result = [];
      
      // Step 1: API-based filtering
      if (filters.region && filters.search) {
        const regionResults = await getCountriesByRegion(filters.region);
        result = regionResults.filter(country => 
          country.name.common.toLowerCase().includes(filters.search.toLowerCase()) ||
          country.name.official.toLowerCase().includes(filters.search.toLowerCase()) ||
          (country.capital && country.capital.some(capital => 
            capital.toLowerCase().includes(filters.search.toLowerCase())
          ))
        );
      } else if (filters.region) {
        result = await getCountriesByRegion(filters.region);
      } else if (filters.search) {
        result = await getCountryByName(filters.search);
      } else {
        result = [...allCountries];
      }
      
      // Step 2: Apply population filter locally if needed
      if (filters.population) {
        result = result.filter(country => {
          const population = country.population;
          switch(filters.population) {
            case 'lt1m': return population < 1000000;
            case '1m-10m': return population >= 1000000 && population < 10000000;
            case '10m-100m': return population >= 10000000 && population < 100000000;
            case 'gt100m': return population >= 100000000;
            default: return true;
          }
        });
      }
      
      setDisplayedCountries(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setDisplayedCountries([]);
    } finally {
      setFilterLoading(false);
    }
  }, [filters, allCountries, initialLoading]);

  // Apply filters when they change, with debounce
  useEffect(() => {
    const filterTimer = setTimeout(() => {
      applyFilters();
    }, 300);
    
    return () => clearTimeout(filterTimer);
  }, [applyFilters]);

  // Unified update handlers with debounce built in
  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  // Show loading spinner only during initial load, not during filtering
  const isLoading = initialLoading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero section with gradient text */}
        <div className="mb-12 text-center py-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 text-transparent bg-clip-text tracking-tight">
            World Countries Explorer
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-300 mx-auto mb-3"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover detailed information about countries around the world. Search by name, filter by region, 
            and explore population statistics to expand your global knowledge.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-8 mb-6 border border-gray-100">
          
          
          <SearchAndFilter 
            onSearch={(value) => handleFilterChange('search', value)}
            onRegionFilter={(value) => handleFilterChange('region', value)}
            onPopulationFilter={(value) => handleFilterChange('population', value)}
            disabled={initialLoading}
            currentFilters={filters}
          />
        </div>
        
        {isLoading ? (
          <div className="flex flex-col justify-center items-center min-h-64 py-16">
            <LoadingSpinner />
            <p className="mt-6 text-blue-600 animate-pulse font-medium">Discovering countries...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center border border-red-50">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6">
              <svg 
                className="w-12 h-12 text-red-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-medium text-gray-800 mb-3">Something Went Wrong</p>
            <p className="text-gray-600 max-w-md mx-auto">{error}</p>
          </div>
        ) : displayedCountries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-10 text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-6">
              <svg 
                className="w-12 h-12 text-blue-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-medium text-gray-800 mb-3">No Countries Found</p>
            <p className="text-gray-600 max-w-md mx-auto">We couldn't find any countries matching your criteria. Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8">
              <p className="text-lg font-medium text-gray-700 border-b-2 border-blue-500 pb-1 inline-block">
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
                  {displayedCountries.length}
                </span> countries discovered
              </p>
              {filterLoading && (
                <span className="inline-flex items-center text-sm text-blue-500">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing results...
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedCountries.map((country) => (
                <CountryCard key={country.cca3} country={country} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;