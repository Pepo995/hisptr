import { api } from "@utils/api";

export const useListMarkets = () => {
  const { data: marketsList, isLoading, error } = api.marketRouter.listMarkets.useQuery();

  return { marketsList, isLoading, error };
};
