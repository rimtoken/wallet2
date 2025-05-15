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
