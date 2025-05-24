import { useLocation } from "wouter";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

interface BreadcrumbsProps {
  items?: Array<{
    label: string;
    href?: string;
  }>;
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const [location] = useLocation();
  
  // إذا لم يتم توفير عناصر، قم بإنشائها تلقائيًا من المسار الحالي
  const breadcrumbItems = items || generateBreadcrumbsFromPath(location);
  
  return (
    <nav className={`flex text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 space-x-reverse">
        <li>
          <Link href="/">
            <a className="text-gray-500 hover:text-gray-700">
              الرئيسية
            </a>
          </Link>
        </li>
        
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronLeft className="h-4 w-4 text-gray-400 mx-1" />
            {item.href && index < breadcrumbItems.length - 1 ? (
              <Link href={item.href}>
                <a className="text-gray-500 hover:text-gray-700">
                  {item.label}
                </a>
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// وظيفة مساعدة لإنشاء عناصر فتات الخبز من المسار
function generateBreadcrumbsFromPath(path: string): Array<{ label: string; href?: string }> {
  // تخطي الشرطة الأولى
  const pathWithoutFirstSlash = path.startsWith('/') ? path.substring(1) : path;
  
  // تقسيم المسار إلى أجزاء
  const pathParts = pathWithoutFirstSlash.split('/').filter(Boolean);
  
  // تخطي إذا كان المسار فارغًا (الصفحة الرئيسية)
  if (pathParts.length === 0) {
    return [];
  }
  
  // بناء قائمة فتات الخبز
  return pathParts.map((part, index) => {
    // تنسيق الاسم ليكون أكثر قابلية للقراءة
    const label = part
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // إنشاء الرابط
    const href = index === pathParts.length - 1 
      ? undefined 
      : `/${pathParts.slice(0, index + 1).join('/')}`;
    
    return { label, href };
  });
}

// مثال على كيفية استخدام المكون مع عناصر محددة مسبقًا
export function WalletBreadcrumbs() {
  return (
    <Breadcrumbs 
      items={[
        { label: "المحفظة", href: "/wallet" },
        { label: "نظرة عامة" }
      ]}
    />
  );
}

// مثال آخر للاستخدام
export function DepositBreadcrumbs() {
  return (
    <Breadcrumbs 
      items={[
        { label: "المحفظة", href: "/wallet" },
        { label: "إيداع الأموال" }
      ]}
    />
  );
}