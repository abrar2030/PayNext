import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RequestPage from "@/app/request/page";
import { useAuth } from "@/contexts/AuthContext";

// Mock dependencies
jest.mock("@/contexts/AuthContext");
jest.mock("@/lib/api-client");

describe("RequestPage Component", () => {
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

  it("renders the request money form", () => {
    render(<RequestPage />);

    expect(screen.getByText("Request Money")).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount \(\$\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Memo/i)).toBeInTheDocument();
  });

  it("shows validation error for invalid amount", async () => {
    render(<RequestPage />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole("button", {
      name: /Generate Request QR Code/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Amount must be a positive number/i),
      ).toBeInTheDocument();
    });
  });

  it("has generate QR code button", () => {
    render(<RequestPage />);

    expect(
      screen.getByRole("button", { name: /Generate Request QR Code/i }),
    ).toBeInTheDocument();
  });

  it("displays form fields with proper labels", () => {
    render(<RequestPage />);

    expect(screen.getByLabelText(/Amount \(\$\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Memo \(Optional\)/i)).toBeInTheDocument();
  });

  it("initially does not show QR code", () => {
    render(<RequestPage />);

    expect(
      screen.queryByText(/Scan QR Code or Copy Link/i),
    ).not.toBeInTheDocument();
  });
});
