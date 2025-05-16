import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const searchParams = useSearch();
  const tab = new URLSearchParams(searchParams).get('tab') || 'login';
  const { toast } = useToast();
  
  // تحقق مما إذا كان المستخدم مسجل الدخول بالفعل (باستخدام localStorage)
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setLocation("/");
    }
  }, [setLocation]);
  
  // تسجيل الدخول
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  
  // التسجيل
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  
  // تعيين عنوان الصفحة
  useEffect(() => {
    document.title = tab === 'register' ? 'التسجيل - RimToken' : 'تسجيل الدخول - RimToken';
  }, [tab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    
    try {
      // تحقق من بيانات اعتماد تجريبية
      if (loginUsername === 'demo_user' && loginPassword === 'password123') {
        // تخزين معلومات المستخدم في localStorage
        const userData = {
          id: 1,
          username: 'demo_user',
          email: 'demo@example.com'
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في RimToken!",
        });
        
        setTimeout(() => {
          setLocation("/");
        }, 1000);
      } else {
        // تحقق من المستخدمين المسجلين في localStorage
        const registeredUsers = localStorage.getItem('registeredUsers')
          ? JSON.parse(localStorage.getItem('registeredUsers') || '[]')
          : [];
          
        const user = registeredUsers.find((u: any) => u.username === loginUsername);
        
        if (user) {
          // في البيئة الحقيقية، سنتحقق من كلمة المرور المشفرة
          localStorage.setItem('user', JSON.stringify(user));
          
          toast({
            title: "تم تسجيل الدخول بنجاح",
            description: "مرحباً بك في RimToken!",
          });
          
          setTimeout(() => {
            setLocation("/");
          }, 1000);
        } else {
          throw new Error("اسم المستخدم أو كلمة المرور غير صحيحة");
        }
      }
    } catch (err: any) {
      setLoginError(err.message || "فشل تسجيل الدخول. الرجاء التحقق من بيانات الاعتماد الخاصة بك.");
      toast({
        title: "فشل تسجيل الدخول",
        description: err.message || "اسم المستخدم أو كلمة المرور غير صحيحة",
        variant: "destructive",
      });
    } finally {
      setLoginLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError("");
    
    // التحقق من تطابق كلمات المرور
    if (registerPassword !== registerConfirmPassword) {
      setRegisterError("كلمات المرور غير متطابقة");
      setRegisterLoading(false);
      toast({
        title: "خطأ في التسجيل",
        description: "كلمات المرور غير متطابقة",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // التحقق من أن اسم المستخدم غير مستخدم بالفعل
      const registeredUsers = localStorage.getItem('registeredUsers')
        ? JSON.parse(localStorage.getItem('registeredUsers') || '[]')
        : [];
      
      if (registeredUsers.some((u: any) => u.username === registerUsername)) {
        throw new Error("اسم المستخدم مستخدم بالفعل");
      }
      
      // إنشاء مستخدم جديد
      const newUser = {
        id: Date.now(),
        username: registerUsername,
        email: registerEmail,
        // في البيئة الحقيقية، سنقوم بتشفير كلمة المرور
      };
      
      // تخزين المستخدم في localStorage
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      
      // تسجيل الدخول تلقائيًا
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast({
        title: "تم التسجيل بنجاح",
        description: "مرحباً بك في RimToken!",
      });
      
      setTimeout(() => {
        setLocation("/");
      }, 1000);
    } catch (err: any) {
      setRegisterError(err.message || "فشل التسجيل. الرجاء المحاولة مرة أخرى.");
      toast({
        title: "خطأ في التسجيل",
        description: err.message || "فشل التسجيل",
        variant: "destructive",
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* نموذج تسجيل الدخول والتسجيل */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary">RimToken</h1>
            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              {tab === 'register' ? 'إنشاء حساب جديد' : 'مرحبًا بعودتك'}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {tab === 'register' 
                ? 'قم بإنشاء حساب للوصول إلى خدمات محفظة ريم توكن الرقمية' 
                : 'تسجيل الدخول إلى حسابك لإدارة محفظتك الرقمية'}
            </p>
          </div>
          
          <Tabs value={tab} className="w-full" onValueChange={(value) => {
            setLocation(`/auth?tab=${value}`);
          }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="register">حساب جديد</TabsTrigger>
            </TabsList>
            
            {/* نموذج تسجيل الدخول */}
            <TabsContent value="login">
              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-4 rounded-md shadow-sm">
                  <div>
                    <label htmlFor="login-username" className="block text-sm font-medium">
                      اسم المستخدم
                    </label>
                    <input
                      id="login-username"
                      name="username"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="login-password" className="block text-sm font-medium">
                      كلمة المرور
                    </label>
                    <input
                      id="login-password"
                      name="password"
                      type="password"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 text-sm text-white bg-red-500 rounded-md shadow">
                    {loginError}
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none"
                    disabled={loginLoading}
                  >
                    {loginLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                  </button>
                </div>
              </form>
            </TabsContent>
            
            {/* نموذج التسجيل */}
            <TabsContent value="register">
              <form className="space-y-6" onSubmit={handleRegister}>
                <div className="space-y-4 rounded-md shadow-sm">
                  <div>
                    <label htmlFor="register-username" className="block text-sm font-medium">
                      اسم المستخدم
                    </label>
                    <input
                      id="register-username"
                      name="username"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                      value={registerUsername}
                      onChange={(e) => setRegisterUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="register-email" className="block text-sm font-medium">
                      البريد الإلكتروني
                    </label>
                    <input
                      id="register-email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="register-password" className="block text-sm font-medium">
                      كلمة المرور
                    </label>
                    <input
                      id="register-password"
                      name="password"
                      type="password"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="register-confirm-password" className="block text-sm font-medium">
                      تأكيد كلمة المرور
                    </label>
                    <input
                      id="register-confirm-password"
                      name="confirm-password"
                      type="password"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {registerError && (
                  <div className="p-3 text-sm text-white bg-red-500 rounded-md shadow">
                    {registerError}
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none"
                    disabled={registerLoading}
                  >
                    {registerLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                  </button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* صورة الخلفية */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center" style={{
        backgroundImage: "linear-gradient(to bottom right, rgba(79, 70, 229, 0.8), rgba(138, 43, 226, 0.8)), url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000')"
      }}>
        <div className="flex items-center justify-center h-full px-20 bg-black bg-opacity-40">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">أهلًا بك في ريم توكن</h2>
            <p className="max-w-xl mx-auto mt-3 text-lg text-white">
              المنصة الأكثر أمانًا وسهولة لإدارة عملاتك المشفرة والتعامل مع Web3.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}