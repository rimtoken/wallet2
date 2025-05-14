FROM node:20-alpine

WORKDIR /app

# نسخ ملفات تكوين المشروع
COPY package*.json ./
COPY tsconfig.json ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY vite.config.ts ./
COPY drizzle.config.ts ./

# تثبيت الاعتمادات
RUN npm ci

# نسخ بقية ملفات المشروع
COPY . .

# بناء التطبيق
RUN npm run build

# كشف المنفذ الذي سيستمع عليه التطبيق
EXPOSE 5000

# أمر بدء تشغيل التطبيق
CMD ["node", "dist/index.js"]