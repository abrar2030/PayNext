import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router
import Login from '../Login';

// Mock the AuthService if it's used for API calls
jest.mock('../../../services/AuthService');

// Helper function to render with Router
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, { wrapper: Router })
}

describe('Login Component', () => {
  test('renders login form correctly', () => {
    renderWithRouter(<Login />);
    
    // Check if essential elements are present
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('allows user to input email and password', () => {
    renderWithRouter(<Login />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  // Add more tests for form submission, error handling, etc.
  // Example for submission (requires AuthService mock setup):
  /*
  test('calls login handler on form submission', async () => {
    const mockLogin = jest.fn();
    const AuthService = jest.requireMock('../../../services/AuthService');
    AuthService.login.mockResolvedValue({ success: true }); // Mock successful login

    renderWithRouter(<Login onLoginSuccess={mockLogin} />); // Assuming a prop for success callback

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check if AuthService.login was called
    expect(AuthService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    
    // Wait for potential async updates
    // await screen.findByText(/login successful/i); // Example assertion
    // expect(mockLogin).toHaveBeenCalled();
  });
  */
});

