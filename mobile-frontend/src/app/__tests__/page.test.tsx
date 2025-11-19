import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../page'; // Adjust the import path based on your file structure

// Mock child components or hooks if necessary
jest.mock('../../components/BottomNav', () => () => <div data-testid="bottom-nav-mock">Bottom Nav</div>);
// Mock any hooks or context providers used by the page

describe('Mobile HomePage', () => {
  test('renders main page elements', () => {
    render(<HomePage />);

    // Example: Check for a welcome message or a key element
    // Replace 'Welcome to PayNext Mobile' with actual text content from your page
    expect(screen.getByText(/Welcome to PayNext Mobile/i)).toBeInTheDocument();

    // Example: Check if mocked components are rendered
    expect(screen.getByTestId('bottom-nav-mock')).toBeInTheDocument();

    // Add more specific assertions based on the actual content of page.tsx
    // e.g., check for buttons, balance display, transaction summaries etc.
  });

  // Add tests for interactions, data loading (if any), etc.
  /*
  test('handles button click', () => {
    render(<HomePage />);
    const sendButton = screen.getByRole('button', { name: /send money/i });
    fireEvent.click(sendButton);
    // Add assertions to check the outcome of the click, e.g., navigation
  });
  */
});
