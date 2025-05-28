import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Coins, 
  TrendingUp, 
  Lock, 
  Clock,
  Percent,
  Gift,
  Target,
  Calendar
} from 'lucide-react';

interface StakingPool {
  id: string;
  asset: string;
  name: string;
  apy: number;
  totalStaked: number;
  minimumStake: number;
  lockPeriod: number; // in days
  icon: string;
  status: 'active' | 'coming_soon' | 'ended';
  description: string;
}

interface UserStake {
  id: string;
  poolId: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  earnedRewards: number;
  status: 'active' | 'completed' | 'unlocking';
}

export default function StakingPage() {
  const { toast } = useToast();
  const [selectedPool, setSelectedPool] = useState<StakingPool>();
  const [stakeAmount, setStakeAmount] = useState('');
  const [userStakes, setUserStakes] = useState<UserStake[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const stakingPools: StakingPool[] = [
    {
      id: 'rim_flexible',
      asset: 'RIM',
      name: 'RimToken مرن',
      apy: 12.5,
      totalStaked: 10500000,
      minimumStake: 100,
      lockPeriod: 0,
      icon: '🟡',
      status: 'active',
      description: 'احصل على مكافآت يومية بدون فترة قفل'
    },
    {
      id: 'rim_30days',
      asset: 'RIM',
      name: 'RimToken - 30 يوم',
      apy: 18.0,
      totalStaked: 25000000,
      minimumStake: 500,
      lockPeriod: 30,
      icon: '🟡',
      status: 'active',
      description: 'عائد أعلى مع فترة قفل 30 يوم'
    },
    {
      id: 'rim_90days',
      asset: 'RIM',
      name: 'RimToken - 90 يوم',
      apy: 25.0,
      totalStaked: 50000000,
      minimumStake: 1000,
      lockPeriod: 90,
      icon: '🟡',
      status: 'active',
      description: 'أقصى عائد مع فترة قفل 90 يوم'
    },
    {
      id: 'eth_staking',
      asset: 'ETH',
      name: 'إيثيريوم 2.0',
      apy: 5.2,
      totalStaked: 1500,
      minimumStake: 0.1,
      lockPeriod: 0,
      icon: '⟠',
      status: 'active',
      description: 'مشاركة في شبكة إيثيريوم 2.0'
    },
    {
      id: 'btc_defi',
      asset: 'BTC',
      name: 'بيتكوين DeFi',
      apy: 8.5,
      totalStaked: 125,
      minimumStake: 0.01,
      lockPeriod: 60,
      icon: '₿',
      status: 'coming_soon',
      description: 'قريباً - تحصيص البيتكوين مع DeFi'
    }
  ];

  useEffect(() => {
    generateUserStakes();
    calculateTotalEarnings();
  }, []);

  const generateUserStakes = () => {
    const mockStakes: UserStake[] = [
      {
        id: '1',
        poolId: 'rim_30days',
        amount: 1000,
        startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        earnedRewards: 7.5,
        status: 'active'
      },
      {
        id: '2',
        poolId: 'rim_flexible',
        amount: 500,
        startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
        endDate: new Date(), // No lock period
        earnedRewards: 23.2,
        status: 'active'
      }
    ];
    setUserStakes(mockStakes);
  };

  const calculateTotalEarnings = () => {
    // Calculate based on current stakes
    setTotalEarnings(30.7); // Mock total earnings
  };

  const handleStake = () => {
    if (!selectedPool || !stakeAmount) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار المجموعة وإدخال المبلغ",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(stakeAmount);
    if (amount < selectedPool.minimumStake) {
      toast({
        title: "خطأ",
        description: `الحد الأدنى للتحصيص هو ${selectedPool.minimumStake} ${selectedPool.asset}`,
        variant: "destructive",
      });
      return;
    }

    const newStake: UserStake = {
      id: Date.now().toString(),
      poolId: selectedPool.id,
      amount,
      startDate: new Date(),
      endDate: new Date(Date.now() + selectedPool.lockPeriod * 24 * 60 * 60 * 1000),
      earnedRewards: 0,
      status: 'active'
    };

    setUserStakes([newStake, ...userStakes]);
    setStakeAmount('');

    toast({
      title: "تم التحصيص بنجاح!",
      description: `تم تحصيص ${amount} ${selectedPool.asset} في ${selectedPool.name}`,
    });
  };

  const calculateDailyReward = (pool: StakingPool, amount: number) => {
    return (amount * pool.apy / 100) / 365;
  };

  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const formatCompactNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getTimeLeft = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'منتهي';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} يوم`;
    return `${hours} ساعة`;
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Coins className="h-8 w-8 text-primary" />
              التحصيص والمكافآت
            </h1>
            <p className="text-muted-foreground mt-2">
              احصل على مكافآت ثابتة من خلال تحصيص عملاتك المشفرة
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              +{formatNumber(totalEarnings)} RIM
            </div>
            <div className="text-sm text-muted-foreground">
              إجمالي المكافآت المكتسبة
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-xl font-bold">1,500</div>
                  <div className="text-sm text-muted-foreground">RIM محصص</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-xl font-bold">18.5%</div>
                  <div className="text-sm text-muted-foreground">متوسط العائد</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-xl font-bold">0.84</div>
                  <div className="text-sm text-muted-foreground">مكافآت يومية</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="text-xl font-bold">2</div>
                  <div className="text-sm text-muted-foreground">مجموعات نشطة</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Staking Pools */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">مجموعات التحصيص المتاحة</h2>
            
            {stakingPools.map((pool) => (
              <Card key={pool.id} className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedPool?.id === pool.id ? 'ring-2 ring-primary' : ''
              } ${pool.status !== 'active' ? 'opacity-60' : ''}`}>
                <CardHeader className="pb-3" onClick={() => setSelectedPool(pool)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{pool.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{pool.name}</CardTitle>
                        <CardDescription>{pool.description}</CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={pool.status === 'active' ? 'default' : 'secondary'}
                      className={pool.status === 'active' ? 'bg-green-600' : ''}
                    >
                      {pool.status === 'active' ? 'متاح' : 
                       pool.status === 'coming_soon' ? 'قريباً' : 'منتهي'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-1 text-green-600">
                        <Percent className="h-4 w-4" />
                        <span className="font-bold text-lg">{pool.apy}%</span>
                      </div>
                      <div className="text-sm text-muted-foreground">عائد سنوي</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">
                          {pool.lockPeriod === 0 ? 'مرن' : `${pool.lockPeriod} يوم`}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">فترة القفل</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-medium">
                        {formatCompactNumber(pool.totalStaked)} {pool.asset}
                      </div>
                      <div className="text-sm text-muted-foreground">إجمالي المحصص</div>
                    </div>
                    <div>
                      <div className="font-medium">
                        {pool.minimumStake} {pool.asset}
                      </div>
                      <div className="text-sm text-muted-foreground">الحد الأدنى</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Staking Form & User Stakes */}
          <div className="space-y-6">
            {/* Staking Form */}
            <Card>
              <CardHeader>
                <CardTitle>تحصيص جديد</CardTitle>
                <CardDescription>
                  {selectedPool ? `${selectedPool.name} - عائد ${selectedPool.apy}%` : 'اختر مجموعة التحصيص'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPool && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        المبلغ ({selectedPool.asset})
                      </label>
                      <Input
                        type="number"
                        placeholder={`الحد الأدنى: ${selectedPool.minimumStake}`}
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                      />
                    </div>

                    {stakeAmount && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span>المكافأة اليومية المتوقعة:</span>
                          <span className="font-bold text-green-600">
                            +{formatNumber(calculateDailyReward(selectedPool, parseFloat(stakeAmount)))} {selectedPool.asset}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>المكافأة الشهرية المتوقعة:</span>
                          <span className="font-bold text-green-600">
                            +{formatNumber(calculateDailyReward(selectedPool, parseFloat(stakeAmount)) * 30)} {selectedPool.asset}
                          </span>
                        </div>
                        {selectedPool.lockPeriod > 0 && (
                          <div className="flex justify-between">
                            <span>تاريخ الاستحقاق:</span>
                            <span className="font-medium">
                              {new Date(Date.now() + selectedPool.lockPeriod * 24 * 60 * 60 * 1000).toLocaleDateString('ar')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <Button 
                      onClick={handleStake} 
                      className="w-full"
                      disabled={selectedPool.status !== 'active'}
                    >
                      تحصيص {selectedPool.asset}
                    </Button>
                  </>
                )}

                {!selectedPool && (
                  <div className="text-center text-muted-foreground py-8">
                    اختر مجموعة تحصيص من القائمة
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Stakes */}
            <Card>
              <CardHeader>
                <CardTitle>تحصيصاتك النشطة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {userStakes.map((stake) => {
                  const pool = stakingPools.find(p => p.id === stake.poolId);
                  return (
                    <div key={stake.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{pool?.icon}</span>
                          <div>
                            <div className="font-medium">{pool?.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatNumber(stake.amount)} {pool?.asset}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          variant={stake.status === 'active' ? 'default' : 'secondary'}
                          className={stake.status === 'active' ? 'bg-green-600' : ''}
                        >
                          {stake.status === 'active' ? 'نشط' : 'مكتمل'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <div className="text-green-600 font-bold">
                            +{formatNumber(stake.earnedRewards)} {pool?.asset}
                          </div>
                          <div className="text-xs text-muted-foreground">مكافآت مكتسبة</div>
                        </div>
                        <div>
                          <div className="font-medium">
                            {pool?.lockPeriod === 0 ? 'متاح' : getTimeLeft(stake.endDate)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {pool?.lockPeriod === 0 ? 'سحب فوري' : 'متبقي'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          سحب المكافآت
                        </Button>
                        {pool?.lockPeriod === 0 && (
                          <Button size="sm" variant="outline" className="flex-1">
                            سحب الكل
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {userStakes.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    لا توجد تحصيصات نشطة
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}