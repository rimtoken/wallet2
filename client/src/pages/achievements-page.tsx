import { useState, useEffect } from 'react';
import { 
  Award, 
  Trophy, 
  Medal, 
  Star, 
  Filter, 
  ArrowUp,
  Rocket
} from 'lucide-react';
import { AchievementBadge } from '@/components/achievements/achievement-badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'wouter';
import { 
  Achievement, 
  fetchUserAchievements, 
  calculateTotalPoints, 
  calculateUserLevel,
  calculateLevelProgress,
  getNextLevelPoints
} from '@/data/achievements';
import rimLogo from '@assets/rim.png';

type CategoryFilter = 'all' | Achievement['category'];
type StatusFilter = 'all' | 'completed' | 'in-progress';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    const loadAchievements = async () => {
      try {
        // في الاستخدام الحقيقي، سيكون هناك userId تم تمريره أو الحصول عليه من سياق المصادقة
        const data = await fetchUserAchievements(1);
        setAchievements(data);
      } catch (error) {
        console.error('Error loading achievements:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAchievements();
  }, []);
  
  // حساب المستوى والنقاط
  const totalPoints = calculateTotalPoints(achievements);
  const currentLevel = calculateUserLevel(totalPoints);
  const levelProgress = calculateLevelProgress(totalPoints);
  const nextLevelPoints = getNextLevelPoints(currentLevel);
  
  // تصفية الإنجازات حسب الفئة والحالة
  const filteredAchievements = achievements.filter(achievement => {
    const matchesCategory = categoryFilter === 'all' || achievement.category === categoryFilter;
    
    let matchesStatus = true;
    if (statusFilter === 'completed') {
      matchesStatus = achievement.completed;
    } else if (statusFilter === 'in-progress') {
      matchesStatus = !achievement.completed && achievement.progress !== undefined;
    }
    
    return matchesCategory && matchesStatus;
  });
  
  // مجموعة من الإنجازات المكتملة
  const completedAchievements = achievements.filter(a => a.completed);
  
  // مجموعة من الإنجازات قيد التقدم
  const inProgressAchievements = achievements.filter(a => !a.completed && a.progress !== undefined);
  
  // مجموعة من الإنجازات المقفلة (غير مكتملة وليس لها تقدم)
  const lockedAchievements = achievements.filter(a => !a.completed && a.progress === undefined);
  
  // تجميع الإنجازات حسب الفئة
  const achievementsByCategory = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<Achievement['category'], Achievement[]>);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <div className="flex items-center mb-4">
          <img src={rimLogo} alt="RimToken Logo" className="w-8 h-8 mr-2 rounded-full object-cover" />
          <h1 className="text-3xl font-bold">إنجازاتي</h1>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm w-full md:w-1/2">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-amber-600" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold border-2 border-white">
                  {currentLevel}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h2 className="font-bold text-lg">المستوى {currentLevel}</h2>
                    <p className="text-sm text-gray-500">{totalPoints} نقطة</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">المستوى التالي</p>
                    <p className="font-bold">{nextLevelPoints} نقطة</p>
                  </div>
                </div>
                <Progress value={levelProgress} className="h-2 mt-2" />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  الفئة: {categoryFilter === 'all' ? 'الكل' : categoryFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as CategoryFilter)}>
                  <DropdownMenuRadioItem value="all">الكل</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="transaction">المعاملات</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="holding">الممتلكات</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="security">الأمان</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="referral">الإحالات</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="loyalty">الولاء</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="education">التعليم</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  الحالة: {statusFilter === 'all' ? 'الكل' : statusFilter === 'completed' ? 'مكتمل' : 'قيد التقدم'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                  <DropdownMenuRadioItem value="all">الكل</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="completed">مكتمل</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="in-progress">قيد التقدم</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              الكل ({achievements.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              مكتملة ({completedAchievements.length})
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              قيد التقدم ({inProgressAchievements.length})
            </TabsTrigger>
            <TabsTrigger value="by-category">
              حسب الفئة
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-8">
            {filteredAchievements.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredAchievements.map((achievement) => (
                  <div key={achievement.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
                    <AchievementBadge achievement={achievement} />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {achievement.points} نقطة
                    </p>
                    {achievement.description && (
                      <p className="text-xs text-gray-600 mt-1 text-center line-clamp-2">
                        {achievement.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Rocket className="w-12 h-12 mx-auto text-gray-300" />
                <h3 className="mt-4 text-xl font-semibold">لا توجد إنجازات متطابقة</h3>
                <p className="mt-2 text-gray-500">جرب تغيير عوامل التصفية</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {completedAchievements.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {completedAchievements
                  .filter(achievement => categoryFilter === 'all' || achievement.category === categoryFilter)
                  .map((achievement) => (
                    <div key={achievement.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
                      <AchievementBadge achievement={achievement} />
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        {achievement.points} نقطة
                      </p>
                      {achievement.completedAt && (
                        <p className="text-xs text-gray-500 mt-1 text-center">
                          {new Date(achievement.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Trophy className="w-12 h-12 mx-auto text-gray-300" />
                <h3 className="mt-4 text-xl font-semibold">لم تكمل أي إنجازات بعد</h3>
                <p className="mt-2 text-gray-500">ابدأ باستخدام المحفظة للحصول على إنجازات جديدة</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="in-progress">
            {inProgressAchievements.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {inProgressAchievements
                  .filter(achievement => categoryFilter === 'all' || achievement.category === categoryFilter)
                  .map((achievement) => (
                    <div key={achievement.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
                      <AchievementBadge achievement={achievement} />
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        {achievement.condition}
                      </p>
                      {achievement.progress !== undefined && (
                        <p className="text-xs font-medium text-green-600 mt-1 text-center">
                          {achievement.progress}% مكتمل
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <ArrowUp className="w-12 h-12 mx-auto text-gray-300" />
                <h3 className="mt-4 text-xl font-semibold">لا توجد إنجازات قيد التقدم</h3>
                <p className="mt-2 text-gray-500">ابدأ العمل على مهام جديدة للحصول على إنجازات</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="by-category">
            <div className="space-y-8">
              {Object.entries(achievementsByCategory).map(([category, categoryAchievements]) => (
                <div key={category} className="border rounded-lg p-6 bg-white">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    {category === 'transaction' && <Rocket className="w-5 h-5 mr-2 text-blue-500" />}
                    {category === 'holding' && <Medal className="w-5 h-5 mr-2 text-purple-500" />}
                    {category === 'security' && <Shield className="w-5 h-5 mr-2 text-green-500" />}
                    {category === 'referral' && <Users className="w-5 h-5 mr-2 text-pink-500" />}
                    {category === 'loyalty' && <Star className="w-5 h-5 mr-2 text-yellow-500" />}
                    {category === 'education' && <Lightbulb className="w-5 h-5 mr-2 text-cyan-500" />}
                    {getCategoryTitle(category as Achievement['category'])}
                  </h2>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {categoryAchievements
                      .filter(achievement => statusFilter === 'all' || 
                        (statusFilter === 'completed' && achievement.completed) || 
                        (statusFilter === 'in-progress' && !achievement.completed && achievement.progress !== undefined))
                      .map((achievement) => (
                        <div key={achievement.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
                          <AchievementBadge achievement={achievement} size="sm" />
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            {achievement.points} نقطة
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">نظرة عامة على الإنجازات</h2>
          <p className="text-sm text-gray-600">
            أكمل المزيد من الإنجازات للحصول على مكافآت ومزايا خاصة
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">الإنجازات المكتملة</p>
                <p className="text-2xl font-bold">{completedAchievements.length} / {achievements.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">النقاط المكتسبة</p>
                <p className="text-2xl font-bold">{totalPoints}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Medal className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">المستوى الحالي</p>
                <p className="text-2xl font-bold">{currentLevel}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Button asChild>
            <Link href="/wallet">العودة إلى المحفظة</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function getCategoryTitle(category: Achievement['category']): string {
  const categories = {
    transaction: 'المعاملات',
    holding: 'الممتلكات',
    security: 'الأمان',
    referral: 'الإحالات',
    loyalty: 'الولاء',
    education: 'التعليم'
  };
  
  return categories[category] || category;
}