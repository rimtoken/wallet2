import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14"
  };

  return (
    <div className={cn("flex items-center", className)}>
      <img 
        src="/assets/new-rim-token-logo.jpg" 
        alt="RIM TOKEN Logo" 
        className={cn("object-contain", sizeClasses[size])}
      />
      
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