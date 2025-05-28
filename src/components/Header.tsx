
import { Card } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';

const Header = () => {
  return (
    <Card className="fitness-gradient text-white border-0 shadow-xl mb-6">
      <div className="p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <Dumbbell className="h-12 w-12 mr-3 float-animation" />
          <div>
            <h1 className="text-4xl font-bold">Dan Go AI Coach</h1>
            <p className="text-white/90 text-lg">Your Personal AI Fitness Transformation Partner</p>
          </div>
        </div>
        <p className="text-white/80 max-w-2xl mx-auto">
          Transform your body and mind with personalized coaching, nutrition tracking, and AI-powered insights. 
          Let's build the best version of yourself together.
        </p>
      </div>
    </Card>
  );
};

export default Header;
