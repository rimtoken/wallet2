import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { Shield, Wallet, ExternalLink, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// تعريف أنواع المحافظ المدعومة
interface WalletProvider {
  name: string;
  description: string;
  type: "ethereum" | "solana" | "binance" | "polygon" | "multi";
  isPopular: boolean;
  color: string;
  symbol: string;
}

// قائمة محافظ Web3 المدعومة
const SUPPORTED_WALLETS: WalletProvider[] = [
  {
    name: "MetaMask",
    symbol: "MM",
    description: "Connect to your MetaMask wallet",
    type: "ethereum",
    isPopular: true,
    color: "#E2761B"
  },
  {
    name: "Trust Wallet",
    symbol: "TW",
    description: "Connect to your Trust Wallet",
    type: "multi",
    isPopular: true,
    color: "#3375BB"
  },
  {
    name: "Coinbase Wallet",
    symbol: "CB",
    description: "Connect to your Coinbase Wallet",
    type: "multi",
    isPopular: true,
    color: "#0052FF"
  },
  {
    name: "Phantom",
    symbol: "PH",
    description: "Connect to your Phantom wallet",
    type: "solana",
    isPopular: true,
    color: "#4A46F0"
  },
  {
    name: "Binance Wallet",
    symbol: "BW",
    description: "Connect to your Binance Chain Wallet",
    type: "binance",
    isPopular: true,
    color: "#F0B90B"
  },
  {
    name: "Polygon Wallet",
    symbol: "PL",
    description: "Connect to your Polygon Wallet",
    type: "polygon",
    isPopular: false,
    color: "#8247E5"
  }
];

// نوع محفظة متصلة
interface ConnectedWallet {
  address: string;
  provider: string;
  providerColor: string;
  symbol: string;
  chainId: string;
  connectedAt: Date;
}

// الخصائص المتوقعة للمكون
interface MultiWalletConnectorProps {
  onWalletConnect?: (address: string, provider: string, chainId: string) => void;
}

export default function MultiWalletConnector({ onWalletConnect }: MultiWalletConnectorProps) {
  const { getText } = useLanguage();
  const { toast } = useToast();
  
  // حالة المكون
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<WalletProvider | null>(null);
  
  // محاكاة المحافظ المتصلة
  const [connectedWallets, setConnectedWallets] = useState<ConnectedWallet[]>([]);
  
  // محاكاة اتصال المحفظة
  const connectWallet = async (wallet: WalletProvider) => {
    setSelectedWallet(wallet);
    setConnectingWallet(true);
    
    try {
      // محاكاة تأخير اتصال الشبكة
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // توليد عنوان عشوائي لغرض العرض التوضيحي
      const address = generateRandomAddress(wallet.type);
      const chainId = getChainIdByType(wallet.type);
      
      // إضافة المحفظة إلى قائمة المحافظ المتصلة
      const newWallet: ConnectedWallet = {
        address,
        provider: wallet.name,
        providerColor: wallet.color,
        symbol: wallet.symbol,
        chainId,
        connectedAt: new Date()
      };
      
      setConnectedWallets(prev => [...prev, newWallet]);
      
      // إظهار إشعار النجاح
      toast({
        title: getText("walletConnectedSuccessfully"),
        description: getText("yourWalletIsNowConnected"),
      });
      
      // استدعاء معالج الاتصال الخارجي إن وجد
      if (onWalletConnect) {
        onWalletConnect(address, wallet.name, chainId);
      }
      
      // إغلاق نافذة الحوار
      setIsDialogOpen(false);
      
    } catch (error) {
      // إظهار إشعار الخطأ
      toast({
        title: getText("walletConnectionFailed"),
        description: getText("failedToConnectWallet"),
        variant: "destructive",
      });
    } finally {
      setConnectingWallet(false);
    }
  };
  
  // فصل المحفظة
  const disconnectWallet = (walletAddress: string) => {
    setConnectedWallets(prev => prev.filter(wallet => wallet.address !== walletAddress));
    
    toast({
      title: getText("walletDisconnected"),
      description: getText("walletDisconnectedSuccessfully"),
    });
  };
  
  // نسخ عنوان المحفظة إلى الحافظة
  const copyAddressToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    
    toast({
      title: getText("addressCopied"),
      description: getText("walletAddressCopiedToClipboard"),
    });
  };
  
  // تنسيق عنوان المحفظة للعرض المختصر
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // توليد عنوان عشوائي حسب نوع المحفظة
  const generateRandomAddress = (type: string) => {
    const randomHex = () => Math.floor(Math.random() * 16).toString(16);
    
    switch (type) {
      case "ethereum":
      case "polygon":
        return "0x" + Array(40).fill(0).map(randomHex).join("");
      case "solana":
        return Array(44).fill(0).map(randomHex).join("");
      case "binance":
        return "bnb" + Array(40).fill(0).map(randomHex).join("");
      case "multi":
      default:
        return "0x" + Array(40).fill(0).map(randomHex).join("");
    }
  };
  
  // الحصول على معرف السلسلة حسب النوع
  const getChainIdByType = (type: string) => {
    switch (type) {
      case "ethereum": return "1"; // Ethereum Mainnet
      case "solana": return "solana"; // Solana Mainnet
      case "binance": return "56"; // BSC Mainnet
      case "polygon": return "137"; // Polygon Mainnet
      case "multi": return "1"; // Default to Ethereum
      default: return "1";
    }
  };
  
  // تحديد اسم السلسلة من معرف السلسلة
  const getChainName = (chainId: string) => {
    switch (chainId) {
      case "1": return "Ethereum";
      case "56": return "BNB Chain";
      case "137": return "Polygon";
      case "solana": return "Solana";
      default: return chainId;
    }
  };
  
  // الحصول على رابط المستكشف حسب نوع المحفظة وعنوانها
  const getExplorerLink = (chainId: string, address: string) => {
    switch (chainId) {
      case "1": return `https://etherscan.io/address/${address}`;
      case "56": return `https://bscscan.com/address/${address}`;
      case "137": return `https://polygonscan.com/address/${address}`;
      case "solana": return `https://solscan.io/account/${address}`;
      default: return `https://etherscan.io/address/${address}`;
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{getText("connectWallet")}</CardTitle>
          <CardDescription>{getText("connectYourWalletDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Wallet className="mr-2 h-4 w-4" />
                {getText("connectWallet")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{getText("selectWallet")}</DialogTitle>
                <DialogDescription>
                  {getText("selectWalletDescription")}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="popular" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="popular">{getText("popularWallets")}</TabsTrigger>
                  <TabsTrigger value="all">{getText("allWallets")}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="popular" className="mt-4">
                  <div className="grid grid-cols-1 gap-4">
                    {SUPPORTED_WALLETS.filter(wallet => wallet.isPopular).map((wallet) => (
                      <Button
                        key={wallet.name}
                        variant="outline"
                        className="flex items-center justify-start h-16 px-4"
                        onClick={() => connectWallet(wallet)}
                        disabled={connectingWallet}
                      >
                        <div 
                          className="h-8 w-8 rounded-full flex items-center justify-center mr-3"
                          style={{ backgroundColor: wallet.color }}
                        >
                          <span className="text-white font-bold text-xs">{wallet.symbol}</span>
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{wallet.name}</div>
                          <div className="text-xs text-muted-foreground">{wallet.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="all" className="mt-4">
                  <div className="grid grid-cols-1 gap-4">
                    {SUPPORTED_WALLETS.map((wallet) => (
                      <Button
                        key={wallet.name}
                        variant="outline"
                        className="flex items-center justify-start h-16 px-4"
                        onClick={() => connectWallet(wallet)}
                        disabled={connectingWallet}
                      >
                        <div 
                          className="h-8 w-8 rounded-full flex items-center justify-center mr-3"
                          style={{ backgroundColor: wallet.color }}
                        >
                          <span className="text-white font-bold text-xs">{wallet.symbol}</span>
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{wallet.name}</div>
                          <div className="text-xs text-muted-foreground">{wallet.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              
              {connectingWallet && (
                <div className="text-center py-4">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p>{getText("connectingToWallet")}...</p>
                </div>
              )}
              
              <div className="bg-muted p-4 rounded-lg mt-4">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-muted-foreground mt-0.5 mr-2" />
                  <p className="text-sm text-muted-foreground">
                    {getText("walletSecurityNote")}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      
      {connectedWallets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{getText("connectedWallets")}</CardTitle>
            <CardDescription>{getText("manageYourConnectedWallets")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {connectedWallets.map((wallet) => (
                <div
                  key={wallet.address}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="mr-3">
                      <div 
                        className="h-10 w-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: wallet.providerColor }}
                      >
                        <span className="text-white font-bold">{wallet.symbol}</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{wallet.provider}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        {formatAddress(wallet.address)}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 ml-1"
                          onClick={() => copyAddressToClipboard(wallet.address)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <Badge variant="outline" className="mt-1">
                        {getChainName(wallet.chainId)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                      onClick={() => window.open(getExplorerLink(wallet.chainId, wallet.address), "_blank")}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      {getText("explore")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => disconnectWallet(wallet.address)}
                    >
                      {getText("disconnect")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              {connectedWallets.length} {getText("walletsConnected")}
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}