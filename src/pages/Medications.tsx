import { useState } from 'react';
import { Plus, Search, Package, AlertTriangle, Grid, List, Trash2, Edit, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSupabaseMedications } from '@/hooks/useSupabaseMedications';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { medicationIcons } from '@/components/medications/MedicationIcons';
import { MedicationIconName } from '@/types/medication';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Medications = () => {
  const navigate = useNavigate();
  const { medications, deleteMedication, loading } = useSupabaseMedications();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const filteredMedications = medications.filter((med) =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockMeds = medications.filter((med) => med.stock <= 10 && med.refill_reminder);

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'once': return 'Once daily';
      case 'twice': return 'Twice daily';
      case 'three-times': return '3 times daily';
      case 'four-times': return '4 times daily';
      default: return 'As needed';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading medications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/50 px-6 pt-12 pb-6 lg:pt-8 sticky top-0 z-40">
        <div className="lg:flex lg:items-center lg:justify-between lg:gap-6">
          <div>
            <h1 className="text-2xl font-bold">Medications</h1>
            <p className="text-muted-foreground text-sm mt-1 hidden lg:block">
              Manage your medication schedule
            </p>
          </div>
          
          {/* Desktop: Add Buttons */}
          <div className="hidden lg:flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/medications/select')}
            >
              <Library className="w-4 h-4 mr-2" />
              Select from Library
            </Button>
            <Button
              variant="gradient"
              onClick={() => navigate('/medications/add')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Custom
            </Button>
          </div>
        </div>
        
        {/* Search & View Toggle */}
        <div className="flex items-center gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search medications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-0"
            />
          </div>
          
          {/* View Toggle - Desktop Only */}
          <div className="hidden lg:flex items-center gap-1 bg-secondary rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon-sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon-sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="px-4 lg:px-6 py-6 space-y-6">
        {/* Low Stock Alert */}
        {lowStockMeds.length > 0 && (
          <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 animate-fade-in-up">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Low Stock Alert</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {lowStockMeds.map((m) => m.name).join(', ')} running low
                </p>
              </div>
              <Button variant="outline" size="sm" className="hidden lg:flex">
                Order Refill
              </Button>
            </div>
          </div>
        )}

        {/* Medication List/Grid */}
        <div className={cn(
          viewMode === 'grid' && 'lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4',
          'space-y-3 lg:space-y-0'
        )}>
          {filteredMedications.length === 0 ? (
            <div className="text-center py-12 lg:col-span-full">
              <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="font-semibold text-lg">No medications found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery ? 'Try a different search' : 'Add your first medication'}
              </p>
              <div className="flex gap-2 justify-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/medications/select')}
                >
                  <Library className="w-4 h-4 mr-2" />
                  Select from Library
                </Button>
                <Button
                  variant="default"
                  onClick={() => navigate('/medications/add')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom
                </Button>
              </div>
            </div>
          ) : (
            filteredMedications.map((medication, index) => {
              const iconName = (medication.icon_name || 'pill') as MedicationIconName;
              const MedIcon = medicationIcons[iconName] || medicationIcons.pill;
              
              return (
                <div
                  key={medication.id}
                  className={cn(
                    'bg-card rounded-2xl p-4 border border-border/50 shadow-soft',
                    'transition-all duration-200 hover:shadow-medium',
                    'animate-fade-in-up',
                    viewMode === 'list' && 'mb-3 lg:mb-0'
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${medication.color}15` }}
                    >
                      <MedIcon className="w-7 h-7" style={{ color: medication.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{medication.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {medication.dosage} • {getFrequencyLabel(medication.frequency)}
                      </p>
                      {medication.instructions && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {medication.instructions}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={cn(
                            'text-xs px-2 py-0.5 rounded-full',
                            medication.stock <= 10
                              ? 'bg-warning/10 text-warning'
                              : 'bg-secondary text-muted-foreground'
                          )}
                        >
                          {medication.stock} left
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {medication.doses.length} dose{medication.doses.length !== 1 ? 's' : ''}/day
                        </span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => navigate(`/medications/${medication.id}`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete {medication.name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the medication and all associated reminders.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteMedication(medication.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {/* Schedule Preview - Desktop Grid View */}
                  {viewMode === 'grid' && medication.doses.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2">Today's schedule:</p>
                      <div className="flex flex-wrap gap-2">
                        {medication.doses.map((dose) => (
                          <span
                            key={dose.id}
                            className={cn(
                              'text-xs px-2 py-1 rounded-lg',
                              dose.status === 'taken' && 'bg-success/10 text-success',
                              dose.status === 'missed' && 'bg-destructive/10 text-destructive',
                              dose.status === 'pending' && 'bg-warning/10 text-warning',
                              dose.status === 'upcoming' && 'bg-secondary text-muted-foreground'
                            )}
                          >
                            {dose.scheduled_time}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Stats Summary - Desktop */}
        {medications.length > 0 && (
          <div className="hidden lg:grid grid-cols-4 gap-4 mt-8">
            <div className="bg-card rounded-xl p-4 border border-border/50 text-center">
              <p className="text-3xl font-bold text-primary">{medications.length}</p>
              <p className="text-sm text-muted-foreground">Total Medications</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border/50 text-center">
              <p className="text-3xl font-bold text-success">
                {medications.reduce((acc, m) => acc + m.doses.filter(d => d.status === 'taken').length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Taken Today</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border/50 text-center">
              <p className="text-3xl font-bold text-warning">{lowStockMeds.length}</p>
              <p className="text-sm text-muted-foreground">Low Stock</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border/50 text-center">
              <p className="text-3xl font-bold">
                {medications.reduce((acc, m) => acc + m.doses.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Daily Doses</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile FAB */}
      <div className="fixed bottom-28 right-6 z-30 flex flex-col gap-2 lg:hidden">
        <Button
          size="icon-lg"
          variant="outline"
          className="shadow-elevated bg-card"
          onClick={() => navigate('/medications/select')}
        >
          <Library className="w-5 h-5" />
        </Button>
        <Button
          size="icon-lg"
          variant="gradient"
          className="shadow-elevated"
          onClick={() => navigate('/medications/add')}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

export default Medications;
