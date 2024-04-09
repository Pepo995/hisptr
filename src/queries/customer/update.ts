import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileUpdate } from "@configs/ApiEndpoints";

import { api as trpcAPI } from "@utils/api";
import api from "../api";

import type { UserData } from "./types";
import { toast } from "react-toastify";

export const profileUpdateApiCall = async (data: FormData) =>
  await api.postForm<{ data: { user: UserData } }>(profileUpdate, data);

export const useProfileUpdate = () => {
  const queryClient = useQueryClient();
  const trpcContext = trpcAPI.useContext();

  const {
    mutate: updateProfile,
    mutateAsync: updateProfileAsync,
    isLoading,
    error,
  } = useMutation({
    mutationFn: profileUpdateApiCall,
    onSuccess: async (_response) => {
      toast.success("Profile updated successfully");

      await Promise.all([
        await queryClient.invalidateQueries({
          queryKey: ["customerById"],
        }),
        await trpcContext.usersRouter.getUser.invalidate(),
      ]);
    },
    onError: (_error) => {
      toast.error("Profile update failed");
    },
  });

  return { updateProfile, updateProfileAsync, isLoading, error };
};
