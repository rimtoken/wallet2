import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { Shield, Wallet, AlertCircle, ExternalLink, Check, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// استيراد أيقونات لمحافظ مختلفة
import metamaskIcon from "@assets/sociel.png";
import trustWalletIcon from "@assets/سبيس.JPG";
import coinbaseWalletIcon from "@assets/rim.jpg";
import phantomIcon from "@assets/jp.png";

interface Web3WalletProviderProps {
  name: string;
  icon: string;
  description: string;
  type: "ethereum" | "solana" | "binance" | "polygon" | "multi";
  isPopular: boolean;
}

// قائمة محافظ Web3 المدعومة
const SUPPORTED_WALLETS: Web3WalletProviderProps[] = [
  {
    name: "MetaMask",
    icon: metamaskIcon,
    description: "Connect to your MetaMask wallet",
    type: "ethereum",
    isPopular: true
  },
  {
    name: "Trust Wallet",
    icon: trustWalletIcon,
    description: "Connect to your Trust Wallet",
    type: "multi",
    isPopular: true
  },
  {
    name: "Coinbase Wallet",
    icon: coinbaseWalletIcon,
    description: "Connect to your Coinbase Wallet",
    type: "multi",
    isPopular: true
  },
  {
    name: "Phantom",
    icon: phantomIcon,
    description: "Connect to your Phantom wallet",
    type: "solana",
    isPopular: false
  }
];

interface EnhancedWalletConnectorProps {
  onWalletConnect?: (address: string, provider: string, chainId: string) => void;
}

export default function EnhancedWalletConnector({ onWalletConnect }: EnhancedWalletConnectorProps) {
  const { getText, language } = useLanguage();
  const { toast } = useToast();
  const [selectedWallet, setSelectedWallet] = useState<Web3WalletProviderProps | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [walletChain, setWalletChain] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // محاكاة محافظ متصلة مسبقاً (يمكن استبدالها بتخزين محلي أو قاعدة بيانات)
  const [connectedWallets, setConnectedWallets] = useState<{ 
    address: string; 
    provider: string; 
    chainId: string;
    connectedAt: Date;
  }[]>([]);
  
  // استدعاء محاكي اتصال المحفظة
  const handleConnectWallet = async (wallet: Web3WalletProviderProps) => {
    setSelectedWallet(wallet);
    setConnectingWallet(true);
    
    try {
      // محاكاة تأخير الاتصال
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // محاكاة عنوان المحفظة وسلسلة الكتل
      let address = "";
      let chainId = "";
      
      switch (wallet.type) {
        case "ethereum":
          address = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");
          chainId = "1"; // Ethereum Mainnet
          break;
        case "solana":
          address = Array(44).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");
          chainId = "solana"; // Solana Mainnet
          break;
        case "binance":
          address = "bnb" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");
          chainId = "56"; // BSC Mainnet
          break;
        case "polygon":
          address = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");
          chainId = "137"; // Polygon Mainnet
          break;
        case "multi":
          address = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join("");
          chainId = "1"; // Default to Ethereum
          break;
      }
      
      setWalletAddress(address);
      setWalletChain(chainId);
      
      // إضافة المحفظة المتصلة إلى القائمة
      const newWalletConnection = {
        address,
        provider: wallet.name,
        chainId,
        connectedAt: new Date()
      };
      
      setConnectedWallets([...connectedWallets, newWalletConnection]);
      
      // إشعار نجاح الاتصال
      toast({
        title: getText("walletConnectedSuccessfully"),
        description: getText("yourWalletIsNowConnected"),
      });
      
      // استدعاء معالج الاتصال إذا تم توفيره
      if (onWalletConnect) {
        onWalletConnect(address, wallet.name, chainId);
      }
      
      setIsDialogOpen(false);
      
    } catch (error) {
      toast({
        title: getText("walletConnectionFailed"),
        description: getText("failedToConnectWallet"),
        variant: "destructive",
      });
    } finally {
      setConnectingWallet(false);
    }
  };
  
  // نسخ عنوان المحفظة إلى الحافظة
  const copyAddressToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: getText("addressCopied"),
      description: getText("walletAddressCopiedToClipboard"),
    });
  };
  
  // فصل المحفظة
  const disconnectWallet = (address: string) => {
    setConnectedWallets(connectedWallets.filter(wallet => wallet.address !== address));
    
    toast({
      title: getText("walletDisconnected"),
      description: getText("walletDisconnectedSuccessfully"),
    });
    
    if (walletAddress === address) {
      setWalletAddress("");
      setWalletChain("");
      setSelectedWallet(null);
    }
  };
  
  // تنسيق عنوان المحفظة للعرض
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
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
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{getText("connectWallet")}</CardTitle>
          <CardDescription>{getText("connectYourWeb3Wallet")}</CardDescription>
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
                        onClick={() => handleConnectWallet(wallet)}
                        disabled={connectingWallet}
                      >
                        <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                          <img src={wallet.icon} alt={wallet.name} className="h-full w-full object-cover" />
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
                        onClick={() => handleConnectWallet(wallet)}
                        disabled={connectingWallet}
                      >
                        <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                          <img src={wallet.icon} alt={wallet.name} className="h-full w-full object-cover" />
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
                    {getText("web3SecurityNote")}
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
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img
                          src={SUPPORTED_WALLETS.find(w => w.name === wallet.provider)?.icon || ""}
                          alt={wallet.provider}
                          className="h-full w-full object-cover"
                        />
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
                      <div className="text-xs text-muted-foreground mt-1">
                        {getChainName(wallet.chainId)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                      onClick={() => window.open(`https://etherscan.io/address/${wallet.address}`, "_blank")}
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