import React from "react";
import { render, screen } from "@testing-library/react";
import AppToolbar from "./AppToolbar";

describe("AppToolbar", () => {
  const mockDarkMode = true;
  const mockHandleDarkModeToggle = jest.fn();

  it("renders the toolbar with the correct title and dark mode switch", () => {
    render(
      <AppToolbar
        darkMode={mockDarkMode}
        handleDarkModeToggle={mockHandleDarkModeToggle}
      />
    );

    const titleElement = screen.getByText("Invoice Manager");
    const darkModeSwitch = screen.getByTestId("dark-mode-toggle");

    expect(titleElement).toBeInTheDocument();
    expect(darkModeSwitch).toBeInTheDocument();
  });

  it("sets aria-checked attribute correctly", () => {
    render(
      <AppToolbar
        darkMode={mockDarkMode}
        handleDarkModeToggle={mockHandleDarkModeToggle}
      />
    );

    const darkModeSwitch = screen.getByTestId("dark-mode-toggle");

    expect(darkModeSwitch).toHaveAttribute("aria-checked", "true");
  });
});
