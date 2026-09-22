import cron from "node-cron";
import {
  ReservationRepository,
  AvailabilityRepository,
  PaymentRepository,
} from "../repositories";
import { ReservationBookingService } from "../services/reservation/reservation-booking.service";
import { ReservationPersistenceService } from "../services/reservation/reservation-persistence.service";

const reservationRepository =
  new ReservationRepository();

const availabilityRepository =
  new AvailabilityRepository();

const paymentRepository =
  new PaymentRepository();

const bookingService =
  new ReservationBookingService();

const persistenceService =
  new ReservationPersistenceService(
    bookingService,
    reservationRepository,
    paymentRepository,
    availabilityRepository
  );

export function startReservationExpirationCron(): void {
  cron.schedule(
    "* * * * *",
    async () => {
      try {
        const now = new Date();

        const reservations =
          await reservationRepository
            .findExpiredWaitingPaymentReservations(
              now
            );

        let expiredCount = 0;

        for (const reservation of reservations) {
          const expired =
            await persistenceService.expireReservation(
              reservation
            );

          if (expired) {
            expiredCount++;
          }
        }

        if (expiredCount > 0) {
          console.log(
            `✅ Reservation expiration processed: ${expiredCount} reservation(s)`
          );
        }
      } catch (error) {
        console.error(
          "❌ Failed to process expired reservations:",
          error
        );
      }
    },
    {
      timezone: "Asia/Jakarta",
    }
  );
}