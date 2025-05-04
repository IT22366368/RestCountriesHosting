import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CoverPage from '../../pages/CoverPage'
import { MemoryRouter } from 'react-router-dom'

describe('CoverPage', () => {
  it('renders the cover page with hero section', () => {
    render(
      <MemoryRouter>
        <CoverPage />
      </MemoryRouter>
    )
    
    expect(screen.getByText('Discover Our Beautiful World')).toBeInTheDocument()
    expect(screen.getByText('Start Exploring')).toBeInTheDocument()
    expect(screen.getByText('Browse Countries')).toBeInTheDocument()
  })

  it('shows features section', () => {
    render(
      <MemoryRouter>
        <CoverPage />
      </MemoryRouter>
    )
    
    expect(screen.getByText('Why Explore With Us?')).toBeInTheDocument()
    expect(screen.getByText('Comprehensive Guides')).toBeInTheDocument()
    expect(screen.getByText('Interactive Maps')).toBeInTheDocument()
    expect(screen.getByText('Personalized Experience')).toBeInTheDocument()
  })
})