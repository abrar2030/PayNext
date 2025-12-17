"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { mockApiClient, useMockData, apiClient } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

// Define the form schema using Zod
const formSchema = z.object({
  recipient: z.string().min(3, {
    message: "Recipient must be at least 3 characters.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  memo: z.string().optional(),
});

export default function SendPage() {
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: "",
      amount: 0,
      memo: "",
    },
  });

  // Pre-fill form from URL parameters
  useEffect(() => {
    const recipient = searchParams.get("recipient");
    const amount = searchParams.get("amount");
    const memo = searchParams.get("memo");

    if (recipient) {
      form.setValue("recipient", decodeURIComponent(recipient));
    }
    if (amount) {
      form.setValue("amount", parseFloat(amount));
    }
    if (memo) {
      form.setValue("memo", decodeURIComponent(memo));
    }
  }, [searchParams, form]);

  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const client = useMockData ? mockApiClient : apiClient;
      const response = await client.sendPayment({
        recipient: values.recipient,
        amount: values.amount,
        memo: values.memo,
      });

      if (response.success) {
        toast.success(
          `Successfully sent $${values.amount.toFixed(2)} to ${values.recipient}!`,
        );
        form.reset();
      } else {
        toast.error(
          response.error?.message || "Failed to send money. Please try again.",
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Send Money</h1>
      <Card>
        <CardHeader>
          <CardTitle>Send Form</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="recipient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter recipient name or ID"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the username, email, or phone number of the
                      recipient.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      <Input placeholder="Add a note" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Money"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
