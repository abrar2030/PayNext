import { render, screen } from "@testing-library/react";
import BottomNav from "@/components/BottomNav";
import { usePathname } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("BottomNav Component", () => {
  it("renders all navigation items", () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    render(<BottomNav />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
    expect(screen.getByText("Request")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("highlights the active route", () => {
    (usePathname as jest.Mock).mockReturnValue("/send");

    render(<BottomNav />);

    const sendLink = screen.getByText("Send").closest("a");
    expect(sendLink).toHaveClass("text-primary");
  });

  it("renders correct navigation links", () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    render(<BottomNav />);

    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
    expect(screen.getByText("Send").closest("a")).toHaveAttribute(
      "href",
      "/send",
    );
    expect(screen.getByText("Request").closest("a")).toHaveAttribute(
      "href",
      "/request",
    );
    expect(screen.getByText("Profile").closest("a")).toHaveAttribute(
      "href",
      "/profile",
    );
  });

  it("applies correct CSS classes to the navigation container", () => {
    (usePathname as jest.Mock).mockReturnValue("/");

    const { container } = render(<BottomNav />);

    const nav = container.querySelector("nav");
    expect(nav).toHaveClass("fixed", "bottom-0");
  });
});
