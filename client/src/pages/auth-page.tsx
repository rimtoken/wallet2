import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { useLanguage } from "@/contexts/language-context";

// مخطط التحقق من صحة تسجيل الدخول
const loginSchema = z.object({
  username: z.string().min(3, "اسم المستخدم يجب أن يحتوي على 3 أحرف على الأقل"),
  password: z.string().min(6, "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل"),
});

// مخطط التحقق من صحة التسجيل
const registerSchema = z.object({
  username: z.string().min(3, "اسم المستخدم يجب أن يحتوي على 3 أحرف على الأقل"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل"),
  confirmPassword: z.string().min(6, "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user, isLoading, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const { getText, language } = useLanguage();
  
  // إعادة توجيه المستخدم المسجل إلى الصفحة الرئيسية
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  // نموذج تسجيل الدخول
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // نموذج التسجيل
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // معالجة تسجيل الدخول
  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  // معالجة التسجيل
  const onRegisterSubmit = (values: RegisterFormValues) => {
    const { confirmPassword, ...userData } = values;
    registerMutation.mutate(userData);
  };

  // إذا كان المستخدم يحمل البيانات أو مسجل الدخول، عرض رسالة التحميل
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="flex flex-col lg:flex-row max-w-6xl w-full gap-8">
        {/* قسم الترحيب */}
        <div className="flex-1 flex flex-col justify-center order-1 lg:order-2">
          <div className="space-y-6 text-center lg:text-start">
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
              {getText("welcomeToRimToken")}
            </h1>
            <p className="text-xl text-muted-foreground">
              {getText("rimTokenDescription")}
            </p>
            <div className="flex flex-col lg:flex-row gap-4 items-center lg:items-start justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z" />
                    <path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z" />
                    <line x1="12" x2="12" y1="22" y2="13" />
                    <path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">{getText("multiChainSupport")}</h3>
                  <p className="text-sm text-muted-foreground">{getText("multiChainSupportDescription")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">{getText("secureStorage")}</h3>
                  <p className="text-sm text-muted-foreground">{getText("secureStorageDescription")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* قسم النماذج */}
        <div className="flex-1 order-2 lg:order-1">
          <Card className="shadow-lg">
            <CardHeader>
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">{getText("login")}</TabsTrigger>
                  <TabsTrigger value="register">{getText("register")}</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <TabsContent value="login" className="mt-0">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{getText("username")}</FormLabel>
                          <FormControl>
                            <Input placeholder={getText("usernamePlaceholder")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{getText("password")}</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder={getText("passwordPlaceholder")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {getText("loggingIn")}
                        </>
                      ) : (
                        getText("login")
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="register" className="mt-0">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{getText("username")}</FormLabel>
                          <FormControl>
                            <Input placeholder={getText("usernamePlaceholder")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{getText("email")}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder={getText("emailPlaceholder")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{getText("password")}</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder={getText("passwordPlaceholder")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{getText("confirmPassword")}</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder={getText("confirmPasswordPlaceholder")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {getText("registering")}
                        </>
                      ) : (
                        getText("register")
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}