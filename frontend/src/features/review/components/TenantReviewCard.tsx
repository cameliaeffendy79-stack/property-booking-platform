import { useState } from "react";
import {
  Check,
  Loader2,
  MessageSquare,
  Star,
} from "lucide-react";

import type { TenantReview } from "../types/review.types";

interface TenantReviewCardProps {
  review: TenantReview;
  onReply: (
    reviewId: number,
    reply: string
  ) => void;
  isReplying: boolean;
}

export function TenantReviewCard({
  review,
  onReply,
  isReplying,
}: TenantReviewCardProps) {
  const [reply, setReply] = useState(
    review.tenantReply ?? ""
  );

  const hasReply = Boolean(
    review.tenantReply
  );

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const trimmedReply =
      reply.trim();

    if (!trimmedReply || hasReply) {
      return;
    }

    onReply(
      review.id,
      trimmedReply
    );
  };

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-gray-900">
            {review.propertyName}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Booking {review.bookingCode}
          </p>
        </div>

        <div className="flex items-center gap-1">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <Star
              key={index}
              size={18}
              className={
                index < review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
            />
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-sm font-medium text-gray-900">
          {review.customerName}
        </p>

        {review.comment ? (
          <p className="mt-2 text-sm leading-6 text-gray-600">
            {review.comment}
          </p>
        ) : (
          <p className="mt-2 text-sm italic text-gray-400">
            Customer did not leave a comment.
          </p>
        )}
      </div>

      {hasReply ? (
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="flex items-center gap-2">
            <Check
              size={17}
              className="text-green-600"
            />

            <p className="text-sm font-semibold text-gray-900">
              Your Reply
            </p>
          </div>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            {review.tenantReply}
          </p>

          {review.repliedAt && (
            <p className="mt-2 text-xs text-gray-400">
              Replied{" "}
              {new Date(
                review.repliedAt
              ).toLocaleDateString()}
            </p>
          )}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-100 pt-4"
        >
          <div className="mb-3 flex items-center gap-2">
            <MessageSquare
              size={17}
              className="text-gray-600"
            />

            <p className="text-sm font-semibold text-gray-900">
              Reply to this review
            </p>
          </div>

          <textarea
            value={reply}
            onChange={(event) =>
              setReply(event.target.value)
            }
            rows={4}
            placeholder="Write your reply..."
            disabled={isReplying}
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50"
          />

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={
                isReplying ||
                !reply.trim()
              }
              className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isReplying && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}

              {isReplying
                ? "Sending..."
                : "Reply"}
            </button>
          </div>
        </form>
      )}
    </article>
  );
}