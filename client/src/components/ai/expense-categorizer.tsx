import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tag, ShoppingCart, Home, Utensils, Car, Laptop, Plane, CreditCard, FileText, Tags, ArrowRight } from 'lucide-react';

interface ExpenseCategorizerProps {
  onCategorize?: (category: string) => void;
}

// تعريف نموذج التصنيف
type Category = {
  id: string;
  name: string;
  icon: React.ReactNode;
  keywords: string[];
  color: string;
};

export function ExpenseCategorizer({ onCategorize }: ExpenseCategorizerProps) {
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<Category | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<{ description: string; category: Category }[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // قائمة الفئات المتاحة
  const categories: Category[] = [
    {
      id: 'shopping',
      name: 'تسوق',
      icon: <ShoppingCart className="h-4 w-4" />,
      keywords: ['تسوق', 'شراء', 'متجر', 'مول', 'ملابس', 'أحذية', 'سوق'],
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
    },
    {
      id: 'food',
      name: 'طعام ومشروبات',
      icon: <Utensils className="h-4 w-4" />,
      keywords: ['مطعم', 'كافيه', 'قهوة', 'غداء', 'عشاء', 'وجبة', 'طعام', 'شاي', 'مشروب'],
      color: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
    },
    {
      id: 'housing',
      name: 'سكن ومرافق',
      icon: <Home className="h-4 w-4" />,
      keywords: ['إيجار', 'سكن', 'منزل', 'كهرباء', 'ماء', 'فاتورة', 'منزلية', 'أثاث'],
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
    },
    {
      id: 'transportation',
      name: 'مواصلات',
      icon: <Car className="h-4 w-4" />,
      keywords: ['سيارة', 'وقود', 'بنزين', 'أوبر', 'تاكسي', 'حافلة', 'قطار', 'تذكرة'],
      color: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    },
    {
      id: 'tech',
      name: 'تكنولوجيا',
      icon: <Laptop className="h-4 w-4" />,
      keywords: ['جهاز', 'هاتف', 'كمبيوتر', 'لاب توب', 'جوال', 'برنامج', 'إلكترونيات'],
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
    },
    {
      id: 'travel',
      name: 'سفر',
      icon: <Plane className="h-4 w-4" />,
      keywords: ['سفر', 'فندق', 'طيران', 'حجز', 'عطلة', 'رحلة', 'إجازة'],
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100'
    },
    {
      id: 'bills',
      name: 'فواتير واشتراكات',
      icon: <FileText className="h-4 w-4" />,
      keywords: ['فاتورة', 'اشتراك', 'تأمين', 'إنترنت', 'جوال', 'خدمة', 'شهري'],
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100'
    },
    {
      id: 'financial',
      name: 'خدمات مالية',
      icon: <CreditCard className="h-4 w-4" />,
      keywords: ['بنك', 'رسوم', 'عمولة', 'تحويل', 'قرض', 'استثمار', 'بطاقة', 'دفعة'],
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
    },
    {
      id: 'other',
      name: 'أخرى',
      icon: <Tag className="h-4 w-4" />,
      keywords: [],
      color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
    }
  ];

  // وظيفة لتحديد فئة المصروفات بناءً على الوصف
  const categorizeExpense = () => {
    if (!description.trim()) return;

    setIsProcessing(true);
    
    // محاكاة لتأخير الاستجابة كما لو كنا نستدعي API
    setTimeout(() => {
      const lowerDesc = description.toLowerCase();
      
      // البحث عن تطابق في الكلمات المفتاحية للفئات
      let matchedCategory = categories.find(category => 
        category.keywords.some(keyword => 
          lowerDesc.includes(keyword.toLowerCase())
        )
      );
      
      // إذا لم يتم العثور على تطابق، استخدم الفئة "أخرى"
      if (!matchedCategory) {
        matchedCategory = categories.find(c => c.id === 'other')!;
      }
      
      setCategory(matchedCategory);
      
      // إضافة إلى المعاملات الأخيرة
      setRecentTransactions(prev => [
        { description, category: matchedCategory! },
        ...prev.slice(0, 4) // الاحتفاظ بأحدث 5 معاملات فقط
      ]);
      
      if (onCategorize) {
        onCategorize(matchedCategory.id);
      }
      
      setIsProcessing(false);
    }, 1000);
  };

  // وظيفة لاستخدام فئة سابقة
  const useCategory = (selectedCategory: Category) => {
    setCategory(selectedCategory);
    if (onCategorize) {
      onCategorize(selectedCategory.id);
    }
  };

  // إعادة تعيين الحقول
  const resetForm = () => {
    setDescription('');
    setCategory(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>مصنف المصروفات الذكي</span>
          <Badge variant="outline" className="gap-1.5">
            <Tags className="h-3.5 w-3.5" />
            <span>تصنيف تلقائي</span>
          </Badge>
        </CardTitle>
        <CardDescription>
          أدخل وصفًا للمعاملة وسيقوم النظام بتصنيفها تلقائيًا
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">وصف المعاملة</Label>
          <div className="flex gap-2">
            <Input
              id="description"
              placeholder="مثال: شراء قهوة من ستاربكس"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button 
              onClick={categorizeExpense} 
              disabled={!description.trim() || isProcessing}
            >
              {isProcessing ? 'جاري التصنيف...' : 'تصنيف'}
            </Button>
          </div>
        </div>
        
        {category && (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">نتيجة التصنيف:</span>
              <Button variant="ghost" size="sm" onClick={resetForm}>إعادة تعيين</Button>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`rounded-full p-2 ${category.color.split(' ').slice(0, 2).join(' ')}`}>
                {category.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-medium">{category.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {recentTransactions.length > 0 && (
          <div className="space-y-2">
            <Label>المعاملات الأخيرة</Label>
            <div className="space-y-2">
              {recentTransactions.map((tx, index) => (
                <div 
                  key={index} 
                  className="border rounded-lg p-3 flex justify-between items-center cursor-pointer hover:bg-muted/50"
                  onClick={() => useCategory(tx.category)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`rounded-full p-1.5 ${tx.category.color.split(' ').slice(0, 2).join(' ')}`}>
                      {tx.category.icon}
                    </div>
                    <span className="text-sm">{tx.description}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{tx.category.name}</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <span>التصنيف يعتمد على الكلمات المفتاحية في وصف المعاملة</span>
      </CardFooter>
    </Card>
  );
}