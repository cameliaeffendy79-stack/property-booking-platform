import cron from "node-cron";
import {
  ReservationRepository,
} from "../repositories";

const reservationRepository =
  new ReservationRepository();

function getJakartaNow(): Date {
  return new Date(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date())
  );
}

function getJakartaDate(): Date {
  const jakartaDate =
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

  return new Date(`${jakartaDate}T00:00:00+07:00`);
}

function hasCheckoutTimePassed(
  checkoutDate: Date,
  checkoutTime: Date,
  now: Date
): boolean {
  const checkoutDateString =
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(checkoutDate);

  const checkoutHours =
    checkoutTime.getUTCHours();

  const checkoutMinutes =
    checkoutTime.getUTCMinutes();

  const checkoutSeconds =
    checkoutTime.getUTCSeconds();

  const checkoutDateTime =
    new Date(
      `${checkoutDateString}T` +
      `${String(checkoutHours).padStart(2, "0")}:` +
      `${String(checkoutMinutes).padStart(2, "0")}:` +
      `${String(checkoutSeconds).padStart(2, "0")}` +
      `+07:00`
    );

  return now >= checkoutDateTime;
}

export function startReservationCompletionCron(): void {
  cron.schedule(
    "* * * * *",
    async () => {
      try {
        const now = getJakartaNow();
        const today = getJakartaDate();

        const reservations =
          await reservationRepository
            .findConfirmedReservationsForCompletion(
              today
            );

        let completedCount = 0;

        for (const reservation of reservations) {
          const checkoutTime =
            reservation.rooms.properties
              .check_out_time;

          if (!checkoutTime) {
            console.warn(
              `⚠️ Checkout time is missing for reservation ${reservation.booking_code}`
            );

            continue;
          }

          const checkoutPassed =
            hasCheckoutTimePassed(
              reservation.check_out,
              checkoutTime,
              now
            );

          if (!checkoutPassed) {
            continue;
          }

          await reservationRepository.completeReservation(
            Number(reservation.id),
            now
            );

          completedCount++;
        }

        if (completedCount > 0) {
          console.log(
            `✅ Reservation completion processed: ${completedCount} reservation(s)`
          );
        }
      } catch (error) {
        console.error(
          "❌ Failed to process completed reservations:",
          error
        );
      }
    },
    {
      timezone: "Asia/Jakarta",
    }
  );
}