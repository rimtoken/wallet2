import { 
  users, type User, type InsertUser,
  assets, type Asset, type InsertAsset,
  wallets, type Wallet, type InsertWallet,
  transactions, type Transaction, type InsertTransaction,
  marketData, type MarketData, type InsertMarketData,
  portfolioHistory, type PortfolioHistory, type InsertPortfolioHistory,
  type WalletAsset, type MarketAsset, type PortfolioSummary
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Asset methods
  getAssets(): Promise<Asset[]>;
  getAssetById(id: number): Promise<Asset | undefined>;
  getAssetBySymbol(symbol: string): Promise<Asset | undefined>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAssetPrice(id: number, price: string, priceChange: string): Promise<Asset>;
  
  // Wallet methods
  getWalletsByUserId(userId: number): Promise<Wallet[]>;
  getWalletAssets(userId: number): Promise<WalletAsset[]>;
  getWalletByUserAndAsset(userId: number, assetId: number): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWalletBalance(id: number, balance: number): Promise<Wallet>;
  
  // Transaction methods
  getTransactionsByUserId(userId: number, limit?: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Market data methods
  getMarketData(): Promise<MarketAsset[]>;
  updateMarketData(marketData: InsertMarketData): Promise<MarketData>;
  
  // Portfolio methods
  getPortfolioSummary(userId: number): Promise<PortfolioSummary>;
  getPortfolioHistory(userId: number, days: number): Promise<PortfolioHistory[]>;
  createPortfolioHistoryEntry(entry: InsertPortfolioHistory): Promise<PortfolioHistory>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private assets: Map<number, Asset>;
  private wallets: Map<number, Wallet>;
  private transactions: Map<number, Transaction>;
  private marketDataEntries: Map<number, MarketData>;
  private portfolioHistoryEntries: Map<number, PortfolioHistory>;
  
  private userId: number = 1;
  private assetId: number = 1;
  private walletId: number = 1;
  private transactionId: number = 1;
  private marketDataId: number = 1;
  private portfolioHistoryId: number = 1;

  constructor() {
    this.users = new Map();
    this.assets = new Map();
    this.wallets = new Map();
    this.transactions = new Map();
    this.marketDataEntries = new Map();
    this.portfolioHistoryEntries = new Map();
    
    // Initialize with mock data for development
    this.initializeMockData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  // Asset methods
  async getAssets(): Promise<Asset[]> {
    return Array.from(this.assets.values());
  }

  async getAssetById(id: number): Promise<Asset | undefined> {
    return this.assets.get(id);
  }

  async getAssetBySymbol(symbol: string): Promise<Asset | undefined> {
    return Array.from(this.assets.values()).find(
      (asset) => asset.symbol === symbol,
    );
  }

  async createAsset(insertAsset: InsertAsset): Promise<Asset> {
    const id = this.assetId++;
    const asset: Asset = { ...insertAsset, id };
    this.assets.set(id, asset);
    return asset;
  }

  async updateAssetPrice(id: number, price: string, priceChange: string): Promise<Asset> {
    const asset = this.assets.get(id);
    if (!asset) {
      throw new Error(`Asset with id ${id} not found`);
    }
    
    const updatedAsset: Asset = {
      ...asset,
      currentPrice: price,
      priceChangePercentage24h: priceChange
    };
    
    this.assets.set(id, updatedAsset);
    return updatedAsset;
  }

  // Wallet methods
  async getWalletsByUserId(userId: number): Promise<Wallet[]> {
    return Array.from(this.wallets.values()).filter(
      (wallet) => wallet.userId === userId,
    );
  }

  async getWalletAssets(userId: number): Promise<WalletAsset[]> {
    const userWallets = await this.getWalletsByUserId(userId);
    
    return Promise.all(
      userWallets.map(async (wallet) => {
        const asset = await this.getAssetById(wallet.assetId);
        if (!asset) {
          throw new Error(`Asset with id ${wallet.assetId} not found`);
        }
        
        return {
          id: asset.id,
          symbol: asset.symbol,
          name: asset.name,
          icon: asset.icon || '',
          balance: Number(wallet.balance),
          price: Number(asset.currentPrice || 0),
          value: Number(wallet.balance) * Number(asset.currentPrice || 0),
          priceChangePercentage24h: Number(asset.priceChangePercentage24h || 0)
        };
      })
    );
  }

  async getWalletByUserAndAsset(userId: number, assetId: number): Promise<Wallet | undefined> {
    return Array.from(this.wallets.values()).find(
      (wallet) => wallet.userId === userId && wallet.assetId === assetId,
    );
  }

  async createWallet(insertWallet: InsertWallet): Promise<Wallet> {
    const id = this.walletId++;
    const now = new Date();
    const wallet: Wallet = { ...insertWallet, id, lastUpdated: now };
    this.wallets.set(id, wallet);
    return wallet;
  }

  async updateWalletBalance(id: number, balance: number): Promise<Wallet> {
    const wallet = this.wallets.get(id);
    if (!wallet) {
      throw new Error(`Wallet with id ${id} not found`);
    }
    
    const now = new Date();
    const updatedWallet: Wallet = {
      ...wallet,
      balance,
      lastUpdated: now
    };
    
    this.wallets.set(id, updatedWallet);
    return updatedWallet;
  }

  // Transaction methods
  async getTransactionsByUserId(userId: number, limit?: number): Promise<Transaction[]> {
    const userTransactions = Array.from(this.transactions.values())
      .filter((transaction) => transaction.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return limit ? userTransactions.slice(0, limit) : userTransactions;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionId++;
    const now = new Date();
    const transaction: Transaction = { ...insertTransaction, id, createdAt: now };
    this.transactions.set(id, transaction);
    
    // Update wallet balance
    const wallet = await this.getWalletByUserAndAsset(insertTransaction.userId, insertTransaction.assetId);
    if (wallet) {
      const transactionAmount = Number(insertTransaction.amount);
      let newBalance = Number(wallet.balance);
      
      if (insertTransaction.type === 'receive') {
        newBalance += transactionAmount;
      } else if (insertTransaction.type === 'send') {
        newBalance -= transactionAmount;
        
        // Subtract fee if applicable
        if (insertTransaction.fee) {
          newBalance -= Number(insertTransaction.fee);
        }
      }
      
      await this.updateWalletBalance(wallet.id, newBalance);
    }
    
    return transaction;
  }

  // Market data methods
  async getMarketData(): Promise<MarketAsset[]> {
    const assets = await this.getAssets();
    
    return assets.map(asset => {
      // Generate random sparkline data for visualization
      const sparklineData = Array.from({ length: 24 }, () => 
        Math.floor(Math.random() * 100)
      );
      
      return {
        id: asset.id,
        symbol: asset.symbol,
        name: asset.name,
        icon: asset.icon || '',
        price: Number(asset.currentPrice || 0),
        priceChangePercentage24h: Number(asset.priceChangePercentage24h || 0),
        sparklineData
      };
    });
  }

  async updateMarketData(insertMarketData: InsertMarketData): Promise<MarketData> {
    const id = this.marketDataId++;
    const now = new Date();
    const marketDataEntry: MarketData = { ...insertMarketData, id, lastUpdated: now };
    this.marketDataEntries.set(id, marketDataEntry);
    
    // Update asset price
    await this.updateAssetPrice(
      insertMarketData.assetId, 
      insertMarketData.price, 
      insertMarketData.priceChangePercentage24h || '0'
    );
    
    return marketDataEntry;
  }

  // Portfolio methods
  async getPortfolioSummary(userId: number): Promise<PortfolioSummary> {
    const walletAssets = await this.getWalletAssets(userId);
    const transactions = await this.getTransactionsByUserId(userId);
    
    const totalValue = walletAssets.reduce((sum, asset) => sum + asset.value, 0);
    
    // Calculate 24h change (simplified for demo)
    const change24h = walletAssets.reduce(
      (sum, asset) => sum + (asset.value * asset.priceChangePercentage24h / 100),
      0
    );
    
    const changePercentage24h = totalValue > 0 ? (change24h / totalValue) * 100 : 0;
    
    // Calculate 24h volume (simplified)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    const recentTransactions = transactions.filter(
      tx => tx.createdAt > oneDayAgo
    );
    
    const volume24h = recentTransactions.reduce(
      (sum, tx) => {
        const asset = this.assets.get(tx.assetId);
        if (!asset || !asset.currentPrice) return sum;
        return sum + (Number(tx.amount) * Number(asset.currentPrice));
      },
      0
    );
    
    // Simplified profit calculation (for demo purposes)
    const totalProfit = totalValue * 0.15; // Assume 15% profit on portfolio for demo
    
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
    const allHistory = Array.from(this.portfolioHistoryEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    // Filter by days if specified
    if (days) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      return allHistory.filter(entry => entry.timestamp >= cutoffDate);
    }
    
    return allHistory;
  }

  async createPortfolioHistoryEntry(insertEntry: InsertPortfolioHistory): Promise<PortfolioHistory> {
    const id = this.portfolioHistoryId++;
    const now = new Date();
    const entry: PortfolioHistory = { ...insertEntry, id, timestamp: now };
    this.portfolioHistoryEntries.set(id, entry);
    return entry;
  }

  // Initialize mock data for development
  private async initializeMockData() {
    // Create default user
    const defaultUser = await this.createUser({
      username: 'demo_user',
      password: 'password123',
      email: 'demo@example.com'
    });
    
    // Create crypto assets
    const bitcoin = await this.createAsset({
      symbol: 'BTC',
      name: 'Bitcoin',
      icon: '₿',
      currentPrice: '42384.25',
      priceChangePercentage24h: '1.8'
    });
    
    const ethereum = await this.createAsset({
      symbol: 'ETH',
      name: 'Ethereum',
      icon: 'Ξ',
      currentPrice: '2856.32',
      priceChangePercentage24h: '3.2'
    });
    
    const usdCoin = await this.createAsset({
      symbol: 'USDC',
      name: 'USD Coin',
      icon: '$',
      currentPrice: '1.00',
      priceChangePercentage24h: '0.0'
    });
    
    const solana = await this.createAsset({
      symbol: 'SOL',
      name: 'Solana',
      icon: 'S',
      currentPrice: '98.45',
      priceChangePercentage24h: '-1.2'
    });
    
    const dogecoin = await this.createAsset({
      symbol: 'DOGE',
      name: 'Dogecoin',
      icon: 'D',
      currentPrice: '0.29',
      priceChangePercentage24h: '4.5'
    });
    
    const binanceCoin = await this.createAsset({
      symbol: 'BNB',
      name: 'Binance Coin',
      icon: 'B',
      currentPrice: '389.21',
      priceChangePercentage24h: '2.5'
    });
    
    // Create user wallets with balances
    await this.createWallet({
      userId: defaultUser.id,
      assetId: bitcoin.id,
      balance: '0.4238'
    });
    
    await this.createWallet({
      userId: defaultUser.id,
      assetId: ethereum.id,
      balance: '3.5029'
    });
    
    await this.createWallet({
      userId: defaultUser.id,
      assetId: usdCoin.id,
      balance: '4210.00'
    });
    
    await this.createWallet({
      userId: defaultUser.id,
      assetId: solana.id,
      balance: '28.5'
    });
    
    await this.createWallet({
      userId: defaultUser.id,
      assetId: dogecoin.id,
      balance: '5280.00'
    });
    
    // Create transaction history
    const now = new Date();
    
    const oneHourAgo = new Date(now);
    oneHourAgo.setHours(now.getHours() - 1);
    
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(now.getDate() - 1);
    
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);
    
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(now.getDate() - 3);
    
    // Transactions
    await this.createTransaction({
      userId: defaultUser.id,
      assetId: bitcoin.id,
      type: 'receive',
      amount: 0.0024,
      fromAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      status: 'completed',
    });
    
    const ethTx = await this.createTransaction({
      userId: defaultUser.id,
      assetId: ethereum.id,
      type: 'send',
      amount: 0.5,
      toAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      fee: 0.0023,
      status: 'completed',
    });
    
    // Set createdAt manually for transactions to simulate time passage
    ethTx.createdAt = oneDayAgo;
    this.transactions.set(ethTx.id, ethTx);
    
    const swapTx = await this.createTransaction({
      userId: defaultUser.id,
      assetId: bitcoin.id,
      type: 'swap',
      amount: 0.05,
      toAddress: 'swap:USDC',
      status: 'completed',
    });
    
    swapTx.createdAt = twoDaysAgo;
    this.transactions.set(swapTx.id, swapTx);
    
    const receiveTx = await this.createTransaction({
      userId: defaultUser.id,
      assetId: solana.id,
      type: 'receive',
      amount: 12.0,
      fromAddress: 'So11111111111111111111111111111111111111112',
      status: 'completed',
    });
    
    receiveTx.createdAt = threeDaysAgo;
    this.transactions.set(receiveTx.id, receiveTx);
    
    // Portfolio history
    const daysOfHistory = 30;
    let baseValue = 32000; // Starting portfolio value
    
    for (let i = daysOfHistory; i >= 0; i--) {
      const historyDate = new Date();
      historyDate.setDate(historyDate.getDate() - i);
      
      // Add some randomness to the portfolio value
      const randomFactor = 0.98 + Math.random() * 0.04; // Random between -2% and +2%
      baseValue = baseValue * randomFactor;
      
      const portfolioEntry = await this.createPortfolioHistoryEntry({
        userId: defaultUser.id,
        totalValue: baseValue
      });
      
      // Manually set the timestamp
      portfolioEntry.timestamp = historyDate;
      this.portfolioHistoryEntries.set(portfolioEntry.id, portfolioEntry);
    }
  }
}

export const storage = new MemStorage();
