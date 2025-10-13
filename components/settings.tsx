"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Bell,
  CreditCard,
  Key,
  Languages,
  Lock,
  Mail,
  Palette,
  Save,
  Shield,
  User,
  Webhook,
  Wrench,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"

export default function SettingsComponent() {
  const [activeTab, setActiveTab] = useState("account")

  // Mock user data
  const user = {
    name: "Admin User",
    email: "admin@sendme.com",
    role: "Administrator",
    avatar: "/admin-interface.png",
    twoFactorEnabled: true,
    notificationPreferences: {
      email: true,
      push: true,
      sms: false,
      newRider: true,
      newApplication: true,
      paymentOverdue: true,
      systemUpdates: true,
    },
    appearance: {
      theme: "light",
      density: "comfortable",
      language: "en",
    },
    apiKey: "sk_test_*****************************a4f2",
  }

  // Mock integrations
  const integrations = [
    { id: 1, name: "Payment Gateway", connected: true, status: "active" },
    { id: 2, name: "SMS Provider", connected: true, status: "active" },
    { id: 3, name: "Email Service", connected: true, status: "active" },
    { id: 4, name: "Maps API", connected: true, status: "active" },
    { id: 5, name: "Analytics Platform", connected: false, status: "disconnected" },
  ]

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2" asChild>
          <a href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </a>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-6">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden md:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            <span className="hidden md:inline">Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            <span className="hidden md:inline">System</span>
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" size="sm">
                      Upload new image
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                      Remove image
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue={user.name} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user.email} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select defaultValue={user.role.toLowerCase()}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administrator">Administrator</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-[#32443E] hover:bg-[#3a5049]" onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Update your contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" placeholder="123 Main St, City, State, ZIP" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="america/new_york">
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america/new_york">Eastern Time (ET)</SelectItem>
                      <SelectItem value="america/chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="america/denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="america/los_angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="etc/utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-[#32443E] hover:bg-[#3a5049]" onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-center justify-between space-x-2 rounded-md border p-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <Label htmlFor="email-notifications" className="flex-1">
                        Email Notifications
                      </Label>
                    </div>
                    <Switch id="email-notifications" checked={user.notificationPreferences.email} />
                  </div>
                  <div className="flex items-center justify-between space-x-2 rounded-md border p-4">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-5 w-5 text-gray-500" />
                      <Label htmlFor="push-notifications" className="flex-1">
                        Push Notifications
                      </Label>
                    </div>
                    <Switch id="push-notifications" checked={user.notificationPreferences.push} />
                  </div>
                  <div className="flex items-center justify-between space-x-2 rounded-md border p-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-gray-500" />
                      <Label htmlFor="sms-notifications" className="flex-1">
                        SMS Notifications
                      </Label>
                    </div>
                    <Switch id="sms-notifications" checked={user.notificationPreferences.sms} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Types</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-rider" className="flex-1">
                      New Rider Registrations
                    </Label>
                    <Switch id="new-rider" checked={user.notificationPreferences.newRider} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-application" className="flex-1">
                      New Applications
                    </Label>
                    <Switch id="new-application" checked={user.notificationPreferences.newApplication} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="payment-overdue" className="flex-1">
                      Payment Overdue Alerts
                    </Label>
                    <Switch id="payment-overdue" checked={user.notificationPreferences.paymentOverdue} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="system-updates" className="flex-1">
                      System Updates
                    </Label>
                    <Switch id="system-updates" checked={user.notificationPreferences.systemUpdates} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-[#32443E] hover:bg-[#3a5049]" onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Change your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="bg-[#32443E] hover:bg-[#3a5049]">
                  <Lock className="mr-2 h-4 w-4" />
                  Update Password
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Secure your account with 2FA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      {user.twoFactorEnabled && <Badge className="ml-2 bg-emerald-500">Enabled</Badge>}
                    </div>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Switch checked={user.twoFactorEnabled} />
                </div>

                {user.twoFactorEnabled && (
                  <div className="space-y-4">
                    <div className="rounded-md bg-gray-50 p-4">
                      <h4 className="mb-2 font-medium">Recovery Codes</h4>
                      <p className="text-sm text-gray-500">
                        Recovery codes can be used to access your account in the event you lose access to your device
                        and cannot receive two-factor authentication codes.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Key className="mr-2 h-4 w-4" />
                        View Recovery Codes
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {!user.twoFactorEnabled ? (
                  <Button className="bg-[#32443E] hover:bg-[#3a5049]">
                    <Shield className="mr-2 h-4 w-4" />
                    Enable 2FA
                  </Button>
                ) : (
                  <Button variant="outline" className="text-red-500 hover:text-red-600">
                    Disable 2FA
                  </Button>
                )}
              </CardFooter>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your API keys</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Live API Key</h3>
                      <p className="text-sm text-gray-500">Use this key for production environments</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input className="w-64 font-mono text-sm" value={user.apiKey} readOnly />
                      <Button variant="outline" size="sm">
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">Test API Key</h3>
                      <p className="text-sm text-gray-500">Use this key for testing environments</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        className="w-64 font-mono text-sm"
                        value="sk_test_*****************************b3c1"
                        readOnly
                      />
                      <Button variant="outline" size="sm">
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">
                  <Key className="mr-2 h-4 w-4" />
                  Generate New API Key
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`cursor-pointer rounded-md border p-4 ${user.appearance.theme === "light" ? "border-[#32443E] bg-gray-50" : ""}`}
                  >
                    <div className="mb-2 h-20 rounded-md bg-white"></div>
                    <div className="text-center font-medium">Light</div>
                  </div>
                  <div
                    className={`cursor-pointer rounded-md border p-4 ${user.appearance.theme === "dark" ? "border-[#32443E] bg-gray-50" : ""}`}
                  >
                    <div className="mb-2 h-20 rounded-md bg-gray-900"></div>
                    <div className="text-center font-medium">Dark</div>
                  </div>
                  <div
                    className={`cursor-pointer rounded-md border p-4 ${user.appearance.theme === "system" ? "border-[#32443E] bg-gray-50" : ""}`}
                  >
                    <div className="mb-2 h-20 rounded-md bg-gradient-to-r from-white to-gray-900"></div>
                    <div className="text-center font-medium">System</div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Density</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`cursor-pointer rounded-md border p-4 ${user.appearance.density === "comfortable" ? "border-[#32443E] bg-gray-50" : ""}`}
                  >
                    <div className="space-y-3">
                      <div className="h-4 w-full rounded-md bg-gray-200"></div>
                      <div className="h-4 w-full rounded-md bg-gray-200"></div>
                      <div className="h-4 w-full rounded-md bg-gray-200"></div>
                    </div>
                    <div className="mt-2 text-center font-medium">Comfortable</div>
                  </div>
                  <div
                    className={`cursor-pointer rounded-md border p-4 ${user.appearance.density === "compact" ? "border-[#32443E] bg-gray-50" : ""}`}
                  >
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded-md bg-gray-200"></div>
                      <div className="h-3 w-full rounded-md bg-gray-200"></div>
                      <div className="h-3 w-full rounded-md bg-gray-200"></div>
                      <div className="h-3 w-full rounded-md bg-gray-200"></div>
                    </div>
                    <div className="mt-2 text-center font-medium">Compact</div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Language</h3>
                <div className="flex items-center space-x-4">
                  <Languages className="h-5 w-5 text-gray-500" />
                  <Select defaultValue={user.appearance.language}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-[#32443E] hover:bg-[#3a5049]" onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Manage your third-party integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between rounded-md border p-4">
                    <div className="space-y-1">
                      <h3 className="font-medium">{integration.name}</h3>
                      <div className="flex items-center">
                        <Badge className={integration.status === "active" ? "bg-emerald-500" : "bg-gray-500"}>
                          {integration.status}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant={integration.connected ? "outline" : "default"}
                      className={integration.connected ? "" : "bg-[#32443E] hover:bg-[#3a5049]"}
                    >
                      {integration.connected ? "Disconnect" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline">
                <Webhook className="mr-2 h-4 w-4" />
                Add New Integration
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>View system details and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md bg-gray-50 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Version</p>
                      <p>v2.4.1</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Updated</p>
                      <p>May 10, 2025</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Environment</p>
                      <p>Production</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-emerald-500"></div>
                        <span>Operational</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-md border p-4">
                  <h3 className="mb-2 font-medium">System Health</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm">Database</span>
                        <span className="text-sm text-gray-500">98%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div className="h-2 rounded-full bg-emerald-500" style={{ width: "98%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm">API</span>
                        <span className="text-sm text-gray-500">100%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div className="h-2 rounded-full bg-emerald-500" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm">Storage</span>
                        <span className="text-sm text-gray-500">72%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div className="h-2 rounded-full bg-amber-500" style={{ width: "72%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline">Check for Updates</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your system data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="mb-2 font-medium">Backup & Restore</h3>
                  <p className="mb-4 text-sm text-gray-500">
                    Create backups of your data or restore from a previous backup
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Create Backup
                    </Button>
                    <Button variant="outline" size="sm">
                      Restore
                    </Button>
                  </div>
                </div>
                <div className="rounded-md border p-4">
                  <h3 className="mb-2 font-medium">Export Data</h3>
                  <p className="mb-4 text-sm text-gray-500">Export your data in various formats</p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Export as CSV
                    </Button>
                    <Button variant="outline" size="sm">
                      Export as JSON
                    </Button>
                  </div>
                </div>
                <div className="rounded-md border border-red-200 bg-red-50 p-4">
                  <h3 className="mb-2 font-medium text-red-600">Danger Zone</h3>
                  <p className="mb-4 text-sm text-red-500">These actions are destructive and cannot be undone</p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      Clear Cache
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      Reset Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
