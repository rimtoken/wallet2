import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NewsItem } from "./news-card";
import { formatDistance } from "date-fns";

interface FeaturedNewsProps {
  item: NewsItem;
}

export function FeaturedNews({ item }: FeaturedNewsProps) {
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
  });

  return (
    <Card className="overflow-hidden border-0 shadow-lg relative">
      <div className="grid md:grid-cols-2 h-full">
        <div 
          className="h-64 md:h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${item.imageUrl || 'https://source.unsplash.com/random/800x600/?crypto'})` }}
        >
          <div className="absolute top-4 right-4 z-10">
            <Badge className={`${categoryColors[item.category]} font-normal text-sm`}>
              {categoryLabels[item.category]}
            </Badge>
          </div>
        </div>
        <CardContent className="flex flex-col justify-center p-6 md:p-8">
          <div className="text-sm text-gray-500 mb-2">{timeAgo} • {item.source}</div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">{item.title}</h2>
          <p className="text-gray-600 mb-6">{item.summary}</p>
          <Button 
            className="w-fit bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
            asChild
          >
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              قراءة المزيد
            </a>
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}