import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Shield, 
  ArrowUpDown, 
  LineChart, 
  Wallet, 
  BarChart3, 
  ArrowRightLeft,
  Users,
  Sparkles,
  Globe,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { FeatureCards, ValueProposition } from "@/components/home/feature-cards";

export default function HomePage() {
  const features = [
    {
      icon: <Shield className="h-6 w-6 text-amber-500" />,
      title: "أمان عالي",
      description: "تشفير متقدم للمحفظة مع التحكم الكامل في مفاتيحك الخاصة"
    },
    {
      icon: <ArrowUpDown className="h-6 w-6 text-blue-500" />,
      title: "تبادل سهل",
      description: "تبادل العملات المشفرة بكل سهولة وبأقل الرسوم الممكنة"
    },
    {
      icon: <LineChart className="h-6 w-6 text-green-500" />,
      title: "تحليلات متطورة",
      description: "رؤى وتحليلات متقدمة لمساعدتك في اتخاذ قرارات استثمارية أفضل"
    },
    {
      icon: <Globe className="h-6 w-6 text-purple-500" />,
      title: "تعدد السلاسل",
      description: "دعم لعدة سلاسل بلوكتشين بما في ذلك إيثيريوم وسولانا وبينانس"
    }
  ];

  const supportedCoins = [
    { name: "Bitcoin", symbol: "BTC", color: "bg-amber-500" },
    { name: "Ethereum", symbol: "ETH", color: "bg-blue-500" },
    { name: "Binance Coin", symbol: "BNB", color: "bg-yellow-500" },
    { name: "Solana", symbol: "SOL", color: "bg-purple-500" },
    { name: "Cardano", symbol: "ADA", color: "bg-blue-400" },
    { name: "Polkadot", symbol: "DOT", color: "bg-pink-500" }
  ];

  const stats = [
    { value: "+35", label: "عملة مدعومة" },
    { value: "3", label: "سلاسل بلوكتشين" },
    { value: "+10K", label: "مستخدم نشط" },
    { value: "24/7", label: "دعم فني" }
  ];

  return (
    <MainLayout>
      {/* المحتوى الرئيسي - يأتي بعد قسم الترحيب في main-layout */}
      
      {/* قسم المميزات */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">لماذا تختار RimToken؟</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              محفظة لامركزية متعددة السلاسل تتيح لك التحكم الكامل في أصولك الرقمية مع واجهة مستخدم سهلة وبسيطة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="rounded-full bg-gray-50 w-12 h-12 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* قسم الميزات مع العبارات الجديدة */}
      <FeatureCards />
      
      {/* قسم القيمة المميزة مع الميزات الرئيسية */}
      <ValueProposition />

      {/* قسم إحصائيات */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-amber-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm rounded-lg py-6 px-4 shadow"
              >
                <p className="text-4xl font-bold text-amber-600 mb-2">{stat.value}</p>
                <p className="text-gray-700">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* قسم العملات المدعومة */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">العملات المدعومة</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ندعم مجموعة واسعة من العملات المشفرة الرائدة في السوق
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {supportedCoins.map((coin, index) => (
              <motion.div
                key={coin.symbol}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 rtl:space-x-reverse hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 rounded-full ${coin.color} flex items-center justify-center text-white font-bold`}>
                  {coin.symbol.substring(0, 1)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{coin.name}</h3>
                  <p className="text-gray-500 text-sm">{coin.symbol}</p>
                </div>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl shadow-md p-6 md:col-span-2 lg:col-span-3"
            >
              <h3 className="text-xl font-bold text-amber-700 mb-2">ندعم العديد من العملات الأخرى</h3>
              <p className="text-gray-700">
                بالإضافة إلى العملات الأساسية، توفر محفظة RimToken دعماً لأكثر من 150 عملة مشفرة متنوعة.
              </p>
            </motion.div>
            <div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>دعم لأكثر من 35 عملة مشفرة رئيسية</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>توافق مع محافظ Web3 الشائعة</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>تبادل فوري بين العملات المختلفة</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {supportedCoins.map((coin, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 ${coin.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                  <span className="text-white font-bold">{coin.symbol.substring(0, 1)}</span>
                </div>
                <p className="font-medium">{coin.name}</p>
                <p className="text-sm text-gray-500">{coin.symbol}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
              <Link href="/markets">
                عرض جميع العملات
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* قسم المميزات الرئيسية */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">إدارة أصولك الرقمية بسهولة تامة</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 ml-2" />
                  <div>
                    <h3 className="text-lg font-semibold">تجربة مستخدم سلسة</h3>
                    <p className="text-gray-600">واجهة سهلة الاستخدام تناسب المبتدئين والمحترفين</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 ml-2" />
                  <div>
                    <h3 className="text-lg font-semibold">تبادل فوري</h3>
                    <p className="text-gray-600">تبادل العملات المشفرة بسرعة وبدون تعقيدات</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 ml-2" />
                  <div>
                    <h3 className="text-lg font-semibold">مراقبة السوق</h3>
                    <p className="text-gray-600">متابعة حية لأسعار العملات واتجاهات السوق</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 ml-2" />
                  <div>
                    <h3 className="text-lg font-semibold">أمان متقدم</h3>
                    <p className="text-gray-600">التحكم الكامل في المفاتيح الخاصة وإمكانية تفعيل المصادقة الثنائية</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button variant="default" className="bg-amber-500 hover:bg-amber-600">
                  <Link href="/wallet">
                    إنشاء محفظة
                  </Link>
                </Button>
                <Button variant="outline">
                  <Link href="/markets">
                    استكشاف السوق
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative h-96 overflow-hidden rounded-lg shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-amber-500/20 backdrop-blur-sm"></div>
              {/* هنا يمكن إضافة صورة واجهة المحفظة */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-4/5">
                  <Card className="bg-white/90 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                          <span className="text-white font-bold">B</span>
                        </div>
                        <div>
                          <p className="font-medium">Bitcoin</p>
                          <p className="text-sm text-green-500">+2.4%</p>
                        </div>
                      </div>
                      <p className="mt-2 text-lg font-bold">$43,521</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/90 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white font-bold">E</span>
                        </div>
                        <div>
                          <p className="font-medium">Ethereum</p>
                          <p className="text-sm text-green-500">+3.1%</p>
                        </div>
                      </div>
                      <p className="mt-2 text-lg font-bold">$2,856</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/90 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                          <span className="text-white font-bold">S</span>
                        </div>
                        <div>
                          <p className="font-medium">Solana</p>
                          <p className="text-sm text-green-500">+5.7%</p>
                        </div>
                      </div>
                      <p className="mt-2 text-lg font-bold">$124.35</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/90 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                          <span className="text-white font-bold">B</span>
                        </div>
                        <div>
                          <p className="font-medium">BNB</p>
                          <p className="text-sm text-red-500">-0.8%</p>
                        </div>
                      </div>
                      <p className="mt-2 text-lg font-bold">$415.68</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* قسم البدء */}
      <section className="py-16 bg-white border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">ابدأ اليوم مع RimToken</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            انضم إلى آلاف المستخدمين وابدأ في إدارة أصولك الرقمية بطريقة آمنة وسهلة
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-lg px-8 py-6 h-auto">
              <Link href="/auth">
                إنشاء حساب
              </Link>
            </Button>
            <Button variant="outline" className="text-lg px-8 py-6 h-auto">
              <Link href="/markets">
                استكشاف السوق
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}