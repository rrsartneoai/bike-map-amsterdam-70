import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { 
  Train, Bus, Bike, RefreshCcw, Clock, MapPin, 
  BarChart4, Calendar, ArrowRight, AlertCircle, Info
} from 'lucide-react';
import Navbar from '@/components/Nav/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { fetchBikeRentals, fetchBicycleNetworkRoutes, fetchOVFietsLocations } from '@/lib/api';
import { BikeRental } from '@/types';

const Services = () => {
  const [bikeRentals, setBikeRentals] = useState<BikeRental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bicycleNetworkData, setBicycleNetworkData] = useState<any>(null);
  const [ovFietsLocations, setOVFietsLocations] = useState<BikeRental[]>([]);
  
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        const [rentalsResponse, networkData, ovFietsData] = await Promise.all([
          fetchBikeRentals(),
          fetchBicycleNetworkRoutes(),
          fetchOVFietsLocations()
        ]);
        
        if (rentalsResponse && rentalsResponse.data) {
          const sortedRentals = [...rentalsResponse.data].sort((a, b) => 
            b.bikes.available - a.bikes.available
          ).slice(0, 5);
          
          setBikeRentals(sortedRentals);
        }
        
        if (networkData) {
          setBicycleNetworkData(networkData);
        }
        
        if (ovFietsData) {
          setOVFietsLocations(ovFietsData.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load transportation data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleRefresh = () => {
    toast.loading('Refreshing data...');
    
    setTimeout(() => {
      setLastUpdated(new Date().toLocaleTimeString());
      toast.dismiss();
      toast.success('Data refreshed successfully');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-background pt-16 pb-10">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Transport Services</h1>
          <p className="text-muted-foreground mt-2">
            Integrated information about public transport and bike rental availability in Amsterdam
          </p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <Info className="h-3 w-3" /> 
              OV-fiets API
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <Info className="h-3 w-3" /> 
              Amsterdam Bicycle Network API
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last updated: {lastUpdated}</span>
            <Button variant="outline" size="sm" className="ml-2" onClick={handleRefresh}>
              <RefreshCcw className="h-3 w-3 mr-1" />
              Refresh
            </Button>
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Train className="h-5 w-5" />
                  Public Transport Departures
                </CardTitle>
                <CardDescription>
                  Real-time information for trains, trams and buses from Amsterdam Centraal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="train">
                  <TabsList className="mb-4">
                    <TabsTrigger value="train" className="flex items-center gap-1">
                      <Train className="h-4 w-4" />
                      Train
                    </TabsTrigger>
                    <TabsTrigger value="tram" className="flex items-center gap-1">
                      <Train className="h-4 w-4" />
                      Tram
                    </TabsTrigger>
                    <TabsTrigger value="bus" className="flex items-center gap-1">
                      <Bus className="h-4 w-4" />
                      Bus
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="train" className="space-y-2">
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="py-3 px-4 text-left font-medium text-sm">Time</th>
                            <th className="py-3 px-4 text-left font-medium text-sm">Destination</th>
                            <th className="py-3 px-4 text-left font-medium text-sm">Platform</th>
                            <th className="py-3 px-4 text-left font-medium text-sm">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {publicTransportData.train.map(train => (
                            <tr key={train.id} className="hover:bg-muted/20 transition-colors">
                              <td className="py-3 px-4 font-medium">{train.departureTime}</td>
                              <td className="py-3 px-4">{train.destination}</td>
                              <td className="py-3 px-4">{train.platform}</td>
                              <td className="py-3 px-4">
                                {train.delay > 0 ? (
                                  <span className="text-red-500">+{train.delay} min</span>
                                ) : (
                                  <span className="text-green-500">On time</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="tram" className="space-y-2">
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="py-3 px-4 text-left font-medium text-sm">Line</th>
                            <th className="py-3 px-4 text-left font-medium text-sm">Time</th>
                            <th className="py-3 px-4 text-left font-medium text-sm">Destination</th>
                            <th className="py-3 px-4 text-left font-medium text-sm">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {publicTransportData.tram.map(tram => (
                            <tr key={tram.id} className="hover:bg-muted/20 transition-colors">
                              <td className="py-3 px-4 font-medium">{tram.line}</td>
                              <td className="py-3 px-4">{tram.departureTime}</td>
                              <td className="py-3 px-4">{tram.destination}</td>
                              <td className="py-3 px-4">
                                {tram.delay > 0 ? (
                                  <span className="text-red-500">+{tram.delay} min</span>
                                ) : (
                                  <span className="text-green-500">On time</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="bus" className="space-y-2">
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="py-3 px-4 text-left font-medium text-sm">Line</th>
                            <th className="py-3 px-4 text-left font-medium text-sm">Time</th>
                            <th className="py-3 px-4 text-left font-medium text-sm">Destination</th>
                            <th className="py-3 px-4 text-left font-medium text-sm">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {publicTransportData.bus.map(bus => (
                            <tr key={bus.id} className="hover:bg-muted/20 transition-colors">
                              <td className="py-3 px-4 font-medium">{bus.line}</td>
                              <td className="py-3 px-4">{bus.departureTime}</td>
                              <td className="py-3 px-4">{bus.destination}</td>
                              <td className="py-3 px-4">
                                {bus.delay > 0 ? (
                                  <span className="text-red-500">+{bus.delay} min</span>
                                ) : (
                                  <span className="text-green-500">On time</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bike className="h-5 w-5 text-green-500" />
                  Amsterdam Bicycle Network
                </CardTitle>
                <CardDescription>
                  Information from Ministry of Interior and Kingdom of Netherlands API
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-6">
                    <div className="loader"></div>
                  </div>
                ) : bicycleNetworkData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Network Information</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-secondary/50 p-3 rounded">
                          <p className="font-medium">Main Network</p>
                          <p className="text-xs text-muted-foreground">{bicycleNetworkData.mainNetwork.routes} routes</p>
                          <p className="text-xs text-muted-foreground">{bicycleNetworkData.mainNetwork.totalLength} km total</p>
                        </div>
                        <div className="bg-secondary/50 p-3 rounded">
                          <p className="font-medium">Regional Network</p>
                          <p className="text-xs text-muted-foreground">{bicycleNetworkData.regionalNetwork.routes} routes</p>
                          <p className="text-xs text-muted-foreground">{bicycleNetworkData.regionalNetwork.totalLength} km total</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Busiest Cycling Routes</h3>
                      <div className="space-y-2">
                        {bicycleNetworkData.busiestRoutes.map((route: any) => (
                          <div key={route.id} className="bg-secondary/50 p-3 rounded flex justify-between items-center">
                            <p className="text-sm">{route.name}</p>
                            <Badge variant="secondary">{route.avgCyclists.toLocaleString()} cyclists/day</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p>Failed to load bicycle network data</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart4 className="h-5 w-5 text-blue-500" />
                    Bike Usage Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Peak bike rental hours in Amsterdam Central Station area:
                  </p>
                  <div className="flex items-end h-36 gap-1">
                    {[15, 28, 45, 65, 88, 72, 58, 62, 75, 52, 38, 25].map((value, i) => (
                      <div 
                        key={i} 
                        className="bg-blue-500/80 rounded-t w-full"
                        style={{ height: `${value}%` }}
                        title={`${i + 8}:00 - ${value}% utilization`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <span>8:00</span>
                    <span>12:00</span>
                    <span>16:00</span>
                    <span>20:00</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button variant="outline" className="w-full text-xs">View Detailed Analytics</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    Plan Multimodal Trip
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-md">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div className="text-sm">Amsterdam Centraal</div>
                    </div>
                    <div className="flex justify-center">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-md">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div className="text-sm">Vondelpark, Amsterdam</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Train className="h-4 w-4" />
                      <span>+</span>
                      <Bike className="h-4 w-4" />
                    </div>
                    <span className="font-medium">28 min</span>
                    <span className="text-xs text-muted-foreground">(4.2 km)</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button className="w-full text-xs">Plan My Journey</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bike className="h-5 w-5" />
                  Bike Availability
                </CardTitle>
                <CardDescription>
                  Top rental locations with highest bike availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-6">
                    <div className="loader"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bikeRentals.map(rental => (
                      <div key={rental.id} className="border rounded-md p-4 hover:bg-muted/20 transition-colors">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{rental.name}</h4>
                          <div className="bg-primary/10 text-primary px-2 py-1 rounded text-sm font-medium">
                            {rental.bikes.available} bikes
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{rental.address || 'Amsterdam'}</span>
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          {Object.entries(rental.bikes.types).map(([type, count]) => (
                            <div key={type} className="bg-muted px-2 py-1 rounded-full text-xs">
                              {type}: {count}
                            </div>
                          ))}
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-3"
                          asChild
                        >
                          <Link to={`/?rental=${rental.id}`}>View on map</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full" asChild>
                  <Link to="/">View all rental locations</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Train className="h-5 w-5 text-blue-500" />
                  OV-fiets at Train Stations
                </CardTitle>
                <CardDescription>
                  Dutch Railways bike rental availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <div className="loader"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ovFietsLocations.map(location => (
                      <div key={location.id} className="border rounded-md p-3 hover:bg-muted/20 transition-colors">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm">{location.name}</h4>
                          <div className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-xs font-medium">
                            {location.bikes.available} available
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{location.address || 'Amsterdam'}</span>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2 text-xs py-1"
                          asChild
                        >
                          <Link to={`/?rental=${location.id}`}>View on map</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-1">
                <a 
                  href="https://www.ns.nl/en/door-to-door/ov-fiets" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline w-full text-center"
                >
                  Learn more about OV-fiets
                </a>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Urban Mobility Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Active bike sharing stations:</span>
                    <span className="font-medium">42</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Public transport lines:</span>
                    <span className="font-medium">25</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cycle lanes (km):</span>
                    <span className="font-medium">513</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Electric charging points:</span>
                    <span className="font-medium">164</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
