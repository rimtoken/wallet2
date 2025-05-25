import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./App";
import "./index.css";
// استيراد الـpolyfills الضرورية لاستخدام مكتبات Web3
import './lib/polyfills';
// استيراد خدمة تهيئة Capacitor للتطبيق الجوال
import { initializeCapacitor } from "./services/capacitor-service";

// تهيئة Capacitor للميزات الأصلية للجوال
if (typeof window !== 'undefined') {
  // تأكد من أن الكود يعمل فقط في بيئة المتصفح
  initializeCapacitor().catch(console.error);
}

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class">
    <App />
  </ThemeProvider>
);
