import React from "react";
import { render, screen } from "@testing-library/react";
import AvatarRenderer from "./AvatarRenderer";
import { CampaignDetails } from "@/types";

describe("AvatarRenderer", () => {
  const mockDetails: CampaignDetails = {
    company: "Example Company",
  } as CampaignDetails;

  it("renders the Avatar component with the correct text", () => {
    render(<AvatarRenderer details={mockDetails} />);

    const avatarComponent = screen.getByTestId("avatar");

    expect(avatarComponent.textContent).toBe("E");
  });
});
