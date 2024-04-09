import { availabilityEventList, upcomingEventList } from "@configs/ApiEndpoints";
import { api } from "~/api";

export const UpcomingEventAPICall = () => {
  return async () => {
    const response = await api(upcomingEventList, {}, "get");
    if (response.status === 200) {
      return response;
    } else {
      return response;
    }
  };
};
export const AvailabilityListAPICall = () => {
  return async () => {
    const response = await api(availabilityEventList, {}, "get");
    if (response.status === 200) {
      return response;
    } else {
      return response;
    }
  };
};
