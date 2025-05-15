import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // تعيين عنوان الصفحة
  useEffect(() => {
    document.title = 'تسجيل الدخول - RimToken';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // في الواقع سنرسل البيانات للخادم، لكن هنا سنكتفي بإعادة التوجيه
      setTimeout(() => {
        setLocation("/");
      }, 1000);
    } catch (err) {
      setError("فشل تسجيل الدخول. الرجاء التحقق من بيانات الاعتماد الخاصة بك.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* نموذج تسجيل الدخول */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary">RimToken</h1>
            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              مرحبًا بعودتك
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              تسجيل الدخول إلى حسابك لإدارة محفظتك الرقمية
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="username" className="block text-sm font-medium">
                  اسم المستخدم
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  كلمة المرور
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm text-white bg-red-500 rounded-md shadow">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none"
                disabled={isLoading}
              >
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </button>
            </div>
          </form>
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