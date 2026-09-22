import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createReview,
  editReview,
  getTenantReviews,
  replyReview,
} from "../api/review.api";

import type {
  CreateReviewPayload,
  EditReviewPayload,
  ReplyReviewPayload,
} from "../types/review.types";

export const useCreateReview = () => {
  return useMutation({
    mutationFn: (
      payload: CreateReviewPayload
    ) => createReview(payload),
  });
};

export const useEditReview = () => {
  return useMutation({
    mutationFn: (
      payload: EditReviewPayload
    ) => editReview(payload),
  });
};

export const useTenantReviews = () => {
  return useQuery({
    queryKey: ["tenant-reviews"],
    queryFn: getTenantReviews,
  });
};

export const useReplyReview = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload: ReplyReviewPayload
    ) => replyReview(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tenant-reviews"],
      });
    },
  });
};