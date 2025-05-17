import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-14"
  };

  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn("flex items-center justify-center overflow-hidden rounded-full bg-amber-500 text-white font-bold", sizeClasses[size], sizeClasses[size])}>
        <span className={cn(
          "text-xl md:text-2xl",
          size === "sm" && "text-lg",
          size === "lg" && "text-3xl"
        )}>R</span>
      </div>
      
      {showText && (
        <div className="mr-2 flex flex-col items-start">
          <span className={cn(
            "font-bold text-amber-800",
            size === "sm" && "text-sm",
            size === "md" && "text-xl",
            size === "lg" && "text-2xl"
          )}>RIM TOKEN</span>
          {size !== "sm" && (
            <span className="text-xs text-gray-500">محفظة العملات المشفرة</span>
          )}
        </div>
      )}
    </div>
  );
}