
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Weight, Calendar, Activity, Plus, Dumbbell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  bodyFat?: number;
  muscleMass?: number;
  notes?: string;
}

const WeightTracking = () => {
  const { toast } = useToast();
  const [newEntry, setNewEntry] = useState({
    weight: '',
    bodyFat: '',
    muscleMass: '',
    notes: ''
  });

  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([
    { id: '1', weight: 180, date: '2024-05-01', bodyFat: 15, muscleMass: 70, notes: 'Starting weight' },
    { id: '2', weight: 178, date: '2024-05-08', bodyFat: 14.5, muscleMass: 70.5, notes: 'Good progress' },
    { id: '3', weight: 176, date: '2024-05-15', bodyFat: 14, muscleMass: 71, notes: 'Feeling stronger' },
    { id: '4', weight: 175, date: '2024-05-22', bodyFat: 13.5, muscleMass: 71.5, notes: 'On track' },
    { id: '5', weight: 174, date: '2024-05-28', bodyFat: 13, muscleMass: 72, notes: 'Great results!' }
  ]);

  const addWeightEntry = () => {
    if (!newEntry.weight) {
      toast({
        title: "Missing Weight",
        description: "Please enter your current weight.",
        variant: "destructive"
      });
      return;
    }

    const entry: WeightEntry = {
      id: Date.now().toString(),
      weight: parseFloat(newEntry.weight),
      date: new Date().toISOString().split('T')[0],
      bodyFat: newEntry.bodyFat ? parseFloat(newEntry.bodyFat) : undefined,
      muscleMass: newEntry.muscleMass ? parseFloat(newEntry.muscleMass) : undefined,
      notes: newEntry.notes || undefined
    };

    setWeightHistory([...weightHistory, entry]);
    setNewEntry({
      weight: '',
      bodyFat: '',
      muscleMass: '',
      notes: ''
    });

    toast({
      title: "Weight Logged",
      description: "Your weight entry has been recorded successfully!",
    });
  };

  const chartData = weightHistory.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: entry.weight,
    bodyFat: entry.bodyFat,
    muscleMass: entry.muscleMass
  }));

  const currentWeight = weightHistory[weightHistory.length - 1]?.weight || 0;
  const startWeight = weightHistory[0]?.weight || 0;
  const weightChange = currentWeight - startWeight;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="fitness-gradient text-white border-0 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-2xl">
            <Weight className="h-6 w-6 mr-2" />
            Weight Tracking
          </CardTitle>
          <p className="text-white/90">Monitor your progress and body composition changes</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="fitness-card-gradient border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-fitness-primary" />
                Weight Progress Chart
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="hsl(var(--fitness-primary))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--fitness-primary))", strokeWidth: 2, r: 4 }}
                      name="Weight (lbs)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="bodyFat" 
                      stroke="hsl(var(--fitness-secondary))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--fitness-secondary))", strokeWidth: 2, r: 3 }}
                      name="Body Fat %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="fitness-card-gradient border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-fitness-secondary" />
                Weight History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {weightHistory.slice().reverse().slice(0, 5).map((entry) => (
                <div key={entry.id} className="p-4 bg-white/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{entry.weight} lbs</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      {entry.bodyFat && (
                        <Badge variant="outline" className="mb-1">
                          {entry.bodyFat}% BF
                        </Badge>
                      )}
                      {entry.muscleMass && (
                        <Badge variant="secondary">
                          {entry.muscleMass}lbs muscle
                        </Badge>
                      )}
                    </div>
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-muted-foreground italic">"{entry.notes}"</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="fitness-card-gradient border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2 text-fitness-primary" />
                Log New Weight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={newEntry.weight}
                  onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})}
                  placeholder="175.0"
                  className="bg-white/70"
                />
              </div>
              <div>
                <Label htmlFor="bodyFat">Body Fat % (optional)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  value={newEntry.bodyFat}
                  onChange={(e) => setNewEntry({...newEntry, bodyFat: e.target.value})}
                  placeholder="13.5"
                  className="bg-white/70"
                />
              </div>
              <div>
                <Label htmlFor="muscleMass">Muscle Mass (lbs, optional)</Label>
                <Input
                  id="muscleMass"
                  type="number"
                  step="0.1"
                  value={newEntry.muscleMass}
                  onChange={(e) => setNewEntry({...newEntry, muscleMass: e.target.value})}
                  placeholder="70.0"
                  className="bg-white/70"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Input
                  id="notes"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                  placeholder="How are you feeling today?"
                  className="bg-white/70"
                />
              </div>
              <Button 
                onClick={addWeightEntry}
                className="w-full fitness-gradient text-white"
              >
                Log Weight
              </Button>
            </CardContent>
          </Card>

          <Card className="fitness-card-gradient border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dumbbell className="h-5 w-5 mr-2 text-fitness-secondary" />
                Progress Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <div className="text-3xl font-bold text-fitness-primary">
                  {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} lbs
                </div>
                <p className="text-sm text-muted-foreground">Total Change</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-white/50 rounded-lg">
                  <div className="text-xl font-bold">{startWeight}</div>
                  <p className="text-xs text-muted-foreground">Starting</p>
                </div>
                <div className="text-center p-3 bg-white/50 rounded-lg">
                  <div className="text-xl font-bold">{currentWeight}</div>
                  <p className="text-xs text-muted-foreground">Current</p>
                </div>
              </div>
              <div className="p-3 bg-fitness-primary/10 rounded-lg">
                <Badge variant="secondary" className="mb-2">AI Insight</Badge>
                <p className="text-sm">
                  {weightChange < 0 
                    ? "Excellent progress! Your consistent effort is paying off."
                    : weightChange > 0
                    ? "You're building muscle mass! Consider tracking body fat % for better insights."
                    : "Maintaining your weight while building muscle. Great body recomposition!"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WeightTracking;
