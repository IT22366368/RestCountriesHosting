import { Link } from 'react-router-dom';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';

const CountryCard = ({ country }) => {
  const { user, addFavorite, removeFavorite } = useAuth();
  const isFavorite = user?.favoriteCountries?.includes(country.cca3);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Optionally redirect to login page or show login modal
      return;
    }
    
    if (isFavorite) {
      removeFavorite(country.cca3);
    } else {
      addFavorite(country.cca3);
    }
  };

  return (
    <Link
      to={`/country/${country.cca3}`}
      className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-100"
    >
      <div className="relative">
        <img
          src={country.flags.png}
          alt={`Flag of ${country.name.common}`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {user && (
          <button
            onClick={toggleFavorite}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isFavorite 
                ? 'bg-red-100/90 hover:bg-red-200/90' 
                : 'bg-white/80 hover:bg-white'
            } shadow-sm hover:shadow-md`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? (
              <HeartSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartOutline className="h-5 w-5 text-gray-600 hover:text-red-400 transition-colors" />
            )}
          </button>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
          {country.name.common}
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p className="flex items-start">
            <span className="font-medium text-gray-500 w-24 flex-shrink-0">Population:</span>
            <span className="text-gray-700">{country.population.toLocaleString()}</span>
          </p>
          <p className="flex items-start">
            <span className="font-medium text-gray-500 w-24 flex-shrink-0">Region:</span>
            <span className="text-gray-700">{country.region}</span>
          </p>
          <p className="flex items-start">
            <span className="font-medium text-gray-500 w-24 flex-shrink-0">Capital:</span>
            <span className="text-gray-700">{country.capital?.[0] || 'N/A'}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CountryCard;