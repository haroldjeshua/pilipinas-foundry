import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/cn";

interface ColorInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label: string;
}

const ColorInput = forwardRef<HTMLInputElement, ColorInputProps>(
  ({ label, value, className, ...props }, ref) => {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="relative">
          <input
            ref={ref}
            type="color"
            value={value}
            aria-label={label}
            className={cn(
              "size-8 cursor-pointer appearance-none rounded-md border border-border p-0",
              "[&::-webkit-color-swatch-wrapper]:p-0.5",
              "[&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-none",
              "[&::-moz-color-swatch]:rounded-sm [&::-moz-color-swatch]:border-none",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
            {...props}
          />
        </div>
        <span className="font-mono text-xs tabular-nums text-muted">
          {value}
        </span>
      </div>
    );
  },
);

ColorInput.displayName = "ColorInput";

export { ColorInput, type ColorInputProps };
