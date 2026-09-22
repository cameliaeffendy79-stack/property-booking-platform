import app from "./app";
import { env } from "./config/env";
import { startReservationReminderCron } from "./cron/reservation-reminder.cron";
import { startReservationCompletionCron } from "./cron/reservation-completion.cron";
import { startReservationExpirationCron } from "./cron/reservation-expiration.cron";


startReservationReminderCron();
startReservationCompletionCron();
startReservationExpirationCron();


app.listen(env.PORT, () => {
  console.log(
    `🚀 Server is running at http://localhost:${env.PORT}`
  );
});