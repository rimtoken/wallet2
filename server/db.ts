import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// للاتصال بقاعدة البيانات في بيئة الويب، نحتاج إلى إعداد طريقة الاتصال
neonConfig.webSocketConstructor = ws;

// التحقق من وجود رابط لقاعدة البيانات
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// إنشاء تجمع اتصالات بقاعدة البيانات
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// إنشاء عميل Drizzle مع الاتصال بقاعدة البيانات والمخطط
export const db = drizzle({ client: pool, schema });