import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { apiClient } from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Leaf, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      // 1. Register the user
      await apiClient.post('/auth/register', {
        ...data,
        role: 'farmer' // Default role for new signups
      });
      
      // 2. Automatically log them in after successful registration
      const loginResponse = await apiClient.post('/auth/login', {
        email: data.email,
        password: data.password
      });

      toast.success("Account created successfully!");
      
      // 3. Store auth state
      login(loginResponse.data.accessToken, loginResponse.data.user);
      
      // TODO: Future Phase - Farmer Profile Completion Wizard
      // For now, we temporarily redirect straight to the Dashboard.
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center mb-8">
        <div className="bg-primary/20 p-4 rounded-2xl mb-4">
          <Leaf className="text-primary w-12 h-12" />
        </div>
        <h2 className="text-center text-3xl font-heading font-extrabold text-text-primary">
          AgriSense
        </h2>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Know Before You Grow.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="glass border-border">
          <CardHeader>
            <CardTitle className="text-xl text-center">Create an account</CardTitle>
            <CardDescription className="text-center">Start optimizing your farm's performance today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                <Input 
                  {...register("name")} 
                  type="text" 
                  className={`bg-surface border-border text-text-primary ${errors.name ? 'border-error focus-visible:ring-error' : ''}`} 
                />
                {errors.name && <p className="mt-1 text-sm text-error">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Email address</label>
                <Input 
                  {...register("email")} 
                  type="email" 
                  className={`bg-surface border-border text-text-primary ${errors.email ? 'border-error focus-visible:ring-error' : ''}`} 
                />
                {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
                <Input 
                  {...register("password")} 
                  type="password" 
                  className={`bg-surface border-border text-text-primary ${errors.password ? 'border-error focus-visible:ring-error' : ''}`} 
                />
                {errors.password && <p className="mt-1 text-sm text-error">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full mt-6" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create Account
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface text-text-secondary">Or</span>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-border bg-background hover:bg-surface/50 transition-colors"
                  onClick={handleGoogleSignup}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    <path fill="none" d="M1 1h22v22H1z" />
                  </svg>
                  Continue with Google
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-text-secondary">Already have an account? </span>
              <Link to={ROUTES.LOGIN} className="font-medium text-primary hover:text-primary/80 transition-colors">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
