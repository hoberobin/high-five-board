import * as React from "react";
import { cn } from "../../lib/utils";

type Orientation = "horizontal" | "vertical";
type Variant = "pill" | "underline";
type Size = "sm" | "md" | "lg";

type TabsContextValue = {
  value: string;
  setValue: (v: string) => void;
  orientation: Orientation;
  variant: Variant;
  size: Size;
  baseId: string;
};

const TabsCtx = React.createContext<TabsContextValue | null>(null);

export const Tabs: React.FC<{
  defaultValue: string;
  value?: string;
  onValueChange?: (v: string) => void;
  orientation?: Orientation;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}> = ({
  defaultValue,
  value,
  onValueChange,
  orientation = "horizontal",
  variant = "pill",
  size = "md",
  className,
  children,
}) => {
  const [internal, setInternal] = React.useState(defaultValue);
  const val = value ?? internal;
  const setVal = (v: string) => (onValueChange ? onValueChange(v) : setInternal(v));
  const baseId = React.useId();

  return (
    <TabsCtx.Provider value={{ value: val, setValue: setVal, orientation, variant, size, baseId }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
};

export const TabsList: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { className?: string }
> = ({ className, ...props }) => {
  const ctx = useTabs();
  const isH = ctx.orientation === "horizontal";

  // Roving focus: handle key nav at the list level
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const tabs = Array.from(container.querySelectorAll<HTMLButtonElement>("[role='tab']"));
    const currentIndex = tabs.findIndex((el) => el === document.activeElement);

    const go = (index: number) => {
      const clamped = (index + tabs.length) % tabs.length;
      tabs[clamped]?.focus();
      tabs[clamped]?.click(); // select on focus-move
    };

    switch (e.key) {
      case "ArrowRight":
        if (isH) { e.preventDefault(); go(currentIndex + 1); }
        break;
      case "ArrowLeft":
        if (isH) { e.preventDefault(); go(currentIndex - 1); }
        break;
      case "ArrowDown":
        if (!isH) { e.preventDefault(); go(currentIndex + 1); }
        break;
      case "ArrowUp":
        if (!isH) { e.preventDefault(); go(currentIndex - 1); }
        break;
      case "Home":
        e.preventDefault(); go(0);
        break;
      case "End":
        e.preventDefault(); go(tabs.length - 1);
        break;
    }
  };

  const listBase =
    "inline-flex items-center gap-1 rounded-xl p-1 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60";
  const listOrient = ctx.orientation === "vertical" ? "flex-col" : "flex-row";

  return (
    <div
      role="tablist"
      aria-orientation={ctx.orientation}
      data-orientation={ctx.orientation}
      onKeyDown={onKeyDown}
      className={cn(listBase, listOrient, className)}
      {...props}
    />
  );
};

export const TabsTrigger: React.FC<
  { value: string; className?: string; disabled?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ value, className, disabled, ...props }) => {
  const ctx = useTabs();
  const selected = ctx.value === value;

  const sizes: Record<Size, string> = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-base",
  };

  const pillClasses = selected
    ? "bg-white text-gray-900 shadow"
    : "text-gray-700 hover:bg-white/70";
  const underlineBase =
    "rounded-md text-gray-800 hover:text-black hover:bg-white/50 relative";
  const underlineSelected =
    "text-black after:absolute after:left-3 after:right-3 after:-bottom-[2px] after:h-[2px] after:rounded-full after:bg-gray-900";
  const variantCls =
    ctx.variant === "pill" ? pillClasses : cn(underlineBase, selected && underlineSelected);

  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      id={`${ctx.baseId}-tab-${value}`}
      disabled={disabled}
      onClick={() => ctx.setValue(value)}
      data-state={selected ? "active" : "inactive"}
      className={cn(
        "select-none rounded-lg font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-purple-300",
        sizes[ctx.size],
        variantCls,
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
};

export const TabsContent: React.FC<
  { value: string; className?: string; children?: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
> = ({ value, className, children, ...props }) => {
  const ctx = useTabs();
  const selected = ctx.value === value;
  if (!selected) return null;

  return (
    <div
      role="tabpanel"
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      id={`${ctx.baseId}-panel-${value}`}
      className={cn("mt-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

/* ---------- helpers ---------- */
function useTabs() {
  const ctx = React.useContext(TabsCtx);
  if (!ctx) throw new Error("Tabs components must be used within <Tabs>");
  return ctx;
}