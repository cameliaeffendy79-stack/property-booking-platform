import {
  ArrowLeft,
  Loader2,
  Star,
} from "lucide-react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { Header } from "@/components/layout/Header";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

import { useReservation } from "@/features/reservation/hooks/useReservation";
import {
  useCreateReview,
  useEditReview,
} from "@/features/review/hooks/useReview";
import { ReviewForm } from "@/features/review/components/ReviewForm";
import type { CreateReviewFormValues } from "@/validations/review.schema";

export default function ReviewPage() {
  const { reservationId } = useParams<{
    reservationId: string;
  }>();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isEditMode =
    searchParams.get("edit") === "true";

  const parsedId = reservationId
    ? Number(reservationId)
    : undefined;

  const {
    data: reservation,
    isLoading,
    isError,
    error,
  } = useReservation(parsedId);

  const createReviewMutation = useCreateReview();
  const editReviewMutation = useEditReview();

  const formatDate = (date: string) => {
    return date.split("T")[0];
  };

  const handleCreate = async (
    values: CreateReviewFormValues,
  ) => {
    try {
      await createReviewMutation.mutateAsync(values);
      navigate(`/reservations/${parsedId}`);
    } catch {
      // Error is displayed below the form.
    }
  };

  const handleEdit = async (
    values: CreateReviewFormValues,
  ) => {
    if (!reservation?.review) {
      return;
    }

    try {
      await editReviewMutation.mutateAsync({
        reviewId: reservation.review.id,
        rating: values.rating,
        comment: values.comment,
      });

      navigate(`/reservations/${parsedId}`);
    } catch {
      // Error is displayed below the form.
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-midnight-indigo" />
      </div>
    );
  }

  if (isError || !reservation) {
    return (
      <PageMessage
        title="Reservation Not Found"
        message={
          (error as Error)?.message ||
          "The reservation could not be found."
        }
        buttonText="Back to My Reservations"
        onClick={() => navigate("/my-reservations")}
      />
    );
  }

  if (reservation.reservationStatus !== "COMPLETED") {
    return (
      <PageMessage
        title="Review Not Available"
        message="You can only review a completed reservation."
        buttonText="Back to Reservation"
        onClick={() =>
          navigate(`/reservations/${parsedId}`)
        }
      />
    );
  }

  if (reservation.review && !isEditMode) {
    return (
      <ReviewDetails
        reservation={reservation}
        onBack={() =>
          navigate(`/reservations/${parsedId}`)
        }
        onEdit={() =>
          navigate(
            `/reviews/${parsedId}?edit=true`,
          )
        }
        formatDate={formatDate}
      />
    );
  }

  const isEditing =
    Boolean(reservation.review) && isEditMode;

  const mutationError = isEditing
    ? editReviewMutation.error
    : createReviewMutation.error;

  const isSubmitting = isEditing
    ? editReviewMutation.isPending
    : createReviewMutation.isPending;

  return (
    <ReviewLayout>
      <button
        type="button"
        onClick={() =>
          navigate(`/reservations/${parsedId}`)
        }
        className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Reservation
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {isEditing ? "Edit Your Review" : "Write a Review"}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {isEditing
            ? "Update your experience with this stay."
            : "Share your experience with this stay."}
        </p>
      </div>

      <StayInformation
        propertyName={reservation.propertyName}
        roomName={reservation.roomName}
        checkInDate={formatDate(
          reservation.checkInDate,
        )}
        checkOutDate={formatDate(
          reservation.checkOutDate,
        )}
        guestCount={reservation.guestCount}
      />

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <ReviewForm
          reservationId={reservation.id}
          initialRating={
            reservation.review?.rating ?? 0
          }
          initialComment={
            reservation.review?.comment ?? ""
          }
          submitLabel={
            isEditing ? "Save Changes" : "Submit Review"
          }
          submittingLabel={
            isEditing ? "Saving..." : "Submitting..."
          }
          onSubmit={
            isEditing ? handleEdit : handleCreate
          }
          isSubmitting={isSubmitting}
        />

        {mutationError && (
          <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {(mutationError as Error)?.message ||
              "Failed to save review. Please try again."}
          </p>
        )}
      </div>
    </ReviewLayout>
  );
}

interface PageMessageProps {
  title: string;
  message: string;
  buttonText: string;
  onClick: () => void;
}

function PageMessage({
  title,
  message,
  buttonText,
  onClick,
}: PageMessageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="hidden md:block">
        <Header />
      </div>

      <div className="block md:hidden">
        <MobileHeader />
      </div>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">
            {title}
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            {message}
          </p>

          <button
            type="button"
            onClick={onClick}
            className="mt-6 rounded-lg bg-midnight-indigo px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            {buttonText}
          </button>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

interface ReviewDetailsProps {
  reservation: {
    propertyName: string;
    roomName: string;
    checkInDate: string;
    checkOutDate: string;
    guestCount: number;
    review: {
      id: number;
      rating: number;
      comment: string | null;
      tenantReply: string | null;
      repliedAt: string | null;
    } | null;
  };
  onBack: () => void;
  onEdit: () => void;
  formatDate: (date: string) => string;
}

function ReviewDetails({
  reservation,
  onBack,
  onEdit,
}: ReviewDetailsProps) {
  const review = reservation.review;

  if (!review) {
    return null;
  }

  return (
    <ReviewLayout>
      <button
        type="button"
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500 transition hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Reservation
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Review Details
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Your review for {reservation.propertyName}.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Rating
        </p>

        <div className="mt-2 flex gap-1">
          {Array.from({ length: 5 }).map(
            (_, index) => (
              <Star
                key={index}
                className={`h-5 w-5 ${
                  index < review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-slate-300"
                }`}
              />
            ),
          )}
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-slate-500">
            Your Review
          </p>

          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {review.comment || "-"}
          </p>
        </div>

        {review.tenantReply && (
          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              Property Response
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {review.tenantReply}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onEdit}
          className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-800"
        >
          Edit Review
        </button>
      </div>
    </ReviewLayout>
  );
}

function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 pb-24 md:pb-12">
      <div className="hidden md:block">
        <Header />
      </div>

      <div className="block md:hidden">
        <MobileHeader />
      </div>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      <MobileBottomNav />
    </div>
  );
}

function StayInformation({
  propertyName,
  roomName,
  checkInDate,
  checkOutDate,
  guestCount,
}: {
  propertyName: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
}) {
  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-900">
        Stay Information
      </h2>

      <div className="space-y-4 text-sm">
        <div>
          <p className="text-slate-500">Property</p>
          <p className="mt-1 font-semibold text-slate-800">
            {propertyName}
          </p>
        </div>

        <div>
          <p className="text-slate-500">Room</p>
          <p className="mt-1 font-semibold text-slate-800">
            {roomName}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-500">Check-in</p>
            <p className="mt-1 font-semibold text-slate-800">
              {checkInDate}
            </p>
          </div>

          <div>
            <p className="text-slate-500">Check-out</p>
            <p className="mt-1 font-semibold text-slate-800">
              {checkOutDate}
            </p>
          </div>
        </div>

        <div>
          <p className="text-slate-500">Guests</p>
          <p className="mt-1 font-semibold text-slate-800">
            {guestCount} Guest(s)
          </p>
        </div>
      </div>
    </div>
  );
}