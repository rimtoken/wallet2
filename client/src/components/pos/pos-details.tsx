import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Phone, 
  Clock, 
  CreditCard, 
  Shield, 
  MapPin,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PosLocation } from './pos-map';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PosDetailsProps {
  location: PosLocation;
  onBack: () => void;
}

interface ExchangeRate {
  currency: string;
  buyRate: number;
  sellRate: number;
}

export function PosDetails({ location, onBack }: PosDetailsProps) {
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [appointmentTime, setAppointmentTime] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('BTC');
  const [amount, setAmount] = useState<string>('');
  const [exchangeAmount, setExchangeAmount] = useState<string>('');
  
  // أسعار الصرف لكل عملة
  const exchangeRates: ExchangeRate[] = [
    { currency: 'BTC', buyRate: 150000, sellRate: 148000 },
    { currency: 'ETH', buyRate: 8500, sellRate: 8300 },
    { currency: 'SOL', buyRate: 350, sellRate: 340 },
    { currency: 'BNB', buyRate: 900, sellRate: 880 },
    { currency: 'USDT', buyRate: 3.76, sellRate: 3.74 },
    { currency: 'XRP', buyRate: 1.5, sellRate: 1.45 },
    { currency: 'DOGE', buyRate: 0.25, sellRate: 0.24 },
  ];
  
  // حساب المبلغ المقابل عند تغيير الكمية
  const handleAmountChange = (value: string) => {
    setAmount(value);
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && selectedCurrency) {
      const rate = exchangeRates.find(r => r.currency === selectedCurrency)?.buyRate || 0;
      const calculated = (numericValue * rate).toFixed(2);
      setExchangeAmount(calculated);
    } else {
      setExchangeAmount('');
    }
  };
  
  // تغيير العملة المختارة
  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
    if (amount) {
      const numericValue = parseFloat(amount);
      if (!isNaN(numericValue)) {
        const rate = exchangeRates.find(r => r.currency === value)?.buyRate || 0;
        const calculated = (numericValue * rate).toFixed(2);
        setExchangeAmount(calculated);
      }
    }
  };
  
  // حجز موعد
  const handleBookAppointment = () => {
    alert(`تم حجز موعد في ${appointmentDate} الساعة ${appointmentTime} في ${location.name}`);
    // هنا يمكن إضافة منطق ارسال البيانات إلى الخادم
  };
  
  // تنسيق أوقات المواعيد المتاحة
  const availableTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
  
  // فلترة العملات المتوفرة في هذه النقطة
  const availableCurrencies = exchangeRates.filter(rate => 
    location.supportedCurrencies.includes(rate.currency)
  );
  
  return (
    <div className="space-y-6 rtl">
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={onBack}
          className="ml-2"
        >
          <ArrowRight className="h-4 w-4 ml-1" />
          العودة إلى الخريطة
        </Button>
        <h2 className="text-2xl font-bold">{location.name}</h2>
      </div>
      
      {/* تفاصيل نقطة البيع */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات نقطة البيع</CardTitle>
          <CardDescription>تفاصيل الموقع وساعات العمل ومعلومات الاتصال</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-8">
            <div className="space-y-3 flex-1">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 ml-2 text-muted-foreground" />
                <span>{location.address}، {location.city}</span>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-5 w-5 ml-2 text-muted-foreground" />
                <span dir="ltr">{location.phone}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 ml-2 text-muted-foreground" />
                <span>{location.openHours}</span>
              </div>
              
              <div className="flex items-center">
                <Shield className="h-5 w-5 ml-2 text-muted-foreground" />
                <span>
                  {location.kycRequired ? 'مطلوب إثبات هوية (KYC)' : 'لا يشترط إثبات هوية للمبالغ الصغيرة'}
                </span>
              </div>
              
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 ml-2 text-muted-foreground" />
                <div className="flex flex-wrap gap-1">
                  <span className="ml-1">طرق الدفع:</span>
                  {location.paymentMethods.map(method => (
                    <Badge key={method} variant="outline">{method}</Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {location.image && (
              <div className="w-1/3 hidden md:block">
                <div 
                  className="w-full h-[150px] bg-slate-200 rounded-lg"
                  style={{
                    backgroundImage: `url(${location.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="rates">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="rates">أسعار الصرف</TabsTrigger>
          <TabsTrigger value="buy">شراء العملات</TabsTrigger>
        </TabsList>
        
        {/* أسعار الصرف */}
        <TabsContent value="rates" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>أسعار الصرف المتوفرة</CardTitle>
              <CardDescription>
                آخر تحديث اليوم الساعة {new Date().getHours()}:{new Date().getMinutes().toString().padStart(2, '0')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-right">العملة</th>
                      <th className="py-2 px-4 text-right">سعر الشراء (ريال)</th>
                      <th className="py-2 px-4 text-right">سعر البيع (ريال)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableCurrencies.map((rate) => (
                      <tr key={rate.currency} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">{rate.currency}</td>
                        <td className="py-3 px-4">{rate.buyRate.toLocaleString()} ريال</td>
                        <td className="py-3 px-4">{rate.sellRate.toLocaleString()} ريال</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                * الأسعار قابلة للتغيير حسب تقلبات السوق. يرجى الاتصال لتأكيد السعر قبل إجراء معاملات كبيرة.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* شراء العملات */}
        <TabsContent value="buy" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>شراء العملات الرقمية</CardTitle>
              <CardDescription>
                حدد العملة والكمية التي ترغب بشرائها
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">اختر العملة</Label>
                    <Select
                      value={selectedCurrency}
                      onValueChange={handleCurrencyChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر العملة" />
                      </SelectTrigger>
                      <SelectContent>
                        {location.supportedCurrencies.map(currency => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">الكمية</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="أدخل الكمية"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span>السعر الحالي:</span>
                    <span>{exchangeRates.find(r => r.currency === selectedCurrency)?.buyRate.toLocaleString()} ريال</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>المبلغ المطلوب دفعه:</span>
                    <span>{exchangeAmount ? `${parseFloat(exchangeAmount).toLocaleString()} ريال` : '-'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Dialog>
                <DialogTrigger asChild>
                  <Button disabled={!amount || parseFloat(amount) <= 0}>
                    <Calendar className="h-4 w-4 ml-2" />
                    حجز موعد للشراء
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>حجز موعد في {location.name}</DialogTitle>
                    <DialogDescription>
                      اختر التاريخ والوقت المناسب لزيارة نقطة البيع
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">التاريخ</Label>
                      <Input
                        id="date"
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="time">الوقت</Label>
                      <Select
                        value={appointmentTime}
                        onValueChange={setAppointmentTime}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الوقت" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTimes.map(time => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="bg-muted/30 p-3 rounded-lg text-sm">
                      <p>معلومات الشراء:</p>
                      <p>العملة: {selectedCurrency}</p>
                      <p>الكمية: {amount} {selectedCurrency}</p>
                      <p>المبلغ: {exchangeAmount ? `${parseFloat(exchangeAmount).toLocaleString()} ريال` : '-'}</p>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">إلغاء</Button>
                    </DialogClose>
                    <Button 
                      onClick={handleBookAppointment}
                      disabled={!appointmentDate || !appointmentTime}
                    >
                      تأكيد الحجز
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <div className="text-sm text-muted-foreground">
                * سيتم تثبيت السعر عند تأكيد الموعد
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}