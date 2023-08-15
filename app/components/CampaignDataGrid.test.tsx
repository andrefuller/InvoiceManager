import { Campaign, CampaignDetails } from "@/types";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import CampaignsDataGrid from "./CampaignsDataGrid";
import { IntlProvider } from "react-intl";

const IntlWrapper = ({ children }: { children: React.ReactNode }) => {
  return <IntlProvider locale="en">{children}</IntlProvider>;
};

describe("CampaignsDataGrid", () => {
  const mockCurrency = "USD";
  const mockCampaigns: Campaign[] = [
    {
      id: 1,
      name: "Example Company : Campaign Details - e333",
      info: {
        company: "Example Company",
        details: "",
        code: "",
      } as CampaignDetails,
      lineItems: [],
    },
  ];

  it("renders the data grid and side panel when a campaign is clicked", async () => {
    const user = userEvent.setup();

    render(
      <CampaignsDataGrid currency={mockCurrency} campaigns={mockCampaigns} />,
      {
        wrapper: IntlWrapper,
      }
    );

    const row = screen.getByText("Example Company");

    await user.click(row);

    const invoicePanel = screen.getByText("Invoice");
    expect(invoicePanel).toBeInTheDocument();
  });

  it("closes the side panel when the close button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <CampaignsDataGrid currency={mockCurrency} campaigns={mockCampaigns} />,
      {
        wrapper: IntlWrapper,
      }
    );

    const row = screen.getByText("Example Company");
    await user.click(row);

    const closeButton = screen.getByTestId("close-button");
    await user.click(closeButton);

    const invoicePanel = screen.queryByText("Invoice");
    expect(invoicePanel).not.toBeInTheDocument();
  });
});
