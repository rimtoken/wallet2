import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  TrendingUp, 
  Repeat, 
  BarChart3, 
  Lock, 
  Users, 
  Wallet, 
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/api';

interface AchievementsSystemProps {
  userId: number;
}

// تعريف واجهة الإنجاز
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'trading' | 'portfolio' | 'security' | 'social';
  progress: number;
  target: number;
  reward: string;
  achieved: boolean;
  dateAchieved?: string;
  milestones?: { value: number; reward: string }[];
}

export function AchievementsSystem({ userId }: AchievementsSystemProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // استعلام لجلب بيانات الإنجازات
  const { data: achievements, isLoading } = useQuery({
    queryKey: ['/api/achievements', userId],
    queryFn: async () => {
      // في بيئة حقيقية، سنجلب البيانات من الخادم
      // هذه بيانات مثالية للعرض
      const achievements: Achievement[] = [
        {
          id: 'first-transaction',
          title: 'المعاملة الأولى',
          description: 'أكمل أول معاملة في المحفظة',
          icon: <Wallet className="h-6 w-6 text-primary" />,
          category: 'trading',
          progress: 1,
          target: 1,
          reward: '50 نقطة',
          achieved: true,
          dateAchieved: '2025-04-20',
        },
        {
          id: 'portfolio-diversity',
          title: 'محفظة متنوعة',
          description: 'امتلك 5 عملات مشفرة مختلفة',
          icon: <BarChart3 className="h-6 w-6 text-primary" />,
          category: 'portfolio',
          progress: 3,
          target: 5,
          reward: '100 نقطة',
          achieved: false,
        },
        {
          id: 'trading-volume',
          title: 'حجم تداول',
          description: 'أكمل معاملات بقيمة 10,000$',
          icon: <TrendingUp className="h-6 w-6 text-primary" />,
          category: 'trading',
          progress: 4500,
          target: 10000,
          reward: '200 نقطة',
          achieved: false,
          milestones: [
            { value: 1000, reward: '20 نقطة' },
            { value: 5000, reward: '50 نقطة' },
            { value: 10000, reward: '130 نقطة' },
          ]
        },
        {
          id: 'security-check',
          title: 'أمان محسّن',
          description: 'فعّل المصادقة الثنائية',
          icon: <Lock className="h-6 w-6 text-primary" />,
          category: 'security',
          progress: 0,
          target: 1,
          reward: '150 نقطة',
          achieved: false,
        },
        {
          id: 'regular-trader',
          title: 'متداول منتظم',
          description: 'أكمل معاملة يوميًا لمدة 7 أيام متتالية',
          icon: <Repeat className="h-6 w-6 text-primary" />,
          category: 'trading',
          progress: 4,
          target: 7,
          reward: '120 نقطة',
          achieved: false,
        },
        {
          id: 'referral-program',
          title: 'برنامج الإحالة',
          description: 'قم بدعوة 3 أصدقاء للانضمام',
          icon: <Users className="h-6 w-6 text-primary" />,
          category: 'social',
          progress: 1,
          target: 3,
          reward: '250 نقطة',
          achieved: false,
        }
      ];
      
      return achievements;
    }
  });
  
  // حساب نقاط المستخدم
  const calculateUserPoints = () => {
    if (!achievements) return 0;
    
    return achievements.reduce((total, achievement) => {
      if (achievement.achieved) {
        // إضافة نقاط للإنجازات المكتملة
        const reward = parseInt(achievement.reward.split(' ')[0]);
        return total + reward;
      } else if (achievement.milestones) {
        // إضافة نقاط للإنجازات ذات المراحل بناءً على التقدم
        let milestonePoints = 0;
        achievement.milestones.forEach(milestone => {
          if (achievement.progress >= milestone.value) {
            milestonePoints += parseInt(milestone.reward.split(' ')[0]);
          }
        });
        return total + milestonePoints;
      }
      return total;
    }, 0);
  };
  
  // فلترة الإنجازات حسب التصنيف
  const filteredAchievements = achievements?.filter(achievement => 
    activeTab === 'all' || achievement.category === activeTab
  );
  
  // حساب الإنجازات المكتملة
  const completedAchievements = achievements?.filter(a => a.achieved).length || 0;
  const totalAchievements = achievements?.length || 0;
  const completionPercentage = totalAchievements ? Math.round((completedAchievements / totalAchievements) * 100) : 0;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>نظام الإنجازات</span>
          <Badge variant="secondary" className="text-sm px-3 py-1 flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            <span>{calculateUserPoints()} نقطة</span>
          </Badge>
        </CardTitle>
        <CardDescription>
          أكمل المهام وحقق الإنجازات للحصول على المكافآت
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>إنجازات مكتملة</span>
                <span className="text-primary">{completedAchievements} من {totalAchievements}</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="all">الكل</TabsTrigger>
                <TabsTrigger value="trading">تداول</TabsTrigger>
                <TabsTrigger value="portfolio">المحفظة</TabsTrigger>
                <TabsTrigger value="security">الأمان</TabsTrigger>
                <TabsTrigger value="social">اجتماعي</TabsTrigger>
              </TabsList>
              
              <div className="space-y-3">
                {filteredAchievements?.map(achievement => (
                  <div key={achievement.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-2.5 rounded-full flex-shrink-0 ${achievement.achieved ? 'bg-primary/20' : 'bg-muted'}`}>
                        {achievement.icon}
                      </div>
                      
                      <div className="flex-grow space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              {achievement.title}
                              {achievement.achieved && <Sparkles className="h-4 w-4 text-yellow-500" />}
                            </h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                          <Badge variant={achievement.achieved ? "default" : "outline"} className="ml-2">
                            {achievement.reward}
                          </Badge>
                        </div>
                        
                        {!achievement.achieved && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span>{Math.round((achievement.progress / achievement.target) * 100)}% مكتمل</span>
                              <span>{achievement.progress} / {achievement.target}</span>
                            </div>
                            <Progress value={(achievement.progress / achievement.target) * 100} className="h-1.5" />
                            
                            {achievement.milestones && (
                              <div className="mt-2 pt-2 border-t">
                                <p className="text-xs text-muted-foreground mb-1">المراحل:</p>
                                <div className="flex gap-2">
                                  {achievement.milestones.map((milestone, index) => (
                                    <Badge 
                                      key={index} 
                                      variant={achievement.progress >= milestone.value ? "default" : "outline"}
                                      className="text-xs"
                                    >
                                      {formatCurrency(milestone.value)} = {milestone.reward}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                        
                        {achievement.achieved && achievement.dateAchieved && (
                          <p className="text-xs text-muted-foreground">
                            تم الإنجاز في {new Date(achievement.dateAchieved).toLocaleDateString('ar-EG')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Tabs>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          مشاركة الإنجازات
        </Button>
        <Button variant="ghost" size="sm">
          تفاصيل المكافآت
        </Button>
      </CardFooter>
    </Card>
  );
}