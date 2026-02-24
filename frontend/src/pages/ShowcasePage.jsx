import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const ShowcasePage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // ================= FETCH EVENTS =================
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // ================= FILTER =================
  const categories = [
    'all',
    ...new Set(events.map((event) => event.category))
  ];

  const handleFilter = (category) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter((event) => event.category === category));
    }
  };

  // ================= GALLERY =================
  const openGallery = (event) => {
    setSelectedEvent(event);
    setCurrentIndex(0);
    setIsGalleryOpen(true);
  };

  const nextImage = useCallback(() => {
    if (!selectedEvent || !selectedEvent.images?.length) return;
    setCurrentIndex((prev) =>
      prev === selectedEvent.images.length - 1 ? 0 : prev + 1
    );
  }, [selectedEvent]);

  const prevImage = useCallback(() => {
    if (!selectedEvent || !selectedEvent.images?.length) return;
    setCurrentIndex((prev) =>
      prev === 0 ? selectedEvent.images.length - 1 : prev - 1
    );
  }, [selectedEvent]);

  // ================= AUTO SLIDE =================
  useEffect(() => {
    if (!isGalleryOpen) return;

    const interval = setInterval(() => {
      nextImage();
    }, 4000);

    return () => clearInterval(interval);
  }, [isGalleryOpen, nextImage]);

  // ================= KEYBOARD =================
  useEffect(() => {
    const handleKey = (e) => {
      if (!isGalleryOpen) return;

      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') setIsGalleryOpen(false);
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isGalleryOpen, nextImage, prevImage]);

  // ================= TOUCH =================
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;

    if (touchStartX.current - touchEndX.current > 50) {
      nextImage();
    }

    if (touchEndX.current - touchStartX.current > 50) {
      prevImage();
    }
  };

  return (
    <div data-testid="showcase-page">
      <Navbar />

      {/* HERO */}
      <section className="relative py-24 md:py-32 bg-background overflow-hidden">
        <div className="absolute inset-0 grain-texture" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center space-y-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-accent text-2xl text-primary">Our Portfolio</p>
            <h1 className="font-heading text-4xl md:text-5xl font-normal text-foreground">
              Showcase
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              A glimpse of the magical celebrations we've been privileged to create
            </p>
          </motion.div>
        </div>
      </section>

      {/* FILTER */}
      <section className="py-12 bg-secondary/30 sticky top-20 z-40 border-b border-border/40">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-center flex-wrap gap-3">
          <Filter className="text-primary" size={20} />
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => handleFilter(category)}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className={`rounded-full ${selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'hover:border-primary hover:text-primary'
                }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </section>

      {/* EVENTS GRID */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.event_id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-lg bg-muted cursor-pointer shadow-sm hover:shadow-xl"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={event.images?.[0]}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => openGallery(event)}
                      className="bg-white/90 px-3 py-1 rounded-full text-xs font-medium text-primary"
                    >
                      {event.images?.length || 0} photos
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GALLERY MODAL */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black border-none">
          {selectedEvent && (
            <div
              className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="absolute top-4 right-4 text-white z-20"
              >
                <X size={28} />
              </button>

              <button
                onClick={prevImage}
                className="absolute left-6 text-white z-20"
              >
                <ChevronLeft size={42} />
              </button>

              <motion.img
                key={currentIndex}
                src={selectedEvent.images?.[currentIndex]}
                alt="Gallery"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
              />

              <button
                onClick={nextImage}
                className="absolute right-6 text-white z-20"
              >
                <ChevronRight size={42} />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ShowcasePage;