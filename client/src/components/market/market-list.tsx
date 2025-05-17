import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, Search, Star, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MarketListProps {
  userId: number;
  onSelectAsset?: (asset: any) => void;
}

export function MarketList({ userId, onSelectAsset }: MarketListProps) {
  const [sortField, setSortField] = useState<string>("price");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // استعلام لجلب بيانات السوق
  const { data: marketData, isLoading, refetch } = useQuery({
    queryKey: ["/api/market"],
  });

  // وظيفة للفرز
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // وظيفة لإضافة/إزالة العملة من المفضلة
  const toggleFavorite = (assetId: number) => {
    if (favorites.includes(assetId)) {
      setFavorites(favorites.filter(id => id !== assetId));
    } else {
      setFavorites([...favorites, assetId]);
    }
  };

  // وظيفة لتحديث بيانات السوق
  const refreshMarketData = async () => {
    setIsRefreshing(true);
    try {
      await fetch("/api/market/refresh");
      await refetch();
    } catch (error) {
      console.error("Error refreshing market data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // فلترة وفرز البيانات
  const filteredAndSortedData = () => {
    if (!marketData) return [];

    // فلترة البيانات حسب البحث
    let filtered = marketData;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = marketData.filter((asset: any) =>
        asset.name.toLowerCase().includes(query) ||
        asset.symbol.toLowerCase().includes(query)
      );
    }

    // فرز البيانات
    return [...filtered].sort((a: any, b: any) => {
      // إذا كان أحدهما مفضلاً والآخر ليس كذلك
      if (favorites.includes(a.id) && !favorites.includes(b.id)) return -1;
      if (!favorites.includes(a.id) && favorites.includes(b.id)) return 1;

      // فرز حسب الحقل المحدد
      let aValue = a[sortField];
      let bValue = b[sortField];

      // تحويل القيم إلى أرقام إذا كانت نصية
      if (typeof aValue === "string" && !isNaN(parseFloat(aValue))) {
        aValue = parseFloat(aValue);
      }
      if (typeof bValue === "string" && !isNaN(parseFloat(bValue))) {
        bValue = parseFloat(bValue);
      }

      // فرز تصاعدي أو تنازلي
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>سوق العملات المشفرة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>سوق العملات المشفرة</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshMarketData}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> تحديث...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" /> تحديث الأسعار
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن عملة..."
              className="pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">
                  <span className="sr-only">مفضلة</span>
                </TableHead>
                <TableHead className="w-64">العملة</TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center justify-end">
                    السعر
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead
                  className="text-right cursor-pointer"
                  onClick={() => handleSort("priceChangePercentage24h")}
                >
                  <div className="flex items-center justify-end">
                    التغير (24 ساعة)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-center w-24">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData().map((asset: any) => (
                <TableRow key={asset.id}>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(asset.id)}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          favorites.includes(asset.id)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                        <span className="font-medium text-xs">{asset.symbol.substring(0, 1)}</span>
                      </div>
                      <div>
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {asset.symbol}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">${parseFloat(asset.price).toLocaleString()}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div
                      className={`font-medium ${
                        parseFloat(asset.priceChangePercentage24h) >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {parseFloat(asset.priceChangePercentage24h) >= 0 ? "+" : ""}
                      {parseFloat(asset.priceChangePercentage24h).toFixed(2)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectAsset && onSelectAsset(asset)}
                    >
                      تداول
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAndSortedData().length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    لا توجد عملات متطابقة مع البحث
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}