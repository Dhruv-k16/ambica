import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
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
  const [aboutContent, setAboutContent] = useState({
    title: '',
    subtitle: '',
    paragraphs: [],
    values: []
  });

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

      const aboutData = aboutRes.data.content || {};
      setAboutContent({
        title: aboutData.title || '',
        subtitle: aboutData.subtitle || '',
        paragraphs: aboutData.paragraphs || [],
        values: aboutData.values || []
      });

    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- HOMEPAGE ---------------- */

  const handleHomepageChange = (field, value) => {
    setHomepageContent({ ...homepageContent, [field]: value });
  };

  const saveHomepageContent = async () => {
    setSaving(true);
    try {
      await api.put('/content/homepage', { content: homepageContent });
      toast.success('Homepage content updated successfully');
    } catch (error) {
      toast.error('Failed to save homepage content');
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- ABOUT ---------------- */

  const handleAboutChange = (field, value) => {
    setAboutContent({ ...aboutContent, [field]: value });
  };

  const handleParagraphChange = (index, value) => {
    const updated = [...aboutContent.paragraphs];
    updated[index] = value;
    setAboutContent({ ...aboutContent, paragraphs: updated });
  };

  const addParagraph = () => {
    setAboutContent({
      ...aboutContent,
      paragraphs: [...aboutContent.paragraphs, '']
    });
  };

  const removeParagraph = (index) => {
    const updated = aboutContent.paragraphs.filter((_, i) => i !== index);
    setAboutContent({ ...aboutContent, paragraphs: updated });
  };

  const handleValueChange = (index, field, value) => {
    const updated = [...aboutContent.values];
    updated[index][field] = value;
    setAboutContent({ ...aboutContent, values: updated });
  };

  const addValue = () => {
    setAboutContent({
      ...aboutContent,
      values: [...aboutContent.values, { title: '', description: '' }]
    });
  };

  const removeValue = (index) => {
    const updated = aboutContent.values.filter((_, i) => i !== index);
    setAboutContent({ ...aboutContent, values: updated });
  };

  const saveAboutContent = async () => {
    setSaving(true);
    try {
      await api.put('/content/about', { content: aboutContent });
      toast.success('About page updated successfully');
    } catch (error) {
      toast.error('Failed to save about content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading content...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold">Edit Content</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="homepage">

          <TabsList className="mb-8">
            <TabsTrigger value="homepage">Homepage</TabsTrigger>
            <TabsTrigger value="about">About Page</TabsTrigger>
          </TabsList>

          {/* ---------------- HOMEPAGE TAB ---------------- */}

          <TabsContent value="homepage">
            <div className="bg-white p-6 rounded-lg border space-y-6">
              <Label>Hero Title</Label>
              <Input
                value={homepageContent.hero_title || ''}
                onChange={(e) => handleHomepageChange('hero_title', e.target.value)}
              />

              <Label>Tagline</Label>
              <Input
                value={homepageContent.tagline || ''}
                onChange={(e) => handleHomepageChange('tagline', e.target.value)}
              />

              <Label>Hero Subtitle</Label>
              <Input
                value={homepageContent.hero_subtitle || ''}
                onChange={(e) => handleHomepageChange('hero_subtitle', e.target.value)}
              />

              <Label>Intro Text</Label>
              <Textarea
                rows={4}
                value={homepageContent.intro_text || ''}
                onChange={(e) => handleHomepageChange('intro_text', e.target.value)}
              />

              <Button onClick={saveHomepageContent} disabled={saving} className="w-full">
                <Save size={18} className="mr-2" />
                Save Homepage Content
              </Button>
            </div>
          </TabsContent>

          {/* ---------------- ABOUT TAB ---------------- */}

          <TabsContent value="about">
            <div className="bg-white p-6 rounded-lg border space-y-8">

              <Label>Title</Label>
              <Input
                value={aboutContent.title}
                onChange={(e) => handleAboutChange('title', e.target.value)}
              />

              <Label>Subtitle</Label>
              <Input
                value={aboutContent.subtitle}
                onChange={(e) => handleAboutChange('subtitle', e.target.value)}
              />

              {/* Paragraphs */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Paragraphs</Label>
                  <Button size="sm" onClick={addParagraph}>
                    <Plus size={16} className="mr-1" /> Add Paragraph
                  </Button>
                </div>

                {aboutContent.paragraphs.map((para, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={para}
                      rows={3}
                      onChange={(e) => handleParagraphChange(index, e.target.value)}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeParagraph(index)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Values */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Values</Label>
                  <Button size="sm" onClick={addValue}>
                    <Plus size={16} className="mr-1" /> Add Value
                  </Button>
                </div>

                {aboutContent.values.map((value, index) => (
                  <div key={index} className="border p-4 rounded space-y-2">
                    <Input
                      placeholder="Value Title"
                      value={value.title}
                      onChange={(e) =>
                        handleValueChange(index, 'title', e.target.value)
                      }
                    />
                    <Textarea
                      placeholder="Value Description"
                      rows={3}
                      value={value.description}
                      onChange={(e) =>
                        handleValueChange(index, 'description', e.target.value)
                      }
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeValue(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              <Button onClick={saveAboutContent} disabled={saving} className="w-full">
                <Save size={18} className="mr-2" />
                Save About Content
              </Button>

            </div>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};

export default EditContent;
