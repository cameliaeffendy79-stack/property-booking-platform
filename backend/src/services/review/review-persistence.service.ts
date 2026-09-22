import { Prisma, reviews } from "../../generated/prisma/client";
import { ReviewRepository } from "../../repositories";

export class ReviewPersistenceService {
  constructor(
    private readonly reviewRepository:
      ReviewRepository
  ) {}

  async createReview(
    data: Prisma.reviewsCreateInput
  ): Promise<reviews> {
    return this.reviewRepository.create(data);
  }

  async replyReview(
  reviewId: number,
  reply: string
): Promise<reviews> {
  return this.reviewRepository.updateTenantReply(
    reviewId,
    reply
  );
}

  async editReview(
  reviewId: number,
  rating: number,
  comment: string
): Promise<reviews> {
  return this.reviewRepository.updateReview(
    reviewId,
    rating,
    comment
  );
}


}

