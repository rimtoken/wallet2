// استيراد العناصر الأساسية التي تحتاج إلى polyfills في بيئة المتصفح
// هذا يساعد في جعل مكتبات Node.js مثل ethers و web3.js تعمل في بيئة المتصفح

import { Buffer } from 'buffer';

// إضافة Buffer إلى الكائن العام window لاستخدامه مع مكتبات مثل ethers
declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

// Export global Buffer for browser environment
export { Buffer };