import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { apiRequest } from "@/lib/queryClient";

// أنواع المحافظ المدعومة
const WALLET_TYPES = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "M",
    supported: true,
    description: "أشهر محفظة للإيثيريوم والرموز المميزة ERC-20",
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "W",
    supported: true,
    description: "الاتصال بأي محفظة متوافقة مع بروتوكول WalletConnect",
  },
  {
    id: "phantom",
    name: "Phantom",
    icon: "P",
    supported: true,
    description: "محفظة شبكة سولانا",
  },
  {
    id: "binance",
    name: "Binance Wallet",
    icon: "B",
    supported: true,
    description: "محفظة بينانس للاتصال بشبكة BNB Chain",
  },
  {
    id: "trustwallet",
    name: "Trust Wallet",
    icon: "T",
    supported: false,
    description: "محفظة متعددة العملات قادمة قريباً",
  },
];

// مكون الاتصال بالمحفظة
export default function ConnectWallet() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const { toast } = useToast();
  const { getText } = useLanguage();
  const { user } = useAuth();

  // وظيفة محاكاة اتصال المحفظة
  // في التطبيق الحقيقي، يجب تنفيذ الاتصال الفعلي بالمحفظة باستخدام مكتبات مثل ethers.js أو web3.js
  const connectWallet = async (walletType: string) => {
    if (!user) {
      toast({
        title: getText("authRequired"),
        description: getText("pleaseLoginFirst"),
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    setSelectedWallet(walletType);

    try {
      // محاكاة تأخير الاتصال
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // إنشاء عنوان محفظة وهمي للعرض التوضيحي فقط
      // في التطبيق الحقيقي، سيتم الحصول على هذا من المحفظة الخارجية
      const mockAddress = "0x" + Math.random().toString(16).substring(2, 42);
      
      // حفظ المحفظة المتصلة في قاعدة البيانات
      await apiRequest("POST", "/api/connected-wallets", {
        userId: user.id,
        walletAddress: mockAddress,
        walletType: walletType,
        networkId: walletType === "phantom" ? 4 : 1, // سولانا أو إيثيريوم حسب نوع المحفظة
        name: WALLET_TYPES.find(w => w.id === walletType)?.name || walletType,
      });

      toast({
        title: getText("walletConnected"),
        description: `${getText("connectedTo")} ${walletType}. ${getText("walletAddress")}: ${mockAddress.substring(0, 6)}...${mockAddress.substring(38)}`,
      });
    } catch (error) {
      toast({
        title: getText("connectionFailed"),
        description: error instanceof Error ? error.message : getText("unknownError"),
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
      setSelectedWallet(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{getText("connectWallet")}</CardTitle>
        <CardDescription>{getText("connectWalletDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WALLET_TYPES.map((wallet) => (
            <Dialog key={wallet.id}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  disabled={!wallet.supported}
                >
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {wallet.icon}
                    </div>
                    <div className="text-start">
                      <div className="font-medium">{wallet.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {wallet.supported ? wallet.description : getText("comingSoon")}
                      </div>
                    </div>
                  </div>
                </Button>
              </DialogTrigger>
              {wallet.supported && (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{getText("connect")} {wallet.name}</DialogTitle>
                    <DialogDescription>
                      {getText("connectWalletDialogDescription")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex flex-col space-y-2 text-center items-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                        {wallet.icon}
                      </div>
                      <Label>{wallet.name}</Label>
                      <p className="text-sm text-muted-foreground max-w-md">
                        {wallet.description}
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      className="w-full"
                      onClick={() => connectWallet(wallet.id)}
                      disabled={isConnecting}
                    >
                      {isConnecting && selectedWallet === wallet.id ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {getText("connecting")}
                        </span>
                      ) : (
                        getText("connect")
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              )}
            </Dialog>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 items-start">
        <div className="text-sm text-muted-foreground">
          {getText("walletSecurityNote")}
        </div>
      </CardFooter>
    </Card>
  );
}