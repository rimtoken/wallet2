import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { dbStorage as storage } from "./storage-db";
import axios from "axios";
import { z } from "zod";
import { insertTransactionSchema, insertUserSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Users
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.safeParse(req.body);
      if (!userData.success) {
        return res.status(400).json({ message: fromZodError(userData.error).message });
      }
      
      // Check if user exists
      const existingUser = await storage.getUserByUsername(userData.data.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData.data);
      return res.status(201).json({ id: user.id, username: user.username, email: user.email });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.json({ id: user.id, username: user.username, email: user.email });
  });

  // Assets
  app.get("/api/assets", async (_req: Request, res: Response) => {
    const assets = await storage.getAssets();
    return res.json(assets);
  });

  // Wallet
  app.get("/api/wallets/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const walletAssets = await storage.getWalletAssets(userId);
    return res.json(walletAssets);
  });

  // Transactions
  app.get("/api/transactions/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    const transactions = await storage.getTransactionsByUserId(userId, limit);
    
    // Enrich transactions with asset details
    const enrichedTransactions = await Promise.all(
      transactions.map(async (tx) => {
        const asset = await storage.getAssetById(tx.assetId);
        return {
          ...tx,
          asset: asset ? {
            symbol: asset.symbol,
            name: asset.name,
            icon: asset.icon
          } : undefined
        };
      })
    );
    
    return res.json(enrichedTransactions);
  });

  app.post("/api/transactions", async (req: Request, res: Response) => {
    try {
      const transactionData = insertTransactionSchema.safeParse(req.body);
      if (!transactionData.success) {
        return res.status(400).json({ message: fromZodError(transactionData.error).message });
      }
      
      const transaction = await storage.createTransaction(transactionData.data);
      return res.status(201).json(transaction);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  });

  // Portfolio
  app.get("/api/portfolio/:userId", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const portfolioSummary = await storage.getPortfolioSummary(userId);
    return res.json(portfolioSummary);
  });

  app.get("/api/portfolio/:userId/history", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    
    const history = await storage.getPortfolioHistory(userId, days);
    return res.json(history);
  });

  // Market Data
  app.get("/api/market", async (_req: Request, res: Response) => {
    const marketData = await storage.getMarketData();
    return res.json(marketData);
  });

  // CoinGecko API for latest crypto prices
  app.get("/api/market/refresh", async (_req: Request, res: Response) => {
    try {
      // Get current assets to update
      const assets = await storage.getAssets();
      const symbols = assets.map(a => a.symbol.toLowerCase()).join(',');
      
      // Call CoinGecko API (public endpoint, no API key needed)
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,usd-coin,solana,dogecoin,binancecoin&vs_currencies=usd&include_24hr_change=true`
      );
      
      const coinMap: Record<string, string> = {
        'bitcoin': 'BTC',
        'ethereum': 'ETH',
        'usd-coin': 'USDC',
        'solana': 'SOL',
        'dogecoin': 'DOGE',
        'binancecoin': 'BNB'
      };
      
      const updates = [];
      
      // Process each asset and update its price
      for (const [coinId, data] of Object.entries(response.data)) {
        const symbol = coinMap[coinId];
        if (!symbol) continue;
        
        const asset = assets.find(a => a.symbol === symbol);
        if (!asset) continue;
        
        const priceData = data as { usd: number, usd_24h_change: number };
        
        // Update the asset price in storage
        updates.push(
          storage.updateAssetPrice(
            asset.id,
            priceData.usd.toString(),
            priceData.usd_24h_change.toString()
          )
        );
        
        // Also add to market data
        updates.push(
          storage.updateMarketData({
            assetId: asset.id,
            price: priceData.usd.toString(),
            volume24h: (Math.random() * 100000000).toString(), // Mock volume
            marketCap: (Math.random() * 1000000000).toString(), // Mock market cap
            priceChangePercentage24h: priceData.usd_24h_change.toString()
          })
        );
      }
      
      await Promise.all(updates);
      return res.json({ message: "Market data refreshed successfully" });
    } catch (error: any) {
      console.error("Error refreshing market data:", error);
      return res.status(500).json({ 
        message: "Failed to refresh market data",
        error: error.message 
      });
    }
  });
  
  // إضافة واجهة برمجة التطبيقات للصحة المالية
  app.get("/api/portfolio/:userId/financial-health", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // في تطبيق حقيقي، ستقوم بجلب البيانات من قاعدة البيانات
      // هذه بيانات مثالية لعرض الميزة
      const financialHealth = {
        savingsRatio: 0.15,
        debtToIncomeRatio: 0.42,
        cryptoAllocation: 0.25,
        diversificationScore: 65,
        monthlyExpenses: 3200,
        monthlyIncome: 5000,
        emergencyFund: 10000,
        recommendedEmergencyFund: 15000,
        expenseBreakdown: [
          { name: 'سكن', value: 1200 },
          { name: 'طعام', value: 800 },
          { name: 'نقل', value: 400 },
          { name: 'ترفيه', value: 300 },
          { name: 'متنوع', value: 500 }
        ]
      };
      
      res.json(financialHealth);
    } catch (error: any) {
      console.error("Error getting financial health:", error);
      res.status(500).json({ error: "Failed to get financial health data" });
    }
  });
  
  // واجهة برمجة التطبيقات لنقاط البيع
  app.get("/api/pos-locations", async (_req: Request, res: Response) => {
    try {
      // في تطبيق حقيقي، ستقوم بجلب البيانات من قاعدة البيانات
      // هذه بيانات مثالية لعرض الميزة
      const posLocations = [
        {
          id: 'pos-001',
          name: 'صرافة الرياض الرقمية',
          address: 'شارع العليا، حي العليا',
          city: 'الرياض',
          coordinates: { lat: 24.7136, lng: 46.6753 },
          distance: 2.4,
          openNow: true,
          hours: '9:00 - 22:00',
          phone: '+966112345678',
          rating: 4.7,
          totalRatings: 128,
          paymentMethods: ['cash', 'card'],
          availableCurrencies: ['BTC', 'ETH', 'BNB', 'USDT'],
          kyc: 'basic',
          minAmount: 100,
          maxAmount: 5000,
          image: 'https://images.unsplash.com/photo-1521791055366-0d553872125f'
        },
        {
          id: 'pos-002',
          name: 'مركز كريبتو العربية',
          address: 'طريق الملك فهد، حي الورود',
          city: 'الرياض',
          coordinates: { lat: 24.7741, lng: 46.7388 },
          distance: 4.1,
          openNow: true,
          hours: '10:00 - 20:00',
          phone: '+966113456789',
          rating: 4.5,
          totalRatings: 72,
          paymentMethods: ['cash', 'card', 'bank_transfer'],
          availableCurrencies: ['BTC', 'ETH', 'SOL', 'ADA', 'MATIC'],
          kyc: 'full',
          minAmount: 500,
          maxAmount: 10000,
          image: 'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa'
        },
        {
          id: 'pos-003',
          name: 'صرافة البلد للعملات الرقمية',
          address: 'شارع التحلية، حي السليمانية',
          city: 'جدة',
          coordinates: { lat: 21.5433, lng: 39.1728 },
          distance: 5.7,
          openNow: false,
          hours: '8:30 - 21:30',
          phone: '+966122345678',
          rating: 4.2,
          totalRatings: 95,
          paymentMethods: ['cash'],
          availableCurrencies: ['BTC', 'ETH', 'USDT', 'BNB'],
          kyc: 'none',
          minAmount: 50,
          maxAmount: 3000,
          image: 'https://images.unsplash.com/photo-1462206092226-f46025ffe607'
        },
        {
          id: 'pos-004',
          name: 'مركز المستقبل للعملات',
          address: 'طريق الملك عبدالعزيز، حي الخبر الشمالية',
          city: 'الخبر',
          coordinates: { lat: 26.2794, lng: 50.2083 },
          distance: 8.2,
          openNow: true,
          hours: '9:00 - 22:00',
          phone: '+966132345678',
          rating: 4.8,
          totalRatings: 63,
          paymentMethods: ['cash', 'card', 'bank_transfer'],
          availableCurrencies: ['BTC', 'ETH', 'SOL', 'DOGE', 'XRP'],
          kyc: 'full',
          minAmount: 200,
          maxAmount: 8000,
          image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e'
        },
        {
          id: 'pos-005',
          name: 'قصر العملات الرقمية',
          address: 'شارع الأمير محمد بن فهد، حي العزيزية',
          city: 'الدمام',
          coordinates: { lat: 26.4207, lng: 50.0887 },
          distance: 10.5,
          openNow: true,
          hours: '10:00 - 23:00',
          phone: '+966133456789',
          rating: 4.3,
          totalRatings: 47,
          paymentMethods: ['cash', 'card'],
          availableCurrencies: ['BTC', 'ETH', 'USDT', 'BNB'],
          kyc: 'basic',
          minAmount: 100,
          maxAmount: 5000,
          image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc'
        }
      ];
      
      res.json(posLocations);
    } catch (error: any) {
      console.error("Error getting POS locations:", error);
      res.status(500).json({ error: "Failed to get POS locations" });
    }
  });
  
  // واجهة برمجة التطبيقات لأسعار الصرف في نقاط البيع
  app.get("/api/exchange-rates/:posId", async (req: Request, res: Response) => {
    try {
      const posId = req.params.posId;
      
      // في تطبيق حقيقي، ستقوم بجلب البيانات من قاعدة البيانات
      // هذه بيانات مثالية لعرض الميزة
      const exchangeRates = [
        { currency: 'BTC', buyRate: 230000, sellRate: 228000 },
        { currency: 'ETH', buyRate: 12500, sellRate: 12300 },
        { currency: 'BNB', buyRate: 1800, sellRate: 1750 },
        { currency: 'SOL', buyRate: 650, sellRate: 630 },
        { currency: 'USDT', buyRate: 3.76, sellRate: 3.74 },
        { currency: 'ADA', buyRate: 2.2, sellRate: 2.1 },
        { currency: 'XRP', buyRate: 3.1, sellRate: 3.0 },
        { currency: 'DOGE', buyRate: 0.8, sellRate: 0.75 },
        { currency: 'MATIC', buyRate: 3.5, sellRate: 3.4 },
      ];
      
      res.json(exchangeRates);
    } catch (error: any) {
      console.error("Error getting exchange rates:", error);
      res.status(500).json({ error: "Failed to get exchange rates" });
    }
  });
  
  // واجهة برمجة التطبيقات للأوقات المتاحة للحجز
  app.get("/api/available-times/:posId", async (req: Request, res: Response) => {
    try {
      const posId = req.params.posId;
      const date = req.query.date;
      
      // في تطبيق حقيقي، ستقوم بجلب البيانات من قاعدة البيانات
      // هذه بيانات مثالية لعرض الميزة
      const availableTimes = [
        '10:00', '10:30', '11:00', '11:30', '12:00', 
        '13:00', '13:30', '14:00', '14:30', 
        '15:00', '15:30', '16:00', '16:30', '17:00'
      ];
      
      res.json(availableTimes);
    } catch (error: any) {
      console.error("Error getting available times:", error);
      res.status(500).json({ error: "Failed to get available times" });
    }
  });
  
  // واجهة برمجة التطبيقات لحجز موعد في نقطة بيع
  app.post("/api/book-appointment", async (req: Request, res: Response) => {
    try {
      const { posId, date, time, currencyCode, amount, userId } = req.body;
      
      // في تطبيق حقيقي، ستقوم بتخزين بيانات الحجز في قاعدة البيانات
      // هذه استجابة مثالية لعرض الميزة
      res.status(201).json({
        id: `booking-${Math.floor(Math.random() * 10000)}`,
        posId,
        date,
        time,
        currencyCode,
        amount,
        userId,
        status: 'confirmed',
        referenceNumber: `RT-${Math.floor(Math.random() * 1000000)}`,
        createdAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Error booking appointment:", error);
      res.status(500).json({ error: "Failed to book appointment" });
    }
  });
  
  // واجهة برمجة التطبيقات لنظام الإنجازات
  app.get("/api/achievements/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // في تطبيق حقيقي، ستقوم بجلب البيانات من قاعدة البيانات
      // هذه بيانات مثالية لعرض الميزة
      const achievements = [
        {
          id: 'first-transaction',
          title: 'المعاملة الأولى',
          description: 'أكمل أول معاملة في المحفظة',
          icon: 'Wallet',
          category: 'trading',
          progress: 1,
          target: 1,
          reward: '50 نقطة',
          achieved: true,
          dateAchieved: '2025-04-20',
        },
        {
          id: 'portfolio-diversity',
          title: 'محفظة متنوعة',
          description: 'امتلك 5 عملات مشفرة مختلفة',
          icon: 'BarChart3',
          category: 'portfolio',
          progress: 3,
          target: 5,
          reward: '100 نقطة',
          achieved: false,
        },
        {
          id: 'trading-volume',
          title: 'حجم تداول',
          description: 'أكمل معاملات بقيمة 10,000$',
          icon: 'TrendingUp',
          category: 'trading',
          progress: 4500,
          target: 10000,
          reward: '200 نقطة',
          achieved: false,
          milestones: [
            { value: 1000, reward: '20 نقطة' },
            { value: 5000, reward: '50 نقطة' },
            { value: 10000, reward: '130 نقطة' },
          ]
        },
        {
          id: 'security-check',
          title: 'أمان محسّن',
          description: 'فعّل المصادقة الثنائية',
          icon: 'Lock',
          category: 'security',
          progress: 0,
          target: 1,
          reward: '150 نقطة',
          achieved: false,
        },
        {
          id: 'regular-trader',
          title: 'متداول منتظم',
          description: 'أكمل معاملة يوميًا لمدة 7 أيام متتالية',
          icon: 'Repeat',
          category: 'trading',
          progress: 4,
          target: 7,
          reward: '120 نقطة',
          achieved: false,
        },
        {
          id: 'referral-program',
          title: 'برنامج الإحالة',
          description: 'قم بدعوة 3 أصدقاء للانضمام',
          icon: 'Users',
          category: 'social',
          progress: 1,
          target: 3,
          reward: '250 نقطة',
          achieved: false,
        }
      ];
      
      res.json(achievements);
    } catch (error: any) {
      console.error("Error getting achievements:", error);
      res.status(500).json({ error: "Failed to get achievements data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
