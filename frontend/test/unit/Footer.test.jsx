import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from '../../components/Footer'

describe('Footer', () => {
  it('renders the footer with current year', () => {
    render(<Footer />)
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(`© ${currentYear} World Explorer. All rights reserved.`)).toBeInTheDocument()
    expect(screen.getByText('World Explorer')).toBeInTheDocument()
    expect(screen.getByText('Explore countries around the world')).toBeInTheDocument()
  })
})