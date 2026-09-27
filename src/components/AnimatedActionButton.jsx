import { useEffect, useState } from "react";

export default function AnimatedActionButton({
  loading = false,
  success = false,
  error = false,
  type = "submit",
}) {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      setShowSuccess(true);

      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, [success]);

  let status = "idle";

  if (loading) {
    status = "loading";
  } else if (error) {
    status = "error";
  } else if (showSuccess) {
    status = "success";
  }

  const getContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <span className="button-spinner" aria-hidden="true" />
            <span>Generating...</span>
          </>
        );

      case "success":
        return (
          <>
            <span className="button-icon" aria-hidden="true">
              ✓
            </span>
            <span>Plan Generated!</span>
          </>
        );

      case "error":
        return (
          <>
            <span className="button-icon" aria-hidden="true">
              !
            </span>
            <span>Try Again</span>
          </>
        );

      default:
        return (
          <>
            <span>Generate Study Plan</span>
            <span aria-hidden="true">→</span>
          </>
        );
    }
  };

  return (
    <button
      type={type}
      className={`animated-action-button ${status}`}
      disabled={loading}
      aria-disabled={loading}
      aria-busy={loading}
    >
      <span className="button-content">{getContent()}</span>
    </button>
  );
}