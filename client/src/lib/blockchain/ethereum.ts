import { ethers } from 'ethers';
import { BlockchainProvider } from './index';
import ethereumIcon from '@/assets/icons/ethereum.svg';

// استخدم Infura للاتصال بشبكة Ethereum
// سنستخدم INFURA_API_KEY إذا كان موجودًا في بيئة التشغيل
const INFURA_API_KEY = import.meta.env.VITE_INFURA_API_KEY || 'YOUR_INFURA_KEY';

const mainProvider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`);
const testProvider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);

// نستخدم شبكة الاختبار للتطوير
const activeProvider = testProvider;

// إنشاء محفظة جديدة
export const createWallet = async (): Promise<{ address: string; privateKey: string }> => {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey
  };
};

// استيراد محفظة باستخدام المفتاح الخاص
export const importWallet = async (privateKey: string): Promise<{ address: string; privateKey: string }> => {
  try {
    const wallet = new ethers.Wallet(privateKey, activeProvider);
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
    const balance = await activeProvider.getBalance(address);
    // تحويل من wei إلى ether
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
    const wallet = new ethers.Wallet(privateKey, activeProvider);
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
// ملاحظة: في بيئة الإنتاج، ينبغي استخدام API مثل Etherscan للحصول على السجل الكامل
export const getTransactionHistory = async (address: string): Promise<any[]> => {
  // هذه الدالة تحتاج إلى API خارجي مثل Etherscan للحصول على سجل المعاملات الكامل
  // لغرض التطوير، سنعود ببيانات فارغة
  return [];
};

export const provider: BlockchainProvider = {
  name: 'Ethereum',
  logo: ethereumIcon,
  shortName: 'ETH',
  coinSymbol: 'ETH',
  createWallet,
  importWallet,
  getBalance,
  getTransactionHistory,
  sendTransaction,
  validateAddress
};