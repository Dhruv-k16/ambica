import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

const HomePage = () => {
  const [content, setContent] = useState(null);
  const [services, setServices] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentRes, servicesRes, eventsRes] = await Promise.all([
          api.get('/content/homepage'),
          api.get('/services'),
          api.get('/events')
        ]);
        setContent(contentRes.data.content || {});
        setServices(servicesRes.data.slice(0, 3));
        setEvents(eventsRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const defaultContent = {
    hero_title: 'Ambica Wedding Decor & Planner',
    tagline: 'Crafting Timeless Elegance for Every Special Occasion',
    hero_subtitle: 'Serving across Gujarat & Rajasthan',
    intro_heading: 'Creating Unforgettable Memories',
    intro_text: 'With years of experience and a passion for perfection, Ambica Wedding Decor & Planner transforms your special occasions into magical celebrations.',
    cta_primary: 'Enquire Now',
    cta_secondary: 'View Our Work'
  };

  const pageContent = content || defaultContent;

  return (
    <div data-testid="home-page">
      <Navbar />
      
      <section data-testid="hero-section" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 grain-texture" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1746044159252-ed0ccafd7b46?auto=format&fit=crop&w=1920')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="absolute top-20 right-10 w-32 h-32 border-2 border-primary/20 rounded-full animate-pulse" />
        <div className="absolute bottom-20 left-10 w-24 h-24 border-2 border-primary/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <img
              src="https://customer-assets.emergentagent.com/job_6da60b51-a53e-4a8b-9a9f-a7f9b38e6720/artifacts/mpo8r793_LOGO.jpeg"
              alt="Ambica Decor Logo"
              className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 mx-auto object-contain drop-shadow-lg"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="space-y-6"
          >
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-normal text-foreground">
              {pageContent.hero_title}
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="font-accent text-2xl sm:text-3xl lg:text-4xl text-primary"
            >
              {pageContent.tagline}
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto font-medium"
            >
              {pageContent.hero_subtitle}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            >
              <Link to="/contact">
                <Button
                  data-testid="hero-cta-primary"
                  size="lg"
                  className="rounded-full bg-primary text-white hover-logo-purple shadow-lg hover:shadow-2xl transition-all duration-300 px-8 py-6 text-base font-semibold group"
                >
                  {pageContent.cta_primary}
                  <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform duration-300" size={20} />
                </Button>
              </Link>
              <Link to="/showcase">
                <Button
                  data-testid="hero-cta-secondary"
                  variant="outline"
                  size="lg"
                  className="rounded-full border-2 border-primary text-primary hover:bg-logo-purple hover:text-white hover:border-logo-purple transition-all duration-300 px-8 py-6 text-base font-semibold"
                >
                  {pageContent.cta_secondary}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 md:py-32 container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center space-y-6"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-normal text-foreground">
            {pageContent.intro_heading}
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            {pageContent.intro_text}
          </p>
        </motion.div>
      </section>

      <section className="py-24 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center space-y-4 mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading text-3xl md:text-4xl font-normal text-foreground"
            >
              Our Services
            </motion.h2>
            <p className="text-muted-foreground">Comprehensive event decoration solutions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.service_id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-arch rounded-b-lg border border-border/50 bg-white shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={service.image_url}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-heading text-xl font-medium text-foreground">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button
                data-testid="view-all-services-btn"
                variant="outline"
                size="lg"
                className="rounded-full border-2 border-primary text-primary hover:bg-logo-purple hover:text-white hover:border-logo-purple transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {events.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-heading text-3xl md:text-4xl font-normal text-foreground"
              >
                Featured Work
              </motion.h2>
              <p className="text-muted-foreground">Recent celebrations we've been part of</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <motion.div
                  key={event.event_id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-lg bg-muted cursor-pointer"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={event.images[0]}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-heading text-xl font-medium mb-2">{event.title}</h3>
                    <p className="text-sm opacity-90">{event.location}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/showcase">
                <Button
                  data-testid="view-portfolio-btn"
                  size="lg"
                  className="rounded-full bg-primary text-white hover-logo-purple shadow-lg hover:shadow-2xl transition-all duration-300 px-8 font-semibold"
                >
                  View Full Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-24 md:py-32 bg-primary/5">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <Sparkles className="w-12 h-12 text-primary mx-auto" />
            <h2 className="font-heading text-3xl md:text-4xl font-normal text-foreground">
              Ready to Create Your Dream Event?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Let's bring your vision to life with our expert decoration services
            </p>
            <Link to="/contact">
              <Button
                data-testid="bottom-cta-btn"
                size="lg"
                className="rounded-full bg-primary text-white hover-logo-purple shadow-lg hover:shadow-2xl transition-all duration-300 px-8 py-6 text-base font-semibold"
              >
                Get in Touch
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;