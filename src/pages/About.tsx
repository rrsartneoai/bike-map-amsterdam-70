
import { Link } from 'react-router-dom';
import { ArrowLeft, Bike, Map, Filter, MapPin, User, Route } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8 text-primary hover:underline transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Map</span>
        </Link>
        
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Amsterdam Bike Rental Map</h1>
            <p className="text-xl text-muted-foreground">
              Find and navigate to the best bike rental stations throughout Amsterdam
            </p>
          </div>
          
          <div className="glass p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">About This Project</h2>
            <p className="mb-4">
              The Amsterdam Bike Rental Map is an interactive web application designed to help locals and tourists 
              easily locate bike rental stations throughout the city. Leveraging the city's extensive cycling infrastructure,
              this tool aims to promote sustainable transportation and enhance the Amsterdam experience.
            </p>
            <p>
              This application provides real-time information about bike rental locations, availability, and pricing,
              allowing users to find the perfect rental option for their needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bike className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Bike Rental Locations</h3>
              </div>
              <p>
                Discover bike rental stations across Amsterdam with detailed information about 
                bike availability, types, pricing, and amenities.
              </p>
            </div>
            
            <div className="glass p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Filter className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Advanced Filtering</h3>
              </div>
              <p>
                Filter rental options by bike type, operator, price range, and amenities to find 
                the perfect match for your cycling needs.
              </p>
            </div>
            
            <div className="glass p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Geolocation</h3>
              </div>
              <p>
                Find the rental stations closest to your current location with a single click,
                making it easy to start your Amsterdam adventure.
              </p>
            </div>
            
            <div className="glass p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Map className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Interactive Map</h3>
              </div>
              <p>
                Explore Amsterdam through a responsive, interactive map interface that provides
                a clear overview of all available rental options.
              </p>
            </div>
          </div>
          
          <div className="glass p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Data Sources</h2>
            <p>
              This application combines data from multiple sources to provide the most comprehensive and 
              up-to-date information about bike rentals in Amsterdam. The primary data sources include:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
              <li>Official Amsterdam city data</li>
              <li>OpenStreetMap (OSM) data</li>
              <li>Direct information from rental operators</li>
              <li>Community-contributed data</li>
            </ul>
          </div>
          
          <div className="glass p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Feedback & Contributions</h2>
            <p>
              We're constantly working to improve the Amsterdam Bike Rental Map. If you have suggestions, 
              feedback, or would like to contribute to the project, please reach out through our GitHub repository.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
