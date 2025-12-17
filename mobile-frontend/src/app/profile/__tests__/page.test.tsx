import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfilePage from "@/app/profile/page";
import { useAuth } from "@/contexts/AuthContext";

// Mock dependencies
jest.mock("@/contexts/AuthContext");

describe("ProfilePage Component", () => {
  const mockUser = {
    id: "user123",
    name: "Test User",
    email: "test@example.com",
    avatarUrl: "https://example.com/avatar.jpg",
  };

  const mockLogout = jest.fn();
  const mockUpdateProfile = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      logout: mockLogout,
      updateProfile: mockUpdateProfile,
    });
  });

  it("renders user profile information", () => {
    render(<ProfilePage />);

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("displays loading state when user data is loading", () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      logout: mockLogout,
      updateProfile: mockUpdateProfile,
    });

    render(<ProfilePage />);

    expect(screen.getByText("Profile")).toBeInTheDocument();
    const loader = document.querySelector(".animate-spin");
    expect(loader).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    render(<ProfilePage />);

    expect(
      screen.getByRole("button", { name: /Edit Profile/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Settings/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Log Out/i }),
    ).toBeInTheDocument();
  });

  it("displays user avatar with fallback", () => {
    render(<ProfilePage />);

    const avatar = screen.getByAltText("Test User");
    expect(avatar).toBeInTheDocument();
  });

  it("shows user ID when available", () => {
    render(<ProfilePage />);

    expect(screen.getByText(/ID: user123/i)).toBeInTheDocument();
  });

  it("opens edit profile dialog when edit button is clicked", async () => {
    render(<ProfilePage />);
    const user = userEvent.setup();

    const editButton = screen.getByRole("button", { name: /Edit Profile/i });
    await user.click(editButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Make changes to your profile here/i),
      ).toBeInTheDocument();
    });
  });
});
