import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { ArrowDownUp, Info, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

// نوع البيانات للعملة المشفرة
interface Token {
  id: number;
  symbol: string;
  name: string;
  icon: string;
  price: number;
  balance?: number;
}

// نوع بيانات معلومات التبادل
interface SwapInfo {
  exchangeRate: number;
  networkFee: number;
  slippage: number;
  minReceived: number;
  priceImpact: number;
}

interface TokenSwapProps {
  userId?: number;
}

export default function TokenSwap({ userId }: TokenSwapProps) {
  const { getText } = useLanguage();
  const { toast } = useToast();
  
  // حالة النموذج
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState<string>("0");
  const [toAmount, setToAmount] = useState<string>("0");
  const [slippage, setSlippage] = useState<number>(0.5);
  const [swapInfo, setSwapInfo] = useState<SwapInfo | null>(null);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  
  // استعلام لجلب قائمة العملات المتاحة
  const { data: tokens, isLoading: isTokensLoading } = useQuery<Token[]>({
    queryKey: ["/api/assets"],
    staleTime: 60000, // تحديث كل دقيقة
  });
  
  // استعلام لجلب أرصدة المحفظة
  const { data: walletAssets, isLoading: isWalletLoading } = useQuery({
    queryKey: ["/api/wallets/current"],
    staleTime: 60000,
  });
  
  // تحديث قيمة العملة المستلمة عند تغيير قيمة العملة المرسلة
  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      const fromValue = parseFloat(fromAmount) || 0;
      const exchangeRate = fromToken.price / toToken.price;
      const calculatedToAmount = fromValue * exchangeRate;
      
      // تطبيق رسوم الشبكة والانزلاق
      const networkFee = 0.001; // 0.1% رسوم الشبكة
      const networkFeeAmount = fromValue * networkFee;
      const slippageAmount = calculatedToAmount * (slippage / 100);
      const minReceived = calculatedToAmount - slippageAmount;
      
      // حساب تأثير السعر
      const priceImpact = Math.min(fromValue / 1000, 0.5); // تأثير السعر المحاكى
      
      setToAmount(calculatedToAmount.toFixed(6));
      setSwapInfo({
        exchangeRate,
        networkFee: networkFeeAmount,
        slippage,
        minReceived,
        priceImpact,
      });
    } else {
      setToAmount("0");
      setSwapInfo(null);
    }
  }, [fromToken, toToken, fromAmount, slippage]);
  
  // تبديل العملات
  const handleSwapTokens = () => {
    const tempToken = fromToken;
    const tempAmount = fromAmount;
    
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(tempAmount);
  };
  
  // التحقق من صحة المدخلات
  const validateInputs = (): boolean => {
    if (!fromToken || !toToken) {
      toast({
        title: getText("selectTokens"),
        description: getText("pleaseSelectBothTokens"),
        variant: "destructive",
      });
      return false;
    }
    
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast({
        title: getText("invalidAmount"),
        description: getText("pleaseEnterValidAmount"),
        variant: "destructive",
      });
      return false;
    }
    
    // التحقق من وجود رصيد كافي
    const userBalance = fromToken.balance || 0;
    if (parseFloat(fromAmount) > userBalance) {
      toast({
        title: getText("insufficientBalance"),
        description: getText("youDontHaveEnoughBalance"),
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  // تنفيذ عملية التبادل
  const handleSwap = async () => {
    if (!validateInputs()) return;
    
    setIsSwapping(true);
    
    try {
      // في الإصدار النهائي، هنا سيتم الاتصال بالـ API لإجراء عملية التبادل
      // محاكاة الاتصال بالشبكة
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      toast({
        title: getText("swapSuccessful"),
        description: `${fromAmount} ${fromToken?.symbol} → ${toAmount} ${toToken?.symbol}`,
      });
      
      // إعادة تعيين النموذج
      setFromAmount("0");
      setToAmount("0");
      
    } catch (error) {
      toast({
        title: getText("swapFailed"),
        description: getText("anErrorOccurredDuringSwap"),
        variant: "destructive",
      });
    } finally {
      setIsSwapping(false);
    }
  };
  
  // حساب نسبة الرصيد المستخدمة
  const calculatePercentage = (percentage: number) => {
    if (!fromToken || !fromToken.balance) return;
    
    const amount = (fromToken.balance * percentage) / 100;
    setFromAmount(amount.toString());
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{getText("swapTokens")}</CardTitle>
        <CardDescription>
          {getText("swapTokensDescription")}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* العملة المرسلة */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">
              {getText("from")}
            </label>
            {fromToken && fromToken.balance !== undefined && (
              <span className="text-sm text-muted-foreground">
                {getText("balance")}: {fromToken.balance} {fromToken.symbol}
              </span>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Select
              value={fromToken?.id.toString()}
              onValueChange={(value) => {
                const selectedToken = tokens?.find(
                  (t) => t.id.toString() === value
                );
                setFromToken(selectedToken || null);
              }}
            >
              <SelectTrigger className="w-[140px]">
                {isTokensLoading ? (
                  <Skeleton className="h-5 w-20" />
                ) : (
                  <SelectValue placeholder={getText("selectToken")} />
                )}
              </SelectTrigger>
              <SelectContent>
                {tokens?.map((token) => (
                  <SelectItem key={token.id} value={token.id.toString()}>
                    <div className="flex items-center">
                      <div className="w-5 h-5 mr-2">
                        <img
                          src={token.icon}
                          alt={token.symbol}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span>{token.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1"
            />
          </div>
          
          {/* أزرار النسبة المئوية */}
          {fromToken && fromToken.balance && (
            <div className="flex justify-between mt-2">
              {[25, 50, 75, 100].map((percent) => (
                <Button
                  key={percent}
                  variant="outline"
                  size="sm"
                  onClick={() => calculatePercentage(percent)}
                  className="text-xs h-7 px-2"
                >
                  {percent}%
                </Button>
              ))}
            </div>
          )}
        </div>
        
        {/* زر التبديل */}
        <div className="flex justify-center my-2">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={handleSwapTokens}
            className="rounded-full h-8 w-8"
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>
        
        {/* العملة المستلمة */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {getText("to")}
          </label>
          <div className="flex space-x-2">
            <Select
              value={toToken?.id.toString()}
              onValueChange={(value) => {
                const selectedToken = tokens?.find(
                  (t) => t.id.toString() === value
                );
                setToToken(selectedToken || null);
              }}
            >
              <SelectTrigger className="w-[140px]">
                {isTokensLoading ? (
                  <Skeleton className="h-5 w-20" />
                ) : (
                  <SelectValue placeholder={getText("selectToken")} />
                )}
              </SelectTrigger>
              <SelectContent>
                {tokens?.map((token) => (
                  <SelectItem key={token.id} value={token.id.toString()}>
                    <div className="flex items-center">
                      <div className="w-5 h-5 mr-2">
                        <img
                          src={token.icon}
                          alt={token.symbol}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span>{token.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              type="number"
              value={toAmount}
              readOnly
              placeholder="0.00"
              className="flex-1 bg-muted"
            />
          </div>
        </div>
        
        {/* معلومات التبادل */}
        {swapInfo && (
          <div className="mt-4 p-3 bg-muted rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{getText("exchangeRate")}</span>
              <span>
                1 {fromToken?.symbol} ≈ {swapInfo.exchangeRate.toFixed(6)} {toToken?.symbol}
              </span>
            </div>
            
            <div className="flex justify-between">
              <div className="flex items-center">
                <span className="text-muted-foreground">{getText("priceImpact")}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getText("priceImpactDescription")}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className={swapInfo.priceImpact > 0.1 ? "text-yellow-500" : "text-green-500"}>
                {(swapInfo.priceImpact * 100).toFixed(2)}%
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">{getText("networkFee")}</span>
              <span>
                {swapInfo.networkFee.toFixed(6)} {fromToken?.symbol}
              </span>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full mt-1 text-xs">
                  {getText("advancedSettings")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{getText("advancedSettings")}</DialogTitle>
                  <DialogDescription>
                    {getText("adjustAdvancedSwapSettings")}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {getText("slippageTolerance")}
                    </label>
                    <div className="flex space-x-2">
                      {[0.1, 0.5, 1, 3].map((value) => (
                        <Button
                          key={value}
                          variant={slippage === value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSlippage(value)}
                        >
                          {value}%
                        </Button>
                      ))}
                      <Input
                        type="number"
                        value={slippage}
                        onChange={(e) => setSlippage(parseFloat(e.target.value) || 0.5)}
                        min="0.1"
                        max="50"
                        step="0.1"
                        className="w-20"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between text-sm">
                      <span>{getText("minimumReceived")}</span>
                      <span>
                        {swapInfo.minReceived.toFixed(6)} {toToken?.symbol}
                      </span>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex-col space-y-2">
        <Button
          onClick={handleSwap}
          className="w-full"
          disabled={isSwapping || !fromToken || !toToken || parseFloat(fromAmount) <= 0}
        >
          {isSwapping ? (
            <>
              <span className="animate-pulse mr-2">
                {getText("swapping")}...
              </span>
              <Progress value={45} className="h-1 w-10" />
            </>
          ) : (
            getText("swapButton")
          )}
        </Button>
        
        {fromToken && toToken && (
          <span className="text-xs text-muted-foreground text-center">
            {getText("swapExactAmountFor")} {fromAmount} {fromToken.symbol} {getText("exchangeFor")} {toAmount} {toToken.symbol}
          </span>
        )}
      </CardFooter>
    </Card>
  );
}