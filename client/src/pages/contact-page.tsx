import { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  MessageSquare, 
  Loader2, 
  Linkedin, 
  Twitter, 
  Youtube, 
  Globe,
  Link
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import rimLogo from "@assets/rim.png";

export default function ContactPage() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // قائمة مكاتب الشركة
  const offices = [
    {
      id: 1,
      city: "طرابلس",
      address: "شارع النصر، برج الأعمال، الطابق 15",
      phone: "+218 91 234 5678",
      email: "tripoli@rimtoken.com",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d107387.8381271539!2d13.1328713366254!3d32.87632075387826!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13a892eced68f435%3A0x11c5c53f7c70225d!2sTripoli%2C%20Libya!5e0!3m2!1sen!2suk!4v1716057043075!5m2!1sen!2suk"
    },
    {
      id: 2,
      city: "دبي",
      address: "مركز دبي المالي العالمي، برج الابتكار، الطابق 20",
      phone: "+971 4 123 4567",
      email: "dubai@rimtoken.com",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462560.68855700074!2d54.89781169550665!3d25.07599495007055!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2suk!4v1716057099841!5m2!1sen!2suk"
    },
    {
      id: 3,
      city: "لندن",
      address: "كناري وارف، مربع كندا، الطابق 30",
      phone: "+44 20 1234 5678",
      email: "london@rimtoken.com",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d317715.7119513112!2d-0.38178509316975245!3d51.52873520437193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C%20UK!5e0!3m2!1sen!2suk!4v1716057156452!5m2!1sen!2suk"
    },
    {
      id: 4,
      city: "نواكشوط",
      address: "شارع جمال عبد الناصر، مبنى بي ام سي، الطابق الرابع 04",
      phone: "+222 37968897",
      email: "hacentecno@gmail.com",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122623.66477886391!2d-16.068731221114785!3d18.112270921068143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xe9645404e8e386f%3A0x5cb561256d5b3aaa!2sNouakchott%2C%20Mauritania!5e0!3m2!1sen!2sus!4v1716396427731!5m2!1sen!2sus"
    }
  ];
  
  const [selectedOffice, setSelectedOffice] = useState(offices[0]);
  
  // قائمة مواضيع الاتصال
  const contactSubjects = [
    "استفسار عام",
    "دعم فني",
    "استفسار حول الحساب",
    "اقتراحات وملاحظات",
    "فرص العمل",
    "الشراكات والتعاون",
    "خدمات الشركات",
    "موضوع آخر"
  ];
  
  // إرسال رسالة الاتصال
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // التحقق من صحة البيانات
    if (!name || !email || !subject || !message) {
      toast({
        title: "خطأ في النموذج",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }
    
    // التحقق من صيغة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "خطأ في النموذج",
        description: "يرجى إدخال بريد إلكتروني صحيح",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // محاكاة لإرسال النموذج إلى API (في التطبيق الحقيقي سيتم إرسال طلب فعلي)
    setTimeout(() => {
      toast({
        title: "تم إرسال رسالتك بنجاح",
        description: "سنقوم بالرد عليك في أقرب وقت ممكن",
      });
      
      // إعادة تعيين النموذج
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <div className="bg-background text-foreground">
      {/* قسم العنوان الرئيسي */}
      <section className="py-12 bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
            <img src={rimLogo} alt="RimToken Logo" className="w-8 h-8 mr-2 rounded-full object-cover" />
            تواصل معنا
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            نحن دائمًا هنا للإجابة على استفساراتك ومساعدتك في أي وقت. يمكنك التواصل معنا عبر النموذج أدناه
            أو من خلال بيانات الاتصال المباشرة.
          </p>
        </div>
      </section>
      
      {/* قسم معلومات الاتصال والنموذج */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* نموذج الاتصال */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-6">
                <MessageSquare className="text-amber-500 w-6 h-6 mr-2" />
                <h2 className="text-2xl font-bold">أرسل لنا رسالة</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم الكامل <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="أدخل اسمك الكامل"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="أدخل بريدك الإلكتروني"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    الموضوع <span className="text-red-500">*</span>
                  </label>
                  <Select value={subject} onValueChange={setSubject}>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="اختر موضوع الرسالة" />
                    </SelectTrigger>
                    <SelectContent>
                      {contactSubjects.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    الرسالة <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="اكتب رسالتك هنا..."
                    className="min-h-32"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-amber-500 hover:bg-amber-600 py-3 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      إرسال
                    </>
                  )}
                </Button>
              </form>
            </div>
            
            {/* معلومات الاتصال */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">مكاتبنا</h2>
                <div className="flex space-x-4 mb-8">
                  {offices.map((office) => (
                    <button
                      key={office.id}
                      className={`py-2 px-4 rounded-lg ${
                        selectedOffice.id === office.id
                          ? "bg-amber-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setSelectedOffice(office)}
                    >
                      {office.city}
                    </button>
                  ))}
                </div>
                
                <div className="bg-slate-50 rounded-xl p-6 mb-6 shadow-sm">
                  <div className="flex items-start mb-4">
                    <MapPin className="text-amber-500 w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">{selectedOffice.city}</h3>
                      <p className="text-gray-600">{selectedOffice.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <Phone className="text-amber-500 w-5 h-5 mr-2 flex-shrink-0" />
                    <p>{selectedOffice.phone}</p>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="text-amber-500 w-5 h-5 mr-2 flex-shrink-0" />
                    <a href={`mailto:${selectedOffice.email}`} className="text-amber-600 hover:underline">
                      {selectedOffice.email}
                    </a>
                  </div>
                </div>
                
                <div className="rounded-xl overflow-hidden h-64 shadow-sm">
                  <iframe 
                    src={selectedOffice.mapUrl} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4">ساعات العمل</h2>
                  <div className="bg-slate-50 rounded-xl p-6 shadow-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold mb-2">أيام الأسبوع</h3>
                        <p className="text-gray-600">الاثنين - الجمعة</p>
                        <p className="font-medium">9:00 ص - 5:00 م</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">عطلة نهاية الأسبوع</h3>
                        <p className="text-gray-600">السبت</p>
                        <p className="font-medium">10:00 ص - 2:00 م</p>
                        <p className="text-gray-600 mt-2">الأحد</p>
                        <p className="font-medium">مغلق</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">الحسابات الاجتماعية</h2>
                  <div className="bg-slate-50 rounded-xl p-6 shadow-sm">
                    <ul className="space-y-4">
                      <li className="flex items-center">
                        <Linkedin className="h-5 w-5 text-blue-600 flex-shrink-0 mr-3" />
                        <a 
                          href="https://www.linkedin.com/in/rim-token" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline"
                        >
                          https://www.linkedin.com/in/rim-token
                        </a>
                      </li>
                      <li className="flex items-center">
                        <Twitter className="h-5 w-5 text-blue-400 flex-shrink-0 mr-3" />
                        <a 
                          href="https://x.com/rimtoken" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-700 hover:underline"
                        >
                          https://x.com/rimtoken
                        </a>
                      </li>
                      <li className="flex items-center">
                        <Youtube className="h-5 w-5 text-red-600 flex-shrink-0 mr-3" />
                        <a 
                          href="https://www.youtube.com/@Rimtoken" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-700 hover:underline"
                        >
                          https://www.youtube.com/@Rimtoken
                        </a>
                      </li>
                      <li className="flex items-center">
                        <svg 
                          className="h-5 w-5 text-orange-600 flex-shrink-0 mr-3" 
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.957 0 1.734.81 1.734 1.811 0 .716-.352 1.334-.895 1.669a1.91 1.91 0 0 1 .046.085c0 2.04-2.448 3.7-5.472 3.7-3.027 0-5.471-1.66-5.471-3.7l.003-.087a1.65 1.65 0 0 1-.895-1.67c0-1 .777-1.81 1.734-1.81.48 0 .909.184 1.217.493 1.185-.864 2.845-1.425 4.668-1.492l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12.25a1.25 1.25 0 1 0 2.498 0 1.25 1.25 0 0 0-2.498 0zm3.75 0a1.25 1.25 0 1 0 2.498 0 1.25 1.25 0 0 0-2.498 0z" />
                        </svg>
                        <a 
                          href="https://www.reddit.com/user/rimtoken" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-700 hover:underline"
                        >
                          https://www.reddit.com/user/rimtoken
                        </a>
                      </li>
                      <li className="flex items-center mt-4 pt-4 border-t">
                        <Globe className="h-5 w-5 text-amber-600 flex-shrink-0 mr-3" />
                        <a 
                          href="https://www.rimtoken.org" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-amber-600 hover:underline font-medium"
                        >
                          www.rimtoken.org
                        </a>
                      </li>
                      <li className="flex items-center">
                        <Link className="h-5 w-5 text-amber-600 flex-shrink-0 mr-3" />
                        <span className="text-gray-700">
                          الشركة: <strong>lmiml.ts</strong>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* قسم الأسئلة الشائعة */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">الأسئلة الشائعة</h2>
            <p className="mt-4 text-gray-600">
              إليك بعض الإجابات على الأسئلة الأكثر شيوعًا. إذا كان لديك المزيد من الأسئلة، فلا تتردد في التواصل معنا.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">كيف يمكنني إنشاء حساب في RimToken؟</h3>
              <p className="text-gray-600">
                يمكنك إنشاء حساب بسهولة من خلال النقر على "إنشاء حساب" في الصفحة الرئيسية
                واتباع الخطوات البسيطة لإكمال عملية التسجيل.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">ما هي العملات المدعومة في المنصة؟</h3>
              <p className="text-gray-600">
                تدعم منصة RimToken أكثر من 50 عملة رقمية، بما في ذلك Bitcoin و Ethereum و Solana وغيرها من العملات الرئيسية.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">كيف يمكنني سحب أموالي من المنصة؟</h3>
              <p className="text-gray-600">
                يمكنك سحب أموالك بسهولة من خلال الانتقال إلى قسم "المحفظة" واختيار "سحب"
                ثم اتباع التعليمات لإكمال عملية السحب.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">ما هي رسوم التداول في المنصة؟</h3>
              <p className="text-gray-600">
                تقدم RimToken رسوم تنافسية تبدأ من 0.1% على التداولات. يمكنك الاطلاع على كافة الرسوم
                في صفحة "الرسوم" على موقعنا.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <a 
              href="/faq" 
              className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center"
            >
              عرض جميع الأسئلة الشائعة
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}