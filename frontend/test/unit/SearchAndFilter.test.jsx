import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SearchAndFilter from '../../components/SearchAndFilter'

describe('SearchAndFilter', () => {
  const mockOnSearch = vi.fn()
  const mockOnRegionFilter = vi.fn()
  const mockOnPopulationFilter = vi.fn()

  beforeEach(() => {
    mockOnSearch.mockClear()
    mockOnRegionFilter.mockClear()
    mockOnPopulationFilter.mockClear()
  })

  it('renders search and filter components', () => {
    render(
      <SearchAndFilter 
        onSearch={mockOnSearch}
        onRegionFilter={mockOnRegionFilter}
        onPopulationFilter={mockOnPopulationFilter}
      />
    )
    
    expect(screen.getByPlaceholderText('Search for a country...')).toBeInTheDocument()
    expect(screen.getByText('Filter by Region')).toBeInTheDocument()
    expect(screen.getByText('Filter by Population')).toBeInTheDocument()
  })

  it('triggers search with debounce', async () => {
    render(
      <SearchAndFilter 
        onSearch={mockOnSearch}
        onRegionFilter={mockOnRegionFilter}
        onPopulationFilter={mockOnPopulationFilter}
      />
    )
    
    const searchInput = screen.getByPlaceholderText('Search for a country...')
    fireEvent.change(searchInput, { target: { value: 'Canada' } })
    
    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 350))
    expect(mockOnSearch).toHaveBeenCalledWith('Canada')
  })

  it('opens and selects region filter', () => {
    render(
      <SearchAndFilter 
        onSearch={mockOnSearch}
        onRegionFilter={mockOnRegionFilter}
        onPopulationFilter={mockOnPopulationFilter}
      />
    )
    
    const regionButton = screen.getByText('Filter by Region')
    fireEvent.click(regionButton)
    
    const asiaOption = screen.getByText('Asia')
    fireEvent.click(asiaOption)
    
    expect(mockOnRegionFilter).toHaveBeenCalledWith('Asia')
  })

  it('shows active filters', () => {
    render(
      <SearchAndFilter 
        onSearch={mockOnSearch}
        onRegionFilter={mockOnRegionFilter}
        onPopulationFilter={mockOnPopulationFilter}
        currentFilters={{ region: 'Europe', population: '1m-10m' }}
      />
    )
    
    expect(screen.getByText('Europe')).toBeInTheDocument()
    expect(screen.getByText('1M to 10M')).toBeInTheDocument()
  })
})