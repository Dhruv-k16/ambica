import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div data-testid="services-page">
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
            <p className="font-accent text-2xl text-primary">What We Offer</p>
            <h1 className="font-heading text-4xl md:text-5xl font-normal text-foreground">
              Our Services
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive event decoration services tailored to your vision
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading services...</p>
            </div>
          ) : (
            <div className="space-y-24">
              {services.map((service, index) => (
                <motion.div
                  key={service.service_id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="group relative overflow-hidden rounded-arch rounded-b-lg shadow-lg">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={service.image_url}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className={`space-y-6 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <div className="inline-block">
                      <span className="text-sm font-medium tracking-widest uppercase text-primary bg-primary/10 px-4 py-2 rounded-full">
                        Service {index + 1}
                      </span>
                    </div>
                    <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground">
                      {service.title}
                    </h2>
                    <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 md:py-32 bg-primary/5">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-normal text-foreground">
              Custom Solutions for Every Event
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Don't see exactly what you're looking for? We create custom decoration packages 
              tailored to your specific needs and budget. Get in touch to discuss your vision.
            </p>
            <a 
              href="/contact"
              className="inline-block mt-6 rounded-full bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg font-medium"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
