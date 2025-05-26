import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/language-context";
import { TrendingUp, TrendingDown, Activity, Zap, Shield, DollarSign } from "lucide-react";

export default function AdvancedTradingInterface() {
  const { getText } = useLanguage();
  const [selectedPair, setSelectedPair] = useState("ETH/USDT");
  const [orderType, setOrderType] = useState<"market" | "limit" | "stop">("market");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");

  const tradingPairs = [
    { pair: "ETH/USDT", price: 3250.45, change: 2.5, volume: "125M" },
    { pair: "BTC/USDT", price: 67890.12, change: -1.2, volume: "890M" },
    { pair: "BNB/USDT", price: 385.67, change: 4.8, volume: "45M" },
    { pair: "SOL/USDT", price: 98.34, change: 6.2, volume: "78M" },
    { pair: "MATIC/USDT", price: 0.89, change: -0.5, volume: "23M" }
  ];

  const recentTrades = [
    { time: "15:32:45", type: "buy", price: 3250.45, amount: 0.5 },
    { time: "15:32:12", type: "sell", price: 3249.87, amount: 1.2 },
    { time: "15:31:58", type: "buy", price: 3250.12, amount: 0.8 },
    { time: "15:31:34", type: "sell", price: 3249.45, amount: 2.1 }
  ];

  return (
    <div className="space-y-6">
      {/* Trading Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{getText("advancedTrading")}</h1>
          <p className="text-muted-foreground">{getText("professionalTradingInterface")}</p>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Activity className="w-4 h-4 mr-1" />
            {getText("realTimeData")}
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Shield className="w-4 h-4 mr-1" />
            {getText("secureTrading")}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Trading Pairs */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">{getText("tradingPairs")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {tradingPairs.map((pair) => (
                <div
                  key={pair.pair}
                  className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                    selectedPair === pair.pair ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedPair(pair.pair)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{pair.pair}</div>
                      <div className="text-sm text-muted-foreground">
                        {getText("volume")}: {pair.volume}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${pair.price.toLocaleString()}</div>
                      <div className={`text-sm flex items-center ${
                        pair.change > 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {pair.change > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        {pair.change}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trading Interface */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              {getText("placeOrder")} - {selectedPair}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={orderType} onValueChange={(value) => setOrderType(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="market">{getText("marketOrder")}</TabsTrigger>
                <TabsTrigger value="limit">{getText("limitOrder")}</TabsTrigger>
                <TabsTrigger value="stop">{getText("stopOrder")}</TabsTrigger>
              </TabsList>
              
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                    {getText("buy")} {selectedPair.split('/')[0]}
                  </Button>
                  <Button variant="outline" className="border-red-500 text-red-600 hover:bg-red-50">
                    {getText("sell")} {selectedPair.split('/')[0]}
                  </Button>
                </div>

                <TabsContent value="market" className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">{getText("amount")}</label>
                    <Input
                      placeholder={`${getText("enter")} ${selectedPair.split('/')[0]} ${getText("amount")}`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="bg-accent/50 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">{getText("estimatedTotal")}</div>
                    <div className="text-lg font-bold">${(parseFloat(amount || "0") * 3250.45).toLocaleString()}</div>
                  </div>
                </TabsContent>

                <TabsContent value="limit" className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">{getText("price")}</label>
                    <Input
                      placeholder={`${getText("enter")} ${getText("price")}`}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{getText("amount")}</label>
                    <Input
                      placeholder={`${getText("enter")} ${selectedPair.split('/')[0]} ${getText("amount")}`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="bg-accent/50 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">{getText("total")}</div>
                    <div className="text-lg font-bold">
                      ${(parseFloat(amount || "0") * parseFloat(price || "0")).toLocaleString()}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="stop" className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium">{getText("stopPrice")}</label>
                    <Input
                      placeholder={`${getText("enter")} ${getText("stopPrice")}`}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{getText("limitPrice")}</label>
                    <Input
                      placeholder={`${getText("enter")} ${getText("limitPrice")}`}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">{getText("amount")}</label>
                    <Input
                      placeholder={`${getText("enter")} ${selectedPair.split('/')[0]} ${getText("amount")}`}
                      className="mt-1"
                    />
                  </div>
                </TabsContent>

                <Button className="w-full" size="lg">
                  <DollarSign className="w-4 h-4 mr-2" />
                  {getText("placeOrder")}
                </Button>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Recent Trades */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">{getText("recentTrades")}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {recentTrades.map((trade, index) => (
                <div key={index} className="p-3 border-b last:border-b-0">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{trade.time}</span>
                    <Badge variant={trade.type === "buy" ? "default" : "destructive"} className="text-xs">
                      {trade.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-medium">${trade.price}</span>
                    <span className="text-muted-foreground">{trade.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}