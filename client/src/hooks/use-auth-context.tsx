import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

// تعريف نوع المستخدم
interface User {
  id: number;
  username: string;
  email: string;
}

// تعريف سياق المصادقة
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// إنشاء سياق المصادقة
const AuthContext = createContext<AuthContextType | null>(null);

// مزود سياق المصادقة
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // استعادة بيانات المستخدم من التخزين المحلي عند بدء التطبيق
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("خطأ في تحليل بيانات المستخدم المخزنة:", error);
      }
    }
    setIsLoading(false);
  }, []);

  // تسجيل الدخول
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      // في النسخة التجريبية: تحقق من بيانات الاعتماد الثابتة
      if (username === "demo_user" && password === "password123") {
        const userData: User = {
          id: 1,
          username: "demo_user",
          email: "demo@example.com"
        };
        
        // تخزين بيانات المستخدم
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بعودتك، " + userData.username,
        });
        
        setLocation("/");
      } else {
        // التحقق من المستخدمين المسجلين في localStorage
        const registeredUsers = localStorage.getItem("registeredUsers") 
          ? JSON.parse(localStorage.getItem("registeredUsers") || "[]") as User[]
          : [];
          
        const foundUser = registeredUsers.find(u => u.username === username);
        
        if (foundUser) {
          // في الواقع سنتحقق من كلمة المرور المشفرة، لكن هذا فقط للعرض
          localStorage.setItem("user", JSON.stringify(foundUser));
          setUser(foundUser);
          
          toast({
            title: "تم تسجيل الدخول بنجاح",
            description: "مرحباً بعودتك، " + foundUser.username,
          });
          
          setLocation("/");
        } else {
          throw new Error("اسم المستخدم أو كلمة المرور غير صحيحة");
        }
      }
    } catch (error: any) {
      toast({
        title: "فشل تسجيل الدخول",
        description: error.message || "حدث خطأ أثناء محاولة تسجيل الدخول",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // تسجيل مستخدم جديد
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // التحقق من وجود المستخدم مسبقاً
      const registeredUsers = localStorage.getItem("registeredUsers") 
        ? JSON.parse(localStorage.getItem("registeredUsers") || "[]") as User[]
        : [];
        
      if (registeredUsers.some(u => u.username === username)) {
        throw new Error("اسم المستخدم مستخدم بالفعل");
      }
      
      // إنشاء مستخدم جديد
      const newUser: User = {
        id: Date.now(), // رقم عشوائي للمحاكاة
        username,
        email
      };
      
      // تخزين المستخدم
      registeredUsers.push(newUser);
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
      
      // تسجيل الدخول تلقائياً
      localStorage.setItem("user", JSON.stringify(newUser));
      setUser(newUser);
      
      toast({
        title: "تم التسجيل بنجاح",
        description: "مرحباً بك في RimToken، " + newUser.username,
      });
      
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "فشل التسجيل",
        description: error.message || "حدث خطأ أثناء محاولة التسجيل",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // تسجيل الخروج
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    
    toast({
      title: "تم تسجيل الخروج",
      description: "نراك قريباً!",
    });
    
    setLocation("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// هوك استخدام سياق المصادقة
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("يجب استخدام useAuth داخل AuthProvider");
  }
  
  return context;
}