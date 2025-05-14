import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Avatar } from "@/components/ui/avatar";

interface SettingsPageProps {
  userId: number;
}

export default function Settings({ userId }: SettingsPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  
  // User settings state
  const [name, setName] = useState("Alex Morgan");
  const [email, setEmail] = useState("alex@example.com");
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    securityAlerts: true,
    transactionUpdates: true,
    newsletterUpdates: false
  });
  const [currency, setCurrency] = useState("USD");
  const [theme, setTheme] = useState("light");
  
  // Security settings state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };
  
  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all password fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
    
    // Reset form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar className={sidebarOpen ? 'block' : 'hidden'} />
      
      {/* Main Content */}
      <main className="w-full lg:pl-64 flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <Topbar onToggleSidebar={toggleSidebar} />
        
        {/* Content */}
        <div className="p-4 lg:p-6 flex-1 overflow-auto bg-neutral-100">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
            
            <Tabs defaultValue="profile" className="mb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Manage your personal information and account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar
                        alt={name}
                        fallback="AM"
                        size="lg"
                      />
                      <div>
                        <Button variant="outline" size="sm">
                          <i className="ri-upload-2-line mr-2"></i>
                          Upload
                        </Button>
                        <p className="text-sm text-neutral-500 mt-1">
                          JPG, PNG or GIF. 1MB max.
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your password and security preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Change Password</h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      
                      <Button onClick={handleChangePassword}>
                        Update Password
                      </Button>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-neutral-200">
                      <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-neutral-500">Add an extra layer of security to your account</p>
                        </div>
                        <Switch checked={false} />
                      </div>
                      
                      <Button variant="outline">
                        <i className="ri-shield-keyhole-line mr-2"></i>
                        Setup 2FA
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Customize your experience and notification settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notifications</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Price Alerts</p>
                            <p className="text-sm text-neutral-500">Receive notifications for significant price changes</p>
                          </div>
                          <Switch 
                            checked={notifications.priceAlerts}
                            onCheckedChange={(checked) => 
                              setNotifications({...notifications, priceAlerts: checked})
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Security Alerts</p>
                            <p className="text-sm text-neutral-500">Get notified about important security events</p>
                          </div>
                          <Switch 
                            checked={notifications.securityAlerts}
                            onCheckedChange={(checked) => 
                              setNotifications({...notifications, securityAlerts: checked})
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Transaction Updates</p>
                            <p className="text-sm text-neutral-500">Be alerted when transactions complete</p>
                          </div>
                          <Switch 
                            checked={notifications.transactionUpdates}
                            onCheckedChange={(checked) => 
                              setNotifications({...notifications, transactionUpdates: checked})
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Newsletter Updates</p>
                            <p className="text-sm text-neutral-500">Receive weekly market insights and tips</p>
                          </div>
                          <Switch 
                            checked={notifications.newsletterUpdates}
                            onCheckedChange={(checked) => 
                              setNotifications({...notifications, newsletterUpdates: checked})
                            }
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-neutral-200">
                      <h3 className="text-lg font-medium">Display Settings</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="currency">Default Currency</Label>
                          <select
                            id="currency"
                            className="w-full p-2 rounded-md border border-neutral-300 bg-white"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                          >
                            <option value="USD">USD (US Dollar)</option>
                            <option value="EUR">EUR (Euro)</option>
                            <option value="GBP">GBP (British Pound)</option>
                            <option value="JPY">JPY (Japanese Yen)</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="theme">Theme</Label>
                          <select
                            id="theme"
                            className="w-full p-2 rounded-md border border-neutral-300 bg-white"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System Default</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <Button>
                      Save Preferences
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <Card className="mb-6 bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-700">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-700">Delete Account</p>
                    <p className="text-sm text-red-600">Permanently delete your account and all of your data</p>
                  </div>
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Mobile Nav */}
      <MobileNav />
    </div>
  );
}
