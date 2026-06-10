import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useState } from 'react';

const schema = z.object({
  staffId: z.string().min(1, 'Staff ID required'),
  password: z.string().min(1, 'Password required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      const res = await api.post('/auth/login', data);
      login(res.data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-green-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-xl">DS</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">DocStream</h2>
          <p className="text-gray-500 text-sm mt-1">Enterprise Operations Management</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Staff ID" {...register('staffId')} error={errors.staffId?.message} placeholder="Enter your Staff ID" />
          <Input label="Password" type="password" {...register('password')} error={errors.password?.message} placeholder="Enter your password" />

          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
            Sign In
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}
