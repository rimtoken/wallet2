import { 
  users, type User, type InsertUser,
  assets, type Asset, type InsertAsset,
  wallets, type Wallet, type InsertWallet,
  transactions, type Transaction, type InsertTransaction,
  marketData, type MarketData, type InsertMarketData,
  portfolioHistory, type PortfolioHistory, type InsertPortfolioHistory,
  type WalletAsset, type MarketAsset, type PortfolioSummary
} from "@shared/schema";

import session from "express-session";

export interface IStorage {
  sessionStore: session.Store;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAssets(): Promise<Asset[]>;
  getAssetById(id: number): Promise<Asset | undefined>;
  getAssetBySymbol(symbol: string): Promise<Asset | undefined>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAssetPrice(id: number, price: string, priceChange: string): Promise<Asset>;
  getWalletsByUserId(userId: number): Promise<Wallet[]>;
  getWalletAssets(userId: number): Promise<WalletAsset[]>;
  getWalletByUserAndAsset(userId: number, assetId: number): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWalletBalance(id: number, balance: number): Promise<Wallet>;
  getTransactionsByUserId(userId: number, limit?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getMarketData(): Promise<MarketAsset[]>;
  updateMarketData(marketData: InsertMarketData): Promise<MarketData>;
  getPortfolioSummary(userId: number): Promise<PortfolioSummary>;
  getPortfolioHistory(userId: number, days: number): Promise<PortfolioHistory[]>;
  createPortfolioHistoryEntry(entry: InsertPortfolioHistory): Promise<PortfolioHistory>;
}

import createMemoryStore from "memorystore";
const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  sessionStore: session.Store;
  private users: Map<number, User> = new Map();
  private assets: Map<number, Asset> = new Map();
  private wallets: Map<number, Wallet> = new Map();
  private transactions: Map<number, Transaction> = new Map();
  private marketDataEntries: Map<number, MarketData> = new Map();
  private portfolioHistoryEntries: Map<number, PortfolioHistory> = new Map();
  
  private userId: number = 1;
  private assetId: number = 1;
  private walletId: number = 1;
  private transactionId: number = 1;
  private marketDataId: number = 1;
  private portfolioHistoryId: number = 1;

