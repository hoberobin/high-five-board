import * as React from "react";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => {
  return (
    <div
      className={`rounded-2xl border border-white/20 bg-white/90 shadow-xl ${className}`}
      {...props}
    />
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => {
  return <div className={`px-6 pt-6 ${className}`} {...props} />;
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = "", ...props }) => {
  return <h3 className={`text-xl font-bold ${className}`} {...props} />;
};

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => {
  return <div className={`px-6 pb-6 ${className}`} {...props} />;
};