import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { WalletAsset } from "@shared/schema";
import { formatCrypto, formatCurrency, createTransaction } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import QrCode from "qrcode";
import { CryptoIcon } from "./crypto-icon";

interface SendReceiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'send' | 'receive';
  userId: number;
}

export function SendReceiveDialog({ open, onOpenChange, type, userId }: SendReceiveDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Form state
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [networkFee, setNetworkFee] = useState<'slow' | 'medium' | 'fast'>('medium');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  
  // Queries
  const { data: assets } = useQuery<WalletAsset[]>({
    queryKey: [`/api/wallets/${userId}`],
  });
  
  // Find selected asset
  const selectedAsset = assets?.find(asset => asset.id === selectedAssetId);
  
  // Calculate USD value based on amount and selected asset
  const usdValue = selectedAsset && amount ? Number(amount) * selectedAsset.price : 0;
  
  // Calculate network fees based on selected asset
  const getNetworkFees = () => {
    if (!selectedAsset) return { slow: 0, medium: 0, fast: 0 };
    
    // Simplified fee calculation based on asset (in a real app, this would come from an API)
    const baseFee = selectedAsset.symbol === 'BTC' ? 0.00001 : 
                    selectedAsset.symbol === 'ETH' ? 0.001 : 0.01;
    
    return {
      slow: baseFee,
      medium: baseFee * 5,
      fast: baseFee * 10
    };
  };
  
  const fees = getNetworkFees();
  
  // Reset form when dialog opens/closes or type changes
  useEffect(() => {
    if (open) {
      setSelectedAssetId(assets?.[0]?.id || null);
      setRecipientAddress('');
      setAmount('');
      setNetworkFee('medium');
      
      // For receive dialog, generate address and QR code
      if (type === 'receive' && selectedAsset) {
        const address = generateWalletAddress(selectedAsset.symbol);
        setWalletAddress(address);
        generateQrCode(address);
      }
    }
  }, [open, type, assets, selectedAsset]);
  
  // Generate QR code when wallet address changes
  useEffect(() => {
    if (type === 'receive' && walletAddress) {
      generateQrCode(walletAddress);
    }
  }, [walletAddress, type]);
  
  // Generate QR code for wallet address
  const generateQrCode = async (address: string) => {
    try {
      const dataUrl = await QrCode.toDataURL(address);
      setQrCodeUrl(dataUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };
  
  // Generate mock wallet address based on asset symbol
  const generateWalletAddress = (symbol: string) => {
    switch (symbol) {
      case 'BTC':
        return '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';
      case 'ETH':
        return '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
      case 'SOL':
        return 'So11111111111111111111111111111111111111112';
      default:
        return `${symbol}123456789ABCDEFGH`;
    }
  };
  
  // Set maximum amount
  const handleSetMaxAmount = () => {
    if (selectedAsset) {
      setAmount(selectedAsset.balance.toString());
    }
  };
  
  // Handle form submission
  const handleSendTransaction = async () => {
    if (!selectedAsset || !amount || !recipientAddress) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than zero.",
        variant: "destructive",
      });
      return;
    }
    
    if (amountValue > selectedAsset.balance) {
      toast({
        title: "Insufficient balance",
        description: `You only have ${formatCrypto(selectedAsset.balance, selectedAsset.symbol)} available.`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create transaction in the backend
      await createTransaction({
        userId,
        assetId: selectedAsset.id,
        type: 'send',
        amount: amountValue,
        toAddress: recipientAddress,
        fee: fees[networkFee],
        status: 'completed'
      });
      
      // Invalidate queries to refresh data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [`/api/wallets/${userId}`] }),
        queryClient.invalidateQueries({ queryKey: [`/api/transactions/${userId}`] }),
        queryClient.invalidateQueries({ queryKey: [`/api/portfolio/${userId}`] })
      ]);
      
      // Show success toast
      toast({
        title: "Transaction sent",
        description: `${formatCrypto(amountValue, selectedAsset.symbol)} has been sent successfully.`,
      });
      
      // Close dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to send transaction:', error);
      toast({
        title: "Transaction failed",
        description: "There was an error processing your transaction. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === 'send' ? 'Send Cryptocurrency' : 'Receive Cryptocurrency'}
          </DialogTitle>
        </DialogHeader>
        
        {type === 'send' ? (
          /* Send Form */
          <div className="space-y-4">
            <div>
              <Label htmlFor="asset">Select Asset</Label>
              <Select
                value={selectedAssetId?.toString() || ''}
                onValueChange={(value) => setSelectedAssetId(Number(value))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an asset" />
                </SelectTrigger>
                <SelectContent>
                  {assets?.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id.toString()}>
                      <div className="flex items-center">
                        <CryptoIcon symbol={asset.symbol} name={asset.name} size="sm" />
                        <span className="ml-2">
                          {asset.name} ({asset.symbol}) - {formatCrypto(asset.balance, asset.symbol)} Available
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="recipient">Recipient Address</Label>
              <div className="flex">
                <Input
                  id="recipient"
                  placeholder="Enter wallet address"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" className="ml-2 px-3">
                  <i className="ri-qr-code-line text-neutral-600"></i>
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <Input
                  id="amount"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pr-16"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="text-neutral-500">{selectedAsset?.symbol || ''}</span>
                </div>
              </div>
              <div className="flex justify-between mt-1 text-xs">
                <span className="text-neutral-500">≈ {formatCurrency(usdValue)}</span>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary text-xs"
                  onClick={handleSetMaxAmount}
                >
                  MAX
                </Button>
              </div>
            </div>
            
            <div>
              <Label>Network Fee</Label>
              <RadioGroup 
                value={networkFee} 
                onValueChange={(value) => setNetworkFee(value as 'slow' | 'medium' | 'fast')}
                className="flex space-x-2 mt-2"
              >
                <div className={`flex-1 p-3 rounded-lg text-center border ${networkFee === 'slow' ? 'border-primary bg-primary/10' : 'bg-neutral-100 border-transparent'}`}>
                  <RadioGroupItem value="slow" id="slow" className="sr-only" />
                  <Label htmlFor="slow" className="block cursor-pointer">
                    <div className="text-sm font-medium">Slow</div>
                    <div className="text-xs text-neutral-500">~30 min</div>
                    <div className="text-sm font-medium mt-1">
                      {selectedAsset ? formatCrypto(fees.slow, selectedAsset.symbol) : '0.00000'}
                    </div>
                  </Label>
                </div>
                
                <div className={`flex-1 p-3 rounded-lg text-center border ${networkFee === 'medium' ? 'border-primary bg-primary/10' : 'bg-neutral-100 border-transparent'}`}>
                  <RadioGroupItem value="medium" id="medium" className="sr-only" />
                  <Label htmlFor="medium" className="block cursor-pointer">
                    <div className="text-sm font-medium">Medium</div>
                    <div className="text-xs text-neutral-500">~15 min</div>
                    <div className="text-sm font-medium mt-1">
                      {selectedAsset ? formatCrypto(fees.medium, selectedAsset.symbol) : '0.00000'}
                    </div>
                  </Label>
                </div>
                
                <div className={`flex-1 p-3 rounded-lg text-center border ${networkFee === 'fast' ? 'border-primary bg-primary/10' : 'bg-neutral-100 border-transparent'}`}>
                  <RadioGroupItem value="fast" id="fast" className="sr-only" />
                  <Label htmlFor="fast" className="block cursor-pointer">
                    <div className="text-sm font-medium">Fast</div>
                    <div className="text-xs text-neutral-500">~5 min</div>
                    <div className="text-sm font-medium mt-1">
                      {selectedAsset ? formatCrypto(fees.fast, selectedAsset.symbol) : '0.00000'}
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="submit" onClick={handleSendTransaction}>Send Transaction</Button>
            </DialogFooter>
          </div>
        ) : (
          /* Receive Form */
          <div className="space-y-4">
            <div>
              <Label htmlFor="receive-asset">Select Asset</Label>
              <Select
                value={selectedAssetId?.toString() || ''}
                onValueChange={(value) => {
                  setSelectedAssetId(Number(value));
                  const asset = assets?.find(a => a.id === Number(value));
                  if (asset) {
                    const address = generateWalletAddress(asset.symbol);
                    setWalletAddress(address);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an asset" />
                </SelectTrigger>
                <SelectContent>
                  {assets?.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id.toString()}>
                      <div className="flex items-center">
                        <CryptoIcon symbol={asset.symbol} name={asset.name} size="sm" />
                        <span className="ml-2">{asset.name} ({asset.symbol})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedAsset && (
              <>
                <div className="flex justify-center">
                  {qrCodeUrl && (
                    <img 
                      src={qrCodeUrl} 
                      alt={`QR code for ${selectedAsset.symbol} address`} 
                      className="w-48 h-48 border border-neutral-200 rounded-lg"
                    />
                  )}
                </div>
                
                <div>
                  <Label htmlFor="wallet-address">Your {selectedAsset.name} Address</Label>
                  <div className="flex mt-1">
                    <Input
                      id="wallet-address"
                      value={walletAddress}
                      readOnly
                      className="flex-1 text-sm font-mono"
                    />
                    <Button 
                      variant="outline" 
                      className="ml-2 px-3"
                      onClick={() => {
                        navigator.clipboard.writeText(walletAddress);
                        toast({
                          title: "Address copied",
                          description: "Wallet address copied to clipboard",
                        });
                      }}
                    >
                      <i className="ri-file-copy-line text-neutral-600"></i>
                    </Button>
                  </div>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                  <div className="flex items-start">
                    <i className="ri-information-line mt-0.5 mr-2"></i>
                    <div>
                      <p className="font-medium">Important</p>
                      <p className="mt-1">Only send {selectedAsset.symbol} to this address. Sending any other cryptocurrency may result in permanent loss.</p>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            <DialogFooter className="mt-6">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
