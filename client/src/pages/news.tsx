import { MainLayout } from "@/components/layout/main-layout";
import { NewsCard, type NewsItem } from "@/components/news/news-card";
import { FeaturedNews } from "@/components/news/featured-news";
import { NewsCategories, type NewsCategory } from "@/components/news/news-categories";
import { NewsSidebar } from "@/components/news/news-sidebar";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// بيانات وهمية للأخبار - في التطبيق الحقيقي ستأتي من واجهة برمجية
const mockNewsData: NewsItem[] = [
  {
    id: "1",
    title: "عملة RIM ترتفع بنسبة 15% بعد إعلان شراكة استراتيجية مع مؤسسات مالية كبرى",
    summary: "في خطوة هامة نحو التوسع العالمي، أعلنت شركة RIM Labs عن شراكة استراتيجية مع مجموعة من المؤسسات المالية الكبرى، مما أدى إلى ارتفاع سعر العملة بنسبة 15% في غضون ساعات.",
    content: "",
    source: "كريبتو نيوز",
    sourceIcon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    publishedAt: "2025-05-16T08:30:00Z",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1621761191314-39dd4a4f08bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    category: "rimtoken",
  },
  {
    id: "2",
    title: "البنوك المركزية تدرس إصدار عملات رقمية وتأثيرها على سوق العملات المشفرة",
    summary: "بدأت البنوك المركزية في مختلف أنحاء العالم دراسة جدية لإصدار عملات رقمية خاصة بها، مما قد يؤثر بشكل كبير على مستقبل العملات المشفرة والتمويل اللامركزي.",
    content: "",
    source: "رويترز",
    sourceIcon: "https://www.reuters.com/favicon.ico",
    publishedAt: "2025-05-16T14:45:00Z",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    category: "regulation",
  },
  {
    id: "3",
    title: "تقنية Blockchain تدخل قطاع الرعاية الصحية: شراكة بين مستشفيات كبرى وشركات التكنولوجيا",
    summary: "في تطور لافت، بدأت المستشفيات الكبرى في تبني تقنية البلوكتشين لتحسين إدارة السجلات الطبية والمعلومات الصحية للمرضى بطريقة آمنة ولامركزية.",
    content: "",
    source: "تك كرانش",
    sourceIcon: "https://techcrunch.com/favicon.ico",
    publishedAt: "2025-05-15T18:20:00Z",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1624953587687-daf255b6b80a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    category: "adoption",
  },
  {
    id: "4",
    title: "تحليل: كيف ستؤثر التطورات الجديدة في شبكة Ethereum على أسعار العملات المشفرة؟",
    summary: "مع اقتراب الترقية القادمة لشبكة Ethereum، يتساءل المحللون عن تأثيرها المحتمل على أسعار العملات المشفرة والمشاريع التي تعتمد على هذه البنية التحتية.",
    content: "",
    source: "كوين ديسك",
    sourceIcon: "https://www.coindesk.com/favicon.ico",
    publishedAt: "2025-05-15T09:10:00Z",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    category: "market",
  },
  {
    id: "5",
    title: "مبادرات جديدة من RIM Labs لتعزيز المشاريع اللامركزية في المنطقة العربية",
    summary: "أعلنت RIM Labs عن مبادرات جديدة لدعم المطورين والشركات الناشئة في المنطقة العربية لبناء مشاريع لامركزية باستخدام بروتوكول RIM.",
    content: "",
    source: "محفظة RimToken",
    sourceIcon: "/logo.png",
    publishedAt: "2025-05-14T15:30:00Z",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1551135049-8a33b5883817?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    category: "rimtoken",
  },
  {
    id: "6",
    title: "مؤتمر RIM العالمي 2025: إعلان عن ميزات جديدة وتطويرات للمنصة",
    summary: "انطلقت فعاليات مؤتمر RIM العالمي 2025 بحضور آلاف المطورين والمستثمرين، حيث تم الإعلان عن تحديثات هامة وميزات جديدة لمنصة RIM.",
    content: "",
    source: "مجلة كريبتو",
    sourceIcon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    publishedAt: "2025-05-14T11:00:00Z",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1591994843349-f415893b3a6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    category: "rimtoken",
  },
  {
    id: "7",
    title: "علماء يطورون خوارزميات تشفير جديدة لمواجهة تهديدات الحوسبة الكمومية",
    summary: "في تطور علمي مهم، أعلن فريق من الباحثين عن تطوير خوارزميات تشفير جديدة قادرة على مقاومة هجمات الحواسيب الكمومية التي قد تهدد أمان العملات المشفرة مستقبلاً.",
    content: "",
    source: "بي بي سي",
    sourceIcon: "https://www.bbc.com/favicon.ico",
    publishedAt: "2025-05-13T19:45:00Z",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1561451214-33b2be359fea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    category: "technology",
  },
  {
    id: "8",
    title: "تقرير: العملات المشفرة تصبح جزءاً أساسياً من المحافظ الاستثمارية التقليدية",
    summary: "كشف تقرير حديث أن المزيد من المستثمرين التقليديين والمؤسسات المالية الكبرى بدأوا في تخصيص جزء من محافظهم الاستثمارية للعملات المشفرة كفئة أصول مستقلة.",
    content: "",
    source: "بلومبرغ",
    sourceIcon: "https://www.bloomberg.com/favicon.ico",
    publishedAt: "2025-05-13T08:30:00Z",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    category: "adoption",
  },
  {
    id: "9",
    title: "مقال رأي: مستقبل التمويل اللامركزي في ظل التحديات التنظيمية المتزايدة",
    summary: "يناقش هذا المقال التحديات التي تواجه قطاع التمويل اللامركزي في ظل الضغوط التنظيمية المتزايدة، وكيف يمكن للابتكار التكنولوجي أن يتعايش مع الأطر القانونية.",
    content: "",
    source: "فوربس",
    sourceIcon: "https://www.forbes.com/favicon.ico",
    publishedAt: "2025-05-12T16:20:00Z",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1605792657660-596af9009e82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    category: "opinion",
  },
  {
    id: "10",
    title: "سوق العملات المشفرة يشهد تدفقات استثمارية قياسية في الربع الثاني من 2025",
    summary: "سجلت سوق العملات المشفرة تدفقات استثمارية قياسية خلال الربع الثاني من عام 2025، مدفوعة بتبني المؤسسات والتطورات التكنولوجية الإيجابية.",
    content: "",
    source: "وول ستريت جورنال",
    sourceIcon: "https://www.wsj.com/favicon.ico",
    publishedAt: "2025-05-12T10:15:00Z",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1629339942248-45d4b10feaae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    category: "market",
  },
];

