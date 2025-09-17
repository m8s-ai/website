import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Eye,
  Clock,
  Save,
  LogOut,
  Key,
  Smartphone,
  AlertTriangle
} from 'lucide-react';
import type { User as UserType } from '../../types/auth';

interface UserProfileProps {
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ className }) => {
  const { state, logout, updatePreferences } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [preferences, setPreferences] = useState(state.user?.preferences || {});
  const [isSaving, setIsSaving] = useState(false);

  const user = state.user;

  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-400">No user data available</p>
      </div>
    );
  }

  const handleSavePreferences = async () => {
    try {
      setIsSaving(true);
      await updatePreferences(preferences);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await logout();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeColor = (role: UserType['role']) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'developer': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'user': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'viewer': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Profile Header */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-400">@{user.username}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                  <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                    {user.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 glass-card">
          <TabsTrigger value="info" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center space-x-2">
            <Key className="w-4 h-4" />
            <span className="hidden sm:inline">Permissions</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Information */}
        <TabsContent value="info">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">First Name</Label>
                  <Input value={user.firstName} disabled className="glass-input" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Last Name</Label>
                  <Input value={user.lastName} disabled className="glass-input" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Email</Label>
                  <Input value={user.email} disabled className="glass-input" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Username</Label>
                  <Input value={user.username} disabled className="glass-input" />
                </div>
              </div>
              
              <Separator className="bg-gray-700/50" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-300">Member Since</Label>
                  <div className="flex items-center space-x-2 p-3 bg-gray-800/30 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{formatDate(user.createdAt)}</span>
                  </div>
                </div>
                {user.lastLoginAt && (
                  <div className="space-y-2">
                    <Label className="text-gray-300">Last Login</Label>
                    <div className="flex items-center space-x-2 p-3 bg-gray-800/30 rounded-lg">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{formatDate(user.lastLoginAt)}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences */}
        <TabsContent value="preferences">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>User Preferences</CardTitle>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setPreferences(user.preferences);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSavePreferences}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      {isSaving ? (
                        <>
                          <Save className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Palette className="w-5 h-5 text-gray-400" />
                  <Label className="text-gray-300">Theme</Label>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {['dark', 'light', 'system'].map((theme) => (
                    <button
                      key={theme}
                      className={cn(
                        'p-3 rounded-lg border transition-colors',
                        preferences.theme === theme
                          ? 'bg-blue-500/20 border-blue-500'
                          : 'bg-gray-800/30 border-gray-700 hover:border-gray-600',
                        !isEditing && 'cursor-not-allowed opacity-50'
                      )}
                      disabled={!isEditing}
                      onClick={() => isEditing && setPreferences(prev => ({ ...prev, theme: theme as any }))}
                    >
                      <span className="text-sm text-gray-300 capitalize">{theme}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="bg-gray-700/50" />

              {/* Language */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <Label className="text-gray-300">Language</Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'en', label: 'English' },
                    { value: 'he', label: 'עברית' }
                  ].map((lang) => (
                    <button
                      key={lang.value}
                      className={cn(
                        'p-3 rounded-lg border transition-colors',
                        preferences.language === lang.value
                          ? 'bg-blue-500/20 border-blue-500'
                          : 'bg-gray-800/30 border-gray-700 hover:border-gray-600',
                        !isEditing && 'cursor-not-allowed opacity-50'
                      )}
                      disabled={!isEditing}
                      onClick={() => isEditing && setPreferences(prev => ({ ...prev, language: lang.value as any }))}
                    >
                      <span className="text-sm text-gray-300">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="bg-gray-700/50" />

              {/* Notifications */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <Label className="text-gray-300">Notifications</Label>
                </div>
                <div className="space-y-3">
                  {[
                    { key: 'email', label: 'Email notifications' },
                    { key: 'browser', label: 'Browser notifications' },
                    { key: 'agentAlerts', label: 'Agent alerts' },
                    { key: 'systemUpdates', label: 'System updates' }
                  ].map((notification) => (
                    <div key={notification.key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{notification.label}</span>
                      <Switch
                        checked={preferences.notifications?.[notification.key] || false}
                        onCheckedChange={(checked) => 
                          isEditing && setPreferences(prev => ({
                            ...prev,
                            notifications: { ...prev.notifications, [notification.key]: checked }
                          }))
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-300">
                      <p className="font-medium mb-1">Demo Mode</p>
                      <p>Password changes and security features are disabled in demo mode.</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <Button variant="outline" disabled className="justify-start">
                    <Key className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" disabled className="justify-start">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Two-Factor Authentication
                  </Button>
                  <Button variant="outline" disabled className="justify-start">
                    <Eye className="w-4 h-4 mr-2" />
                    Active Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Permissions */}
        <TabsContent value="permissions">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Permissions & Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {user.permissions.map((permission) => (
                  <div key={permission} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <span className="text-sm text-gray-300">{permission.replace(':', ' ')}</span>
                    <Badge variant="default" className="bg-green-500/20 text-green-400">
                      Granted
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;