import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb } from 'lucide-react';

const MoodLogger = () => {
  const [moodDescription, setMoodDescription] = useState('');
  const [aiInsight, setAiInsight] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogMood = async () => {
    if (!moodDescription.trim()) return;

    setIsLoading(true);
    setAiInsight(''); // Clear previous insights

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    let insight = '';
    const lowerCaseMood = moodDescription.toLowerCase();

    if (lowerCaseMood.includes('stressed') || lowerCaseMood.includes('anxious')) {
      insight = "It sounds like you're feeling stressed. Remember to take breaks and practice mindfulness. Would you like to discuss stress management techniques?";
    } else if (lowerCaseMood.includes('happy') || lowerCaseMood.includes('joyful') || lowerCaseMood.includes('energized')) {
      insight = "That's wonderful to hear! Keep that positive energy going. What contributed to your good mood today?";
    } else if (lowerCaseMood.includes('tired') || lowerCaseMood.includes('fatigued')) {
      insight = "Feeling tired? Ensure you're getting enough quality sleep and consider a light activity to boost energy. Would you like tips for better sleep?";
    } else if (lowerCaseMood.includes('sad') || lowerCaseMood.includes('down')) {
      insight = "It sounds like you're feeling a bit down. Remember that it's okay to feel this way. Perhaps a short walk or listening to uplifting music could help. Would you like to explore ways to boost your mood?";
    } else {
      insight = "Thank you for sharing your mood. I'm here to support you. How can I help you further with your fitness and well-being?";
    }

    setAiInsight(insight);
    setMoodDescription('');
    setIsLoading(false);
  };

  return (
    <Card className="bg-card text-card-foreground border-border shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-sm text-white">
          <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
          Mood Logger & AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="How are you feeling today? (e.g., 'Feeling happy', 'A bit stressed', 'Energized')"
          value={moodDescription}
          onChange={(e) => setMoodDescription(e.target.value)}
          disabled={isLoading}
          className="bg-input placeholder:text-muted-foreground text-white min-h-[80px]"
        />
        <Button
          onClick={handleLogMood}
          disabled={isLoading || !moodDescription.trim()}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? 'Logging Mood...' : 'Log Mood'}
        </Button>
        {aiInsight && (
          <div className="mt-4 p-4 bg-muted rounded-lg border border-border text-white">
            <p className="font-semibold mb-2">AI Insight:</p>
            <p>{aiInsight}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodLogger;