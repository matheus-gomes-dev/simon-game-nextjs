interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export default function LoadingSpinner({
  size = "md",
  label = "Loading...",
}: LoadingSpinnerProps) {
  return (
    <div role="status" aria-label={label} className="flex justify-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-600 border-t-indigo-500`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
