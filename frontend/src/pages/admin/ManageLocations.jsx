import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Mail, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import api from '@/lib/api';

const ManageLocations = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locationData, setLocationData] = useState({
    address: '',
    city: '',
    state: '',
    serviceAreas: '',
    phone: '',
    email: '',
    googleMapsEmbed: ''
  });

  useEffect(() => {
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    try {
      const response = await api.get('/content/location');
      if (response.data.content) {
        setLocationData(response.data.content);
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setLocationData({
      ...locationData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put('/content/location', { content: locationData });
      toast.success('Location details updated successfully');
    } catch (error) {
      console.error('Error updating location:', error);
      toast.error('Failed to update location details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading location data...</p>
      </div>
    );
  }

  return (
    <div data-testid="manage-locations-page" className="min-h-screen bg-background">
      <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="font-heading text-2xl font-semibold text-foreground">Manage Locations</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-border p-6 md:p-8 max-w-4xl mx-auto"
        >
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-medium text-foreground mb-2">
              Business Location & Contact Details
            </h2>
            <p className="text-muted-foreground">
              Update your business address, service areas, and contact information. 
              Changes will reflect immediately on the website.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  data-testid="location-city"
                  value={locationData.city}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Idar"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  name="state"
                  value={locationData.state}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Gujarat"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Full Address *</Label>
              <Textarea
                id="address"
                name="address"
                value={locationData.address}
                onChange={handleChange}
                required
                placeholder="Enter your complete business address"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceAreas">Service Areas *</Label>
              <Textarea
                id="serviceAreas"
                name="serviceAreas"
                value={locationData.serviceAreas}
                onChange={handleChange}
                required
                placeholder="e.g., Gujarat, Rajasthan, Ahmedabad, Udaipur, Jaipur"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                List all cities and states where you provide services (comma-separated)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Business Phone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={locationData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Business Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={locationData.email}
                  onChange={handleChange}
                  required
                  placeholder="info@ambicadecor.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleMapsEmbed">Google Maps Embed URL</Label>
              <Textarea
                id="googleMapsEmbed"
                name="googleMapsEmbed"
                value={locationData.googleMapsEmbed}
                onChange={handleChange}
                placeholder="Paste the full Google Maps embed URL here"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Go to Google Maps → Search your location → Share → Embed a map → Copy HTML
              </p>
            </div>

            <div className="pt-4 border-t border-border">
              <Button
                type="submit"
                data-testid="save-location-btn"
                disabled={saving}
                className="w-full bg-primary text-white hover:bg-primary/90 font-semibold"
                size="lg"
              >
                {saving ? 'Saving...' : (
                  <>
                    <Save size={18} className="mr-2" />
                    Save Location Details
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h3 className="font-medium text-foreground mb-2 flex items-center">
              <MapPin className="text-primary mr-2" size={18} />
              How to get Google Maps embed URL
            </h3>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Go to Google Maps (maps.google.com)</li>
              <li>Search for your business location</li>
              <li>Click "Share" button</li>
              <li>Select "Embed a map" tab</li>
              <li>Copy the entire HTML code and paste it above</li>
            </ol>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ManageLocations;
