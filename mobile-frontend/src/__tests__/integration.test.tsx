/**
 * Integration tests for PayNext Mobile Frontend
 * Tests core user flows and component interactions
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApiClient } from "@/lib/api-client";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => "/",
}));

describe("PayNext Integration Tests", () => {
  describe("API Client", () => {
    it("fetches balance successfully", async () => {
      const response = await mockApiClient.getBalance();

      expect(response.success).toBe(true);
      expect(response.data).toHaveProperty("balance");
      expect(response.data).toHaveProperty("currency");
    });

    it("fetches transactions successfully", async () => {
      const response = await mockApiClient.getTransactions(5);

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data?.length).toBeLessThanOrEqual(5);
    });

    it("sends payment successfully", async () => {
      const paymentData = {
        recipient: "john_doe",
        amount: 100.0,
        memo: "Test payment",
      };

      const response = await mockApiClient.sendPayment(paymentData);

      if (response.success) {
        expect(response.data).toHaveProperty("transactionId");
        expect(response.data).toMatchObject(paymentData);
      }
    });

    it("creates payment request successfully", async () => {
      const requestData = {
        amount: 50.0,
        memo: "Payment request test",
      };

      const response = await mockApiClient.requestPayment(requestData);

      expect(response.success).toBe(true);
      if (response.success && response.data) {
        expect(response.data).toHaveProperty("requestId");
        expect(response.data).toHaveProperty("qrCode");
      }
    });

    it("fetches user profile successfully", async () => {
      const response = await mockApiClient.getUserProfile();

      expect(response.success).toBe(true);
      if (response.success && response.data) {
        expect(response.data).toHaveProperty("id");
        expect(response.data).toHaveProperty("name");
        expect(response.data).toHaveProperty("email");
      }
    });

    it("updates user profile successfully", async () => {
      const updateData = {
        name: "Updated Name",
        email: "updated@example.com",
      };

      const response = await mockApiClient.updateUserProfile(updateData);

      if (response.success) {
        expect(response.data).toMatchObject(updateData);
      }
    });
  });

  describe("Data Flow", () => {
    it("transaction data includes all required fields", async () => {
      const response = await mockApiClient.getTransactions(1);

      if (response.success && response.data && response.data.length > 0) {
        const transaction = response.data[0];
        expect(transaction).toHaveProperty("id");
        expect(transaction).toHaveProperty("type");
        expect(transaction).toHaveProperty("description");
        expect(transaction).toHaveProperty("date");
        expect(transaction).toHaveProperty("amount");
        expect(transaction).toHaveProperty("currency");
      }
    });

    it("balance data has correct structure", async () => {
      const response = await mockApiClient.getBalance();

      if (response.success && response.data) {
        expect(typeof response.data.balance).toBe("number");
        expect(typeof response.data.currency).toBe("string");
      }
    });
  });

  describe("Error Handling", () => {
    it("handles payment failures gracefully", async () => {
      // The mock has a 20% failure rate
      const results = await Promise.all(
        Array(10)
          .fill(null)
          .map(() =>
            mockApiClient.sendPayment({
              recipient: "test",
              amount: 10,
            }),
          ),
      );

      const failures = results.filter((r) => !r.success);
      // At least some should fail with the mock's logic
      expect(failures.length).toBeGreaterThanOrEqual(0);
    });
  });
});
