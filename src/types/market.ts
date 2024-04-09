export type RetailField = {
  "Holiday Retail Price": number;
  "Retail Price": number;
  "Array Holiday Retail Price": number;
  "Array Retail Price": number;
  "360 Holiday Retail Price": number;
  "360 Retail Price": number;

  "2025 Retail Price": number;
  "2025 Array Retail Price": number;
  "2025 360 Retail Price": number;
};

export type PromotionalField = {
  "Promotional Price": number;
  "Holiday Promotional Price": number;
  "Array Promotional Price": number;
  "Array Holiday Promotional Price": number;
  "360 Promotional Price": number;
  "360 Holiday Promotional Price": number;

  "2025 Promotional Price": number;
  "2025 Array Promotional Price": number;
  "2025 360 Promotional Price": number;
};

type AirTableField = {
  Name: string;
  State: string;
} & PromotionalField &
  RetailField;

export type AirTableMarket = {
  id: string;
  createdTime: string;
  fields: AirTableField;
};

export type MarketArray = {
  records: AirTableMarket[];
};
