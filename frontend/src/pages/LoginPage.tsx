import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { isAxiosError } from 'axios';
import { authService } from '../services/auth.service';
import { ROUTES } from '../constants/routes';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../App';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      login(response.user);
      toast.success('Welcome back!');
      navigate(ROUTES.DASHBOARD);
    } catch (err: unknown) {
      let message = 'Login failed. Please check your credentials.';
      if (isAxiosError(err)) {
        message = err.response?.data?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-400">Enter your credentials to access your account</p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <Input
              label="Email Address"
              placeholder="name@example.com"
              register={register('email')}
              error={errors.email?.message}
              icon={<Mail size={18} />}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              register={register('password')}
              error={errors.password?.message}
              icon={<Lock size={18} />}
            />
            
            <div className="flex items-center justify-end mb-6">
            
            </div>

            <Button type="submit" isLoading={isLoading} className="mt-4">
              <LogIn size={18} className="mr-2" />
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <Link to={ROUTES.REGISTER} className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
