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
import { Copy } from "lucide-react";

// Define the form schema using Zod
const formSchema = z.object({
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  memo: z.string().optional(),
});

export default function RequestPage() {
  const [qrValue, setQrValue] = useState<string | null>(null);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      memo: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Simulate generating a payment link or request details
    const requestDetails = {
      userId: "user123", // Placeholder user ID
      amount: values.amount,
      memo: values.memo || "Payment Request",
      timestamp: Date.now(),
    };
    const paymentLink = `paynext://request?details=${encodeURIComponent(JSON.stringify(requestDetails))}`;
    setQrValue(paymentLink);
    toast.info("QR Code generated for your request.");
  }

  const copyToClipboard = () => {
    if (qrValue) {
      navigator.clipboard
        .writeText(qrValue)
        .then(() => toast.success("Payment link copied to clipboard!"))
        .catch((err) => toast.error("Failed to copy link."));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Request Money</h1>
      <Card>
        <CardHeader>
          <CardTitle>Create Payment Request</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <Button type="submit" className="w-full">
                Generate Request QR Code
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {qrValue && (
        <Card>
          <CardHeader>
            <CardTitle>Scan QR Code or Copy Link</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <QRCodeCanvas
              value={qrValue}
              size={200} // Adjust size as needed
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
              includeMargin={true}
            />
            <p className="text-xs text-muted-foreground break-all">{qrValue}</p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={copyToClipboard}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy Payment Link
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
