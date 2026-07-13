import { Slider as BaseSlider } from "@base-ui/react/slider";
import { cn } from "@/lib/utils";

function Slider({
  className,
  ...props
}: React.ComponentProps<typeof BaseSlider.Root>) {
  return (
    <BaseSlider.Root
      className={cn(
        "relative flex w-full touch-none items-center",
        "data-[orientation=horizontal]:h-5 data-[orientation=vertical]:h-44",
        "data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-5",
        className,
      )}
      {...props}
    >
      <BaseSlider.Track className="relative grow rounded-full bg-border data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5">
        <BaseSlider.Indicator className="rounded-full bg-foreground" />
      </BaseSlider.Track>
      <BaseSlider.Thumb className="block size-3.5 rounded-full bg-foreground outline-none transition-transform duration-fast hover:scale-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50" />
    </BaseSlider.Root>
  );
}

export { Slider };
