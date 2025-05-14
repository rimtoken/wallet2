import { useEffect, useState } from 'react';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// نوع الخاصيات للمكون
interface VoiceCommandListenerProps {
  onAddWidget: (type: string, size: string) => void;
  onRemoveWidget: (widgetId: string) => void;
  onResetWidgets: () => void;
  widgetIds: string[];
}

/**
 * مكون يستمع للأوامر الصوتية ويترجمها إلى إجراءات
 */
export function VoiceCommandListener({
  onAddWidget,
  onRemoveWidget,
  onResetWidgets,
  widgetIds,
}: VoiceCommandListenerProps) {
  // استخدام هوك التعرف على الكلام
  const { isListening, transcript, startListening, stopListening, error, isSupported } =
    useSpeechRecognition({
      language: selectedLanguage, // استخدام اللغة المحددة
      continuous: false, // التوقف بعد التعرف على أمر واحد
    });

  // إعدادات اللغة والوضع التجريبي
  const [debugMode, setDebugMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ar-SA');
  
  // إعداد نظام التنبيهات
  const { toast } = useToast();
  
  // حالة نص الأمر المعترف به
  const [recognizedCommand, setRecognizedCommand] = useState('');
  
  // توفير الوصول للمطورين لتفعيل وضع التصحيح عبر المتصفح
  useEffect(() => {
    // إضافة كائن عام للوصول في وحدة تحكم المتصفح للاختبار
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__voiceCommandDebug = {
      enableDebugMode: () => setDebugMode(true),
      disableDebugMode: () => setDebugMode(false),
      setLanguage: (lang: string) => setSelectedLanguage(lang)
    };
    
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (window as any).__voiceCommandDebug;
    };
  }, []);

  // قائمة باللغات المتاحة للتجربة
  const availableLanguages = [
    { code: 'ar-SA', name: 'العربية' },
    { code: 'en-US', name: 'الإنجليزية (أمريكا)' },
    { code: 'fr-FR', name: 'الفرنسية' },
    { code: 'es-ES', name: 'الإسبانية' },
  ];

  // عرض أي أخطاء في التعرف على الكلام
  useEffect(() => {
    if (error) {
      toast({
        title: 'خطأ في التعرف على الكلام',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // إظهار حالة الاستماع
  useEffect(() => {
    if (isListening) {
      toast({
        title: 'جاري الاستماع...',
        description: 'تحدث الآن لإعطاء أمر صوتي',
      });
    }
  }, [isListening, toast]);

  // معالجة الأمر الصوتي عند تغير النص
  useEffect(() => {
    if (!transcript || transcript === recognizedCommand) return;
    
    setRecognizedCommand(transcript);
    
    // تحليل الأمر الصوتي
    const command = transcript.trim().toLowerCase();
    
    // عرض الأمر المتعرف عليه
    toast({
      title: 'تم التعرف على الأمر',
      description: command,
    });
    
    // تحديد اللغة المستخدمة (العربية أو الإنجليزية)
    const isArabic = selectedLanguage.startsWith('ar');
    const isEnglish = selectedLanguage.startsWith('en');
    
    // معالجة الأوامر المختلفة حسب اللغة
    
    // أمر إضافة عنصر
    if (
      // أوامر باللغة العربية
      (isArabic && (command.includes('أضف') || command.includes('إضافة'))) ||
      // أوامر باللغة الإنجليزية
      (isEnglish && (command.includes('add') || command.includes('create')))
    ) {
      // تحديد نوع العنصر
      let widgetType = '';
      
      // العربية: تحديد نوع العنصر
      if (isArabic) {
        if (command.includes('ملخص') || command.includes('محفظة')) {
          widgetType = 'portfolio-summary';
        } else if (command.includes('مخطط')) {
          widgetType = 'portfolio-chart';
        } else if (command.includes('أصول') || command.includes('عملات')) {
          widgetType = 'asset-list';
        } else if (command.includes('معاملات') || command.includes('تحويلات')) {
          widgetType = 'transaction-history';
        } else if (command.includes('سوق') || command.includes('أسعار')) {
          widgetType = 'market-overview';
        } else if (command.includes('أخبار') || command.includes('تحديثات')) {
          widgetType = 'news-feed';
        } else if (command.includes('تنبيهات') || command.includes('إشعارات')) {
          widgetType = 'price-alerts';
        }
      }
      
      // الإنجليزية: تحديد نوع العنصر
      if (isEnglish) {
        if (command.includes('summary') || command.includes('portfolio')) {
          widgetType = 'portfolio-summary';
        } else if (command.includes('chart') || command.includes('graph')) {
          widgetType = 'portfolio-chart';
        } else if (command.includes('assets') || command.includes('coins')) {
          widgetType = 'asset-list';
        } else if (command.includes('transaction') || command.includes('history')) {
          widgetType = 'transaction-history';
        } else if (command.includes('market') || command.includes('prices')) {
          widgetType = 'market-overview';
        } else if (command.includes('news') || command.includes('updates')) {
          widgetType = 'news-feed';
        } else if (command.includes('alerts') || command.includes('notifications')) {
          widgetType = 'price-alerts';
        }
      }
      
      // تحديد حجم العنصر
      let widgetSize = 'medium';
      
      // العربية: تحديد حجم العنصر
      if (isArabic) {
        if (command.includes('صغير')) {
          widgetSize = 'small';
        } else if (command.includes('متوسط')) {
          widgetSize = 'medium';
        } else if (command.includes('كبير')) {
          widgetSize = 'large';
        } else if (command.includes('كامل')) {
          widgetSize = 'full';
        }
      }
      
      // الإنجليزية: تحديد حجم العنصر
      if (isEnglish) {
        if (command.includes('small')) {
          widgetSize = 'small';
        } else if (command.includes('medium')) {
          widgetSize = 'medium';
        } else if (command.includes('large')) {
          widgetSize = 'large';
        } else if (command.includes('full')) {
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
            : `Added ${widgetType} with ${widgetSize} size`,
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
    
    // أمر حذف عنصر
    else if (
      // أوامر باللغة العربية
      (isArabic && (command.includes('احذف') || command.includes('إزالة'))) ||
      // أوامر باللغة الإنجليزية
      (isEnglish && (command.includes('remove') || command.includes('delete')))
    ) {
      // استخراج رقم العنصر
      const match = command.match(/\d+/);
      if (match) {
        const index = parseInt(match[0]) - 1; // تحويل إلى فهرس يبدأ من 0
        if (index >= 0 && index < widgetIds.length) {
          const widgetId = widgetIds[index];
          onRemoveWidget(widgetId);
          toast({
            title: isArabic ? 'تم حذف العنصر' : 'Widget removed',
            description: isArabic
              ? `تم حذف العنصر رقم ${index + 1}`
              : `Removed widget #${index + 1}`,
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
    
    // أمر إعادة تعيين لوحة المعلومات
    else if (
      // أوامر باللغة العربية
      (isArabic && (
        command.includes('إعادة تعيين') ||
        command.includes('تعيين افتراضي') ||
        command.includes('افتراضي')
      )) ||
      // أوامر باللغة الإنجليزية
      (isEnglish && (
        command.includes('reset') ||
        command.includes('default') ||
        command.includes('restore default')
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
    
    // أمر المساعدة
    else if (
      // أوامر باللغة العربية
      (isArabic && (
        command.includes('مساعدة') ||
        command.includes('المساعدة') ||
        command.includes('ساعدني')
      )) ||
      // أوامر باللغة الإنجليزية
      (isEnglish && (
        command.includes('help') ||
        command.includes('assist') ||
        command.includes('commands')
      ))
    ) {
      toast({
        title: isArabic ? 'الأوامر الصوتية المتاحة' : 'Available voice commands',
        description: isArabic
          ? 'أضف [نوع العنصر] [الحجم]: لإضافة عنصر جديد\n' +
            'احذف [رقم العنصر]: لحذف عنصر\n' +
            'إعادة تعيين: لإعادة تعيين لوحة المعلومات'
          : 'Add [widget type] [size]: to add a new widget\n' +
            'Remove [widget number]: to remove a widget\n' +
            'Reset: to reset dashboard to default',
        duration: 10000,
      });
    }
    
    // أمر غير معروف
    else {
      toast({
        title: isArabic ? 'أمر غير معروف' : 'Unknown command',
        description: isArabic
          ? 'لم يتم التعرف على الأمر. جرب "مساعدة" للحصول على قائمة بالأوامر المتاحة'
          : 'Command not recognized. Try "help" for a list of available commands',
        variant: 'destructive',
      });
    }
    
  }, [transcript, recognizedCommand, onAddWidget, onRemoveWidget, onResetWidgets, widgetIds, toast]);

  // إذا كان المتصفح لا يدعم التعرف على الكلام
  if (!isSupported) {
    return (
      <div className="p-2 bg-red-100 text-red-700 rounded-md text-sm">
        متصفحك لا يدعم التعرف على الكلام. يرجى استخدام متصفح آخر مثل Chrome أو Edge.
      </div>
    );
  }

  return (
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

      {isListening && (
        <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-md">
          <Volume2 className="h-3 w-3 animate-pulse text-primary" />
          <span>جاري الاستماع...</span>
        </div>
      )}

      {/* وضع التصحيح (مخفي عادة، يمكن تفعيله لاختبار لغات مختلفة) */}
      {debugMode && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 ml-4 p-2 bg-muted/50 rounded-md text-xs">
          <div className="flex items-center gap-2">
            <span>اللغة:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="border rounded px-2 py-1 text-xs"
              aria-label="اختر لغة التعرف الصوتي"
            >
              {availableLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span>الأمر:</span>
            <code className="bg-background px-2 py-1 rounded">
              {transcript || "..."}
            </code>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 px-2 text-xs" 
            onClick={() => setDebugMode(false)}
          >
            إخفاء وضع التطوير
          </Button>
        </div>
      )}
    </div>
  );
}