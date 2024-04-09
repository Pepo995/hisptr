import { api } from "@utils/api";

export const useListAddOns = () => {
  const { data: addOnsList, isLoading, error } = api.addOnRouter.listAddOns.useQuery();

  return { addOnsList, isLoading, error };
};
