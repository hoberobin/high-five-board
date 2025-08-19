import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
}

export const Button = ({ className = "", variant = "primary", size = "md", ...props }: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";
  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600",
    ghost: "bg-transparent text-white hover:bg-white/20 border border-white/20",
    link: "bg-transparent text-blue-300 hover:text-blue-200 underline-offset-4 hover:underline",
  };
  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-12 px-6 text-lg",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
};