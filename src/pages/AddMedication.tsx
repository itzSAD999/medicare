import { useState } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useSupabaseMedications } from '@/hooks/useSupabaseMedications';
import { MedicationFrequency, MedicationIconName } from '@/types/medication';
import { cn } from '@/lib/utils';
import { medicationIcons, medicationIconList, medicationColors } from '@/components/medications/MedicationIcons';

const frequencyOptions: { value: MedicationFrequency; label: string; description: string }[] = [
  { value: 'once', label: 'Once daily', description: '1 dose per day' },
  { value: 'twice', label: 'Twice daily', description: '2 doses per day' },
  { value: 'three-times', label: '3 times daily', description: 'Morning, afternoon, evening' },
  { value: 'four-times', label: '4 times daily', description: 'Every 6 hours' },
  { value: 'as-needed', label: 'As needed', description: 'When required' },
];

const AddMedication = () => {
  const navigate = useNavigate();
  const { addMedication } = useSupabaseMedications();
  
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState<MedicationFrequency>('once');
  const [instructions, setInstructions] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<MedicationIconName>('pill');
  const [selectedColor, setSelectedColor] = useState('#0D9488');
  const [stock, setStock] = useState('30');
  const [times, setTimes] = useState(['08:00']);
  const [refillReminder, setRefillReminder] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAddTime = () => {
    setTimes([...times, '12:00']);
  };

  const handleRemoveTime = (index: number) => {
    setTimes(times.filter((_, i) => i !== index));
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await addMedication({
      name,
      dosage,
      frequency,
      instructions: instructions || undefined,
      iconName: selectedIcon,
      color: selectedColor,
      stock: parseInt(stock) || 30,
      refillReminder,
      times,
    });

    setLoading(false);
    
    if (!error) {
      navigate('/medications');
    }
  };

  const isValid = name.trim() && dosage.trim() && times.length > 0;

  const SelectedIconComponent = medicationIcons[selectedIcon];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border/50 px-4 lg:px-6 pt-12 pb-4 lg:pt-8 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Add Medication</h1>
            <p className="text-sm text-muted-foreground hidden lg:block">
              Set up a new medication and schedule
            </p>
          </div>
          <Button
            variant="gradient"
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="hidden lg:flex"
          >
            {loading ? 'Adding...' : 'Add Medication'}
          </Button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="px-4 lg:px-6 py-6">
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-6 lg:space-y-0">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Icon & Color */}
            <div className="bg-card rounded-2xl p-4 lg:p-6 border border-border/50 animate-fade-in-up">
              <Label className="text-sm font-medium mb-3 block">Choose Icon & Color</Label>
              
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${selectedColor}20` }}
                >
                  <SelectedIconComponent className="w-8 h-8" style={{ color: selectedColor }} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{name || 'Your Medication'}</p>
                  <p className="text-sm text-muted-foreground">
                    {dosage || 'Dosage'} • {frequencyOptions.find(f => f.value === frequency)?.label}
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-2">Icon</p>
              <div className="flex gap-2 flex-wrap mb-4">
                {medicationIconList.map((iconItem) => {
                  const IconComponent = medicationIcons[iconItem.name];
                  return (
                    <button
                      key={iconItem.name}
                      type="button"
                      onClick={() => setSelectedIcon(iconItem.name)}
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center transition-all',
                        selectedIcon === iconItem.name
                          ? 'bg-primary/10 ring-2 ring-primary'
                          : 'bg-secondary hover:bg-secondary/80'
                      )}
                      title={iconItem.label}
                    >
                      <IconComponent className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-muted-foreground mb-2">Color</p>
              <div className="flex gap-2 flex-wrap">
                {medicationColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      'w-8 h-8 rounded-full transition-all',
                      selectedColor === color && 'ring-2 ring-offset-2 ring-foreground'
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div className="bg-card rounded-2xl p-4 lg:p-6 border border-border/50 space-y-4 animate-fade-in-up stagger-1">
              <h3 className="font-semibold">Basic Information</h3>
              <div>
                <Label htmlFor="name">Medication Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Metformin"
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dosage">Dosage *</Label>
                  <Input
                    id="dosage"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g., 500mg"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Current Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="30"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="font-medium text-sm">Refill Reminder</p>
                  <p className="text-xs text-muted-foreground">Get notified when stock is low</p>
                </div>
                <Switch checked={refillReminder} onCheckedChange={setRefillReminder} />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Frequency */}
            <div className="bg-card rounded-2xl p-4 lg:p-6 border border-border/50 animate-fade-in-up stagger-2">
              <Label className="text-sm font-medium mb-3 block">Frequency *</Label>
              <div className="space-y-2">
                {frequencyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFrequency(option.value)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all',
                      frequency === option.value
                        ? 'bg-primary/10 ring-2 ring-primary'
                        : 'bg-secondary hover:bg-secondary/80'
                    )}
                  >
                    <div className={cn(
                      'w-4 h-4 rounded-full border-2',
                      frequency === option.value 
                        ? 'border-primary bg-primary' 
                        : 'border-muted-foreground'
                    )}>
                      {frequency === option.value && (
                        <div className="w-full h-full rounded-full bg-primary-foreground scale-50" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Times */}
            <div className="bg-card rounded-2xl p-4 lg:p-6 border border-border/50 animate-fade-in-up stagger-3">
              <Label className="text-sm font-medium mb-3 block">Reminder Times *</Label>
              <div className="space-y-3">
                {times.map((time, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => handleTimeChange(index, e.target.value)}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-20">
                      Dose {index + 1}
                    </span>
                    {times.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveTime(index)}
                        className="text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTime}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Time
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-card rounded-2xl p-4 lg:p-6 border border-border/50 animate-fade-in-up stagger-4">
              <Label htmlFor="instructions">Special Instructions (Optional)</Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g., Take with meals, avoid grapefruit juice"
                className="mt-1.5 min-h-[100px]"
              />
            </div>
          </div>
        </div>

        {/* Mobile: Submit Button */}
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full mt-6 lg:hidden"
          disabled={!isValid || loading}
        >
          {loading ? 'Adding...' : 'Add Medication'}
        </Button>
      </form>
    </div>
  );
};

export default AddMedication;
