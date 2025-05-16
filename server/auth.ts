import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { users, type User } from "@shared/schema";
import createMemoryStore from "memorystore";
import { storage } from "./storage";

// إنشاء كائن التخزين المؤقت في الذاكرة للجلسات
const MemoryStore = createMemoryStore(session);

// تهيئة دالة تشفير كلمة المرور
const scryptAsync = promisify(scrypt);

// تشفير كلمة المرور
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// مقارنة كلمة المرور المدخلة مع المخزنة
async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // إعدادات الجلسة
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "rimtoken-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // إعداد استراتيجية المصادقة المحلية
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);

        if (!user) {
          return done(null, false, { message: "اسم المستخدم غير موجود" });
        }

        const passwordsMatch = await comparePasswords(password, user.password);
        if (!passwordsMatch) {
          return done(null, false, { message: "كلمة المرور غير صحيحة" });
        }

        return done(null, user);
      } catch (error) {
        console.error("خطأ في المصادقة:", error);
        return done(error);
      }
    }),
  );

  // تسلسل المستخدم (للتخزين في الجلسة)
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // فك تسلسل المستخدم (للاسترجاع من الجلسة)
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      
      if (!user) {
        return done(null, false);
      }
      
      // إزالة كلمة المرور من الكائن المُرجع للعميل
      const { password, ...userWithoutPassword } = user;
      
      done(null, userWithoutPassword);
    } catch (error) {
      done(error);
    }
  });

  // واجهة برمجة التطبيقات للتسجيل
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      // التحقق من أن المستخدم ليس موجوداً بالفعل
      const existingUser = await storage.getUserByUsername(req.body.username);

      if (existingUser) {
        return res.status(400).json({ message: "اسم المستخدم مستخدم بالفعل" });
      }

      // إنشاء مستخدم جديد مع تشفير كلمة المرور
      const hashedPassword = await hashPassword(req.body.password);
      
      const newUser = await storage.createUser({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      // إزالة كلمة المرور من الكائن المُرجع
      const { password, ...userWithoutPassword } = newUser;

      // تسجيل الدخول تلقائياً بعد التسجيل
      req.login(newUser, (err) => {
        if (err) {
          console.error("خطأ في تسجيل الدخول بعد التسجيل:", err);
          return res.status(500).json({ message: "حدث خطأ أثناء تسجيل الدخول بعد التسجيل" });
        }
        
        res.status(201).json(userWithoutPassword);
      });
    } catch (error: any) {
      console.error("خطأ في التسجيل:", error);
      res.status(500).json({ message: "حدث خطأ أثناء التسجيل: " + (error.message || "خطأ غير معروف") });
    }
  });

  // واجهة برمجة التطبيقات لتسجيل الدخول
  app.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: any, user: User, info: any) => {
      if (err) {
        console.error("خطأ في تسجيل الدخول:", err);
        return res.status(500).json({ message: "حدث خطأ أثناء تسجيل الدخول" });
      }
      
      if (!user) {
        return res.status(401).json({ message: info?.message || "بيانات الاعتماد غير صحيحة" });
      }
      
      req.login(user, (err) => {
        if (err) {
          console.error("خطأ في تسجيل الدخول:", err);
          return res.status(500).json({ message: "حدث خطأ أثناء تسجيل الدخول" });
        }
        
        // إزالة كلمة المرور من الكائن المُرجع
        const { password, ...userWithoutPassword } = user;
        
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  // واجهة برمجة التطبيقات لتسجيل الخروج
  app.post("/api/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        console.error("خطأ في تسجيل الخروج:", err);
        return res.status(500).json({ message: "حدث خطأ أثناء تسجيل الخروج" });
      }
      
      res.status(200).json({ message: "تم تسجيل الخروج بنجاح" });
    });
  });

  // واجهة برمجة التطبيقات للحصول على معلومات المستخدم الحالي
  app.get("/api/user", (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
      res.status(200).json(req.user);
    } else {
      res.status(401).json({ message: "غير مصرح" });
    }
  });
}