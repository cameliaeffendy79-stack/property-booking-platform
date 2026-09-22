import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Shows a back button above the title. Defaults to browser history back; pass `backTo` to target a specific route instead. */
  showBackButton?: boolean;
  backTo?: string;
}

export default function PageHeader({
  title,
  description,
  showBackButton = false,
  backTo,
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="mb-6">
      {showBackButton && (
        <button
          type="button"
          onClick={handleBack}
          className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-slate-muted transition hover:text-midnight-indigo"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      )}

      <h1 className="text-xl font-bold text-midnight-indigo sm:text-2xl">
        {title}
      </h1>

      {description && (
        <p className="mt-1 text-xs text-slate-muted sm:text-sm">
          {description}
        </p>
      )}
    </div>
  );
}