// معلومات الأخبار العاجلة
const breakingNews: NewsItem[] = [
  {
    id: "breaking1",
    title: "تحديث عاجل: مؤسس RIM Labs يعلن عن ميزات أمان جديدة للمحفظة في مؤتمر صحفي",
    summary: "",
    content: "",
    source: "عاجل",
    sourceIcon: "/logo.png",
    publishedAt: new Date().toISOString(),
    url: "#",
    category: "rimtoken",
  },
  {
    id: "breaking2",
    title: "انقطاع مفاجئ في شبكة Ethereum يؤثر على معاملات العملات المشفرة لمدة 10 دقائق",
    summary: "",
    content: "",
    source: "عاجل",
    sourceIcon: "/logo.png",
    publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 دقيقة مضت
    url: "#",
    category: "market",
  },
  {
    id: "breaking3",
    title: "هيئة تنظيمية عالمية تصدر إرشادات جديدة للتعامل مع العملات المشفرة",
    summary: "",
    content: "",
    source: "عاجل",
    sourceIcon: "/logo.png",
    publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 دقيقة مضت
    url: "#",
    category: "regulation",
  },
  {
    id: "breaking4",
    title: "حركة تداول ضخمة: نقل أكثر من 10,000 BTC بين محافظ مجهولة",
    summary: "",
    content: "",
    source: "عاجل",
    sourceIcon: "/logo.png",
    publishedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // ساعة مضت
    url: "#",
    category: "market",
  },
];

// الأخبار الأكثر قراءة
const popularNews = mockNewsData.slice(3, 8);

export default function NewsPage() {
  const [category, setCategory] = useState<NewsCategory>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [featuredNews, setFeaturedNews] = useState<NewsItem>(mockNewsData[0]);
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>(mockNewsData);

  useEffect(() => {
    if (category === "all") {
      setFilteredNews(mockNewsData);
    } else {
      setFilteredNews(mockNewsData.filter(item => item.category === category));
    }
  }, [category]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">أخبار العملات المشفرة</h1>
          <p className="text-gray-600">آخر الأخبار والتحليلات في عالم العملات المشفرة والتكنولوجيا المالية</p>
        </div>

        <div className="mb-8">
          <FeaturedNews item={featuredNews} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="mb-6">
              <NewsCategories activeCategory={category} onCategoryChange={setCategory} />
            </div>

            <div className="mb-8">
              <Tabs defaultValue="grid" className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {category === "all" ? "جميع الأخبار" : 
                     category === "market" ? "أخبار السوق" :
                     category === "technology" ? "أخبار التكنولوجيا" :
                     category === "regulation" ? "أخبار التشريعات" :
                     category === "adoption" ? "أخبار التبني" :
                     category === "opinion" ? "مقالات الرأي" :
                     "أخبار RimToken"}
                  </h2>
                  <TabsList>
                    <TabsTrigger 
                      value="grid" 
                      onClick={() => setViewMode("grid")}
                      className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800"
                    >
                      شبكة
                    </TabsTrigger>
                    <TabsTrigger 
                      value="list" 
                      onClick={() => setViewMode("list")}
                      className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800"
                    >
                      قائمة
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="grid" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNews.map((item) => (
                      <NewsCard key={item.id} item={item} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="list" className="mt-0">
                  <div className="space-y-4">
                    {filteredNews.map((item) => (
                      <NewsCard key={item.id} item={item} variant="compact" />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="lg:col-span-1">
            <NewsSidebar 
              breakingNews={breakingNews}
              popularNews={popularNews}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}