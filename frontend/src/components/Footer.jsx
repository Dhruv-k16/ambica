import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer data-testid="footer" className="bg-secondary/30 border-t border-border/40">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://customer-assets.emergentagent.com/job_6da60b51-a53e-4a8b-9a9f-a7f9b38e6720/artifacts/v0djnxnp_bg-logo.png"
                alt="Ambica Decor Logo"
                className="h-12 w-12 object-contain"
              />
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold text-primary">
                  Ambica
                </span>
                <span className="font-body text-xs text-muted-foreground tracking-wider uppercase">
                  Wedding Decor
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Crafting Timeless Elegance for Every Special Occasion
            </p>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/showcase" className="text-sm text-muted-foreground hover:text-primary transition-colors">Our Work</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-foreground">Our Services</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">Wedding Décor</li>
              <li className="text-sm text-muted-foreground">Reception Setup</li>
              <li className="text-sm text-muted-foreground">Mandap Decoration</li>
              <li className="text-sm text-muted-foreground">Pre-wedding Events</li>
              <li className="text-sm text-muted-foreground">Corporate Events</li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4 text-foreground">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm text-muted-foreground">
                <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <span>Idar, Sabarkantha, Gujarat</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <span>+91 XXXXX XXXXX</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <span>info@ambicadecor.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2025 Ambica Wedding Decor & Planner. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center space-x-2">
            <span>Made with</span>
            <Heart size={16} className="text-primary fill-primary" />
            <span>in Gujarat & Rajasthan</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;