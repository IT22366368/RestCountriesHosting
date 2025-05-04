import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../../src/context/AuthContext'
import RegisterPage from '../../src/pages/RegisterPage'

describe('RegisterPage', () => {
  it('renders registration form', () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    )
    
    expect(screen.getByText('Create Your Account')).toBeInTheDocument()
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
    expect(screen.getByText('Create Account')).toBeInTheDocument()
  })

  it('validates form inputs', async () => {
    const mockRegister = vi.fn()
    const mockAuth = { register: mockRegister }
    
    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter>
          <RegisterPage />
        </MemoryRouter>
      </AuthContext.Provider>
    )
    
    const usernameInput = screen.getByLabelText('Username')
    const emailInput = screen.getByLabelText('Email Address')
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByText('Create Account')
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } })
    fireEvent.click(submitButton)
    
    expect(mockRegister).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!'
    })
  })

  it('shows password strength', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    )
    
    const passwordInput = screen.getByLabelText('Password')
    fireEvent.change(passwordInput, { target: { value: 'weak' } })
    expect(screen.getByText('Weak')).toBeInTheDocument()
    
    fireEvent.change(passwordInput, { target: { value: 'Better123' } })
    expect(screen.getByText('Good')).toBeInTheDocument()
    
    fireEvent.change(passwordInput, { target: { value: 'StrongPassword123!' } })
    expect(screen.getByText('Strong')).toBeInTheDocument()
  })

  it('shows error when passwords dont match', async () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    )
    
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password124' } })
    
    expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
  })
})