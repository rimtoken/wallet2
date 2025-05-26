import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/language-context";
import { 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target,
  Zap,
  Clock,
  CheckCircle,
  Settings,
  Plus,
  Trash2
} from "lucide-react";

interface Alert {
  id: string;
  type: "price" | "volume" | "change" | "news";
  asset: string;
  condition: string;
  value: number;
  isActive: boolean;
  triggered: boolean;
  createdAt: string;
}

export default function SmartAlertsSystem() {
  const { getText } = useLanguage();
  const [activeTab, setActiveTab] = useState("alerts");
  
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "price",
      asset: "ETH",
      condition: "above",
      value: 3500,
      isActive: true,
      triggered: false,
      createdAt: "2025-01-26"
    },
    {
      id: "2",
      type: "change",
      asset: "BTC",
      condition: "decrease",
      value: 5,
      isActive: true,
      triggered: true,
      createdAt: "2025-01-25"
    },
    {
      id: "3",
      type: "volume",
      asset: "SOL",
      condition: "spike",
      value: 200,
      isActive: false,
      triggered: false,
      createdAt: "2025-01-24"
    }
  ]);

  const [newAlert, setNewAlert] = useState({
    asset: "ETH",
    type: "price" as Alert["type"],
    condition: "above",
    value: ""
  });

  const smartSuggestions = [
    {
      title: getText("volatilityAlert"),
      description: getText("ethHighVolatility"),
      action: getText("setStopLoss"),
      priority: "high",
      asset: "ETH"
    },
    {
      title: getText("supportLevelAlert"),
      description: getText("btcNearSupport"),
      action: getText("setBuyAlert"),
      priority: "medium",
      asset: "BTC"
    },
    {
      title: getText("resistanceLevelAlert"),
      description: getText("solNearResistance"),
      action: getText("setSellAlert"),
      priority: "medium",
      asset: "SOL"
    }
  ];

  const recentTriggers = [
    {
      asset: "BTC",
      message: getText("priceDroppedBelow65k"),
      time: "2 hours ago",
      type: "warning"
    },
    {
      asset: "ETH",
      message: getText("volumeSpikeDetected"),
      time: "4 hours ago",
      type: "info"
    },
    {
      asset: "SOL",
      message: getText("targetPriceReached"),
      time: "6 hours ago",
      type: "success"
    }
  ];

  const addAlert = () => {
    if (!newAlert.value) return;
    
    const alert: Alert = {
      id: Date.now().toString(),
      asset: newAlert.asset,
      type: newAlert.type,
      condition: newAlert.condition,
      value: parseFloat(newAlert.value),
      isActive: true,
      triggered: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setAlerts([...alerts, alert]);
    setNewAlert({ asset: "ETH", type: "price", condition: "above", value: "" });
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "price": return <Target className="w-4 h-4" />;
      case "volume": return <TrendingUp className="w-4 h-4" />;
      case "change": return <Zap className="w-4 h-4" />;
      case "news": return <Bell className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-red-200 bg-red-50 text-red-700";
      case "medium": return "border-yellow-200 bg-yellow-50 text-yellow-700";
      case "low": return "border-green-200 bg-green-50 text-green-700";
      default: return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="w-8 h-8 text-primary" />
            {getText("smartAlerts")}
          </h1>
          <p className="text-muted-foreground">{getText("intelligentPriceMonitoring")}</p>
        </div>
        
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <CheckCircle className="w-4 h-4 mr-1" />
            {alerts.filter(a => a.isActive).length} {getText("active")}
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            <AlertTriangle className="w-4 h-4 mr-1" />
            {alerts.filter(a => a.triggered).length} {getText("triggered")}
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts">{getText("myAlerts")}</TabsTrigger>
          <TabsTrigger value="create">{getText("createAlert")}</TabsTrigger>
          <TabsTrigger value="suggestions">{getText("suggestions")}</TabsTrigger>
          <TabsTrigger value="history">{getText("history")}</TabsTrigger>
        </TabsList>

        {/* My Alerts */}
        <TabsContent value="alerts" className="space-y-4">
          {alerts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{getText("noAlertsYet")}</h3>
                <p className="text-muted-foreground mb-4">{getText("createFirstAlert")}</p>
                <Button onClick={() => setActiveTab("create")}>
                  <Plus className="w-4 h-4 mr-2" />
                  {getText("createAlert")}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <Card key={alert.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${alert.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {getAlertIcon(alert.type)}
                        </div>
                        <div>
                          <div className="font-semibold">
                            {alert.asset} {getText(alert.condition)} ${alert.value}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {getText(alert.type)} • {getText("created")} {alert.createdAt}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {alert.triggered && (
                          <Badge variant="destructive" className="text-xs">
                            {getText("triggered")}
                          </Badge>
                        )}
                        <Switch
                          checked={alert.isActive}
                          onCheckedChange={() => toggleAlert(alert.id)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAlert(alert.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Create Alert */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                {getText("createNewAlert")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">{getText("asset")}</label>
                  <select 
                    className="w-full mt-1 p-2 border rounded-md"
                    value={newAlert.asset}
                    onChange={(e) => setNewAlert({...newAlert, asset: e.target.value})}
                  >
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="SOL">Solana (SOL)</option>
                    <option value="BNB">Binance Coin (BNB)</option>
                    <option value="MATIC">Polygon (MATIC)</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">{getText("alertType")}</label>
                  <select 
                    className="w-full mt-1 p-2 border rounded-md"
                    value={newAlert.type}
                    onChange={(e) => setNewAlert({...newAlert, type: e.target.value as Alert["type"]})}
                  >
                    <option value="price">{getText("priceAlert")}</option>
                    <option value="change">{getText("changeAlert")}</option>
                    <option value="volume">{getText("volumeAlert")}</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">{getText("condition")}</label>
                  <select 
                    className="w-full mt-1 p-2 border rounded-md"
                    value={newAlert.condition}
                    onChange={(e) => setNewAlert({...newAlert, condition: e.target.value})}
                  >
                    <option value="above">{getText("above")}</option>
                    <option value="below">{getText("below")}</option>
                    <option value="increase">{getText("increase")}</option>
                    <option value="decrease">{getText("decrease")}</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">{getText("value")}</label>
                  <Input
                    type="number"
                    placeholder={getText("enterValue")}
                    value={newAlert.value}
                    onChange={(e) => setNewAlert({...newAlert, value: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <Button onClick={addAlert} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                {getText("createAlert")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Suggestions */}
        <TabsContent value="suggestions">
          <div className="space-y-4">
            {smartSuggestions.map((suggestion, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-blue-100">
                      <Zap className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{suggestion.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
                      <Button variant="outline" size="sm">
                        {suggestion.action}
                      </Button>
                    </div>
                    <Badge className={getPriorityColor(suggestion.priority)}>
                      {getText(suggestion.priority)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* History */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {getText("recentTriggers")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTriggers.map((trigger, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className={`p-2 rounded-full ${
                      trigger.type === "success" ? "bg-green-100" :
                      trigger.type === "warning" ? "bg-red-100" : "bg-blue-100"
                    }`}>
                      {trigger.type === "success" ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                       trigger.type === "warning" ? <AlertTriangle className="w-4 h-4 text-red-600" /> :
                       <Bell className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{trigger.asset}</div>
                      <div className="text-sm text-muted-foreground">{trigger.message}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{trigger.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}