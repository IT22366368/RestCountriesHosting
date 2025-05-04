import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PrivateRoute from '../../components/PrivateRoute'
import { AuthContext } from '../../context/AuthContext'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

describe('PrivateRoute', () => {
  it('redirects to login when user is not authenticated', () => {
    const mockAuth = {
      user: null,
      loading: false
    }
    
    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/protected" element={<PrivateRoute><div>Protected Content</div></PrivateRoute>} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    )
    
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('renders children when user is authenticated', () => {
    const mockAuth = {
      user: { username: 'testuser' },
      loading: false
    }
    
    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/protected" element={<PrivateRoute><div>Protected Content</div></PrivateRoute>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    )
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})