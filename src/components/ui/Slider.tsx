import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/cn";

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  min: number;
  max: number;
  step?: number;
  value: number;
  label: string;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ min, max, step = 1, value, label, className, ...props }, ref) => {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={label}
          className={cn(
            "h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-border",
            "[&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-fast [&::-webkit-slider-thumb]:hover:scale-125",
            "[&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-foreground [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:duration-fast [&::-moz-range-thumb]:hover:scale-125",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
          {...props}
        />
        <span className="min-w-[3ch] text-right font-mono text-xs tabular-nums text-muted">
          {value}
        </span>
      </div>
    );
  },
);

Slider.displayName = "Slider";

export { Slider, type SliderProps };
