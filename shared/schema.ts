import { pgTable, text, serial, integer, timestamp, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true 
});

// Assets/Cryptocurrencies schema
export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  icon: text("icon"),
  currentPrice: numeric("current_price", { precision: 18, scale: 8 }),
  priceChangePercentage24h: numeric("price_change_percentage_24h", { precision: 10, scale: 2 }),
});

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
});

// User Wallet/Portfolio schema
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  assetId: integer("asset_id").notNull().references(() => assets.id),
  balance: numeric("balance", { precision: 18, scale: 8 }).notNull().default("0"),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  lastUpdated: true,
});

// Transaction schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  assetId: integer("asset_id").notNull().references(() => assets.id),
  type: text("type").notNull(), // 'send', 'receive', 'swap'
  amount: numeric("amount", { precision: 18, scale: 8 }).notNull(),
  toAddress: text("to_address"),
  fromAddress: text("from_address"),
  fee: numeric("fee", { precision: 18, scale: 8 }),
  status: text("status").notNull().default("completed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

// Market Data schema
export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  assetId: integer("asset_id").notNull().references(() => assets.id),
  price: numeric("price", { precision: 18, scale: 8 }).notNull(),
  volume24h: numeric("volume_24h", { precision: 18, scale: 2 }),
  marketCap: numeric("market_cap", { precision: 18, scale: 2 }),
  priceChangePercentage24h: numeric("price_change_percentage_24h", { precision: 10, scale: 2 }),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
  lastUpdated: true,
});

// Portfolio History schema
export const portfolioHistory = pgTable("portfolio_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  totalValue: numeric("total_value", { precision: 18, scale: 2 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertPortfolioHistorySchema = createInsertSchema(portfolioHistory).omit({
  id: true,
  timestamp: true,
});



// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Asset = typeof assets.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type MarketData = typeof marketData.$inferSelect;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;

export type PortfolioHistory = typeof portfolioHistory.$inferSelect;
export type InsertPortfolioHistory = z.infer<typeof insertPortfolioHistorySchema>;



// Export custom type for displaying portfolio data
export type PortfolioSummary = {
  totalValue: number;
  change24h: number;
  changePercentage24h: number;
  assetCount: number;
  volume24h: number;
  totalProfit: number;
  transactionCount: number;
};

// Export custom type for wallet asset with price data
export type WalletAsset = {
  id: number;
  symbol: string;
  name: string;
  icon: string;
  balance: number;
  price: number;
  value: number;
  priceChangePercentage24h: number;
};

// Export custom type for market data display
export type MarketAsset = {
  id: number;
  symbol: string;
  name: string;
  icon: string;
  price: number;
  priceChangePercentage24h: number;
  sparklineData: number[];
};

// Wallet Addresses schema
export const walletAddresses = pgTable("wallet_addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  address: text("address").notNull(),
  network: text("network").notNull(), // 'ethereum', 'bsc', 'polygon', 'solana'
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWalletAddressSchema = createInsertSchema(walletAddresses).omit({
  id: true,
  createdAt: true,
});

// DeFi Positions schema (for staking, yield farming, etc.)
export const defiPositions = pgTable("defi_positions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  protocol: text("protocol").notNull(), // 'uniswap', 'compound', etc.
  type: text("type").notNull(), // 'liquidity', 'staking', 'lending'
  amount: numeric("amount", { precision: 18, scale: 8 }).notNull(),
  assetId: integer("asset_id").notNull().references(() => assets.id),
  apy: numeric("apy", { precision: 10, scale: 2 }),
  startDate: timestamp("start_date").defaultNow().notNull(),
  endDate: timestamp("end_date"),
  status: text("status").notNull().default("active"), // 'active', 'completed', 'withdrawn'
});

export const insertDefiPositionSchema = createInsertSchema(defiPositions).omit({
  id: true,
  startDate: true,
});

// Export types for new tables
export type WalletAddress = typeof walletAddresses.$inferSelect;
export type InsertWalletAddress = z.infer<typeof insertWalletAddressSchema>;

export type DefiPosition = typeof defiPositions.$inferSelect;
export type InsertDefiPosition = z.infer<typeof insertDefiPositionSchema>;

// Export custom type for achievement display with progress
export type AchievementWithProgress = {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  points: number;
  progress: number;
  isCompleted: boolean;
  unlockedAt?: Date;
};
