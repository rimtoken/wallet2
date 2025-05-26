import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/language-context";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  PieChart, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Award,
  Sparkles
} from "lucide-react";

export default function PortfolioAnalytics() {
  const { getText } = useLanguage();
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");

  const portfolioStats = {
    totalValue: 125680.45,
    totalProfit: 18750.30,
    profitPercentage: 17.4,
    bestPerformer: "SOL",
    worstPerformer: "MATIC",
    diversificationScore: 8.5,
    riskScore: 6.2
  };

  const assetAllocation = [
    { asset: "ETH", percentage: 35, value: 44000, profit: 12.5 },
    { asset: "BTC", percentage: 30, value: 37700, profit: 8.2 },
    { asset: "SOL", percentage: 15, value: 18850, profit: 25.8 },
    { asset: "BNB", percentage: 12, value: 15080, profit: 15.3 },
    { asset: "MATIC", percentage: 8, value: 10050, profit: -3.2 }
  ];

  const performanceMetrics = [
    { metric: getText("sharpeRatio"), value: "1.85", status: "excellent" },
    { metric: getText("volatility"), value: "28.4%", status: "moderate" },
    { metric: getText("maxDrawdown"), value: "-12.3%", status: "good" },
    { metric: getText("winRate"), value: "68%", status: "excellent" }
  ];

  const smartInsights = [
    {
      type: "opportunity",
      title: getText("rebalanceRecommendation"),
      description: getText("portfolioHeavyInETH"),
      action: getText("considerRebalancing"),
      priority: "medium"
    },
    {
      type: "warning",
      title: getText("highVolatilityAlert"),
      description: getText("portfolioVolatilityHigh"),
      action: getText("considerStablecoins"),
      priority: "high"
    },
    {
      type: "success",
      title: getText("excellentPerformance"),
      description: getText("beatMarketBy15Percent"),
      action: getText("maintainStrategy"),
      priority: "low"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600 bg-green-50 border-green-200";
      case "good": return "text-blue-600 bg-blue-50 border-blue-200";
      case "moderate": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "poor": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "medium": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "low": return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            {getText("portfolioAnalytics")}
          </h1>
          <p className="text-muted-foreground">{getText("advancedPortfolioInsights")}</p>
        </div>
        
        <div className="flex gap-2">
          {["7d", "30d", "90d", "1y"].map((timeframe) => (
            <Button
              key={timeframe}
              variant={selectedTimeframe === timeframe ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTimeframe(timeframe)}
            >
              {timeframe}
            </Button>
          ))}
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{getText("totalValue")}</p>
                <p className="text-2xl font-bold">${portfolioStats.totalValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{getText("totalProfit")}</p>
                <p className="text-2xl font-bold text-green-600">
                  +${portfolioStats.totalProfit.toLocaleString()}
                </p>
                <p className="text-sm text-green-600">+{portfolioStats.profitPercentage}%</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{getText("diversificationScore")}</p>
                <p className="text-2xl font-bold">{portfolioStats.diversificationScore}/10</p>
                <Progress value={portfolioStats.diversificationScore * 10} className="mt-2" />
              </div>
              <PieChart className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{getText("riskScore")}</p>
                <p className="text-2xl font-bold">{portfolioStats.riskScore}/10</p>
                <Progress value={portfolioStats.riskScore * 10} className="mt-2" />
              </div>
              <Zap className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Asset Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              {getText("assetAllocation")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assetAllocation.map((asset) => (
                <div key={asset.asset} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{asset.asset}</span>
                      <Badge variant="outline">{asset.percentage}%</Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${asset.value.toLocaleString()}</div>
                      <div className={`text-sm ${asset.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {asset.profit > 0 ? '+' : ''}{asset.profit}%
                      </div>
                    </div>
                  </div>
                  <Progress value={asset.percentage * 2.8} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              {getText("performanceMetrics")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="flex justify-between items-center p-3 rounded-lg border">
                  <span className="font-medium">{metric.metric}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{metric.value}</span>
                    <Badge className={getStatusColor(metric.status)}>
                      {getText(metric.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {getText("smartInsights")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {smartInsights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  {getPriorityIcon(insight.priority)}
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                    <Button variant="outline" size="sm">
                      {insight.action}
                    </Button>
                  </div>
                  <Badge variant="outline" className={
                    insight.priority === "high" ? "border-red-200 text-red-700" :
                    insight.priority === "medium" ? "border-yellow-200 text-yellow-700" :
                    "border-green-200 text-green-700"
                  }>
                    {getText(insight.priority)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}