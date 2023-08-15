export class Campaign {
  constructor(
    public id: number,
    public name: string,
    public info: CampaignDetails,
    public lineItems: LineItem[]
  ) {}
}

export class LineItem {
  constructor(
    public id: number,
    public campaignId: number,
    public campaignName: string,
    public name: string,
    public info: LineItemDetails,
    public bookedAmount: number,
    public actualAmount: number,
    public adjustments: number
  ) {}
}

export type LineItemDetails = {
  details: string;
  code: string;
};

export type CampaignDetails = LineItemDetails & {
  company: string;
};

export enum ResponseStatus {
  OK = "ok",
  ERROR = "error",
}

export type CurrencyRateResponse = {
  base?: string;
  disclaimer?: string;
  license?: string;
  rates?: { key: string };
  timestamp?: number;
};
