import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Award, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import api from '@/lib/api';

const AboutPage = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get('/content/about');
        setContent(response.data.content || {});
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const defaultContent = {
    title: 'Our Story',
    subtitle: 'A Family Tradition of Excellence',
    paragraphs: [
      'Ambica Wedding Decor & Planner is a family-run business rooted in the rich cultural traditions of Gujarat and Rajasthan.',
      'We believe in blending traditional elegance with modern design aesthetics.',
      'Your special day deserves nothing less than perfection, and that\'s exactly what we deliver.'
    ],
    values: [
      {
        title: 'Tradition Meets Innovation',
        description: 'Honoring cultural heritage while embracing modern design'
      },
      {
        title: 'Attention to Detail',
        description: 'Every element carefully curated for perfection'
      },
      {
        title: 'Personalized Service',
        description: 'Your vision, our expertise, unforgettable results'
      }
    ]
  };

  const pageContent = content || defaultContent;

  return (
    <div data-testid="about-page">
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
            <p className="font-accent text-2xl text-primary">{pageContent.subtitle}</p>
            <h1 className="font-heading text-4xl md:text-5xl font-normal text-foreground">
              {pageContent.title}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {pageContent.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-base md:text-lg leading-relaxed text-muted-foreground text-center"
              >
                {paragraph}
              </p>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl md:text-4xl font-normal text-center mb-16 text-foreground"
          >
            Our Values
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pageContent.values.map((value, index) => {
              const icons = [Heart, Award, Users];
              const Icon = icons[index % icons.length];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow text-center space-y-4"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-medium text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1710498689566-868b93f934c4?auto=format&fit=crop&w=800"
                alt="Wedding Decoration"
                className="rounded-lg shadow-lg"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-normal text-foreground">
                Serving Gujarat & Rajasthan
              </h2>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                Based in Idar, Sabarkantha, we proudly serve clients across Gujarat and Rajasthan. 
                Our deep understanding of regional traditions, combined with contemporary design expertise, 
                allows us to create celebrations that honor your heritage while embracing modern elegance.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                Whether it's a vibrant Gujarati wedding or a royal Rajasthani celebration, we bring the 
                same level of dedication, creativity, and professionalism to every event.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;