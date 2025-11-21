import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom"; // Import Router
import Dashboard from "../Dashboard";

// Mock child components or services if necessary
jest.mock("../../Payments/PaymentHistory", () => () => (
  <div data-testid="payment-history-mock">Payment History</div>
));
jest.mock("../../Profile/Profile", () => () => (
  <div data-testid="profile-mock">User Profile</div>
));
// Mock any other components that might use Router context internally if needed
// jest.mock('../../components/Navbar', () => () => <div data-testid="navbar-mock">Navbar</div>); // Example if Navbar uses Link

describe("Dashboard Component", () => {
  // Helper function to render with Router
  const renderWithRouter = (ui, { route = "/" } = {}) => {
    window.history.pushState({}, "Test page", route);
    return render(ui, { wrapper: Router });
  };

  test("renders dashboard sections", () => {
    renderWithRouter(<Dashboard />); // Use the helper

    // Check if main sections are rendered (using mocks or actual content)
    // Update this assertion based on actual content or structure
    // expect(screen.getByText(/dashboard overview/i)).toBeInTheDocument(); // Assuming there's a title
    expect(screen.getByTestId("payment-history-mock")).toBeInTheDocument();
    expect(screen.getByTestId("profile-mock")).toBeInTheDocument();
    // Add checks for other expected elements like balance display, quick actions etc.
  });

  // Add more tests for interactions, data loading, conditional rendering etc.
  // Example: Test data fetching if the dashboard loads user data
  /*
  test('loads and displays user data', async () => {
    // Mock UserService or relevant API call
    const UserService = jest.requireMock('../../services/UserService');
    UserService.getUserData.mockResolvedValue({ balance: 1000, recentTransactions: 5 });

    renderWithRouter(<Dashboard />); // Use the helper

    // Wait for data to load and check if it's displayed
    expect(await screen.findByText(/balance: \$1000/i)).toBeInTheDocument();
    expect(screen.getByText(/recent transactions: 5/i)).toBeInTheDocument();
  });
  */
});
