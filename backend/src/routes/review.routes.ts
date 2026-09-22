import { Router } from "express";
import { reviewController } from "../controllers/review.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { user_role } from "../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(user_role.CUSTOMER),
  reviewController.createReview
);

router.get(
  "/tenant",
  authenticate,
  authorize(user_role.TENANT),
  reviewController.getTenantReviews
);

router.patch(
  "/:id",
  authenticate,
  authorize(user_role.CUSTOMER),
  reviewController.editReview
);

router.patch(
  "/:id/reply",
  authenticate,
  authorize(user_role.TENANT),
  reviewController.replyReview
);

export default router;