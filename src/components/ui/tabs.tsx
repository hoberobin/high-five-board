import * as React from "react";

type TabsContextValue = { value: string; setValue: (v: string) => void; };
const TabsCtx = React.createContext<TabsContextValue | null>(null);

export const Tabs: React.FC<{
  defaultValue: string; value?: string; onValueChange?: (v: string)=>void;
  className?: string; children: React.ReactNode;
}> = ({
  defaultValue, value, onValueChange, className = "", children,
}) => {
  const [internal, setInternal] = React.useState(defaultValue);
  const val = value ?? internal;
  const setVal = (v: string) => (onValueChange ? onValueChange(v) : setInternal(v));
  return <TabsCtx.Provider value={{ value: val, setValue: setVal }}><div className={className}>{children}</div></TabsCtx.Provider>;
};

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => {
  return <div className={`inline-grid rounded-lg bg-white/80 p-1 ${className}`} {...props} />;
};

export const TabsTrigger: React.FC<{
  value: string; className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ value, className = "", ...props }) => {
  const ctx = React.useContext(TabsCtx)!;
  const selected = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={() => ctx.setValue(value)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        selected ? "bg-white text-gray-900 shadow" : "text-gray-700 hover:bg-white/60"
      } ${className}`}
      {...props}
    />
  );
};

export const TabsContent: React.FC<{
  value: string; className?: string; children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>> = ({ value, className = "", children, ...props }) => {
  const ctx = React.useContext(TabsCtx)!;
  if (ctx.value !== value) return null;
  return <div role="tabpanel" className={className} {...props}>{children}</div>;
};