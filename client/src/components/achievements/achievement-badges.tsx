import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Shield, TrendingUp, Users, Target, CheckCircle2, Lock } from "lucide-react";

// Mock data for achievements - in real app this would come from API
const mockAchievements = [
  {
    id: 1,
    name: "First Steps",
    description: "Complete your first cryptocurrency transaction",
    icon: "🎯",
    category: "trading",
    rarity: "common",
    points: 100,
    progress: 100,
    isCompleted: true,
    unlockedAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    name: "Crypto Collector",
    description: "Hold 5 different cryptocurrencies in your portfolio",
    icon: "💎",
    category: "portfolio",
    rarity: "rare",
    points: 250,
    progress: 60,
    isCompleted: false,
  },
  {
    id: 3,
    name: "Security Expert",
    description: "Enable 2FA and complete security verification",
    icon: "🛡️",
    category: "security",
    rarity: "epic",
    points: 500,
    progress: 100,
    isCompleted: true,
    unlockedAt: new Date("2024-01-10"),
  },
  {
    id: 4,
    name: "Trading Master",
    description: "Complete 100 successful trades",
    icon: "📈",
    category: "trading",
    rarity: "legendary",
    points: 1000,
    progress: 25,
    isCompleted: false,
  },
  {
    id: 5,
    name: "Whale Watcher",
    description: "Achieve portfolio value of $10,000+",
    icon: "🐋",
    category: "portfolio",
    rarity: "epic",
    points: 750,
    progress: 45,
    isCompleted: false,
  },
  {
    id: 6,
    name: "Community Builder",
    description: "Refer 10 friends to RimToken",
    icon: "👥",
    category: "social",
    rarity: "rare",
    points: 300,
    progress: 30,
    isCompleted: false,
  },
];

const categoryIcons: Record<string, any> = {
  trading: TrendingUp,
  portfolio: Trophy,
  security: Shield,
  social: Users,
};

const rarityColors: Record<string, string> = {
  common: "bg-gray-500",
  rare: "bg-blue-500",
  epic: "bg-purple-500",
  legendary: "bg-amber-500",
};

const rarityBorders: Record<string, string> = {
  common: "border-gray-400",
  rare: "border-blue-400",
  epic: "border-purple-400",
  legendary: "border-amber-400",
};

