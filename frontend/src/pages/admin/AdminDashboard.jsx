import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Calendar, Settings, FileText, Mail, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const menuItems = [
    {
      title: 'Manage Events',
      description: 'Add, edit, or remove showcase events',
      icon: Calendar,
      path: '/admin/events',
      color: 'bg-blue-500'
    },
    {
      title: 'Manage Services',
      description: 'Update service descriptions and images',
      icon: Settings,
      path: '/admin/services',
      color: 'bg-green-500'
    },
    {
      title: 'View Enquiries',
      description: 'Review and manage customer enquiries',
      icon: Mail,
      path: '/admin/enquiries',
      color: 'bg-purple-500'
    },
    {
      title: 'Edit Content',
      description: 'Update homepage and about page content',
      icon: FileText,
      path: '/admin/content',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-background">
      <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="https://customer-assets.emergentagent.com/job_6da60b51-a53e-4a8b-9a9f-a7f9b38e6720/artifacts/mpo8r793_LOGO.jpeg"
              alt="Ambica Decor Logo"
              className="h-12 w-12 object-contain"
            />
            <div>
              <h1 className="font-heading text-xl font-bold text-primary">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Ambica Wedding Decor</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">{adminUser.name}</p>
              <p className="text-xs text-muted-foreground">{adminUser.email}</p>
            </div>
            <Button
              data-testid="logout-btn"
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-normal text-foreground mb-2">
            Welcome back, {adminUser.name}!
          </h2>
          <p className="text-muted-foreground">Manage your website content from here</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={item.path}>
                  <div
                    data-testid={`dashboard-card-${item.title.toLowerCase().replace(' ', '-')}`}
                    className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-heading text-xl font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-lg"
        >
          <div className="flex items-start space-x-4">
            <Image className="text-primary mt-1" size={24} />
            <div>
              <h3 className="font-medium text-foreground mb-2">Image Upload Info</h3>
              <p className="text-sm text-muted-foreground">
                All images are uploaded to Cloudinary. Ensure images are high quality and properly sized for best results.
                Recommended: 1920x1080 for banners, 800x600 for thumbnails.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;