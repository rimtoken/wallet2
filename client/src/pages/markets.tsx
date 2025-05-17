import { Container } from "@/components/ui/container";
import { MarketList } from "@/components/market/market-list";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface MarketsPageProps {
  userId: number;
}

export default function MarketsPage({ userId }: MarketsPageProps) {
  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">سوق العملات المشفرة</h1>
          <Button asChild>
            <Link href="/swap">
              تبادل العملات
            </Link>
          </Button>
        </div>

        <MarketList userId={userId} />

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">تحليلات السوق</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-bold mb-4">اتجاهات السوق</h3>
              <p className="text-muted-foreground">
                سيعرض هذا القسم تحليلات لاتجاهات سوق العملات المشفرة، بما في ذلك المؤشرات الرئيسية والعملات الرائدة.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-xl font-bold mb-4">الأخبار والتحديثات</h3>
              <p className="text-muted-foreground">
                سيعرض هذا القسم أحدث أخبار العملات المشفرة والتحديثات المتعلقة بالسوق، مما يساعدك على اتخاذ قرارات تداول مستنيرة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}