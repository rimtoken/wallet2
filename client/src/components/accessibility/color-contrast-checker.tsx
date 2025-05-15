import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, AlertCircle, Paintbrush, Eye, EyeOff } from 'lucide-react';

interface ContrastCheckerProps {
  onFixIssues?: (fixes: ColorFix[]) => void;
}

interface ColorPair {
  foreground: string;
  background: string;
  element: string;
  ratio: number;
  passes: {
    aa: boolean;
    aaLarge: boolean;
    aaa: boolean;
    aaaLarge: boolean;
  };
}

interface ColorFix {
  element: string;
  oldColor: string;
  newColor: string;
}

export function ColorContrastChecker({ onFixIssues }: ContrastCheckerProps) {
  const [activeTab, setActiveTab] = useState<string>('scan');
  const [scanning, setScanning] = useState<boolean>(false);
  const [issues, setIssues] = useState<ColorPair[]>([]);
  const [testColors, setTestColors] = useState<{ foreground: string; background: string }>({
    foreground: '#ffffff',
    background: '#4f46e5'
  });
  const [testRatio, setTestRatio] = useState<number | null>(null);
  const [fixes, setFixes] = useState<ColorFix[]>([]);

  // حساب نسبة التباين بين لونين
  function calculateContrastRatio(foreground: string, background: string): number {
    // تحويل ألوان HEX إلى RGB
    const getRGB = (hex: string) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };

    // حساب النسبة المنطقية للون
    const getLuminance = (rgb: { r: number, g: number, b: number }) => {
      const a = [rgb.r, rgb.g, rgb.b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const rgb1 = getRGB(foreground);
    const rgb2 = getRGB(background);
    const lum1 = getLuminance(rgb1);
    const lum2 = getLuminance(rgb2);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }

  // فحص ما إذا كانت نسبة التباين تجتاز معايير WCAG
  function checkRatioPass(ratio: number) {
    return {
      aa: ratio >= 4.5,
      aaLarge: ratio >= 3,
      aaa: ratio >= 7,
      aaaLarge: ratio >= 4.5
    };
  }

  // مسح الصفحة للتحقق من تباين الألوان
  const scanPage = () => {
    setScanning(true);
    setTimeout(() => {
      // في تطبيق حقيقي، سنقوم بمسح العناصر في الصفحة
      // هذه بيانات مثالية للعرض
      const results: ColorPair[] = [
        {
          foreground: '#777777',
          background: '#f8f8f8',
          element: 'نص الوصف في بطاقات المحفظة',
          ratio: 2.6,
          passes: checkRatioPass(2.6)
        },
        {
          foreground: '#ffffff',
          background: '#6366f1',
          element: 'زر الإجراءات الرئيسية',
          ratio: 3.2,
          passes: checkRatioPass(3.2)
        },
        {
          foreground: '#22c55e',
          background: '#ffffff',
          element: 'نص النسبة المئوية الإيجابية',
          ratio: 1.8,
          passes: checkRatioPass(1.8)
        },
        {
          foreground: '#d1d5db',
          background: '#1f2937',
          element: 'روابط التذييل',
          ratio: 8.6,
          passes: checkRatioPass(8.6)
        }
      ];
      
      setIssues(results.filter(result => !result.passes.aa));
      setScanning(false);
    }, 1500);
  };

  // حساب نسبة التباين في أداة الاختبار
  const testContrast = () => {
    const ratio = calculateContrastRatio(testColors.foreground, testColors.background);
    setTestRatio(parseFloat(ratio.toFixed(2)));
  };

  // توليد الإصلاحات المقترحة
  const generateFixes = () => {
    const fixes: ColorFix[] = [];
    
    issues.forEach(issue => {
      // في بيئة حقيقية، سنقوم بحساب اللون المحسّن
      // هذه إصلاحات مثالية
      if (issue.element === 'نص الوصف في بطاقات المحفظة') {
        fixes.push({
          element: issue.element,
          oldColor: issue.foreground,
          newColor: '#555555'
        });
      } else if (issue.element === 'نص النسبة المئوية الإيجابية') {
        fixes.push({
          element: issue.element,
          oldColor: issue.foreground,
          newColor: '#0d9348'
        });
      }
    });
    
    setFixes(fixes);
  };

  // تطبيق الإصلاحات
  const applyFixes = () => {
    if (onFixIssues && fixes.length > 0) {
      onFixIssues(fixes);
      // تحديث القائمة بعد تطبيق الإصلاحات
      setIssues(prevIssues => 
        prevIssues.filter(issue => !fixes.some(fix => fix.element === issue.element))
      );
      setFixes([]);
    }
  };

  // تشغيل الاختبار عند تغيير الألوان
  useEffect(() => {
    if (testColors.foreground && testColors.background) {
      testContrast();
    }
  }, [testColors]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>مدقق تباين الألوان</span>
          <Badge variant={issues.length > 0 ? "destructive" : "default"} className="gap-1.5">
            {issues.length > 0 ? (
              <>
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>{issues.length} مشاكل</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>تباين متوافق</span>
              </>
            )}
          </Badge>
        </CardTitle>
        <CardDescription>
          تأكد من توافق ألوان التطبيق مع معايير WCAG لإمكانية الوصول
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="scan">فحص التباين</TabsTrigger>
            <TabsTrigger value="test">اختبار الألوان</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scan" className="space-y-4">
            <div className="flex justify-between">
              <Button
                onClick={scanPage}
                disabled={scanning}
                className="gap-1.5"
              >
                {scanning ? 'جاري الفحص...' : 'فحص الصفحة'}
                <Eye className="h-4 w-4" />
              </Button>
              
              {issues.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={generateFixes}
                  className="gap-1.5"
                >
                  <Paintbrush className="h-4 w-4" />
                  اقتراح إصلاحات
                </Button>
              )}
            </div>
            
            {scanning ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full"></div>
              </div>
            ) : issues.length > 0 ? (
              <div className="space-y-4 mt-4">
                {issues.map((issue, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{issue.element}</span>
                      <span className="text-destructive font-medium">نسبة التباين: {issue.ratio.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex gap-2 mb-3">
                      <div 
                        className="w-6 h-6 rounded border" 
                        style={{ backgroundColor: issue.foreground }}
                        title={`لون النص: ${issue.foreground}`}
                      />
                      <div 
                        className="w-6 h-6 rounded border" 
                        style={{ backgroundColor: issue.background }}
                        title={`لون الخلفية: ${issue.background}`}
                      />
                      <div 
                        className="px-3 py-1 rounded text-sm"
                        style={{ 
                          color: issue.foreground, 
                          backgroundColor: issue.background
                        }}
                      >
                        معاينة
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <div>
                        {issue.passes.aaLarge ? (
                          <CheckCircle2 className="inline-block h-3.5 w-3.5 text-green-500 mr-1" />
                        ) : (
                          <AlertCircle className="inline-block h-3.5 w-3.5 text-destructive mr-1" />
                        )}
                        AA (نص كبير): نسبة تباين ≥ 3.0
                      </div>
                      <div>
                        {issue.passes.aa ? (
                          <CheckCircle2 className="inline-block h-3.5 w-3.5 text-green-500 mr-1" />
                        ) : (
                          <AlertCircle className="inline-block h-3.5 w-3.5 text-destructive mr-1" />
                        )}
                        AA (نص عادي): نسبة تباين ≥ 4.5
                      </div>
                    </div>
                    
                    {fixes.some(fix => fix.element === issue.element) && (
                      <div className="mt-3 border-t pt-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded border" 
                            style={{ backgroundColor: fixes.find(f => f.element === issue.element)?.newColor }}
                          />
                          <span className="text-sm">
                            اللون المقترح: {fixes.find(f => f.element === issue.element)?.newColor}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {fixes.length > 0 && (
                  <Button onClick={applyFixes} className="w-full mt-4">
                    تطبيق الإصلاحات
                  </Button>
                )}
              </div>
            ) : (
              <Alert className="bg-muted border-muted-foreground/20">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle>تباين الألوان متوافق</AlertTitle>
                <AlertDescription>
                  لم يتم العثور على مشاكل في تباين الألوان في الصفحة الحالية.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="test" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="foreground">لون النص</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="foreground"
                      value={testColors.foreground}
                      onChange={(e) => setTestColors(prev => ({ ...prev, foreground: e.target.value }))}
                    />
                    <input 
                      type="color" 
                      value={testColors.foreground}
                      onChange={(e) => setTestColors(prev => ({ ...prev, foreground: e.target.value }))}
                      className="p-0 w-10 border-0" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="background">لون الخلفية</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="background"
                      value={testColors.background}
                      onChange={(e) => setTestColors(prev => ({ ...prev, background: e.target.value }))}
                    />
                    <input 
                      type="color" 
                      value={testColors.background}
                      onChange={(e) => setTestColors(prev => ({ ...prev, background: e.target.value }))}
                      className="p-0 w-10 border-0"
                    />
                  </div>
                </div>
              </div>
              
              <div 
                className="p-6 rounded-lg border flex justify-center items-center"
                style={{ 
                  backgroundColor: testColors.background,
                  color: testColors.foreground
                }}
              >
                <span className="text-xl font-medium">معاينة النص</span>
              </div>
              
              {testRatio !== null && (
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">نسبة التباين</span>
                    <span 
                      className={`font-medium ${testRatio >= 4.5 ? 'text-green-500' : 'text-destructive'}`}
                    >
                      {testRatio.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      {testRatio >= 3 ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-destructive mr-2" />
                      )}
                      <span>AA (نص كبير, 18pt+): {testRatio >= 3 ? 'يجتاز' : 'لا يجتاز'}</span>
                    </div>
                    
                    <div className="flex items-center">
                      {testRatio >= 4.5 ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-destructive mr-2" />
                      )}
                      <span>AA (نص عادي): {testRatio >= 4.5 ? 'يجتاز' : 'لا يجتاز'}</span>
                    </div>
                    
                    <div className="flex items-center">
                      {testRatio >= 4.5 ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-destructive mr-2" />
                      )}
                      <span>AAA (نص كبير, 18pt+): {testRatio >= 4.5 ? 'يجتاز' : 'لا يجتاز'}</span>
                    </div>
                    
                    <div className="flex items-center">
                      {testRatio >= 7 ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-destructive mr-2" />
                      )}
                      <span>AAA (نص عادي): {testRatio >= 7 ? 'يجتاز' : 'لا يجتاز'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        تباين الألوان المناسب ضروري لمستخدمي الويب الذين يعانون من ضعف الرؤية أو عمى الألوان.
      </CardFooter>
    </Card>
  );
}