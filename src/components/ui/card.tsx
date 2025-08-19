import * as React from "react";
import { cn } from "../../lib/utils";


type Variant = "glass" | "solid" | "outline";
type Elevation = "none" | "sm" | "md";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
  elevation?: Elevation;
  hoverable?: boolean;
  clickable?: boolean;
  padded?: boolean;
  border?: boolean;
}

export const Card = ({
  className = "",
  variant = "glass",
  elevation = "sm",
  hoverable = false,
  clickable = false,
  padded = true,
  border = true,
  ...props
}: CardProps) => {
  const base =
    "relative rounded-2xl transition-shadow transition-transform duration-200";
  const variants: Record<Variant, string> = {
    glass:
      "bg-white/90 backdrop-blur-sm dark:bg-white/10 dark:backdrop-blur-md",
    solid:
      "bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100",
    outline:
      "bg-transparent text-inherit",
  };
  const borders = border
    ? "border border-white/20 dark:border-white/10"
    : "border-0";
  const elevations: Record<Elevation, string> = {
    none: "shadow-none",
    sm: "shadow-md",
    md: "shadow-xl",
  };
  const hover =
    hoverable
      ? "hover:shadow-2xl hover:-translate-y-[1px]"
      : "";
  const cursor = clickable ? "cursor-pointer" : "";
  const pad = padded ? "p-6" : "";

  return (
    <div
      className={cn(base, variants[variant], borders, elevations[elevation], hover, cursor, pad, className)}
      {...props}
    />
  );
};

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  withDivider?: boolean;
  padded?: boolean;
}

export const CardHeader = ({
  className = "",
  withDivider = false,
  padded = true,
  ...props
}: CardHeaderProps) => (
  <div
    className={cn(
      padded ? "px-6 pt-6" : "",
      withDivider ? "pb-4 border-b border-white/20 dark:border-white/10" : "pb-2",
      className
    )}
    {...props}
  />
);

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4";
}

export const CardTitle = ({
  className = "",
  as = "h3",
  ...props
}: CardTitleProps) => {
  const Comp = as as any;
  return <Comp className={cn("text-xl font-bold", className)} {...props} />;
};

export const CardDescription = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("mt-1 text-sm text-gray-600 dark:text-zinc-300", className)} {...props} />
);

export const CardContent = ({
  className = "",
  padded = true as boolean | undefined,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { padded?: boolean }) => (
  <div
    className={cn(padded ? "px-6 pb-6" : "", className)}
    {...props}
  />
);

export const CardFooter = ({
  className = "",
  withDivider = false as boolean | undefined,
  padded = true as boolean | undefined,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { withDivider?: boolean; padded?: boolean }) => (
  <div
    className={cn(
      withDivider ? "border-t border-white/20 dark:border-white/10" : "",
      padded ? "px-6 py-4" : "py-3",
      "flex items-center gap-3",
      className
    )}
    {...props}
  />
);

/** Media block (top image/video) that handles aspect + rounded corners */
export const CardMedia = ({
  className = "",
  aspect = "16/9",
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { aspect?: `${number}/${number}` }) => (
  <div
    className={cn("overflow-hidden rounded-t-2xl", className)}
    style={{ aspectRatio: aspect }}
    {...props}
  >
    {children}
  </div>
);