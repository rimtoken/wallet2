import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BellRing, PlusCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
}

export enum AlertCondition {
  ABOVE = "above",
  BELOW = "below"
}

export interface PriceAlert {
  id: string;
  userId: number;
  cryptoId: string;
  cryptoSymbol: string;
  cryptoName: string;
  condition: AlertCondition;
  targetPrice: number;
  createdAt: Date;
  isActive: boolean;
}

interface PriceAlertDialogProps {
  currencies: CryptoCurrency[];
  onCreateAlert: (alert: Omit<PriceAlert, "id" | "userId" | "createdAt" | "isActive">) => Promise<void>;
  userId: number;
}

export function PriceAlertDialog({ currencies, onCreateAlert, userId }: PriceAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<string>("");
  const [alertCondition, setAlertCondition] = useState<AlertCondition>(AlertCondition.ABOVE);
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // العثور على العملة المحددة من القائمة
  const selectedCurrency = currencies.find(c => c.id === selectedCrypto);

  const handleSubmit = async () => {
    if (!selectedCrypto || !targetPrice) {
      toast({
        title: "خطأ في البيانات",
        description: "الرجاء ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "سعر غير صالح",
        description: "الرجاء إدخال سعر صالح أكبر من صفر",
        variant: "destructive",
      });
      return;
    }

    // التحقق من منطقية السعر المستهدف
    if (selectedCurrency) {
      if (alertCondition === AlertCondition.ABOVE && price <= selectedCurrency.currentPrice) {
        toast({
          title: "تنبيه منطقي",
          description: "للتنبيه عندما يكون السعر أعلى، يجب أن يكون السعر المستهدف أعلى من السعر الحالي",
          variant: "destructive",
        });
        return;
      }

      if (alertCondition === AlertCondition.BELOW && price >= selectedCurrency.currentPrice) {
        toast({
          title: "تنبيه منطقي",
          description: "للتنبيه عندما يكون السعر أقل، يجب أن يكون السعر المستهدف أقل من السعر الحالي",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      setIsSubmitting(true);
      
      await onCreateAlert({
        cryptoId: selectedCrypto,
        cryptoSymbol: selectedCurrency?.symbol || "",
        cryptoName: selectedCurrency?.name || "",
        condition: alertCondition,
        targetPrice: price,
      });

      toast({
        title: "تم إنشاء التنبيه",
        description: `سيتم إشعارك عندما يكون سعر ${selectedCurrency?.name} ${alertCondition === AlertCondition.ABOVE ? 'أعلى من' : 'أقل من'} $${price}`,
      });

      // إعادة تعيين النموذج وإغلاق الحوار
      setSelectedCrypto("");
      setAlertCondition(AlertCondition.ABOVE);
      setTargetPrice("");
      setOpen(false);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء التنبيه. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 border-amber-500 text-amber-600 hover:bg-amber-50"
        >
          <PlusCircle className="h-4 w-4" />
          <span>تنبيه جديد</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إنشاء تنبيه سعر جديد</DialogTitle>
          <DialogDescription>
            سيتم إعلامك عندما يصل سعر العملة المشفرة إلى المستوى المحدد
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="crypto">العملة المشفرة</Label>
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <SelectTrigger id="crypto">
                <SelectValue placeholder="اختر العملة" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.id} value={currency.id}>
                    {currency.name} ({currency.symbol.toUpperCase()}) - ${currency.currentPrice.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="condition">الشرط</Label>
            <Select 
              value={alertCondition} 
              onValueChange={(value) => setAlertCondition(value as AlertCondition)}
            >
              <SelectTrigger id="condition">
                <SelectValue placeholder="اختر الشرط" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AlertCondition.ABOVE}>أعلى من</SelectItem>
                <SelectItem value={AlertCondition.BELOW}>أقل من</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="price">
              السعر المستهدف (USD)
              {selectedCurrency && (
                <span className="text-sm text-gray-500 mr-2">
                  السعر الحالي: ${selectedCurrency.currentPrice.toLocaleString()}
                </span>
              )}
            </Label>
            <Input
              id="price"
              type="number"
              step="0.000001"
              min="0"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="أدخل السعر المستهدف"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "جاري الإنشاء..." : "إنشاء التنبيه"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}