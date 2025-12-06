import { TrendingUp, Calendar, Target, Award, ChevronRight, Download, BarChart3 } from 'lucide-react';
import { ProgressRing } from '@/components/dashboard/ProgressRing';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { mockWeeklyAdherence, getAdherenceStats, mockMedications } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const Insights = () => {
  const stats = getAdherenceStats();

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const chartData = mockWeeklyAdherence.map((day, index) => ({
    name: weekdays[index],
    taken: day.taken,
    missed: day.missed,
    percentage: day.percentage,
  }));

  const medicationStats = mockMedications.map((med) => ({
    name: med.name,
    taken: med.doses.filter((d) => d.status === 'taken').length,
    total: med.doses.length,
    percentage: Math.round(
      (med.doses.filter((d) => d.status === 'taken').length / med.doses.length) * 100
    ),
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/50 px-6 pt-12 pb-6 lg:pt-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Insights</h1>
            <p className="text-muted-foreground mt-1">Track your medication adherence</p>
          </div>
          <Button variant="outline" className="hidden lg:flex mt-4 lg:mt-0">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </header>

      <div className="px-4 lg:px-6 py-6 space-y-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Overall Adherence */}
            <div className="bg-card rounded-3xl p-6 border border-border/50 shadow-soft animate-fade-in-up">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Weekly Adherence</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stats.takenDoses} of {stats.totalDoses} doses taken
                  </p>
                </div>
                <ProgressRing percentage={stats.weeklyPercentage} size={100} strokeWidth={10}>
                  <div className="text-center">
                    <span className="text-2xl font-bold">{stats.weeklyPercentage}%</span>
                  </div>
                </ProgressRing>
              </div>

              {/* Weekly Breakdown */}
              <div className="mt-6 grid grid-cols-7 gap-2">
                {mockWeeklyAdherence.map((day, index) => {
                  const isToday = index === mockWeeklyAdherence.length - 1;
                  return (
                    <div key={day.date} className="text-center">
                      <div
                        className={cn(
                          'w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-sm font-medium mb-1',
                          day.percentage >= 80
                            ? 'bg-success/20 text-success'
                            : day.percentage >= 50
                            ? 'bg-warning/20 text-warning'
                            : day.percentage > 0
                            ? 'bg-destructive/20 text-destructive'
                            : 'bg-secondary text-muted-foreground',
                          isToday && 'ring-2 ring-primary ring-offset-2'
                        )}
                      >
                        {day.percentage}%
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {weekdays[index]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 animate-fade-in-up stagger-1">
              <StatsCard
                title="Current Streak"
                value={`${stats.streak} days`}
                icon={Award}
                variant="primary"
              />
              <StatsCard
                title="Missed Doses"
                value={stats.missedDoses}
                subtitle="this week"
                icon={Target}
                variant={stats.missedDoses > 0 ? 'warning' : 'success'}
              />
            </div>
          </div>

          {/* Center Column - Charts (Desktop) */}
          <div className="hidden lg:block lg:col-span-2 space-y-6">
            {/* Bar Chart */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 animate-fade-in-up stagger-2">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Weekly Dose Overview
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                      }}
                    />
                    <Bar dataKey="taken" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Taken" />
                    <Bar dataKey="missed" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Missed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Line Chart */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 animate-fade-in-up stagger-3">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Adherence Trend
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="percentage"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                      name="Adherence %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Medication Breakdown */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 animate-fade-in-up stagger-4">
              <h3 className="font-semibold mb-4">Adherence by Medication</h3>
              <div className="space-y-4">
                {medicationStats.map((med) => (
                  <div key={med.name} className="flex items-center gap-4">
                    <span className="text-sm font-medium w-28 truncate">{med.name}</span>
                    <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          med.percentage >= 80
                            ? 'bg-success'
                            : med.percentage >= 50
                            ? 'bg-warning'
                            : 'bg-destructive'
                        )}
                        style={{ width: `${med.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{med.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-card rounded-2xl p-4 lg:p-6 border border-border/50 animate-fade-in-up stagger-2 lg:stagger-5">
          <h3 className="font-semibold mb-4">Achievements</h3>
          <div className="grid gap-3 lg:grid-cols-3">
            <AchievementItem
              title="First Week Complete"
              description="Completed your first week of tracking"
              unlocked
            />
            <AchievementItem
              title="Perfect Day"
              description="Take all medications on time"
              unlocked
            />
            <AchievementItem
              title="Week Warrior"
              description="7 days with 100% adherence"
              unlocked={false}
              progress={3}
              total={7}
            />
          </div>
        </div>

        {/* Tips */}
        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20 animate-fade-in-up stagger-3 lg:stagger-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              💡
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Pro Tip</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Set your medication reminders for the same time each day to build a consistent habit.
              </p>
            </div>
          </div>
        </div>

        {/* Export Button - Mobile */}
        <Button variant="outline" className="w-full lg:hidden">
          <Download className="w-4 h-4 mr-2" />
          Export Report as PDF
        </Button>
      </div>
    </div>
  );
};

const AchievementItem = ({
  title,
  description,
  unlocked,
  progress,
  total,
}: {
  title: string;
  description: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
}) => (
  <div
    className={cn(
      'flex items-center gap-3 p-3 rounded-xl transition-all',
      unlocked ? 'bg-success/10' : 'bg-secondary'
    )}
  >
    <div
      className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center text-lg',
        unlocked ? 'bg-success/20' : 'bg-muted'
      )}
    >
      {unlocked ? '🏆' : '🔒'}
    </div>
    <div className="flex-1">
      <p className={cn('font-medium', !unlocked && 'text-muted-foreground')}>
        {title}
      </p>
      <p className="text-xs text-muted-foreground">{description}</p>
      {!unlocked && progress !== undefined && total !== undefined && (
        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${(progress / total) * 100}%` }}
          />
        </div>
      )}
    </div>
  </div>
);

export default Insights;
