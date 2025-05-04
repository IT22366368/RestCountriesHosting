import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Navbar from '../../components/Navbar'
import { AuthContext } from '../../context/AuthContext'

describe('Navbar', () => {
  it('renders logo and navigation links', () => {
    render(<Navbar />)
    expect(screen.getByText('World Explorer')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('shows login/register when user is not authenticated', () => {
    render(<Navbar />)
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Register')).toBeInTheDocument()
    expect(screen.queryByText('Profile')).not.toBeInTheDocument()
  })

  it('shows profile/logout when user is authenticated', () => {
    const mockAuth = {
      user: { username: 'testuser' },
      logout: vi.fn()
    }
    
    render(
      <AuthContext.Provider value={mockAuth}>
        <Navbar />
      </AuthContext.Provider>
    )
    
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Logout')).toBeInTheDocument()
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
  })

  it('toggles mobile menu', () => {
    render(<Navbar />)
    const menuButton = screen.getByLabelText('Open main menu')
    fireEvent.click(menuButton)
    expect(screen.getByText('Home')).toBeVisible()
  })
})