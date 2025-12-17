import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SendPage from "@/app/send/page";
import { useSearchParams } from "next/navigation";

// Mock dependencies
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/lib/api-client");

describe("SendPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });
  });

  it("renders the send money form", () => {
    render(<SendPage />);

    expect(screen.getByText("Send Money")).toBeInTheDocument();
    expect(screen.getByLabelText(/Recipient/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Memo/i)).toBeInTheDocument();
  });

  it("pre-fills form from URL parameters", () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => {
        const params: Record<string, string> = {
          recipient: "john_doe",
          amount: "100.50",
          memo: "Test payment",
        };
        return params[key] || null;
      },
    });

    render(<SendPage />);

    expect(screen.getByDisplayValue("john_doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("100.5")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test payment")).toBeInTheDocument();
  });

  it("shows validation error for empty recipient", async () => {
    render(<SendPage />);
    const user = userEvent.setup();

    const submitButton = screen.getByRole("button", { name: /Send Money/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Recipient must be at least 3 characters/i),
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid amount", async () => {
    render(<SendPage />);
    const user = userEvent.setup();

    const recipientInput = screen.getByLabelText(/Recipient/i);
    await user.type(recipientInput, "john_doe");

    const amountInput = screen.getByLabelText(/Amount/i);
    await user.clear(amountInput);
    await user.type(amountInput, "-10");

    const submitButton = screen.getByRole("button", { name: /Send Money/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Amount must be a positive number/i),
      ).toBeInTheDocument();
    });
  });

  it("has properly labeled form fields", () => {
    render(<SendPage />);

    expect(screen.getByLabelText(/Recipient/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount \(\$\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Memo \(Optional\)/i)).toBeInTheDocument();
  });
});
