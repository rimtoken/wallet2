import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Save, Twitter, Github, Linkedin, Youtube, Globe, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    xUsername: 'rimtoken',
    githubUsername: 'rimtoken',
    linkedInUsername: 'rimtoken',
    discordUsername: 'rimtoken',
    youtubeChannel: 'https://www.youtube.com/channel/rimtoken',
    website: 'https://www.rimtoken.org',
    fullName: 'RimToken Wallet',
    email: 'contact@rimtoken.org',
    bio: 'محفظة العملات المشفرة الأكثر بساطة وأمانًا للتخزين والتبادل'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setEditing(false);
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم تحديث معلومات الملف الشخصي بنجاح.",
    });
  };

  const socialLinks = [
    { icon: Twitter, label: "X username", value: formData.xUsername, name: "xUsername", prefix: "https://x.com/" },
    { icon: Github, label: "GitHub username", value: formData.githubUsername, name: "githubUsername", prefix: "https://github.com/" },
    { icon: Linkedin, label: "LinkedIn username", value: formData.linkedInUsername, name: "linkedInUsername", prefix: "https://linkedin.com/in/" },
    { icon: MessageSquare, label: "Discord username", value: formData.discordUsername, name: "discordUsername", prefix: "" },
    { icon: Youtube, label: "YouTube channel", value: formData.youtubeChannel, name: "youtubeChannel", prefix: "" },
    { icon: Globe, label: "Website", value: formData.website, name: "website", prefix: "" },
  ];

  return (
    <MainLayout>
      <div className="container max-w-5xl py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">الملف الشخصي</h1>
          <Button
            onClick={() => setEditing(!editing)}
            variant={editing ? "outline" : "default"}
          >
            {editing ? (
              <>
                <Save className="ml-2 h-4 w-4" /> حفظ التغييرات
              </>
            ) : (
              <>
                <Edit className="ml-2 h-4 w-4" /> تعديل الملف الشخصي
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">البيانات الشخصية</TabsTrigger>
            <TabsTrigger value="social">وسائل التواصل</TabsTrigger>
            <TabsTrigger value="security">الأمان</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>البيانات الأساسية</CardTitle>
                <CardDescription>
                  إدارة معلوماتك الشخصية
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-3 sm:space-y-0 sm:flex-row sm:space-x-4 sm:justify-start">
                  <Avatar className="h-24 w-24 border-2 border-border">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-amber-500 text-white text-2xl">RT</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">{formData.fullName}</h3>
                    <p className="text-muted-foreground">{formData.email}</p>
                    {editing && (
                      <Button variant="outline" size="sm" className="mt-2">
                        تغيير الصورة
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">الاسم الكامل</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!editing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">نبذة عنك</Label>
                    <Input
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!editing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>وسائل التواصل الاجتماعي</CardTitle>
                <CardDescription>
                  أضف روابط حساباتك على وسائل التواصل الاجتماعي لتسهيل التواصل
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {socialLinks.map((social, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted">
                        <social.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor={social.name} className="text-sm font-medium mb-1 block">
                          {social.label}
                        </Label>
                        <div className="relative">
                          {social.prefix && (
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-muted-foreground">
                              {social.prefix}
                            </div>
                          )}
                          <Input
                            id={social.name}
                            name={social.name}
                            className={social.prefix ? "pl-[140px]" : ""}
                            value={social.value}
                            onChange={handleChange}
                            disabled={!editing}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {editing && (
                    <Button className="mt-4" onClick={handleSave}>
                      <Save className="ml-2 h-4 w-4" /> حفظ التغييرات
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الأمان</CardTitle>
                <CardDescription>
                  إدارة كلمة المرور وإعدادات الأمان الخاصة بك
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                    <Input id="current-password" type="password" disabled={!editing} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                    <Input id="new-password" type="password" disabled={!editing} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">تأكيد كلمة المرور الجديدة</Label>
                    <Input id="confirm-password" type="password" disabled={!editing} />
                  </div>
                </div>

                {editing && (
                  <Button className="mt-4" onClick={handleSave}>
                    <Save className="ml-2 h-4 w-4" /> تحديث كلمة المرور
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}