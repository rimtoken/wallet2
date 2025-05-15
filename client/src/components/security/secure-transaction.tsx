import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Link2,
  Info,
  ExternalLink,
  Fingerprint,
  Loader2,
  QrCode,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/api';

interface SecureTransactionProps {
  assetSymbol?: string;
  minAmount?: number;
  maxAmount?: number;
  fee?: number;
  onTransactionComplete?: (txHash: string) => void;
}

export function SecureTransaction({ 
  assetSymbol = 'ETH', 
  minAmount = 0.01, 
  maxAmount = 10,
  fee = 0.0025,
  onTransactionComplete
}: SecureTransactionProps) {
  const [amount, setAmount] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [transactionStep, setTransactionStep] = useState<number>(0);
  const [processing, setProcessing] = useState<boolean>(false);
  const [securityChecks, setSecurityChecks] = useState<{
    addressValidated: boolean;
    amountValidated: boolean;
    networkConfirmed: boolean;
    maliciousAddressCheck: boolean;
  }>({
    addressValidated: false,
    amountValidated: false,
    networkConfirmed: false,
    maliciousAddressCheck: false,
  });
  const [transactionHash, setTransactionHash] = useState<string>('');
  const [transactionWarnings, setTransactionWarnings] = useState<string[]>([]);
  
  // التحقق من صحة العنوان
  const validateAddress = (address: string): boolean => {
    // في تطبيق حقيقي، ستكون هناك تحققات أكثر تعقيدًا لكل شبكة
    if (assetSymbol === 'ETH' || assetSymbol === 'BNB') {
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    } else if (assetSymbol === 'SOL') {
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    }
    return address.length > 30;
  };
  
  // التحقق من المبلغ
  const validateAmount = (value: string): boolean => {
    const numVal = parseFloat(value);
    return !isNaN(numVal) && numVal >= minAmount && numVal <= maxAmount;
  };
  
  // تنفيذ فحوصات الأمان
  const runSecurityChecks = () => {
    setTransactionStep(1);
    setProcessing(true);
    
    // التحقق من صحة العنوان
    setTimeout(() => {
      const addressValid = validateAddress(recipientAddress);
      setSecurityChecks(prev => ({ ...prev, addressValidated: addressValid }));
      
      // إضافة تحذير إذا كان العنوان غير صالح
      if (!addressValid) {
        setTransactionWarnings(prev => [...prev, 'تنسيق العنوان غير صالح']);
      }
      
      // التحقق من صحة المبلغ
      setTimeout(() => {
        const amountValid = validateAmount(amount);
        setSecurityChecks(prev => ({ ...prev, amountValidated: amountValid }));
        
        // إضافة تحذير إذا كان المبلغ غير صالح
        if (!amountValid) {
          setTransactionWarnings(prev => [...prev, `المبلغ يجب أن يكون بين ${minAmount} و ${maxAmount} ${assetSymbol}`]);
        }
        
        // التحقق من الشبكة
        setTimeout(() => {
          setSecurityChecks(prev => ({ ...prev, networkConfirmed: true }));
          
          // فحص العنوان للتأكد من عدم وجوده في قائمة العناوين الضارة
          setTimeout(() => {
            // افتراض أن العنوان آمن
            const isSafe = true; // في تطبيق حقيقي، سيتم التحقق من قواعد بيانات العناوين الضارة
            setSecurityChecks(prev => ({ ...prev, maliciousAddressCheck: isSafe }));
            
            setProcessing(false);
          }, 800);
        }, 800);
      }, 800);
    }, 800);
  };
  
  // الانتقال إلى التأكيد النهائي
  const proceedToConfirmation = () => {
    // التحقق من جميع فحوصات الأمان
    const allChecksValid = Object.values(securityChecks).every(check => check);
    
    if (allChecksValid && transactionWarnings.length === 0) {
      setTransactionStep(2);
    } else {
      // إذا كانت هناك تحذيرات ولكن جميع الفحوصات صالحة، اطلب تأكيدًا إضافيًا
      if (allChecksValid && transactionWarnings.length > 0) {
        const shouldProceed = window.confirm("هناك بعض التحذيرات. هل أنت متأكد من أنك تريد المتابعة؟");
        if (shouldProceed) {
          setTransactionStep(2);
        }
      }
    }
  };
  
  // تنفيذ المعاملة
  const executeTransaction = () => {
    setProcessing(true);
    
    // محاكاة تنفيذ المعاملة
    setTimeout(() => {
      // توليد هاش معاملة وهمي
      const txHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setTransactionHash(txHash);
      setTransactionStep(3);
      setProcessing(false);
      
      if (onTransactionComplete) {
        onTransactionComplete(txHash);
      }
    }, 3000);
  };
  
  // نسخ هاش المعاملة إلى الحافظة
  const copyTransactionHash = () => {
    navigator.clipboard.writeText(transactionHash);
    alert('تم نسخ هاش المعاملة');
  };
  
  // إعادة تعيين النموذج
  const resetForm = () => {
    setAmount('');
    setRecipientAddress('');
    setTransactionStep(0);
    setProcessing(false);
    setSecurityChecks({
      addressValidated: false,
      amountValidated: false,
      networkConfirmed: false,
      maliciousAddressCheck: false,
    });
    setTransactionHash('');
    setTransactionWarnings([]);
  };
  
  // رابط المعاملة (في تطبيق حقيقي، سيكون هذا رابطًا إلى مستكشف البلوكتشين)
  const getTransactionExplorerUrl = () => {
    if (assetSymbol === 'ETH') {
      return `https://etherscan.io/tx/${transactionHash}`;
    } else if (assetSymbol === 'BNB') {
      return `https://bscscan.com/tx/${transactionHash}`;
    } else if (assetSymbol === 'SOL') {
      return `https://solscan.io/tx/${transactionHash}`;
    }
    return '#';
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>إرسال {assetSymbol} بشكل آمن</span>
          <Badge variant="outline" className="gap-1.5">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span>معاملة آمنة</span>
          </Badge>
        </CardTitle>
        <CardDescription>
          إرسال العملات المشفرة مع فحوصات أمان متقدمة وحماية من الاحتيال
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {transactionStep === 0 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">المبلغ ({assetSymbol})</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`${minAmount} - ${maxAmount}`}
                min={minAmount}
                max={maxAmount}
                step="0.001"
              />
              <p className="text-xs text-muted-foreground">
                الحد الأدنى: {minAmount} {assetSymbol} | الحد الأقصى: {maxAmount} {assetSymbol}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recipientAddress">عنوان المستلم</Label>
              <Input
                id="recipientAddress"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder={`أدخل عنوان ${assetSymbol}`}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>رسوم المعاملة:</span>
                <span>{fee} {assetSymbol}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span>المجموع المقدر:</span>
                <span className="font-medium">
                  {!isNaN(parseFloat(amount)) ? (parseFloat(amount) + fee).toFixed(4) : fee} {assetSymbol}
                </span>
              </div>
            </div>
            
            <Button 
              onClick={runSecurityChecks} 
              disabled={!amount || !recipientAddress}
              className="w-full mt-2"
            >
              فحص أمان وإرسال
            </Button>
            
            <Alert className="mt-2 bg-muted border-muted-foreground/20">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                يقوم RimToken بفحص أمني متقدم للمعاملات للحماية من عمليات الاحتيال والمعاملات الضارة.
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {transactionStep === 1 && (
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            
            <h3 className="text-lg font-medium text-center mb-4">جاري التحقق من أمان المعاملة</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  التحقق من صحة العنوان
                </span>
                {processing && !securityChecks.addressValidated ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  securityChecks.addressValidated ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  التحقق من المبلغ
                </span>
                {processing && !securityChecks.amountValidated ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  securityChecks.amountValidated ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  التأكد من توافق الشبكة
                </span>
                {processing && !securityChecks.networkConfirmed ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  securityChecks.networkConfirmed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  فحص العنوان المشبوه
                </span>
                {processing && !securityChecks.maliciousAddressCheck ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  securityChecks.maliciousAddressCheck ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )
                )}
              </div>
            </div>
            
            {transactionWarnings.length > 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>تحذيرات</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    {transactionWarnings.map((warning, index) => (
                      <li key={index} className="text-sm">{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={resetForm} disabled={processing}>
                عودة
              </Button>
              <Button 
                onClick={proceedToConfirmation} 
                disabled={processing || !Object.values(securityChecks).every(check => check)}
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {processing ? 'جاري التحقق...' : 'متابعة'}
              </Button>
            </div>
          </div>
        )}
        
        {transactionStep === 2 && (
          <div className="space-y-4">
            <Alert className="border-primary/30 text-primary bg-primary/10">
              <Info className="h-4 w-4" />
              <AlertTitle>تأكيد المعاملة</AlertTitle>
              <AlertDescription>
                أنت على وشك إرسال {amount} {assetSymbol} (+ {fee} {assetSymbol} رسوم) إلى العنوان التالي:
              </AlertDescription>
            </Alert>
            
            <div className="border rounded-lg p-3 break-all text-sm font-mono">
              {recipientAddress}
            </div>
            
            <div className="space-y-2 border rounded-lg p-4">
              <h4 className="font-medium">تفاصيل المعاملة</h4>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">المبلغ:</div>
                <div className="font-medium">{amount} {assetSymbol}</div>
                
                <div className="text-muted-foreground">رسوم المعاملة:</div>
                <div className="font-medium">{fee} {assetSymbol}</div>
                
                <div className="text-muted-foreground">المجموع:</div>
                <div className="font-medium">{(parseFloat(amount) + fee).toFixed(4)} {assetSymbol}</div>
                
                <div className="text-muted-foreground">الشبكة:</div>
                <div className="font-medium">
                  {assetSymbol === 'ETH' ? 'Ethereum Mainnet' : 
                   assetSymbol === 'BNB' ? 'Binance Smart Chain' : 
                   assetSymbol === 'SOL' ? 'Solana' : 'Unknown'}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setTransactionStep(1)} disabled={processing}>
                عودة
              </Button>
              <Button 
                onClick={executeTransaction} 
                disabled={processing}
                className="gap-1.5"
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Fingerprint className="h-4 w-4" />
                )}
                {processing ? 'جاري التنفيذ...' : 'تأكيد وإرسال'}
              </Button>
            </div>
          </div>
        )}
        
        {transactionStep === 3 && (
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            
            <h3 className="text-lg font-medium text-center">تمت المعاملة بنجاح!</h3>
            
            <Alert className="border-green-500 text-green-500 bg-green-50 dark:bg-green-900/20">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>تم الإرسال</AlertTitle>
              <AlertDescription>
                تم إرسال {amount} {assetSymbol} بنجاح إلى العنوان المحدد.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label>هاش المعاملة:</Label>
              <div className="flex gap-2">
                <Input value={transactionHash} readOnly className="font-mono text-xs" />
                <Button variant="outline" size="icon" onClick={copyTransactionHash}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={resetForm}
                className="gap-1.5"
              >
                معاملة جديدة
              </Button>
              
              <Button 
                variant="default" 
                onClick={() => window.open(getTransactionExplorerUrl(), '_blank')}
                className="gap-1.5"
              >
                <ExternalLink className="h-4 w-4" />
                عرض في المستكشف
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        تذكر دائمًا التحقق من العنوان المتلقي قبل إرسال أي معاملة. المعاملات على البلوكتشين غير قابلة للعكس.
      </CardFooter>
    </Card>
  );
}