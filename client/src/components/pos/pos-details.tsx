import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Clock, 
  Phone, 
  ChevronLeft, 
  Star, 
  Calendar,
  Banknote,
  CreditCard,
  Building,
  Clock3,
  Calculator,
  Check,
  Info,
  QrCode,
  ArrowRight,
  AlignLeft
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { formatCurrency } from '@/lib/api';
import type { PosLocation } from './pos-map';

interface PosDetailsProps {
  location: PosLocation;
  onBack?: () => void;
}

interface ExchangeRate {
  currency: string;
  buyRate: number;
  sellRate: number;
}

export function PosDetails({ location, onBack }: PosDetailsProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [buyAmount, setBuyAmount] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>(location.availableCurrencies[0] || 'BTC');
  const [showAppointmentDialog, setShowAppointmentDialog] = useState<boolean>(false);
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [appointmentTime, setAppointmentTime] = useState<string>('');
  
  // استعلام لجلب أسعار الصرف
  const { data: exchangeRates, isLoading: loadingRates } = useQuery({
    queryKey: ['/api/exchange-rates', location.id],
    queryFn: async () => {
      // في بيئة حقيقية، سنجلب البيانات من الخادم
      // هذه بيانات مثالية للعرض
      return [
        { currency: 'BTC', buyRate: 230000, sellRate: 228000 },
        { currency: 'ETH', buyRate: 12500, sellRate: 12300 },
        { currency: 'BNB', buyRate: 1800, sellRate: 1750 },
        { currency: 'SOL', buyRate: 650, sellRate: 630 },
        { currency: 'USDT', buyRate: 3.76, sellRate: 3.74 },
        { currency: 'ADA', buyRate: 2.2, sellRate: 2.1 },
        { currency: 'XRP', buyRate: 3.1, sellRate: 3.0 },
        { currency: 'DOGE', buyRate: 0.8, sellRate: 0.75 },
        { currency: 'MATIC', buyRate: 3.5, sellRate: 3.4 },
      ].filter(rate => location.availableCurrencies.includes(rate.currency)) as ExchangeRate[];
    }
  });
  
  // جلب الأوقات المتاحة
  const { data: availableTimes } = useQuery({
    queryKey: ['/api/available-times', location.id, appointmentDate],
    queryFn: async () => {
      // في بيئة حقيقية، سنجلب البيانات من الخادم
      // هذه بيانات مثالية للعرض
      return [
        '10:00', '10:30', '11:00', '11:30', '12:00', 
        '13:00', '13:30', '14:00', '14:30', 
        '15:00', '15:30', '16:00', '16:30', '17:00'
      ];
    },
    enabled: !!appointmentDate
  });
  
  // حساب المبلغ المعادل بالعملة المشفرة
  const calculateCryptoAmount = () => {
    if (!buyAmount || isNaN(parseFloat(buyAmount))) return null;
    
    const rate = exchangeRates?.find(r => r.currency === selectedCurrency);
    if (!rate) return null;
    
    const amount = parseFloat(buyAmount);
    return amount / rate.buyRate;
  };
  
  // تحديد لون الخلفية بناءً على العملة
  const getCurrencyColor = (currency: string) => {
    switch (currency) {
      case 'BTC': return 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100';
      case 'ETH': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100';
      case 'BNB': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'SOL': return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      case 'USDT': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };
  
  // تنسيق طرق الدفع
  const renderPaymentMethods = (methods: Array<'cash' | 'card' | 'bank_transfer'>) => {
    return (
      <div className="flex flex-wrap gap-1.5">
        {methods.includes('cash') && (
          <Badge variant="outline" className="flex gap-1 items-center">
            <Banknote className="h-3.5 w-3.5" />
            <span>نقداً</span>
          </Badge>
        )}
        {methods.includes('card') && (
          <Badge variant="outline" className="flex gap-1 items-center">
            <CreditCard className="h-3.5 w-3.5" />
            <span>بطاقة</span>
          </Badge>
        )}
        {methods.includes('bank_transfer') && (
          <Badge variant="outline" className="flex gap-1 items-center">
            <Building className="h-3.5 w-3.5" />
            <span>تحويل بنكي</span>
          </Badge>
        )}
      </div>
    );
  };
  
  // تنسيق مستوى KYC
  const renderKycLevel = (level: 'none' | 'basic' | 'full') => {
    switch (level) {
      case 'none':
        return (
          <div className="flex items-center gap-2">
            <Badge variant="outline">بدون KYC</Badge>
            <span className="text-sm text-muted-foreground">لا توجد وثائق مطلوبة</span>
          </div>
        );
      case 'basic':
        return (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">KYC أساسي</Badge>
            <span className="text-sm text-muted-foreground">هوية شخصية فقط</span>
          </div>
        );
      case 'full':
        return (
          <div className="flex items-center gap-2">
            <Badge variant="default">KYC كامل</Badge>
            <span className="text-sm text-muted-foreground">هوية + إثبات عنوان</span>
          </div>
        );
    }
  };
  
  // وظيفة لحجز موعد
  const bookAppointment = () => {
    // في بيئة حقيقية، سنرسل طلب إلى الخادم لحجز الموعد
    alert(`تم حجز موعد في ${location.name} يوم ${appointmentDate} الساعة ${appointmentTime}`);
    setShowAppointmentDialog(false);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <span>{location.name}</span>
          </div>
          {location.openNow ? (
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">مفتوح</Badge>
          ) : (
            <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">مغلق</Badge>
          )}
        </CardTitle>
        <CardDescription className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {location.address}، {location.city}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="info" className="text-xs">معلومات</TabsTrigger>
            <TabsTrigger value="rates" className="text-xs">أسعار الصرف</TabsTrigger>
            <TabsTrigger value="buy" className="text-xs">شراء</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            <div className="rounded-md border overflow-hidden h-48 bg-muted">
              {location.image ? (
                <img 
                  src={location.image} 
                  alt={location.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  صورة غير متوفرة
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <h4 className="text-sm font-medium">ساعات العمل</h4>
                  <p className="text-sm text-muted-foreground">{location.hours}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <h4 className="text-sm font-medium">رقم الهاتف</h4>
                  <p className="text-sm text-muted-foreground">{location.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <div>
                  <h4 className="text-sm font-medium">التقييم</h4>
                  <p className="text-sm text-muted-foreground">
                    {location.rating} ({location.totalRatings} تقييم)
                  </p>
                </div>
              </div>
              
              <div className="pt-1">
                <h4 className="text-sm font-medium mb-1">طرق الدفع المقبولة</h4>
                {renderPaymentMethods(location.paymentMethods)}
              </div>
              
              <div className="pt-1">
                <h4 className="text-sm font-medium mb-1">متطلبات التحقق</h4>
                {renderKycLevel(location.kyc)}
              </div>
              
              <div className="pt-1">
                <h4 className="text-sm font-medium mb-1">العملات المتوفرة</h4>
                <div className="flex flex-wrap gap-1">
                  {location.availableCurrencies.map(currency => (
                    <Badge 
                      key={currency} 
                      variant="outline"
                      className={getCurrencyColor(currency)}
                    >
                      {currency}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="pt-1">
                <h4 className="text-sm font-medium mb-1">حدود المعاملات</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">الحد الأدنى: </span>
                    <span>{location.minAmount} ريال</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">الحد الأقصى: </span>
                    <span>{location.maxAmount} ريال</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="rates" className="space-y-4">
            {loadingRates ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full"></div>
              </div>
            ) : (
              <>
                <Alert className="bg-muted border-muted-foreground/20">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    أسعار الصرف قد تتغير عند وقت الشراء الفعلي. الأسعار محدثة كما في{" "}
                    {new Date().toLocaleTimeString('ar-EG')}
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-1">
                  {exchangeRates?.map((rate) => (
                    <div 
                      key={rate.currency}
                      className={`border rounded-lg p-3 ${
                        selectedCurrency === rate.currency 
                          ? 'border-primary bg-primary/5' 
                          : ''
                      }`}
                      onClick={() => setSelectedCurrency(rate.currency)}
                    >
                      <div className="flex justify-between items-center">
                        <Badge 
                          variant="outline"
                          className={`${getCurrencyColor(rate.currency)} px-2 py-1`}
                        >
                          {rate.currency}
                        </Badge>
                        
                        <div className="flex gap-3">
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">سعر الشراء</div>
                            <div className="font-medium">{formatCurrency(rate.buyRate)}</div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">سعر البيع</div>
                            <div className="font-medium">{formatCurrency(rate.sellRate)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">اختر العملة</Label>
                <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العملة" />
                  </SelectTrigger>
                  <SelectContent>
                    {location.availableCurrencies.map(currency => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">المبلغ بالريال السعودي</Label>
                <Input
                  id="amount"
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  placeholder={`${location.minAmount} - ${location.maxAmount}`}
                  min={location.minAmount}
                  max={location.maxAmount}
                />
                <p className="text-xs text-muted-foreground">
                  الحد الأدنى: {location.minAmount} ريال | الحد الأقصى: {location.maxAmount} ريال
                </p>
              </div>
              
              {buyAmount && !isNaN(parseFloat(buyAmount)) && (
                <div className="border rounded-lg p-3 bg-muted/50">
                  <h4 className="text-sm font-medium mb-2">تفاصيل المعاملة</h4>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">العملة:</span>
                      <Badge 
                        variant="outline"
                        className={getCurrencyColor(selectedCurrency)}
                      >
                        {selectedCurrency}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">سعر الشراء:</span>
                      <span>{formatCurrency(exchangeRates?.find(r => r.currency === selectedCurrency)?.buyRate || 0)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">المبلغ المدفوع:</span>
                      <span>{formatCurrency(parseFloat(buyAmount))}</span>
                    </div>
                    
                    <div className="flex justify-between pt-1 border-t font-medium">
                      <span>كمية {selectedCurrency}:</span>
                      <span>{calculateCryptoAmount()?.toFixed(8)} {selectedCurrency}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="pt-4">
                <Button 
                  onClick={() => setShowAppointmentDialog(true)}
                  disabled={!buyAmount || isNaN(parseFloat(buyAmount))}
                  className="w-full"
                >
                  حجز موعد للشراء
                </Button>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  ستحتاج إلى {location.kyc === 'none' 
                    ? 'لا يوجد وثائق مطلوبة' 
                    : location.kyc === 'basic'
                    ? 'هوية شخصية'
                    : 'هوية شخصية وإثبات عنوان'} 
                  عند زيارة نقطة البيع.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 border-t">
        <Button variant="outline" size="sm" onClick={onBack}>
          العودة إلى القائمة
        </Button>
        <Button 
          size="sm" 
          className="gap-1.5"
          onClick={() => setShowAppointmentDialog(true)}
        >
          <Calendar className="h-4 w-4" />
          حجز موعد
        </Button>
      </CardFooter>
      
      <Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>حجز موعد للشراء</DialogTitle>
            <DialogDescription>
              اختر التاريخ والوقت المناسب لزيارة {location.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="appointment-date">التاريخ</Label>
              <Input
                id="appointment-date"
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            {appointmentDate && (
              <div className="space-y-2">
                <Label htmlFor="appointment-time">الوقت</Label>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes?.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={appointmentTime === time ? "default" : "outline"}
                      className="text-sm"
                      onClick={() => setAppointmentTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {buyAmount && !isNaN(parseFloat(buyAmount)) && selectedCurrency && (
              <Alert className="bg-muted border-muted-foreground/20 mt-4">
                <Calculator className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  سيتم شراء {calculateCryptoAmount()?.toFixed(8)} {selectedCurrency} 
                  مقابل {formatCurrency(parseFloat(buyAmount))}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label>ملاحظات مهمة</Label>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>يرجى إحضار {location.kyc === 'none' 
                    ? 'لا يوجد وثائق مطلوبة' 
                    : location.kyc === 'basic'
                    ? 'هوية شخصية'
                    : 'هوية شخصية وإثبات عنوان'}</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>يرجى الحضور قبل الموعد بـ 15 دقيقة</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>طرق الدفع المتاحة: {location.paymentMethods.includes('cash') ? 'نقدي' : ''} 
                    {location.paymentMethods.includes('card') ? (location.paymentMethods.includes('cash') ? '، ' : '') + 'بطاقة' : ''}
                    {location.paymentMethods.includes('bank_transfer') ? (location.paymentMethods.includes('cash') || location.paymentMethods.includes('card') ? '، ' : '') + 'تحويل بنكي' : ''}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={bookAppointment}
              disabled={!appointmentDate || !appointmentTime}
            >
              تأكيد الحجز
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}