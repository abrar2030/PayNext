import { render, screen, waitFor } from "@testing-library/react";
import HomePage from "@/app/page";
import { useAuth } from "@/contexts/AuthContext";
import { mockApiClient } from "@/lib/api-client";

// Mock dependencies
jest.mock("@/contexts/AuthContext");
jest.mock("@/lib/api-client");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("HomePage Component", () => {
  const mockUser = {
    id: "user123",
    name: "Test User",
    email: "test@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it("renders the home page with balance section", async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("Current Balance")).toBeInTheDocument();
    });
  });

  it("displays loading skeletons while fetching data", () => {
    render(<HomePage />);

    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders quick action buttons", async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("Send")).toBeInTheDocument();
      expect(screen.getByText("Request")).toBeInTheDocument();
      expect(screen.getByText("Scan QR")).toBeInTheDocument();
    });
  });

  it("displays recent transactions section", async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("Recent Transactions")).toBeInTheDocument();
    });
  });

  it("displays user welcome message when user is authenticated", async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText(/Welcome, Test User/)).toBeInTheDocument();
    });
  });

  it("formats balance correctly", async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText("$1234.56")).toBeInTheDocument();
    });
  });
});
