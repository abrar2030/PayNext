import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BottomNav from "../BottomNav"; // Adjust import path

// Mock next/navigation if used for routing
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(), // Mock the push function
  }),
  usePathname: () => "/", // Mock the current path
}));

describe("Mobile BottomNav Component", () => {
  test("renders navigation items correctly", () => {
    render(<BottomNav />);

    // Check if key navigation links/icons are present
    // Adjust names based on actual implementation (e.g., using aria-label or text)
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /send/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /request/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /profile/i })).toBeInTheDocument();
  });

  test("highlights the active link based on pathname", () => {
    // Mock pathname to match one of the links
    jest.mock(
      "next/navigation",
      () => ({
        useRouter: () => ({ push: jest.fn() }),
        usePathname: () => "/send", // Mock path for 'Send'
      }),
      { virtual: true },
    );

    render(<BottomNav />);

    const sendLink = screen.getByRole("link", { name: /send/i });
    // Check if the active link has a specific style or attribute (e.g., aria-current)
    // This depends on how active state is implemented in BottomNav.tsx
    // Example: expect(sendLink).toHaveClass('active');
    // Example: expect(sendLink).toHaveAttribute('aria-current', 'page');
    // Add the specific assertion based on your component's implementation
  });

  test("navigates when a link is clicked", () => {
    const mockPush = jest.fn();
    jest.mock(
      "next/navigation",
      () => ({
        useRouter: () => ({ push: mockPush }),
        usePathname: () => "/",
      }),
      { virtual: true },
    );

    render(<BottomNav />);

    const profileLink = screen.getByRole("link", { name: /profile/i });
    fireEvent.click(profileLink);

    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith("/profile");
  });
});
