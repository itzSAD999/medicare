import { useState } from 'react';
import { ArrowLeft, Search, Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { medicationIcons, medicationIconList, medicationColors } from '@/components/medications/MedicationIcons';
import { MedicationIconName } from '@/types/medication';
import { useSupabaseMedications } from '@/hooks/useSupabaseMedications';
import { toast } from 'sonner';

// Common medications database
const commonMedications = [
  { name: 'Metformin', dosage: '500mg', category: 'Diabetes', iconName: 'pill' as MedicationIconName, color: '#0D9488' },
  { name: 'Lisinopril', dosage: '10mg', category: 'Blood Pressure', iconName: 'heart-pulse' as MedicationIconName, color: '#3B82F6' },
  { name: 'Atorvastatin', dosage: '40mg', category: 'Cholesterol', iconName: 'tablets' as MedicationIconName, color: '#EC4899' },
  { name: 'Omeprazole', dosage: '20mg', category: 'Acid Reflux', iconName: 'capsule' as MedicationIconName, color: '#8B5CF6' },
  { name: 'Amlodipine', dosage: '5mg', category: 'Blood Pressure', iconName: 'heart-pulse' as MedicationIconName, color: '#EF4444' },
  { name: 'Metoprolol', dosage: '50mg', category: 'Heart', iconName: 'heart-pulse' as MedicationIconName, color: '#F59E0B' },
  { name: 'Levothyroxine', dosage: '50mcg', category: 'Thyroid', iconName: 'activity' as MedicationIconName, color: '#10B981' },
  { name: 'Vitamin D3', dosage: '2000 IU', category: 'Supplement', iconName: 'droplets' as MedicationIconName, color: '#F59E0B' },
  { name: 'Aspirin', dosage: '81mg', category: 'Heart', iconName: 'pill' as MedicationIconName, color: '#EF4444' },
  { name: 'Ibuprofen', dosage: '400mg', category: 'Pain Relief', iconName: 'pill' as MedicationIconName, color: '#6366F1' },
  { name: 'Gabapentin', dosage: '300mg', category: 'Nerve Pain', iconName: 'brain' as MedicationIconName, color: '#8B5CF6' },
  { name: 'Prednisone', dosage: '10mg', category: 'Anti-inflammatory', iconName: 'tablets' as MedicationIconName, color: '#F59E0B' },
  { name: 'Losartan', dosage: '50mg', category: 'Blood Pressure', iconName: 'heart-pulse' as MedicationIconName, color: '#0D9488' },
  { name: 'Sertraline', dosage: '50mg', category: 'Mental Health', iconName: 'brain' as MedicationIconName, color: '#3B82F6' },
  { name: 'Fluoxetine', dosage: '20mg', category: 'Mental Health', iconName: 'brain' as MedicationIconName, color: '#06B6D4' },
  { name: 'Pantoprazole', dosage: '40mg', category: 'Acid Reflux', iconName: 'capsule' as MedicationIconName, color: '#8B5CF6' },
  { name: 'Insulin Glargine', dosage: '10 units', category: 'Diabetes', iconName: 'syringe' as MedicationIconName, color: '#0D9488' },
  { name: 'Albuterol', dosage: '90mcg', category: 'Respiratory', iconName: 'activity' as MedicationIconName, color: '#3B82F6' },
  { name: 'Calcium + D', dosage: '600mg', category: 'Supplement', iconName: 'bone' as MedicationIconName, color: '#84CC16' },
  { name: 'Fish Oil', dosage: '1000mg', category: 'Supplement', iconName: 'droplets' as MedicationIconName, color: '#F59E0B' },
];

const categories = [...new Set(commonMedications.map((m) => m.category))];

const SelectMedication = () => {
  const navigate = useNavigate();
  const { addMedication } = useSupabaseMedications();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMed, setSelectedMed] = useState<typeof commonMedications[0] | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredMedications = commonMedications.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectMedication = async (med: typeof commonMedications[0]) => {
    setSelectedMed(med);
  };

  const handleAddSelected = async () => {
    if (!selectedMed) return;
    
    setLoading(true);
    try {
      const { error } = await addMedication({
        name: selectedMed.name,
        dosage: selectedMed.dosage,
        frequency: 'once',
        iconName: selectedMed.iconName,
        color: selectedMed.color,
        stock: 30,
        refillReminder: true,
        times: ['08:00'],
      });

      if (!error) {
        navigate('/medications');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/50 px-4 lg:px-6 pt-12 pb-4 lg:pt-8 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Select Medication</h1>
            <p className="text-sm text-muted-foreground hidden lg:block">
              Choose from common medications
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/medications/add')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Custom
          </Button>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search medications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-0"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 -mx-4 px-4">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="flex-shrink-0"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="flex-shrink-0"
            >
              {category}
            </Button>
          ))}
        </div>
      </header>

      <div className="px-4 lg:px-6 py-6">
        {/* Medication Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredMedications.map((med, index) => {
            const MedIcon = medicationIcons[med.iconName];
            const isSelected = selectedMed?.name === med.name;
            
            return (
              <button
                key={med.name}
                onClick={() => handleSelectMedication(med)}
                className={cn(
                  'bg-card rounded-2xl p-4 border-2 transition-all duration-200 text-left',
                  'hover:shadow-medium animate-fade-in-up',
                  isSelected
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border/50 hover:border-primary/30'
                )}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${med.color}15` }}
                  >
                    <MedIcon className="w-6 h-6" style={{ color: med.color }} />
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold mt-3 text-sm">{med.name}</h3>
                <p className="text-xs text-muted-foreground">{med.dosage}</p>
                <span
                  className="inline-block text-xs px-2 py-0.5 rounded-full mt-2"
                  style={{ backgroundColor: `${med.color}15`, color: med.color }}
                >
                  {med.category}
                </span>
              </button>
            );
          })}
        </div>

        {filteredMedications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No medications found</p>
            <Button
              variant="link"
              onClick={() => navigate('/medications/add')}
              className="mt-2"
            >
              Add a custom medication
            </Button>
          </div>
        )}
      </div>

      {/* Fixed Bottom Action */}
      {selectedMed && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-lg border-t border-border/50 lg:left-64">
          <div className="max-w-5xl mx-auto flex items-center gap-4">
            <div className="flex-1">
              <p className="font-semibold">{selectedMed.name}</p>
              <p className="text-sm text-muted-foreground">{selectedMed.dosage}</p>
            </div>
            <Button
              variant="gradient"
              onClick={handleAddSelected}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Medication'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectMedication;
