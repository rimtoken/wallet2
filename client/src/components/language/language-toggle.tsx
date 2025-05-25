import { Globe } from "lucide-react";
import { useLanguage, Language, LANGUAGES } from "@/contexts/language-context";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export function LanguageToggle() {
  const { language, setLanguage, languageInfo } = useLanguage();

  // تنفيذ تغيير الاتجاه بشكل أوتوماتيكي مع تغيير اللغة
  const handleLanguageChange = (code: Language) => {
    // تطبيق التغيير
    setLanguage(code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
          <Globe className="h-5 w-5" />
          <span className="sr-only">
            {language === 'ar' ? 'تغيير اللغة' : 
             language === 'en' ? 'Change language' : 
             'Changer de langue'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(LANGUAGES).map(([code, langInfo]) => (
          <DropdownMenuItem 
            key={code}
            onClick={() => handleLanguageChange(code as Language)}
            className={language === code ? "bg-accent" : ""}
          >
            <span className={language === 'ar' ? 'ml-2' : 'mr-2'}>
              {code.toUpperCase()}
            </span>
            <span>{langInfo.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}