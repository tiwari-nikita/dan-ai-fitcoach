
import { Card } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';

const Header = () => {
  return (
    <Card className="bg-card text-card-foreground border-border shadow-lg mb-6 rounded-lg">
      <div className="p-8 flex flex-col items-center justify-center text-center min-h-[220px]">
        <div className="flex items-center justify-center mb-5">
          <Dumbbell className="h-14 w-14 mr-4 text-foreground float-animation" />
          <div className="text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-foreground">Dan Go AI Coach</h1>
            <p className="text-muted-foreground text-xl mt-2">Your Personal AI Fitness Transformation Partner</p>
          </div>
        </div>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
          Transform your body and mind with personalized coaching, nutrition tracking, and AI-powered insights.
          Let's build the best version of yourself together.
        </p>
      </div>
    </Card>
  );
};

export default Header;
