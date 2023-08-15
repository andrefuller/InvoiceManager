import React from "react";
import { render, screen } from "@testing-library/react";
import DollarValueRenderer from "./DollarValueRenderer";

jest.mock("react-intl", () => ({
  FormattedNumber: jest.fn(({ value, style, currency }) => (
    <span data-testid="formatted-number">
      {style}, {currency}, {value}
    </span>
  )),
}));

describe("DollarValueRenderer", () => {
  const mockProps = {
    amount: "-100",
    currency: "USD",
    applyColor: true,
  };

  it("renders the FormattedNumber component with the correct props", () => {
    render(<DollarValueRenderer {...mockProps} />);

    const component = screen.getByTestId("dollar-value-renderer");

    expect(component.textContent).toBe("currency, USD, -100");

    expect(component).toHaveStyle("color: red");
  });

  it("renders without applying color if applyColor is false", () => {
    render(<DollarValueRenderer {...mockProps} applyColor={false} />);

    const component = screen.getByTestId("dollar-value-renderer");

    expect(component).not.toHaveStyle("color: green");
  });
});
