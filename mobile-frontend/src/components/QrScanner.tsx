"use client";

import { useEffect, useRef, useState } from "react";
import {
  Html5QrcodeScanner,
  Html5QrcodeScanType,
  QrcodeErrorCallback,
  QrcodeSuccessCallback,
} from "html5-qrcode";
import { toast } from "sonner";

interface QrScannerProps {
  onScanSuccess: (decodedText: string, decodedResult: any) => void;
  onScanFailure?: (error: any) => void;
}

const QrScanner: React.FC<QrScannerProps> = ({
  onScanSuccess,
  onScanFailure,
}) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const qrcodeRegionId = "html5qr-code-full-region";

  useEffect(() => {
    // Ensure this runs only on the client
    if (typeof window !== "undefined") {
      const verbose = false; // Set to true for debugging

      // Define callbacks
      const qrCodeSuccessCallback: QrcodeSuccessCallback = (
        decodedText,
        decodedResult,
      ) => {
        if (decodedText !== scanResult) {
          // Prevent multiple calls for the same scan
          setScanResult(decodedText);
          if (scannerRef.current) {
            // Optionally stop scanning after success
            // scannerRef.current.clear().catch(error => {
            //   console.error("Failed to clear html5-qrcode scanner.", error);
            // });
          }
          onScanSuccess(decodedText, decodedResult);
        }
      };

      const qrCodeErrorCallback: QrcodeErrorCallback = (errorMessage) => {
        // Handle scan errors, e.g., QR code not found
        // console.warn(`QR Code scan error: ${errorMessage}`);
        if (onScanFailure) {
          onScanFailure(errorMessage);
        }
      };

      // Create scanner instance if it doesn't exist
      if (!scannerRef.current) {
        const html5QrcodeScanner = new Html5QrcodeScanner(
          qrcodeRegionId,
          {
            fps: 10,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
              const qrboxSize = Math.floor(minEdge * 0.7); // Use 70% of the smaller edge
              return {
                width: qrboxSize,
                height: qrboxSize,
              };
            },
            rememberLastUsedCamera: true,
            supportedScanTypes: [
              Html5QrcodeScanType.SCAN_TYPE_CAMERA,
              // Html5QrcodeScanType.SCAN_TYPE_FILE // Optionally add file scanning
            ],
          },
          verbose,
        );

        // Start scanning
        html5QrcodeScanner.render(qrCodeSuccessCallback, qrCodeErrorCallback);
        scannerRef.current = html5QrcodeScanner;
      }

      // Cleanup function to clear the scanner on component unmount
      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch((error) => {
            console.error(
              "Failed to clear html5-qrcode scanner on unmount.",
              error,
            );
          });
          scannerRef.current = null;
        }
      };
    }
  }, [onScanSuccess, onScanFailure, scanResult]); // Add dependencies

  return <div id={qrcodeRegionId} className="w-full"></div>;
};

export default QrScanner;
