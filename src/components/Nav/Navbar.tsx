
import { Link } from 'react-router-dom';
import { Home, Info, Github } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 py-2">
      <div className="flex justify-between items-center">
        <Link 
          to="/"
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <Home className="w-5 h-5" />
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/about"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <Info className="w-5 h-5" />
          </Link>
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
