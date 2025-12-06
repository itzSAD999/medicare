import { NavLink } from 'react-router-dom';
import { Home, Pill, BarChart3, Bell, User, Plus, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/medications', icon: Pill, label: 'Medications' },
  { to: '/insights', icon: BarChart3, label: 'Insights' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export const DesktopSidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border/50 min-h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">MedMind</h1>
            <p className="text-xs text-muted-foreground">Medication Tracker</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      'w-5 h-5 transition-transform duration-200',
                      isActive && 'scale-110'
                    )}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Quick Add Button */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <Button
            variant="gradient"
            className="w-full justify-start gap-3"
            onClick={() => navigate('/medications/add')}
          >
            <Plus className="w-5 h-5" />
            Add Medication
          </Button>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <div className="bg-primary/5 rounded-xl p-4">
          <p className="text-sm font-medium">Need help?</p>
          <p className="text-xs text-muted-foreground mt-1">
            Visit our support center for guidance
          </p>
          <Button variant="outline" size="sm" className="w-full mt-3">
            Get Help
          </Button>
        </div>
      </div>
    </aside>
  );
};
