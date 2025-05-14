import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PortfolioHistory } from "@shared/schema";
import { formatCurrency } from "@/lib/api";
import { CryptoIcon } from "@/components/crypto-icon";

interface PortfolioChartProps {
  userId: number;
}

type TimeRange = '1D' | '1W' | '1M' | '1Y';

export function PortfolioChart({ userId }: PortfolioChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('1D');
  
  // Map time range to number of days for API
  const daysMap: Record<TimeRange, number> = {
    '1D': 1,
    '1W': 7,
    '1M': 30,
    '1Y': 365
  };
  
  const { data: historyData, isLoading } = useQuery<PortfolioHistory[]>({
    queryKey: [`/api/portfolio/${userId}/history`, { days: daysMap[timeRange] }],
  });
  
  // Function to create SVG path from history data
  const createChartPath = () => {
    if (!historyData || historyData.length === 0) return '';
    
    const values = historyData.map(entry => Number(entry.totalValue));
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;
    
    // Scale the values to fit in the SVG
    const scaledValues = values.map(value => {
      // If range is 0, place all points at the middle
      if (range === 0) return 200;
      return 380 - ((value - minValue) / range) * 300;
    });
    
    // Create path commands
    const pathCommands = scaledValues.map((value, index) => {
      const x = (index / (values.length - 1)) * 800;
      
      if (index === 0) {
        return `M ${x},${value}`;
      }
      
      return `L ${x},${value}`;
    });
    
    return pathCommands.join(' ');
  };
  
  // Create labels for X-axis based on time range
  const getTimeLabels = (): string[] => {
    const labelMap: Record<TimeRange, string[]> = {
      '1D': ['09:00', '12:00', '15:00', '18:00', '21:00'],
      '1W': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      '1M': ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      '1Y': ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov']
    };
    
    return labelMap[timeRange];
  };
  
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-neutral-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Portfolio History</h2>
        <div className="flex space-x-2">
          {(['1D', '1W', '1M', '1Y'] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              className={cn(
                "px-3 py-1 text-xs rounded-full",
                timeRange === range 
                  ? "bg-primary text-white" 
                  : "bg-neutral-100 text-neutral-600 border-transparent"
              )}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>
      
      {isLoading ? (
        <Skeleton className="aspect-video w-full h-48 md:h-60 rounded-lg" />
      ) : (
        <div className="aspect-video w-full h-48 md:h-60 bg-neutral-50 rounded-lg overflow-hidden">
          <svg viewBox="0 0 800 400" className="w-full h-full">
            {/* Background Grid */}
            <line x1="0" y1="320" x2="800" y2="320" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="0" y1="240" x2="800" y2="240" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="0" y1="160" x2="800" y2="160" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="0" y1="80" x2="800" y2="80" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="5,5" />
            
            {/* Data Line */}
            <path 
              d={createChartPath()} 
              fill="none" 
              stroke="#3B82F6" 
              strokeWidth="3" 
            />
            
            {/* Area Under the Line */}
            <path 
              d={`${createChartPath()} V400 H0 Z`} 
              fill="url(#gradient)" 
              opacity="0.2" 
            />
            
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}
      
      <div className="flex justify-between mt-3 text-xs text-neutral-500">
        {getTimeLabels().map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="bg-neutral-50 rounded-lg p-3">
          <p className="text-neutral-500 text-xs">Most Profitable</p>
          <div className="flex items-center mt-1">
            <CryptoIcon symbol="ETH" name="Ethereum" size="sm" />
            <span className="ml-2 font-medium text-sm">Ethereum</span>
            <span className="ml-auto text-success text-sm font-medium">+8.4%</span>
          </div>
        </div>
        <div className="bg-neutral-50 rounded-lg p-3">
          <p className="text-neutral-500 text-xs">Biggest Drop</p>
          <div className="flex items-center mt-1">
            <CryptoIcon symbol="SOL" name="Solana" size="sm" />
            <span className="ml-2 font-medium text-sm">Solana</span>
            <span className="ml-auto text-error text-sm font-medium">-1.2%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
