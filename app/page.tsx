"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { CssBaseline, Container } from "@mui/material";
import { blue, orange, red } from "@mui/material/colors";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { debounce } from "@mui/material/utils";

import { Campaign, CurrencyRateResponse, ResponseStatus } from "../types";
import { getCampaignsFromData } from "./utils";
import AppToolbar from "./components/AppToolbar";
import CampaignsDataGrid from "./components/CampaignsDataGrid";
import SettingsToolbar from "./components/SettingsToolbar";
import fx from "money";
import { IntlProvider } from "react-intl";

const App = (): React.ReactNode => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userLocale, setUserLocale] = useState<string>("en");
  const [currencyRates, setCurrencyRates] = useState<{ key: string } | any>();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const handleCurrencySelect = (selectedCurrency: string) => {
    setSelectedCurrency(selectedCurrency);
  };

  const [darkMode, setDarkMode] = useState<boolean>(false);
  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    setDarkMode(storedMode ? (JSON.parse(storedMode) as boolean) : false);
  }, []);

  const handleDarkModeToggle = useCallback(() => {
    setDarkMode(!darkMode);
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: blue.A700,
      },
      secondary: {
        main: orange.A700,
      },
      error: {
        main: red.A400,
      },
    },
  });

  const getData = useMemo(
    () =>
      debounce(
        async (
          url: string,
          callback: (status: string, response?: [], error?: Error) => void
        ) => {
          try {
            const response = await fetch(url);

            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }

            const jsonData: [] = (await response.json()) as [];

            callback(ResponseStatus.OK, jsonData);
          } catch (error: any) {
            callback(ResponseStatus.ERROR, undefined, error as Error);
          }
        },
        400
      ),
    []
  );

  useEffect(() => {
    setIsLoading(true);

    void getData(
      `https://openexchangerates.org/api/latest.json?app_id=${process.env.NEXT_PUBLIC_OPEN_EXCHANGES_APP_ID}`,
      (status: string, response: any, error?: Error) => {
        if (error) {
          // TODO: Better error state handling/display (i.e. Error boundaries?)
          setCurrencyRates({});
        } else if (status === ResponseStatus.OK) {
          if (response) {
            const { base, rates } = response as CurrencyRateResponse;
            fx.rates = rates!;
            fx.base = base!;
            setCurrencyRates(rates);
          }
        }

        setCampaigns(getCampaignsFromData());
        setIsLoading(false);
      }
    );
  }, [getData]);

  useEffect(() => {
    // @ts-expect-error
    setUserLocale(navigator.language || navigator["userLanguage"] || "en");
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <IntlProvider locale={userLocale} defaultLocale="en">
          <AppToolbar
            darkMode={darkMode}
            handleDarkModeToggle={handleDarkModeToggle}
          />

          <Container maxWidth="lg">
            <SettingsToolbar
              isLoading={isLoading}
              currencyRates={currencyRates}
              selectedCurrency={selectedCurrency}
              handleCurrencySelect={handleCurrencySelect}
            />

            <CampaignsDataGrid
              currency={selectedCurrency}
              isLoading={isLoading}
              campaigns={campaigns}
            />
          </Container>
        </IntlProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
