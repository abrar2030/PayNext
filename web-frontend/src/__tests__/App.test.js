import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App Component", () => {
  test("renders without crashing", () => {
    render(<App />);
    expect(screen.getAllByText("PayNext").length).toBeGreaterThan(0);
  });
});
