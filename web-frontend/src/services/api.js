import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("isAuthenticated");
        // Redirect to login if not already there
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

// Auth services
export const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isAuthenticated", "true");
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
  },

  getCurrentUser: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },
};

// User services
export const userService = {
  updateProfile: async (userData) => {
    const response = await api.put("/users/profile", userData);
    return response.data;
  },

  getTransactionHistory: async (params) => {
    const response = await api.get("/users/transactions", { params });
    return response.data;
  },
};

// Payment services
export const paymentService = {
  sendMoney: async (paymentData) => {
    const response = await api.post("/payments/send", paymentData);
    return response.data;
  },

  getBalance: async () => {
    const response = await api.get("/payments/balance");
    return response.data;
  },

  getPaymentMethods: async () => {
    const response = await api.get("/payments/methods");
    return response.data;
  },

  addPaymentMethod: async (methodData) => {
    const response = await api.post("/payments/methods", methodData);
    return response.data;
  },
};

// Helper function to simulate API calls for demo purposes
export const simulateApiCall = (data, delay = 1000, shouldFail = false) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Simulated API error"));
      } else {
        resolve({ data });
      }
    }, delay);
  });
};

export default api;
