import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Coins, LineChart, Shield, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 text-transparent bg-clip-text mb-4"
          >
            RIM توكن
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            عملة RIM الرقمية المشفرة - أساس نظام بيئي متكامل للتمويل اللامركزي
          </motion.p>
        </div>

        {/* قسم معلومات العملة */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full shadow-lg border-amber-100">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">نبذة تاريخية عن عملة RIM</CardTitle>
                <CardDescription>تاريخ تأسيس وتطور العملة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  RIM هي شبكة بلوكتشين تستخدم آلية ضمان الند للند لتوفير وظائف العقود الذكية المضمونة بواسطة الأصول التي يحتفظ بها مؤسسو الشبكة. العملة المشفرة الأساسية لشبكة RIM هي Sol.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  تم إطلاق سولانا في عام 2024 بواسطة RIM Labs، التي أسسها أنبرزان، هاتان، حاسم، وجون عثمان كامرا دوكسي.
                </p>
                <div className="pt-4">
                  <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600">
                    المزيد عن تاريخ RIM
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full shadow-lg border-amber-100">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">مميزات وقدرات RIM</CardTitle>
                <CardDescription>ما الذي يميز عملة RIM عن غيرها</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-10 w-10 text-amber-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">أمان عالٍ</h3>
                    <p className="text-gray-700">تعتمد RIM على آليات تشفير متقدمة وإجماع موزع لضمان أمان المعاملات والأصول.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <LineChart className="h-10 w-10 text-amber-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">سرعة فائقة</h3>
                    <p className="text-gray-700">تتميز شبكة RIM بقدرتها على معالجة آلاف المعاملات في الثانية مع رسوم منخفضة.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Coins className="h-10 w-10 text-amber-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">اقتصاد مستدام</h3>
                    <p className="text-gray-700">تم تصميم اقتصاد RIM ليكون مستدامًا على المدى الطويل مع توازن بين العرض والطلب.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Users className="h-10 w-10 text-amber-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">مجتمع متنامي</h3>
                    <p className="text-gray-700">يستمر مجتمع RIM في النمو مع آلاف المطورين والمستخدمين حول العالم.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* قسم إحصائيات العملة */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-10">إحصائيات RIM الحالية</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow border-amber-100">
              <h3 className="text-lg text-gray-600 mb-2">السعر الحالي</h3>
              <p className="text-3xl font-bold text-amber-600">$95.46</p>
              <p className="text-green-500 mt-2">+5.8% ▲</p>
            </Card>
            
            <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow border-amber-100">
              <h3 className="text-lg text-gray-600 mb-2">القيمة السوقية</h3>
              <p className="text-3xl font-bold text-amber-600">$28.7B</p>
              <p className="text-green-500 mt-2">+2.3% ▲</p>
            </Card>
            
            <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow border-amber-100">
              <h3 className="text-lg text-gray-600 mb-2">حجم التداول (24س)</h3>
              <p className="text-3xl font-bold text-amber-600">$1.8B</p>
              <p className="text-red-500 mt-2">-1.2% ▼</p>
            </Card>
            
            <Card className="text-center p-6 shadow-md hover:shadow-lg transition-shadow border-amber-100">
              <h3 className="text-lg text-gray-600 mb-2">المعروض المتداول</h3>
              <p className="text-3xl font-bold text-amber-600">300M</p>
              <p className="text-gray-500 mt-2">من أصل 500M</p>
            </Card>
          </div>
        </motion.div>

        {/* قسم خريطة الطريق */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="shadow-lg border-amber-100">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">خريطة طريق RIM</CardTitle>
              <CardDescription className="text-center text-lg">المراحل المستقبلية لتطوير العملة والنظام البيئي</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="shrink-0 w-24 h-24 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center text-white font-bold text-xl">Q3 2025</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">إطلاق شبكة اختبار RIM 2.0</h3>
                    <p className="text-gray-700">تحديث كبير للبروتوكول مع تحسينات في الأداء والأمان وإضافة ميزات جديدة للعقود الذكية.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="shrink-0 w-24 h-24 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center text-white font-bold text-xl">Q1 2026</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">توسع النظام البيئي</h3>
                    <p className="text-gray-700">إطلاق منصات وتطبيقات جديدة ضمن نظام RIM البيئي، بما في ذلك حلول DeFi وNFT متقدمة.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="shrink-0 w-24 h-24 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center text-white font-bold text-xl">Q4 2026</div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">التكامل العالمي</h3>
                    <p className="text-gray-700">شراكات استراتيجية مع مؤسسات مالية كبرى واعتماد عالمي أوسع لعملة وتقنية RIM.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* قسم الشراء والتداول */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-6">ابدأ رحلتك مع RIM اليوم</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            تداول، احفظ، واستثمر في عملة RIM من خلال منصة RimToken الآمنة والسهلة الاستخدام
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-lg">
              شراء RIM الآن
            </Button>
            <Button size="lg" variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-50 text-lg">
              استكشاف المزيد
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}