import { apiRequest } from "./queryClient";
import { InsertTransaction } from "@shared/schema";

// Function to refresh market data
export async function refreshMarketData() {
  try {
    const response = await apiRequest("GET", "/api/market/refresh", undefined);
    return await response.json();
  } catch (error) {
    console.error("Failed to refresh market data:", error);
    throw error;
  }
}

// Function to create a transaction
export async function createTransaction(transaction: InsertTransaction) {
  try {
    const response = await apiRequest("POST", "/api/transactions", transaction);
    return await response.json();
  } catch (error) {
    console.error("Failed to create transaction:", error);
    throw error;
  }
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Format crypto amounts
export function formatCrypto(amount: number, symbol: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 8
  });
  
  return `${formatter.format(amount)} ${symbol}`;
}

// Format percent
export function formatPercent(percent: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    signDisplay: 'always'
  }).format(percent / 100);
}

// Format date
export function formatDate(dateInput: Date | string | number): string {
  // تحويل التاريخ إلى كائن Date إذا لم يكن كذلك بالفعل
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  try {
    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  } catch (error) {
    console.error("Error formatting date:", error, dateInput);
    return "Invalid date";
  }
}
