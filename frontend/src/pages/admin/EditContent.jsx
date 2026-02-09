import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import api from '@/lib/api';

const EditContent = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [homepageContent, setHomepageContent] = useState({});
  const [aboutContent, setAboutContent] = useState({});

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [homepageRes, aboutRes] = await Promise.all([
        api.get('/content/homepage'),
        api.get('/content/about')
      ]);
      setHomepageContent(homepageRes.data.content || {});
      setAboutContent(aboutRes.data.content || {});
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleHomepageChange = (field, value) => {
    setHomepageContent({ ...homepageContent, [field]: value });
  };

  const handleAboutChange = (field, value) => {
    setAboutContent({ ...aboutContent, [field]: value });
  };

  const handleAboutParagraphChange = (index, value) => {
    const newParagraphs = [...(aboutContent.paragraphs || [])];
    newParagraphs[index] = value;
    setAboutContent({ ...aboutContent, paragraphs: newParagraphs });
  };

  const saveHomepageContent = async () => {
    setSaving(true);
    try {
      await api.put('/content/homepage', { content: homepageContent });
      toast.success('Homepage content updated successfully');
    } catch (error) {
      console.error('Error saving homepage content:', error);
      toast.error('Failed to save homepage content');
    } finally {
      setSaving(false);
    }
  };

  const saveAboutContent = async () => {
    setSaving(true);
    try {
      await api.put('/content/about', { content: aboutContent });
      toast.success('About page content updated successfully');
    } catch (error) {
      console.error('Error saving about content:', error);
      toast.error('Failed to save about content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading content...</p>
      </div>
    );
  }

  return (
    <div data-testid="edit-content-page" className="min-h-screen bg-background">
      <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="font-heading text-2xl font-semibold text-foreground">Edit Content</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8">
        <Tabs defaultValue="homepage" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="homepage">Homepage</TabsTrigger>
            <TabsTrigger value="about">About Page</TabsTrigger>
          </TabsList>

          <TabsContent value="homepage">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-border p-6 space-y-6"
            >
              <h2 className="font-heading text-2xl font-medium text-foreground mb-4">Homepage Content</h2>

              <div className="space-y-2">
                <Label htmlFor="hero_title">Hero Title</Label>
                <Input
                  id="hero_title"
                  data-testid="homepage-hero-title"
                  value={homepageContent.hero_title || ''}
                  onChange={(e) => handleHomepageChange('hero_title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={homepageContent.tagline || ''}
                  onChange={(e) => handleHomepageChange('tagline', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                <Input
                  id="hero_subtitle"
                  value={homepageContent.hero_subtitle || ''}
                  onChange={(e) => handleHomepageChange('hero_subtitle', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="intro_heading">Intro Heading</Label>
                <Input
                  id="intro_heading"
                  value={homepageContent.intro_heading || ''}
                  onChange={(e) => handleHomepageChange('intro_heading', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="intro_text">Intro Text</Label>
                <Textarea
                  id="intro_text"
                  value={homepageContent.intro_text || ''}
                  onChange={(e) => handleHomepageChange('intro_text', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cta_primary">Primary CTA Text</Label>
                  <Input
                    id="cta_primary"
                    value={homepageContent.cta_primary || ''}
                    onChange={(e) => handleHomepageChange('cta_primary', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta_secondary">Secondary CTA Text</Label>
                  <Input
                    id="cta_secondary"
                    value={homepageContent.cta_secondary || ''}
                    onChange={(e) => handleHomepageChange('cta_secondary', e.target.value)}
                  />
                </div>
              </div>

              <Button
                data-testid="save-homepage-content"
                onClick={saveHomepageContent}
                disabled={saving}
                className="w-full bg-primary text-white hover:bg-primary/90 mt-6"
              >
                {saving ? 'Saving...' : (
                  <>
                    <Save size={18} className="mr-2" />
                    Save Homepage Content
                  </>
                )}
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="about">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-border p-6 space-y-6"
            >
              <h2 className="font-heading text-2xl font-medium text-foreground mb-4">About Page Content</h2>

              <div className="space-y-2">
                <Label htmlFor="about_title">Title</Label>
                <Input
                  id="about_title"
                  data-testid="about-title"
                  value={aboutContent.title || ''}
                  onChange={(e) => handleAboutChange('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about_subtitle">Subtitle</Label>
                <Input
                  id="about_subtitle"
                  value={aboutContent.subtitle || ''}
                  onChange={(e) => handleAboutChange('subtitle', e.target.value)}
                />
              </div>

              {(aboutContent.paragraphs || []).map((paragraph, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`paragraph_${index}`}>Paragraph {index + 1}</Label>
                  <Textarea
                    id={`paragraph_${index}`}
                    value={paragraph}
                    onChange={(e) => handleAboutParagraphChange(index, e.target.value)}
                    rows={4}
                  />
                </div>
              ))}

              <Button
                data-testid="save-about-content"
                onClick={saveAboutContent}
                disabled={saving}
                className="w-full bg-primary text-white hover:bg-primary/90 mt-6"
              >
                {saving ? 'Saving...' : (
                  <>
                    <Save size={18} className="mr-2" />
                    Save About Content
                  </>
                )}
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EditContent;