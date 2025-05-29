import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dumbbell, Activity, Heart, Weight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
}

const AICoach = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      message: "Hey there! I'm Dan Go AI, your personal fitness coach. I'm here to help you transform your body and mindset. What's on your mind today?",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulated AI responses based on Dan Go's coaching style
  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('motivation') || message.includes('give up')) {
      return "Listen, I get it. The path isn't always easy, but that's exactly why most people quit and you WON'T. Every champion was once a beginner who refused to give up. Your future self is counting on the decisions you make TODAY. What's one small action you can take right now?";
    }
    
    if (message.includes('diet') || message.includes('nutrition') || message.includes('eat')) {
      return "Nutrition is 70% of your results. Here's the truth: you can't out-train a bad diet. Focus on whole foods, lean proteins, and proper portion control. Stop making it complicated - eat like an adult, not a child. What's your biggest nutrition challenge right now?";
    }
    
    if (message.includes('workout') || message.includes('exercise') || message.includes('training')) {
      return "Training should be challenging but smart. Progressive overload is king - you need to consistently push your body beyond its comfort zone. But remember, recovery is where the magic happens. Are you training with intensity AND allowing proper recovery?";
    }
    
    if (message.includes('weight loss') || message.includes('lose weight')) {
      return "Weight loss is simple: create a caloric deficit consistently over time. But here's what most people miss - it's not just about the scale. Focus on losing FAT, not just weight. Strength training + proper nutrition + consistency = body transformation. How's your consistency been lately?";
    }
    
    if (message.includes('muscle') || message.includes('gain')) {
      return "Building muscle requires three things: progressive resistance training, adequate protein (0.8-1g per lb of body weight), and patience. Your muscles grow during rest, not during workouts. Are you giving your body the building blocks it needs?";
    }
    
    // Default responses in Dan Go's style
    const defaultResponses = [
      "That's a great question! Remember, transformation isn't just physical - it's mental. Every small step you take is building the person you're becoming. What specific area would you like to focus on?",
      "I love that you're thinking about this! Success in fitness, like in life, comes down to consistency and making better choices daily. What's your biggest challenge right now?",
      "Here's the thing - there's no magic pill or shortcut. But there IS a proven path. Focus on the fundamentals: proper nutrition, consistent training, adequate sleep, and the right mindset. Which of these needs your attention most?",
      "You're asking the right questions! Remember, the goal isn't perfection - it's progress. Every day you show up, you're already winning. What's one thing you can improve today?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    setHasUserSentMessage(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: generateAIResponse(currentMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    "How do I stay motivated?",
    "What should I eat for muscle gain?",
    "Best workout for beginners?",
    "How to lose belly fat?",
    "I'm not seeing results, help!"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-card text-card-foreground border-border shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-2xl text-foreground">
            <Dumbbell className="h-6 w-6 mr-2 text-primary" />
            Chat with Dan Go AI Coach
          </CardTitle>
          <p className="text-muted-foreground">Get personalized fitness advice and motivation 24/7</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-card text-card-foreground border-border shadow-lg h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                Conversation
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden">
              <ScrollArea className="flex-1 pr-4 min-h-0">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-lg ${
                          msg.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words">{msg.message}</p>
                        <p className="text-xs mt-2 text-muted-foreground">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-muted text-muted-foreground p-4 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              {!hasUserSentMessage && (
                <div className="mb-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto p-3 text-xs break-words text-muted-foreground border-border"
                    onClick={() => {
                      setCurrentMessage("What's the best way to track my progress?");
                      sendMessage();
                    }}
                  >
                    What's the best way to track my progress?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto p-3 text-xs break-words text-muted-foreground border-border"
                    onClick={() => {
                      setCurrentMessage("Can you suggest a healthy meal plan for weight loss?");
                      sendMessage();
                    }}
                  >
                    Can you suggest a healthy meal plan for weight loss?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto p-3 text-xs break-words text-muted-foreground border-border"
                    onClick={() => {
                      setCurrentMessage("How do I overcome a plateau in my fitness journey?");
                      sendMessage();
                    }}
                  >
                    How do I overcome a plateau in my fitness journey?
                  </Button>
                </div>
              )}
              <div className="flex space-x-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Dan Go AI anything about fitness, nutrition, or motivation..."
                  className="bg-input placeholder:text-muted-foreground text-foreground"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !currentMessage.trim()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-card text-card-foreground border-border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-sm text-foreground">
                <Weight className="h-4 w-4 mr-2 text-secondary" />
                Dan Go's Philosophy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
              <div className="p-3 bg-muted rounded-lg">
                <Badge variant="secondary" className="mb-2 text-xs">Mindset</Badge>
                <p className="break-words">Success is 80% mindset, 20% strategy. Master your thoughts.</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <Badge variant="secondary" className="mb-2 text-xs text-secondary-foreground">Consistency</Badge>
                <p className="break-words">Small actions done consistently beat perfect plans done occasionally.</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <Badge variant="secondary" className="mb-2 text-xs">Transformation</Badge>
                <p className="break-words">You're not just changing your body, you're becoming a new person.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
