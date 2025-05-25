import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { dbStorage } from "./storage-db";

// تحديد نوع المستخدم المسترجع من قاعدة البيانات
interface UserRecord {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // تكوين الجلسة مع استخدام مخزن PostgreSQL
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "RimToken-secure-secret-key",
    resave: false,
    saveUninitialized: false,
    store: dbStorage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 يوم
      secure: process.env.NODE_ENV === "production"
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // تكوين استراتيجية المصادقة المحلية
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await dbStorage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    })
  );

  // تسلسل وإلغاء تسلسل المستخدم (للحفظ في الجلسة)
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await dbStorage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // مسارات المصادقة

  // تسجيل مستخدم جديد
  app.post("/api/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      // التحقق من وجود المستخدم
      const existingUser = await dbStorage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: "اسم المستخدم موجود بالفعل" 
        });
      }

      // تشفير كلمة المرور وإنشاء المستخدم
      const hashedPassword = await hashPassword(req.body.password);
      const user = await dbStorage.createUser({
        ...req.body,
        password: hashedPassword,
      });

      // تسجيل الدخول التلقائي بعد التسجيل
      req.login(user, (err) => {
        if (err) return next(err);
        // إرجاع بيانات المستخدم بدون كلمة المرور
        const { password, ...safeUser } = user;
        return res.status(201).json({ 
          success: true, 
          user: safeUser 
        });
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ 
        success: false, 
        message: "خطأ في تسجيل المستخدم" 
      });
    }
  });

  // تسجيل الدخول
  app.post("/api/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", (err: any, user: UserRecord, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: info?.message || "فشل تسجيل الدخول" 
        });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        // إرجاع بيانات المستخدم بدون كلمة المرور
        const { password, ...safeUser } = user;
        return res.json({ 
          success: true, 
          user: safeUser 
        });
      });
    })(req, res, next);
  });

  // تسجيل الخروج
  app.post("/api/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: "خطأ في تسجيل الخروج" 
        });
      }
      res.json({ success: true });
    });
  });

  // الحصول على معلومات المستخدم الحالي
  app.get("/api/user", (req: Request, res: Response) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        success: false, 
        message: "غير مصرح" 
      });
    }
    // إرجاع بيانات المستخدم بدون كلمة المرور
    const user = req.user as UserRecord;
    const { password, ...safeUser } = user;
    res.json({ 
      success: true, 
      user: safeUser 
    });
  });
}