export default function AchievementBadges({ language = 'en' }: { language?: string }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // In real app, this would be a proper API call
  const { data: achievements = mockAchievements, isLoading } = useQuery({
    queryKey: ['/api/achievements'],
    queryFn: () => Promise.resolve(mockAchievements),
  });

  const filteredAchievements = selectedCategory === "all" 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const completedCount = achievements.filter(a => a.isCompleted).length;
  const totalPoints = achievements.filter(a => a.isCompleted).reduce((sum, a) => sum + a.points, 0);

  const getText = (key: string): string => {
    const texts: Record<string, string> = {
      achievements: language === 'ar' ? 'الإنجازات' : language === 'fr' ? 'Réalisations' : 'Achievements',
      myBadges: language === 'ar' ? 'شاراتي' : language === 'fr' ? 'Mes Badges' : 'My Badges',
      progress: language === 'ar' ? 'التقدم' : language === 'fr' ? 'Progrès' : 'Progress',
      completed: language === 'ar' ? 'مكتمل' : language === 'fr' ? 'Complété' : 'Completed',
      points: language === 'ar' ? 'نقاط' : language === 'fr' ? 'Points' : 'Points',
      all: language === 'ar' ? 'الكل' : language === 'fr' ? 'Tous' : 'All',
      trading: language === 'ar' ? 'التداول' : language === 'fr' ? 'Trading' : 'Trading',
      portfolio: language === 'ar' ? 'المحفظة' : language === 'fr' ? 'Portefeuille' : 'Portfolio',
      security: language === 'ar' ? 'الأمان' : language === 'fr' ? 'Sécurité' : 'Security',
      social: language === 'ar' ? 'اجتماعي' : language === 'fr' ? 'Social' : 'Social',
      common: language === 'ar' ? 'عادي' : language === 'fr' ? 'Commun' : 'Common',
      rare: language === 'ar' ? 'نادر' : language === 'fr' ? 'Rare' : 'Rare',
      epic: language === 'ar' ? 'ملحمي' : language === 'fr' ? 'Épique' : 'Epic',
      legendary: language === 'ar' ? 'أسطوري' : language === 'fr' ? 'Légendaire' : 'Legendary',
      unlockedOn: language === 'ar' ? 'تم إلغاء القفل في' : language === 'fr' ? 'Débloqué le' : 'Unlocked on',
      locked: language === 'ar' ? 'مقفل' : language === 'fr' ? 'Verrouillé' : 'Locked',
    };
    return texts[key] || key;
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{completedCount}</div>
            <div className="text-sm text-slate-600">{getText('completed')}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border-amber-200">
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-amber-600">{totalPoints}</div>
            <div className="text-sm text-slate-600">{getText('points')}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {Math.round((completedCount / achievements.length) * 100)}%
            </div>
            <div className="text-sm text-slate-600">{getText('progress')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            {getText('myBadges')}
          </CardTitle>
          <CardDescription>
            {language === 'ar' ? 'اكتشف واحصل على شارات مختلفة من خلال استخدام ريم توكن' : 
             language === 'fr' ? 'Découvrez et gagnez différents badges en utilisant RimToken' : 
             'Discover and earn different badges by using RimToken'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Filter */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">{getText('all')}</TabsTrigger>
              <TabsTrigger value="trading">{getText('trading')}</TabsTrigger>
              <TabsTrigger value="portfolio">{getText('portfolio')}</TabsTrigger>
              <TabsTrigger value="security">{getText('security')}</TabsTrigger>
              <TabsTrigger value="social">{getText('social')}</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAchievements.map((achievement) => {
                  const isCompleted = achievement.isCompleted;
                  
                  return (
                    <Card 
                      key={achievement.id}
                      className={`relative transition-all duration-300 hover:shadow-lg ${
                        isCompleted 
                          ? `${rarityBorders[achievement.rarity] || 'border-gray-400'} border-2 bg-gradient-to-br from-white to-slate-50` 
                          : 'border-slate-200 bg-white opacity-75'
                      }`}
                    >
                      <CardContent className="p-4">
                        {/* Achievement Icon & Rarity */}
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-12 h-12 rounded-full ${rarityColors[achievement.rarity] || 'bg-gray-500'} flex items-center justify-center text-2xl`}>
                            {isCompleted ? achievement.icon : '🔒'}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge variant={isCompleted ? "default" : "secondary"} className="text-xs">
                              {getText(achievement.rarity)}
                            </Badge>
                            {isCompleted && (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        </div>

                        {/* Achievement Info */}
                        <div className="space-y-2">
                          <h3 className={`font-semibold ${isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>
                            {achievement.name}
                          </h3>
                          <p className={`text-sm ${isCompleted ? 'text-slate-600' : 'text-slate-400'}`}>
                            {achievement.description}
                          </p>

                          {/* Progress Bar */}
                          {!isCompleted && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-slate-500">
                                <span>{getText('progress')}</span>
                                <span>{achievement.progress}%</span>
                              </div>
                              <Progress value={achievement.progress} className="h-2" />
                            </div>
                          )}

                          {/* Points & Unlock Date */}
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-sm font-medium text-blue-600">
                              +{achievement.points} {getText('points')}
                            </span>
                            {isCompleted && achievement.unlockedAt && (
                              <span className="text-xs text-slate-500">
                                {getText('unlockedOn')} {achievement.unlockedAt.toLocaleDateString()}
                              </span>
                            )}
                            {!isCompleted && (
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                {getText('locked')}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}