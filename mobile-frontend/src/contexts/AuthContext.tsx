"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient, mockApiClient, useMockData } from "@/lib/api-client";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: { name?: string; email?: string }) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        await refreshUser();
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const refreshUser = async () => {
    try {
      const client = useMockData ? mockApiClient : apiClient;
      const response = await client.getUserProfile();
      if (response.success && response.data) {
        setUser(response.data as User);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In development, auto-succeed with mock data
      if (useMockData) {
        const mockToken = "mock_jwt_token_" + Date.now();
        apiClient.setToken(mockToken);
        const profileResponse = await mockApiClient.getUserProfile();
        if (profileResponse.success && profileResponse.data) {
          setUser(profileResponse.data as User);
          toast.success("Logged in successfully!");
          return true;
        }
      } else {
        const response = await apiClient.login(email, password);
        if (response.success && response.data) {
          const { token, user: userData } = response.data as any;
          apiClient.setToken(token);
          setUser(userData);
          toast.success("Logged in successfully!");
          return true;
        } else {
          toast.error(response.error?.message || "Login failed");
          return false;
        }
      }
    } catch (error) {
      toast.error("Login failed");
      return false;
    }
    return false;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const response = await apiClient.register({ name, email, password });
      if (response.success) {
        toast.success("Registration successful! Please log in.");
        return true;
      } else {
        toast.error(response.error?.message || "Registration failed");
        return false;
      }
    } catch (error) {
      toast.error("Registration failed");
      return false;
    }
  };

  const logout = () => {
    apiClient.clearToken();
    setUser(null);
    toast.info("Logged out successfully");
  };

  const updateProfile = async (data: {
    name?: string;
    email?: string;
  }): Promise<boolean> => {
    try {
      const client = useMockData ? mockApiClient : apiClient;
      const response = await client.updateUserProfile(data);
      if (response.success) {
        setUser((prev) => (prev ? { ...prev, ...data } : null));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
