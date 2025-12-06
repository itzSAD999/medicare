import { useState } from 'react';
import {
  User,
  Bell,
  Moon,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Settings,
  FileText,
  Globe,
  Clock,
  Camera,
  Mail,
  Phone,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useSupabaseMedications } from '@/hooks/useSupabaseMedications';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { medications, getStats } = useSupabaseMedications();
  const stats = getStats();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleStartEdit = () => {
    setEditName(profile?.full_name || '');
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    
    setSaving(true);
    const { error } = await updateProfile({ full_name: editName.trim() });
    setSaving(false);
    
    if (!error) {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName('');
  };

  const handleToggleNotifications = async (enabled: boolean) => {
    await updateProfile({ notifications_enabled: enabled });
  };

  const handleTimeFormatChange = async (format: string) => {
    await updateProfile({ time_format: format });
  };

  const handleLanguageChange = async (lang: string) => {
    await updateProfile({ language: lang });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const menuItems = [
    {
      icon: Bell,
      label: 'Notifications',
      description: profile?.notifications_enabled ? 'Enabled' : 'Disabled',
      hasToggle: true,
      toggleValue: profile?.notifications_enabled ?? true,
      onToggle: handleToggleNotifications,
    },
    {
      icon: Shield,
      label: 'Privacy & Security',
      description: 'Password, data settings',
      onClick: () => toast.info('Privacy settings coming soon'),
    },
    {
      icon: FileText,
      label: 'Export Data',
      description: 'Download your health report',
      onClick: () => toast.success('Report download started'),
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'FAQs, contact us',
      onClick: () => toast.info('Help center coming soon'),
    },
  ];

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero text-primary-foreground px-6 pt-12 pb-20 lg:pt-8 lg:pb-16 lg:rounded-b-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-primary-foreground/70 text-sm mt-1 hidden lg:block">
            Manage your account and preferences
          </p>
        </div>
      </header>

      <div className="px-4 lg:px-6 -mt-12 relative z-20">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-3xl p-6 shadow-elevated border border-border/50 animate-fade-in-up">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-2xl text-primary-foreground font-bold">
                    {(profile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-secondary border-2 border-card flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-8 text-lg font-bold"
                        autoFocus
                      />
                      <Button
                        size="icon-sm"
                        variant="success"
                        onClick={handleSaveProfile}
                        disabled={saving}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={handleCancelEdit}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold truncate">
                        {profile?.full_name || 'User'}
                      </h2>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={handleStartEdit}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground truncate">
                    {profile?.email || user?.email}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{medications.length}</p>
                  <p className="text-xs text-muted-foreground">Medications</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{stats.percentage}%</p>
                  <p className="text-xs text-muted-foreground">Adherence</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">3</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </div>

            {/* Preferences - Desktop */}
            <div className="hidden lg:block bg-card rounded-2xl p-5 border border-border/50 mt-6 animate-fade-in-up stagger-1">
              <h3 className="font-semibold mb-4">Preferences</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Time Format</Label>
                  <Select 
                    value={profile?.time_format || '12h'} 
                    onValueChange={handleTimeFormatChange}
                  >
                    <SelectTrigger>
                      <Clock className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Language</Label>
                  <Select 
                    value={profile?.language || 'en'} 
                    onValueChange={handleLanguageChange}
                  >
                    <SelectTrigger>
                      <Globe className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="lg:col-span-2 mt-6 lg:mt-0 space-y-4">
            {/* Menu Items */}
            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <div
                  key={item.label}
                  className={cn(
                    'bg-card rounded-2xl border border-border/50 overflow-hidden animate-fade-in-up'
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <button
                    onClick={item.onClick}
                    className="w-full flex items-center gap-4 p-4 text-left transition-colors hover:bg-secondary/50"
                  >
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    {item.hasToggle ? (
                      <Switch
                        checked={item.toggleValue}
                        onCheckedChange={item.onToggle}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Account Info */}
            <div className="bg-card rounded-2xl p-5 border border-border/50 animate-fade-in-up stagger-3">
              <h3 className="font-semibold mb-4">Account Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Member since:</span>
                  <span className="font-medium">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout */}
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 h-14 rounded-2xl"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>

            {/* Version */}
            <p className="text-center text-xs text-muted-foreground pt-4">
              MedMind v1.0.0 • Made with ❤️ for your health
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
