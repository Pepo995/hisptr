import { useMutation } from "@tanstack/react-query";
import { profileImageDelete } from "@configs/ApiEndpoints";

import api from "../api";

export const deleteImageAPICall = async () => await api.delete(profileImageDelete);

export const useDeleteImage = () => {
  const { mutate: deleteImage, mutateAsync: deleteImageAsync, isLoading, error } = useMutation({
    mutationFn: deleteImageAPICall,
  })

  return { deleteImage, deleteImageAsync, isLoading, error };
}
