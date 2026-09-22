export interface CreateReviewPayload {
  reservationId: number;
  rating: number;
  comment: string;
}

export interface CreateReviewResponse {
  id: number;
  reservationId: number;
  propertyId: number;
  userId: number;
  rating: number;
  comment: string | null;
  tenantReply: string | null;
  repliedAt: string | null;
}

export interface EditReviewPayload {
  reviewId: number;
  rating: number;
  comment: string;
}

export interface EditReviewResponse {
  id: number;
  reservationId: number;
  propertyId: number;
  userId: number;
  rating: number;
  comment: string | null;
  tenantReply: string | null;
  repliedAt: string | null;
}

export interface ReplyReviewPayload {
  reviewId: number;
  reply: string;
}

export interface ReplyReviewResponse {
  id: number;
  reservationId: number;
  propertyId: number;
  userId: number;
  rating: number;
  comment: string | null;
  tenantReply: string | null;
  repliedAt: string | null;
}

export interface TenantReview {
  id: number;
  reservationId: number;
  bookingCode: string;
  propertyId: number;
  propertyName: string;
  userId: number;
  customerName: string;
  rating: number;
  comment: string | null;
  tenantReply: string | null;
  repliedAt: string | null;
  createdAt: string | null;
}