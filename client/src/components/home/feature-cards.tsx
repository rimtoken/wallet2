import { motion } from "framer-motion";
import { 
  Shield, 
  ArrowUpDown, 
  Upload, 
  Download, 
  Wallet,
  Lock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function FeatureCards() {
  const keyFeatures = [
    {
      icon: <Shield className="h-10 w-10 text-amber-500" />,
      title: "محفظة أمنة",
      description: "حافظ على أمان أصولك الرقمية مع أحدث تقنيات التشفير والتخزين الآمن للمفاتيح",
      color: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200"
    },
    {
      icon: <ArrowUpDown className="h-10 w-10 text-blue-500" />,
      title: "تداول سلس",
      description: "استمتع بتداول سلس وفوري بين مختلف العملات الرقمية وبأقل الرسوم الممكنة",
      color: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
    },
    {
      icon: <Download className="h-10 w-10 text-green-500" />,
      title: "إيداع محكم",
      description: "أودع عملاتك المشفرة بسهولة مع تأكيد فوري وإجراءات أمان متقدمة",
      color: "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
    },
    {
      icon: <Upload className="h-10 w-10 text-purple-500" />,
      title: "سحب سريع",
      description: "اسحب أموالك بسرعة وأمان في أي وقت ومن أي مكان دون تعقيدات",
      color: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">ميزات تطبيق RimToken</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            تمتع بأفضل تجربة لإدارة عملاتك المشفرة مع هذه الميزات الحصرية
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {keyFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`h-full border ${feature.color} overflow-hidden shadow-sm hover:shadow-md transition-all`}>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-white shadow-sm mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SecurityFeatures() {
  const securityFeatures = [
    {
      icon: <Lock className="h-6 w-6 text-gray-700" />,
      title: "مصادقة ثنائية",
      description: "حماية إضافية لحسابك مع تقنية المصادقة الثنائية 2FA"
    },
    {
      icon: <Shield className="h-6 w-6 text-gray-700" />,
      title: "تشفير طرف-لطرف",
      description: "حماية بياناتك مع تشفير قوي من طرف إلى طرف"
    },
    {
      icon: <Wallet className="h-6 w-6 text-gray-700" />,
      title: "محفظة لا مركزية",
      description: "تحكم كامل في مفاتيحك الخاصة دون وسطاء"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {securityFeatures.map((feature, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-start gap-4">
          <div className="rounded-full bg-gray-100 p-2 mt-1">
            {feature.icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ValueProposition() {
  return (
    <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-amber-800 mb-4">
            <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
              أسرع. أسهل. أكثر أماناً.
            </span>
          </h2>
          <p className="text-xl text-gray-700">
            تطبيق RimToken يجمع بين السرعة والسهولة والأمان ليوفر لك أفضل تجربة محفظة رقمية
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden border-2 border-amber-500">
              <img 
                src="/assets/rim-circle-logo.jpg" 
                alt="RIM Token Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-3">إيداع محكم</h3>
            <p className="text-gray-600">
              إيداع فوري لجميع العملات المشفرة المدعومة مع تأكيد سريع للمعاملات وإجراءات أمان متقدمة
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowUpDown className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">تداول سلس</h3>
            <p className="text-gray-600">
              تداول مباشر بين العملات المختلفة بأسعار مناسبة وبدون تعقيدات أو رسوم مخفية
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">سحب سريع</h3>
            <p className="text-gray-600">
              سحب فوري وآمن لأموالك في أي وقت مع تأكيد متعدد المستويات لضمان الأمان والسرعة
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}