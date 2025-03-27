import { Link } from 'react-router-dom';
import { MapPin, Info, Phone } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Bike rental map - Amsterdam</h1>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link 
              to="/"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <MapPin className="w-5 h-5" />
              <span>Map</span>
            </Link>
            
            <Link 
              to="/about"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Info className="w-5 h-5" />
              <span>About Us</span>
            </Link>
          
            <Link 
              to="/contact"
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>Contact</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
