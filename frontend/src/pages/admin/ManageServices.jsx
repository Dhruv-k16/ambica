import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import api from '@/lib/api';
import { uploadToCloudinary } from '@/lib/cloudinary';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(file, 'image');
      setFormData({ ...formData, image_url: imageUrl });
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/services/${editingService.service_id}`, formData);
      toast.success('Service updated successfully');
      setIsDialogOpen(false);
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      image_url: service.image_url
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: ''
    });
    setEditingService(null);
  };

  return (
    <div data-testid="manage-services-page" className="min-h-screen bg-background">
      <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="font-heading text-2xl font-semibold text-foreground">Manage Services</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8">
        {loading && services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading services...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {services.map((service, index) => (
              <motion.div
                key={service.service_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-lg border border-border overflow-hidden shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                  <div className="md:col-span-1">
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="w-full h-48 md:h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h3 className="font-heading text-2xl font-medium text-foreground mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground">{service.description}</p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          data-testid={`edit-service-${service.service_id}`}
                          onClick={() => handleEdit(service)}
                          variant="outline"
                          className="mt-4"
                        >
                          <Edit size={16} className="mr-2" />
                          Edit Service
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Service</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Service Title *</Label>
                            <Input
                              id="title"
                              name="title"
                              data-testid="service-title-input"
                              value={formData.title}
                              onChange={handleChange}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                              id="description"
                              name="description"
                              value={formData.description}
                              onChange={handleChange}
                              rows={5}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Service Image</Label>
                            {formData.image_url ? (
                              <div className="relative">
                                <img
                                  src={formData.image_url}
                                  alt="Preview"
                                  className="w-full h-48 object-cover rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => setFormData({ ...formData, image_url: '' })}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ) : (
                              <div className="border-2 border-dashed border-border rounded-lg p-4">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                  id="service-image-upload"
                                  disabled={uploading}
                                />
                                <label
                                  htmlFor="service-image-upload"
                                  className="flex flex-col items-center cursor-pointer"
                                >
                                  <Upload className="text-muted-foreground mb-2" size={32} />
                                  <span className="text-sm text-muted-foreground">
                                    {uploading ? 'Uploading...' : 'Click to upload image'}
                                  </span>
                                </label>
                              </div>
                            )}
                          </div>

                          <div className="flex space-x-2 pt-4">
                            <Button
                              type="submit"
                              data-testid="save-service-btn"
                              disabled={loading || uploading}
                              className="flex-1 bg-primary text-white hover:bg-primary/90"
                            >
                              {loading ? 'Saving...' : 'Update Service'}
                            </Button>
                            <DialogTrigger asChild>
                              <Button type="button" variant="outline">
                                Cancel
                              </Button>
                            </DialogTrigger>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageServices;