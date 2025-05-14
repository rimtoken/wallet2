import { useState, useEffect, useCallback, useRef } from 'react';

// إعادة تعريف أنواع واجهة التعرف على الكلام للتوافق مع TypeScript
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognition extends EventTarget {
  grammars: any;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onnomatch: ((event: Event) => void) | null;
  onerror: ((event: Event) => void) | null;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onaudiostart: ((event: Event) => void) | null;
  onaudioend: ((event: Event) => void) | null;
  onsoundstart: ((event: Event) => void) | null;
  onsoundend: ((event: Event) => void) | null;
  onspeechstart: ((event: Event) => void) | null;
  onspeechend: ((event: Event) => void) | null;
}

// إعلان عالمي لجعل TypeScript يتعرف على الواجهات البرمجية للمتصفح
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

/**
 * هوك لاستخدام التعرف على الكلام في التطبيق
 * @param language لغة التعرف على الكلام، الافتراضية هي العربية
 * @param continuous إذا كان التعرف مستمراً أم يتوقف بعد نتيجة واحدة
 */
export function useSpeechRecognition({
  language = 'ar-SA',
  continuous = false,
}: {
  language?: string;
  continuous?: boolean;
} = {}) {
  // حالة التعرف على الكلام
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  // استخدام مرجع لكائن التعرف على الكلام لتجنب إعادة الإنشاء
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // إعادة إنشاء كائن التعرف عند تغيير اللغة
  useEffect(() => {
    // إذا كان هناك جلسة استماع نشطة، أعد تشغيلها بعد تحديث اللغة
    const wasListening = isListening;
    
    // إيقاف الجلسة الحالية إذا كانت نشطة
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    
    // إعادة تعيين كائن التعرف على الكلام
    recognitionRef.current = null;
    
    // التنظيف
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [language, isListening]);

  // إنشاء كائن التعرف على الكلام
  const initRecognition = useCallback(() => {
    if (recognitionRef.current) return recognitionRef.current;

    // التحقق من دعم المتصفح
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      setError('متصفحك لا يدعم التعرف على الكلام');
      return null;
    }

    // إنشاء كائن التعرف على الكلام
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = language;
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // معالجة أحداث التعرف على الكلام
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.resultIndex];
      const transcript = result[0].transcript;
      setTranscript(transcript);
    };

    recognition.onerror = (event: any) => {
      setError(`خطأ في التعرف على الكلام: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    return recognition;
  }, [language, continuous]);

  // بدء الاستماع
  const startListening = useCallback(() => {
    setError(null);
    const recognition = initRecognition();
    
    if (!recognition) return;
    
    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      setError('حدث خطأ أثناء بدء الاستماع');
      setIsListening(false);
    }
  }, [initRecognition]);

  // إيقاف الاستماع
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  // تنظيف المرجع عند إزالة المكون
  useEffect(() => {
    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    error,
    isSupported,
  };
}