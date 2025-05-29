
import { Card } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';

const Header = () => {
  return (
    <Card className="bg-card text-card-foreground border-border shadow-lg mb-6 rounded-lg transition-all duration-300 ease-in-out">
      <div className="p-4 sm:p-8 flex flex-col items-center justify-center text-center min-h-[180px] sm:min-h-[220px]">
        <div className="flex items-center justify-center mb-5">
          <Dumbbell className="h-14 w-14 mr-4 text-foreground float-animation" />
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">Dan Go AI Coach</h1>
            <p className="text-base sm:text-lg md:text-xl mt-2">Your Personal AI Fitness Transformation Partner</p>
          </div>
        </div>
        <p className="text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
          Transform your body and mind with personalized coaching, nutrition tracking, and AI-powered insights.
          Let's build the best version of yourself together.
        </p>
      </div>
    </Card>
  );
};

export default Header;
