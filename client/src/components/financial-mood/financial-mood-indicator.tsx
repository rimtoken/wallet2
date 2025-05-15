import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { InfoIcon, RefreshCw, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

interface FinancialMoodIndicatorProps {
  userId: number;
  className?: string;
}

// تعريف تصنيفات الحالة المالية
type MoodLevel = 'excellent' | 'good' | 'neutral' | 'concerning' | 'critical';

interface FinancialMoodData {
  level: MoodLevel;
  emoji: string;
  color: string;
  message: string;
  score: number;
  factors: {
    type: 'positive' | 'negative';
    description: string;
    impact: number;
  }[];
}

export function FinancialMoodIndicator({ userId, className }: FinancialMoodIndicatorProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [moodData, setMoodData] = useState<FinancialMoodData | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  // جلب بيانات الحالة المالية
  const fetchFinancialMood = async () => {
    setIsLoading(true);
    try {
      // توليد بيانات محلية للعرض (في تطبيق حقيقي سيتم استبدالها بالبيانات من الخادم)
      const mockData = {
        level: ['excellent', 'good', 'neutral', 'concerning', 'critical'][Math.floor(Math.random() * 5)] as MoodLevel,
        emoji: ['😁', '😊', '😐', '😟', '😰'][Math.floor(Math.random() * 5)],
        color: 'bg-yellow-500',
        message: '',
        score: Math.floor(Math.random() * 100),
        factors: [
          { type: 'positive' as const, description: 'محفظتك متنوعة بشكل جيد', impact: 15 },
          { type: 'positive' as const, description: 'التزام منتظم بالميزانية', impact: 10 },
          { type: 'negative' as const, description: 'انخفاض في قيمة الأصول هذا الأسبوع', impact: -12 },
          { type: 'negative' as const, description: 'معدل الإنفاق مرتفع نسبيًا', impact: -8 }
        ]
      };
      
      // تحديد الرسالة بناءً على المستوى
      if (mockData.score >= 80) {
        mockData.message = 'حالتك المالية ممتازة!';
      } else if (mockData.score >= 60) {
        mockData.message = 'حالتك المالية جيدة';
      } else if (mockData.score >= 40) {
        mockData.message = 'حالتك المالية متوازنة';
      } else if (mockData.score >= 20) {
        mockData.message = 'حالتك المالية مقلقة';
      } else {
        mockData.message = 'حالتك المالية حرجة!';
      }
      
      // تعيين البيانات في الحالة
      setMoodData(mockData);
      
      // محاولة جلب البيانات من الخادم (لاحقاً يمكن استبدال المحاكاة بالبيانات الحقيقية)
      // const response = await fetch(`/api/portfolio/${userId}/financial-mood`);
      // if (response.ok) {
      //   const data = await response.json();
      //   setMoodData(data);
      // }
    } catch (error) {
      console.error('خطأ في جلب بيانات الحالة المالية:', error);
      // بيانات افتراضية في حال حدوث خطأ
      setMoodData({
        level: 'neutral',
        emoji: '😐',
        color: 'bg-yellow-500',
        message: 'حالتك المالية محايدة',
        score: 50,
        factors: [
          { type: 'positive', description: 'محفظتك متنوعة بشكل جيد', impact: 15 },
          { type: 'negative', description: 'قيمة الأصول انخفضت في الأسبوع الماضي', impact: -10 }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchFinancialMood();
  }, [userId]);

  // تحديث مستمر كل 5 دقائق
  useEffect(() => {
    const interval = setInterval(() => {
      fetchFinancialMood();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [userId]);

  // حساب لون الحالة المالية (للمؤشر)
  const getMoodColor = (level: MoodLevel): string => {
    switch (level) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-emerald-400';
      case 'neutral': return 'bg-yellow-500';
      case 'concerning': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // حساب لون النص للحالة المالية
  const getMoodTextColor = (level: MoodLevel): string => {
    switch (level) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-emerald-400';
      case 'neutral': return 'text-yellow-500';
      case 'concerning': return 'text-orange-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };
  
  // حساب لون خلفية مؤشر التقدم
  const getProgressStyle = (level: MoodLevel) => {
    const color = getMoodColor(level).replace('bg-', '');
    return { 
      "--progress-color": `var(--${color})`,
    } as React.CSSProperties;
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
            <p className="text-sm text-muted-foreground">جاري تحليل حالتك المالية...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!moodData) {
    return (
      <Card className={className}>
        <CardContent className="p-6 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <AlertCircle className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">لا تتوفر بيانات الحالة المالية</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={fetchFinancialMood}>
              <RefreshCw className="h-4 w-4 mr-2" />
              إعادة المحاولة
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">مؤشر الحالة المالية</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>يعكس مؤشر الحالة المالية الوضع العام لمحفظتك بناءً على عدة عوامل مثل التنوع، الأداء، وتقلبات السوق.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>نظرة سريعة عن صحة محفظتك المالية</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-center mb-4">
          <div className="text-6xl mb-2">{moodData.emoji}</div>
          <h3 className={`text-xl font-semibold ${getMoodTextColor(moodData.level)}`}>
            {moodData.message}
          </h3>
          <div className="w-full mt-3">
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div 
                className={`h-full ${getMoodColor(moodData.level)}`} 
                style={{ width: `${moodData.score}%`, transition: 'all 0.3s' }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>حرج</span>
              <span>ممتاز</span>
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
        </Button>

        {showDetails && (
          <div className="mt-4 space-y-3">
            <h4 className="font-medium text-sm">العوامل المؤثرة في حالتك المالية:</h4>
            <ul className="space-y-2">
              {moodData.factors.map((factor, index) => (
                <li 
                  key={index} 
                  className={`flex items-start p-2 rounded-md ${
                    factor.type === 'positive' ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  {factor.type === 'positive' ? (
                    <TrendingUp className="text-green-500 h-5 w-5 ml-2 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="text-red-500 h-5 w-5 ml-2 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm ${
                      factor.type === 'positive' ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {factor.description}
                    </p>
                    <div className="text-xs mt-1 font-medium">
                      التأثير: {factor.impact > 0 ? '+' : ''}{factor.impact}%
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="text-xs text-muted-foreground mt-2 text-center">
              تم التحديث: {new Date().toLocaleString('ar')}
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={fetchFinancialMood}>
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}