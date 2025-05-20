import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Trophy, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AchievementBadge } from './achievement-badge';
import { 
  Achievement, 
  fetchUserAchievements, 
  calculateTotalPoints, 
  calculateUserLevel, 
  calculateLevelProgress 
} from '@/data/achievements';

interface AchievementsSummaryProps {
  userId: number;
  limit?: number;
}

export function AchievementsSummary({ userId, limit = 5 }: AchievementsSummaryProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const data = await fetchUserAchievements(userId);
        setAchievements(data);
      } catch (error) {
        console.error('Error loading achievements:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAchievements();
  }, [userId]);
  
  // حساب المستوى والنقاط
  const totalPoints = calculateTotalPoints(achievements);
  const currentLevel = calculateUserLevel(totalPoints);
  const levelProgress = calculateLevelProgress(totalPoints);
  
  // الإنجازات المكتملة
  const completedAchievements = achievements.filter(a => a.completed);
  
  // الإنجازات قيد التقدم (مرتبة حسب التقدم)
  const inProgressAchievements = achievements
    .filter(a => !a.completed && a.progress !== undefined)
    .sort((a, b) => (b.progress || 0) - (a.progress || 0));
  
  // عرض الإنجازات المكتملة حديثاً والإنجازات قيد التقدم
  const displayAchievements = [
    ...completedAchievements.slice(0, Math.min(2, completedAchievements.length)),
    ...inProgressAchievements.slice(0, Math.min(limit - Math.min(2, completedAchievements.length), inProgressAchievements.length))
  ];
  
  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg animate-pulse bg-gray-50">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="flex items-center space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-amber-500" />
          إنجازاتي
        </h3>
        <span className="text-sm text-gray-500">
          {completedAchievements.length} / {achievements.length} مكتمل
        </span>
      </div>
      
      {/* مستوى المستخدم */}
      <div className="mb-6 p-3 bg-amber-50 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">{currentLevel}</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <p className="font-bold text-gray-700">المستوى {currentLevel}</p>
              <p className="text-amber-600 font-medium">{totalPoints} نقطة</p>
            </div>
            <Progress value={levelProgress} className="h-2 mt-1" />
          </div>
        </div>
      </div>
      
      {/* عرض الإنجازات */}
      {displayAchievements.length > 0 ? (
        <div className="space-y-4">
          {displayAchievements.map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
              <AchievementBadge achievement={achievement} size="sm" showProgress={false} />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{achievement.title}</p>
                {achievement.completed ? (
                  <p className="text-xs text-green-600">مكتمل • {achievement.points} نقطة</p>
                ) : (
                  <div className="w-full mt-1">
                    <Progress value={achievement.progress} className="h-1.5" />
                    <p className="text-xs text-gray-500 mt-0.5">{achievement.progress}% مكتمل</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          <Button asChild variant="ghost" className="w-full mt-2 text-sm" size="sm">
            <Link href="/achievements" className="flex items-center justify-center">
              عرض جميع الإنجازات
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="text-center p-4">
          <p className="text-sm text-gray-500">
            استخدم المحفظة للحصول على إنجازات جديدة
          </p>
          <Button asChild variant="outline" className="mt-2 text-sm" size="sm">
            <Link href="/achievements">
              استكشاف الإنجازات
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}