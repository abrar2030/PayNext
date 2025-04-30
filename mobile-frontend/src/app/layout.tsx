import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav"; // Import the BottomNav component

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PayNext Mobile",
  description: "Modern mobile frontend for PayNext",
  // Add viewport settings for mobile responsiveness
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        <div className="min-h-screen flex flex-col">
          {/* Header can go here if needed */}
          {/* Adjust main content padding to account for bottom nav */}
          <main className="flex-grow container mx-auto p-4 pb-20"> {/* Added pb-20 */}
            {children}
          </main>
          <BottomNav /> {/* Add the BottomNav component here */}
          {/* Footer can go here if needed */}
        </div>
      </body>
    </html>
  );
}

