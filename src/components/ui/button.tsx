import * as React from "react";

/** tiny class combiner */
const cn = (...cls: Array<string | false | null | undefined>) =>
  cls.filter(Boolean).join(" ");

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  fullWidth?: boolean;
  /** Optional icons (or just put icons in children) */
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Button = ({
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  startIcon,
  endIcon,
  children,
  disabled,
  ...props
}: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    "active:scale-[0.98] " +
    "disabled:opacity-60 disabled:pointer-events-none";

  const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
      "bg-gradient-to-r from-purple-500 to-pink-500 text-white " +
      "hover:from-purple-600 hover:to-pink-600 " +
      "shadow-sm hover:shadow-md focus-visible:ring-purple-300 ring-offset-purple-50",
    secondary:
      "bg-white/90 text-gray-900 border border-gray-200 " +
      "hover:bg-white shadow-sm hover:shadow focus-visible:ring-purple-300 ring-offset-purple-50",
    outline:
      "border border-gray-300 text-gray-900 bg-transparent " +
      "hover:bg-gray-50/60 dark:hover:bg-white/10 " +
      "focus-visible:ring-purple-300 ring-offset-purple-50",
    ghost:
      "bg-transparent text-white border border-white/15 " +
      "hover:bg-white/15 focus-visible:ring-purple-300 ring-offset-purple-50",
    link:
      "bg-transparent text-purple-100 hover:text-white underline-offset-4 hover:underline " +
      "focus-visible:ring-purple-300 ring-offset-purple-50",
    destructive:
      "bg-red-500 text-white hover:bg-red-600 " +
      "shadow-sm hover:shadow-md focus-visible:ring-red-300 ring-offset-red-50",
  };

  const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-base",
    lg: "h-12 px-6 text-base",
    icon: "size-11 p-0",
  };

  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        isLoading && "relative",
        className
      )}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {/* spinner overlays nicely for loading */}
      {isLoading && (
        <svg
          className="absolute left-3 size-5 animate-spin text-white/90"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
          />
        </svg>
      )}

      {/* start icon */}
      {!isLoading && startIcon ? (
        <span className="inline-flex items-center">{startIcon}</span>
      ) : null}

      {/* label */}
      <span className={cn(isLoading && "opacity-60")}>{children}</span>

      {/* end icon */}
      {!isLoading && endIcon ? (
        <span className="inline-flex items-center">{endIcon}</span>
      ) : null}
    </button>
  );
};