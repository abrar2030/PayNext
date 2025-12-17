"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Copy, Loader2 } from "lucide-react";
import { mockApiClient, useMockData, apiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

// Define the form schema using Zod
const formSchema = z.object({
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  memo: z.string().optional(),
});

export default function RequestPage() {
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      memo: "",
    },
  });

  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const client = useMockData ? mockApiClient : apiClient;
      const response = await client.requestPayment({
        amount: values.amount,
        memo: values.memo,
      });

      if (response.success && response.data) {
        const requestData = {
          userId: user?.id || "user123",
          amount: values.amount,
          memo: values.memo || "Payment Request",
          timestamp: Date.now(),
        };
        const paymentLink = `paynext://request?details=${encodeURIComponent(JSON.stringify(requestData))}`;
        setQrValue(paymentLink);
        toast.success("Payment request created successfully!");
      } else {
        toast.error(
          response.error?.message || "Failed to create payment request",
        );
      }
    } catch (error) {
      console.error("Request error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  const copyToClipboard = () => {
    if (qrValue) {
      navigator.clipboard
        .writeText(qrValue)
        .then(() => toast.success("Payment link copied to clipboard!"))
        .catch((err) => {
          console.error("Failed to copy:", err);
          toast.error("Failed to copy link");
        });
    }
  };

  const handleNewRequest = () => {
    setQrValue(null);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Request Money</h1>

      {!qrValue ? (
        <Card>
          <CardHeader>
            <CardTitle>Create Payment Request</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="memo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Memo (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Reason for request" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Request QR Code"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Payment Request</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <QRCodeCanvas
              value={qrValue}
              size={200}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
              includeMargin={true}
            />
            <div className="w-full space-y-2">
              <p className="text-sm font-medium text-center">
                Amount: ${form.getValues("amount").toFixed(2)}
              </p>
              {form.getValues("memo") && (
                <p className="text-xs text-muted-foreground text-center">
                  {form.getValues("memo")}
                </p>
              )}
            </div>
            <div className="w-full p-3 bg-muted rounded-md">
              <p className="text-xs text-muted-foreground break-all font-mono">
                {qrValue}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={copyToClipboard}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy Payment Link
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleNewRequest}
            >
              Create New Request
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
