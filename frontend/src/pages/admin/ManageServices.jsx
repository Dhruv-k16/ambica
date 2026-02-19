import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Trash2, Upload, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import api from "@/lib/api";
import { uploadToCloudinary } from "@/lib/cloudinary";

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get("/services");
      setServices(response.data);
    } catch (error) {
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
    });
    setEditingService(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(file, "image");
      setFormData({ ...formData, image_url: imageUrl });
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingService) {
        await api.put(`/services/${editingService.service_id}`, formData);
        toast.success("Service updated successfully");
      } else {
        await api.post("/services", formData);
        toast.success("Service created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchServices();
    } catch (error) {
      toast.error("Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      image_url: service.image_url,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;

    try {
      await api.delete(`/services/${serviceId}`);
      toast.success("Service deleted successfully");
      fetchServices();
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold">Manage Services</h1>
          </div>

          {/* ADD SERVICE BUTTON */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus size={18} className="mr-2" />
                Add Service
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? "Edit Service" : "Add Service"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Service Title *</Label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label>Description *</Label>
                  <Textarea
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label>Service Image</Label>
                  {formData.image_url ? (
                    <div className="relative">
                      <img
                        src={formData.image_url}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, image_url: "" })
                        }
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
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
                        id="service-upload"
                        disabled={uploading}
                      />
                      <label
                        htmlFor="service-upload"
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <Upload size={32} />
                        <span className="text-sm mt-2">
                          {uploading ? "Uploading..." : "Click to upload"}
                        </span>
                      </label>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex-1"
                  >
                    {loading
                      ? "Saving..."
                      : editingService
                      ? "Update Service"
                      : "Create Service"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* SERVICES LIST */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        {loading ? (
          <p className="text-center text-muted-foreground">
            Loading services...
          </p>
        ) : services.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No services yet. Add one.
          </p>
        ) : (
          <div className="space-y-6">
            {services.map((service, index) => (
              <motion.div
                key={service.service_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-lg border shadow-sm p-6 grid md:grid-cols-3 gap-6"
              >
                <img
                  src={service.image_url}
                  alt={service.title}
                  className="w-full h-48 object-cover rounded-lg"
                />

                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  <p className="text-muted-foreground">
                    {service.description}
                  </p>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(service)}
                    >
                      <Edit size={14} className="mr-2" />
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        handleDelete(service.service_id)
                      }
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete
                    </Button>
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
