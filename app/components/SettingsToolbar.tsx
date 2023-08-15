import { Divider, MenuItem, Stack, TextField } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";

interface SettingsDrawerProps {
  isLoading?: boolean;
  selectedCurrency: string;
  currencyRates: object;
  handleCurrencySelect: (selectedCurrency: string) => void;
}

const SettingsToolbar: React.FC<SettingsDrawerProps> = ({
  isLoading,
  currencyRates,
  selectedCurrency,

  handleCurrencySelect,
}) => {
  const [currencyValues, setCurrencyValues] = useState<
    Array<{ value: string; label: string }>
  >([]);

  useEffect(() => {
    if (currencyRates) {
      const values = Object.entries(currencyRates).map(([key, value]: any) => {
        return { label: key, value };
      });

      setCurrencyValues(values);
    }
  }, [currencyRates]);

  const handleSelect = (event: any) => {
    const { value } = event.target;
    handleCurrencySelect(value);
  };
  return (
    <Grid container component="nav" justifyContent="flex-end">
      <Divider orientation="vertical" />

      <Grid sx={{ textAlign: "center" }} xs={2}>
        <Stack paddingTop={4} marginRight={1}>
          {currencyValues.length > 0 && (
            <TextField
              disabled={isLoading}
              id="outlined-select-currency"
              select
              size="small"
              label="Currency"
              value={selectedCurrency}
              onChange={handleSelect}
            >
              {currencyValues.map((items, index) => (
                <MenuItem key={index} value={items.label}>
                  {items.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default SettingsToolbar;
