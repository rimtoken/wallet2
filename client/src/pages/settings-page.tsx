import React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeSelector } from "@/components/ui/theme-selector";
import { Settings, Palette, Globe, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mb-6">الإعدادات</h1>
          
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="mb-6 flex bg-muted p-1 rounded-md">
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>المظهر</span>
              </TabsTrigger>
              <TabsTrigger value="language" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>اللغة</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>الإشعارات</span>
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>عام</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات المظهر</CardTitle>
                </CardHeader>
                <CardContent>
                  <ThemeSelector />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="language">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات اللغة</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    يمكنك تغيير لغة التطبيق من هنا.
                  </p>
                  {/* هنا يمكن إضافة مكون اختيار اللغة لاحقاً */}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الإشعارات</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    يمكنك تخصيص إشعارات التطبيق من هنا.
                  </p>
                  {/* هنا يمكن إضافة إعدادات الإشعارات لاحقاً */}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>الإعدادات العامة</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    إعدادات عامة أخرى للتطبيق.
                  </p>
                  {/* هنا يمكن إضافة إعدادات عامة أخرى لاحقاً */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}