import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CountryDetailPage from '../../pages/CountryDetailPage'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import * as countriesService from '../../services/countries'

describe('CountryDetailPage', () => {
  const mockCountry = {
    cca3: 'USA',
    name: { common: 'United States', official: 'United States of America' },
    flags: { png: 'https://flagcdn.com/w320/us.png' },
    population: 331002651,
    region: 'Americas',
    capital: ['Washington, D.C.'],
    borders: ['CAN', 'MEX']
  }

  const mockBorderCountries = [
    { cca3: 'CAN', name: { common: 'Canada' } },
    { cca3: 'MEX', name: { common: 'Mexico' } }
  ]

  beforeEach(() => {
    vi.spyOn(countriesService, 'getCountryByCode').mockResolvedValue([mockCountry])
    vi.spyOn(countriesService, 'getCountriesByCodes').mockResolvedValue(mockBorderCountries)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders country details', async () => {
    render(
      <MemoryRouter initialEntries={['/country/USA']}>
        <Routes>
          <Route path="/country/:code" element={<CountryDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('United States')).toBeInTheDocument()
      expect(screen.getByText('331,002,651')).toBeInTheDocument()
      expect(screen.getByText('Americas')).toBeInTheDocument()
      expect(screen.getByText('Washington, D.C.')).toBeInTheDocument()
    })
  })

  it('shows border countries', async () => {
    render(
      <MemoryRouter initialEntries={['/country/USA']}>
        <Routes>
          <Route path="/country/:code" element={<CountryDetailPage />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Canada')).toBeInTheDocument()
      expect(screen.getByText('Mexico')).toBeInTheDocument()
    })
  })

  it('allows toggling favorite status', async () => {
    const mockAuth = {
      user: { favoriteCountries: [] },
      addFavorite: vi.fn(),
      removeFavorite: vi.fn()
    }

    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter initialEntries={['/country/USA']}>
          <Routes>
            <Route path="/country/:code" element={<CountryDetailPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    )

    await waitFor(() => {
      const favoriteButton = screen.getByLabelText('Add to favorites')
      expect(favoriteButton).toBeInTheDocument()
    })
  })
})