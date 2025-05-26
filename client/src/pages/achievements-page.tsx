import { useState } from "react";
import { ArrowLeft, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import AchievementBadges from "@/components/achievements/achievement-badges";

export default function AchievementsPage() {
  const [, setLocation] = useLocation();
  const [language, setLanguage] = useState<'en' | 'ar' | 'fr'>('en');

  const getText = (key: string) => {
    const texts = {
      back: language === 'ar' ? 'رجوع' : language === 'fr' ? 'Retour' : 'Back',
      achievements: language === 'ar' ? 'الإنجازات' : language === 'fr' ? 'Réalisations' : 'Achievements',
      subtitle: language === 'ar' ? 'اكتشف واحصل على شارات مختلفة من خلال استخدام ريم توكن' : 
                language === 'fr' ? 'Découvrez et gagnez différents badges en utilisant RimToken' : 
                'Discover and earn different badges by using RimToken',
    };
    return texts[key] || key;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/modern-wallet')}
                className="text-slate-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {getText('back')}
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{getText('achievements')}</h1>
                  <p className="text-sm text-slate-400">{getText('subtitle')}</p>
                </div>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Button
                variant={language === 'en' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('en')}
                className="text-xs"
              >
                EN
              </Button>
              <Button
                variant={language === 'ar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('ar')}
                className="text-xs"
              >
                العربية
              </Button>
              <Button
                variant={language === 'fr' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLanguage('fr')}
                className="text-xs"
              >
                FR
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AchievementBadges language={language} />
      </div>
    </div>
  );
}