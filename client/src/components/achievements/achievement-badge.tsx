import React from 'react';
import { 
  Rocket, 
  Layers, 
  Clock, 
  Shield, 
  BarChart, 
  Star, 
  Lightbulb, 
  Users,
  Trophy,
  Award,
  Anchor // تغيير من Whale إلى Anchor لأن Whale غير موجود في مكتبة lucide-react
} from 'lucide-react';
import { Achievement } from '@/data/achievements';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// مخزن أيقونات الإنجازات
const IconsMap = {
  Rocket,
  Layers,
  Clock,
  Shield,
  BarChart,
  Star,
  Lightbulb,
  Users,
  Trophy,
  Award,
  Anchor
};

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  className?: string;
}

export function AchievementBadge({ 
  achievement, 
  size = 'md', 
  showProgress = true,
  className 
}: AchievementBadgeProps) {
  // الحصول على مكون الأيقونة المناسب
  const IconComponent = IconsMap[achievement.icon as keyof typeof IconsMap] || Trophy;
  
  // تحديد حجم الشارة
  const sizeClasses = {
    sm: 'w-16 h-16 text-sm',
    md: 'w-24 h-24 text-base',
    lg: 'w-32 h-32 text-lg'
  };
  
  // تحديد حجم الأيقونة
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };
  
  // ألوان المستويات
  const tierColors = {
    bronze: 'bg-amber-200 border-amber-400',
    silver: 'bg-gray-200 border-gray-400',
    gold: 'bg-yellow-200 border-yellow-500',
    platinum: 'bg-gradient-to-r from-blue-200 to-cyan-200 border-cyan-500'
  };
  
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div 
        className={cn(
          'rounded-full flex items-center justify-center',
          sizeClasses[size],
          achievement.bgColor,
          'border-4',
          achievement.completed ? (achievement.tier ? tierColors[achievement.tier] : 'border-green-500') : 'border-gray-300',
          achievement.completed ? 'opacity-100' : 'opacity-70'
        )}
      >
        <IconComponent className={cn(iconSizes[size], achievement.iconColor)} />
      </div>
      
      {/* عنوان وتفاصيل الإنجاز */}
      <div className="mt-2 text-center">
        <h3 className={cn(
          'font-bold',
          achievement.completed ? 'text-gray-900' : 'text-gray-600'
        )}>
          {achievement.title}
        </h3>
        {showProgress && achievement.progress !== undefined && !achievement.completed && (
          <div className="mt-1 px-2">
            <Progress value={achievement.progress} className="h-1.5" />
            <p className="text-xs text-gray-500 mt-1">{achievement.progress}%</p>
          </div>
        )}
      </div>
    </div>
  );
}