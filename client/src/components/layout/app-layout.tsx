import { ReactNode } from "react";
import { MainNav } from "@/components/navigation/main-nav";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";

interface AppLayoutProps {
  children: ReactNode;
  currentPage: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export function AppLayout({ children, currentPage, breadcrumbs }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* شريط التنقل العلوي */}
      <MainNav currentPage={currentPage} />
      
      <main className="container mx-auto py-8 px-4">
        {/* فتات الخبز */}
        {breadcrumbs && (
          <Breadcrumbs items={breadcrumbs} className="mb-4" />
        )}
        
        {/* محتوى الصفحة */}
        {children}
      </main>
      
      {/* تذييل الصفحة */}
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-right mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">
                جميع الحقوق محفوظة &copy; {new Date().getFullYear()} RimToken
              </p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-700">
                سياسة الخصوصية
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                الشروط والأحكام
              </a>
              <a href="/contact" className="text-gray-500 hover:text-gray-700">
                اتصل بنا
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}