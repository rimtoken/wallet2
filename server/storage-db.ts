import {
  users, type User, type InsertUser,
  assets, type Asset, type InsertAsset,
  wallets, type Wallet, type InsertWallet,
  transactions, type Transaction, type InsertTransaction,
  marketData, type MarketData, type InsertMarketData,
  portfolioHistory, type PortfolioHistory, type InsertPortfolioHistory,
  type PortfolioSummary,
  type WalletAsset,
  type MarketAsset
} from "@shared/schema";
import { db } from "./db";
import { IStorage } from "./storage";
import { eq, desc, sql, and } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Asset methods
  async getAssets(): Promise<Asset[]> {
    return db.select().from(assets);
  }

  async getAssetById(id: number): Promise<Asset | undefined> {
    const [asset] = await db.select().from(assets).where(eq(assets.id, id));
    return asset;
  }

  async getAssetBySymbol(symbol: string): Promise<Asset | undefined> {
    const [asset] = await db.select().from(assets).where(eq(assets.symbol, symbol));
    return asset;
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const [asset] = await db.insert(assets).values(insertAsset).returning();
    return asset;
  }

  async updateAssetPrice(id: number, price: string, priceChange: string): Promise<Asset> {
    const [asset] = await db
      .update(assets)
      .set({ 
        currentPrice: price,
        priceChangePercentage24h: priceChange
      })
      .where(eq(assets.id, id))
      .returning();
    return asset;
  }

  // Wallet methods
  async getWalletsByUserId(userId: number): Promise<Wallet[]> {
    return db.select().from(wallets).where(eq(wallets.userId, userId));
  }

  async getWalletAssets(userId: number): Promise<WalletAsset[]> {
    const userWallets = await this.getWalletsByUserId(userId);
    
    const walletAssets: WalletAsset[] = [];
    
    for (const wallet of userWallets) {
      const asset = await this.getAssetById(wallet.assetId);
      if (asset) {
        walletAssets.push({
          id: wallet.id,
          symbol: asset.symbol,
          name: asset.name,
          icon: asset.icon || "",
          balance: Number(wallet.balance),
          price: Number(asset.currentPrice || 0),
          value: Number(wallet.balance) * Number(asset.currentPrice || 0),
          priceChangePercentage24h: Number(asset.priceChangePercentage24h || 0)
        });
      }
    }
    
    return walletAssets;
  }

  async getWalletByUserAndAsset(userId: number, assetId: number): Promise<Wallet | undefined> {
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(and(
        eq(wallets.userId, userId),
        eq(wallets.assetId, assetId)
      ));
    return wallet;
  }

  async createWallet(insertWallet: InsertWallet): Promise<Wallet> {
    const [wallet] = await db.insert(wallets).values(insertWallet).returning();
    return wallet;
  }

  async updateWalletBalance(id: number, balance: number): Promise<Wallet> {
    const now = new Date();
    const balanceStr = balance.toString();
    const [wallet] = await db
      .update(wallets)
      .set({ balance: balanceStr, lastUpdated: now })
      .where(eq(wallets.id, id))
      .returning();
    return wallet;
  }

  // Transaction methods
  async getTransactionsByUserId(userId: number, limitCount?: number): Promise<Transaction[]> {
    const query = db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
    
    // تنفيذ الاستعلام وتطبيق الحد يدوياً إذا تم تحديده
    const results = await query;
    return limitCount ? results.slice(0, limitCount) : results;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db.insert(transactions).values(insertTransaction).returning();
    
    // إذا كان نوع المعاملة إرسال، قم بخصم الرصيد من محفظة المستخدم
    if (transaction.type === 'send') {
      const wallet = await this.getWalletByUserAndAsset(transaction.userId, transaction.assetId);
      if (wallet) {
        const newBalance = Number(wallet.balance) - Number(transaction.amount);
        await this.updateWalletBalance(wallet.id, newBalance);
      }
    } 
    // إذا كان نوع المعاملة استلام، قم بإضافة الرصيد إلى محفظة المستخدم
    else if (transaction.type === 'receive') {
      let wallet = await this.getWalletByUserAndAsset(transaction.userId, transaction.assetId);
      
      // إذا لم تكن المحفظة موجودة، قم بإنشائها
      if (!wallet) {
        wallet = await this.createWallet({
          userId: transaction.userId,
          assetId: transaction.assetId,
          balance: 0,
          lastUpdated: new Date()
        });
      }
      
      const newBalance = Number(wallet.balance) + Number(transaction.amount);
      await this.updateWalletBalance(wallet.id, newBalance);
    }
    
    return transaction;
  }

  // Market data methods
  async getMarketData(): Promise<MarketAsset[]> {
    const data = await db.select().from(assets);
    
    return data.map(asset => ({
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      icon: asset.icon || "",
      price: Number(asset.currentPrice || 0),
      priceChangePercentage24h: Number(asset.priceChangePercentage24h || 0),
      sparklineData: [] // في بيئة الإنتاج، هذه البيانات ستأتي من خدمة API خارجية
    }));
  }

  async updateMarketData(insertMarketData: InsertMarketData): Promise<MarketData> {
    const [data] = await db.insert(marketData).values(insertMarketData).returning();
    return data;
  }

  // Portfolio methods
  async getPortfolioSummary(userId: number): Promise<PortfolioSummary> {
    const walletAssets = await this.getWalletAssets(userId);
    const transactions = await this.getTransactionsByUserId(userId);
    
    const totalValue = walletAssets.reduce((sum, asset) => sum + asset.value, 0);
    
    // حساب التغير في المحفظة
    const change24h = totalValue * 0.045; // مثال: تغير بنسبة 4.5%
    const changePercentage24h = 4.5;
    
    // حساب حجم التداول
    const last24h = new Date();
    last24h.setDate(last24h.getDate() - 1);
    
    const volume24h = transactions
      .filter(tx => new Date(tx.createdAt) >= last24h)
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
    
    // حساب الربح الإجمالي
    const totalProfit = totalValue * 0.12; // مثال: ربح بنسبة 12%
    
    return {
      totalValue,
      change24h,
      changePercentage24h,
      assetCount: walletAssets.length,
      volume24h,
      totalProfit,
      transactionCount: transactions.length
    };
  }

  async getPortfolioHistory(userId: number, days: number): Promise<PortfolioHistory[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const history = await db
      .select()
      .from(portfolioHistory)
      .where(and(
        eq(portfolioHistory.userId, userId),
        sql`${portfolioHistory.timestamp} >= ${startDate}`,
        sql`${portfolioHistory.timestamp} <= ${endDate}`
      ))
      .orderBy(portfolioHistory.timestamp);
    
    return history;
  }

  async createPortfolioHistoryEntry(insertEntry: InsertPortfolioHistory): Promise<PortfolioHistory> {
    const [entry] = await db.insert(portfolioHistory).values(insertEntry).returning();
    return entry;
  }
}