  constructor() {
    this.sessionStore = new MemoryStore({ checkPeriod: 86400000 });
    this.initializeMockData();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getAssets(): Promise<Asset[]> {
    return Array.from(this.assets.values());
  }

  async getAssetById(id: number): Promise<Asset | undefined> {
    return this.assets.get(id);
  }

  async getAssetBySymbol(symbol: string): Promise<Asset | undefined> {
    return Array.from(this.assets.values()).find(asset => asset.symbol === symbol);
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = this.assetId++;
    const asset: Asset = { 
      id,
      symbol: insertAsset.symbol,
      name: insertAsset.name,
      icon: insertAsset.icon || null,
      currentPrice: insertAsset.currentPrice || null,
      priceChangePercentage24h: insertAsset.priceChangePercentage24h || null
    };
    this.assets.set(id, asset);
    return asset;
  }

  async updateAssetPrice(id: number, price: string, priceChange: string): Promise<Asset> {
    const asset = this.assets.get(id);
    if (!asset) throw new Error(`Asset with id ${id} not found`);
    
    const updatedAsset: Asset = {
      ...asset,
      currentPrice: price,
      priceChangePercentage24h: priceChange,
    };
    
    this.assets.set(id, updatedAsset);
    return updatedAsset;
  }

  async getWalletsByUserId(userId: number): Promise<Wallet[]> {
    return Array.from(this.wallets.values()).filter(wallet => wallet.userId === userId);
  }

  async getWalletAssets(userId: number): Promise<WalletAsset[]> {
    const userWallets = await this.getWalletsByUserId(userId);
    const walletAssets: WalletAsset[] = [];

    for (const wallet of userWallets) {
      const asset = await this.getAssetById(wallet.assetId);
      if (asset) {
        const balance = parseFloat(wallet.balance);
        const price = parseFloat(asset.currentPrice || "0");
        const value = balance * price;
        const priceChangePercentage24h = parseFloat(asset.priceChangePercentage24h || "0");

        walletAssets.push({
          id: wallet.id,
          symbol: asset.symbol,
          name: asset.name,
          icon: asset.icon || "",
          balance,
          price,
          value,
          priceChangePercentage24h,
        });
      }
    }

    return walletAssets;
  }

  async getWalletByUserAndAsset(userId: number, assetId: number): Promise<Wallet | undefined> {
    return Array.from(this.wallets.values()).find(
      (wallet) => wallet.userId === userId && wallet.assetId === assetId,
    );
  }

  async createWallet(insertWallet: InsertWallet): Promise<Wallet> {
    const id = this.walletId++;
    const wallet: Wallet = { 
      id,
      userId: insertWallet.userId,
      assetId: insertWallet.assetId,
      balance: insertWallet.balance || "0",
      lastUpdated: new Date()
    };
    this.wallets.set(id, wallet);
    return wallet;
  }

  async updateWalletBalance(id: number, balance: number): Promise<Wallet> {
    const wallet = this.wallets.get(id);
    if (!wallet) throw new Error(`Wallet with id ${id} not found`);
    
    const updatedWallet: Wallet = {
      ...wallet,
      balance: balance.toString(),
      lastUpdated: new Date(),
    };
    
    this.wallets.set(id, updatedWallet);
    return updatedWallet;
  }

  async getTransactionsByUserId(userId: number, limit?: number): Promise<Transaction[]> {
    const userTransactions = Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return limit ? userTransactions.slice(0, limit) : userTransactions;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionId++;
    const transaction: Transaction = { 
      id,
      userId: insertTransaction.userId,
      assetId: insertTransaction.assetId,
      type: insertTransaction.type,
      amount: insertTransaction.amount,
      toAddress: insertTransaction.toAddress || null,
      fromAddress: insertTransaction.fromAddress || null,
      fee: insertTransaction.fee || null,
      status: insertTransaction.status || "completed",
      createdAt: new Date()
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getMarketData(): Promise<MarketAsset[]> {
    const marketAssets: MarketAsset[] = [];
    
    for (const asset of Array.from(this.assets.values())) {
      const price = parseFloat(asset.currentPrice || "0");
      const priceChangePercentage24h = parseFloat(asset.priceChangePercentage24h || "0");
      
      marketAssets.push({
        id: asset.id,
        symbol: asset.symbol,
        name: asset.name,
        icon: asset.icon || "",
        price,
        priceChangePercentage24h,
        sparklineData: this.generateSparklineData(price, priceChangePercentage24h),
      });
    }
    
    return marketAssets;
  }

  async updateMarketData(insertMarketData: InsertMarketData): Promise<MarketData> {
    const id = this.marketDataId++;
    const marketDataEntry: MarketData = { 
      id,
      assetId: insertMarketData.assetId,
      price: insertMarketData.price,
      volume24h: insertMarketData.volume24h || null,
      marketCap: insertMarketData.marketCap || null,
      priceChangePercentage24h: insertMarketData.priceChangePercentage24h || null,
      lastUpdated: new Date()
    };
    this.marketDataEntries.set(id, marketDataEntry);
    return marketDataEntry;
  }

  async getPortfolioSummary(userId: number): Promise<PortfolioSummary> {
    const walletAssets = await this.getWalletAssets(userId);
    const transactions = await this.getTransactionsByUserId(userId);
    
    const totalValue = walletAssets.reduce((sum, asset) => sum + asset.value, 0);
    const change24h = walletAssets.reduce((sum, asset) => {
      const change = (asset.value * asset.priceChangePercentage24h) / 100;
      return sum + change;
    }, 0);
    const changePercentage24h = totalValue > 0 ? (change24h / totalValue) * 100 : 0;
    
    return {
      totalValue,
      change24h,
      changePercentage24h,
      assetCount: walletAssets.length,
      volume24h: totalValue * 0.1,
      totalProfit: change24h,
      transactionCount: transactions.length,
    };
  }

  async getPortfolioHistory(userId: number, days: number): Promise<PortfolioHistory[]> {
    return Array.from(this.portfolioHistoryEntries.values())
      .filter(entry => entry.userId === userId)
      .filter(entry => {
        const entryDate = new Date(entry.timestamp);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        return entryDate >= cutoffDate;
      })
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async createPortfolioHistoryEntry(insertEntry: InsertPortfolioHistory): Promise<PortfolioHistory> {
    const id = this.portfolioHistoryId++;
    const entry: PortfolioHistory = { 
      id,
      userId: insertEntry.userId,
      totalValue: insertEntry.totalValue,
      timestamp: new Date()
    };
    this.portfolioHistoryEntries.set(id, entry);
    return entry;
  }

  private generateSparklineData(currentPrice: number, changePercentage: number): number[] {
    const data: number[] = [];
    const basePrice = currentPrice / (1 + changePercentage / 100);
    
    for (let i = 0; i < 24; i++) {
      const variation = (Math.random() - 0.5) * 0.1;
      const progress = i / 23;
      const price = basePrice * (1 + (changePercentage / 100) * progress + variation);
      data.push(price);
    }
    
    return data;
  }

  private async initializeMockData() {
    await this.createAsset({
      symbol: "BTC",
      name: "Bitcoin",
      icon: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
      currentPrice: "43250.00",
      priceChangePercentage24h: "2.45"
    });

    await this.createAsset({
      symbol: "ETH",
      name: "Ethereum", 
      icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      currentPrice: "2580.00",
      priceChangePercentage24h: "-1.23"
    });

    const user = await this.createUser({
      username: "demo_user",
      email: "demo@rimtoken.org", 
      password: "hashed_password"
    });

    await this.createWallet({
      userId: user.id,
      assetId: 1,
      balance: "0.5"
    });
  }
}

export const storage = new MemStorage();