
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Weight, Activity, Plus, Dumbbell, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWeightEntries } from '@/hooks/useWeightEntries';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatDateWithTime } from '@/lib/utils';

const WeightTracking = () => {
  const { toast } = useToast();
  const { weightEntries, loading, addWeightEntry, updateWeightEntry, deleteWeightEntry } = useWeightEntries();
  const [newEntry, setNewEntry] = useState({
    weight: '',
    notes: ''
  });
  const [muscleMass, setMuscleMass] = useState<string>('');
  const [bodyFat, setBodyFat] = useState<string>('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentEditingEntry, setCurrentEditingEntry] = useState<any | null>(null);
  const [editedWeight, setEditedWeight] = useState('');
  const [editedNotes, setEditedNotes] = useState('');

  const handleAddWeightEntry = async () => {
    if (!newEntry.weight) {
      toast({
        title: "Missing Weight",
        description: "Please enter your current weight.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addWeightEntry({
        weight_kg: parseFloat(newEntry.weight),
        entry_date: new Date().toISOString().split('T')[0],
        notes: newEntry.notes || null,
        muscle_mass: muscleMass ? parseFloat(muscleMass) : 0,
        body_fat: bodyFat ? parseFloat(bodyFat) : 0
      });

      setNewEntry({
        weight: '',
        notes: ''
      });
      setMuscleMass('');
      setBodyFat('');
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleSaveProgress = async () => {
    if (weightEntries.length === 0) {
      toast({
        title: "No Weight Entry",
        description: "Please log a weight entry before saving progress.",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateWeightEntry(weightEntries[0].id, {
        muscle_mass: muscleMass ? parseFloat(muscleMass) : 0,
        body_fat: bodyFat ? parseFloat(bodyFat) : 0
      });
      toast({
        title: "Progress Saved",
        description: "Your body composition data has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error Saving Progress",
        description: "Failed to update body composition data. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditClick = (entry: any) => {
    setCurrentEditingEntry(entry);
    setEditedWeight(entry.weight.toString());
    setEditedNotes(entry.notes || '');
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!currentEditingEntry) return;

    if (!editedWeight) {
      toast({
        title: "Missing Weight",
        description: "Please enter the updated weight.",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateWeightEntry(currentEditingEntry.id, {
        weight: parseFloat(editedWeight),
        notes: editedNotes || null,
      });
      setIsEditDialogOpen(false);
      setCurrentEditingEntry(null);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await deleteWeightEntry(id);
    } catch (error) {
      // Error handled in hook
    }
  };


  useEffect(() => {
    if (weightEntries.length > 0) {
      setMuscleMass(weightEntries[0].muscle_mass?.toString() || '');
      setBodyFat(weightEntries[0].body_fat?.toString() || '');
    }
  }, [weightEntries]);

  const chartData = [...weightEntries].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map(entry => ({
    date: formatDateWithTime(entry.created_at),
    weight: entry.weight
  }));

  const currentWeight = weightEntries[0]?.weight || 0;
  const startWeight = weightEntries[weightEntries.length - 1]?.weight || 0;
  const weightChange = currentWeight - startWeight;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center text-white">Loading your weight tracking...</div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-6">
      <Card className="bg-white dark:bg-black text-white border-green-500 border-2 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-3xl text-black dark:text-white">
            <Weight className="h-8 w-8 mr-3 mt-1 text-green-500" />
            Weight Tracking
          </CardTitle>
          <p className="text-gray-700 dark:text-gray-300 text-lg">Monitor your progress and body composition changes</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
          <Card className="bg-white border-gray-300 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-black">
                <Activity className="h-6 w-6 mr-2 text-green-500" />
                Weight Progress Chart
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
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
                          borderRadius: '8px',
                          color: 'black'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                        name="Weight (lbs)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-600">
                  No weight data available. Start by logging your first weight entry!
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-300 shadow-lg flex-grow">
            <CardHeader>
              <CardTitle className="flex items-center text-black">
                Weight History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 flex flex-col flex-grow">
              {weightEntries.length === 0 ? (
                <p className="text-center text-gray-600 py-8">
                  No weight entries yet. Start tracking your progress!
                </p>
              ) : (
                <ScrollArea className="h-[400px]">
                  {weightEntries.map((entry) => (
                    <div key={entry.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-lg text-black">{entry.weight} lbs</h4>
                          <p className="text-sm text-gray-600">
                            {formatDateWithTime(entry.created_at)}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-green-500" onClick={() => handleEditClick(entry)}>
                            <Pencil className="h-5 w-5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-500">
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white text-black">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your weight entry.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="text-black dark:text-gray-50 border-gray-300">Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDeleteClick(entry.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-gray-600 italic">"{entry.notes}"</p>
                      )}
                    </div>
                  ))}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 flex flex-col h-full">
          <Card className="bg-white border-gray-300 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-black">
                <Plus className="h-6 w-6 mr-2 text-green-500" />
                Log New Weight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="weight" className="text-black font-semibold">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={newEntry.weight}
                  onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})}
                  placeholder="175.0"
                  className="bg-white border-gray-300 text-black"
                />
              </div>
              <div>
                <Label htmlFor="notes" className="text-black font-semibold">Notes (optional)</Label>
                <Input
                  id="notes"
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
                  placeholder="How are you feeling today?"
                  className="bg-white border-gray-300 text-black"
                />
              </div>
              <Button 
                onClick={handleAddWeightEntry}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold"
              >
                Log Weight
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-300 shadow-lg flex-grow">
            <CardHeader>
              <CardTitle className="flex items-center text-black">
                <Dumbbell className="h-6 w-6 mr-2 text-green-500" />
                Progress Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {weightEntries.length > 0 ? (
                <>
                  <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-3xl font-bold text-green-500">
                      {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} lbs
                    </div>
                    <p className="text-sm text-gray-600">Total Change</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xl font-bold text-black">{startWeight}</div>
                      <p className="text-xs text-gray-600">Starting</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xl font-bold text-black">{currentWeight}</div>
                      <p className="text-xs text-gray-600">Current</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <Label htmlFor="muscle-mass" className="text-black font-semibold text-sm">Muscle Mass %</Label>
                      <Input
                        id="muscle-mass"
                        type="number"
                        step="0.1"
                        value={muscleMass}
                        onChange={(e) => setMuscleMass(e.target.value)}
                        placeholder="30.0"
                        className="bg-white border-gray-300 text-black text-center mt-1"
                      />
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <Label htmlFor="body-fat" className="text-black font-semibold text-sm">Body Fat %</Label>
                      <Input
                        id="body-fat"
                        type="number"
                        step="0.1"
                        value={bodyFat}
                        onChange={(e) => setBodyFat(e.target.value)}
                        placeholder="15.0"
                        className="bg-white border-gray-300 text-black text-center mt-1"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleSaveProgress}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold mt-4"
                  >
                    Save Progress
                  </Button>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Badge className="mb-2 bg-green-500 text-white">AI Insight</Badge>
                    <p className="text-sm text-black">
                      {weightChange < 0
                        ? "Excellent progress! Your consistent effort is paying off."
                        : weightChange > 0
                        ? "You're building muscle mass! Consider tracking body fat % for better insights."
                        : "Maintaining your weight while building muscle. Great body recomposition!"}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600">Start logging your weight to see progress insights!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
      {/* Edit Weight Entry Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-black">
          <DialogHeader>
            <DialogTitle>Edit Weight Entry</DialogTitle>
            <DialogDescription>
              Make changes to your weight entry here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editedWeight" className="text-right">
                Weight (lbs)
              </Label>
              <Input
                id="editedWeight"
                type="number"
                step="0.1"
                value={editedWeight}
                onChange={(e) => setEditedWeight(e.target.value)}
                className="col-span-3 bg-white text-black"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editedNotes" className="text-right">
                Notes
              </Label>
              <Input
                id="editedNotes"
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                className="col-span-3 bg-white text-black"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="text-black dark:text-gray-50 border-gray-300">Cancel</Button>
            <Button type="submit" onClick={handleSaveEdit} className="bg-green-500 hover:bg-green-600 text-white">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};


export default WeightTracking;
