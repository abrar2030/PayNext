/**
 * API Client for PayNext Mobile Frontend
 * Handles all HTTP requests to the backend API Gateway
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || `${API_BASE_URL}/api`;

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_GATEWAY_URL) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  private loadToken(): void {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  public setToken(token: string): void {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  public clearToken(): void {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            message: data.message || "An error occurred",
            status: response.status,
            code: data.code,
          },
        };
      }

      return {
        success: true,
        data: data as T,
      };
    } catch (error) {
      console.error("API request failed:", error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : "Network error",
          status: 0,
        },
      };
    }
  }

  // User endpoints
  async login(email: string, password: string) {
    return this.request("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: { name: string; email: string; password: string }) {
    return this.request("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getUserProfile() {
    return this.request("/users/profile", {
      method: "GET",
    });
  }

  async updateUserProfile(userData: { name?: string; email?: string }) {
    return this.request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  // Balance endpoints
  async getBalance() {
    return this.request("/payments/balance", {
      method: "GET",
    });
  }

  // Transaction endpoints
  async getTransactions(limit: number = 10) {
    return this.request(`/transactions?limit=${limit}`, {
      method: "GET",
    });
  }

  async getTransactionById(id: string) {
    return this.request(`/transactions/${id}`, {
      method: "GET",
    });
  }

  // Payment endpoints
  async sendPayment(paymentData: {
    recipient: string;
    amount: number;
    memo?: string;
  }) {
    return this.request("/payments/send", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  }

  async requestPayment(requestData: { amount: number; memo?: string }) {
    return this.request("/payments/request", {
      method: "POST",
      body: JSON.stringify(requestData),
    });
  }

  async processQrPayment(qrData: string) {
    return this.request("/payments/qr", {
      method: "POST",
      body: JSON.stringify({ qrData }),
    });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Mock fallback for development/testing
export const useMockData = process.env.NEXT_PUBLIC_ENV === "development";

export const mockApiClient = {
  async getBalance() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      data: { balance: 1234.56, currency: "USD" },
    };
  },

  async getTransactions(limit: number = 10) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      data: [
        {
          id: "1",
          type: "debit",
          description: "Coffee Shop",
          date: "2025-04-28",
          amount: -5.5,
          currency: "USD",
          status: "completed",
        },
        {
          id: "2",
          type: "credit",
          description: "Salary Deposit",
          date: "2025-04-27",
          amount: 2500.0,
          currency: "USD",
          status: "completed",
        },
        {
          id: "3",
          type: "debit",
          description: "Online Store",
          date: "2025-04-26",
          amount: -78.9,
          currency: "USD",
          status: "completed",
        },
      ].slice(0, limit),
    };
  },

  async sendPayment(paymentData: {
    recipient: string;
    amount: number;
    memo?: string;
  }) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const success = Math.random() > 0.2; // 80% success rate
    if (success) {
      return {
        success: true,
        data: {
          transactionId: `txn_${Date.now()}`,
          status: "completed",
          ...paymentData,
        },
      };
    } else {
      return {
        success: false,
        error: {
          message: "Payment failed. Please try again.",
          status: 400,
        },
      };
    }
  },

  async requestPayment(requestData: { amount: number; memo?: string }) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      success: true,
      data: {
        requestId: `req_${Date.now()}`,
        qrCode: `paynext://request?details=${encodeURIComponent(JSON.stringify(requestData))}`,
        ...requestData,
      },
    };
  },

  async getUserProfile() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      success: true,
      data: {
        id: "user_123",
        name: "Alex Johnson",
        email: "alex.j@example.com",
        avatarUrl: "https://github.com/shadcn.png",
      },
    };
  },

  async updateUserProfile(userData: { name?: string; email?: string }) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const success = Math.random() > 0.2;
    if (success) {
      return {
        success: true,
        data: userData,
      };
    } else {
      return {
        success: false,
        error: {
          message: "Failed to update profile",
          status: 400,
        },
      };
    }
  },
};
