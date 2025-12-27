import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "../Navbar";

const MockNavbar = () => (
  <BrowserRouter>
    <Navbar />
  </BrowserRouter>
);

describe("Navbar Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders PayNext logo", () => {
    render(<MockNavbar />);
    expect(screen.getAllByText("PayNext")[0]).toBeInTheDocument();
  });

  test("renders navigation links", () => {
    render(<MockNavbar />);
    expect(screen.getByText("Pricing")).toBeInTheDocument();
    expect(screen.getByText("Help")).toBeInTheDocument();
  });
});
