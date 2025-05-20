import { Rocket, Shield, Globe, Zap, Award, Heart } from "lucide-react";
import rimLogo from "@assets/rim.png";
import rimTokenLogo from "@assets/469063470_586302450756454_5997633519251771466_n.jpg";

export default function AboutPage() {
  // معلومات الشركة وإنجازاتها
  const companyStats = [
    { id: 1, label: "مستخدمين سعداء", value: "150,000+" },
    { id: 2, label: "دول حول العالم", value: "120+" },
    { id: 3, label: "عملات مدعومة", value: "50+" },
    { id: 4, label: "معدل نمو سنوي", value: "200%" },
  ];
  
  // قيم الشركة
  const companyValues = [
    {
      id: 1,
      icon: <Shield className="h-8 w-8 text-amber-500" />,
      title: "الأمان أولاً",
      description: "نضع أمان أصول العملاء ومعلوماتهم على رأس أولوياتنا باستخدام أحدث تقنيات الأمان والتشفير"
    },
    {
      id: 2,
      icon: <Zap className="h-8 w-8 text-amber-500" />,
      title: "سرعة وكفاءة",
      description: "نسعى لتقديم أسرع وأكفأ خدمة ممكنة مع معاملات سريعة ورسوم منخفضة"
    },
    {
      id: 3,
      icon: <Globe className="h-8 w-8 text-amber-500" />,
      title: "وصول عالمي",
      description: "نعمل على توفير خدماتنا للجميع حول العالم دون قيود أو حدود"
    },
    {
      id: 4,
      icon: <Heart className="h-8 w-8 text-amber-500" />,
      title: "تركيز على العميل",
      description: "نضع احتياجات ومتطلبات عملائنا في صميم كل قرار نتخذه ومنتج نطوره"
    },
    {
      id: 5,
      icon: <Rocket className="h-8 w-8 text-amber-500" />,
      title: "الابتكار المستمر",
      description: "نستثمر باستمرار في البحث والتطوير لتقديم حلول مبتكرة ومنتجات متطورة"
    },
    {
      id: 6,
      icon: <Award className="h-8 w-8 text-amber-500" />,
      title: "الجودة العالية",
      description: "نلتزم بأعلى معايير الجودة في جميع منتجاتنا وخدماتنا وتفاعلاتنا"
    }
  ];
  
  // سنوات الإنجازات في الشركة
  const timeline = [
    {
      year: 2020,
      title: "تأسيس RimToken",
      description: "بدأت رحلة RimToken بفكرة بسيطة لإنشاء محفظة رقمية سهلة الاستخدام وآمنة.",
      highlighted: true
    },
    {
      year: 2021,
      title: "إطلاق أول منصة تبادل",
      description: "أطلقنا أول نسخة من منصة تبادل العملات الرقمية بدعم لخمس عملات رئيسية.",
      highlighted: false
    },
    {
      year: 2022,
      title: "توسع عالمي",
      description: "توسعنا لنشمل أكثر من 50 دولة حول العالم وأضفنا دعم 20 عملة إضافية.",
      highlighted: false
    },
    {
      year: 2023,
      title: "شراكات استراتيجية",
      description: "وقعنا شراكات استراتيجية مع مؤسسات مالية عالمية لتوسيع نطاق خدماتنا.",
      highlighted: false
    },
    {
      year: 2024,
      title: "إطلاق RimToken 2.0",
      description: "أطلقنا النسخة المحدثة من منصتنا مع واجهة مستخدم جديدة وميزات متقدمة.",
      highlighted: true
    },
    {
      year: 2025,
      title: "مليون مستخدم نشط",
      description: "وصلنا إلى معلم مهم بتجاوز مليون مستخدم نشط شهرياً على منصتنا.",
      highlighted: true
    }
  ];
  
  return (
    <div className="bg-background text-foreground overflow-hidden">
      {/* قسم الترحيب والمقدمة */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50 to-transparent opacity-80 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 flex items-center">
                <img src={rimLogo} alt="RimToken Logo" className="w-10 h-10 mr-2 rounded-full object-cover" />
                عن RimToken
              </h1>
              <p className="text-xl mb-8 text-gray-600 md:pr-12">
                نحن شركة رائدة في مجال تكنولوجيا العملات الرقمية، نسعى إلى تمكين الأفراد والمؤسسات 
                من الاستفادة من مزايا البلوكتشين وتقنيات العملات الرقمية بطريقة آمنة وسهلة.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="/team" 
                  className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  تعرف على فريقنا
                </a>
                <a 
                  href="/contact" 
                  className="border border-amber-500 text-amber-500 hover:bg-amber-50 font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  تواصل معنا
                </a>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-amber-300 shadow-xl">
                <img 
                  src={rimTokenLogo} 
                  alt="RimToken About" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* قسم الرؤية والرسالة */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-8 shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-amber-700">رؤيتنا</h2>
              <p className="text-gray-700">
                نطمح أن نكون الشركة الرائدة عالمياً في مجال تكنولوجيا العملات الرقمية،
                من خلال تقديم حلول مبتكرة تمكن الأفراد والمؤسسات من الاستفادة القصوى
                من تقنيات البلوكتشين وتطبيقاتها المتنوعة.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-blue-700">رسالتنا</h2>
              <p className="text-gray-700">
                نسعى لتسهيل وصول الجميع إلى عالم العملات الرقمية من خلال توفير منصات
                آمنة وسهلة الاستخدام، مع التركيز على الابتكار المستمر وتقديم تجربة
                مستخدم استثنائية تلبي احتياجات عملائنا.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* قسم الإحصائيات */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">RimToken بالأرقام</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {companyStats.map((stat) => (
              <div key={stat.id} className="p-6 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                <div className="text-4xl font-bold text-amber-400 mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* قسم قيم الشركة */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">قيمنا الأساسية</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              تحدد قيمنا الأساسية كيفية عملنا وتفاعلنا مع عملائنا وشركائنا
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyValues.map((value) => (
              <div key={value.id} className="bg-slate-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* قسم الإنجازات والتاريخ */}
      <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">مسيرتنا عبر السنين</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              منذ تأسيسنا، قطعنا شوطًا كبيرًا في تطوير منصات وحلول مبتكرة
            </p>
          </div>
          
          <div className="relative">
            {/* خط زمني */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-amber-200 z-0"></div>
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={item.year} className="relative z-10">
                  <div className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="md:w-1/2 p-4">
                      <div className={`p-6 rounded-lg shadow-md ${item.highlighted ? 'bg-amber-50 border-r-4 border-amber-500' : 'bg-white'}`}>
                        <div className="text-2xl font-bold text-amber-600 mb-2">{item.year}</div>
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    
                    <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-amber-500 border-4 border-white shadow-md z-10">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* قسم الدعوة للعمل */}
      <section className="py-16 bg-amber-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">انضم إلى رحلة RimToken اليوم</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            ابدأ رحلتك مع منصة العملات الرقمية الأكثر ابتكارًا وأمانًا
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/auth?tab=register" 
              className="bg-white text-amber-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors"
            >
              إنشاء حساب
            </a>
            <a 
              href="/contact" 
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              تحدث مع فريقنا
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}