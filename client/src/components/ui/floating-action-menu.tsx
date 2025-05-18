import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import {
  Wallet,
  ArrowLeftRight,
  PlusCircle,
  Settings,
  Clock,
  ChevronUp,
  Bell,
  BarChart2,
  BellRing,
} from 'lucide-react';

interface FloatingActionItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href: string;
  color: string;
}

interface FloatingActionMenuProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function FloatingActionMenu({ position = 'bottom-right' }: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems: FloatingActionItem[] = [
    {
      id: 'wallet',
      icon: <Wallet className="h-5 w-5" />,
      label: 'المحفظة',
      href: '/wallet',
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      id: 'swap',
      icon: <ArrowLeftRight className="h-5 w-5" />,
      label: 'تبادل',
      href: '/swap',
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      id: 'deposit',
      icon: <PlusCircle className="h-5 w-5" />,
      label: 'إيداع',
      href: '/deposit',
      color: 'bg-amber-500 hover:bg-amber-600',
    },
    {
      id: 'history',
      icon: <Clock className="h-5 w-5" />,
      label: 'السجل',
      href: '/transactions',
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      id: 'alerts',
      icon: <BellRing className="h-5 w-5" />,
      label: 'تنبيهات',
      href: '/price-alerts',
      color: 'bg-red-500 hover:bg-red-600',
    },
    {
      id: 'markets',
      icon: <BarChart2 className="h-5 w-5" />,
      label: 'الأسواق',
      href: '/markets',
      color: 'bg-indigo-500 hover:bg-indigo-600',
    },
  ];

  // تحديد موضع القائمة بناءً على الخاصية المستلمة
  const getPositionClasses = () => {
    switch(position) {
      case 'bottom-right':
        return 'bottom-6 right-6';
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  // تحديد اتجاه ظهور القائمة
  const isVerticalReverse = position === 'top-right' || position === 'top-left';

  return (
    <div className={`fixed ${getPositionClasses()} z-50`}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: isVerticalReverse ? -20 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: isVerticalReverse ? -20 : 20 }}
            transition={{ duration: 0.2 }}
            className={`${isVerticalReverse ? 'mb-0 mt-4' : 'mb-4 mt-0'} space-y-3`}
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: position.includes('left') ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: position.includes('left') ? -20 : 20 }}
                transition={{ delay: 0.05 * index }}
                className={`flex items-center ${position.includes('left') ? 'justify-start' : 'justify-end'}`}
              >
                {position.includes('left') ? (
                  // مكونات القائمة في الجانب الأيسر
                  <>
                    <Link href={item.href}>
                      <motion.button
                        whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(0,0,0,0.3)' }}
                        whileTap={{ scale: 0.9 }}
                        className={`${item.color} w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200`}
                      >
                        {item.icon}
                      </motion.button>
                    </Link>
                    <div className="ml-2 bg-white px-2 py-1 rounded-md shadow-md border border-gray-100 text-sm whitespace-nowrap">
                      {item.label}
                    </div>
                  </>
                ) : (
                  // مكونات القائمة في الجانب الأيمن
                  <>
                    <div className="mr-2 bg-white px-2 py-1 rounded-md shadow-md border border-gray-100 text-sm whitespace-nowrap">
                      {item.label}
                    </div>
                    <Link href={item.href}>
                      <motion.button
                        whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(0,0,0,0.3)' }}
                        whileTap={{ scale: 0.9 }}
                        className={`${item.color} w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200`}
                      >
                        {item.icon}
                      </motion.button>
                    </Link>
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
        className={`${
          isOpen ? 'bg-gray-700' : 'bg-gradient-to-r from-amber-500 to-yellow-500'
        } w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-colors`}
      >
        {isOpen ? (
          <ChevronUp className="h-6 w-6" />
        ) : (
          <PlusCircle className="h-6 w-6" />
        )}
      </motion.button>
    </div>
  );
}