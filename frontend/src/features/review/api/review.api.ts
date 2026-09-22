import { api } from "@/services/api/axios";

import type {
  CreateReviewPayload,
  CreateReviewResponse,
  EditReviewPayload,
  EditReviewResponse,
  ReplyReviewPayload,
  ReplyReviewResponse,
  TenantReview,
} from "../types/review.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const createReview = async (
  payload: CreateReviewPayload
): Promise<CreateReviewResponse> => {
  const response =
    await api.post<ApiResponse<CreateReviewResponse>>(
      "/reviews",
      payload
    );

  return response.data.data;
};

export const editReview = async (
  payload: EditReviewPayload
): Promise<EditReviewResponse> => {
  const response =
    await api.patch<ApiResponse<EditReviewResponse>>(
      `/reviews/${payload.reviewId}`,
      {
        rating: payload.rating,
        comment: payload.comment,
      }
    );

  return response.data.data;
};

export const getTenantReviews =
  async (): Promise<TenantReview[]> => {
    const response =
      await api.get<ApiResponse<TenantReview[]>>(
        "/reviews/tenant"
      );

    return response.data.data;
  };

export const replyReview = async (
  payload: ReplyReviewPayload
): Promise<ReplyReviewResponse> => {
  const response =
    await api.patch<ApiResponse<ReplyReviewResponse>>(
      `/reviews/${payload.reviewId}/reply`,
      {
        reply: payload.reply,
      }
    );

  return response.data.data;
};