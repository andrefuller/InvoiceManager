import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InvoicePanel from "./InvoicePanel";
import { Campaign } from "@/types";
import { IntlProvider } from "react-intl";

const IntlWrapper = ({ children }: { children: React.ReactNode }) => {
  return <IntlProvider locale="en">{children}</IntlProvider>;
};

describe("InvoicePanel", () => {
  const mockCurrency = "USD";
  const mockCampaign: Campaign = {
    id: 123,
    name: "Example Company : Campaign details - ABC",
    info: {
      company: "Example Company",
      code: "ABC",
      details: "Campaign details",
    },
    lineItems: [],
  } as Campaign;

  const mockOnClose = jest.fn();

  it("renders the InvoicePanel component with correct information", () => {
    render(
      <InvoicePanel
        currency={mockCurrency}
        campaign={mockCampaign}
        onClose={mockOnClose}
      />,
      {
        wrapper: IntlWrapper,
      }
    );

    // Assert that campaign information is rendered
    const companyText = screen.getByText("Example Company");
    const codeChip = screen.getByText("ABC");
    const detailsText = screen.getByText("Campaign details");
    expect(companyText).toBeInTheDocument();
    expect(codeChip).toBeInTheDocument();
    expect(detailsText).toBeInTheDocument();

    // Assert that Invoice Total is rendered
    const invoiceTotalText = screen.getByText("Invoice Total:");
    expect(invoiceTotalText).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <InvoicePanel
        currency={mockCurrency}
        campaign={mockCampaign}
        onClose={mockOnClose}
      />,
      {
        wrapper: IntlWrapper,
      }
    );

    // Click on the close button
    const closeButton = screen.getByTestId("close-button");
    await user.click(closeButton);

    // Assert that onClose is called
    expect(mockOnClose).toHaveBeenCalled();
  });
});
