import * as React from "react";

export const Input = ({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  const base =
    "w-full rounded-lg border border-gray-300 bg-white/90 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent";
  return <input className={`${base} ${className}`} {...props} />;
};