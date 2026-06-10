import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await api.post('/auth/forgot-password', { email }).catch(() => {});
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
        <p className="text-gray-500 text-sm mb-6">Enter your email and we'll send a reset link.</p>

        {sent ? (
          <div className="text-center">
            <p className="text-green-600 font-medium mb-4">If that email exists, a reset link was sent.</p>
            <Link to="/login" className="text-sm text-green-600 underline">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
            <Button type="submit" isLoading={loading} className="w-full">Send Reset Link</Button>
            <div className="text-center">
              <Link to="/login" className="text-sm text-green-600">Back to Login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
