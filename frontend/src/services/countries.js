import api from './api';

const BASE_URL = 'https://restcountries.com/v3.1';

export const getAllCountries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/all?fields=name,flags,population,region,capital,cca3`);
    if (!response.ok) throw new Error('Failed to fetch countries');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getCountryByName = async (name) => {
  try {
    const response = await fetch(`${BASE_URL}/name/${name}`);
    if (!response.ok) throw new Error('Country not found');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getCountryByCode = async (code) => {
  try {
    const response = await fetch(`${BASE_URL}/alpha/${code}`);
    if (!response.ok) throw new Error('Country not found');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getCountriesByRegion = async (region) => {
  try {
    const response = await fetch(`${BASE_URL}/region/${region}?fields=name,flags,population,region,capital,cca3`);
    if (!response.ok) throw new Error('Failed to fetch countries by region');
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getCountriesByCodes = async (codes) => {
  try {
    const response = await fetch(`${BASE_URL}/alpha?codes=${codes.join(',')}`);
    if (!response.ok) throw new Error('Failed to fetch countries by codes');
    return await response.json();
  } catch (error) {
    throw error;
  }
};