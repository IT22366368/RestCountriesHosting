import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HomePage from '../../pages/HomePage'
import { MemoryRouter } from 'react-router-dom'
import * as countriesService from '../../services/countries'

describe('HomePage', () => {
  const mockCountries = [
    {
      cca3: 'USA',
      name: { common: 'United States', official: 'United States of America' },
      flags: { png: 'https://flagcdn.com/w320/us.png' },
      population: 331002651,
      region: 'Americas',
      capital: ['Washington, D.C.']
    },
    {
      cca3: 'CAN',
      name: { common: 'Canada', official: 'Canada' },
      flags: { png: 'https://flagcdn.com/w320/ca.png' },
      population: 38005238,
      region: 'Americas',
      capital: ['Ottawa']
    }
  ]

  beforeEach(() => {
    vi.spyOn(countriesService, 'getAllCountries').mockResolvedValue(mockCountries)
    vi.spyOn(countriesService, 'getCountryByName').mockResolvedValue([mockCountries[0]])
    vi.spyOn(countriesService, 'getCountriesByRegion').mockResolvedValue(mockCountries)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the home page with countries', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('World Countries Explorer')).toBeInTheDocument()
      expect(screen.getByText('United States')).toBeInTheDocument()
      expect(screen.getByText('Canada')).toBeInTheDocument()
    })
  })

  it('filters countries by search', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search for a country...')
      fireEvent.change(searchInput, { target: { value: 'United' } })
    })

    await waitFor(() => {
      expect(countriesService.getCountryByName).toHaveBeenCalledWith('United')
      expect(screen.getByText('United States')).toBeInTheDocument()
      expect(screen.queryByText('Canada')).not.toBeInTheDocument()
    })
  })

  it('filters countries by region', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      const regionButton = screen.getByText('Filter by Region')
      fireEvent.click(regionButton)
      const americasOption = screen.getByText('Americas')
      fireEvent.click(americasOption)
    })

    await waitFor(() => {
      expect(countriesService.getCountriesByRegion).toHaveBeenCalledWith('Americas')
    })
  })
})