/* eslint-disable react-hooks/rules-of-hooks */
import { stateApiCall } from "@redux/action/CountryAction";
import { preferenceApiCall } from "@redux/action/EventAction";
import { allPartnerListingApiCall } from "@redux/action/PartnerAction";
import { useQuery } from "@tanstack/react-query";
import type { EventType, State } from "@types";

type SortQueryParams = {
  sortField?: string;
  sortOrder?: "asc" | "desc";
};

type StateResponse = {
  data: {
    data: {
      states: State[];
    };
  };
};

type EventTypeResponse = {
  data: {
    data: {
      preferences: EventType[];
    };
  };
};

type PartnerResponse = {
  data: {
    data: {
      users: {
        id: number;
        first_name: string;
        last_name: string;
        type: string;
        company: string;
        is_active: number;
        invitation_status: string;
        email: string;
        module_flag: number;
        is_online: boolean;
        countries: {
          id: number;
          user_id: number;
          country_id: number;
        };
      }[];
    };
  };
};

export type FilterResponse = {
  data: {
    data: {
      preferences: { id: number; name: string; code: string }[];
    };
  };
};

export function getStateQuery({ sortField = "name", sortOrder = "asc" }: SortQueryParams) {
  const { isLoading, error, data } = useQuery({
    queryKey: ["states"],
    queryFn: async () => {
      const resFunction = stateApiCall({
        sort_field: sortField,
        sort_order: sortOrder,
      });
      const response: StateResponse = await resFunction();
      return response.data.data.states;
    },
  });

  return { isLoading, error, data };
}

export function getEventTypesQuery({ sortField = "name", sortOrder = "asc" }: SortQueryParams) {
  const { isLoading, error, data } = useQuery({
    queryKey: ["eventTypes"],
    queryFn: async () => {
      const resFunction = preferenceApiCall({
        sort_field: sortField,
        sort_order: sortOrder,
        type: "type",
      });
      const response: EventTypeResponse = await resFunction();
      return response.data.data.preferences;
    },
  });

  return { isLoading, error, data };
}

export function getEventCategoriesQuery({
  sortField = "name",
  sortOrder = "asc",
}: SortQueryParams) {
  const { isLoading, error, data } = useQuery({
    queryKey: ["eventCategory"],
    queryFn: async () => {
      const resFunction = preferenceApiCall({
        sort_field: sortField,
        sort_order: sortOrder,
        type: "category",
      });
      const response: EventTypeResponse = await resFunction();
      return response.data.data.preferences;
    },
  });

  return { isLoading, error, data };
}

export function getPartnersQuery({
  marketId,
  sortField = "company",
  sortOrder = "asc",
}: SortQueryParams & { marketId: number }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const resFunction = allPartnerListingApiCall({
        type: "partner",
        sort_field: sortField,
        sort_order: sortOrder,
        market_id: marketId,
      });
      const response: PartnerResponse = await resFunction();
      return response.data.data.users;
    },
  });

  return { isLoading, error, data };
}

export function getFiltersQuery() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["filters"],
    queryFn: async () => {
      const resFunction = preferenceApiCall({
        type: "filter",
        sort_field: "id",
        sort_order: "asc",
      });
      const response: FilterResponse = await resFunction();
      return response.data.data.preferences;
    },
  });
  return { isLoading, error, data };
}

export function getOrientationQuery() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["orientation"],
    queryFn: async () => {
      const resFunction = preferenceApiCall({
        type: "orientation",
        sort_field: "id",
        sort_order: "asc",
      });
      const response: FilterResponse = await resFunction();
      return response.data.data.preferences;
    },
  });
  return { isLoading, error, data };
}

export function getDesignQuery() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["design"],
    queryFn: async () => {
      const resFunction = preferenceApiCall({
        type: "design",
        sort_field: "id",
        sort_order: "asc",
      });
      const response: FilterResponse = await resFunction();
      return response.data.data.preferences;
    },
  });
  return { isLoading, error, data };
}

export function getBackdropQuery() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["backdrop"],
    queryFn: async () => {
      const resFunction = preferenceApiCall({
        type: "backdrop",
        sort_field: "id",
        sort_order: "asc",
      });
      const response: FilterResponse = await resFunction();
      return response.data.data.preferences;
    },
  });
  return { isLoading, error, data };
}

export function getReachViaQuery() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["reachVia"],
    queryFn: async () => {
      const resFunction = preferenceApiCall({
        type: "reach_via",
        sort_field: "id",
        sort_order: "asc",
      });
      const response: FilterResponse = await resFunction();
      return response.data.data.preferences;
    },
  });
  return { isLoading, error, data };
}
