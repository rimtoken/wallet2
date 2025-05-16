import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// التحقق من وجود رابط لقاعدة البيانات
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// إنشاء تجمع اتصالات بقاعدة البيانات باستخدام متغيرات البيئة
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// إنشاء عميل Drizzle مع الاتصال بقاعدة البيانات والمخطط
export const db = drizzle(pool, { schema });