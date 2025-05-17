import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsItem } from "./news-card";
import { formatDistanceToNow } from "date-fns";

interface NewsSidebarProps {
  breakingNews: NewsItem[];
  popularNews: NewsItem[];
}

export function NewsSidebar({ breakingNews, popularNews }: NewsSidebarProps) {
  return (
    <div className="space-y-6">
      {/* أخبار عاجلة */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <span className="mr-2 animate-pulse inline-block w-2 h-2 bg-red-500 rounded-full"></span>
            أخبار عاجلة
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {breakingNews.map((item) => (
              <a 
                key={item.id} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="flex items-start gap-2">
                  <div className="h-2 w-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-sm font-medium group-hover:text-amber-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* أكثر الأخبار قراءة */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">الأكثر قراءة</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {popularNews.map((item, index) => (
              <a 
                key={item.id} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="flex items-start gap-3">
                  <div className="text-lg font-bold text-amber-500 flex-shrink-0 w-5">
                    {index + 1}.
                  </div>
                  <div>
                    <h3 className="text-sm font-medium group-hover:text-amber-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.source} • {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* نشرة بريدية */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <h3 className="text-lg font-bold mb-2">النشرة البريدية</h3>
          <p className="text-sm text-gray-600 mb-4">اشترك في نشرتنا البريدية لتصلك آخر أخبار العملات المشفرة والتحليلات</p>
          <div className="space-y-2">
            <input 
              type="email" 
              placeholder="البريد الإلكتروني" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <button className="w-full px-3 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-md">
              اشتراك
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}