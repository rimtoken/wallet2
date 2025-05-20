import { useState } from "react";
import { Newspaper, Calendar, User, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import rimLogo from "@assets/rim.png";

export default function NewsPage() {
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // بيانات الأخبار (يمكن استبدالها ببيانات حقيقية من API)
  const newsArticles = [
    {
      id: 1,
      title: "ريم توكن تطلق منصة تبادل جديدة بميزات متقدمة",
      excerpt: "أعلنت شركة ريم توكن عن إطلاق منصة تبادل العملات الرقمية الجديدة بميزات متقدمة تلبي احتياجات المستخدمين المتنامية.",
      content: "نص كامل للخبر...",
      category: "تطويرات",
      date: "2025-05-18",
      author: "فريق ريم توكن",
      image: "https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&q=80&w=1000"
    },
    {
      id: 2,
      title: "ارتفاع قيمة RimToken بنسبة 15% خلال الأسبوع الماضي",
      excerpt: "شهدت عملة RimToken ارتفاعًا ملحوظًا في قيمتها بنسبة 15% خلال الأسبوع الماضي، ما يعكس ثقة المستثمرين في المشروع.",
      content: "نص كامل للخبر...",
      category: "سوق",
      date: "2025-05-15",
      author: "قسم التحليل المالي",
      image: "https://images.unsplash.com/photo-1616077167599-cad3898e2815?auto=format&q=80&w=1000"
    },
    {
      id: 3,
      title: "شراكة استراتيجية جديدة بين RimToken ومنصة دفع عالمية",
      excerpt: "وقعت ريم توكن اتفاقية شراكة استراتيجية مع إحدى أكبر منصات الدفع العالمية لتسهيل استخدام العملات الرقمية في المعاملات اليومية.",
      content: "نص كامل للخبر...",
      category: "شراكات",
      date: "2025-05-12",
      author: "إدارة التسويق",
      image: "https://images.unsplash.com/photo-1520695287272-b7f67bacb09f?auto=format&q=80&w=1000"
    },
    {
      id: 4,
      title: "ندوة افتراضية: مستقبل العملات الرقمية والبلوكتشين",
      excerpt: "تنظم ريم توكن ندوة افتراضية حول مستقبل العملات الرقمية وتقنية البلوكتشين بمشاركة خبراء عالميين في المجال.",
      content: "نص كامل للخبر...",
      category: "فعاليات",
      date: "2025-05-10",
      author: "فريق الفعاليات",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&q=80&w=1000"
    },
    {
      id: 5,
      title: "تحديث الإصدار 2.5 من تطبيق RimToken للهواتف الذكية",
      excerpt: "أطلقت ريم توكن تحديثًا جديدًا لتطبيقها على الهواتف الذكية يتضمن واجهة مستخدم محسنة وميزات أمان إضافية.",
      content: "نص كامل للخبر...",
      category: "تطويرات",
      date: "2025-05-08",
      author: "فريق تطوير التطبيقات",
      image: "https://images.unsplash.com/photo-1571867424514-57267fd71305?auto=format&q=80&w=1000"
    },
    {
      id: 6,
      title: "توقعات خبراء: RimToken ضمن أفضل 10 عملات رقمية في 2026",
      excerpt: "توقع خبراء في مجال العملات الرقمية أن تكون عملة RimToken ضمن أفضل 10 عملات رقمية بحلول عام 2026.",
      content: "نص كامل للخبر...",
      category: "تحليلات",
      date: "2025-05-05",
      author: "قسم الأبحاث",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&q=80&w=1000"
    }
  ];
  
  // تصفية الأخبار حسب الفئة والبحث
  const filteredNews = newsArticles.filter(article => {
    const matchesCategory = category === "all" || article.category === category;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // الحصول على جميع الفئات الفريدة
  const categories = ["all", ...new Set(newsArticles.map(article => article.category))];
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold flex items-center justify-center">
          <img src={rimLogo} alt="RimToken Logo" className="w-8 h-8 mr-2 rounded-full object-cover" />
          أخبار RimToken
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          تابع آخر الأخبار والمستجدات حول منصة RimToken والعملات الرقمية
        </p>
      </div>
      
      {/* أدوات البحث والتصفية */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="جميع الفئات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفئات</SelectItem>
              {categories.filter(cat => cat !== "all").map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-2/3 flex">
          <Input
            placeholder="ابحث في الأخبار..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button variant="ghost" className="ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Button>
        </div>
      </div>
      
      {/* عرض الأخبار */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNews.map((article) => (
          <div key={article.id} className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs bg-amber-100 text-amber-800 py-1 px-2 rounded">
                  {article.category}
                </span>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-3 h-3 ml-1" />
                  {article.date}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="w-3 h-3 ml-1" />
                  {article.author}
                </div>
                <a href={`/news/${article.id}`} className="text-amber-600 hover:text-amber-700 font-medium flex items-center">
                  اقرأ المزيد
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* رسالة عند عدم وجود نتائج */}
      {filteredNews.length === 0 && (
        <div className="text-center py-12">
          <Newspaper className="w-16 h-16 mx-auto text-gray-300" />
          <h3 className="mt-4 text-xl font-semibold">لم يتم العثور على أخبار</h3>
          <p className="mt-2 text-gray-500">جرب تغيير معايير البحث أو التصفية</p>
        </div>
      )}
      
      {/* اشتراك في النشرة الإخبارية */}
      <div className="mt-16 bg-amber-50 p-8 rounded-xl">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">اشترك في نشرة RimToken الإخبارية</h2>
          <p className="text-gray-600 mb-6">
            احصل على آخر الأخبار والتحديثات من عالم RimToken والعملات الرقمية مباشرة إلى بريدك الإلكتروني
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="أدخل بريدك الإلكتروني"
              className="flex-1"
            />
            <Button className="bg-amber-500 hover:bg-amber-600">
              اشترك الآن
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}