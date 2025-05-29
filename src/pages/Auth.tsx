import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell, User, Lock, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const { toast } = useToast();
  const { signUp, signIn, signInAsGuest } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [guestSignInLoading, setGuestSignInLoading] = useState(false);
 
    const [signUpData, setSignUpData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
 
    const [signInData, setSignInData] = useState({
      email: '',
      password: ''
    });
 
    const handleSignUp = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (signUpData.password !== signUpData.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords don't match. Please try again.",
          variant: "destructive"
        });
        return;
      }
 
      setLoading(true);
      try {
        const { error } = await signUp(signUpData.email, signUpData.password, signUpData.name);
        
        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome to Dan Go AI!",
            description: "Your account has been created successfully.",
          });
          navigate('/');
        }
      } catch (error) {
        toast({
          title: "Sign Up Failed",
          description: "An unexpected error occurred.",
          variant: "destructive"
        });
      }
      setLoading(false);
    };
 
    const handleSignIn = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      
      try {
        const { error } = await signIn(signInData.email, signInData.password);
        
        if (error) {
          toast({
            title: "Sign In Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome Back!",
            description: "You've been signed in successfully.",
          });
          navigate('/');
        }
      } catch (error) {
        toast({
          title: "Sign In Failed",
          description: "An unexpected error occurred.",
          variant: "destructive"
        });
      }
      setLoading(false);
    };
 
    const handleGuestSignIn = async () => {
      setGuestSignInLoading(true);
      try {
        const { error } = await signInAsGuest();
        if (error) {
          toast({
            title: "Guest Sign In Failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome, Guest!",
            description: "You've been signed in as a guest.",
          });
          navigate('/');
        }
      } catch (error) {
        toast({
          title: "Guest Sign In Failed",
          description: "An unexpected error occurred during guest sign-in.",
          variant: "destructive"
        });
      }
      setGuestSignInLoading(false);
    };
 
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-zinc-900 text-white border-zinc-700 shadow-lg rounded-xl transition-all duration-300 ease-in-out">
          <CardHeader className="text-center pt-8 pb-4">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-3 rounded-full shadow-md">
                <Dumbbell className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-white">Dan Go AI Coach</CardTitle>
            <p className="text-zinc-400 text-sm mt-1">Your personal fitness transformation starts here</p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <Tabs defaultValue="signin" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-zinc-800 rounded-lg p-1">
                <TabsTrigger value="signin" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white rounded-md text-zinc-400 transition-colors duration-200">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white rounded-md text-zinc-400 transition-colors duration-200">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="mt-4">
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div>
                    <Label htmlFor="signin-email" className="flex items-center text-zinc-300 text-sm mb-2">
                      <Mail className="h-4 w-4 mr-2 text-zinc-500" />
                      Email
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                      placeholder="your@email.com"
                      required
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500 focus-visible:ring-purple-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signin-password" className="flex items-center text-zinc-300 text-sm mb-2">
                      <Lock className="h-4 w-4 mr-2 text-zinc-500" />
                      Password
                    </Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                      placeholder="Enter your password"
                      required
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500 focus-visible:ring-purple-500 transition-all duration-200"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-zinc-900 px-2 text-zinc-500">
                      Or continue as
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleGuestSignIn}
                  className="w-full bg-zinc-700 text-zinc-200 hover:bg-zinc-600 transition-colors duration-200 font-semibold py-2 rounded-lg"
                  disabled={guestSignInLoading}
                >
                  {guestSignInLoading ? 'Continuing as Guest...' : 'Continue as Guest'}
                </Button>
              </TabsContent>
              
              <TabsContent value="signup" className="mt-4">
                <form onSubmit={handleSignUp} className="space-y-5">
                  <div>
                    <Label htmlFor="signup-name" className="flex items-center text-zinc-300 text-sm mb-2">
                      <User className="h-4 w-4 mr-2 text-zinc-500" />
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={signUpData.name}
                      onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
                      placeholder="Your full name"
                      required
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500 focus-visible:ring-purple-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email" className="flex items-center text-zinc-300 text-sm mb-2">
                      <Mail className="h-4 w-4 mr-2 text-zinc-500" />
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                      placeholder="your@email.com"
                      required
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500 focus-visible:ring-purple-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password" className="flex items-center text-zinc-300 text-sm mb-2">
                      <Lock className="h-4 w-4 mr-2 text-zinc-500" />
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                      placeholder="Create a password"
                      required
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500 focus-visible:ring-purple-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-confirm-password" className="text-zinc-300 text-sm mb-2">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                      placeholder="Confirm your password"
                      required
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500 focus-visible:ring-purple-500 transition-all duration-200"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default Auth;
