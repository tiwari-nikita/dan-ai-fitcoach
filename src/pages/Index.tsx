
import { useState, useEffect } from 'react';
import { Dumbbell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
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
        <div className="flex justify-between items-center mb-6">
          <div>
            <Header />
          </div>
          <Button 
            onClick={handleSignOut}
            variant="outline" 
            className="flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
        
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-6">
          {renderActiveComponent()}
        </div>

        {activeTab !== 'coach' && (
          <div className="fixed bottom-6 right-6 z-50">
            <button
              onClick={() => setActiveTab('coach')}
              className="fitness-gradient text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all pulse-glow float-animation"
              title="Chat with Dan Go AI"
            >
              <Dumbbell className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
