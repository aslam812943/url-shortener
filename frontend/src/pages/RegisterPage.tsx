import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';
import { ROUTES } from '../constants/routes';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').regex(/\S/, 'Password cannot be only whitespace'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success('Account created! Please sign in.');
      navigate(ROUTES.LOGIN);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
          <p className="text-slate-400">Join us to start shortening your URLs</p>
        </div>

        <div className="glass rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <Input
              label="Full Name"
              placeholder="John Doe"
              register={register('name')}
              error={errors.name?.message}
              icon={<User size={18} />}
            />
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
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              register={register('confirmPassword')}
              error={errors.confirmPassword?.message}
              icon={<Lock size={18} />}
            />
            
            <Button type="submit" isLoading={isLoading} className="mt-6">
              <UserPlus size={18} className="mr-2" />
              Get Started
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
