export type PullRateSnapshot = {
  packSlug: string;
  cardSlug: string;
  probability: number;
  sourceName: string;
  isEstimated: boolean;
};

export const fetchPullRates = async (): Promise<PullRateSnapshot[]> => {
  return [];
};
