import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SparklineProps extends React.SVGProps<SVGSVGElement> {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  trend?: 'up' | 'down' | 'neutral';
}

const Sparkline = forwardRef<SVGSVGElement, SparklineProps>(
  ({ className, data, width = 100, height = 30, color, strokeWidth = 2, trend, ...props }, ref) => {
    if (!data || data.length === 0) {
      return null;
    }
    
    // Determine trend color if not explicitly provided
    const determineColor = () => {
      if (color) return color;
      
      if (trend === 'up') return '#10B981'; // success/green
      if (trend === 'down') return '#EF4444'; // error/red
      
      // If trend is not provided, determine it from data
      const first = data[0];
      const last = data[data.length - 1];
      
      if (last > first) return '#10B981'; // success/green
      if (last < first) return '#EF4444'; // error/red
      return '#9CA3AF'; // neutral/gray
    };
    
    const renderColor = determineColor();
    
    // Normalize data for the SVG viewBox
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const range = maxValue - minValue;
    
    // Prevent division by zero
    const normalizedData = range === 0 
      ? data.map(() => height / 2) 
      : data.map(value => height - ((value - minValue) / range) * height);
    
    // Create the path d attribute
    const pathD = normalizedData.reduce((acc, point, index) => {
      const x = (index / (data.length - 1)) * width;
      
      if (index === 0) {
        return `M ${x},${point}`;
      }
      
      return `${acc} L ${x},${point}`;
    }, "");
    
    return (
      <svg
        ref={ref}
        className={cn("overflow-visible", className)}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d={pathD}
          stroke={renderColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }
);

Sparkline.displayName = "Sparkline";

export { Sparkline };
