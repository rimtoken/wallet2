import React, { useState, useEffect } from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star, Clock } from "lucide-react";

// تعريف نوع نقطة البيع
export interface PosLocation {
  id: number;
  name: string;
  address: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distance?: string;
  isOpen: boolean;
  rating: number;
  openHours: string;
  phone: string;
  supportedCurrencies: string[];
  kycRequired: boolean;
  paymentMethods: string[];
  image?: string;
}

interface PosMapProps {
  onSelectLocation: (location: PosLocation) => void;
}

export function PosMap({ onSelectLocation }: PosMapProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<PosLocation[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('all');
  
  const mockLocations: PosLocation[] = [
    {
      id: 1,
      name: "RimToken Exchange - الرياض",
      address: "شارع العليا، برج المملكة، الدور 20",
      city: "الرياض",
      coordinates: { lat: 24.7136, lng: 46.6753 },
      distance: "1.2 كم",
      isOpen: true,
      rating: 4.8,
      openHours: "9:00 صباحاً - 9:00 مساءً",
      phone: "+966 11 123 4567",
      supportedCurrencies: ["BTC", "ETH", "SOL", "BNB"],
      kycRequired: true,
      paymentMethods: ["نقدي", "بطاقة ائتمان", "تحويل بنكي"]
    },
    {
      id: 2,
      name: "Crypto Hub - جدة",
      address: "شارع التحلية، مركز الأندلس مول",
      city: "جدة",
      coordinates: { lat: 21.5433, lng: 39.1728 },
      distance: "3.5 كم",
      isOpen: true,
      rating: 4.5,
      openHours: "10:00 صباحاً - 10:00 مساءً",
      phone: "+966 12 345 6789",
      supportedCurrencies: ["BTC", "ETH", "USDT"],
      kycRequired: true,
      paymentMethods: ["نقدي", "تحويل بنكي"]
    },
    {
      id: 3,
      name: "Blockchain Point - الدمام",
      address: "شارع الأمير محمد، الدمام",
      city: "الدمام",
      coordinates: { lat: 26.4173, lng: 50.0911 },
      distance: "5.0 كم",
      isOpen: false,
      rating: 4.2,
      openHours: "9:00 صباحاً - 8:00 مساءً",
      phone: "+966 13 456 7890",
      supportedCurrencies: ["BTC", "ETH", "BNB", "DOGE"],
      kycRequired: false,
      paymentMethods: ["نقدي", "بطاقة ائتمان"]
    },
    {
      id: 4,
      name: "CryptoCoin Exchange - المدينة المنورة",
      address: "شارع قباء، المدينة المنورة",
      city: "المدينة المنورة",
      coordinates: { lat: 24.4672, lng: 39.6151 },
      distance: "2.8 كم",
      isOpen: true,
      rating: 4.0,
      openHours: "8:30 صباحاً - 7:30 مساءً",
      phone: "+966 14 567 8901",
      supportedCurrencies: ["BTC", "ETH"],
      kycRequired: true,
      paymentMethods: ["نقدي", "تحويل بنكي"]
    },
    {
      id: 5,
      name: "Digital Assets Shop - مكة المكرمة",
      address: "شارع إبراهيم الخليل، مكة المكرمة",
      city: "مكة المكرمة",
      coordinates: { lat: 21.4225, lng: 39.8262 },
      distance: "4.1 كم",
      isOpen: true,
      rating: 4.6,
      openHours: "9:00 صباحاً - 11:00 مساءً",
      phone: "+966 15 678 9012",
      supportedCurrencies: ["BTC", "ETH", "SOL", "BNB", "XRP"],
      kycRequired: true,
      paymentMethods: ["نقدي", "بطاقة ائتمان", "تحويل بنكي"]
    }
  ];
  
  // فلترة نقاط البيع حسب معايير البحث
  useEffect(() => {
    let filtered = mockLocations;
    
    if (searchQuery) {
      filtered = filtered.filter(location => 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.supportedCurrencies.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (selectedCity !== 'all') {
      filtered = filtered.filter(location => location.city === selectedCity);
    }
    
    if (selectedCurrency !== 'all') {
      filtered = filtered.filter(location => 
        location.supportedCurrencies.includes(selectedCurrency)
      );
    }
    
    setFilteredLocations(filtered);
  }, [searchQuery, selectedCity, selectedCurrency]);
  
  // جلب المدن المتاحة
  const uniqueCities = mockLocations.reduce((acc: string[], loc) => {
    if (!acc.includes(loc.city)) {
      acc.push(loc.city);
    }
    return acc;
  }, []);
  const cities = ['all', ...uniqueCities];
  
  // جلب العملات المتاحة
  const uniqueCurrencies = mockLocations.reduce((acc: string[], loc) => {
    loc.supportedCurrencies.forEach(currency => {
      if (!acc.includes(currency)) {
        acc.push(currency);
      }
    });
    return acc;
  }, []);
  const currencies = ['all', ...uniqueCurrencies];
  
  return (
    <div className="space-y-6 rtl">
      {/* صندوق البحث وخيارات الفلترة */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>ابحث عن نقاط البيع</CardTitle>
          <CardDescription>
            ابحث بالاسم أو العنوان أو المدينة أو العملة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن نقاط البيع..."
                className="pr-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">المدينة</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="all">جميع المدن</option>
                  {cities.filter(c => c !== 'all').map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">العملة</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                >
                  <option value="all">جميع العملات</option>
                  {currencies.filter(c => c !== 'all').map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* خريطة نقاط البيع */}
      <Card>
        <CardContent className="pt-6">
          <div 
            className="w-full h-[300px] bg-slate-200 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden"
            style={{ 
              backgroundImage: "url('https://maps.googleapis.com/maps/api/staticmap?center=24.774265,46.738586&zoom=5&size=600x300&scale=2&maptype=roadmap&markers=color:red|24.7136,46.6753|21.5433,39.1728|26.4173,50.0911|24.4672,39.6151|21.4225,39.8262&key=YOUR_GOOGLE_MAPS_API_KEY')",
              backgroundPosition: 'center',
              backgroundSize: 'cover'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <p className="text-white bg-black bg-opacity-70 px-4 py-2 rounded-lg">
                خريطة تفاعلية لنقاط البيع
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* قائمة نقاط البيع */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">نقاط البيع المتاحة ({filteredLocations.length})</h3>
        
        {filteredLocations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">لا توجد نقاط بيع تطابق معايير البحث</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredLocations.map((location) => (
              <Card 
                key={location.id} 
                className="cursor-pointer hover:border-primary transition-all duration-200"
                onClick={() => onSelectLocation(location)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{location.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 ml-1" />
                        <span>{location.address}</span>
                        {location.distance && (
                          <Badge variant="outline" className="mr-2">{location.distance}</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center mb-3">
                        <div className="flex items-center ml-4">
                          <Star className="h-4 w-4 text-yellow-500 ml-1" />
                          <span>{location.rating}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 ml-1" />
                          <span className={location.isOpen ? 'text-green-500' : 'text-red-500'}>
                            {location.isOpen ? 'مفتوح الآن' : 'مغلق'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {location.supportedCurrencies.map((currency) => (
                          <Badge key={currency} variant="outline">{currency}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="ml-4 hidden md:block">
                      <Button onClick={() => onSelectLocation(location)}>
                        عرض التفاصيل
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}