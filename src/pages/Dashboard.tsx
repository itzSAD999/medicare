import { Plus, Flame, Clock, Pill, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MedicationCard } from '@/components/dashboard/MedicationCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { AdherenceChart } from '@/components/dashboard/AdherenceChart';
import { useSupabaseMedications } from '@/hooks/useSupabaseMedications';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { mockWeeklyAdherence } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { medicationIcons } from '@/components/medications/MedicationIcons';
import { MedicationIconName } from '@/types/medication';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { medications, markDoseTaken, markDoseMissed, getTodayDoses, getStats, loading } = useSupabaseMedications();
  
  const todayDoses = getTodayDoses();
  const stats = getStats();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="gradient-hero text-primary-foreground px-6 pt-12 pb-24 lg:pt-8 lg:pb-20 lg:rounded-b-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative z-10 lg:flex lg:items-center lg:justify-between">
          <div>
            <p className="text-primary-foreground/80 text-sm font-medium">
              {greeting()},
            </p>
            <h1 className="text-2xl lg:text-3xl font-bold mt-1">{userName}</h1>
            <p className="text-primary-foreground/70 text-sm mt-1 hidden lg:block">{today}</p>
          </div>
          
          {/* Desktop Quick Stats in Header */}
          <div className="hidden lg:flex items-center gap-6 mt-4 lg:mt-0">
            <div className="text-center">
              <p className="text-3xl font-bold">{stats.taken}</p>
              <p className="text-primary-foreground/70 text-sm">Taken</p>
            </div>
            <div className="w-px h-12 bg-primary-foreground/20" />
            <div className="text-center">
              <p className="text-3xl font-bold">{stats.pending}</p>
              <p className="text-primary-foreground/70 text-sm">Pending</p>
            </div>
            <div className="w-px h-12 bg-primary-foreground/20" />
            <div className="text-center">
              <p className="text-3xl font-bold">{stats.missed}</p>
              <p className="text-primary-foreground/70 text-sm">Missed</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Overlapping Cards */}
      <div className="px-4 lg:px-6 -mt-16 relative z-20 pb-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Left Column - Progress & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Today's Progress Card */}
            <div className="bg-card rounded-3xl p-6 shadow-elevated border border-border/50 animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Today's Progress</h2>
                  <p className="text-sm text-muted-foreground">
                    {stats.taken} of {stats.total} doses taken
                  </p>
                </div>
                <ProgressRing percentage={stats.percentage} size={80} strokeWidth={8}>
                  <span className="text-lg font-bold">{stats.percentage}%</span>
                </ProgressRing>
              </div>

              <AdherenceChart data={mockWeeklyAdherence} className="mt-4" />
              
              <p className="text-xs text-center text-muted-foreground mt-3">
                Weekly adherence overview
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 animate-fade-in-up stagger-1">
              <StatsCard
                title="Streak"
                value="3 days"
                icon={Flame}
                variant="primary"
                trend="up"
                trendValue="Keep it up!"
              />
              <StatsCard
                title="Pending"
                value={stats.pending}
                subtitle="doses remaining"
                icon={Clock}
                variant={stats.pending > 0 ? 'warning' : 'default'}
              />
            </div>

            {/* Desktop: Additional Stats */}
            <div className="hidden lg:grid grid-cols-2 gap-4 animate-fade-in-up stagger-2">
              <StatsCard
                title="Taken Today"
                value={stats.taken}
                icon={CheckCircle2}
                variant="success"
              />
              <StatsCard
                title="Missed Today"
                value={stats.missed}
                icon={XCircle}
                variant={stats.missed > 0 ? 'warning' : 'default'}
              />
            </div>
          </div>

          {/* Right Column - Medications */}
          <div className="lg:col-span-2 mt-6 lg:mt-0 animate-fade-in-up stagger-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Today's Medications</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary"
                onClick={() => navigate('/medications')}
              >
                See all
              </Button>
            </div>

            <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
              {todayDoses.length === 0 ? (
                <div className="lg:col-span-2 text-center py-8 bg-card rounded-2xl border border-dashed border-border">
                  <Pill className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">No medications scheduled</p>
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => navigate('/medications/add')}
                  >
                    Add your first medication
                  </Button>
                </div>
              ) : (
                todayDoses.map((dose, index) => (
                  <MedicationCard
                    key={dose.id}
                    medication={{
                      id: dose.medication.id,
                      name: dose.medication.name,
                      dosage: dose.medication.dosage,
                      frequency: dose.medication.frequency as any,
                      instructions: dose.medication.instructions || undefined,
                      color: dose.medication.color,
                      iconName: (dose.medication.icon_name || 'pill') as MedicationIconName,
                      stock: dose.medication.stock,
                      refillReminder: dose.medication.refill_reminder,
                      doses: [],
                      createdAt: dose.medication.created_at,
                    }}
                    dose={{
                      id: dose.id,
                      time: dose.scheduled_time,
                      status: dose.status as any,
                      takenAt: dose.taken_at || undefined,
                    }}
                    onMarkTaken={markDoseTaken}
                    onMarkMissed={markDoseMissed}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  />
                ))
              )}
            </div>

            {/* Desktop: Upcoming Schedule */}
            <div className="hidden lg:block mt-6 bg-card rounded-2xl p-5 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Upcoming Schedule
                </h3>
              </div>
              <div className="space-y-3">
                {todayDoses
                  .filter((d) => d.status === 'upcoming')
                  .slice(0, 3)
                  .map((dose) => {
                    const iconName = (dose.medication.icon_name || 'pill') as MedicationIconName;
                    const MedIcon = medicationIcons[iconName] || medicationIcons.pill;
                    return (
                      <div
                        key={dose.id}
                        className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl"
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${dose.medication.color}15` }}
                        >
                          <MedIcon className="w-5 h-5" style={{ color: dose.medication.color }} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{dose.medication.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {dose.medication.dosage}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {dose.scheduled_time}
                        </p>
                      </div>
                    );
                  })}
                {todayDoses.filter((d) => d.status === 'upcoming').length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No more doses scheduled for today
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Floating Action Button */}
      <Button
        size="icon-lg"
        variant="gradient"
        className="fixed bottom-28 right-6 z-30 shadow-elevated lg:hidden"
        onClick={() => navigate('/medications/add')}
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default Dashboard;
