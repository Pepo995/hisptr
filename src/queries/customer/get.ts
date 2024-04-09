import { useQuery } from "@tanstack/react-query";
import { customerGetById } from "@configs/ApiEndpoints";

import api from "../api";

import type { UserData } from "./types";

type RequestData = {
  id: string,
}

const customerByIdApiCall = (data: RequestData & { type: "customer" }) => async () => {
  const response = await api.post<{ data: { user: UserData } }>(customerGetById, data);

  return response.data.data.user;
};

export const useCustomerById = (data: RequestData) => {
  const { data: customerData, isLoading, error } = useQuery({
    queryKey: ["customerById"],
    queryFn: customerByIdApiCall({ type: "customer", ...data }),
  });

  return { customerData, isLoading, error };
}
