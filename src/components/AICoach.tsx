import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dumbbell, Activity, Heart, Weight, Image, Lightbulb, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { generateText } from 'ai';
import { z } from 'zod';
import ReactMarkdown from 'react-markdown';
import { useFoodEntries } from '@/hooks/useFoodEntries';
import { useWeightEntries } from '@/hooks/useWeightEntries';
import { useUserProfile } from '@/hooks/useUserProfile'; // Import useUserProfile
import { useAuth } from '@/contexts/AuthContext';
import MoodLogger from './MoodLogger';
import { callGeminiWithFailover } from '@/utils/apiFailover';

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
  const modelForToolCall = 'gemini-2.5-flash-preview-04-17';
  const modelForToolResults = 'gemini-2.5-flash-preview-04-17';

  const { toast } = useToast();
  const { addFoodEntry, getFoodEntries, deleteFoodEntry, modifyFoodEntry, foodEntries } = useFoodEntries();
  const { addWeightEntry, getWeightEntries, deleteWeightEntry, modifyWeightEntry } = useWeightEntries();
  const { setUserInfo, getUserInfo } = useUserProfile(); // Destructure setUserInfo and getUserInfo
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
      const systemPrompt: { role: 'system'; content: string } = { role: 'system', content: 'You are an AI modelled after Dan Go, a helpful and motivating fitness coach. You have to have conversation with the users exactly like Dan Go would, nothing fancy. Provide advice on fitness, nutrition, and mindset. You can process and suggest information/guidance beyond what your tools allow you to as long as it is somehow health and fitness related. You may provide the user with meal plans. Keep your responses concise and actionable.Tool call results will not be instantly visible to you, but will be visible to the user so do not say that you can not do something that is available via tool calls. Do not share or output any code with the user and when retrieving tool calls, ensure to add conversational text with it and say Done.' };
      
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
      console.log({systemPrompt,formattedMessages})
