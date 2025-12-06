import { Bell, BellOff, Clock, AlertTriangle, Check, Settings, Trash2, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

interface NotificationItem {
  id: string;
  type: 'reminder' | 'missed' | 'refill' | 'achievement';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'reminder',
    title: 'Time for Metformin',
    message: 'Take your 500mg dose with breakfast',
    time: '8:00 AM',
    read: false,
  },
  {
    id: '2',
    type: 'missed',
    title: 'Missed Dose',
    message: 'You missed Omeprazole at 7:30 AM',
    time: '9:00 AM',
    read: false,
  },
  {
    id: '3',
    type: 'refill',
    title: 'Refill Reminder',
    message: 'Omeprazole is running low (12 left)',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '4',
    type: 'achievement',
    title: 'Achievement Unlocked! 🎉',
    message: 'You completed your first perfect day',
    time: '2 days ago',
    read: true,
  },
];

const typeConfig = {
  reminder: {
    icon: Clock,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  missed: {
    icon: AlertTriangle,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
  },
  refill: {
    icon: AlertTriangle,
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  achievement: {
    icon: Check,
    color: 'text-success',
    bg: 'bg-success/10',
  },
};

const Notifications = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [reminderTime, setReminderTime] = useState('15');
  const [refillDays, setRefillDays] = useState('3');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success('Notification deleted');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/50 px-6 pt-12 pb-6 lg:pt-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-4 lg:mt-0">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllRead}>
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-destructive hover:text-destructive">
                Clear all
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="px-4 lg:px-6 py-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Toggle */}
            <div className="bg-card rounded-2xl p-4 border border-border/50 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center',
                      notificationsEnabled
                        ? 'bg-primary/10 text-primary'
                        : 'bg-secondary text-muted-foreground'
                    )}
                  >
                    {notificationsEnabled ? (
                      <Bell className="w-5 h-5" />
                    ) : (
                      <BellOff className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      {notificationsEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
            </div>

            {/* Notification List */}
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground px-1">Recent</h2>
              
              {notifications.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-border">
                  <Bell className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground">No notifications yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    You'll receive reminders here when it's time for your medications
                  </p>
                </div>
              ) : (
                notifications.map((notification, index) => {
                  const config = typeConfig[notification.type];
                  const Icon = config.icon;

                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        'bg-card rounded-2xl p-4 border border-border/50 transition-all animate-fade-in-up group',
                        !notification.read && 'bg-primary/5 border-primary/20'
                      )}
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center',
                            config.bg,
                            config.color
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium">{notification.title}</p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                          )}
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Settings Sidebar - Desktop */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-card rounded-2xl p-5 border border-border/50 animate-fade-in-up stagger-2">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Settings className="w-5 h-5" />
                Notification Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Remind me before dose
                  </label>
                  <Select value={reminderTime} onValueChange={setReminderTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes before</SelectItem>
                      <SelectItem value="10">10 minutes before</SelectItem>
                      <SelectItem value="15">15 minutes before</SelectItem>
                      <SelectItem value="30">30 minutes before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Refill reminder
                  </label>
                  <Select value={refillDays} onValueChange={setRefillDays}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day before</SelectItem>
                      <SelectItem value="3">3 days before</SelectItem>
                      <SelectItem value="7">1 week before</SelectItem>
                      <SelectItem value="14">2 weeks before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 space-y-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Missed dose alerts</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Achievement notifications</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly summary</span>
                    <Switch />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20">
              <p className="text-sm">
                <strong>Pro tip:</strong> Enable browser notifications for real-time medication reminders even when the app isn't open.
              </p>
              <Button variant="outline" size="sm" className="w-full mt-3">
                Enable Browser Notifications
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile: Settings Link */}
        <Button
          variant="outline"
          className="w-full justify-between mt-6 lg:hidden"
          onClick={() => {}}
        >
          <span className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Notification Settings
          </span>
          <span>→</span>
        </Button>
      </div>
    </div>
  );
};

export default Notifications;
