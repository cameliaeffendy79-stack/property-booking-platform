import { z } from "zod";

export const editReviewSchema = z.object({
  reviewId: z
    .number()
    .int()
    .positive(),

  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating must not exceed 5."),

  comment: z
    .string()
    .trim()
    .min(5, "Comment must be at least 5 characters.")
    .max(1000, "Comment must not exceed 1000 characters."),
});