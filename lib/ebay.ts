export interface EbayItemSummary {
  itemId: string;
  title: string;
  condition?: string;
  price?: {
    value: string;
    currency: string;
  };
  soldDate?: string;
}

export interface EbaySearchResponse {
  itemSummaries?: EbayItemSummary[];
}

const EBAY_OAUTH_URL = "https://api.ebay.com/identity/v1/oauth2/token";
const EBAY_BROWSE_URL = "https://api.ebay.com/buy/browse/v1/item_summary/search";

export interface EbayApiConfig {
  appId: string;
  certId: string;
}

export const getEbayAccessToken = async ({
  appId,
  certId,
}: EbayApiConfig): Promise<string> => {
  const credentials = Buffer.from(`${appId}:${certId}`).toString("base64");

  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "https://api.ebay.com/oauth/api_scope",
  });

  const response = await fetch(EBAY_OAUTH_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to get eBay access token: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as { access_token?: string };

  if (!data.access_token) {
    throw new Error("eBay OAuth response is missing access_token");
  }

  return data.access_token;
};

export const fetchSoldListings = async ({
  query,
  limit,
  accessToken,
}: {
  query: string;
  limit: number;
  accessToken: string;
}): Promise<EbayItemSummary[]> => {
  const search = new URLSearchParams({
    q: query,
    limit: String(limit),
    filter: "soldItems:{true}",
  });

  const url = `${EBAY_BROWSE_URL}?${search.toString()}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch sold listings: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as EbaySearchResponse;
  return data.itemSummaries ?? [];
};
