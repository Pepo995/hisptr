import { env } from "~/env.mjs";

import defaultAvatar from "@images/portrait/small/avatar.jpeg";

export const userImageUrl = (imagePath?: string | null) => {
  if (imagePath) {
    return `https://${env.NEXT_PUBLIC_S3_BUCKET_HOST}/${imagePath}`;
  }
  return defaultAvatar.src;
};
