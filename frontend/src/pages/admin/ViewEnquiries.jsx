import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, CheckCircle, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import api from '@/lib/api';

const ViewEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await api.get('/enquiries');
      setEnquiries(response.data);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (enquiryId, newStatus) => {
    try {
      await api.patch(`/enquiries/${enquiryId}`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchEnquiries();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'new':
        return <Clock className="text-blue-500" size={18} />;
      case 'contacted':
        return <CheckCircle className="text-green-500" size={18} />;
      case 'closed':
        return <X className="text-gray-500" size={18} />;
      default:
        return <Clock className="text-blue-500" size={18} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700';
      case 'contacted':
        return 'bg-green-100 text-green-700';
      case 'closed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div data-testid="view-enquiries-page" className="min-h-screen bg-background">
      <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="font-heading text-2xl font-semibold text-foreground">View Enquiries</h1>
          </div>
          <span className="text-sm text-muted-foreground">
            {enquiries.length} total enquiries
          </span>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading enquiries...</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No enquiries yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enquiries.map((enquiry, index) => (
              <motion.div
                key={enquiry.enquiry_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                data-testid={`enquiry-card-${enquiry.enquiry_id}`}
                className="bg-white rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-heading text-xl font-medium text-foreground mb-1">
                          {enquiry.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(enquiry.status)}
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(enquiry.status)}`}>
                            {enquiry.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Phone size={16} className="flex-shrink-0" />
                        <span>{enquiry.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Mail size={16} className="flex-shrink-0" />
                        <span className="truncate">{enquiry.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Calendar size={16} className="flex-shrink-0" />
                        <span>{enquiry.event_type} - {enquiry.event_date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <MapPin size={16} className="flex-shrink-0" />
                        <span>{enquiry.location}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-sm font-medium text-foreground mb-1">Message:</p>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                        {enquiry.message}
                      </p>
                    </div>

                    <div className="text-xs text-muted-foreground pt-2">
                      Submitted: {new Date(enquiry.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="md:w-48">
                    <Select
                      value={enquiry.status}
                      onValueChange={(value) => handleStatusUpdate(enquiry.enquiry_id, value)}
                    >
                      <SelectTrigger data-testid={`status-select-${enquiry.enquiry_id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
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

export default ViewEnquiries;