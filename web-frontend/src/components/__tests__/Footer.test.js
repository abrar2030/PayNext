import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Footer from "../Footer";

const MockFooter = () => (
  <BrowserRouter>
    <Footer />
  </BrowserRouter>
);

describe("Footer Component", () => {
  test("renders footer content", () => {
    render(<MockFooter />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`${currentYear}`, "i")),
    ).toBeInTheDocument();
  });
});
