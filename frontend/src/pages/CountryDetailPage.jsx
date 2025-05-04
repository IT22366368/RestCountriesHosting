import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCountryByCode, getCountriesByCodes } from '../services/countries';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  ArrowLeftIcon, 
  HeartIcon as HeartOutline,
  GlobeAmericasIcon,
  GlobeAsiaAustraliaIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  LanguageIcon,
  CurrencyDollarIcon,
  GlobeEuropeAfricaIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const CountryDetailPage = () => {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, addFavorite, removeFavorite } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const isFavorite = user?.favoriteCountries?.includes(code);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setLoading(true);
        const data = await getCountryByCode(code);
        setCountry(data[0]);
        setError(null);
        
        if (data[0]?.borders?.length > 0) {
          const borderData = await getCountriesByCodes(data[0].borders);
          setBorderCountries(borderData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [code]);

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavorite(code);
    } else {
      addFavorite(code);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col justify-center items-center min-h-64 py-24">
            <LoadingSpinner />
            <p className="mt-6 text-blue-600 animate-pulse font-medium">Loading country details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
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
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
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
            <p className="text-2xl font-medium text-gray-800 mb-3">Country Not Found</p>
            <p className="text-gray-600 max-w-md mx-auto">We couldn't find the country you're looking for. Please try another search.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 text-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-100 transition-all duration-300 border border-gray-200 text-gray-700 shadow-sm"
          >
            <ArrowLeftIcon className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Back</span>
          </button>
          
          
        </div>
        
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 pb-0">
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-2">
              <div className="w-full md:w-48 flex-shrink-0">
                <img
                  src={country.flags.png}
                  alt={`Flag of ${country.name.common}`}
                  className="w-full h-auto object-cover rounded-lg border-2 border-gray-200"
                />
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {country.name.common}
                    </h1>
                    <p className="text-gray-500 text-sm">{country.name.official}</p>
                  </div>
                  
                  {user && (
                    <button
                      onClick={toggleFavorite}
                      className={`p-2 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isFavorite 
                          ? 'bg-red-100 text-red-500' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isFavorite ? (
                        <HeartSolid className="h-5 w-5" />
                      ) : (
                        <HeartOutline className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex border-b border-gray-200 mt-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'overview' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('cultural')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'cultural' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Cultural
              </button>
              <button
                onClick={() => setActiveTab('maps')}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === 'maps' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Maps
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-8">
                  <div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Official Name</p>
                      <p className="font-medium">{country.name.official}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                        <UserGroupIcon className="h-4 w-4 text-blue-500" />
                        Population
                      </p>
                      <p className="font-medium">{country.population.toLocaleString()}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                        <GlobeAmericasIcon className="h-4 w-4 text-blue-500" />
                        Region
                      </p>
                      <p className="font-medium">{country.region}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                        <GlobeAsiaAustraliaIcon className="h-4 w-4 text-blue-500" />
                        Subregion
                      </p>
                      <p className="font-medium">{country.subregion || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                        <BuildingOffice2Icon className="h-4 w-4 text-blue-500" />
                        Capital
                      </p>
                      <p className="font-medium">{country.capital?.join(', ') || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                        <GlobeEuropeAfricaIcon className="h-4 w-4 text-blue-500" />
                        Top Level Domain
                      </p>
                      <p className="font-medium">{country.tld?.join(', ') || 'N/A'}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                        <CurrencyDollarIcon className="h-4 w-4 text-blue-500" />
                        Currencies
                      </p>
                      <p className="font-medium">{country.currencies ? Object.values(country.currencies).map(c => c.name).join(', ') : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                        <LanguageIcon className="h-4 w-4 text-blue-500" />
                        Languages
                      </p>
                      <p className="font-medium">{country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                {borderCountries.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold mb-4 text-blue-600 flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4" />
                      Border Countries
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {borderCountries.map((border) => (
                        <Link
                          key={border.cca3}
                          to={`/country/${border.cca3}`}
                          className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-all duration-300 text-sm text-gray-700"
                        >
                          {border.name.common}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'cultural' && (
              <div className="py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Languages</p>
                    <p className="font-medium">{country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Currencies</p>
                    <p className="font-medium">{country.currencies ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol || 'N/A'})`).join(', ') : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Calling Code</p>
                    <p className="font-medium">{country.idd?.root ? `${country.idd.root}${country.idd.suffixes?.[0] || ''}` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Driving Side</p>
                    <p className="font-medium">{country.car?.side || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Start of Week</p>
                    <p className="font-medium capitalize">{country.startOfWeek || 'monday'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Time Zone</p>
                    <p className="font-medium">{country.timezones?.[0] || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* {activeTab === 'maps' && (
              <div className="py-4">
                <div className="flex flex-col gap-6">
                  <div className="flex gap-4">
                    <a 
                      href={country.maps?.googleMaps} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors duration-300 text-gray-700"
                    >
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      Google Maps
                    </a>
                    
                    <a 
                      href={country.maps?.openStreetMaps} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors duration-300 text-gray-700"
                    >
                      <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
                      </svg>
                      OpenStreetMap
                    </a>
                  </div>
                  
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Interactive map would be displayed here</p>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetailPage;