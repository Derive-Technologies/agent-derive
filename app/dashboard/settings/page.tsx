'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Settings,
  Building,
  Users,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Mail,
  Key,
  Zap,
  AlertTriangle,
  Save,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff
} from 'lucide-react'

export default function SettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [tenantData, setTenantData] = useState({
    name: 'Acme Corporation',
    domain: 'acme.com',
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'English',
    description: 'Leading technology solutions provider',
    logoUrl: '',
    primaryColor: '#3B82F6',
    maxUsers: 100,
    currentUsers: 24
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    workflowUpdates: true,
    approvalReminders: true,
    systemAlerts: true,
    weeklyReports: false,
    securityAlerts: true
  })

  const [integrationSettings, setIntegrationSettings] = useState({
    slackEnabled: true,
    teamsEnabled: false,
    webhookUrl: 'https://hooks.slack.com/services/...',
    apiKey: 'sk-1234567890abcdef...',
    ssoEnabled: false,
    samlProvider: ''
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your tenant configuration and preferences"
      />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Organization Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={tenantData.name}
                    onChange={(e) => setTenantData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    value={tenantData.domain}
                    onChange={(e) => setTenantData(prev => ({ ...prev, domain: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={tenantData.timezone} onValueChange={(value) => setTenantData(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={tenantData.currency} onValueChange={(value) => setTenantData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={tenantData.description}
                  onChange={(e) => setTenantData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of your organization"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  type="url"
                  value={tenantData.logoUrl}
                  onChange={(e) => setTenantData(prev => ({ ...prev, logoUrl: e.target.value }))}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="flex justify-end">
                <Button className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workflow Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Default Workflow Timeout</Label>
                  <Select defaultValue="24h">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="4h">4 hours</SelectItem>
                      <SelectItem value="8h">8 hours</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="48h">48 hours</SelectItem>
                      <SelectItem value="7d">7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default Approval Levels</Label>
                  <Select defaultValue="2">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 level</SelectItem>
                      <SelectItem value="2">2 levels</SelectItem>
                      <SelectItem value="3">3 levels</SelectItem>
                      <SelectItem value="4">4 levels</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-approve low-value requests</Label>
                    <p className="text-sm text-gray-600">Automatically approve requests under a certain threshold</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require comments on rejection</Label>
                    <p className="text-sm text-gray-600">Force approvers to provide comments when rejecting requests</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Management */}
        <TabsContent value="users" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Invite User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span>Users: {tenantData.currentUsers} / {tenantData.maxUsers}</span>
                  <div className="w-48 bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(tenantData.currentUsers / tenantData.maxUsers) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'John Smith', email: 'john@acme.com', role: 'Admin', status: 'Active', lastSeen: '2 hours ago' },
                    { name: 'Sarah Johnson', email: 'sarah@acme.com', role: 'Manager', status: 'Active', lastSeen: '1 day ago' },
                    { name: 'Mike Davis', email: 'mike@acme.com', role: 'User', status: 'Active', lastSeen: '3 days ago' },
                    { name: 'Lisa Anderson', email: 'lisa@acme.com', role: 'User', status: 'Inactive', lastSeen: '1 week ago' }
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                        <span className="text-sm text-gray-500">{user.role}</span>
                        <span className="text-sm text-gray-400">{user.lastSeen}</span>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    role: 'Admin', 
                    users: 1, 
                    permissions: ['Full access', 'User management', 'System settings', 'Billing'] 
                  },
                  { 
                    role: 'Manager', 
                    users: 3, 
                    permissions: ['Create workflows', 'Approve requests', 'View analytics', 'Manage team'] 
                  },
                  { 
                    role: 'User', 
                    users: 20, 
                    permissions: ['Submit requests', 'View own workflows', 'Basic approvals'] 
                  }
                ].map((roleData, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{roleData.role}</h4>
                        <p className="text-sm text-gray-500">{roleData.users} users</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {roleData.permissions.map((permission, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Workflow Updates</Label>
                    <p className="text-sm text-gray-600">Get notified when workflows are updated</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.workflowUpdates}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, workflowUpdates: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Approval Reminders</Label>
                    <p className="text-sm text-gray-600">Reminders for pending approvals</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.approvalReminders}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, approvalReminders: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>System Alerts</Label>
                    <p className="text-sm text-gray-600">Important system notifications</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.systemAlerts}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, systemAlerts: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Reports</Label>
                    <p className="text-sm text-gray-600">Weekly summary reports</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-gray-600">Critical security notifications</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.securityAlerts}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, securityAlerts: checked }))}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Notification Email</Label>
                    <Input type="email" placeholder="notifications@acme.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Reminder Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Slack Integration */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        💬
                      </div>
                      <div>
                        <h4 className="font-medium">Slack</h4>
                        <p className="text-sm text-gray-500">Team communication</p>
                      </div>
                    </div>
                    <Switch 
                      checked={integrationSettings.slackEnabled}
                      onCheckedChange={(checked) => setIntegrationSettings(prev => ({ ...prev, slackEnabled: checked }))}
                    />
                  </div>
                  {integrationSettings.slackEnabled && (
                    <div className="space-y-2">
                      <Label>Webhook URL</Label>
                      <Input 
                        value={integrationSettings.webhookUrl}
                        onChange={(e) => setIntegrationSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                        placeholder="https://hooks.slack.com/services/..."
                      />
                    </div>
                  )}
                </div>

                {/* Microsoft Teams */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        📞
                      </div>
                      <div>
                        <h4 className="font-medium">Microsoft Teams</h4>
                        <p className="text-sm text-gray-500">Team collaboration</p>
                      </div>
                    </div>
                    <Switch 
                      checked={integrationSettings.teamsEnabled}
                      onCheckedChange={(checked) => setIntegrationSettings(prev => ({ ...prev, teamsEnabled: checked }))}
                    />
                  </div>
                  {integrationSettings.teamsEnabled && (
                    <div className="space-y-2">
                      <Label>Teams Webhook URL</Label>
                      <Input placeholder="https://outlook.office.com/webhook/..." />
                    </div>
                  )}
                </div>

                {/* Email Integration */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Email SMTP</h4>
                        <p className="text-sm text-gray-500">Custom email server</p>
                      </div>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </div>

                {/* Webhook Integration */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">Webhooks</h4>
                        <p className="text-sm text-gray-500">Custom API endpoints</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Configure</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input
                    type={showApiKey ? 'text' : 'password'}
                    value={integrationSettings.apiKey}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline">Regenerate</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Webhook Endpoints</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <code className="text-sm">POST /webhook/workflow-completed</code>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <code className="text-sm">POST /webhook/approval-required</code>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Single Sign-On (SSO)</Label>
                    <p className="text-sm text-gray-600">Enable SAML-based authentication</p>
                  </div>
                  <Switch 
                    checked={integrationSettings.ssoEnabled}
                    onCheckedChange={(checked) => setIntegrationSettings(prev => ({ ...prev, ssoEnabled: checked }))}
                  />
                </div>

                {integrationSettings.ssoEnabled && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pl-4 border-l-2 border-blue-200">
                    <div className="space-y-2">
                      <Label>SAML Provider</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="okta">Okta</SelectItem>
                          <SelectItem value="azure">Azure AD</SelectItem>
                          <SelectItem value="google">Google Workspace</SelectItem>
                          <SelectItem value="custom">Custom SAML</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Entity ID</Label>
                      <Input placeholder="https://your-domain.com/saml" />
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Require 2FA for all users</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-gray-600">Automatic logout after inactivity</p>
                  </div>
                  <Select defaultValue="8h">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="4h">4 hours</SelectItem>
                      <SelectItem value="8h">8 hours</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Password Policy</Label>
                    <p className="text-sm text-gray-600">Enforce strong password requirements</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Audit Log Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Log user actions</span>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Log system events</span>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Log API access</span>
                    <Switch defaultChecked={false} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Data Retention Period</Label>
                <Select defaultValue="2years">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6months">6 months</SelectItem>
                    <SelectItem value="1year">1 year</SelectItem>
                    <SelectItem value="2years">2 years</SelectItem>
                    <SelectItem value="5years">5 years</SelectItem>
                    <SelectItem value="indefinite">Indefinite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>GDPR Compliance</Label>
                  <p className="text-sm text-gray-600">Enable GDPR compliance features</p>
                </div>
                <Switch defaultChecked={true} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Data Export</Label>
                  <p className="text-sm text-gray-600">Allow users to export their data</p>
                </div>
                <Switch defaultChecked={true} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing & Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-green-800">Professional Plan</h4>
                    <p className="text-sm text-green-600">Active until March 15, 2024</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-800">$49</div>
                    <div className="text-sm text-green-600">per month</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">100</div>
                  <div className="text-sm text-gray-600">Max Users</div>
                  <div className="text-xs text-gray-500">24 currently active</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">∞</div>
                  <div className="text-sm text-gray-600">Workflows</div>
                  <div className="text-xs text-gray-500">Unlimited</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                  <div className="text-xs text-gray-500">Priority support</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Payment Method</h4>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <div className="font-medium">**** **** **** 4242</div>
                      <div className="text-sm text-gray-500">Expires 12/25</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Billing History</h4>
                <div className="space-y-2">
                  {[
                    { date: 'Feb 15, 2024', amount: '$49.00', status: 'Paid', invoice: 'INV-001' },
                    { date: 'Jan 15, 2024', amount: '$49.00', status: 'Paid', invoice: 'INV-002' },
                    { date: 'Dec 15, 2023', amount: '$49.00', status: 'Paid', invoice: 'INV-003' }
                  ].map((bill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{bill.invoice}</div>
                        <div className="text-sm text-gray-500">{bill.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{bill.amount}</div>
                        <Badge variant="outline" className="text-xs">
                          {bill.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">Change Plan</Button>
                <Button variant="outline">Download Invoices</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}