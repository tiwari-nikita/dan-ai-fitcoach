
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
      <div className="min-h-screen bg-gradient-to-br from-fitness-light via-white to-fitness-light flex items-center justify-center p-4">
        <Card className="w-full max-w-md fitness-card-gradient border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="fitness-gradient p-3 rounded-full">
                <Dumbbell className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Dan Go AI Coach</CardTitle>
            <p className="text-muted-foreground">Your personal fitness transformation starts here</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email" className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                      placeholder="your@email.com"
                      required
                      className="bg-white/70"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signin-password" className="flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Password
                    </Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                      placeholder="Enter your password"
                      required
                      className="bg-white/70"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full fitness-gradient text-white"
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue as
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleGuestSignIn}
                  className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
                  disabled={guestSignInLoading}
                >
                  {guestSignInLoading ? 'Continuing as Guest...' : 'Continue as Guest'}
                </Button>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={signUpData.name}
                      onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
                      placeholder="Your full name"
                      required
                      className="bg-white/70"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email" className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                      placeholder="your@email.com"
                      required
                      className="bg-white/70"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password" className="flex items-center">
                      <Lock className="h-4 w-4 mr-2" />
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                      placeholder="Create a password"
                      required
                      className="bg-white/70"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                      placeholder="Confirm your password"
                      required
                      className="bg-white/70"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full fitness-gradient text-white"
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
