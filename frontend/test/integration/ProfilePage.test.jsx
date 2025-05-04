import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ProfilePage from '../../pages/ProfilePage'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import * as countriesService from '../../services/countries'

describe('ProfilePage', () => {
  const mockUser = {
    username: 'testuser',
    email: 'test@example.com',
    favoriteCountries: ['USA', 'CAN']
  }

  const mockCountries = [
    {
      cca3: 'USA',
      name: { common: 'United States' },
      flags: { png: 'https://flagcdn.com/w320/us.png' }
    },
    {
      cca3: 'CAN',
      name: { common: 'Canada' },
      flags: { png: 'https://flagcdn.com/w320/ca.png' }
    }
  ]

  beforeEach(() => {
    vi.spyOn(countriesService, 'getCountriesByCodes').mockResolvedValue(mockCountries)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders user profile information', async () => {
    const mockAuth = {
      user: mockUser,
      logout: vi.fn(),
      updateProfile: vi.fn()
    }
    
    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </AuthContext.Provider>
    )
    
    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })
  })

  it('shows favorite countries', async () => {
    const mockAuth = {
      user: mockUser,
      logout: vi.fn(),
      updateProfile: vi.fn()
    }
    
    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </AuthContext.Provider>
    )
    
    await waitFor(() => {
      expect(screen.getByText('Favorite Countries')).toBeInTheDocument()
      expect(screen.getByText('United States')).toBeInTheDocument()
      expect(screen.getByText('Canada')).toBeInTheDocument()
    })
  })

  it('allows editing profile', async () => {
    const mockAuth = {
      user: mockUser,
      logout: vi.fn(),
      updateProfile: vi.fn().mockResolvedValue({})
    }
    
    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </AuthContext.Provider>
    )
    
    const editButton = await screen.findByText('Edit Profile')
    fireEvent.click(editButton)
    
    expect(screen.getByText('Save Changes')).toBeInTheDocument()
    
    const usernameInput = screen.getByDisplayValue('testuser')
    fireEvent.change(usernameInput, { target: { value: 'newusername' } })
    
    const saveButton = screen.getByText('Save Changes')
    fireEvent.click(saveButton)
    
    await waitFor(() => {
      expect(mockAuth.updateProfile).toHaveBeenCalled()
    })
  })
})