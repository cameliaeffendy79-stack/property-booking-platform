import {
  ReviewRepository,
  ReservationRepository,
} from "../../repositories";
import {
  CreateReviewDto,
  ReplyReviewDto,
} from "../../types/dto";
import { EditReviewDto } from "../../types/dto/review/edit-review.dto";
import { ReviewValidationService } from "./review-validation.service";
import { ReviewPersistenceService } from "./review-persistence.service";
import { ReviewMapperService } from "./review-mapper.service";

export class ReviewService {
  constructor(
    private readonly validationService: ReviewValidationService,
    private readonly persistenceService: ReviewPersistenceService,
    private readonly reviewRepository: ReviewRepository,
    private readonly reservationRepository: ReservationRepository,
    private readonly mapperService: ReviewMapperService
  ) {}

  //#region Customer

  async createReview(
    userId: number,
    dto: CreateReviewDto
  ) {
    const reservation =
      await this.validationService.validateReservation(
        dto.reservationId
      );

    this.validationService.validateReservationOwner(
      userId,
      reservation.user_id
    );

    this.validationService.validateReservationCompleted(
      reservation.status
    );

    const existingReview =
      await this.validationService.findReviewByReservation(
        dto.reservationId
      );

    this.validationService.validateReviewDoesNotExist(
      existingReview
    );

    const reviewData = {
      reservations: {
        connect: {
          id: BigInt(dto.reservationId),
        },
      },
      properties: {
        connect: {
          id: reservation.rooms.properties.id,
        },
      },
      users: {
        connect: {
          id: BigInt(userId),
        },
      },
      rating: dto.rating,
      comment: dto.comment,
    };

    const review =
      await this.persistenceService.createReview(reviewData);

    return this.mapperService.buildCreateReviewResponse(
      review
    );
  }

  async editReview(
    userId: number,
    dto: EditReviewDto
  ) {
    const review =
      await this.reviewRepository.findCompleteById(
        dto.reviewId
      );

    this.validationService.validateReviewExists(review);

    this.validationService.validateReviewOwnership(
      userId,
      review!.user_id
    );

    this.validationService.validateReservationCompleted(
      review!.reservations.status
    );

    const updatedReview =
      await this.persistenceService.editReview(
        dto.reviewId,
        dto.rating,
        dto.comment
      );

    return this.mapperService.buildEditReviewResponse(
      updatedReview
    );
  }

  //#endregion

  //#region Tenant

  async getTenantReviews(tenantId: number) {
    const reviews =
      await this.reviewRepository.findByTenantId(
        tenantId
      );

    return this.mapperService.buildTenantReviewList(
      reviews
    );
  }

  async replyReview(
    tenantId: number,
    dto: ReplyReviewDto
  ) {
    const review =
      await this.reviewRepository.findCompleteById(
        dto.reviewId
      );

    this.validationService.validateReviewExists(review);

    this.validationService.validateTenantOwnership(
      tenantId,
      review!.properties.tenant_id
    );

    const updatedReview =
      await this.persistenceService.replyReview(
        dto.reviewId,
        dto.reply
      );

    return this.mapperService.buildReplyReviewResponse(
      updatedReview
    );
  }

  //#endregion
}

const reviewRepository = new ReviewRepository();

const reservationRepository =
  new ReservationRepository();

const validationService =
  new ReviewValidationService(
    reservationRepository,
    reviewRepository
  );

const persistenceService =
  new ReviewPersistenceService(
    reviewRepository
  );

const mapperService =
  new ReviewMapperService();

export const reviewService =
  new ReviewService(
    validationService,
    persistenceService,
    reviewRepository,
    reservationRepository,
    mapperService
  );