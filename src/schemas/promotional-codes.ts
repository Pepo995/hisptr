import dayjs from "dayjs";
import { z } from "zod";

export const createPromotionalCodeSchema = z.object({
  code: z.string(),
  discount: z.number(),
  isPercentage: z.boolean(),
  isOneTime: z.boolean(),
  expiresAt: z.date().min(dayjs().startOf("day").toDate(), {
    message: "Expiration date must be at least today",
  }),
});
