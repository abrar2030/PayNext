import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../Login";

const MockLogin = () => (
  <BrowserRouter>
    <Login onLogin={() => {}} />
  </BrowserRouter>
);

describe("Login Page", () => {
  test("renders login form", () => {
    render(<MockLogin />);
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign In/i }),
    ).toBeInTheDocument();
  });

  test("shows validation error for empty fields", async () => {
    render(<MockLogin />);
    const submitButton = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(
        screen.getByText(/Please fill in all fields/i),
      ).toBeInTheDocument();
    });
  });
});
