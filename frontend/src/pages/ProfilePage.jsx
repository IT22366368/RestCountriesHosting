import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCountriesByCodes } from '../services/countries';
import CountryCard from '../components/CountryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ArrowLeftIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  HeartIcon as HeartSolid,
  ArrowRightOnRectangleIcon,
  CameraIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const { user, logout, updateProfile } = useAuth();
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user?.favoriteCountries?.length > 0) {
      const fetchFavorites = async () => {
        try {
          setLoading(true);
          const data = await getCountriesByCodes(user.favoriteCountries);
          setFavoriteCountries(data);
        } finally {
          setLoading(false);
        }
      };
      
      fetchFavorites();
    } else {
      setFavoriteCountries([]);
    }
  }, [user]);

  useEffect(() => {
    if (user && editMode) {
      setFormData({
        username: user.username,
        email: user.email,
        password: '',
        confirmPassword: '',
      });
    }
  }, [editMode, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    
    try {
      await updateProfile({
        username: formData.username,
        email: formData.email,
        password: formData.password || undefined,
      });
      setEditMode(false);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header with Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center shadow-lg mb-4">
              <UserIcon className="h-16 w-16 text-white" />
            </div>
            
          </div>
          <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>
          <div className="flex items-center gap-1 mt-2">
            <StarIcon className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="text-gray-600">Bronze Member</span>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Information</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-300"></div>
              </div>
              {/* <button
                onClick={() => logout()}
                className="flex items-center gap-2 px-5 py-2.5 mt-4 sm:mt-0 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-md transition-all duration-300"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button> */}
            </div>
            
            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <UserIcon className="h-4 w-4 text-blue-500" />
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 text-blue-500" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                      <LockClosedIcon className="h-4 w-4 text-blue-500" />
                      New Password
                      <span className="text-xs text-gray-400">(leave blank to keep current)</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                  </div>
                  
                  {formData.password && (
                    <div className="space-y-1">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <LockClosedIcon className="h-4 w-4 text-blue-500" />
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:shadow-md transition-all duration-300"
                  >
                    <CheckIcon className="h-5 w-5" />
                    <span>Save Changes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
                  >
                    <XMarkIcon className="h-5 w-5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <UserIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Username</p>
                      <p className="text-lg font-medium text-gray-800">{user.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-lg font-medium text-gray-800">{user.email}</p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-6 py-3 mt-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:shadow-md transition-all duration-300"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                  <span>Edit Profile</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Favorites Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-red-100 rounded-full">
                <HeartSolid className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Favorite Countries</h3>
                <p className="text-sm text-gray-500">Your personal collection of countries</p>
              </div>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <LoadingSpinner />
                <p className="mt-4 text-blue-600 animate-pulse font-medium">Loading your favorites...</p>
              </div>
            ) : favoriteCountries.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <HeartSolid className="h-10 w-10 text-blue-400" />
                </div>
                <h4 className="text-xl font-medium text-gray-700 mb-2">No favorites yet</h4>
                <p className="text-gray-500 max-w-md mx-auto">
                  You haven't added any countries to your favorites. Explore countries and click the heart icon to add them here.
                </p>
                <button
                  onClick={() => window.location.href = '/'}
                  className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:shadow-md transition-all duration-300 mx-auto"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  <span>Explore Countries</span>
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-lg font-medium text-gray-700 border-b-2 border-blue-500 pb-1 inline-block">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">
                      {favoriteCountries.length}
                    </span> saved favorites
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favoriteCountries.map((country) => (
                    <CountryCard key={country.cca3} country={country} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;