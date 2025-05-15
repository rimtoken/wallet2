import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Fingerprint, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  RefreshCw,
  Key,
  Mail,
  Eye,
  EyeOff
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface EnhancedSecurityProps {
  userId: number;
  email?: string;
}

export function EnhancedSecurity({ userId, email = "user@example.com" }: EnhancedSecurityProps) {
  const [activeTab, setActiveTab] = useState('2fa');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [biometricSupported, setBiometricSupported] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(65);
  
  // نموذج أكواد الاسترداد
  const recoveryCodes = [
    'DWFT-ALRJ-5X83-YC8M',
    'HU5N-P74T-KQ2Z-XE9W',
    'MKPL-B27J-9D4A-SF6V',
    'Z3GC-X58R-N7JB-YK2H',
    'Q1PA-W63T-HS8M-LN5F'
  ];
  
  // محاكاة عملية التحقق بخطوتين
  const startTwoFactorVerification = () => {
    setVerificationStep(1);
    // محاكاة إرسال رمز التحقق
    setTimeout(() => {
      // في تطبيق حقيقي، سيتم إرسال الرمز عبر البريد الإلكتروني أو الرسائل القصيرة
    }, 1000);
  };
  
  // التحقق من الرمز المدخل
  const verifyCode = () => {
    if (!verificationCode) return;
    
    setIsVerifying(true);
    
    // محاكاة عملية التحقق
    setTimeout(() => {
      setIsVerifying(false);
      
      // في تطبيق حقيقي، سنتحقق من صحة الرمز
      // هنا نفترض أن أي رمز من 6 أرقام صالح للعرض
      if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
        setVerificationStep(2);
        setTwoFactorEnabled(true);
      } else {
        // إظهار رسالة خطأ
        alert('الرمز غير صحيح. يرجى المحاولة مرة أخرى.');
      }
    }, 1500);
  };
  
  // تعطيل التحقق بخطوتين
  const disableTwoFactor = () => {
    setTwoFactorEnabled(false);
    setVerificationStep(0);
    setVerificationCode('');
  };
  
  // محاكاة تفعيل المقاييس الحيوية
  const setupBiometrics = () => {
    if (biometricSupported) {
      // في تطبيق حقيقي، سيتم استدعاء واجهة المقاييس الحيوية للمتصفح
      setTimeout(() => {
        setBiometricsEnabled(true);
      }, 1500);
    }
  };
  
  // نسخ رمز الاسترداد إلى الحافظة
  const copyRecoveryCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join('\n'));
    alert('تم نسخ أكواد الاسترداد إلى الحافظة');
  };
  
  // توليد أكواد استرداد جديدة
  const generateNewRecoveryCodes = () => {
    // في تطبيق حقيقي، سيتم توليد أكواد جديدة من الخادم
    alert('تم توليد أكواد استرداد جديدة');
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>ميزات الأمان المحسّنة</span>
          <Badge 
            variant={twoFactorEnabled || biometricsEnabled ? "default" : "destructive"}
            className="gap-1.5"
          >
            {twoFactorEnabled || biometricsEnabled ? (
              <>
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>آمن</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5" />
                <span>غير آمن</span>
              </>
            )}
          </Badge>
        </CardTitle>
        <CardDescription>
          تعزيز أمان حسابك باستخدام التحقق بخطوتين والمقاييس الحيوية
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="2fa" className="gap-1.5">
              <Smartphone className="h-4 w-4" />
              <span>التحقق بخطوتين</span>
            </TabsTrigger>
            <TabsTrigger value="biometrics" className="gap-1.5">
              <Fingerprint className="h-4 w-4" />
              <span>المقاييس الحيوية</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="2fa" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>التحقق بخطوتين (2FA)</Label>
                <p className="text-sm text-muted-foreground">
                  حماية حسابك بطبقة أمان إضافية
                </p>
              </div>
              
              {verificationStep === 0 && (
                <Button 
                  onClick={startTwoFactorVerification}
                  variant={twoFactorEnabled ? "outline" : "default"}
                  className="gap-1.5"
                >
                  {twoFactorEnabled ? (
                    <>
                      <span>تعطيل</span>
                      <Lock className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>تفعيل</span>
                      <ShieldCheck className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
              
              {twoFactorEnabled && verificationStep === 0 && (
                <Button 
                  onClick={disableTwoFactor}
                  variant="destructive"
                  size="sm"
                >
                  تعطيل
                </Button>
              )}
            </div>
            
            {/* عملية إعداد التحقق بخطوتين - الخطوة 1 */}
            {verificationStep === 1 && (
              <div className="space-y-4 mt-6">
                <Alert variant="default">
                  <Mail className="h-4 w-4" />
                  <AlertTitle>تم إرسال رمز التحقق</AlertTitle>
                  <AlertDescription>
                    تم إرسال رمز مكون من 6 أرقام إلى {email}
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">أدخل رمز التحقق</Label>
                  <div className="flex gap-2">
                    <Input
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="000000"
                      maxLength={6}
                    />
                    <Button 
                      onClick={verifyCode} 
                      disabled={!verificationCode || isVerifying}
                    >
                      {isVerifying ? 'جاري التحقق...' : 'تحقق'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* بعد تفعيل التحقق بخطوتين - الخطوة 2 */}
            {verificationStep === 2 && (
              <div className="space-y-4 mt-6">
                <Alert variant="default" className="border-green-500 text-green-500 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>تم تفعيل التحقق بخطوتين بنجاح</AlertTitle>
                  <AlertDescription>
                    حسابك الآن محمي بطبقة أمان إضافية
                  </AlertDescription>
                </Alert>
                
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      أكواد الاسترداد
                    </h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowRecoveryCodes(!showRecoveryCodes)}
                    >
                      {showRecoveryCodes ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    احتفظ بهذه الأكواد في مكان آمن. يمكنك استخدامها للوصول إلى حسابك في حالة فقدان جهازك.
                  </p>
                  
                  {showRecoveryCodes && (
                    <div className="mt-2 space-y-2 font-mono text-sm bg-muted p-3 rounded-md">
                      {recoveryCodes.map((code, index) => (
                        <div key={index} className="flex items-center">
                          <span>{code}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyRecoveryCodes}
                      className="gap-1.5"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      نسخ الأكواد
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={generateNewRecoveryCodes}
                      className="gap-1.5"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      توليد جديد
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {twoFactorEnabled && verificationStep === 0 && (
              <Alert className="mt-4 bg-muted border-muted-foreground/20">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle>التحقق بخطوتين مفعّل</AlertTitle>
                <AlertDescription>
                  ستتم مطالبتك برمز تحقق عند تسجيل الدخول من جهاز جديد أو متصفح غير معروف.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="biometrics" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>المصادقة البيومترية</Label>
                <p className="text-sm text-muted-foreground">
                  استخدم بصمة الإصبع أو التعرف على الوجه لتسجيل الدخول
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={biometricsEnabled}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setupBiometrics();
                    } else {
                      setBiometricsEnabled(false);
                    }
                  }}
                  disabled={!biometricSupported}
                />
                <Label>{biometricsEnabled ? 'مفعّل' : 'معطّل'}</Label>
              </div>
            </div>
            
            {!biometricSupported && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>المتصفح لا يدعم المقاييس الحيوية</AlertTitle>
                <AlertDescription>
                  يبدو أن متصفحك لا يدعم WebAuthn أو المصادقة البيومترية.
                </AlertDescription>
              </Alert>
            )}
            
            {biometricsEnabled && (
              <Alert className="mt-4 bg-muted border-muted-foreground/20">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <AlertTitle>المصادقة البيومترية مفعّلة</AlertTitle>
                <AlertDescription>
                  يمكنك الآن استخدام بصمة الإصبع أو التعرف على الوجه لتسجيل الدخول إلى حسابك.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="border rounded-lg p-4 mt-2">
              <h4 className="font-medium mb-3">أمان الحساب</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>قوة كلمة المرور</span>
                  <span className={
                    passwordStrength >= 80 ? "text-green-500" : 
                    passwordStrength >= 50 ? "text-amber-500" : 
                    "text-red-500"
                  }>
                    {passwordStrength >= 80 ? "قوية" : 
                     passwordStrength >= 50 ? "متوسطة" : 
                     "ضعيفة"}
                  </span>
                </div>
                
                <Progress value={passwordStrength} className="h-2" />
                
                <p className="text-xs text-muted-foreground mt-1">
                  كلمة مرور قوية تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز خاصة.
                </p>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  تغيير كلمة المرور
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        نوصي بتفعيل كلا طريقتي المصادقة للحصول على أقصى درجات الأمان.
      </CardFooter>
    </Card>
  );
}