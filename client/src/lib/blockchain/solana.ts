import * as web3 from '@solana/web3.js';
import { BlockchainProvider } from './index';
import solanaIcon from '@/assets/icons/solana.svg';

// استخدم شبكة التطوير لسولانا (Devnet)
const connection = new web3.Connection(web3.clusterApiUrl('devnet'));

// إنشاء محفظة جديدة
export const createWallet = async (): Promise<{ address: string; privateKey: string }> => {
  const keyPair = web3.Keypair.generate();
  const privateKey = Buffer.from(keyPair.secretKey).toString('hex');
  
  return {
    address: keyPair.publicKey.toString(),
    privateKey
  };
};

// استيراد محفظة باستخدام المفتاح الخاص
export const importWallet = async (privateKey: string): Promise<{ address: string; privateKey: string }> => {
  try {
    const secretKey = new Uint8Array(Buffer.from(privateKey, 'hex'));
    const keyPair = web3.Keypair.fromSecretKey(secretKey);
    
    return {
      address: keyPair.publicKey.toString(),
      privateKey
    };
  } catch (error) {
    throw new Error('المفتاح الخاص غير صالح');
  }
};

// الحصول على الرصيد
export const getBalance = async (address: string): Promise<number> => {
  try {
    const publicKey = new web3.PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    // تحويل من lamports إلى SOL
    return balance / web3.LAMPORTS_PER_SOL;
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
    const secretKey = new Uint8Array(Buffer.from(privateKey, 'hex'));
    const fromKeypair = web3.Keypair.fromSecretKey(secretKey);
    const toPublicKey = new web3.PublicKey(toAddress);
    
    const transaction = new web3.Transaction().add(
      web3.SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports: amount * web3.LAMPORTS_PER_SOL
      })
    );
    
    // إرسال المعاملة
    const signature = await web3.sendAndConfirmTransaction(
      connection,
      transaction,
      [fromKeypair]
    );
    
    return signature;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw new Error('فشل في إرسال المعاملة');
  }
};

// التحقق من صحة العنوان
export const validateAddress = (address: string): boolean => {
  try {
    new web3.PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
};

// الحصول على سجل المعاملات
export const getTransactionHistory = async (address: string): Promise<any[]> => {
  try {
    const publicKey = new web3.PublicKey(address);
    const signatures = await connection.getSignaturesForAddress(publicKey);
    
    return signatures.map(sig => ({
      signature: sig.signature,
      slot: sig.slot,
      err: sig.err,
      memo: sig.memo,
      blockTime: sig.blockTime,
    }));
  } catch (error) {
    console.error('Error getting transaction history:', error);
    return [];
  }
};

export const provider: BlockchainProvider = {
  name: 'Solana',
  logo: solanaIcon,
  shortName: 'SOL',
  coinSymbol: 'SOL',
  createWallet,
  importWallet,
  getBalance,
  getTransactionHistory,
  sendTransaction,
  validateAddress
};