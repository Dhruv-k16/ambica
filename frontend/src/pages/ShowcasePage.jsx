import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useRef } from 'react';
import { useCallback } from 'react';

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

  useEffect(() => {
    if (!isGalleryOpen) return;
    const interval = setInterval(() => {
      nextImage();
    }, 4000);
    return () => clearInterval(interval);
  }, [isGalleryOpen, nextImage]);

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

  const openGallery = (event) => {
    setSelectedEvent(event);
    setCurrentIndex(0);
    setIsGalleryOpen(true);
  };

  const nextImage = useCallback(() => {
    setCurrentImage((prev) =>
      prev === selectedEvent.images.length - 1 ? 0 : prev + 1
    );
  }, [selectedEvent]);

  const prevImage = useCallback(() => {
    setCurrentImage((prev) =>
      prev === 0 ? selectedEvent.images.length - 1 : prev - 1
    );
  }, [selectedEvent]);



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

      <section className="relative py-24 md:py-32 bg-background overflow-hidden">
        <div className="absolute inset-0 grain-texture" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-16"
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

      <section className="py-12 bg-secondary/30 sticky top-20 z-40 border-b border-border/40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center flex-wrap gap-3">
            <Filter className="text-primary" size={20} />
            {categories.map((category) => (
              <Button
                key={category}
                data-testid={`filter-${category}`}
                onClick={() => handleFilter(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`rounded-full transition-all duration-200 ${selectedCategory === category
                  ? 'bg-primary text-white shadow-md'
                  : 'border-border hover:border-primary hover:text-primary'
                  }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No events found in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.event_id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  data-testid={`event-card-${event.event_id}`}
                  className="group relative overflow-hidden rounded-lg bg-muted cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={event.images[0]}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="mb-2">
                      <span className="text-xs font-medium bg-primary/80 px-3 py-1 rounded-full">
                        {event.event_type}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl font-medium mb-2">{event.title}</h3>
                    <p className="text-sm opacity-90 mb-1">{event.location}</p>
                    {event.description && (
                      <p className="text-sm opacity-80 line-clamp-2 mt-2">{event.description}</p>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                      <button
                        onClick={() => openGallery(event)}
                        className="text-xs font-medium text-primary px-2 hover:underline"
                      >
                        {event.images.length} photos
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-5xl p-0 bg-black border-none">
          {selectedEvent && (
            <div
              className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Close */}
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="absolute top-4 right-4 text-white z-20"
              >
                <X size={28} />
              </button>

              {/* Left Arrow */}
              <button
                onClick={prevImage}
                className="absolute left-6 text-white z-20"
              >
                <ChevronLeft size={42} />
              </button>

              {/* Fade Animated Image */}
              <motion.img
                key={currentIndex}
                src={selectedEvent.images[currentIndex]}
                alt="Gallery"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
              />

              {/* Right Arrow */}
              <button
                onClick={nextImage}
                className="absolute right-6 text-white z-20"
              >
                <ChevronRight size={42} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-6 flex space-x-2">
                {selectedEvent.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                      ? 'bg-white scale-125'
                      : 'bg-gray-500'
                      }`}
                  />
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default ShowcasePage;
