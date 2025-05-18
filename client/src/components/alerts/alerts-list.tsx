import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { AlertCondition, PriceAlert } from "./price-alert-dialog";
import { Bell, BellOff, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

interface AlertsListProps {
  alerts: PriceAlert[];
  onToggleAlert: (alertId: string, isActive: boolean) => Promise<void>;
  onDeleteAlert: (alertId: string) => Promise<void>;
  isLoading?: boolean;
}

export function AlertsList({ alerts, onToggleAlert, onDeleteAlert, isLoading = false }: AlertsListProps) {
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // تدبير تبديل حالة التنبيه
  const handleToggleAlert = async (alertId: string, currentState: boolean) => {
    try {
      setToggleLoading(alertId);
      await onToggleAlert(alertId, !currentState);
    } finally {
      setToggleLoading(null);
    }
  };

  // تدبير حذف التنبيه
  const handleDeleteAlert = async (alertId: string) => {
    try {
      setDeleteLoading(alertId);
      await onDeleteAlert(alertId);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Bell className="h-5 w-5 text-amber-500" />
          <span>تنبيهات الأسعار</span>
        </CardTitle>
        <CardDescription>
          تتبع أسعار العملات المشفرة واحصل على تنبيهات عندما تصل إلى المستويات المحددة
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8">
            <BellOff className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">لا توجد تنبيهات</h3>
            <p className="text-gray-500 mb-4">
              لم تقم بإعداد أي تنبيهات للأسعار بعد. أنشئ تنبيهًا جديدًا للبدء.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">العملة</TableHead>
                  <TableHead>الشرط</TableHead>
                  <TableHead className="text-right">السعر المستهدف</TableHead>
                  <TableHead className="w-[100px]">الحالة</TableHead>
                  <TableHead className="w-[60px]">حذف</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">
                      {alert.cryptoName} ({alert.cryptoSymbol.toUpperCase()})
                    </TableCell>
                    <TableCell>
                      <Badge className={
                        alert.condition === AlertCondition.ABOVE
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }>
                        {alert.condition === AlertCondition.ABOVE ? "أعلى من" : "أقل من"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${alert.targetPrice.toLocaleString()}</TableCell>
                    <TableCell>
                      <Switch
                        checked={alert.isActive}
                        disabled={toggleLoading === alert.id}
                        onCheckedChange={() => handleToggleAlert(alert.id, alert.isActive)}
                      />
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            disabled={deleteLoading === alert.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>حذف التنبيه</AlertDialogTitle>
                            <AlertDialogDescription>
                              هل أنت متأكد من رغبتك في حذف هذا التنبيه؟ لا يمكن التراجع عن هذا الإجراء.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>إلغاء</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600"
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteAlert(alert.id);
                              }}
                            >
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}