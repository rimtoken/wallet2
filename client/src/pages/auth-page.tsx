import { useState, useEffect } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FiEye, FiEyeOff, FiCheck, FiX, FiRefreshCw } from "react-icons/fi";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/language-context";
import { Checkbox } from "@/components/ui/checkbox";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const searchParams = useSearch();
  const tab = new URLSearchParams(searchParams).get('tab') || 'login';
  const { toast } = useToast();
  const { translate } = useLanguage();
  
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
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // التسجيل - معلومات شخصية
  const [registerFirstName, setRegisterFirstName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPhoneCountry, setRegisterPhoneCountry] = useState("+222");
  
  // التسجيل - عنوان الفواتير
  const [registerCompanyName, setRegisterCompanyName] = useState("");
  const [registerStreetAddress, setRegisterStreetAddress] = useState("");
  const [registerStreetAddress2, setRegisterStreetAddress2] = useState("");
  const [registerCity, setRegisterCity] = useState("");
  const [registerCountry, setRegisterCountry] = useState("Libya");
  const [registerState, setRegisterState] = useState("");
  const [registerPostcode, setRegisterPostcode] = useState("");
  
  // التسجيل - معلومات إضافية
  const [registerCurrency, setRegisterCurrency] = useState("LYD");
  
  // التسجيل - أمان الحساب
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); // 0: ضعيف، 1: متوسط، 2: قوي
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);
  const [receiveEmails, setReceiveEmails] = useState(true);
  
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
  
  // وظيفة لقياس قوة كلمة المرور
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    
    // التحقق من طول كلمة المرور
    if (password.length >= 8) strength += 1;
    
    // التحقق من وجود أرقام
    if (/\d/.test(password)) strength += 1;
    
    // التحقق من وجود أحرف خاصة
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    
    // التحقق من وجود أحرف كبيرة وصغيرة
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    
    // تعيين مستوى قوة كلمة المرور (0-3)
    setPasswordStrength(Math.min(3, Math.floor(strength * 1.5)));
  };
  
  // تنفيذ فحص قوة كلمة المرور عند تغييرها
  useEffect(() => {
    if (registerPassword) {
      checkPasswordStrength(registerPassword);
    }
  }, [registerPassword]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterError("");
    
    // التحقق من الموافقة على الشروط والأحكام
    if (!agreedToTerms) {
      setRegisterError("يجب الموافقة على الشروط والأحكام للمتابعة");
      setRegisterLoading(false);
      toast({
        title: "خطأ في التسجيل",
        description: "يجب الموافقة على الشروط والأحكام للمتابعة",
        variant: "destructive",
      });
      return;
    }
    
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
    
    // التحقق من قوة كلمة المرور
    if (passwordStrength < 1) {
      setRegisterError("كلمة المرور ضعيفة جدًا. يرجى اختيار كلمة مرور أقوى");
      setRegisterLoading(false);
      toast({
        title: "خطأ في التسجيل",
        description: "كلمة المرور ضعيفة جدًا. يرجى اختيار كلمة مرور أقوى",
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
        firstName: registerFirstName,
        lastName: registerLastName,
        username: registerUsername,
        email: registerEmail,
        phone: registerPhone,
        country: registerCountry,
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
    <div className="min-h-screen flex bg-background text-foreground">
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
                    <div className="relative">
                      <input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 left-0 pl-3 flex items-center text-sm leading-5"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FiEyeOff className="text-gray-500" /> : <FiEye className="text-gray-500" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-600">
                        تذكرني
                      </label>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="font-medium text-primary hover:text-primary/80" onClick={(e) => {
                        e.preventDefault();
                        toast({
                          title: "استعادة كلمة المرور",
                          description: "سيتم إضافة هذه الميزة قريبًا.",
                        });
                      }}>
                        نسيت كلمة المرور؟
                      </a>
                    </div>
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 text-sm text-white bg-red-500 rounded-md shadow">
                    {loginError}
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none"
                    disabled={loginLoading}
                  >
                    {loginLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
                  </button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-background text-muted-foreground">
                        أو تسجيل الدخول عبر
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-input rounded-md shadow-sm bg-background text-sm font-medium text-muted-foreground hover:bg-accent"
                      onClick={() => {
                        toast({
                          title: "تسجيل الدخول بواسطة Google",
                          description: "سيتم إضافة هذه الميزة قريبًا.",
                        });
                      }}
                    >
                      <FaGoogle className="text-lg text-red-500" />
                    </button>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-input rounded-md shadow-sm bg-background text-sm font-medium text-muted-foreground hover:bg-accent"
                      onClick={() => {
                        toast({
                          title: "تسجيل الدخول بواسطة Facebook",
                          description: "سيتم إضافة هذه الميزة قريبًا.",
                        });
                      }}
                    >
                      <FaFacebook className="text-lg text-blue-600" />
                    </button>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-input rounded-md shadow-sm bg-background text-sm font-medium text-muted-foreground hover:bg-accent"
                      onClick={() => {
                        toast({
                          title: "تسجيل الدخول بواسطة Apple",
                          description: "سيتم إضافة هذه الميزة قريبًا.",
                        });
                      }}
                    >
                      <FaApple className="text-lg" />
                    </button>
                  </div>
                </div>
              </form>
            </TabsContent>
            
            {/* نموذج التسجيل */}
            <TabsContent value="register">
              <form className="space-y-8" onSubmit={handleRegister}>
                {/* قسم المعلومات الشخصية */}
                <div className="space-y-5">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="register-first-name" className="block text-sm font-medium mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="register-first-name"
                        name="firstName"
                        type="text"
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        value={registerFirstName}
                        onChange={(e) => setRegisterFirstName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="register-last-name" className="block text-sm font-medium">
                        الاسم الأخير
                      </label>
                      <input
                        id="register-last-name"
                        name="lastName"
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        value={registerLastName}
                        onChange={(e) => setRegisterLastName(e.target.value)}
                      />
                    </div>
                  </div>
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
                  
                  <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                    <h3 className="font-medium text-amber-800 mb-2">خيارات التداول</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center">
                        <input
                          id="trading-enabled"
                          name="tradingEnabled"
                          type="checkbox"
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          defaultChecked={true}
                        />
                        <label htmlFor="trading-enabled" className="mr-2 block text-sm text-gray-700">
                          تمكين التداول في العملات الرقمية
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="buying-enabled"
                          name="buyingEnabled"
                          type="checkbox"
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          defaultChecked={true}
                        />
                        <label htmlFor="buying-enabled" className="mr-2 block text-sm text-gray-700">
                          تمكين شراء العملات الرقمية
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="selling-enabled"
                          name="sellingEnabled"
                          type="checkbox"
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          defaultChecked={true}
                        />
                        <label htmlFor="selling-enabled" className="mr-2 block text-sm text-gray-700">
                          تمكين بيع العملات الرقمية
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="register-phone" className="block text-sm font-medium">
                        رقم الهاتف
                      </label>
                      <input
                        id="register-phone"
                        name="phone"
                        type="tel"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        placeholder="مثال: +222XXXXXXXX"
                      />
                    </div>
                    <div>
                      <label htmlFor="register-country" className="block text-sm font-medium">
                        الدولة
                      </label>
                      <select
                        id="register-country"
                        name="country"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        value={registerCountry}
                        onChange={(e) => setRegisterCountry(e.target.value)}
                      >
                        <option value="" disabled>اختر الدولة</option>
                        <option value="mauritania">موريتانيا</option>
                        <option value="morocco">المغرب</option>
                        <option value="algeria">الجزائر</option>
                        <option value="tunisia">تونس</option>
                        <option value="libya">ليبيا</option>
                        <option value="egypt">مصر</option>
                        <option value="saudi_arabia">السعودية</option>
                        <option value="uae">الإمارات</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="register-password" className="block text-sm font-medium">
                      كلمة المرور
                    </label>
                    <div className="relative">
                      <input
                        id="register-password"
                        name="password"
                        type={showRegisterPassword ? "text" : "password"}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 left-0 pl-3 flex items-center text-sm leading-5"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      >
                        {showRegisterPassword ? <FiEyeOff className="text-gray-500" /> : <FiEye className="text-gray-500" />}
                      </button>
                    </div>
                    
                    {/* مؤشر قوة كلمة المرور */}
                    {registerPassword && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-500">قوة كلمة المرور:</span>
                          <span className="text-xs font-medium">
                            {passwordStrength === 0 && <span className="text-red-500">ضعيفة جدًا</span>}
                            {passwordStrength === 1 && <span className="text-orange-500">ضعيفة</span>}
                            {passwordStrength === 2 && <span className="text-yellow-500">متوسطة</span>}
                            {passwordStrength === 3 && <span className="text-green-500">قوية</span>}
                          </span>
                        </div>
                        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              passwordStrength === 0 ? 'bg-red-500 w-1/4' : 
                              passwordStrength === 1 ? 'bg-orange-500 w-2/4' : 
                              passwordStrength === 2 ? 'bg-yellow-500 w-3/4' : 
                              'bg-green-500 w-full'
                            }`}
                          ></div>
                        </div>
                        <ul className="mt-1 text-xs text-gray-500 grid grid-cols-2 gap-1">
                          <li className={`flex items-center ${registerPassword.length >= 8 ? 'text-green-500' : ''}`}>
                            <span className="inline-block ml-1 mr-1">
                              {registerPassword.length >= 8 ? <FiCheck /> : <FiX />}
                            </span>
                            8 أحرف على الأقل
                          </li>
                          <li className={`flex items-center ${/\d/.test(registerPassword) ? 'text-green-500' : ''}`}>
                            <span className="inline-block ml-1 mr-1">
                              {/\d/.test(registerPassword) ? <FiCheck /> : <FiX />}
                            </span>
                            تحتوي على أرقام
                          </li>
                          <li className={`flex items-center ${/[a-z]/.test(registerPassword) && /[A-Z]/.test(registerPassword) ? 'text-green-500' : ''}`}>
                            <span className="inline-block ml-1 mr-1">
                              {/[a-z]/.test(registerPassword) && /[A-Z]/.test(registerPassword) ? <FiCheck /> : <FiX />}
                            </span>
                            أحرف كبيرة وصغيرة
                          </li>
                          <li className={`flex items-center ${/[!@#$%^&*(),.?":{}|<>]/.test(registerPassword) ? 'text-green-500' : ''}`}>
                            <span className="inline-block ml-1 mr-1">
                              {/[!@#$%^&*(),.?":{}|<>]/.test(registerPassword) ? <FiCheck /> : <FiX />}
                            </span>
                            رموز خاصة
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="register-confirm-password" className="block text-sm font-medium">
                      تأكيد كلمة المرور
                    </label>
                    <div className="relative">
                      <input
                        id="register-confirm-password"
                        name="confirm-password"
                        type={showRegisterConfirmPassword ? "text" : "password"}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 left-0 pl-3 flex items-center text-sm leading-5"
                        onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                      >
                        {showRegisterConfirmPassword ? <FiEyeOff className="text-gray-500" /> : <FiEye className="text-gray-500" />}
                      </button>
                    </div>
                    
                    {/* التحقق من تطابق كلمة المرور */}
                    {registerPassword && registerConfirmPassword && (
                      <div className={`mt-1 text-xs ${registerPassword === registerConfirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                        {registerPassword === registerConfirmPassword ? (
                          <span className="flex items-center">
                            <FiCheck className="mr-1" />
                            كلمات المرور متطابقة
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <FiX className="mr-1" />
                            كلمات المرور غير متطابقة
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* خانة الموافقة على الشروط والأحكام */}
                  <div className="flex items-start mt-4">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <label htmlFor="terms" className="mr-2 block text-sm text-gray-600">
                      أوافق على <a href="#" className="text-primary hover:text-primary/80">شروط الاستخدام</a> و <a href="#" className="text-primary hover:text-primary/80">سياسة الخصوصية</a>
                    </label>
                  </div>
                </div>

                {registerError && (
                  <div className="p-3 text-sm text-white bg-red-500 rounded-md shadow">
                    {registerError}
                  </div>
                )}

                <div className="space-y-3">
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