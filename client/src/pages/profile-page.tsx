import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { UserIcon, SettingsIcon, KeyIcon, LogOutIcon, CreditCardIcon, ShieldIcon, CheckCircleIcon } from "lucide-react";

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState<any>({});
  
  // استرجاع بيانات المستخدم
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setUpdatedUser(userData);
    } else {
      // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول إذا لم يكن مسجلاً
      toast({
        title: "يرجى تسجيل الدخول",
        description: "عليك تسجيل الدخول للوصول إلى الملف الشخصي",
        variant: "destructive",
      });
      setLocation("/auth");
    }
    setLoading(false);
  }, [setLocation, toast]);
  
  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "تم تسجيل الخروج بنجاح",
      description: "نتمنى أن نراك قريباً!",
    });
    setLocation("/auth");
  };
  
  // تحديث معلومات المستخدم
  const handleUpdateProfile = () => {
    if (editMode) {
      // حفظ التغييرات
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // تحديث المستخدم في قائمة المستخدمين المسجلين
      const registeredUsers = localStorage.getItem('registeredUsers')
        ? JSON.parse(localStorage.getItem('registeredUsers') || '[]')
        : [];
      
      const updatedUsers = registeredUsers.map((u: any) => 
        u.id === user.id ? updatedUser : u
      );
      
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم حفظ التغييرات بنجاح",
      });
    }
    
    // تبديل وضع التحرير
    setEditMode(!editMode);
  };
  
  // تحديث حقول المستخدم
  const handleFieldChange = (field: string, value: string) => {
    setUpdatedUser({
      ...updatedUser,
      [field]: value
    });
  };
  
  // المعاملات الافتراضية للمستخدم
  const transactions = [
    { id: 1, type: 'استلام', amount: '0.5 BTC', date: '2025-05-10', status: 'مكتمل' },
    { id: 2, type: 'إرسال', amount: '0.2 ETH', date: '2025-05-08', status: 'مكتمل' },
    { id: 3, type: 'شراء', amount: '100 USDT', date: '2025-05-05', status: 'مكتمل' },
    { id: 4, type: 'استلام', amount: '10 SOL', date: '2025-05-01', status: 'مكتمل' },
  ];
  
  // الأصول الافتراضية للمستخدم
  const assets = [
    { symbol: 'BTC', name: 'Bitcoin', balance: '0.75', value: 37500 },
    { symbol: 'ETH', name: 'Ethereum', balance: '5.0', value: 12500 },
    { symbol: 'USDT', name: 'Tether', balance: '500', value: 500 },
    { symbol: 'SOL', name: 'Solana', balance: '25', value: 2500 },
  ];
  
  // إذا كانت الصفحة قيد التحميل أو لم يتم العثور على المستخدم
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-t-4 border-primary rounded-full"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // سيتم إعادة التوجيه من useEffect
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        {/* رأس الصفحة مع معلومات المستخدم الأساسية */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Card className="w-full md:w-1/3">
            <CardHeader className="text-center">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24 flex items-center justify-center bg-primary text-white font-bold text-xl">
                  {user.username.substring(0, 2).toUpperCase()}
                </Avatar>
              </div>
              <CardTitle className="mt-4 text-2xl">{user.username}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              
              <div className="flex justify-center gap-2 mt-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircleIcon className="h-3 w-3 mr-1" /> حساب موثق
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  مستخدم منذ {new Date().getFullYear()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">رقم المستخدم</span>
                  <span className="font-medium">#{user.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">تاريخ الانضمام</span>
                  <span className="font-medium">{new Date().toLocaleDateString('ar-SA')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">الحالة</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    نشط
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" onClick={handleUpdateProfile}>
                {editMode ? "حفظ التغييرات" : "تعديل الملف الشخصي"}
              </Button>
              <Button variant="outline" className="w-full text-red-500 hover:text-red-700" onClick={handleLogout}>
                <LogOutIcon className="h-4 w-4 mr-2" />
                تسجيل الخروج
              </Button>
            </CardFooter>
          </Card>
          
          {/* الإحصائيات والبيانات الرئيسية */}
          <div className="w-full md:w-2/3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>الملف الشخصي</CardTitle>
                <CardDescription>معلومات الحساب والإعدادات</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">
                      <UserIcon className="h-4 w-4 mr-2" />
                      المعلومات الشخصية
                    </TabsTrigger>
                    <TabsTrigger value="security">
                      <ShieldIcon className="h-4 w-4 mr-2" />
                      الأمان
                    </TabsTrigger>
                    <TabsTrigger value="preferences">
                      <SettingsIcon className="h-4 w-4 mr-2" />
                      التفضيلات
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* المعلومات الشخصية */}
                  <TabsContent value="personal" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">اسم المستخدم</Label>
                        {editMode ? (
                          <Input 
                            id="username" 
                            value={updatedUser.username || ''} 
                            onChange={(e) => handleFieldChange('username', e.target.value)}
                          />
                        ) : (
                          <div className="p-2 border rounded-md bg-muted/20">{user.username}</div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        {editMode ? (
                          <Input 
                            id="email" 
                            type="email" 
                            value={updatedUser.email || ''} 
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                          />
                        ) : (
                          <div className="p-2 border rounded-md bg-muted/20">{user.email}</div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fullName">الاسم الكامل</Label>
                        {editMode ? (
                          <Input 
                            id="fullName" 
                            value={updatedUser.fullName || ''} 
                            onChange={(e) => handleFieldChange('fullName', e.target.value)}
                          />
                        ) : (
                          <div className="p-2 border rounded-md bg-muted/20">{user.fullName || 'غير محدد'}</div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        {editMode ? (
                          <Input 
                            id="phone" 
                            value={updatedUser.phone || ''} 
                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                          />
                        ) : (
                          <div className="p-2 border rounded-md bg-muted/20">{user.phone || 'غير محدد'}</div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* الأمان */}
                  <TabsContent value="security" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">كلمة المرور</h4>
                          <p className="text-sm text-muted-foreground">تم التعيين قبل {Math.floor(Math.random() * 30) + 1} يوم</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <KeyIcon className="h-4 w-4 mr-2" />
                          تغيير كلمة المرور
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">المصادقة الثنائية</h4>
                          <p className="text-sm text-muted-foreground">تعزيز أمان حسابك</p>
                        </div>
                        <Button variant="outline" size="sm">
                          تفعيل
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">أجهزة الدخول</h4>
                          <p className="text-sm text-muted-foreground">جهاز واحد متصل حاليًا</p>
                        </div>
                        <Button variant="outline" size="sm">
                          إدارة الأجهزة
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* التفضيلات */}
                  <TabsContent value="preferences" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">اللغة</h4>
                          <p className="text-sm text-muted-foreground">تغيير لغة واجهة المستخدم</p>
                        </div>
                        <select className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                          <option value="ar">العربية</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">الإشعارات</h4>
                          <p className="text-sm text-muted-foreground">إدارة تفضيلات الإشعارات</p>
                        </div>
                        <Button variant="outline" size="sm">
                          تخصيص
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">العملة الافتراضية</h4>
                          <p className="text-sm text-muted-foreground">عملة العرض الرئيسية</p>
                        </div>
                        <select className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary">
                          <option value="usd">USD</option>
                          <option value="eur">EUR</option>
                          <option value="sar">SAR</option>
                        </select>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* الأصول والمعاملات */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>الأصول الرقمية</CardTitle>
                  <CardDescription>الأصول المحفوظة في محفظتك</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assets.map((asset) => (
                      <div key={asset.symbol} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <span className="font-bold">{asset.symbol}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">{asset.name}</h4>
                            <p className="text-sm text-muted-foreground">{asset.balance} {asset.symbol}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${asset.value.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <CreditCardIcon className="h-4 w-4 mr-2" />
                    عرض كل الأصول
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>آخر المعاملات</CardTitle>
                  <CardDescription>تاريخ معاملات الحساب</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                        <div>
                          <h4 className="font-medium">
                            {tx.type} {tx.amount}
                          </h4>
                          <p className="text-sm text-muted-foreground">{tx.date}</p>
                        </div>
                        <div>
                          <span 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              tx.status === 'مكتمل' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    عرض كل المعاملات
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}