import initialData from "@/public/placements_teaser_data.json";
import { Campaign, CampaignDetails, LineItem, LineItemDetails } from "@/types";

export const isProduction = process.env.NODE_ENV === "production";

const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

export const stringAvatar = (label: string) => {
  return {
    sx: {
      bgcolor: stringToColor(label),
    },
    children: `${label.split("")[0][0]}`,
  };
};

export const splitCampaignDetails = (inputString: string): CampaignDetails => {
  const regexPattern = /^(.*?): (.*?) - (.*)$/;

  const match = inputString.match(regexPattern);

  let details = {};

  if (match) {
    details = {
      company: match[1],
      details: match[2],
      code: match[3],
    };
  }

  return details as CampaignDetails;
};

export const splitLineItemDetails = (inputString: string): LineItemDetails => {
  const regexPattern = /^(.*?) - (.*)$/;

  const match = inputString.match(regexPattern);

  let details = {};

  if (match) {
    details = {
      details: match[1],
      code: match[2],
    };
  }

  return details as LineItemDetails;
};

export const calculateSubtotal = (params: any) => {
  const lineItem = params.row as LineItem;
  return lineItem.actualAmount + lineItem.adjustments;
};

export const calculateInvoiceTotal = (lineItems: Array<LineItem>): number => {
  return lineItems.reduce(
    (subtotal, lineItem) =>
      subtotal + lineItem.actualAmount + lineItem.adjustments,
    0
  );
};

export const getCampaignsFromData = (): Campaign[] => {
  const campaignsMap = new Map<number, Campaign>();

  initialData.forEach((item) => {
    const campaignId = item.campaign_id;

    if (!campaignsMap.has(campaignId)) {
      campaignsMap.set(
        campaignId,
        new Campaign(
          campaignId,
          item.campaign_name,
          splitCampaignDetails(item.campaign_name),
          []
        )
      );
    }

    const lineItem: LineItem = new LineItem(
      item.id,
      item.campaign_id,
      item.campaign_name,
      item.line_item_name,
      splitLineItemDetails(item.line_item_name),
      item.booked_amount,
      item.actual_amount,
      item.adjustments
    );

    campaignsMap.get(campaignId)?.lineItems.push(lineItem);
  });

  return Array.from(campaignsMap.values());
};
