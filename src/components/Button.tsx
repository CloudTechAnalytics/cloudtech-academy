import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const base =
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-[0.9375rem] font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary: "min-h-11 px-5 py-2.5 bg-brass-button text-on-brass shadow-[0_1px_2px_rgba(23,23,23,0.12)] hover:bg-brass-button-hover",
  secondary: "min-h-11 px-5 py-2.5 border border-line-strong bg-paper text-ink hover:border-ink/40",
  ghost: "min-h-11 px-3 py-2.5 text-ink hover:bg-sand",
  danger: "min-h-11 px-5 py-2.5 border border-danger/40 text-danger hover:bg-danger/10",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

export function ButtonLink({
  to,
  variant = "primary",
  arrow,
  className = "",
  children,
}: {
  to: string;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link to={to} className={buttonClass(variant, className)}>
      {children}
      {arrow && <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
    </Link>
  );
}

export function Button({
  variant = "primary",
  loading,
  className = "",
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; loading?: boolean }) {
  return (
    <button {...rest} disabled={rest.disabled || loading} className={buttonClass(variant, className)}>
      {loading && <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
}
