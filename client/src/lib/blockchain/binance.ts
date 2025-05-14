import { ethers } from 'ethers';
import { BlockchainProvider } from './index';
import binanceIcon from '@/assets/icons/binance.svg';

// نظرًا لطبيعة شبكة بينانس والتغييرات المتكررة في واجهة برمجة التطبيقات الخاصة بها
// سنستخدم مكتبة ethers.js بدلاً من ذلك لأن شبكة بينانس سمارت تشين متوافقة مع إيثيريوم

// استخدم شبكة بينانس تيستنت
const BSC_RPC_URL = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
const bscProvider = new ethers.JsonRpcProvider(BSC_RPC_URL);

// إنشاء محفظة جديدة
export const createWallet = async (): Promise<{ address: string; privateKey: string }> => {
  // إنشاء مفتاح خاص جديد
  const wallet = ethers.Wallet.createRandom();
  
  return {
    address: wallet.address,
    privateKey: wallet.privateKey
  };
};

// استيراد محفظة باستخدام المفتاح الخاص
export const importWallet = async (privateKey: string): Promise<{ address: string; privateKey: string }> => {
  try {
    const wallet = new ethers.Wallet(privateKey, bscProvider);
    
    return {
      address: wallet.address,
      privateKey: wallet.privateKey
    };
  } catch (error) {
    throw new Error('المفتاح الخاص غير صالح');
  }
};

// الحصول على الرصيد
export const getBalance = async (address: string): Promise<number> => {
  try {
    const balance = await bscProvider.getBalance(address);
    // تحويل من wei إلى BNB
    return Number(ethers.formatEther(balance));
  } catch (error) {
    console.error('Error getting balance:', error);
    return 0;
  }
};

// إرسال معاملة
export const sendTransaction = async (
  privateKey: string,
  toAddress: string,
  amount: number
): Promise<string> => {
  try {
    const wallet = new ethers.Wallet(privateKey, bscProvider);
    const tx = await wallet.sendTransaction({
      to: toAddress,
      value: ethers.parseEther(amount.toString())
    });
    
    return tx.hash;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw new Error('فشل في إرسال المعاملة');
  }
};

// التحقق من صحة العنوان
export const validateAddress = (address: string): boolean => {
  return ethers.isAddress(address);
};

// الحصول على سجل المعاملات
export const getTransactionHistory = async (address: string): Promise<any[]> => {
  try {
    // في بيئة الإنتاج، ينبغي استخدام API مثل BSCScan للحصول على السجل الكامل
    // لغرض التطوير، سنعود ببيانات فارغة
    return [];
  } catch (error) {
    console.error('Error getting transaction history:', error);
    return [];
  }
};

export const bscBlockchainProvider: BlockchainProvider = {
  name: 'Binance Smart Chain',
  logo: binanceIcon,
  shortName: 'BSC',
  coinSymbol: 'BNB',
  createWallet,
  importWallet,
  getBalance,
  getTransactionHistory,
  sendTransaction,
  validateAddress
};

// تصدير المزود بالاسم المتوقع في ملف index.ts
export const provider = bscBlockchainProvider;