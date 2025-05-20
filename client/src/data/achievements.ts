// نماذج لشارات الإنجاز في المحفظة

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  bgColor: string;
  condition: string; // وصف الشرط لتحقيق الإنجاز
  progress?: number; // التقدم نحو تحقيق الإنجاز (0-100)
  completed: boolean; // هل تم تحقيق الإنجاز؟
  completedAt?: Date; // تاريخ تحقيق الإنجاز
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum'; // مستوى الإنجاز
  points: number; // النقاط المكتسبة من الإنجاز
  category: 'transaction' | 'holding' | 'security' | 'referral' | 'loyalty' | 'education';
}

// قائمة الإنجازات المتاحة
export const achievementsList: Achievement[] = [
  {
    id: 'first-transaction',
    title: 'أول معاملة',
    description: 'قمت بإجراء أول معاملة في المحفظة',
    icon: 'Rocket',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-100',
    condition: 'إجراء أول معاملة',
    completed: false,
    points: 10,
    category: 'transaction'
  },
  {
    id: 'wallet-diversifier',
    title: 'مستثمر متنوع',
    description: 'امتلاك 5 عملات مشفرة مختلفة',
    icon: 'Layers',
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-100',
    condition: 'امتلاك 5 عملات مشفرة مختلفة',
    progress: 40, // 2 من 5
    completed: false,
    points: 20,
    category: 'holding'
  },
  {
    id: 'hodler',
    title: 'المستثمر الصبور',
    description: 'الاحتفاظ بعملة لمدة 30 يوماً متواصلة',
    icon: 'Clock',
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-100',
    condition: 'الاحتفاظ بعملة لمدة 30 يوماً متواصلة',
    progress: 70, // 21 من 30 يوم
    completed: false,
    points: 30,
    category: 'holding'
  },
  {
    id: 'security-master',
    title: 'خبير الأمان',
    description: 'تفعيل جميع ميزات الأمان في المحفظة',
    icon: 'Shield',
    iconColor: 'text-green-500',
    bgColor: 'bg-green-100',
    condition: 'تفعيل المصادقة الثنائية، واستعادة المفاتيح، وكلمة مرور قوية',
    progress: 67, // 2 من 3
    completed: false,
    points: 40,
    category: 'security'
  },
  {
    id: 'whale',
    title: 'الحوت',
    description: 'امتلاك أكثر من 10,000 دولار في المحفظة',
    icon: 'Anchor',
    iconColor: 'text-indigo-500',
    bgColor: 'bg-indigo-100',
    condition: 'امتلاك أكثر من 10,000 دولار في المحفظة',
    progress: 35, // 3,500 من 10,000
    completed: false,
    points: 50,
    category: 'holding'
  },
  {
    id: 'trading-pro',
    title: 'متداول محترف',
    description: 'إجراء 50 معاملة ناجحة',
    icon: 'BarChart',
    iconColor: 'text-red-500',
    bgColor: 'bg-red-100',
    condition: 'إجراء 50 معاملة ناجحة',
    progress: 24, // 12 من 50
    completed: false,
    points: 60,
    category: 'transaction'
  },
  {
    id: 'early-adopter',
    title: 'المستخدم المبكر',
    description: 'انضممت إلى RimToken خلال الشهر الأول من إطلاقها',
    icon: 'Star',
    iconColor: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
    condition: 'التسجيل خلال الشهر الأول من إطلاق المنصة',
    completed: true,
    completedAt: new Date('2024-08-15'),
    points: 100,
    tier: 'gold',
    category: 'loyalty'
  },
  {
    id: 'educator',
    title: 'المتعلم',
    description: 'أكملت جميع دروس التعليم في المنصة',
    icon: 'Lightbulb',
    iconColor: 'text-cyan-500',
    bgColor: 'bg-cyan-100',
    condition: 'إكمال جميع الدروس التعليمية',
    progress: 40, // 4 من 10
    completed: false,
    points: 30,
    category: 'education'
  },
  {
    id: 'referral-master',
    title: 'سفير RimToken',
    description: 'قمت بدعوة 5 أصدقاء للانضمام إلى المنصة',
    icon: 'Users',
    iconColor: 'text-pink-500',
    bgColor: 'bg-pink-100',
    condition: 'دعوة 5 أصدقاء للانضمام إلى المنصة',
    progress: 60, // 3 من 5
    completed: false,
    points: 50,
    category: 'referral'
  }
];

/**
 * استدعاء بيانات الإنجازات للمستخدم
 * في التطبيق الحقيقي، سيتم استدعاء هذه البيانات من الخادم
 */
export const fetchUserAchievements = (userId: number): Promise<Achievement[]> => {
  // محاكاة طلب API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(achievementsList);
    }, 500);
  });
};

/**
 * حساب النقاط الإجمالية للمستخدم
 */
export const calculateTotalPoints = (achievements: Achievement[]): number => {
  return achievements
    .filter(achievement => achievement.completed)
    .reduce((total, achievement) => total + achievement.points, 0);
};

/**
 * تحديد المستوى الحالي للمستخدم بناءً على النقاط
 */
export const calculateUserLevel = (points: number): number => {
  // كل 100 نقطة تزيد المستوى بمقدار 1
  return Math.floor(points / 100) + 1;
};

/**
 * الحصول على النقاط المطلوبة للمستوى التالي
 */
export const getNextLevelPoints = (currentLevel: number): number => {
  return currentLevel * 100;
};

/**
 * حساب نسبة التقدم نحو المستوى التالي
 */
export const calculateLevelProgress = (points: number): number => {
  const currentLevel = calculateUserLevel(points);
  const currentLevelMinPoints = (currentLevel - 1) * 100;
  const nextLevelPoints = currentLevel * 100;
  
  return ((points - currentLevelMinPoints) / (nextLevelPoints - currentLevelMinPoints)) * 100;
};