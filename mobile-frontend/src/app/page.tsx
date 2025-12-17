"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import QrScanner from "@/components/QrScanner";
import { toast } from "sonner";
import { mockApiClient, useMockData, apiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

interface Transaction {
  id: string;
  type: string;
  description: string;
  date: string;
  amount: number;
  currency: string;
  status?: string;
}

interface BalanceData {
  balance: number;
  currency: string;
}

export default function HomePage() {
  const [balance, setBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const client = useMockData ? mockApiClient : apiClient;

        const [balanceResponse, transactionResponse] = await Promise.all([
          client.getBalance(),
          client.getTransactions(3),
        ]);

        if (balanceResponse.success && balanceResponse.data) {
          const balanceData = balanceResponse.data as BalanceData;
          setBalance(balanceData.balance);
        } else {
          toast.error("Failed to load balance data");
        }

        if (transactionResponse.success && transactionResponse.data) {
          setTransactions(transactionResponse.data as Transaction[]);
        } else {
          toast.error("Failed to load transaction data");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleScanSuccess = async (decodedText: string, decodedResult: any) => {
    console.log(`Scan result: ${decodedText}`, decodedResult);
    setIsScannerOpen(false);

    try {
      // Parse QR code data
      if (decodedText.startsWith("paynext://")) {
        const url = new URL(decodedText);
        const action = url.hostname;

        if (action === "request") {
          // Handle payment request QR
          const detailsParam = url.searchParams.get("details");
          if (detailsParam) {
            const details = JSON.parse(decodeURIComponent(detailsParam));
            // Navigate to send page with pre-filled data
            router.push(
              `/send?recipient=${details.userId}&amount=${details.amount}&memo=${encodeURIComponent(details.memo || "")}`,
            );
            toast.success("Opening payment form...");
          }
        } else if (action === "pay") {
          // Handle direct payment QR
          const detailsParam = url.searchParams.get("details");
          if (detailsParam) {
            const details = JSON.parse(decodeURIComponent(detailsParam));
            router.push(
              `/send?recipient=${details.recipient}&amount=${details.amount}`,
            );
            toast.success("Opening payment form...");
          }
        } else {
          toast.info(`QR Code Scanned: ${decodedText}`);
        }
      } else {
        // Generic QR code - treat as recipient ID
        router.push(`/send?recipient=${encodeURIComponent(decodedText)}`);
        toast.info("Recipient scanned. Opening payment form...");
      }
    } catch (error) {
      console.error("Failed to parse QR code:", error);
      toast.error("Invalid QR code format");
    }
  };

  const handleScanFailure = (error: any) => {
    // Silently handle scan failures - they're expected during scanning
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
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
          {user && (
            <p className="text-xs text-primary-foreground/60 mt-1">
              Welcome, {user.name}
            </p>
          )}
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
              <Landmark className="h-6 w-6 mb-1 text-green-500" />
              <span className="text-xs">Request</span>
            </Button>
          </Link>

          {/* QR Scan Dialog */}
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
                {isScannerOpen && (
                  <QrScanner
                    onScanSuccess={handleScanSuccess}
                    onScanFailure={handleScanFailure}
                  />
                )}
              </div>
              <DialogClose asChild className="absolute top-4 right-4">
                <Button type="button" variant="ghost" size="icon">
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
                    <p className="text-xs text-muted-foreground">
                      {formatDate(tx.date)}
                    </p>
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
