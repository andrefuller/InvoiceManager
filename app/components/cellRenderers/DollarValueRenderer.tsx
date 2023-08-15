"use client";
import { Typography } from "@mui/material";
import React from "react";

import { FormattedNumber } from "react-intl";

interface DollarValueRendererProps {
  amount: string | number | any;
  currency: string;
  applyColor: boolean;
}

const DollarValueRenderer: React.FC<DollarValueRendererProps> = ({
  amount,
  currency,
  applyColor,
}) => {
  const isNegative: boolean = Number(amount) < 0;

  const props =
    (applyColor && { style: { color: isNegative ? "red" : "green" } }) || {};

  return (
    <>
      <Typography
        data-testid="dollar-value-renderer"
        {...props}
        variant="body1"
        fontWeight={600}
      >
        <FormattedNumber
          value={parseFloat(amount)}
          style="currency"
          currency={currency}
        />
      </Typography>
    </>
  );
};

export default DollarValueRenderer;
