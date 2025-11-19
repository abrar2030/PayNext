import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from '../Profile';
import UserService from '../../../services/UserService'; // Adjust path as needed

// Mock the UserService
jest.mock('../../../services/UserService');

describe('Profile Component', () => {
  const mockUserData = {
    username: 'testuser',
    email: 'test@example.com',
    // Add other profile fields as needed
  };

  beforeEach(() => {
    // Reset mocks before each test
    UserService.getUserProfile.mockClear();
    UserService.updateUserProfile.mockClear();
  });

  test('renders loading state initially', () => {
    UserService.getUserProfile.mockResolvedValueOnce({ user: null }); // Mock promise
    render(<Profile />);
    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();
  });

  test('fetches and displays user profile data', async () => {
    UserService.getUserProfile.mockResolvedValueOnce({ user: mockUserData });
    render(<Profile />);

    // Wait for loading to disappear and data to appear
    await waitFor(() => {
      expect(screen.queryByText(/loading profile/i)).not.toBeInTheDocument();
    });

    // Check if profile data is rendered (assuming input fields display the data)
    expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(UserService.getUserProfile).toHaveBeenCalledTimes(1);
  });

  test('allows user to update profile information', async () => {
    UserService.getUserProfile.mockResolvedValueOnce({ user: mockUserData });
    UserService.updateUserProfile.mockResolvedValueOnce({ success: true, user: { ...mockUserData, username: 'updateduser' } });
    render(<Profile />);

    await waitFor(() => {
      expect(screen.queryByText(/loading profile/i)).not.toBeInTheDocument();
    });

    const usernameInput = screen.getByDisplayValue('testuser');
    fireEvent.change(usernameInput, { target: { value: 'updateduser' } });

    const saveButton = screen.getByRole('button', { name: /save changes/i }); // Adjust button text if needed
    fireEvent.click(saveButton);

    // Check if update service was called
    await waitFor(() => {
        expect(UserService.updateUserProfile).toHaveBeenCalledWith(expect.objectContaining({ username: 'updateduser' }));
    });

    // Optionally check for success message or updated state
    // expect(await screen.findByText(/profile updated successfully/i)).toBeInTheDocument();
  });

  test('displays error message on fetch failure', async () => {
    const errorMessage = 'Failed to fetch profile';
    UserService.getUserProfile.mockRejectedValueOnce(new Error(errorMessage));
    render(<Profile />);

    await waitFor(() => {
      expect(screen.queryByText(/loading profile/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(new RegExp(errorMessage, 'i'))).toBeInTheDocument();
  });

   test('displays error message on update failure', async () => {
    UserService.getUserProfile.mockResolvedValueOnce({ user: mockUserData });
    const updateErrorMessage = 'Failed to update profile';
    UserService.updateUserProfile.mockRejectedValueOnce(new Error(updateErrorMessage));
    render(<Profile />);

    await waitFor(() => {
      expect(screen.queryByText(/loading profile/i)).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(await screen.findByText(new RegExp(updateErrorMessage, 'i'))).toBeInTheDocument();
  });
});
