import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Smartphone, 
  Download, 
  Shield, 
  Zap,
  QrCode,
  Fingerprint,
  Bell,
  Globe,
  Star,
  Users,
  Trophy,
  Wifi
} from 'lucide-react';

interface AppFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface DownloadLink {
  platform: string;
  icon: string;
  url: string;
  version: string;
  size: string;
}

export default function MobileWalletPage() {
  const { toast } = useToast();
  const [deviceType, setDeviceType] = useState<string>('');

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent;
    if (/android/i.test(userAgent)) {
      setDeviceType('android');
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      setDeviceType('ios');
    } else {
      setDeviceType('desktop');
    }
  }, []);

  const appFeatures: AppFeature[] = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "أمان متطور",
      description: "حماية المحفظة ببصمة الإصبع والتشفير المتقدم",
      color: "text-blue-600"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "معاملات سريعة",
      description: "إرسال واستقبال العملات المشفرة في ثوانٍ",
      color: "text-yellow-600"
    },
    {
      icon: <QrCode className="h-6 w-6" />,
      title: "مسح QR",
      description: "مسح رموز QR للدفع السريع والآمن",
      color: "text-green-600"
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "تنبيهات فورية",
      description: "إشعارات فورية لجميع المعاملات والأسعار",
      color: "text-purple-600"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "دعم متعدد الشبكات",
      description: "Ethereum, BSC, Polygon, Solana في تطبيق واحد",
      color: "text-indigo-600"
    },
    {
      icon: <Fingerprint className="h-6 w-6" />,
      title: "مصادقة حيوية",
      description: "حماية إضافية ببصمة الإصبع والوجه",
      color: "text-red-600"
    }
  ];

  const downloadLinks: DownloadLink[] = [
    {
      platform: 'Android',
      icon: '🤖',
      url: 'https://play.google.com/store/apps/details?id=com.rimtoken.wallet',
      version: 'v2.1.0',
      size: '45 MB'
    },
    {
      platform: 'iOS',
      icon: '🍎',
      url: 'https://apps.apple.com/app/rimtoken-wallet/id123456789',
      version: 'v2.1.0',
      size: '52 MB'
    },
    {
      platform: 'APK مباشر',
      icon: '📱',
      url: 'https://rimtoken.org/download/rimtoken-wallet.apk',
      version: 'v2.1.0',
      size: '45 MB'
    }
  ];

  const handleDownload = (platform: string, url: string) => {
    // In a real app, this would handle the actual download
    toast({
      title: "جاري التحميل...",
      description: `بدء تحميل تطبيق RimToken لـ ${platform}`,
    });
    
    // Simulate download
    setTimeout(() => {
      toast({
        title: "تم التحميل!",
        description: "يمكنك الآن تثبيت التطبيق على جهازك",
      });
    }, 2000);
  };

  const generateQRCode = () => {
    toast({
      title: "رمز QR",
      description: "تم إنشاء رمز QR للتحميل السريع",
    });
  };

  const sendSMSLink = () => {
    toast({
      title: "تم الإرسال",
      description: "تم إرسال رابط التحميل إلى هاتفك",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Smartphone className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold">محفظة RimToken المحمولة</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            احمل محفظتك المشفرة معك أينما ذهبت. أمان متطور، سهولة استخدام، وميزات قوية في راحة يدك.
          </p>
          
          <div className="flex justify-center gap-6 pt-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">4.8/5 تقييم</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="font-medium">+100K مستخدم</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-500" />
              <span className="font-medium">محفظة العام</span>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">حمّل التطبيق الآن</CardTitle>
            <CardDescription className="text-lg">
              متوفر على جميع الأجهزة والمنصات
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {downloadLinks.map((link) => (
                <Card key={link.platform} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="text-4xl">{link.icon}</div>
                    <div>
                      <h3 className="font-bold text-lg">{link.platform}</h3>
                      <p className="text-sm text-muted-foreground">
                        {link.version} • {link.size}
                      </p>
                    </div>
                    <Button 
                      className="w-full"
                      onClick={() => handleDownload(link.platform, link.url)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      تحميل
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Button variant="outline" onClick={generateQRCode}>
                <QrCode className="h-4 w-4 mr-2" />
                رمز QR للتحميل
              </Button>
              <Button variant="outline" onClick={sendSMSLink}>
                <Smartphone className="h-4 w-4 mr-2" />
                إرسال رابط SMS
              </Button>
            </div>

            {deviceType !== 'desktop' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-yellow-800 mb-2">
                  <Wifi className="h-4 w-4" />
                  <span className="font-medium">تم اكتشاف جهاز محمول</span>
                </div>
                <p className="text-yellow-700 text-sm">
                  يبدو أنك تستخدم جهاز {deviceType === 'android' ? 'أندرويد' : 'iOS'}. 
                  يمكنك تحميل التطبيق مباشرة!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">مميزات التطبيق</h2>
            <p className="text-muted-foreground">
              كل ما تحتاجه لإدارة عملاتك المشفرة بأمان وسهولة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`${feature.color} mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Screenshots Section */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">شاهد التطبيق في العمل</CardTitle>
            <CardDescription>
              واجهة سهلة وأنيقة مصممة للمستخدم العربي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Mock screenshots */}
              <div className="bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg aspect-[9/16] flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Smartphone className="h-8 w-8 mx-auto text-blue-600" />
                  <p className="text-sm font-medium">الشاشة الرئيسية</p>
                </div>
              </div>
              <div className="bg-gradient-to-b from-green-100 to-green-200 rounded-lg aspect-[9/16] flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Zap className="h-8 w-8 mx-auto text-green-600" />
                  <p className="text-sm font-medium">الإرسال السريع</p>
                </div>
              </div>
              <div className="bg-gradient-to-b from-purple-100 to-purple-200 rounded-lg aspect-[9/16] flex items-center justify-center">
                <div className="text-center space-y-2">
                  <QrCode className="h-8 w-8 mx-auto text-purple-600" />
                  <p className="text-sm font-medium">ماسح QR</p>
                </div>
              </div>
              <div className="bg-gradient-to-b from-orange-100 to-orange-200 rounded-lg aspect-[9/16] flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Shield className="h-8 w-8 mx-auto text-orange-600" />
                  <p className="text-sm font-medium">الأمان</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">ماذا يقول المستخدمون</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">
                  "أفضل محفظة استخدمتها. سهلة وآمنة جداً!"
                </p>
                <p className="font-medium">أحمد محمد</p>
              </div>
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">
                  "التطبيق سريع جداً والواجهة جميلة ومفهومة"
                </p>
                <p className="font-medium">فاطمة علي</p>
              </div>
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">
                  "دعم ممتاز للغة العربية وخدمة عملاء رائعة"
                </p>
                <p className="font-medium">خالد السعودي</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-3xl font-bold">ابدأ رحلتك مع العملات المشفرة</h2>
            <p className="text-blue-100 text-lg">
              انضم إلى آلاف المستخدمين الذين يثقون في RimToken لإدارة أصولهم الرقمية
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Button size="lg" variant="secondary">
                <Download className="h-5 w-5 mr-2" />
                حمّل الآن
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                تعلم المزيد
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}