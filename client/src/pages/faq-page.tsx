import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppLayout } from "@/components/layout/app-layout";
import { 
  Search,
  HelpCircle,
  BookOpen,
  Video,
  Globe,
  Share2,
  Play,
  ChevronRight,
  Info,
  Download,
  Shield,
  Wallet as WalletIcon,
  CreditCard as CreditCardIcon
} from "lucide-react";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  // مجموعات الأسئلة المختلفة
  const faqCategories = [
    { id: "general", label: "عام", icon: <HelpCircle className="w-4 h-4" /> },
    { id: "account", label: "الحساب", icon: <BookOpen className="w-4 h-4" /> },
    { id: "trading", label: "التداول", icon: <Share2 className="w-4 h-4" /> },
    { id: "wallet", label: "المحفظة", icon: <Shield className="w-4 h-4" /> },
    { id: "videos", label: "فيديوهات تعليمية", icon: <Video className="w-4 h-4" /> },
  ];

  // بيانات الأسئلة والأجوبة
  const faqData = {
    general: [
      {
        question: "ما هو RimToken؟",
        answer: "RimToken هي منصة متكاملة لمحفظة العملات الرقمية تدعم العديد من سلاسل الكتل مثل Ethereum وBinance Smart Chain وSolana. توفر المنصة خدمات أساسية مثل تخزين العملات المشفرة وتبادلها وإدارة المحفظة بواجهة سهلة الاستخدام وميزات أمان متقدمة."
      },
      {
        question: "كم عدد الخدمات التي يقدمها الموقع؟",
        answer: "يقدم موقع RimToken 6 خدمات أساسية:\n1. تخزين العملات المشفرة في محفظة آمنة\n2. تبادل العملات المشفرة (Swap)\n3. إيداع الأموال عبر العملات المشفرة أو البطاقات الائتمانية أو PayPal\n4. سحب الأموال إلى محافظ خارجية أو حسابات بنكية\n5. متابعة أسعار العملات المشفرة وتحليلها\n6. إدارة المحفظة مع تتبع الأداء والإنجازات"
      },
      {
        question: "هل المنصة آمنة؟",
        answer: "نعم، تستخدم منصة RimToken أحدث تقنيات الأمان، بما في ذلك المصادقة الثنائية (2FA)، والتشفير من طرف إلى طرف، وحماية الأموال في محافظ باردة. بالإضافة إلى ذلك، يتم مراجعة الكود بانتظام من قبل خبراء الأمان لضمان سلامة أموالك."
      },
      {
        question: "ما هي العملات المدعومة على المنصة؟",
        answer: "تدعم منصة RimToken العديد من العملات المشفرة، بما في ذلك Bitcoin (BTC)، Ethereum (ETH)، Binance Coin (BNB)، Solana (SOL)، وغيرها من العملات الرئيسية والرموز المبنية على هذه الشبكات."
      },
      {
        question: "هل يمكنني استخدام المنصة من الهاتف المحمول؟",
        answer: "نعم، تم تصميم منصة RimToken بتصميم متجاوب يعمل على جميع الأجهزة، بما في ذلك الهواتف الذكية والأجهزة اللوحية. كما نعمل حاليًا على تطوير تطبيق محمول مخصص لتجربة أفضل على الأجهزة المحمولة."
      }
    ],
    account: [
      {
        question: "كيف يمكنني إنشاء حساب جديد؟",
        answer: "لإنشاء حساب جديد، انتقل إلى صفحة التسجيل وأدخل بريدك الإلكتروني وكلمة مرور قوية واسم المستخدم. بعد ذلك، ستحتاج إلى تأكيد بريدك الإلكتروني والموافقة على شروط الخدمة. ثم يمكنك تفعيل المصادقة الثنائية لتأمين حسابك بشكل أفضل."
      },
      {
        question: "كيف يمكنني تفعيل المصادقة الثنائية (2FA)؟",
        answer: "لتفعيل المصادقة الثنائية، انتقل إلى صفحة الإعدادات > الأمان > المصادقة الثنائية. ثم قم بتنزيل تطبيق المصادقة مثل Google Authenticator أو Authy. بعد ذلك، امسح رمز QR أو أدخل المفتاح السري، وأدخل الرمز الذي يظهر في التطبيق للتحقق من التفعيل."
      },
      {
        question: "نسيت كلمة المرور، كيف يمكنني استعادتها؟",
        answer: "إذا نسيت كلمة المرور، انقر على رابط \"نسيت كلمة المرور؟\" في صفحة تسجيل الدخول. أدخل بريدك الإلكتروني المسجل وستتلقى رسالة تحتوي على رابط لإعادة تعيين كلمة المرور. يرجى التأكد من فحص مجلد البريد غير المرغوب فيه إذا لم تجد الرسالة."
      },
      {
        question: "كيف يمكنني تحديث معلومات حسابي؟",
        answer: "لتحديث معلومات حسابك، انتقل إلى صفحة الملف الشخصي > تحرير الملف الشخصي. هناك يمكنك تغيير اسم المستخدم والصورة الشخصية والبريد الإلكتروني وغيرها من المعلومات الشخصية. بعض التغييرات مثل تغيير البريد الإلكتروني قد تتطلب تأكيداً إضافياً."
      }
    ],
    trading: [
      {
        question: "كيف يمكنني تبديل عملة بأخرى؟",
        answer: "لتبديل عملة بأخرى، انتقل إلى صفحة التبديل (Swap). اختر العملة التي ترغب في استبدالها من القائمة المنسدلة \"من\"، ثم اختر العملة التي ترغب في الحصول عليها من القائمة المنسدلة \"إلى\". أدخل المبلغ وتحقق من سعر الصرف والرسوم. إذا كنت موافقاً على الشروط، انقر على \"تأكيد التبديل\"."
      },
      {
        question: "ما هي الرسوم المطبقة على عمليات التبديل؟",
        answer: "تختلف رسوم التبديل حسب أزواج العملات والشبكات المستخدمة. بشكل عام، تتراوح الرسوم بين 0.1% و0.5% من قيمة المعاملة، بالإضافة إلى رسوم الشبكة التي تختلف حسب ازدحام الشبكة. يمكنك رؤية تفاصيل الرسوم بالكامل قبل تأكيد أي معاملة."
      },
      {
        question: "كم من الوقت تستغرق عملية التبديل؟",
        answer: "معظم عمليات التبديل تتم على الفور، خاصة إذا كانت العملات على نفس الشبكة. ولكن إذا كان التبديل بين عملات على شبكات مختلفة (مثل تبديل BTC بـ ETH)، فقد تستغرق العملية من 5 إلى 30 دقيقة حسب ازدحام الشبكة وسرعة تأكيد المعاملات."
      },
      {
        question: "هل هناك حد أدنى أو أقصى لعمليات التبديل؟",
        answer: "نعم، هناك حد أدنى لعمليات التبديل يختلف حسب العملة، وذلك لضمان أن قيمة المعاملة تغطي رسوم الشبكة. الحد الأقصى يعتمد على السيولة المتوفرة وقد يختلف حسب أزواج العملات. يمكنك دائماً رؤية الحدود المطبقة عند إجراء عملية تبديل."
      }
    ],
    wallet: [
      {
        question: "كيف يمكنني إيداع عملات مشفرة في محفظتي؟",
        answer: "لإيداع عملات مشفرة، انتقل إلى صفحة الإيداع واختر العملة التي ترغب في إيداعها. سيتم عرض عنوان المحفظة الخاص بك لهذه العملة، يمكنك نسخه أو مسح رمز QR لإرسال العملات إليه من أي محفظة خارجية أو منصة تبادل."
      },
      {
        question: "كيف يمكنني سحب عملات مشفرة من محفظتي؟",
        answer: "لسحب عملات مشفرة، انتقل إلى صفحة السحب واختر العملة والمبلغ الذي ترغب في سحبه. أدخل عنوان المحفظة الخارجية الذي ترغب في إرسال العملات إليه. تأكد من صحة العنوان، ثم أدخل رمز المصادقة الثنائية لتأكيد السحب."
      },
      {
        question: "هل يمكنني الحصول على مفاتيح خاصة لمحفظتي؟",
        answer: "نعم، RimToken هي محفظة ذاتية الحفظ، مما يعني أنه يمكنك الوصول إلى المفاتيح الخاصة الخاصة بك. للحصول على المفاتيح الخاصة، انتقل إلى صفحة المحفظة > الإعدادات > المفاتيح الخاصة. ستحتاج إلى إدخال كلمة المرور ورمز المصادقة الثنائية للوصول إلى هذه المعلومات الحساسة."
      },
      {
        question: "ماذا يحدث إذا فقدت جهازي أو لم أتمكن من الوصول إلى حسابي؟",
        answer: "عند إنشاء المحفظة لأول مرة، يتم منحك عبارة استرداد مكونة من 12 أو 24 كلمة. يمكنك استخدام هذه العبارة لاستعادة محفظتك على أي جهاز آخر. من المهم الاحتفاظ بهذه العبارة في مكان آمن وعدم مشاركتها مع أي شخص."
      }
    ],
    videos: [
      {
        question: "كيفية إنشاء محفظة على RimToken",
        videoId: "wallet-creation",
        thumbnail: "/images/videos/wallet-creation.jpg",
        duration: "5:23",
        description: "دليل شامل لإنشاء محفظة جديدة على منصة RimToken وتأمينها باستخدام المصادقة الثنائية."
      },
      {
        question: "شرح خدمات RimToken الأساسية",
        videoId: "rimtoken-services",
        thumbnail: "/images/videos/services-overview.jpg",
        duration: "8:47",
        description: "نظرة عامة على جميع خدمات RimToken الست الأساسية وكيفية الاستفادة منها بشكل كامل."
      },
      {
        question: "كيفية تبديل العملات المشفرة",
        videoId: "crypto-swap",
        thumbnail: "/images/videos/swap-tutorial.jpg",
        duration: "4:15",
        description: "خطوة بخطوة لتبديل العملات المشفرة المختلفة على منصة RimToken بأفضل الأسعار وأقل الرسوم."
      },
      {
        question: "طرق الإيداع والسحب",
        videoId: "deposit-withdrawal",
        thumbnail: "/images/videos/deposit-withdrawal.jpg",
        duration: "7:32",
        description: "شرح مفصل لجميع طرق الإيداع والسحب المتاحة على المنصة، بما في ذلك العملات المشفرة والتحويلات البنكية وPayPal."
      },
      {
        question: "كيفية تأمين محفظتك",
        videoId: "security-guide",
        thumbnail: "/images/videos/security-guide.jpg",
        duration: "6:19",
        description: "أفضل الممارسات لتأمين محفظتك على RimToken، بما في ذلك إعداد المصادقة الثنائية وكلمات المرور القوية وعبارات الاسترداد."
      },
      {
        question: "شرح نظام الإنجازات والمكافآت",
        videoId: "achievements-rewards",
        thumbnail: "/images/videos/achievements.jpg",
        duration: "5:51",
        description: "دليل كامل لنظام الإنجازات والمكافآت في RimToken وكيفية الحصول على المزيد من المكافآت من خلال استخدام المنصة."
      }
    ]
  };

  // أنواع البيانات للأسئلة الشائعة
  type FAQItem = {
    question: string;
    answer?: string;
    videoId?: string;
    thumbnail?: string;
    duration?: string;
    description?: string;
  };

  type FAQData = {
    [key: string]: FAQItem[];
  };

  // تصفية الأسئلة بناءً على البحث
  const filterFAQs = () => {
    if (!searchQuery) return faqData[activeTab as keyof typeof faqData] || [];

    return (faqData[activeTab as keyof typeof faqData] || []).filter((item: FAQItem) => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.answer && item.answer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  // عرض قسم الفيديو
  const renderVideoSection = (video: FAQItem, index: number) => (
    <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-video bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <Play className="w-16 h-16 text-white opacity-80" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
        <div className="bg-gray-200 w-full h-full flex items-center justify-center">
          <Video className="w-12 h-12 text-gray-400" />
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{video.question}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm">{video.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button variant="outline" className="w-full text-sm flex items-center">
          <Play className="w-4 h-4 mr-2" /> مشاهدة الفيديو
        </Button>
      </CardContent>
    </Card>
  );

  // عرض قسم تعليمي خاص بشرح الخدمات
  const servicesExplanation = (
    <div className="mt-12 mb-8">
      <h2 className="text-2xl font-bold mb-6">خدمات RimToken الأساسية</h2>
      
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 rounded-lg border border-amber-200 mb-8">
        <div className="flex items-start space-x-4 space-x-reverse">
          <Info className="text-amber-600 h-6 w-6 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-amber-800 mb-2">تقدم منصة RimToken 6 خدمات أساسية</h3>
            <p className="text-amber-700 mb-4">
              مصممة لتلبية احتياجات المستخدمين المبتدئين والمتقدمين في مجال العملات المشفرة.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="bg-amber-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
              <WalletIcon className="text-amber-600 h-6 w-6" />
            </div>
            <CardTitle>تخزين العملات المشفرة</CardTitle>
            <CardDescription>
              محفظة آمنة لتخزين وإدارة عملاتك المشفرة
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              محفظة متعددة العملات تدعم Bitcoin وEthereum وBinance Smart Chain وSolana وغيرها، مع تحكم كامل بمفاتيحك الخاصة وأمان متقدم.
            </p>
            <Button variant="link" className="mt-4 px-0 flex items-center text-amber-600 hover:text-amber-700">
              معرفة المزيد <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
              <Share2 className="text-blue-600 h-6 w-6" />
            </div>
            <CardTitle>تبديل العملات (Swap)</CardTitle>
            <CardDescription>
              تبديل العملات المشفرة بأفضل الأسعار وأقل الرسوم
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              منصة تبادل لامركزية تتيح لك تبديل العملات المشفرة بسهولة، مع وصول إلى سيولة عالية وأسعار تنافسية من مصادر متعددة.
            </p>
            <Button variant="link" className="mt-4 px-0 flex items-center text-blue-600 hover:text-blue-700">
              معرفة المزيد <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
              <Download className="text-green-600 h-6 w-6" />
            </div>
            <CardTitle>إيداع الأموال</CardTitle>
            <CardDescription>
              إيداع الأموال عبر العملات المشفرة أو طرق الدفع التقليدية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              خيارات متعددة للإيداع تشمل العملات المشفرة والبطاقات الائتمانية وPayPal، مع معالجة سريعة وآمنة للمعاملات.
            </p>
            <Button variant="link" className="mt-4 px-0 flex items-center text-green-600 hover:text-green-700">
              معرفة المزيد <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
              <CreditCardIcon className="text-purple-600 h-6 w-6" />
            </div>
            <CardTitle>سحب الأموال</CardTitle>
            <CardDescription>
              سحب الأموال إلى محافظ خارجية أو حسابات بنكية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              خيارات مرنة للسحب مع تأمين متعدد المستويات، تتيح لك سحب أموالك إلى محافظ خارجية أو حسابات بنكية أو PayPal.
            </p>
            <Button variant="link" className="mt-4 px-0 flex items-center text-purple-600 hover:text-purple-700">
              معرفة المزيد <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="bg-red-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
              <Globe className="text-red-600 h-6 w-6" />
            </div>
            <CardTitle>متابعة الأسعار</CardTitle>
            <CardDescription>
              متابعة أسعار العملات المشفرة وتحليلها
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              أدوات متقدمة لمتابعة أسعار العملات المشفرة في الوقت الفعلي، مع رسوم بيانية وتحليلات لمساعدتك في اتخاذ قرارات مستنيرة.
            </p>
            <Button variant="link" className="mt-4 px-0 flex items-center text-red-600 hover:text-red-700">
              معرفة المزيد <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
              <Shield className="text-indigo-600 h-6 w-6" />
            </div>
            <CardTitle>إدارة المحفظة</CardTitle>
            <CardDescription>
              تتبع أداء محفظتك والإنجازات الشخصية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              لوحة تحكم شاملة لإدارة محفظتك مع تتبع للأداء والإنجازات، تساعدك على تحسين استراتيجية استثمارك في العملات المشفرة.
            </p>
            <Button variant="link" className="mt-4 px-0 flex items-center text-indigo-600 hover:text-indigo-700">
              معرفة المزيد <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <AppLayout 
      currentPage="/faq"
      breadcrumbs={[
        { label: "الرئيسية", href: "/" },
        { label: "الأسئلة الشائعة" }
      ]}
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">الأسئلة الشائعة</h1>
        <p className="text-gray-600 mb-8">اعثر على إجابات لأسئلتك الشائعة حول منصة RimToken</p>

        <div className="relative mb-8">
          <Input
            type="text"
            placeholder="ابحث عن سؤال..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
            {faqCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id} 
                className="flex items-center"
              >
                {category.icon}
                <span className="mr-2">{category.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* عرض الأسئلة الشائعة العامة وقسم الحساب والتداول والمحفظة */}
          {(activeTab === "general" || activeTab === "account" || activeTab === "trading" || activeTab === "wallet") && (
            <TabsContent value={activeTab} className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {filterFAQs().map((faq: FAQItem, index: number) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-right">{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-600 whitespace-pre-line">{faq.answer || ""}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {/* عرض قسم شرح الخدمات في صفحة الأسئلة العامة */}
              {activeTab === "general" && servicesExplanation}
            </TabsContent>
          )}

          {/* عرض قسم الفيديوهات */}
          <TabsContent value="videos">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">فيديوهات تعليمية</h2>
              <p className="text-gray-600 mb-6">
                شاهد فيديوهات تعليمية شاملة تشرح كيفية استخدام مختلف ميزات وخدمات منصة RimToken
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterFAQs().map((video, index) => renderVideoSection(video, index))}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-12">
              <h3 className="text-xl font-semibold mb-4">لم تجد ما تبحث عنه؟</h3>
              <p className="text-gray-600 mb-4">
                إذا لم تتمكن من العثور على الإجابة التي تبحث عنها، يمكنك الاتصال بفريق الدعم لدينا للحصول على المساعدة.
              </p>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                تواصل مع الدعم
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}