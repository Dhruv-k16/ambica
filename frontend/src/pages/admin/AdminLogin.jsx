import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/api';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('admin_token', response.data.access_token);
      localStorage.setItem('admin_user', JSON.stringify(response.data.admin));
      toast.success('Login successful!');
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="admin-login-page" className="min-h-screen flex items-center justify-center bg-background grain-texture">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl border border-border"
      >
        <div className="text-center mb-8">
          <img
            src="https://customer-assets.emergentagent.com/job_6da60b51-a53e-4a8b-9a9f-a7f9b38e6720/artifacts/mpo8r793_LOGO.jpeg"
            alt="Ambica Decor Logo"
            className="w-20 h-20 mx-auto mb-4 object-contain"
          />
          <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">
            Admin Login
          </h1>
          <p className="text-muted-foreground">Ambica Wedding Decor & Planner</p>
        </div>

        <form onSubmit={handleSubmit} data-testid="admin-login-form" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="email"
                name="email"
                data-testid="admin-login-email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@ambicadecor.com"
                className="pl-10 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                id="password"
                name="password"
                data-testid="admin-login-password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="pl-10 rounded-lg"
              />
            </div>
          </div>

          <Button
            type="submit"
            data-testid="admin-login-submit"
            disabled={loading}
            size="lg"
            className="w-full rounded-full bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Default: admin@ambicadecor.com / Admin@123</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;