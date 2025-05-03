import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router
import Register from '../Register';

// Mock the AuthService if it's used for API calls
jest.mock('../../../services/AuthService');

// Helper function to render with Router
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)
  return render(ui, { wrapper: Router })
}

describe('Register Component', () => {
  test('renders registration form correctly', () => {
    renderWithRouter(<Register />);
    
    // Check if essential elements are present
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument(); // Use regex for exact match
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('allows user to input registration details', () => {
    renderWithRouter(<Register />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    expect(usernameInput.value).toBe('testuser');
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(confirmPasswordInput.value).toBe('password123');
  });

  // Add more tests for form submission, validation, error handling, etc.
  // Example for submission (requires AuthService mock setup):
  /*
  test('calls register handler on form submission', async () => {
    const mockRegister = jest.fn();
    const AuthService = jest.requireMock('../../../services/AuthService');
    AuthService.register.mockResolvedValue({ success: true }); // Mock successful registration

    renderWithRouter(<Register onRegisterSuccess={mockRegister} />); // Assuming a prop for success callback

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Check if AuthService.register was called
    expect(AuthService.register).toHaveBeenCalledWith('testuser', 'test@example.com', 'password123');
    
    // Wait for potential async updates
    // await screen.findByText(/registration successful/i); // Example assertion
    // expect(mockRegister).toHaveBeenCalled();
  });
  */
});

