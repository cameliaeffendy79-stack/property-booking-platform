import { Router } from "express";
import { reservationController } from "../controllers/reservation.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { user_role } from "../generated/prisma/enums";

const router = Router();


router.use(
  authenticate,
  authorize(user_role.CUSTOMER)
);

/**
 * User Reservation
 */
router.post(
  "/",
  reservationController.createReservation
);

router.get(
  "/my-reservations",
  reservationController.getMyReservations
);

router.get(
  "/:id",
  reservationController.getReservationById
);

router.patch(
  "/:id/cancel",
  reservationController.cancelReservation
);

router.patch(
  "/:id/tenant-cancel",
  authenticate,
  authorize(user_role.TENANT),
  reservationController.tenantCancelReservation
);

export default router;