import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  ArrowUp, 
  ArrowDown, 
  Bell, 
  BellOff,
  Trash2 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/language-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";

// نموذج التنبيه
interface PriceAlert {
  id: number;
  assetId: number;
  assetSymbol: string;
  assetName: string;
  assetIcon: string;
  condition: "above" | "below";
  price: number;
  active: boolean;
  createdAt: Date;
}

// مخطط نموذج الإنشاء
const createAlertSchema = z.object({
  assetId: z.string().min(1, { message: "Please select an asset" }),
  condition: z.enum(["above", "below"]),
  price: z.string().min(1, { message: "Please enter a price" }).refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 
    { message: "Price must be a positive number" }
  ),
});

type CreateAlertFormValues = z.infer<typeof createAlertSchema>;

export default function PriceAlerts() {
  const { getText } = useLanguage();
  const { toast } = useToast();
  
  // محاكاة الاستعلام عن التنبيهات الحالية
  const { data: alerts = [], isLoading: isAlertsLoading, refetch: refetchAlerts } = useQuery<PriceAlert[]>({
    queryKey: ['/api/price-alerts'],
    staleTime: 60000,
  });
  
  // محاكاة الاستعلام عن قائمة الأصول
  const { data: assets = [], isLoading: isAssetsLoading } = useQuery({
    queryKey: ['/api/assets'],
    staleTime: 60000,
  });
  
  // إعداد نموذج إنشاء التنبيه
  const form = useForm<CreateAlertFormValues>({
    resolver: zodResolver(createAlertSchema),
    defaultValues: {
      assetId: "",
      condition: "above",
      price: "",
    },
  });
  
  // محاكاة طلب إنشاء تنبيه جديد
  const createAlertMutation = useMutation({
    mutationFn: async (values: CreateAlertFormValues) => {
      // هنا ستكون طلب API حقيقي لإنشاء تنبيه جديد
      console.log("Creating alert:", values);
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      return {
        id: Math.floor(Math.random() * 1000),
        assetId: parseInt(values.assetId),
        assetSymbol: assets.find(a => a.id.toString() === values.assetId)?.symbol || "Unknown",
        assetName: assets.find(a => a.id.toString() === values.assetId)?.name || "Unknown",
        assetIcon: assets.find(a => a.id.toString() === values.assetId)?.icon || "",
        condition: values.condition,
        price: parseFloat(values.price),
        active: true,
        createdAt: new Date(),
      };
    },
    onSuccess: () => {
      toast({
        title: getText("alertCreatedSuccess"),
        description: getText("alertCreatedDescription"),
      });
      form.reset();
      refetchAlerts();
    },
    onError: () => {
      toast({
        title: getText("alertCreationFailed"),
        description: getText("alertCreationFailedDescription"),
        variant: "destructive",
      });
    },
  });
  
  // محاكاة طلب تحديث حالة التنبيه (نشط/غير نشط)
  const toggleAlertMutation = useMutation({
    mutationFn: async ({ id, active }: { id: number, active: boolean }) => {
      // هنا ستكون طلب API حقيقي لتحديث حالة التنبيه
      console.log(`Toggling alert ${id} to ${active ? 'active' : 'inactive'}`);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { id, active };
    },
    onSuccess: (data) => {
      toast({
        title: data.active ? getText("alertActivated") : getText("alertDeactivated"),
        description: data.active ? getText("alertActivatedDescription") : getText("alertDeactivatedDescription"),
      });
      refetchAlerts();
    },
  });
  
  // محاكاة طلب حذف التنبيه
  const deleteAlertMutation = useMutation({
    mutationFn: async (id: number) => {
      // هنا ستكون طلب API حقيقي لحذف التنبيه
      console.log(`Deleting alert ${id}`);
      await new Promise((resolve) => setTimeout(resolve, 300));
      return id;
    },
    onSuccess: () => {
      toast({
        title: getText("alertDeleted"),
        description: getText("alertDeletedDescription"),
      });
      refetchAlerts();
    },
  });
  
  // معالجة إرسال نموذج إنشاء التنبيه
  const onSubmit = (values: CreateAlertFormValues) => {
    createAlertMutation.mutate(values);
  };
  
  // تبديل حالة التنبيه (نشط/غير نشط)
  const handleToggleAlert = (id: number, currentActive: boolean) => {
    toggleAlertMutation.mutate({ id, active: !currentActive });
  };
  
  // حذف التنبيه
  const handleDeleteAlert = (id: number) => {
    deleteAlertMutation.mutate(id);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{getText("createPriceAlert")}</CardTitle>
          <CardDescription>{getText("createPriceAlertDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="assetId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{getText("asset")}</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={isAssetsLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={getText("selectAsset")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {assets.map((asset) => (
                          <SelectItem key={asset.id} value={asset.id.toString()}>
                            <div className="flex items-center">
                              <div className="w-5 h-5 mr-2">
                                <img
                                  src={asset.icon}
                                  alt={asset.symbol}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <span>{asset.symbol} - {asset.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{getText("condition")}</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={getText("selectCondition")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="above">
                            <div className="flex items-center">
                              <ArrowUp className="mr-2 h-4 w-4 text-green-500" />
                              <span>{getText("priceAbove")}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="below">
                            <div className="flex items-center">
                              <ArrowDown className="mr-2 h-4 w-4 text-red-500" />
                              <span>{getText("priceBelow")}</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{getText("targetPrice")}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="0.00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={createAlertMutation.isPending}
              >
                {createAlertMutation.isPending ? (
                  <>{getText("creatingAlert")}...</>
                ) : (
                  getText("createAlert")
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{getText("yourPriceAlerts")}</CardTitle>
          <CardDescription>{getText("yourPriceAlertsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isAlertsLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p>{getText("loadingAlerts")}...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-6 space-y-2">
              <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">{getText("noAlertsFound")}</p>
              <p className="text-sm text-muted-foreground">{getText("noAlertsFoundDescription")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`
                    p-4 border rounded-lg flex items-center justify-between
                    ${alert.active 
                      ? 'border-primary/30 bg-primary/5 dark:border-primary/20 dark:bg-primary/10' 
                      : 'border-muted bg-muted/40 dark:border-muted dark:bg-muted/20'}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 flex-shrink-0">
                      <img 
                        src={alert.assetIcon} 
                        alt={alert.assetSymbol} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{alert.assetSymbol}</div>
                      <div className="text-sm text-muted-foreground">{alert.assetName}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Badge 
                      variant={alert.condition === 'above' ? 'outline' : 'destructive'} 
                      className="mr-4"
                    >
                      {alert.condition === 'above' 
                        ? <ArrowUp className="mr-1 h-3 w-3" /> 
                        : <ArrowDown className="mr-1 h-3 w-3" />}
                      ${alert.price.toLocaleString()}
                    </Badge>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={alert.active}
                        onCheckedChange={() => handleToggleAlert(alert.id, alert.active)}
                      />
                      
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteAlert(alert.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Bell className="h-4 w-4 mr-2" />
            {alerts.filter(a => a.active).length} {getText("activeAlerts")}
          </div>
          
          {alerts.length > 0 && (
            <Button variant="ghost" size="sm">
              {getText("manageNotifications")}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}