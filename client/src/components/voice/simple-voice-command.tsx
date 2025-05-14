import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// نوع الخاصيات للمكون
interface SimpleVoiceCommandProps {
  onAddWidget: (type: string, size: string) => void;
  onRemoveWidget: (widgetId: string) => void;
  onResetWidgets: () => void;
  widgetIds: string[];
}

/**
 * مكون مبسط للأوامر الصوتية للتحكم في لوحة المعلومات
 */
export function SimpleVoiceCommand({
  onAddWidget,
  onRemoveWidget,
  onResetWidgets,
  widgetIds,
}: SimpleVoiceCommandProps) {
  // حالة الاستماع والعرض
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('ar-SA');
  
  // إعداد نظام التنبيهات
  const { toast } = useToast();
  
  // مرجع لكائن التعرف على الكلام
  const [recognition, setRecognition] = useState<any>(null);
  
  // إعداد التعرف على الكلام عند تحميل المكون
  useEffect(() => {
    // التحقق من دعم المتصفح
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      console.error("Web Speech API is not supported in this browser");
      return;
    }
    
    console.log("Initializing speech recognition");
    
    // إنشاء كائن التعرف على الكلام
    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = selectedLanguage;
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true;
    recognitionInstance.maxAlternatives = 1;
    
    // معالجة الأحداث
    recognitionInstance.onresult = (event: any) => {
      // استخراج النص من نتائج التعرف على الكلام
      const result = event.results[event.resultIndex];
      const text = result[0].transcript;
      
      // تحديث النص المعروض
      setTranscript(text);
      
      console.log("Speech recognition result:", text, "Final:", result.isFinal);
      
      // معالجة الأمر الصوتي فقط إذا كانت النتيجة نهائية
      if (result.isFinal) {
        handleVoiceCommand(text);
      }
    };
    
    recognitionInstance.onerror = (event: any) => {
      setErrorMsg(`خطأ: ${event.error}`);
      setIsListening(false);
    };
    
    recognitionInstance.onend = () => {
      setIsListening(false);
    };
    
    setRecognition(recognitionInstance);
    
    // تنظيف عند إزالة المكون
    return () => {
      if (recognitionInstance && isListening) {
        recognitionInstance.stop();
      }
    };
  }, []);
  
  // بدء الاستماع - Start listening
  const startListening = () => {
    if (!recognition) return;
    
    setErrorMsg(null);
    setTranscript('');
    
    try {
      recognition.start();
      setIsListening(true);
      
      // Show notification in the selected language
      toast({
        title: selectedLanguage === 'ar-SA' ? 'جاري الاستماع...' : 'Listening...',
        description: selectedLanguage === 'ar-SA' 
          ? 'تحدث الآن لإعطاء أمر صوتي' 
          : 'Speak now to give a voice command',
      });
      
      console.log("Started listening in", selectedLanguage);
    } catch (err) {
      const errorMsg = selectedLanguage === 'ar-SA'
        ? 'حدث خطأ أثناء بدء الاستماع'
        : 'Error starting speech recognition';
        
      setErrorMsg(errorMsg);
      setIsListening(false);
      console.error("Error starting speech recognition:", err);
    }
  };
  
  // إيقاف الاستماع - Stop listening
  const stopListening = () => {
    if (!recognition) return;
    
    recognition.stop();
    setIsListening(false);
    console.log("Stopped listening");
  };
  
  // معالجة الأمر الصوتي
  const handleVoiceCommand = (command: string) => {
    if (!command) return;
    
    const normalizedCommand = command.trim().toLowerCase();
    
    // تسجيل الأمر في وحدة التحكم للتصحيح
    console.log("Voice command received:", normalizedCommand, "Language:", selectedLanguage);
    
    toast({
      title: selectedLanguage.startsWith('ar') ? 'تم التعرف على الأمر' : 'Command recognized',
      description: normalizedCommand,
    });
    
    // Check language for correct command processing
    const isArabic = selectedLanguage.startsWith('ar');
    
    // أمر إضافة عنصر - Add widget command
    if ((isArabic && (normalizedCommand.includes('أضف') || normalizedCommand.includes('إضافة'))) || 
        (!isArabic && (normalizedCommand.includes('add') || normalizedCommand.includes('create')))) {
      // تحديد نوع العنصر - Determine widget type
      let widgetType = '';
      
      // Arabic widget type keywords
      if (isArabic) {
        if (normalizedCommand.includes('ملخص') || normalizedCommand.includes('محفظة')) {
          widgetType = 'portfolio-summary';
        } else if (normalizedCommand.includes('مخطط')) {
          widgetType = 'portfolio-chart';
        } else if (normalizedCommand.includes('أصول') || normalizedCommand.includes('عملات')) {
          widgetType = 'asset-list';
        } else if (normalizedCommand.includes('معاملات') || normalizedCommand.includes('تحويلات')) {
          widgetType = 'transaction-history';
        } else if (normalizedCommand.includes('سوق') || normalizedCommand.includes('أسعار')) {
          widgetType = 'market-overview';
        } else if (normalizedCommand.includes('أخبار') || normalizedCommand.includes('تحديثات')) {
          widgetType = 'news-feed';
        } else if (normalizedCommand.includes('تنبيهات') || normalizedCommand.includes('إشعارات')) {
          widgetType = 'price-alerts';
        }
      } 
      // English widget type keywords
      else {
        if (normalizedCommand.includes('summary') || normalizedCommand.includes('portfolio')) {
          widgetType = 'portfolio-summary';
        } else if (normalizedCommand.includes('chart') || normalizedCommand.includes('graph')) {
          widgetType = 'portfolio-chart';
        } else if (normalizedCommand.includes('asset') || normalizedCommand.includes('coin')) {
          widgetType = 'asset-list';
        } else if (normalizedCommand.includes('transaction') || normalizedCommand.includes('transfer')) {
          widgetType = 'transaction-history';
        } else if (normalizedCommand.includes('market') || normalizedCommand.includes('price')) {
          widgetType = 'market-overview';
        } else if (normalizedCommand.includes('news') || normalizedCommand.includes('update')) {
          widgetType = 'news-feed';
        } else if (normalizedCommand.includes('alert') || normalizedCommand.includes('notification')) {
          widgetType = 'price-alerts';
        }
      }
      
      // تحديد حجم العنصر - Determine widget size
      let widgetSize = 'medium';
      
      // Arabic size keywords
      if (isArabic) {
        if (normalizedCommand.includes('صغير')) {
          widgetSize = 'small';
        } else if (normalizedCommand.includes('متوسط')) {
          widgetSize = 'medium';
        } else if (normalizedCommand.includes('كبير')) {
          widgetSize = 'large';
        } else if (normalizedCommand.includes('كامل')) {
          widgetSize = 'full';
        }
      } 
      // English size keywords
      else {
        if (normalizedCommand.includes('small')) {
          widgetSize = 'small';
        } else if (normalizedCommand.includes('medium')) {
          widgetSize = 'medium';
        } else if (normalizedCommand.includes('large') || normalizedCommand.includes('big')) {
          widgetSize = 'large';
        } else if (normalizedCommand.includes('full')) {
          widgetSize = 'full';
        }
      }
      
      // إضافة العنصر إذا تم تحديد النوع
      if (widgetType) {
        onAddWidget(widgetType, widgetSize);
        toast({
          title: isArabic ? 'تم إضافة عنصر جديد' : 'Widget added',
          description: isArabic 
            ? `تم إضافة ${widgetType} بحجم ${widgetSize}`
            : `Added ${widgetType} widget with ${widgetSize} size`,
        });
      } else {
        toast({
          title: isArabic ? 'لم يتم التعرف على نوع العنصر' : 'Widget type not recognized',
          description: isArabic 
            ? 'يرجى تحديد نوع العنصر مثل "ملخص" أو "مخطط" أو "أصول"'
            : 'Please specify widget type like "summary", "chart", or "assets"',
          variant: 'destructive',
        });
      }
    }
    
    // أمر حذف عنصر - Remove widget command
    else if ((isArabic && (normalizedCommand.includes('احذف') || normalizedCommand.includes('إزالة'))) || 
             (!isArabic && (normalizedCommand.includes('remove') || normalizedCommand.includes('delete')))) {
      // استخراج رقم العنصر - Extract widget number
      const match = normalizedCommand.match(/\d+/);
      if (match) {
        const index = parseInt(match[0]) - 1; // تحويل إلى فهرس يبدأ من 0
        if (index >= 0 && index < widgetIds.length) {
          const widgetId = widgetIds[index];
          onRemoveWidget(widgetId);
          toast({
            title: isArabic ? 'تم حذف العنصر' : 'Widget removed',
            description: isArabic 
              ? `تم حذف العنصر رقم ${index + 1}`
              : `Removed widget number ${index + 1}`,
          });
        } else {
          toast({
            title: isArabic ? 'رقم العنصر غير صالح' : 'Invalid widget number',
            description: isArabic
              ? `يرجى تحديد رقم بين 1 و ${widgetIds.length}`
              : `Please specify a number between 1 and ${widgetIds.length}`,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: isArabic ? 'لم يتم تحديد رقم العنصر' : 'Widget number not specified',
          description: isArabic
            ? 'يرجى ذكر رقم العنصر الذي تريد حذفه'
            : 'Please specify the widget number you want to remove',
          variant: 'destructive',
        });
      }
    }
    
    // أمر إعادة تعيين لوحة المعلومات - Reset dashboard command
    else if (
      (isArabic && (
        normalizedCommand.includes('إعادة تعيين') ||
        normalizedCommand.includes('تعيين افتراضي') ||
        normalizedCommand.includes('افتراضي')
      )) || 
      (!isArabic && (
        normalizedCommand.includes('reset') || 
        normalizedCommand.includes('default') ||
        normalizedCommand.includes('clear')
      ))
    ) {
      onResetWidgets();
      toast({
        title: isArabic ? 'تم إعادة تعيين لوحة المعلومات' : 'Dashboard reset',
        description: isArabic
          ? 'تم إعادة تعيين لوحة المعلومات إلى الإعدادات الافتراضية'
          : 'Dashboard has been reset to default settings',
      });
    }
    
    // أمر المساعدة - Help command
    else if (
      (isArabic && (
        normalizedCommand.includes('مساعدة') ||
        normalizedCommand.includes('المساعدة') ||
        normalizedCommand.includes('ساعدني')
      )) || 
      (!isArabic && (
        normalizedCommand.includes('help') || 
        normalizedCommand.includes('assist') ||
        normalizedCommand.includes('commands')
      ))
    ) {
      toast({
        title: isArabic ? 'الأوامر الصوتية المتاحة' : 'Available voice commands',
        description: isArabic
          ? 'أضف [نوع العنصر] [الحجم]: لإضافة عنصر جديد\n' +
            'احذف [رقم العنصر]: لحذف عنصر\n' +
            'إعادة تعيين: لإعادة تعيين لوحة المعلومات'
          : 'Add [widget type] [size]: to add a new widget\n' +
            'Remove [widget number]: to delete a widget\n' +
            'Reset: to reset the dashboard to defaults',
        duration: 10000,
      });
    }
    
    // أمر غير معروف - Unknown command
    else {
      toast({
        title: isArabic ? 'أمر غير معروف' : 'Unknown command',
        description: isArabic
          ? 'لم يتم التعرف على الأمر. جرب "مساعدة" للحصول على قائمة بالأوامر المتاحة'
          : 'Command not recognized. Try "help" to get a list of available commands',
        variant: 'destructive',
      });
    }
  };
  
  // عرض أي أخطاء عند ظهورها - Display errors when they occur
  useEffect(() => {
    if (errorMsg) {
      toast({
        title: selectedLanguage === 'ar-SA' 
          ? 'خطأ في التعرف على الكلام' 
          : 'Speech recognition error',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  }, [errorMsg, toast, selectedLanguage]);
  
  // إذا كان المتصفح لا يدعم التعرف على الكلام - Browser doesn't support speech recognition
  if (!isSupported) {
    return (
      <div className="p-2 bg-red-100 text-red-700 rounded-md text-sm">
        {selectedLanguage === 'ar-SA' 
          ? 'متصفحك لا يدعم التعرف على الكلام. يرجى استخدام متصفح آخر مثل Chrome أو Edge.'
          : 'Your browser does not support speech recognition. Please use a different browser like Chrome or Edge.'
        }
      </div>
    );
  }
  
  // تغيير اللغة
  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    
    // إذا كان هناك كائن تعرف نشط، تحديث اللغة فيه
    if (recognition) {
      recognition.lang = value;
      console.log("Updated recognition language to:", value);
      
      // إشعار المستخدم
      toast({
        title: 'تم تغيير اللغة',
        description: value === 'ar-SA' ? 'تم التحويل إلى العربية' : 'Switched to English',
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isListening ? 'default' : 'outline'}
                size="icon"
                onClick={isListening ? stopListening : startListening}
                className={isListening ? 'bg-red-500 hover:bg-red-600' : ''}
                aria-label={isListening ? 'إيقاف الاستماع' : 'بدء الاستماع'}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isListening ? 'إيقاف الاستماع' : 'بدء الاستماع للأوامر الصوتية'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center gap-1">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Select
            value={selectedLanguage}
            onValueChange={handleLanguageChange}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SelectTrigger className="w-[90px] h-8 px-2">
                    <SelectValue placeholder={selectedLanguage === 'ar-SA' ? 'اللغة' : 'Language'} />
                  </SelectTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{selectedLanguage === 'ar-SA' ? 'تغيير لغة التعرف الصوتي' : 'Change speech recognition language'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <SelectContent>
              <SelectItem value="ar-SA">العربية</SelectItem>
              <SelectItem value="en-US">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isListening && (
        <div className="flex items-center gap-2 text-xs bg-muted/80 px-3 py-1.5 rounded-md">
          <Volume2 className="h-3 w-3 animate-pulse text-red-500" />
          <span className="font-medium">
            {selectedLanguage === 'ar-SA' ? 'جاري الاستماع...' : 'Listening...'}
          </span>
        </div>
      )}
      
      {transcript && (
        <div className="flex-1 text-xs bg-muted/40 px-3 py-1.5 rounded-md max-w-[300px] sm:max-w-none truncate">
          <span className="font-medium">
            {selectedLanguage === 'ar-SA' ? 'تم التعرف: ' : 'Recognized: '}
          </span>
          <span className="opacity-80">{transcript}</span>
        </div>
      )}
    </div>
  );
}