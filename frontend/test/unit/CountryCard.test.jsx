import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CountryCard from '../../components/CountryCard'

const mockCountry = {
  cca3: 'USA',
  name: { common: 'United States', official: 'United States of America' },
  flags: { png: 'https://flagcdn.com/w320/us.png' },
  population: 331002651,
  region: 'Americas',
  capital: ['Washington, D.C.']
}

describe('CountryCard', () => {
  it('renders country information correctly', () => {
    render(<CountryCard country={mockCountry} />)
    
    expect(screen.getByText('United States')).toBeInTheDocument()
    expect(screen.getByText('331,002,651')).toBeInTheDocument()
    expect(screen.getByText('Americas')).toBeInTheDocument()
    expect(screen.getByText('Washington, D.C.')).toBeInTheDocument()
    expect(screen.getByAltText('Flag of United States')).toBeInTheDocument()
  })

  it('navigates to country detail page when clicked', () => {
    render(<CountryCard country={mockCountry} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/country/USA')
  })

  it('shows favorite button for authenticated users', () => {
    const mockAuth = {
      user: { favoriteCountries: [] },
      addFavorite: vi.fn(),
      removeFavorite: vi.fn()
    }
    
    render(
      <AuthContext.Provider value={mockAuth}>
        <CountryCard country={mockCountry} />
      </AuthContext.Provider>
    )
    
    expect(screen.getByLabelText('Add to favorites')).toBeInTheDocument()
  })

  it('toggles favorite status when clicked', async () => {
    const mockAddFavorite = vi.fn()
    const mockRemoveFavorite = vi.fn()
    const mockAuth = {
      user: { favoriteCountries: [] },
      addFavorite: mockAddFavorite,
      removeFavorite: mockRemoveFavorite
    }
    
    render(
      <AuthContext.Provider value={mockAuth}>
        <CountryCard country={mockCountry} />
      </AuthContext.Provider>
    )
    
    const button = screen.getByLabelText('Add to favorites')
    fireEvent.click(button)
    expect(mockAddFavorite).toHaveBeenCalledWith('USA')
  })
})