"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Send,
  Landmark,
} from "lucide-react"; // Import icons
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"; // Import Dialog components
import QrScanner from "@/components/QrScanner"; // Import the QrScanner component
import { toast } from "sonner";

// Placeholder function for API calls (remains the same for now)
const fetchFromApi = async (endpoint: string) => {
  console.log(`Fetching from API: ${endpoint}`);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate slightly longer delay

  if (endpoint === "/api/balance") {
    return { balance: 1234.56, currency: "USD" };
  }
  if (endpoint === "/api/transactions?limit=3") {
    return [
      {
        id: 1,
        type: "debit",
        description: "Coffee Shop",
        date: "Apr 28, 2025",
        amount: -5.5,
        currency: "USD",
      },
      {
        id: 2,
        type: "credit",
        description: "Salary Deposit",
        date: "Apr 27, 2025",
        amount: 2500.0,
        currency: "USD",
      },
      {
        id: 3,
        type: "debit",
        description: "Online Store",
        date: "Apr 26, 2025",
        amount: -78.9,
        currency: "USD",
      },
    ];
  }
  return null;
};

export default function HomePage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const balanceData = await fetchFromApi("/api/balance");
        const transactionData = await fetchFromApi("/api/transactions?limit=3");
        if (balanceData) setBalance(balanceData.balance);
        if (transactionData) setTransactions(transactionData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load dashboard data.");
      }
      setLoading(false);
    };
    loadData();
  }, []);

  // Handler for successful QR scan
  const handleScanSuccess = (decodedText: string, decodedResult: any) => {
    console.log(`Scan result: ${decodedText}`, decodedResult);
    toast.success(`QR Code Scanned: ${decodedText}`);
    setIsScannerOpen(false); // Close the dialog after successful scan
    // TODO: Add logic to handle the scanned data (e.g., prefill send form, navigate)
  };

  // Handler for scan failure (optional)
  const handleScanFailure = (error: any) => {
    // console.error(`Scan failed: ${error}`);
    // toast.error("QR Scan Failed. Please try again.");
  };

  return (
    <div className="space-y-6">
      {/* Balance Section */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-primary-foreground shadow-lg">
        <CardHeader>
          <CardDescription className="text-primary-foreground/80">
            Current Balance
          </CardDescription>
          <CardTitle className="text-4xl font-bold">
            {loading ? (
              <Skeleton className="h-10 w-3/4 bg-white/20" />
            ) : (
              `$${balance !== null ? balance.toFixed(2) : "N/A"}`
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-primary-foreground/80">Available Funds</p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <Link href="/send" passHref>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 w-full"
            >
              <Send className="h-6 w-6 mb-1 text-blue-500" />
              <span className="text-xs">Send</span>
            </Button>
          </Link>
          <Link href="/request" passHref>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-24 w-full"
            >
              <Landmark className="h-6 w-6 mb-1 text-green-500" />{" "}
              {/* Changed icon for Request */}
              <span className="text-xs">Request</span>
            </Button>
          </Link>

          {/* QR Scan Dialog Trigger */}
          <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-24 w-full"
              >
                <QrCode className="h-6 w-6 mb-1 text-purple-500" />
                <span className="text-xs">Scan QR</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md w-full p-0">
              <DialogHeader className="p-4 border-b">
                <DialogTitle>Scan QR Code</DialogTitle>
              </DialogHeader>
              <div className="p-4">
                {/* Render scanner only when dialog is open */}
                {isScannerOpen && (
                  <QrScanner
                    onScanSuccess={handleScanSuccess}
                    onScanFailure={handleScanFailure}
                  />
                )}
              </div>
              <DialogClose asChild className="absolute top-4 right-4">
                <Button type="button" variant="ghost" size="icon">
                  {/* Add a close icon if desired, or rely on clicking outside */}
                  <span className="sr-only">Close</span>
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <Button variant="link" size="sm" className="text-blue-600">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : transactions.length > 0 ? (
            <ul className="space-y-4">
              {transactions.map((tx) => (
                <li key={tx.id} className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full ${tx.amount < 0 ? "bg-red-100 dark:bg-red-900" : "bg-green-100 dark:bg-green-900"}`}
                  >
                    {tx.amount < 0 ? (
                      <ArrowUpRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                    ) : (
                      <ArrowDownLeft className="h-5 w-5 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-sm">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <p
                    className={`font-medium text-sm ${tx.amount < 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                  >
                    {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent transactions.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
