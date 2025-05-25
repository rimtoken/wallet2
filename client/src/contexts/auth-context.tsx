import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "./language-context";

// تعريف نوع بيانات المستخدم
export type User = {
  id: number;
  username: string;
  email: string;
  createdAt?: string;
};

// تعريف نوع بيانات تسجيل الدخول
type LoginData = {
  username: string;
  password: string;
};

// تعريف نوع بيانات إنشاء حساب
type RegisterData = {
  username: string;
  email: string;
  password: string;
};

// تعريف نوع بيانات سياق المصادقة
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: ReturnType<typeof useLoginMutation>;
  logoutMutation: ReturnType<typeof useLogoutMutation>;
  registerMutation: ReturnType<typeof useRegisterMutation>;
};

// إنشاء سياق المصادقة
export const AuthContext = createContext<AuthContextType | null>(null);

// Hook لاستخدام تسجيل الدخول
function useLoginMutation() {
  const { toast } = useToast();
  const { getText } = useLanguage();

  return useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || getText("loginFailed"));
      }
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.success && data.user) {
        queryClient.setQueryData(["/api/user"], data.user);
        toast({
          title: getText("welcome"),
          description: getText("loginSuccessful"),
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: getText("loginFailed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Hook لاستخدام تسجيل الخروج
function useLogoutMutation() {
  const { toast } = useToast();
  const { getText } = useLanguage();

  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/logout");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || getText("logoutFailed"));
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: getText("logoutSuccessful"),
        description: getText("seeSoonMessage"),
      });
    },
    onError: (error: Error) => {
      toast({
        title: getText("logoutFailed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// Hook لاستخدام إنشاء حساب
function useRegisterMutation() {
  const { toast } = useToast();
  const { getText } = useLanguage();

  return useMutation({
    mutationFn: async (userData: RegisterData) => {
      const res = await apiRequest("POST", "/api/register", userData);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || getText("registrationFailed"));
      }
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.success && data.user) {
        queryClient.setQueryData(["/api/user"], data.user);
        toast({
          title: getText("welcome"),
          description: getText("registrationSuccessful"),
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: getText("registrationFailed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// مزود سياق المصادقة
export function AuthProvider({ children }: { children: ReactNode }) {
  const { getText } = useLanguage();

  // استعلام لجلب بيانات المستخدم الحالي
  const {
    data: user,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["/api/user"],
    queryFn: async () => {
      const res = await fetch("/api/user");
      if (!res.ok) {
        if (res.status === 401) {
          // غير مسجل الدخول - وهذا ليس خطأ
          return null;
        }
        throw new Error(getText("failedToFetchUser"));
      }
      const data = await res.json();
      return data.success ? data.user : null;
    },
    retry: false,
  });

  // Mutations
  const loginMutation = useLoginMutation();
  const logoutMutation = useLogoutMutation();
  const registerMutation = useRegisterMutation();

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook لاستخدام سياق المصادقة
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}