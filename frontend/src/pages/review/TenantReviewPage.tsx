import { MessageSquare } from "lucide-react";

import { TenantMobileHeader } from "@/components/layout/TenantMobileHeader";
import { TenantHeader } from "@/components/layout/TenantHeader";
import { TenantMobileBottomNav } from "@/components/layout/TenantMobileBottomNav";
import PageHeader from "@/components/layout/PageHeader";
import SurfaceCard from "@/components/layout/SurfaceCard";

import {
  useReplyReview,
  useTenantReviews,
} from "@/features/review/hooks/useReview";

import { TenantReviewCard } from "@/features/review/components/TenantReviewCard";

export default function TenantReviewPage() {
  const {
    data: reviews = [],
    isLoading,
    isError,
  } = useTenantReviews();

  const replyMutation = useReplyReview();

  const handleReply = (reviewId: number, reply: string) => {
    replyMutation.mutate({ reviewId, reply });
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface pb-24 md:pb-12">
      <div className="hidden md:block">
        <TenantHeader />
      </div>

      <div className="md:hidden">
        <TenantMobileHeader />
      </div>

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <PageHeader
          title="Customer Reviews"
          description="Read customer reviews and reply to their feedback."
          showBackButton
        />

        {isLoading && (
          <SurfaceCard className="flex min-h-64 items-center justify-center">
            <p className="text-sm text-slate-muted">Loading reviews...</p>
          </SurfaceCard>
        )}

        {isError && !isLoading && (
          <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-600">Failed to load reviews.</p>
          </div>
        )}

        {!isLoading && !isError && reviews.length === 0 && (
          <SurfaceCard className="p-10 text-center">
            <MessageSquare size={36} className="mx-auto text-slate-300" />

            <h2 className="mt-4 font-semibold text-slate-text">No reviews yet</h2>

            <p className="mt-1 text-sm text-slate-muted">
              Customer reviews for your properties will appear here.
            </p>
          </SurfaceCard>
        )}

        {!isLoading && !isError && reviews.length > 0 && (
          <div className="space-y-5">
            {reviews.map((review) => (
              <TenantReviewCard
                key={review.id}
                review={review}
                onReply={handleReply}
                isReplying={
                  replyMutation.isPending &&
                  replyMutation.variables?.reviewId === review.id
                }
              />
            ))}
          </div>
        )}
      </main>

      <TenantMobileBottomNav />
    </div>
  );
}