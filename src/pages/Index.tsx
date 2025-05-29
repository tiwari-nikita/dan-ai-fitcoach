
import { useState, useEffect } from 'react';
import { Dumbbell, LogOut } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import ProfileSetup from '@/components/ProfileSetup';
import GoalSetting from '@/components/GoalSetting';
import FoodLog from '@/components/FoodLog';
import WeightTracking from '@/components/WeightTracking';
import AICoach from '@/components/AICoach';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-4 rounded-full">
          <Dumbbell className="h-8 w-8 text-white" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <ProfileSetup />;
      case 'goals':
        return <GoalSetting />;
      case 'food':
        return <FoodLog />;
      case 'weight':
        return <WeightTracking />;
      case 'coach':
        return <AICoach />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Header />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg px-4 py-2 transition-colors duration-200">
                Settings
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700 text-white rounded-lg shadow-lg">
              <DropdownMenuItem onClick={handleSignOut} className="hover:bg-zinc-700 cursor-pointer px-4 py-2 flex items-center">
                <LogOut className="h-4 w-4 mr-2 text-zinc-400" />
                Sign Out
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-zinc-700 cursor-pointer px-4 py-2 flex items-center">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/notifications')} className="hover:bg-zinc-700 cursor-pointer px-4 py-2 flex items-center">
                Notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <Card className="mt-8 bg-zinc-900 border-zinc-700 rounded-xl shadow-lg">
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            <Button
              onClick={() => setActiveTab('coach')}
              className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-semibold py-6 rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center h-full text-lg"
            >
              <Dumbbell className="h-6 w-6 mr-3" />
              Chat with Coach
            </Button>
            <Button
              onClick={() => setActiveTab('food')}
              className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-semibold py-6 rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center h-full text-lg"
            >
              <Dumbbell className="h-6 w-6 mr-3" />
              Log Food
            </Button>
            <Button
              onClick={() => setActiveTab('weight')}
              className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-semibold py-6 rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center h-full text-lg"
            >
              <Dumbbell className="h-6 w-6 mr-3" />
              Track Weight
            </Button>
          </CardContent>
        </Card>

        <div className="mt-6">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
