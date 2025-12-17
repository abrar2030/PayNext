import { render, screen, waitFor } from "@testing-library/react";
import QrScanner from "@/components/QrScanner";

// Mock html5-qrcode
jest.mock("html5-qrcode", () => ({
  Html5QrcodeScanner: jest.fn().mockImplementation(() => ({
    render: jest.fn(),
    clear: jest.fn().mockResolvedValue(undefined),
  })),
  Html5QrcodeScanType: {
    SCAN_TYPE_CAMERA: "camera",
    SCAN_TYPE_FILE: "file",
  },
}));

describe("QrScanner Component", () => {
  const mockOnScanSuccess = jest.fn();
  const mockOnScanFailure = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the QR scanner container", () => {
    const { container } = render(
      <QrScanner
        onScanSuccess={mockOnScanSuccess}
        onScanFailure={mockOnScanFailure}
      />,
    );

    const scannerDiv = container.querySelector("#html5qr-code-full-region");
    expect(scannerDiv).toBeInTheDocument();
  });

  it("initializes scanner on mount", async () => {
    render(
      <QrScanner
        onScanSuccess={mockOnScanSuccess}
        onScanFailure={mockOnScanFailure}
      />,
    );

    await waitFor(() => {
      const { Html5QrcodeScanner } = require("html5-qrcode");
      expect(Html5QrcodeScanner).toHaveBeenCalled();
    });
  });

  it("renders with correct div id for scanner initialization", () => {
    const { container } = render(
      <QrScanner
        onScanSuccess={mockOnScanSuccess}
        onScanFailure={mockOnScanFailure}
      />,
    );

    expect(container.querySelector("#html5qr-code-full-region")).toBeTruthy();
  });

  it("accepts optional onScanFailure prop", () => {
    const { container } = render(
      <QrScanner onScanSuccess={mockOnScanSuccess} />,
    );

    expect(
      container.querySelector("#html5qr-code-full-region"),
    ).toBeInTheDocument();
  });
});
