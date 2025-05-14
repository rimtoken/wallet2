import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getNetworkOptions, getProvider, BlockchainNetwork } from '@/lib/blockchain';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Clipboard } from 'lucide-react';

interface Wallet {
  network: BlockchainNetwork;
  address: string;
  privateKey: string;
  balance: number;
}

export function Web3Wallet() {
  const { toast } = useToast();
  const [selectedNetwork, setSelectedNetwork] = useState<BlockchainNetwork>('ethereum');
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [privateKey, setPrivateKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [selectedWalletIndex, setSelectedWalletIndex] = useState<number | null>(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [sendLoading, setSendLoading] = useState(false);
  
  const networkOptions = getNetworkOptions();
  
  // تحميل المحافظ من التخزين المحلي عند تحميل المكون
  useEffect(() => {
    const savedWallets = localStorage.getItem('rimtoken_wallets');
    if (savedWallets) {
      setWallets(JSON.parse(savedWallets));
    }
  }, []);
  
  // حفظ المحافظ في التخزين المحلي عند تحديثها
  useEffect(() => {
    if (wallets.length > 0) {
      localStorage.setItem('rimtoken_wallets', JSON.stringify(wallets));
    }
  }, [wallets]);
  
  // تحديث أرصدة المحافظ
  const updateBalances = async () => {
    const updatedWallets = await Promise.all(
      wallets.map(async (wallet) => {
        const provider = getProvider(wallet.network);
        const balance = await provider.getBalance(wallet.address);
        return { ...wallet, balance };
      })
    );
    
    setWallets(updatedWallets);
  };
  
  // تحديث الأرصدة عند تحميل المحافظ
  useEffect(() => {
    if (wallets.length > 0) {
      updateBalances();
    }
  }, [wallets.length]);
  
  // إنشاء محفظة جديدة
  const createNewWallet = async () => {
    try {
      setIsLoading(true);
      const provider = getProvider(selectedNetwork);
      const newWallet = await provider.createWallet();
      
      setWallets([
        ...wallets,
        {
          network: selectedNetwork,
          address: newWallet.address,
          privateKey: newWallet.privateKey,
          balance: 0
        }
      ]);
      
      toast({
        title: 'تم إنشاء المحفظة بنجاح!',
        description: `تم إنشاء محفظة ${provider.name} جديدة.`,
      });
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast({
        title: 'خطأ في إنشاء المحفظة',
        description: 'حدث خطأ أثناء إنشاء المحفظة. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // استيراد محفظة باستخدام المفتاح الخاص
  const importWallet = async () => {
    if (!privateKey) {
      toast({
        title: 'المفتاح الخاص مطلوب',
        description: 'يرجى إدخال المفتاح الخاص للمحفظة.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const provider = getProvider(selectedNetwork);
      const importedWallet = await provider.importWallet(privateKey);
      
      // التحقق مما إذا كانت المحفظة موجودة بالفعل
      const walletExists = wallets.some(
        wallet => wallet.address === importedWallet.address && wallet.network === selectedNetwork
      );
      
      if (walletExists) {
        toast({
          title: 'المحفظة موجودة بالفعل',
          description: 'هذه المحفظة موجودة بالفعل في قائمة محافظك.',
          variant: 'destructive',
        });
        return;
      }
      
      setWallets([
        ...wallets,
        {
          network: selectedNetwork,
          address: importedWallet.address,
          privateKey: importedWallet.privateKey,
          balance: 0
        }
      ]);
      
      toast({
        title: 'تم استيراد المحفظة بنجاح!',
        description: `تم استيراد محفظة ${provider.name}.`,
      });
      
      setPrivateKey('');
    } catch (error) {
      console.error('Error importing wallet:', error);
      toast({
        title: 'خطأ في استيراد المحفظة',
        description: 'حدث خطأ أثناء استيراد المحفظة. تأكد من صحة المفتاح الخاص.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // نسخ العنوان إلى الحافظة
  const copyToClipboard = (text: string, type: 'address' | 'privateKey') => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'تم النسخ!',
      description: type === 'address' ? 'تم نسخ العنوان إلى الحافظة.' : 'تم نسخ المفتاح الخاص إلى الحافظة.',
    });
  };
  
  // إرسال معاملة
  const sendTransaction = async () => {
    if (selectedWalletIndex === null) {
      return;
    }
    
    if (!recipient) {
      toast({
        title: 'العنوان المستلم مطلوب',
        description: 'يرجى إدخال عنوان المستلم.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'المبلغ غير صالح',
        description: 'يرجى إدخال مبلغ صالح أكبر من 0.',
        variant: 'destructive',
      });
      return;
    }
    
    const wallet = wallets[selectedWalletIndex];
    const provider = getProvider(wallet.network);
    
    // التحقق من صحة العنوان
    if (!provider.validateAddress(recipient)) {
      toast({
        title: 'عنوان غير صالح',
        description: `العنوان المدخل ليس عنوان ${provider.name} صالح.`,
        variant: 'destructive',
      });
      return;
    }
    
    // التحقق من الرصيد
    if (wallet.balance < parseFloat(amount)) {
      toast({
        title: 'رصيد غير كافي',
        description: `ليس لديك رصيد كافي من ${provider.coinSymbol} لإكمال هذه المعاملة.`,
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setSendLoading(true);
      
      const txHash = await provider.sendTransaction(
        wallet.privateKey,
        recipient,
        parseFloat(amount)
      );
      
      toast({
        title: 'تم إرسال المعاملة بنجاح!',
        description: `معرف المعاملة: ${txHash.substring(0, 10)}...`,
      });
      
      // تحديث الرصيد بعد المعاملة
      updateBalances();
      
      // إعادة تعيين الحقول
      setRecipient('');
      setAmount('');
    } catch (error) {
      console.error('Error sending transaction:', error);
      toast({
        title: 'خطأ في إرسال المعاملة',
        description: 'حدث خطأ أثناء إرسال المعاملة. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setSendLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">محفظة ويب 3</h2>
        <p className="text-sm text-gray-500">أنشئ أو استورد محافظ ويب 3 واتصل مباشرة بشبكات البلوكتشين المختلفة.</p>
      </div>
      
      <Tabs defaultValue="wallets">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="wallets">محافظي</TabsTrigger>
          <TabsTrigger value="create">إنشاء محفظة</TabsTrigger>
          <TabsTrigger value="import">استيراد محفظة</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wallets">
          <Card>
            <CardHeader>
              <CardTitle>محافظي</CardTitle>
              <CardDescription>عرض وإدارة جميع محافظ ويب 3 الخاصة بك.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {wallets.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500">ليس لديك أي محفظة حتى الآن. قم بإنشاء محفظة جديدة أو استيراد محفظة موجودة.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {wallets.map((wallet, index) => {
                    const provider = getProvider(wallet.network);
                    return (
                      <Card key={`${wallet.network}-${wallet.address}`} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <span className="font-semibold">{provider.shortName}</span>
                            </div>
                            <div>
                              <h3 className="font-medium">{provider.name}</h3>
                              <p className="text-xs text-gray-500 truncate max-w-[180px]">
                                {wallet.address}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {wallet.balance.toFixed(6)} {provider.coinSymbol}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs h-6 px-2" 
                              onClick={() => copyToClipboard(wallet.address, 'address')}
                            >
                              <Clipboard className="h-3 w-3 mr-1" /> نسخ العنوان
                            </Button>
                          </div>
                        </div>
                        <div className="flex mt-3 space-x-2 justify-end">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="secondary" size="sm">عرض التفاصيل</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>تفاصيل المحفظة</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <Label>الشبكة</Label>
                                  <div className="mt-1 font-medium">{provider.name}</div>
                                </div>
                                <div>
                                  <Label>العنوان</Label>
                                  <div className="flex items-center mt-1">
                                    <div className="bg-gray-100 p-2 rounded text-xs overflow-x-auto w-full">
                                      {wallet.address}
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyToClipboard(wallet.address, 'address')}
                                      className="ml-2"
                                    >
                                      <Clipboard size={16} />
                                    </Button>
                                  </div>
                                </div>
                                <div>
                                  <Label>المفتاح الخاص</Label>
                                  <div className="flex items-center mt-1">
                                    <div className="bg-gray-100 p-2 rounded text-xs overflow-x-auto w-full">
                                      {showPrivateKey ? wallet.privateKey : '• • • • • • • • • • • • • • • • • • • •'}
                                    </div>
                                    <div className="flex flex-col ml-2 space-y-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowPrivateKey(!showPrivateKey)}
                                      >
                                        {showPrivateKey ? 'إخفاء' : 'عرض'}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(wallet.privateKey, 'privateKey')}
                                      >
                                        <Clipboard size={16} />
                                      </Button>
                                    </div>
                                  </div>
                                  <p className="text-xs text-red-500 mt-1">
                                    تحذير: لا تشارك مفتاحك الخاص أبدًا مع أي شخص، فمن يمتلك مفتاحك الخاص يمكنه الوصول الكامل إلى أموالك!
                                  </p>
                                </div>
                                <div>
                                  <Label>الرصيد</Label>
                                  <div className="mt-1 font-medium">
                                    {wallet.balance.toFixed(6)} {provider.coinSymbol}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                onClick={() => setSelectedWalletIndex(index)}
                              >
                                إرسال
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>إرسال {provider.coinSymbol}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <Label htmlFor="recipient">عنوان المستلم</Label>
                                  <Input
                                    id="recipient"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    placeholder={`أدخل عنوان ${provider.name} للمستلم`}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="amount">المبلغ ({provider.coinSymbol})</Label>
                                  <Input
                                    id="amount"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.0"
                                    min="0"
                                    step="0.000001"
                                    className="mt-1"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    الرصيد: {wallet.balance.toFixed(6)} {provider.coinSymbol}
                                  </p>
                                </div>
                                <Button
                                  className="w-full"
                                  onClick={sendTransaction}
                                  disabled={sendLoading}
                                >
                                  {sendLoading ? 'جارٍ الإرسال...' : 'إرسال'}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={updateBalances}>
                تحديث الأرصدة
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>إنشاء محفظة جديدة</CardTitle>
              <CardDescription>قم بإنشاء محفظة ويب 3 جديدة على الشبكة التي تختارها.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="network">اختر الشبكة</Label>
                <Select 
                  value={selectedNetwork} 
                  onValueChange={(value) => setSelectedNetwork(value as BlockchainNetwork)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر شبكة" />
                  </SelectTrigger>
                  <SelectContent>
                    {networkOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <span>{option.label} ({option.shortName})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm">
                  عند إنشاء محفظة جديدة، سيتم إنشاء زوج مفاتيح جديد لك:
                </p>
                <ul className="text-sm list-disc list-inside space-y-1">
                  <li>
                    <span className="font-medium">العنوان العام (Public Address)</span>: يستخدم لاستقبال العملات المشفرة.
                  </li>
                  <li>
                    <span className="font-medium">المفتاح الخاص (Private Key)</span>: يستخدم للوصول إلى المحفظة وتوقيع المعاملات.
                  </li>
                </ul>
                <p className="text-sm font-medium text-red-500">
                  مهم: احتفظ بمفتاحك الخاص في مكان آمن، ولا تشاركه مع أي شخص. من يملك مفتاحك الخاص يمكنه الوصول إلى أموالك!
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={createNewWallet} disabled={isLoading} className="w-full">
                {isLoading ? 'جارٍ الإنشاء...' : 'إنشاء محفظة جديدة'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>استيراد محفظة موجودة</CardTitle>
              <CardDescription>استورد محفظة موجودة باستخدام مفتاحك الخاص.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="import-network">اختر الشبكة</Label>
                <Select 
                  value={selectedNetwork} 
                  onValueChange={(value) => setSelectedNetwork(value as BlockchainNetwork)}
                >
                  <SelectTrigger id="import-network">
                    <SelectValue placeholder="اختر شبكة" />
                  </SelectTrigger>
                  <SelectContent>
                    {networkOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <span>{option.label} ({option.shortName})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="privateKey">المفتاح الخاص</Label>
                <Input
                  id="privateKey"
                  type="password"
                  placeholder="أدخل المفتاح الخاص الخاص بك هنا"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                />
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium text-red-500">
                  تحذير: لا تشارك مفتاحك الخاص أبدًا مع أي شخص، حتى لو ادعى أنه من فريق دعم RimToken. نحن لن نطلب منك أبدًا مفتاحك الخاص.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={importWallet} disabled={isLoading} className="w-full">
                {isLoading ? 'جارٍ الاستيراد...' : 'استيراد المحفظة'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}