import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "../Dashboard";

const MockDashboard = () => (
  <BrowserRouter>
    <Dashboard />
  </BrowserRouter>
);

describe("Dashboard Page", () => {
  test("renders dashboard heading", () => {
    render(<MockDashboard />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("displays balance card", async () => {
    render(<MockDashboard />);
    await waitFor(() => {
      expect(screen.getByText(/Available Balance/i)).toBeInTheDocument();
    });
  });
});
