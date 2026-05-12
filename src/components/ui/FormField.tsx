interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
  errors?: string[];
}

export default function FormField({
  id,
  label,
  type = "text",
  autoComplete,
  placeholder,
  hint,
  errors,
}: FormFieldProps) {
  const hasErrors = errors && errors.length > 0;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const describedBy = hasErrors
    ? errorId
    : hint
      ? hintId
      : undefined;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-300"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required
        autoComplete={autoComplete}
        aria-describedby={describedBy}
        aria-invalid={hasErrors ? "true" : undefined}
        className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder={placeholder}
      />
      {hint && (
        <p id={hintId} className="mt-1 text-xs text-gray-500">
          {hint}
        </p>
      )}
      {hasErrors && (
        <div id={errorId} role="alert">
          {errors.map((msg) => (
            <p key={msg} className="mt-1 text-sm text-red-400">
              {msg}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
