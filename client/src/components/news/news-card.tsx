import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistance } from "date-fns";
import { ArTn } from "date-fns/locale";

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  sourceIcon: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
  category: "market" | "technology" | "regulation" | "adoption" | "opinion" | "rimtoken";
}

interface NewsCardProps {
  item: NewsItem;
  variant?: "default" | "compact";
}

export function NewsCard({ item, variant = "default" }: NewsCardProps) {
  const categoryColors = {
    market: "bg-blue-100 text-blue-800",
    technology: "bg-purple-100 text-purple-800",
    regulation: "bg-red-100 text-red-800",
    adoption: "bg-green-100 text-green-800",
    opinion: "bg-gray-100 text-gray-800",
    rimtoken: "bg-amber-100 text-amber-800"
  };

  const categoryLabels = {
    market: "السوق",
    technology: "تكنولوجيا",
    regulation: "تشريعات",
    adoption: "تبني",
    opinion: "رأي",
    rimtoken: "RimToken"
  };

  const publishedDate = new Date(item.publishedAt);
  const timeAgo = formatDistance(publishedDate, new Date(), { 
    addSuffix: true,
    // locale: ArTn // يمكن تفعيل هذا عند توفر دعم اللغة العربية
  });

  if (variant === "compact") {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex h-full">
          {item.imageUrl && (
            <div className="relative w-1/3 min-w-[120px]">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.imageUrl})` }}
              />
            </div>
          )}
          <div className={`flex flex-col ${item.imageUrl ? 'w-2/3' : 'w-full'}`}>
            <CardHeader className="p-3 pb-1">
              <div className="flex justify-between items-start gap-2">
                <Badge className={`${categoryColors[item.category]} font-normal text-xs`}>
                  {categoryLabels[item.category]}
                </Badge>
                <span className="text-xs text-gray-500">{timeAgo}</span>
              </div>
              <CardTitle className="text-sm mt-1 line-clamp-2">{item.title}</CardTitle>
            </CardHeader>
            <CardFooter className="p-3 pt-0 text-xs text-gray-500 mt-auto flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={item.sourceIcon} />
                <AvatarFallback className="text-[8px]">{item.source.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span>{item.source}</span>
            </CardFooter>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      {item.imageUrl && (
        <div className="relative h-48 w-full">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${item.imageUrl})` }}
          />
          <div className="absolute top-2 right-2">
            <Badge className={`${categoryColors[item.category]} font-normal`}>
              {categoryLabels[item.category]}
            </Badge>
          </div>
        </div>
      )}
      <CardHeader className={item.imageUrl ? "pt-4" : "pt-6"}>
        {!item.imageUrl && (
          <div className="mb-2">
            <Badge className={`${categoryColors[item.category]} font-normal`}>
              {categoryLabels[item.category]}
            </Badge>
          </div>
        )}
        <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 mt-1">
          <Avatar className="h-6 w-6">
            <AvatarImage src={item.sourceIcon} />
            <AvatarFallback>{item.source.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>{item.source}</span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs">{timeAgo}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 line-clamp-3">{item.summary}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <a 
          href={item.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-amber-600 hover:text-amber-700 text-sm font-medium"
        >
          اقرأ المزيد &rarr;
        </a>
      </CardFooter>
    </Card>
  );
}