import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dumbbell, Activity, Heart, Weight, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import ReactMarkdown from 'react-markdown';
import { useFoodEntries } from '@/hooks/useFoodEntries';
import { useAuth } from '@/contexts/AuthContext';

const googleAI = createGoogleGenerativeAI({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
});

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: Date;
  imageUrls?: string[]; // Optional: for displaying multiple images in chat
}

interface SelectedImage {
  file: File;
  previewUrl: string; // Data URL for immediate preview
}

const AICoach = () => {
  const { toast } = useToast();
  const { addFoodEntry } = useFoodEntries();
  const { user } = useAuth();
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
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]); // New state for selected images
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!currentMessage.trim() && selectedImages.length === 0) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: currentMessage,
      timestamp: new Date(),
      imageUrls: selectedImages.map(img => img.previewUrl),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    setCurrentMessage('');
    setIsLoading(true);
    setHasUserSentMessage(true);

    try {
      const systemPrompt: { role: 'system'; content: string } = { role: 'system', content: 'You are Dan Go AI, a helpful and motivating fitness coach. Provide advice on fitness, nutrition, and mindset. Keep your responses concise and actionable.' };
      
      const formattedMessages = await Promise.all(updatedMessages.map(async (msg) => {
        if (msg.type === 'user' && msg.imageUrls && msg.imageUrls.length > 0) {
          const imageParts = await Promise.all(msg.imageUrls.map(async (url) => {
            const response = await fetch(url);
            const blob = await response.blob();
            const base64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
            return {
              type: 'image',
              image: base64,
              mimeType: blob.type,
            };
          }));
          return {
            role: 'user',
            content: [
              { type: 'text', text: msg.message },
              ...imageParts,
            ],
          };
        }
        return {
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.message,
        };
      }));

      const { text, toolCalls } = await generateText({
        model: googleAI('gemini-2.0-flash-001'),
        messages: formattedMessages as any,
        tools: {
          add_food_entry: {
            description: "Adds a new food entry to the daily food log.",
            parameters: {
              type: 'object',
              properties: {
                food_item: { type: 'string', description: 'The name of the food item.' },
                calories: { type: 'number', description: 'The calorie count for the food item.' },
                protein: { type: 'number', description: 'The protein amount in grams.' },
                carbs: { type: 'number', description: 'The carbohydrate amount in grams.' },
                fat: { type: 'number', description: 'The fat amount in grams.' },
              },
              required: ['food_item', 'calories', 'protein', 'carbs', 'fat'],
            },
          },
        },
      });

      let toolResults: any[] = [];
      if (toolCalls && toolCalls.length > 0) {
        for (const toolCall of toolCalls) {
          if (toolCall.toolName === 'add_food_entry') {
            try {
              if (!user?.id) {
                throw new Error("User not authenticated. Cannot add food entry.");
              }
              const { food_item, calories, protein, carbs, fat } = toolCall.args;
              await addFoodEntry({ userId: user.id, food_item, calories, protein, carbs, fat });
              toast({
                title: "Food Entry Added",
                description: `Successfully added ${food_item} to your log.`,
              });
              toolResults.push({
                toolCallId: toolCall.toolCallId,
                result: { success: true, message: `Food entry for ${food_item} added.` },
              });
            } catch (toolError: any) {
              console.error('Error adding food entry:', toolError);
              toast({
                title: "Failed to Add Food Entry",
                description: toolError.message || "An unexpected error occurred while adding the food entry.",
                variant: "destructive",
              });
              toolResults.push({
                toolCallId: toolCall.toolCallId,
                result: { success: false, error: toolError.message || "Failed to add food entry." },
              });
            }
          }
        }
        // Re-generate text with tool results
        const { text: toolResponseText } = await generateText({
          model: googleAI('gemini-2.0-flash-001'),
          messages: [...formattedMessages, { role: 'tool', tool_call_id: toolResults[0].toolCallId, result: toolResults[0].result }] as any,
        });
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          message: toolResponseText || "I'm sorry, I couldn't generate a response after the tool execution.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          message: text || "I'm sorry, I couldn't generate a response.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }
      setSelectedImages([]); // Clear selected images after processing
    } catch (error) {
      console.error('Error communicating with Google AI:', error);
      toast({
        title: "AI Response Failed",
        description: "Could not connect to the AI or process the request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, GIF).",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImages(prev => [
        ...prev,
        {
          file: file,
          previewUrl: reader.result as string,
        }
      ]);
      toast({
        title: "Image Selected",
        description: `File: ${file.name}`,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        processImageFile(files[i]);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    let imagePasted = false;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          processImageFile(file);
          imagePasted = true;
        }
      }
    }
    if (imagePasted) {
      e.preventDefault(); // Prevent pasting the image data as text if an image was handled
    }
  };

  const removeSelectedImage = (indexToRemove: number) => {
    setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
    toast({
      title: "Image Removed",
      description: "The selected image has been cleared.",
    });
  };

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
                        {msg.type === 'ai' ? (
                          <ReactMarkdown components={{
                            p: ({ node, ...props }) => <p className="text-sm leading-relaxed break-words" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc list-inside text-sm leading-relaxed break-words" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-sm leading-relaxed break-words" {...props} />,
                            li: ({ node, ...props }) => <li className="text-sm leading-relaxed break-words" {...props} />,
                            a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                            em: ({ node, ...props }) => <em className="italic" {...props} />,
                            code: ({ node, ...props }) => <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 text-xs" {...props} />,
                            pre: ({ node, ...props }) => <pre className="bg-gray-100 dark:bg-gray-800 rounded p-2 overflow-x-auto text-xs" {...props} />,
                            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-3 mb-1.5" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-2.5 mb-1" {...props} />,
                            h4: ({ node, ...props }) => <h4 className="text-base font-bold mt-2 mb-0.5" {...props} />,
                            h5: ({ node, ...props }) => <h5 className="text-sm font-bold mt-1.5 mb-0.5" {...props} />,
                            h6: ({ node, ...props }) => <h6 className="text-xs font-bold mt-1 mb-0.5" {...props} />,
                          }}>
                            {msg.message}
                          </ReactMarkdown>
                        ) : (
                          <p className="text-sm leading-relaxed break-words">{msg.message}</p>
                        )}
                        {msg.imageUrls && msg.imageUrls.map((url, imgIndex) => (
                          <img key={imgIndex} src={url} alt={`User uploaded ${imgIndex + 1}`} className="mt-2 max-w-full h-auto rounded-md" />
                        ))}
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
              {selectedImages.length > 0 && (
                <div className="mb-2 p-2 border rounded-md bg-muted flex flex-wrap gap-2">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative flex items-center p-1 border rounded-md bg-background">
                      <img src={image.previewUrl} alt={`Preview ${index}`} className="max-h-16 rounded-md" />
                      <span className="ml-2 text-xs text-muted-foreground truncate max-w-[100px]">{image.file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSelectedImage(index)}
                        className="absolute -top-2 -right-2 p-0.5 h-5 w-5 rounded-full bg-red-500 text-white hover:bg-red-600 flex items-center justify-center"
                      >
                        X
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex space-x-2 items-end">
                <Textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onPaste={handlePaste}
                  placeholder="Ask Dan Go AI anything about fitness, nutrition, or motivation..."
                  className="bg-input placeholder:text-muted-foreground text-foreground min-h-[40px] pr-10 resize-none"
                  disabled={isLoading}
                  rows={1}
                />
                <Button
                  asChild
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Image className="h-5 w-5" />
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </Button>
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || (!currentMessage.trim() && selectedImages.length === 0)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-10"
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
