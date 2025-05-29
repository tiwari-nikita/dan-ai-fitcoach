
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dumbbell, Heart, Calendar, Activity, Weight } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'profile', label: 'Profile', icon: Heart },
    { id: 'goals', label: 'Goals', icon: Dumbbell },
    { id: 'food', label: 'Food Log', icon: Calendar },
    { id: 'weight', label: 'Weight', icon: Weight },
  ];

  return (
    <Card className="bg-card border-border shadow-xl rounded-xl transition-all duration-300 ease-in-out">
      <div className="flex justify-center p-2 sm:p-4">
        <div className="flex space-x-1 sm:space-x-2 bg-muted rounded-full p-1 sm:p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(item.id)}
                className={`rounded-full px-3 py-1 sm:px-4 sm:py-2 transition-all duration-300 ease-in-out ${
                  activeTab === item.id
                    ? 'bg-primary text-primary-foreground shadow-lg hover:bg-primary/90'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default Navigation;