// طريقة لتهيئة البيانات الأولية في قاعدة البيانات
async function initializeDatabase() {
  try {
    // التحقق من وجود بيانات في قاعدة البيانات
    const assetsCount = await db.select({ count: sql`count(*)` }).from(assets);
    
    // إذا لم تكن هناك أصول، قم بإضافة بعض البيانات الأولية
    if (Number(assetsCount[0].count) === 0) {
      console.log("تهيئة بيانات قاعدة البيانات...");
      
      // إضافة مستخدم
      await db.insert(users).values({
        username: "user1",
        password: "password123",
        email: "user1@example.com"
      });
      
      // إضافة العملات الرقمية
      await db.insert(assets).values([
        {
          symbol: "BTC",
          name: "Bitcoin",
          icon: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
          currentPrice: "50000.00",
          priceChangePercentage24h: "2.5"
        },
        {
          symbol: "ETH",
          name: "Ethereum",
          icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
          currentPrice: "2500.00",
          priceChangePercentage24h: "3.2"
        },
        {
          symbol: "SOL",
          name: "Solana",
          icon: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
          currentPrice: "100.00",
          priceChangePercentage24h: "5.7"
        },
        {
          symbol: "BNB",
          name: "Binance Coin",
          icon: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
          currentPrice: "320.00",
          priceChangePercentage24h: "1.8"
        },
        {
          symbol: "ADA",
          name: "Cardano",
          icon: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
          currentPrice: "0.50",
          priceChangePercentage24h: "-0.7"
        }
      ]);

      console.log("تم تهيئة قاعدة البيانات بنجاح!");
    }
  } catch (error) {
    console.error("خطأ أثناء تهيئة قاعدة البيانات:", error);
  }
}

export const dbStorage = new DatabaseStorage();

// تشغيل عملية تهيئة قاعدة البيانات
initializeDatabase();