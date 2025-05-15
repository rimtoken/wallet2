import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  MapPin, 
  Search, 
  Clock, 
  Building, 
  Phone, 
  Navigation, 
  Star, 
  ExternalLink,
  Banknote,
  CreditCard,
  Coins
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface PosMapProps {
  userLocation?: { lat: number; lng: number };
  onSelectLocation?: (location: PosLocation) => void;
}

export interface PosLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  coordinates: { lat: number; lng: number };
  distance?: number;
  openNow: boolean;
  hours: string;
  phone: string;
  rating: number;
  totalRatings: number;
  paymentMethods: Array<'cash' | 'card' | 'bank_transfer'>;
  availableCurrencies: string[];
  kyc: 'none' | 'basic' | 'full';
  minAmount?: number;
  maxAmount?: number;
  image?: string;
}

export function PosMap({ userLocation, onSelectLocation }: PosMapProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<PosLocation | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  
  // استعلام لجلب نقاط البيع
  const { data: posLocations, isLoading } = useQuery({
    queryKey: ['/api/pos-locations'],
    queryFn: async () => {
      // في بيئة حقيقية، سنجلب البيانات من الخادم
      // هذه بيانات مثالية للعرض
      return [
        {
          id: 'pos-001',
          name: 'صرافة الرياض الرقمية',
          address: 'شارع العليا، حي العليا',
          city: 'الرياض',
          coordinates: { lat: 24.7136, lng: 46.6753 },
          distance: 2.4,
          openNow: true,
          hours: '9:00 - 22:00',
          phone: '+966112345678',
          rating: 4.7,
          totalRatings: 128,
          paymentMethods: ['cash', 'card'],
          availableCurrencies: ['BTC', 'ETH', 'BNB', 'USDT'],
          kyc: 'basic',
          minAmount: 100,
          maxAmount: 5000,
          image: 'https://images.unsplash.com/photo-1521791055366-0d553872125f'
        },
        {
          id: 'pos-002',
          name: 'مركز كريبتو العربية',
          address: 'طريق الملك فهد، حي الورود',
          city: 'الرياض',
          coordinates: { lat: 24.7741, lng: 46.7388 },
          distance: 4.1,
          openNow: true,
          hours: '10:00 - 20:00',
          phone: '+966113456789',
          rating: 4.5,
          totalRatings: 72,
          paymentMethods: ['cash', 'card', 'bank_transfer'],
          availableCurrencies: ['BTC', 'ETH', 'SOL', 'ADA', 'MATIC'],
          kyc: 'full',
          minAmount: 500,
          maxAmount: 10000,
          image: 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa'
        },
        {
          id: 'pos-003',
          name: 'صرافة البلد للعملات الرقمية',
          address: 'شارع التحلية، حي السليمانية',
          city: 'جدة',
          coordinates: { lat: 21.5433, lng: 39.1728 },
          distance: 5.7,
          openNow: false,
          hours: '8:30 - 21:30',
          phone: '+966122345678',
          rating: 4.2,
          totalRatings: 95,
          paymentMethods: ['cash'],
          availableCurrencies: ['BTC', 'ETH', 'USDT', 'BNB'],
          kyc: 'none',
          minAmount: 50,
          maxAmount: 3000,
          image: 'https://images.unsplash.com/photo-1462206092226-f46025ffe607'
        },
        {
          id: 'pos-004',
          name: 'مركز المستقبل للعملات',
          address: 'طريق الملك عبدالعزيز، حي الخبر الشمالية',
          city: 'الخبر',
          coordinates: { lat: 26.2794, lng: 50.2083 },
          distance: 8.2,
          openNow: true,
          hours: '9:00 - 22:00',
          phone: '+966132345678',
          rating: 4.8,
          totalRatings: 63,
          paymentMethods: ['cash', 'card', 'bank_transfer'],
          availableCurrencies: ['BTC', 'ETH', 'SOL', 'DOGE', 'XRP'],
          kyc: 'full',
          minAmount: 200,
          maxAmount: 8000,
          image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e'
        },
        {
          id: 'pos-005',
          name: 'قصر العملات الرقمية',
          address: 'شارع الأمير محمد بن فهد، حي العزيزية',
          city: 'الدمام',
          coordinates: { lat: 26.4207, lng: 50.0887 },
          distance: 10.5,
          openNow: true,
          hours: '10:00 - 23:00',
          phone: '+966133456789',
          rating: 4.3,
          totalRatings: 47,
          paymentMethods: ['cash', 'card'],
          availableCurrencies: ['BTC', 'ETH', 'USDT', 'BNB'],
          kyc: 'basic',
          minAmount: 100,
          maxAmount: 5000,
          image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc'
        }
      ] as PosLocation[];
    }
  });
  
  // فلترة نقاط البيع بناءً على البحث
  const filteredLocations = posLocations?.filter(location => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      location.name.toLowerCase().includes(query) ||
      location.address.toLowerCase().includes(query) ||
      location.city.toLowerCase().includes(query) ||
      location.availableCurrencies.some(currency => currency.toLowerCase().includes(query))
    );
  });
  
  // ترتيب نقاط البيع حسب المسافة
  const sortedLocations = filteredLocations?.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  
  // محاكاة تحميل الخريطة
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // اختيار موقع نقطة البيع
  const handleSelectLocation = (location: PosLocation) => {
    setSelectedLocation(location);
    if (onSelectLocation) {
      onSelectLocation(location);
    }
  };
  
  // تنسيق طرق الدفع
  const renderPaymentMethods = (methods: Array<'cash' | 'card' | 'bank_transfer'>) => {
    return (
      <div className="flex gap-1">
        {methods.includes('cash') && (
          <Badge variant="outline" className="flex gap-1 items-center">
            <Banknote className="h-3 w-3" />
            <span>نقداً</span>
          </Badge>
        )}
        {methods.includes('card') && (
          <Badge variant="outline" className="flex gap-1 items-center">
            <CreditCard className="h-3 w-3" />
            <span>بطاقة</span>
          </Badge>
        )}
        {methods.includes('bank_transfer') && (
          <Badge variant="outline" className="flex gap-1 items-center">
            <Building className="h-3 w-3" />
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
        return <Badge variant="outline">بدون KYC</Badge>;
      case 'basic':
        return <Badge variant="secondary">KYC أساسي</Badge>;
      case 'full':
        return <Badge variant="default">KYC كامل</Badge>;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>نقاط بيع العملات الرقمية</span>
          <Badge variant="outline" className="gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span>{filteredLocations?.length || 0} موقع</span>
          </Badge>
        </CardTitle>
        <CardDescription>
          اعثر على أقرب نقطة بيع للعملات الرقمية لشراء وبيع العملات المشفرة نقداً
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="ابحث عن موقع، مدينة، أو عملة..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="rounded-md border h-64 relative overflow-hidden">
          {!mapLoaded ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full"></div>
            </div>
          ) : (
            <div className="bg-muted h-full w-full flex items-center justify-center relative">
              {/* في تطبيق حقيقي، ستكون هناك خريطة تفاعلية هنا */}
              {/* هذا مجرد نموذج للعرض */}
              <div className="absolute inset-0 text-center text-muted-foreground text-sm">
                الخريطة التفاعلية ستظهر هنا
              </div>
              
              {/* نقاط تمثل المواقع على الخريطة */}
              {sortedLocations?.map((location) => (
                <div
                  key={location.id}
                  className={`absolute w-4 h-4 rounded-full cursor-pointer transition-all ${
                    selectedLocation?.id === location.id
                      ? 'bg-primary scale-125 z-10'
                      : 'bg-primary/70 hover:scale-110'
                  }`}
                  style={{
                    // موقع تقريبي على الشاشة - في تطبيق حقيقي سيتم حسابه بناءً على الإحداثيات
                    left: `${30 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                  }}
                  onClick={() => handleSelectLocation(location)}
                  title={location.name}
                />
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-3 mt-4 max-h-80 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin h-8 w-8 border-t-2 border-primary rounded-full"></div>
            </div>
          ) : sortedLocations?.length === 0 ? (
            <Alert>
              <AlertTitle>لم يتم العثور على نتائج</AlertTitle>
              <AlertDescription>
                لم يتم العثور على نقاط بيع تطابق بحثك. جرب مصطلحات بحث مختلفة.
              </AlertDescription>
            </Alert>
          ) : (
            sortedLocations?.map((location) => (
              <div
                key={location.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-primary ${
                  selectedLocation?.id === location.id ? 'border-primary bg-primary/5' : ''
                }`}
                onClick={() => handleSelectLocation(location)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {location.name}
                      {location.openNow ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">مفتوح</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">مغلق</Badge>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {location.address}، {location.city}
                    </p>
                  </div>
                  <Badge variant="outline" className="flex gap-1 items-center">
                    <Navigation className="h-3.5 w-3.5" />
                    <span>{location.distance} كم</span>
                  </Badge>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{location.hours}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{location.phone}</span>
                  </div>
                </div>
                
                <div className="mt-3">
                  <h5 className="text-xs text-muted-foreground mb-1">العملات المتوفرة:</h5>
                  <div className="flex flex-wrap gap-1">
                    {location.availableCurrencies.map((currency) => (
                      <Badge key={currency} variant="secondary" className="text-xs">
                        {currency}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{location.rating}</span>
                    <span className="text-xs text-muted-foreground">({location.totalRatings})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {renderPaymentMethods(location.paymentMethods)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      
      {selectedLocation && (
        <CardFooter className="flex-col">
          <div className="w-full border-t pt-4 mt-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{selectedLocation.name}</h3>
              {renderKycLevel(selectedLocation.kyc)}
            </div>
            
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">الحد الأدنى: </span>
                <span className="font-medium">{selectedLocation.minAmount} ريال</span>
              </div>
              <div>
                <span className="text-muted-foreground">الحد الأقصى: </span>
                <span className="font-medium">{selectedLocation.maxAmount} ريال</span>
              </div>
              <div className="col-span-2 mt-1">
                <span className="text-muted-foreground">وثائق مطلوبة: </span>
                <span className="font-medium">
                  {selectedLocation.kyc === 'none' 
                    ? 'لا يوجد' 
                    : selectedLocation.kyc === 'basic'
                    ? 'هوية شخصية'
                    : 'هوية شخصية + إثبات عنوان'}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" size="sm">
                الاتجاهات
              </Button>
              <Button size="sm" className="gap-1.5">
                <Coins className="h-4 w-4" />
                حجز موعد للشراء
              </Button>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}