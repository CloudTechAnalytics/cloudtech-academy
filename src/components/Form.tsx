import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";

const inputCls =
  "mt-1.5 block w-full rounded-lg border bg-paper px-3.5 py-2.5 text-[1rem] text-ink placeholder:text-subtle/70 focus:border-ink/60 focus:outline-2 focus:outline-offset-2 focus:outline-brass-dark";

export function TextField({
  label,
  error,
  hint,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: ReactNode }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-[0.875rem] font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        {...props}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className={`${inputCls} ${error ? "border-danger" : "border-line-strong"}`}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.8125rem] text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-[0.8125rem] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextArea({ label, error, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-[0.875rem] font-medium text-ink">
        {label}
      </label>
      <textarea
        id={id}
        {...props}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`${inputCls} ${error ? "border-danger" : "border-line-strong"} ${props.className ?? ""}`}
      />
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-[0.8125rem] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function Alert({ tone = "info", children }: { tone?: "info" | "error" | "success"; children: ReactNode }) {
  const tones = {
    info: "border-brass/40 bg-brass-pale/40",
    error: "border-danger/40 bg-danger/10",
    success: "border-success/40 bg-success-bg",
  };
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`rounded-lg border px-4 py-3 text-[0.9rem] leading-relaxed text-ink ${tones[tone]}`}>
      {children}
    </div>
  );
}
