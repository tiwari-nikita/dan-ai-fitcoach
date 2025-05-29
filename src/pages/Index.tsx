
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
      <div className="min-h-screen bg-gradient-to-br from-fitness-light via-white to-fitness-light flex items-center justify-center">
        <div className="fitness-gradient p-4 rounded-full animate-pulse">
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
    <div className="min-h-screen bg-gradient-to-br from-fitness-light via-white to-fitness-light">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-start mb-6">
          <Header />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                Settings
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
              {/* Add other placeholder options here if needed */}
              <DropdownMenuItem onClick={() => window.open('/profile', '_blank', 'noopener,noreferrer')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open('/notifications', '_blank', 'noopener,noreferrer')}>
                Notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <Card className="mt-6">
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            <Button
              onClick={() => setActiveTab('coach')}
              className="fitness-gradient text-white py-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center h-full"
            >
              <Dumbbell className="h-5 w-5 mr-2" />
              Chat with Coach
            </Button>
            <Button
              onClick={() => setActiveTab('food')}
              className="fitness-gradient text-white py-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center h-full"
            >
              <Dumbbell className="h-5 w-5 mr-2" />
              Log Food
            </Button>
            <Button
              onClick={() => setActiveTab('weight')}
              className="fitness-gradient text-white py-6 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center h-full"
            >
              <Dumbbell className="h-5 w-5 mr-2" />
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
