import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import LoginForm from "../components/LoginForm";

// Mock the auth service
jest.mock("../services/authService", () => ({
  login: jest.fn(() =>
    Promise.resolve({
      token: "fake-token",
      user: { id: 1, name: "Test User" },
    }),
  ),
}));

describe("LoginForm Component", () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    render(
      <BrowserRouter>
        <LoginForm onSuccess={mockOnSuccess} />
      </BrowserRouter>,
    );
  });

  test("renders login form with email and password fields", () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  test("validates form inputs", async () => {
    const loginButton = screen.getByRole("button", { name: /sign in/i });

    // Try submitting without filling fields
    fireEvent.click(loginButton);

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test("submits form with valid credentials", async () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /sign in/i });

    // Fill in form
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Submit form
    fireEvent.click(loginButton);

    // Check if login service was called and onSuccess callback triggered
    await waitFor(() => {
      const authService = require("../services/authService");
      expect(authService.login).toHaveBeenCalledWith(
        "user@example.com",
        "password123",
      );
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  test("shows error message on login failure", async () => {
    // Override the mock to simulate failure
    const authService = require("../services/authService");
    authService.login.mockImplementationOnce(() =>
      Promise.reject(new Error("Invalid credentials")),
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /sign in/i });

    // Fill in form
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    // Submit form
    fireEvent.click(loginButton);

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
