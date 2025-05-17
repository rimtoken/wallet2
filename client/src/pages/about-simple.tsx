import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-600 mb-4">
            نبذة عن RIM توكن
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            عملة RIM الرقمية المشفرة - أساس نظام بيئي متكامل للتمويل اللامركزي
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">تاريخ RIM</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              RIM هي شبكة بلوكتشين تستخدم آلية ضمان الند للند لتوفير وظائف العقود الذكية المضمونة بواسطة الأصول التي يحتفظ بها مؤسسو الشبكة. العملة المشفرة الأساسية لشبكة RIM هي Sol.
            </p>
            <p className="text-gray-700 leading-relaxed">
              تم إطلاق سولانا في عام 2024 بواسطة RIM Labs، التي أسسها أنبرزان، هاتان، حاسم، وجون عثمان كامرا دوكسي.
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}