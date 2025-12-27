import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Homepage from "../Homepage";

const MockHomepage = () => (
  <BrowserRouter>
    <Homepage />
  </BrowserRouter>
);

describe("Homepage", () => {
  test("renders main heading", () => {
    render(<MockHomepage />);
    expect(
      screen.getByText(/Next Generation Payment Solution/i),
    ).toBeInTheDocument();
  });

  test("renders feature cards", () => {
    render(<MockHomepage />);
    expect(screen.getByText(/Fast Transactions/i)).toBeInTheDocument();
    expect(screen.getByText(/Secure Payments/i)).toBeInTheDocument();
  });

  test("renders get started button", () => {
    render(<MockHomepage />);
    const getStartedButtons = screen.getAllByText(/Get Started/i);
    expect(getStartedButtons.length).toBeGreaterThan(0);
  });

  test("renders testimonials", () => {
    render(<MockHomepage />);
    expect(screen.getByText(/What Our Users Say/i)).toBeInTheDocument();
  });
});
