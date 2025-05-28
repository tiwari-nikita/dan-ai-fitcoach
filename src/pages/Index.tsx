
import { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import ProfileSetup from '@/components/ProfileSetup';
import GoalSetting from '@/components/GoalSetting';
import FoodLog from '@/components/FoodLog';
import WeightTracking from '@/components/WeightTracking';
import AICoach from '@/components/AICoach';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

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
        <Header />
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-6">
          {renderActiveComponent()}
        </div>

        {/* Floating AI Coach Button */}
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
