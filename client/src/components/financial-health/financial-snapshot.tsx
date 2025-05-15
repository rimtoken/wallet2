import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, CheckCircle, Activity, TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';

interface FinancialHealthSnapshotProps {
  userId: number;
}

// نسب صحة مالية سليمة 
const HEALTHY_SAVINGS_RATIO = 0.2; // 20% من الدخل للادخار
const HEALTHY_DEBT_RATIO = 0.36; // يجب ألا يتجاوز الدين 36% من الدخل
const HEALTHY_CRYPTO_ALLOCATION = 0.15; // 15% من المحفظة الاستثمارية للعملات المشفرة

export function FinancialHealthSnapshot({ userId }: FinancialHealthSnapshotProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  // استعلام بيانات الصحة المالية
  const { data: financialHealth, isLoading, refetch } = useQuery({
    queryKey: ['/api/portfolio', userId, 'financial-health'],
    queryFn: async () => {
      // في بيئة حقيقية، سنجلب البيانات من الخادم
      // هذه بيانات مثالية للعرض
      return {
        savingsRatio: 0.15, // 15% من الدخل للادخار
        debtToIncomeRatio: 0.42, // 42% من الدخل للديون
        cryptoAllocation: 0.25, // 25% من المحفظة الاستثمارية للعملات المشفرة
        diversificationScore: 65, // درجة تنوع المحفظة من 100
        monthlyExpenses: 3200,
        monthlyIncome: 5000,
        emergencyFund: 10000,
        recommendedEmergencyFund: 15000,
        expenseBreakdown: [
          { name: 'سكن', value: 1200 },
          { name: 'طعام', value: 800 },
          { name: 'نقل', value: 400 },
          { name: 'ترفيه', value: 300 },
          { name: 'متنوع', value: 500 }
        ]
      };
    },
    enabled: false // لا تقم بالاستعلام تلقائياً عند تحميل المكون
  });

  // توليد لقطة جديدة للصحة المالية
  const generateSnapshot = async () => {
    setIsGenerating(true);
    await refetch();
    setIsGenerating(false);
  };

  // تقييم النسب المالية
  const evaluateRatio = (actual: number, healthy: number, isLowerBetter = false) => {
    if (isLowerBetter) {
      if (actual <= healthy) return 'جيد';
      if (actual <= healthy * 1.5) return 'متوسط';
      return 'ضعيف';
    } else {
      if (actual >= healthy) return 'جيد';
      if (actual >= healthy * 0.7) return 'متوسط';
      return 'ضعيف';
    }
  };

  // الحصول على لون وأيقونة بناءً على التقييم
  const getRatingProps = (rating: string) => {
    switch (rating) {
      case 'جيد':
        return { color: 'text-green-500', icon: <CheckCircle className="h-5 w-5" /> };
      case 'متوسط':
        return { color: 'text-amber-500', icon: <AlertTriangle className="h-5 w-5" /> };
      case 'ضعيف':
        return { color: 'text-red-500', icon: <AlertTriangle className="h-5 w-5" /> };
      default:
        return { color: 'text-gray-500', icon: <Activity className="h-5 w-5" /> };
    }
  };

  // حساب درجة الصحة المالية الإجمالية
  const calculateOverallScore = () => {
    if (!financialHealth) return 0;
    
    let score = 0;
    
    // نسبة المدخرات (20 نقطة)
    score += (financialHealth.savingsRatio / HEALTHY_SAVINGS_RATIO) * 20;
    
    // نسبة الدين إلى الدخل (20 نقطة)
    score += (1 - (financialHealth.debtToIncomeRatio / HEALTHY_DEBT_RATIO)) * 20;
    
    // تخصيص العملات المشفرة (20 نقطة)
    const cryptoScore = financialHealth.cryptoAllocation <= HEALTHY_CRYPTO_ALLOCATION ? 20 :
      20 - ((financialHealth.cryptoAllocation - HEALTHY_CRYPTO_ALLOCATION) / HEALTHY_CRYPTO_ALLOCATION) * 20;
    score += cryptoScore;
    
    // درجة التنوع (20 نقطة)
    score += (financialHealth.diversificationScore / 100) * 20;
    
    // صندوق الطوارئ (20 نقطة)
    score += (financialHealth.emergencyFund / financialHealth.recommendedEmergencyFund) * 20;
    
    return Math.min(Math.max(Math.round(score), 0), 100);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>لقطة الصحة المالية</span>
          <Button 
            onClick={generateSnapshot}
            disabled={isGenerating}
            variant="outline"
            size="sm"
          >
            {isGenerating ? 'جاري التوليد...' : 'توليد لقطة جديدة'}
          </Button>
        </CardTitle>
        <CardDescription>
          تحليل شامل لصحتك المالية وتوصيات لتحسينها
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full"></div>
          </div>
        ) : !financialHealth ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              انقر على "توليد لقطة جديدة" لعرض تحليل صحتك المالية
            </p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="details">تفاصيل</TabsTrigger>
              <TabsTrigger value="recommendations">توصيات</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-indigo-600 text-transparent bg-clip-text">
                  {calculateOverallScore()}/100
                </div>
                <p className="text-sm text-muted-foreground mt-1">درجة الصحة المالية</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <span>نسبة الادخار</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {financialHealth.savingsRatio * 100}%
                    <span className={getRatingProps(evaluateRatio(financialHealth.savingsRatio, HEALTHY_SAVINGS_RATIO)).color}>
                      {getRatingProps(evaluateRatio(financialHealth.savingsRatio, HEALTHY_SAVINGS_RATIO)).icon}
                    </span>
                  </div>
                </div>
                <Progress value={financialHealth.savingsRatio * 100 / HEALTHY_SAVINGS_RATIO} className="h-2" />
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    <span>نسبة الدين إلى الدخل</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {financialHealth.debtToIncomeRatio * 100}%
                    <span className={getRatingProps(evaluateRatio(financialHealth.debtToIncomeRatio, HEALTHY_DEBT_RATIO, true)).color}>
                      {getRatingProps(evaluateRatio(financialHealth.debtToIncomeRatio, HEALTHY_DEBT_RATIO, true)).icon}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={100 - (financialHealth.debtToIncomeRatio * 100 / HEALTHY_DEBT_RATIO)} 
                  className="h-2" 
                />
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="text-sm font-medium">الدخل الشهري</h4>
                  <div className="text-2xl font-bold mt-1">{formatCurrency(financialHealth.monthlyIncome)}</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="text-sm font-medium">المصروفات الشهرية</h4>
                  <div className="text-2xl font-bold mt-1">{formatCurrency(financialHealth.monthlyExpenses)}</div>
                </div>
              </div>
              
              <div className="h-64 mt-6">
                <p className="text-sm font-medium mb-2">تحليل المصروفات</p>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialHealth.expenseBreakdown}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${formatCurrency(value as number)}`, 'القيمة']} />
                    <Bar dataKey="value" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">زيادة نسبة الادخار</h4>
                    <p className="text-sm text-muted-foreground">
                      حاول زيادة نسبة الادخار من {(financialHealth.savingsRatio * 100).toFixed(0)}% إلى {(HEALTHY_SAVINGS_RATIO * 100).toFixed(0)}% من دخلك الشهري.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <TrendingDown className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">تقليل نسبة الدين</h4>
                    <p className="text-sm text-muted-foreground">
                      حاول تقليل نسبة الدين من {(financialHealth.debtToIncomeRatio * 100).toFixed(0)}% إلى أقل من {(HEALTHY_DEBT_RATIO * 100).toFixed(0)}% من دخلك.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">زيادة صندوق الطوارئ</h4>
                    <p className="text-sm text-muted-foreground">
                      زيادة صندوق الطوارئ من {formatCurrency(financialHealth.emergencyFund)} إلى {formatCurrency(financialHealth.recommendedEmergencyFund)} 
                      لتغطية 3-6 أشهر من المصروفات.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        * هذه التحليلات تقريبية وتعتمد على البيانات المتوفرة. يُنصح باستشارة خبير مالي للحصول على نصائح مخصصة.
      </CardFooter>
    </Card>
  );
}