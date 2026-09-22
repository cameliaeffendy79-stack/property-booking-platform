import prisma from "../config/prisma";
import { Prisma, reviews } from "../generated/prisma/client";

export class ReviewRepository {
  async create(data: Prisma.reviewsCreateInput): Promise<reviews> {
    return prisma.reviews.create({ data });
  }

  async findByReservationId(
    reservationId: number
  ): Promise<reviews | null> {
    return prisma.reviews.findUnique({
      where: { reservation_id: BigInt(reservationId) },
    });
  }

  async findByTenantId(tenantId: number) {
    return prisma.reviews.findMany({
      where: {
        properties: {
          tenant_id: BigInt(tenantId),
        },
      },
      include: {
        properties: true,
        users: true,
        reservations: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async updateComment(
    reviewId: number,
    comment: string
  ): Promise<reviews> {
    return prisma.reviews.update({
      where: { id: BigInt(reviewId) },
      data: { comment },
    });
  }

  async updateTenantReply(
    reviewId: number,
    tenantReply: string
  ): Promise<reviews> {
    return prisma.reviews.update({
      where: { id: BigInt(reviewId) },
      data: {
        tenant_reply: tenantReply,
        replied_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async updateRepliedAt(
    reviewId: number,
    repliedAt: Date
  ): Promise<reviews> {
    return prisma.reviews.update({
      where: { id: BigInt(reviewId) },
      data: { replied_at: repliedAt },
    });
  }

  async findCompleteById(reviewId: number) {
    return prisma.reviews.findUnique({
      where: { id: BigInt(reviewId) },
      include: {
        properties: true,
        users: true,
        reservations: true,
      },
    });
  }

  async updateReview(
    reviewId: number,
    rating: number,
    comment: string
  ): Promise<reviews> {
    return prisma.reviews.update({
      where: { id: BigInt(reviewId) },
      data: {
        rating,
        comment,
        updated_at: new Date(),
      },
    });
  }
}