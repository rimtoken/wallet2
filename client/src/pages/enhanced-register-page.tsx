import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { FiEye, FiEyeOff, FiCheck, FiX, FiRefreshCw } from "react-icons/fi";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/language-context";

export default function EnhancedRegisterPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { translate } = useLanguage();
  
  // تحقق مما إذا كان المستخدم مسجل الدخول بالفعل (باستخدام localStorage)
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setLocation("/");
    }
  }, [setLocation]);
  
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
    document.title = 'التسجيل في RimToken - منصة العملات الرقمية';
  }, []);

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
        phone: `${registerPhoneCountry} ${registerPhone}`,
        country: registerCountry,
        city: registerCity,
        state: registerState,
        postcode: registerPostcode,
        address: registerStreetAddress,
        address2: registerStreetAddress2,
        companyName: registerCompanyName,
        currency: registerCurrency,
        receiveEmails: receiveEmails,
        createdAt: new Date().toISOString(),
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
    <div className="min-h-screen flex flex-col py-10 px-4 md:px-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Create a New Account
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join RimToken to manage your cryptocurrency assets, make secure transactions, and participate in the digital currency marketplace.
        </p>
      </div>
      
      <div className="max-w-5xl mx-auto w-full bg-white shadow-xl rounded-xl p-6 md:p-10">
        <form className="space-y-10" onSubmit={handleRegister}>
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
                <label htmlFor="register-last-name" className="block text-sm font-medium mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="register-last-name"
                  name="lastName"
                  type="text"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  value={registerLastName}
                  onChange={(e) => setRegisterLastName(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="register-email" className="block text-sm font-medium mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="register-phone" className="block text-sm font-medium mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <div className="relative w-24">
                    <Select
                      value={registerPhoneCountry}
                      onValueChange={setRegisterPhoneCountry}
                    >
                      <SelectTrigger className="border border-gray-300 rounded-l-md border-r-0 focus:ring-primary focus:border-primary">
                        <SelectValue placeholder="+222" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+222">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-4 bg-green-600 flex items-center justify-center rounded-sm">
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                            +222
                          </div>
                        </SelectItem>
                        <SelectItem value="+218">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-4 bg-red-500 flex items-center justify-center rounded-sm">
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                            +218
                          </div>
                        </SelectItem>
                        <SelectItem value="+971">+971</SelectItem>
                        <SelectItem value="+20">+20</SelectItem>
                        <SelectItem value="+966">+966</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <input
                    id="register-phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="22 12 34 56"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:ring-primary focus:border-primary"
                    value={registerPhone}
                    onChange={(e) => setRegisterPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* قسم عنوان الفواتير */}
          <div className="space-y-5">
            <h3 className="text-lg font-medium">Billing Address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="register-company" className="block text-sm font-medium mb-1">
                  Company Name
                </label>
                <input
                  id="register-company"
                  name="company"
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  value={registerCompanyName}
                  onChange={(e) => setRegisterCompanyName(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="register-street-address" className="block text-sm font-medium mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="register-street-address"
                  name="streetAddress"
                  type="text"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  value={registerStreetAddress}
                  onChange={(e) => setRegisterStreetAddress(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="register-street-address-2" className="block text-sm font-medium mb-1">
                  Street Address 2 (Optional)
                </label>
                <input
                  id="register-street-address-2"
                  name="streetAddress2"
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  value={registerStreetAddress2}
                  onChange={(e) => setRegisterStreetAddress2(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="register-city" className="block text-sm font-medium mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  id="register-city"
                  name="city"
                  type="text"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  value={registerCity}
                  onChange={(e) => setRegisterCity(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label htmlFor="register-country" className="block text-sm font-medium mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <Select
                  value={registerCountry}
                  onValueChange={setRegisterCountry}
                >
                  <SelectTrigger className="w-full border border-gray-300 focus:ring-primary focus:border-primary">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Libya">Libya</SelectItem>
                    <SelectItem value="Egypt">Egypt</SelectItem>
                    <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                    <SelectItem value="UAE">United Arab Emirates</SelectItem>
                    <SelectItem value="Tunisia">Tunisia</SelectItem>
                    <SelectItem value="Morocco">Morocco</SelectItem>
                    <SelectItem value="Algeria">Algeria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="register-state" className="block text-sm font-medium mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  id="register-state"
                  name="state"
                  type="text"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  value={registerState}
                  onChange={(e) => setRegisterState(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="register-postcode" className="block text-sm font-medium mb-1">
                  Postcode <span className="text-red-500">*</span>
                </label>
                <input
                  id="register-postcode"
                  name="postcode"
                  type="text"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  value={registerPostcode}
                  onChange={(e) => setRegisterPostcode(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* قسم معلومات إضافية */}
          <div className="space-y-5">
            <h3 className="text-lg font-medium">Additional Information</h3>
            
            <div>
              <label htmlFor="register-currency" className="block text-sm font-medium mb-1">
                Choose Currency <span className="text-red-500">*</span>
              </label>
              <Select
                value={registerCurrency}
                onValueChange={setRegisterCurrency}
              >
                <SelectTrigger className="w-full border border-gray-300 focus:ring-primary focus:border-primary">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LYD">LYD</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="SAR">SAR</SelectItem>
                  <SelectItem value="AED">AED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* قسم أمان الحساب */}
          <div className="space-y-5">
            <h3 className="text-lg font-medium">Account Security</h3>
            
            <div>
              <label htmlFor="register-username" className="block text-sm font-medium mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="register-username"
                name="username"
                type="text"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <div className="flex justify-between mb-1">
                  <label htmlFor="register-password" className="block text-sm font-medium">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-gray-500">at least 5 characters</span>
                </div>
                <div className="relative">
                  <input
                    id="register-password"
                    name="password"
                    type={showRegisterPassword ? "text" : "password"}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary pr-10"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  >
                    {showRegisterPassword ? (
                      <FiEyeOff className="text-gray-500 h-4 w-4" />
                    ) : (
                      <FiEye className="text-gray-500 h-4 w-4" />
                    )}
                  </button>
                </div>
                
                {/* مؤشر قوة كلمة المرور */}
                <div className="mt-2">
                  <div className="h-1 flex rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        passwordStrength >= 1 ? "bg-red-500" : "bg-gray-200"
                      }`}
                      style={{ width: "25%" }}
                    ></div>
                    <div
                      className={`h-full ${
                        passwordStrength >= 2 ? "bg-yellow-500" : "bg-gray-200"
                      }`}
                      style={{ width: "25%" }}
                    ></div>
                    <div
                      className={`h-full ${
                        passwordStrength >= 3 ? "bg-green-500" : "bg-gray-200"
                      }`}
                      style={{ width: "50%" }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="register-confirm-password" className="block text-sm font-medium mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="register-confirm-password"
                    name="confirmPassword"
                    type={showRegisterConfirmPassword ? "text" : "password"}
                    required
                    className={`block w-full px-3 py-2 border ${
                      registerPassword === registerConfirmPassword
                        ? registerConfirmPassword
                          ? "border-green-500"
                          : "border-gray-300"
                        : "border-red-500"
                    } rounded-md shadow-sm focus:ring-primary focus:border-primary pr-10`}
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                  />
                  
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)}
                  >
                    {showRegisterConfirmPassword ? (
                      <FiEyeOff className="text-gray-500 h-4 w-4" />
                    ) : (
                      <FiEye className="text-gray-500 h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <Button
                type="button"
                variant="outline"
                className="inline-flex items-center px-4 py-2 text-sm"
                onClick={() => {
                  // توليد كلمة مرور عشوائية آمنة
                  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
                  let password = "";
                  for (let i = 0; i < 12; i++) {
                    password += chars.charAt(Math.floor(Math.random() * chars.length));
                  }
                  setRegisterPassword(password);
                  setRegisterConfirmPassword(password);
                }}
              >
                <FiRefreshCw className="mr-2 h-4 w-4" />
                Generate Password
              </Button>
            </div>
          </div>
          
          {/* قسم القائمة البريدية */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Join our mailing list</h3>
            
            <div className="text-sm text-gray-700">
              We would like to send you occasional news, information and special offers by email. To join 
              our mailing list, simply toggle the switch below. You can unsubscribe at any time.
            </div>
            
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <Label htmlFor="receive-emails">Receive Emails:</Label>
                <Switch
                  id="receive-emails"
                  checked={receiveEmails}
                  onCheckedChange={setReceiveEmails}
                />
              </div>
            </div>
          </div>
          
          {/* الشروط والأحكام */}
          <div className="space-y-5">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)} 
              />
              <label 
                htmlFor="terms" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I have read and agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> <span className="text-red-500">*</span>
              </label>
            </div>
            
            <div className="text-xs text-gray-500">
              (required fields are marked with *)
            </div>
          </div>
          
          {registerError && (
            <div className="p-3 text-sm text-white bg-red-500 rounded-md shadow">
              {registerError}
            </div>
          )}
          
          <div className="space-y-5 pt-5">
            <Button
              type="submit"
              className="w-full py-6 text-base"
              disabled={registerLoading}
            >
              {registerLoading ? "Processing..." : "Register"}
            </Button>
            
            <p className="text-center text-sm">
              Already have an account? <a href="/auth?tab=login" className="text-primary hover:underline">Login</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}