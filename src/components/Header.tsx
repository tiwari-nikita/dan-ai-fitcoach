
import { Card } from '@/components/ui/card';
import { Dumbbell, Sun, Moon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeProvider';
import { supabase } from '@/integrations/supabase/client';

const Header = () => {
  return (
    <Card className="bg-white dark:bg-black text-black dark:text-white border-green-500 border-2 shadow-lg mb-6 rounded-lg transition-all duration-300 ease-in-out relative mx-auto">
      <div className="absolute top-4 right-4">
        <ModeToggle />
        <SignOutButton />
      </div>
      <div className="p-4 sm:p-8 flex flex-col items-center justify-center text-center min-h-[180px] sm:min-h-[220px] header-center">
        <div className="flex items-center justify-center mb-5">
          <Dumbbell className="h-14 w-14 mr-4 text-green-500 float-animation" />
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-black dark:text-white">Dan Go AI Coach</h1>
            <p className="text-base sm:text-lg md:text-xl mt-2 text-black dark:text-white">Your Personal AI Fitness Transformation Partner</p>
          </div>
        </div>
        <p className="text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed text-black dark:text-white">
          Transform your body and mind with personalized coaching, nutrition tracking, and AI-powered insights.
          Let's build the best version of yourself together.
        </p>
      </div>
    </Card>
  );
};

const ModeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-black dark:text-white">
      {theme === 'light' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      ) : (
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

const SignOutButton = () => {
  // No need to destructure supabase from useAuth, as it's imported directly

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleSignOut} className="ml-2 text-black dark:text-white">
      <LogOut className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Sign out</span>
    </Button>
  );
};

export default Header;
