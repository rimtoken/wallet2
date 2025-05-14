import * as ethereum from './ethereum';
import * as solana from './solana';
import * as binance from './binance';

export type BlockchainNetwork = 'ethereum' | 'solana' | 'binance';

export interface BlockchainProvider {
  name: string;
  logo: string;
  shortName: string;
  coinSymbol: string;
  createWallet: () => Promise<{ address: string; privateKey: string }>;
  importWallet: (privateKey: string) => Promise<{ address: string; privateKey: string }>;
  getBalance: (address: string) => Promise<number>;
  getTransactionHistory: (address: string) => Promise<any[]>;
  sendTransaction: (privateKey: string, toAddress: string, amount: number) => Promise<string>;
  validateAddress: (address: string) => boolean;
}

export const supportedNetworks: Record<BlockchainNetwork, BlockchainProvider> = {
  ethereum: ethereum.provider,
  solana: solana.provider,
  binance: binance.provider
};

export const getProvider = (network: BlockchainNetwork): BlockchainProvider => {
  return supportedNetworks[network];
};

export const getNetworkOptions = () => {
  return Object.entries(supportedNetworks).map(([key, provider]) => ({
    value: key,
    label: provider.name,
    shortName: provider.shortName,
    logo: provider.logo
  }));
};