const modifyWeightEntryParams = z.object({
  original_entry_date: z.string().describe("The original date of the weight entry to be modified, in 'YYYY-MM-DD' format."),
  new_weight_kg: z.number().describe("The new weight in kilograms."),
  new_entry_date: z.string().optional().describe("The new date for the weight entry, in 'YYYY-MM-DD' format. If not provided, the original date will be used."),
});
      
      
      const { text, toolCalls } = await callGeminiWithFailover(
        modelForToolCall,
        {
          messages: formattedMessages as any,
          tools: {
            add_food_entry: {
              description: "Adds a new food entry to the daily food log.",
              parameters: z.object({
                food_description: z.string().describe('The name of the food item.'),
                calories: z.number().describe('The calorie count for the food item.'),
                protein_g: z.number().describe('The protein amount in grams.'),
                carbs_g: z.number().describe('The carbohydrate amount in grams.'),
                fats_g: z.number().describe('The fat amount in grams.'),
                meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).describe('The meal type (breakfast, lunch, dinner, snack).'),
              }),
            },
            get_food_entries: {
              description: "Retrieves a list of food entries for a given date.",
              parameters: z.object({}),
            },
            get_weight_entries: {
              description: "Retrieve previously recorded weight entries.",
              parameters: z.object({}),
            },
            delete_food_entry: {
              description: "Delete a previously recorded structured food nutrition entry by its description.",
              parameters: z.object({
                food_description: z.string().describe('The description of the food item to delete.'),
              }),
            },
            modify_food_entry: {
              description: "Modify an existing structured food nutrition entry. Provide the original food description to identify the entry, and new values for any fields that need to be updated.",
              parameters: z.object({
                original_food_description: z.string().describe('The original description of the food item to modify.'),
                new_food_description: z.string().optional().describe('The new name of the food item.'),
                calories: z.number().optional().describe('The new calorie count for the food item.'),
                protein_g: z.number().optional().describe('The new protein amount in grams.'),
                carbs_g: z.number().optional().describe('The new carbohydrate amount in grams.'),
                fats_g: z.number().optional().describe('The new fat amount in grams.'),
                meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']).optional().describe('The new meal type (breakfast, lunch, dinner, snack).'),
              }),
            },
            add_weight_entry: {
              description: "Add a new weight entry with the specified weight and date.",
              parameters: z.object({
                weight_kg: z.number().describe('The weight in kilograms.'),
                entry_date: z.string().describe('The date of the weight entry in YYYY-MM-DD format.'),
              }),
            },
            delete_weight_entry: {
              description: "Delete a previously recorded weight entry by its entry date.",
              parameters: z.object({
                entry_date: z.string().describe('The date of the weight entry to delete in YYYY-MM-DD format.'),
              }),
            },
            modify_weight_entry: {
              description: "Modifies an existing weight entry for a specific date. Requires the original entry date to identify the entry, and the new weight and new date for the update.",
              parameters: modifyWeightEntryParams,
            },
            set_user_info: {
              description: "Stores or updates generic user-specific information as key-value pairs in the user's profile. This can be used to store preferences, goals, or any other miscellaneous data.",
              parameters: z.object({
                key: z.string().describe('The key for the user information to store (e.g., "fitness_goal", "dietary_preference").'),
                value: z.any().describe('The value associated with the key. This can be any JSON-serializable data type (string, number, boolean, object, array).'),
              }),
            },
            get_user_info: {
              description: "Retrieves generic user-specific information from the user's profile. Can retrieve all stored information or a specific value by key.",
              parameters: z.object({
                key: z.string().optional().describe('The optional key for the specific user information to retrieve. If not provided, all user information will be returned.'),
              }),
            },
          },
        }
      );

      let toolResults: any[] = [];
      if (toolCalls && toolCalls.length > 0) {
        for (const toolCall of toolCalls) {
          switch (toolCall.toolName) { // Using toolName as function.name is not available
            case 'add_food_entry':
              try {
                if (!user?.id) {
                  throw new Error("User not authenticated. Cannot add food entry.");
                }
                const { food_description, calories, protein_g, carbs_g, fats_g, meal_type } = toolCall.args;
                const today = new Date().toISOString().split('T')[0];
                
                await addFoodEntry({
                  food_description,
                  calories: Math.round(calories),
                  protein_g: protein_g !== null ? Math.round(protein_g) : null,
                  carbs_g: carbs_g !== null ? Math.round(carbs_g) : null,
                  fats_g: fats_g !== null ? Math.round(fats_g) : null,
                  meal_type: meal_type || 'AI Logged',
                  date: today
                });
                
                toast({
                  title: "Food Entry Added",
                  description: `Successfully added ${food_description} to your log.`,
                });
                toolResults.push({
                  role: 'tool',
                  toolCallId: toolCall.toolCallId,
                  result: { success: true, message: `Food entry for ${food_description} added.` },
                });
              } catch (toolError: any) {
                console.error('Error adding food entry:', toolError);
                toast({
                  title: "Failed to Add Food Entry",
                  description: toolError.message || "An unexpected error occurred while adding the food entry.",
                  variant: "destructive",
                });
                toolResults.push({
                  role: 'tool',
                  toolCallId: toolCall.toolCallId,
                  result: { success: false, error: toolError.message || "Failed to add food entry." },
                });
              }
              break;
            case 'get_food_entries':
              try {
                await getFoodEntries(); // This fetches and updates the foodEntries state in the hook
                let formattedFoodEntries = "Your food entries for today:\n";
                if (foodEntries && foodEntries.length > 0) {
                  foodEntries.forEach((entry: any) => {
                    formattedFoodEntries += `- ${entry.meal_type}: ${entry.food_description} (${entry.calories} kcal, P:${entry.protein_g || 0}g, C:${entry.carbs_g || 0}g, F:${entry.fats_g || 0}g)\n`;
                  });
                } else {
                  formattedFoodEntries = "You have no food entries for today.";
                }

                setMessages(prev => [...prev, {
                  id: (Date.now() + 0.5).toString(),
                  type: 'ai',
                  message: formattedFoodEntries,
                  timestamp: new Date()
                }]);

                toolResults.push({
                  role: 'tool',
                  toolCallId: toolCall.toolCallId,
                  result: { success: true, message: formattedFoodEntries },
                });
              } catch (toolError: any) {
                console.error('Error getting food entries:', toolError);
                toast({
                  title: "Failed to Retrieve Food Entries",
                  description: toolError.message || "An unexpected error occurred while retrieving food entries.",
                  variant: "destructive",
                });
                toolResults.push({
                  role: 'tool',
                  toolCallId: toolCall.toolCallId,
                  result: { success: false, error: toolError.message || "Failed to retrieve food entries." },
                });
              }
              break;
            case 'delete_food_entry':
              try {
                const { food_description } = toolCall.args;
                const result = await deleteFoodEntry(food_description);
                if (result.success) {
                  setMessages(prev => [...prev, {
                    id: (Date.now() + 0.6).toString(),
                    type: 'ai',
                    message: `Successfully deleted food entry: ${food_description}.`,
                    timestamp: new Date()
                  }]);
                  toast({
                    title: "Food Entry Deleted",
                    description: `Successfully deleted ${food_description} from your log.`,
                  });
                } else {
                  setMessages(prev => [...prev, {
                    id: (Date.now() + 0.6).toString(),
                    type: 'ai',
                    message: `Failed to delete food entry: ${food_description}. Reason: ${result.error || "Unknown error."}`,
                    timestamp: new Date()
                  }]);
                  toast({
                    title: "Failed to Delete Food Entry",
                    description: result.error || "An unexpected error occurred while deleting the food entry.",
                    variant: "destructive",
                  });
                }
                toolResults.push({
                  role: 'tool',
                  toolCallId: toolCall.toolCallId,
                  result: result,
                });
              } catch (toolError: any) {
                console.error('Error deleting food entry:', toolError);
                setMessages(prev => [...prev, {
                  id: (Date.now() + 0.6).toString(),
                  type: 'ai',
                  message: `Failed to delete food entry. Reason: ${toolError.message || "An unexpected error occurred."}`,
                  timestamp: new Date()
                }]);
                toast({
                  title: "Failed to Delete Food Entry",
                  description: toolError.message || "An unexpected error occurred while deleting the food entry.",
                  variant: "destructive",
                });
                toolResults.push({
                  role: 'tool',
                  toolCallId: toolCall.toolCallId,
                  result: { success: false, error: toolError.message || "Failed to delete food entry." },
                });
              }
              break;
            case 'modify_food_entry':
              try {
                const { original_food_description, new_food_description, calories, protein_g, carbs_g, fats_g, meal_type } = toolCall.args;
                const result = await modifyFoodEntry({
                  original_food_description,
                  new_food_description,
                  calories: calories !== null ? Math.round(calories) : undefined,
                  protein_g: protein_g !== null ? Math.round(protein_g) : undefined,
                  carbs_g: carbs_g !== null ? Math.round(carbs_g) : undefined,
                  fats_g: fats_g !== null ? Math.round(fats_g) : undefined,
                  meal_type: meal_type || undefined,
                });
                if (result.success) {
                  setMessages(prev => [...prev, {
                    id: (Date.now() + 0.7).toString(),
                    type: 'ai',
                    message: `Successfully modified food entry: ${original_food_description}.`,
                    timestamp: new Date()
                  }]);
                  toast({
                    title: "Food Entry Modified",
                    description: `Successfully modified ${original_food_description} in your log.`,
                  });
                } else {
                  setMessages(prev => [...prev, {
                    id: (Date.now() + 0.7).toString(),
                    type: 'ai',
                    message: `Failed to modify food entry: ${original_food_description}. Reason: ${result.error || "Unknown error."}`,
                    timestamp: new Date()
                  }]);
                  toast({
                    title: "Failed to Modify Food Entry",
                    description: result.error || "An unexpected error occurred while modifying the food entry.",
                    variant: "destructive",
                  });
                }
                toolResults.push({
                  role: 'tool',
                  toolCallId: toolCall.toolCallId,
                  result: result,
                });
              } catch (toolError: any) {
                console.error('Error modifying food entry:', toolError);
                setMessages(prev => [...prev, {
                  id: (Date.now() + 0.7).toString(),
                  type: 'ai',
                  message: `Failed to modify food entry. Reason: ${toolError.message || "An unexpected error occurred."}`,
                  timestamp: new Date()
                }]);
                toast({
                  title: "Failed to Modify Food Entry",
                  description: toolError.message || "An unexpected error occurred while modifying the food entry.",
                  variant: "destructive",
                });
                toolResults.push({
                  role: 'tool',
                  toolCallId: toolCall.toolCallId,
                  result: { success: false, error: toolError.message || "Failed to modify food entry." },
                });
              }
              break;
            case 'add_weight_entry':
              try {
                const { weight_kg, entry_date } = toolCall.args;
                const result = await addWeightEntry({ weight_kg, entry_date });
                if (result.success) {
                  setMessages(prev => [...prev, {
                    id: (Date.now() + 0.8).toString(),
                    type: 'ai',
                    message: `Successfully added weight entry: ${weight_kg} kg on ${entry_date}.`,
                    timestamp: new Date()
                  }]);
                  toast({
                    title: "Weight Entry Added",
                    description: `Successfully added ${weight_kg} kg on ${entry_date} to your log.`,
                  });
                } else {
                  setMessages(prev => [...prev, {
                    id: (Date.now() + 0.8).toString(),
                    type: 'ai',
                    message: `Failed to add weight entry: ${weight_kg} kg on ${entry_date}. Reason: ${result.error || "Unknown error."}`,
                    timestamp: new Date()
                  }]);
                  toast({
                    title: "Failed to Add Weight Entry",
                    description: result.error || "An unexpected error occurred while adding the weight entry.",
                    variant: "destructive",
                  });
                }
                toolResults.push({
                  role: 'tool',
                  toolCallId: toolCall.toolCallId,
                  result: result,
                });
              } catch (toolError: any) {
                console.error('Error adding weight entry:', toolError);
                setMessages(prev => [...prev, {
                  id: (Date.now() + 0.8).toString(),
                  type: 'ai',
                  message: `Failed to add weight entry. Reason: ${toolError.message || "An unexpected error occurred."}`,
                  timestamp: new Date()
                }]);
                toast({
                  title: "Failed to Add Weight Entry",
                  description: toolError.message || "An unexpected error occurred while adding the weight entry.",
                  variant: "destructive",
                });
                toolResults.push({
                  role: 'tool',
                  toolCallId: toolCall.toolCallId,
                  result: { success: false, error: toolError.message || "Failed to add weight entry." },
                });
              }
              break;
            case 'get_weight_entries':
              try {
                const weightEntries = await getWeightEntries();
                let formattedWeightEntries = "Your weight entries:\n";
                if (weightEntries && weightEntries.length > 0) {
                  weightEntries.forEach((entry: any) => {
                    formattedWeightEntries += `- ${entry.weight} kg on ${entry.date}\n`;
                  });
                } else {
                  formattedWeightEntries = "You have no weight entries.";
                }

                setMessages(prev => [...prev, {
                  id: (Date.now() + 0.9).toString(),
                  type: 'ai',
                  message: formattedWeightEntries,
                  timestamp: new Date()
                }]);

                toolResults.push({
                  role: 'tool',
                  toolCallId: toolCall.toolCallId,
                  result: { success: true, message: formattedWeightEntries },
                });
              } catch (toolError: any) {
                console.error('Error getting weight entries:', toolError);
                toast({
                  title: "Failed to Retrieve Weight Entries",
                  description: toolError.message || "An unexpected error occurred while retrieving weight entries.",
                  variant: "destructive",
                });
                toolResults.push({
                  role: 'tool',
                  toolCallId: toolCall.toolCallId,
                  result: { success: false, error: toolError.message || "Failed to retrieve weight entries." },
                });
              }
              break;
            case 'delete_weight_entry':
              try {
                const { entry_date } = toolCall.args;
                const result = await deleteWeightEntry(entry_date);
                if (result.success) {
                  setMessages(prev => [...prev, {
                    id: (Date.now() + 0.95).toString(),
                    type: 'ai',
                    message: `Successfully deleted weight entry for date: ${entry_date}.`,
                    timestamp: new Date()
                  }]);
                  toast({
                    title: "Weight Entry Deleted",
                    description: `Successfully deleted weight entry for ${entry_date} from your log.`,
                  });
                } else {
                  setMessages(prev => [...prev, {
                    id: (Date.now() + 0.95).toString(),
                    type: 'ai',
                    message: `Failed to delete weight entry for date: ${entry_date}. Reason: ${result.error || "Unknown error."}`,
                    timestamp: new Date()
                  }]);
                  toast({
                    title: "Failed to Delete Weight Entry",
                    description: result.error || "An unexpected error occurred while deleting the weight entry.",
                    variant: "destructive",
                  });
                }
                toolResults.push({
                  role: 'tool',
                  toolCallId: toolCall.toolCallId,
                  result: result,
                });
              } catch (toolError: any) {
                console.error('Error deleting weight entry:', toolError);
                setMessages(prev => [...prev, {
                  id: (Date.now() + 0.95).toString(),
                  type: 'ai',
                  message: `Failed to delete weight entry. Reason: ${toolError.message || "An unexpected error occurred."}`,
                  timestamp: new Date()
                }]);
                toast({
                  title: "Failed to Delete Weight Entry",
                  description: toolError.message || "An unexpected error occurred while deleting the weight entry.",
                  variant: "destructive",
                });
                toolResults.push({
                  role: 'tool',
                  toolCallId: toolCall.toolCallId,
                  result: { success: false, error: toolError.message || "Failed to delete weight entry." },
                });
              }
              break;
            case 'modify_weight_entry':
              try {
                const { original_entry_date, new_weight_kg, new_entry_date } = toolCall.args;
                const result = await modifyWeightEntry({ original_entry_date, new_weight_kg, new_entry_date });
                if (result.success) {
                  setMessages(prev => [...prev, {
                    id: (Date.now() + 0.96).toString(),
                    type: 'ai',
                    message: `Successfully modified weight entry for date: ${original_entry_date}. New weight: ${new_weight_kg} kg. New date: ${new_entry_date || original_entry_date}.`,
                    timestamp: new Date()
                  }]);
                  toast({
                    title: "Weight Entry Modified",
                    description: `Successfully modified weight entry for ${original_entry_date}.`,
                  });
                } else {
                  setMessages(prev => [...prev, {
                    id: (Date.now() + 0.96).toString(),
                    type: 'ai',
                    message: `Failed to modify weight entry for date: ${original_entry_date}. Reason: ${result.error || "Unknown error."}`,
                    timestamp: new Date()
                  }]);
                  toast({
                    title: "Failed to Modify Weight Entry",
                    description: result.error || "An unexpected error occurred while modifying the weight entry.",
                    variant: "destructive",
                  });
                }
                toolResults.push({
                  role: 'tool',
                  toolCallId: toolCall.toolCallId,
                  result: result,
                });
              } catch (toolError: any) {
                console.error('Error modifying weight entry:', toolError);
                setMessages(prev => [...prev, {
                  id: (Date.now() + 0.96).toString(),
                  type: 'ai',
                  message: `Failed to modify weight entry. Reason: ${toolError.message || "An unexpected error occurred."}`,
                  timestamp: new Date()
                }]);
                toast({
                  title: "Failed to Modify Weight Entry",
                  description: toolError.message || "An unexpected error occurred while modifying the weight entry.",
                  variant: "destructive",
                });
                toolResults.push({
                  role: 'tool',
                  toolCallId: toolCall.toolCallId,
                  result: { success: false, error: toolError.message || "Failed to modify weight entry." },
                });
              }
              break;
            case 'set_user_info':
              try {
                const { key, value } = toolCall.args;
                const result = await setUserInfo(key, value);
                if (result.success) {
                  setMessages(prev => [...prev, {
                    id: (Date.now() + 0.97).toString(),
                    type: 'ai',
                    message: `Successfully set user information for key: ${key}.`,
                    timestamp: new Date()
                  }]);
                  toast({
                    title: "User Info Set",
                    description: `Successfully set user information for key: ${key}.`,
                  });
                } else {
                  setMessages(prev => [...prev, {
                    id: (Date.now() + 0.97).toString(),
                    type: 'ai',
                    message: `Failed to set user information for key: ${key}. Reason: ${result.error || "Unknown error."}`,
                    timestamp: new Date()
                  }]);
                  toast({
                    title: "Failed to Set User Info",
                    description: result.error || "An unexpected error occurred while setting user information.",
                    variant: "destructive",
                  });
                }
                toolResults.push({
                  role: 'tool',
                  toolCallId: toolCall.toolCallId,
                  result: result,
                });
              } catch (toolError: any) {
                console.error('Error setting user info:', toolError);
                setMessages(prev => [...prev, {
                  id: (Date.now() + 0.97).toString(),
                  type: 'ai',
                  message: `Failed to set user info. Reason: ${toolError.message || "An unexpected error occurred."}`,
                  timestamp: new Date()
                }]);
                toast({
                  title: "Failed to Set User Info",
                  description: toolError.message || "An unexpected error occurred while setting user information.",
                  variant: "destructive",
                });
                toolResults.push({
                  role: 'tool',
                  toolCallId: toolCall.toolCallId,
                  result: { success: false, error: toolError.message || "Failed to set user info." },
                });
              }
              break;
            case 'get_user_info':
              try {
                const { key } = toolCall.args;
                const userInfo = getUserInfo(key);
                let message = "";
                if (key) {
                  message = userInfo !== null ? `User information for '${key}': ${JSON.stringify(userInfo)}` : `No user information found for key: '${key}'.`;
                } else {
                  message = userInfo && Object.keys(userInfo).length > 0 ? `All user information: ${JSON.stringify(userInfo, null, 2)}` : "No user information found.";
                }

                setMessages(prev => [...prev, {
                  id: (Date.now() + 0.98).toString(),
                  type: 'ai',
                  message: message,
                  timestamp: new Date()
                }]);

                toolResults.push({
                  role: 'tool',
                  toolCallId: toolCall.toolCallId,
                  result: { success: true, message: message },
                });
              } catch (toolError: any) {
                console.error('Error getting user info:', toolError);
                toast({
                  title: "Failed to Retrieve User Info",
                  description: toolError.message || "An unexpected error occurred while retrieving user information.",
                  variant: "destructive",
                });
                toolResults.push({
                  role: 'tool',
                  toolCallId: toolCall.toolCallId,
                  result: { success: false, error: toolError.message || "Failed to retrieve user information." },
                });
              }
              break;
            default:
              console.warn(`Unknown tool call: ${toolCall.toolName}`);
              toolResults.push({
                role: 'tool',
                toolCallId: toolCall.toolCallId,
                result: { success: false, error: `Unknown tool: ${toolCall.toolName}` },
              });
              break;
          }
        }
        // Re-generate text with tool results
        const { text: toolResponseText } = await callGeminiWithFailover(
          modelForToolResults,
          {
            messages: formattedMessages as any,
            toolResults: toolResults,
          }
        );
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
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="bg-white dark:bg-black text-white border-green-500 border-2 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center text-3xl text-black dark:text-white">
            <MessageSquare className="h-8 w-8 mr-3 mt-1 text-green-500" />
            Chat with Dan Go AI Coach
          </CardTitle>
          <p className="text-gray-700 dark:text-gray-300 text-lg">Get personalized fitness advice and motivation 24/7</p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white border-gray-300 shadow-lg h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center text-black">
                <Activity className="h-6 w-6 mr-2 text-green-500" />
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
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-black'
                        }`}
                      >
                        {msg.type === 'ai' ? (
                          <ReactMarkdown components={{
                            p: ({ node, ...props }) => <p className="text-sm leading-relaxed break-words text-black" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc list-inside text-sm leading-relaxed break-words text-black" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-sm leading-relaxed break-words text-black" {...props} />,
                            li: ({ node, ...props }) => <li className="text-sm leading-relaxed break-words text-black" {...props} />,
                            a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-bold text-black" {...props} />,
                            em: ({ node, ...props }) => <em className="italic text-black" {...props} />,
                            code: ({ node, ...props }) => <code className="bg-gray-200 rounded px-1 py-0.5 text-xs text-black" {...props} />,
                            pre: ({ node, ...props }) => <pre className="bg-gray-200 rounded p-2 overflow-x-auto text-xs text-black" {...props} />,
                            h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2 text-black" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-3 mb-1.5 text-black" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-2.5 mb-1 text-black" {...props} />,
                            h4: ({ node, ...props }) => <h4 className="text-base font-bold mt-2 mb-0.5 text-black" {...props} />,
                            h5: ({ node, ...props }) => <h5 className="text-sm font-bold mt-1.5 mb-0.5 text-black" {...props} />,
                            h6: ({ node, ...props }) => <h6 className="text-xs font-bold mt-1 mb-0.5 text-black" {...props} />,
                          }}>
                            {msg.message}
                          </ReactMarkdown>
                        ) : (
                          <p className="text-sm leading-relaxed break-words text-white">{msg.message}</p>
                        )}
                        {msg.imageUrls && msg.imageUrls.map((url, imgIndex) => (
                          <img key={imgIndex} src={url} alt={`User uploaded ${imgIndex + 1}`} className="mt-2 max-w-full h-auto rounded-md" />
                        ))}
                        <p className="text-xs mt-2 text-gray-500">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-gray-100 text-black p-4 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                    className="h-auto p-3 text-xs break-words dark:text-gray-200 border-gray-300 hover:bg-green-600"
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
                    className="h-auto p-3 text-xs break-words dark:text-gray-200 border-gray-300 hover:bg-green-600"
                    onClick={() => {
                      setCurrentMessage("Log my food.");
                      sendMessage();
                    }}
                  >
                    Log my food.
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto p-3 text-xs break-words dark:text-gray-200 border-gray-300 hover:bg-green-600"
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
                <div className="mb-2 p-2 border rounded-md bg-gray-100 flex flex-wrap gap-2">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative flex items-center p-1 border rounded-md bg-white">
                      <img src={image.previewUrl} alt={`Preview ${index}`} className="max-h-16 rounded-md" />
                      <span className="ml-2 text-xs text-gray-700 truncate max-w-[100px]">{image.file.name}</span>
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
                  className="bg-white border-gray-300 text-black min-h-[40px] pr-4"
                  disabled={isLoading}
                />
                <Button
                  asChild
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Image className="h-5 w-5 dark:text-gray-50" />
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
                  className="bg-green-500 text-white hover:bg-green-600 h-10"
                >
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-white text-black border-gray-300 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-black">
                <Lightbulb className="h-6 w-6 mr-2 text-green-500" />
                Dan Go's Philosophy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-black">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="mindset" className="border-b border-gray-200">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center">
                      <Badge variant="secondary" className="mr-2 bg-green-100 text-green-800">Mindset</Badge>
                      <span className="text-sm font-semibold text-black">Mindset</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 px-4 bg-gray-50 rounded-b-lg text-black">
                    <p className="break-words mb-2 text-gray-700"><strong>Mindset Shifts:</strong> Your thoughts dictate your reality. Cultivate a growth mindset, embrace challenges, and reframe setbacks as opportunities.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 text-green-700 border-green-300 hover:bg-green-600"
                      onClick={() => {
                        setCurrentMessage("Let's discuss 'Mindset Shifts'. How can I cultivate a growth mindset?");
                        sendMessage();
                      }}
                    >
                      Discuss 'Mindset Shifts'
                    </Button>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="consistency" className="border-b border-gray-200">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center">
                      <Badge variant="secondary" className="mr-2 bg-green-100 text-green-800">Consistency</Badge>
                      <span className="text-sm font-semibold text-black">Consistency</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 px-4 bg-gray-50 rounded-b-lg text-black">
                    <p className="break-words mb-2 text-gray-700"><strong>Sustainable Habits:</strong> Focus on small, consistent actions rather than drastic, unsustainable changes. Progress over perfection.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 text-green-700 border-green-300 hover:bg-green-600"
                      onClick={() => {
                        setCurrentMessage("Let's discuss 'Sustainable Habits'. What small, consistent actions can I start with?");
                        sendMessage();
                      }}
                    >
                      Discuss 'Sustainable Habits'
                    </Button>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="transformation" className="border-b border-gray-200">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center">
                      <Badge variant="secondary" className="mr-2 bg-green-100 text-green-800">Transformation</Badge>
                      <span className="text-sm font-semibold text-black">Transformation</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 px-4 bg-gray-50 rounded-b-lg text-black">
                    <p className="break-words mb-2 text-gray-700"><strong>The 5-Minute Rule:</strong> If a task takes less than 5 minutes, do it immediately. This prevents procrastination and builds momentum.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 text-green-700 border-green-300 hover:bg-green-600"
                      onClick={() => {
                        setCurrentMessage("Let's discuss 'The 5-Minute Rule'. How can I apply this to my fitness routine?");
                        sendMessage();
                      }}
                    >
                      Discuss 'The 5-Minute Rule'
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          <div className="mt-8">
            {/* <MoodLogger /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
