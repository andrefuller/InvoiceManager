import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SettingsToolbar from "./SettingsToolbar";

describe("SettingsToolbar", () => {
  const mockCurrencyRates = {
    USD: 1.0,
    EUR: 0.85,
    GBP: 0.73,
  };

  const mockSelectedCurrency = "USD";
  const mockHandleCurrencySelect = jest.fn();

  it("renders the SettingsToolbar component with correct currency options", async () => {
    const user = userEvent.setup();

    render(
      <SettingsToolbar
        isLoading={false}
        currencyRates={mockCurrencyRates}
        selectedCurrency={mockSelectedCurrency}
        handleCurrencySelect={mockHandleCurrencySelect}
      />
    );

    await waitFor(async () => {
      const currencySelect = document.querySelector('div[role="button"]');
      await user.click(currencySelect!);

      const usdOption = screen.getAllByText("USD")[0];
      const eurOption = screen.getAllByText("EUR")[0];
      const gbpOption = screen.getAllByText("GBP")[0];
      expect(usdOption).toBeInTheDocument();
      expect(eurOption).toBeInTheDocument();
      expect(gbpOption).toBeInTheDocument();
    });
  });

  it("calls handleCurrencySelect when currency is selected", async () => {
    const user = userEvent.setup();

    render(
      <SettingsToolbar
        isLoading={false}
        currencyRates={mockCurrencyRates}
        selectedCurrency={mockSelectedCurrency}
        handleCurrencySelect={mockHandleCurrencySelect}
      />
    );

    await waitFor(async () => {
      const currencySelect = document.querySelector('div[role="button"]');
      await user.click(currencySelect!);

      const eurOption = screen.getAllByText("EUR")[0];
      await user.click(eurOption);

      expect(mockHandleCurrencySelect).toHaveBeenCalledWith("EUR");
    });
  });
});
