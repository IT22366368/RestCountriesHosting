import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Token configuration for better maintainability
const TOKEN_CONFIG = {
  expiresIn: '1h', // Changed from 30d to 1h as requested
};

// Cookie configuration for better maintainability
const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== 'development',
  sameSite: 'strict',
  maxAge: 60 * 60 * 1000 // 1 hour in milliseconds (matching token expiry)
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    // Create user
    const user = await User.create({ username, email, password });
    
    // Generate token
    const token = generateToken(user._id);
    
    // Set cookie
    res.cookie('token', token, COOKIE_CONFIG);
    
    res.status(201).json({
      success: true,
      _id: user._id,
      username: user.username,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user._id);
      
      res.cookie('token', token, COOKIE_CONFIG);
      
      res.json({
        success: true,
        _id: user._id,
        username: user.username,
        email: user.email,
        token
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  
  if (user) {
    res.json({
      success: true,
      _id: user._id,
      username: user.username,
      email: user.email,
      favoriteCountries: user.favoriteCountries
    });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    
    if (req.body.password) {
      user.password = req.body.password;
    }
    
    const updatedUser = await user.save();
    
    res.json({
      success: true,
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email
    });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
};

// @desc    Add country to favorites
// @route   POST /api/users/favorites
// @access  Private
const addFavoriteCountry = async (req, res) => {
  const { countryCode } = req.body;
  
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (user.favoriteCountries.includes(countryCode)) {
      return res.status(400).json({ success: false, message: 'Country already in favorites' });
    }
    
    user.favoriteCountries.push(countryCode);
    await user.save();
    
    res.status(200).json({ success: true, favoriteCountries: user.favoriteCountries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove country from favorites
// @route   DELETE /api/users/favorites/:countryCode
// @access  Private
const removeFavoriteCountry = async (req, res) => {
  const { countryCode } = req.params;
  
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    user.favoriteCountries = user.favoriteCountries.filter(code => code !== countryCode);
    await user.save();
    
    res.status(200).json({ success: true, favoriteCountries: user.favoriteCountries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generate JWT with better maintainability
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, TOKEN_CONFIG);
};

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  addFavoriteCountry,
  removeFavoriteCountry
};