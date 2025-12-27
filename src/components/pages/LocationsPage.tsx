import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Locations } from '@/entities';
import { Image } from '@/components/ui/image';
import { MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function LocationsPage() {
  const [locations, setLocations] = useState<Locations[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Locations[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      const { items } = await BaseCrudService.getAll<Locations>('locations');
      setLocations(items);
      setFilteredLocations(items);
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = locations.filter(
        (location) =>
          location.locationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.stateProvince?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          location.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(locations);
    }
  }, [searchTerm, locations]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="w-full bg-secondary text-secondary-foreground py-16 lg:py-24">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <MapPin size={32} className="text-primary" />
              <h1 className="font-heading text-4xl lg:text-6xl font-bold">
                Local Skill Exchange Locations
              </h1>
            </div>
            <p className="font-paragraph text-base lg:text-lg text-secondary-foreground/70">
              Discover venues and spaces where skill exchange happens in your community. Find the perfect location for your next learning session.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="w-full bg-background border-b border-textprimary/10 py-8">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textprimary/40" size={20} />
              <Input
                type="text"
                placeholder="Search by location name, city, or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-paragraph text-sm border-textprimary/20 focus:border-primary"
              />
            </div>

            <div>
              <p className="font-paragraph text-sm text-textprimary/60">
                Showing {filteredLocations.length} of {locations.length} locations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="w-full bg-background py-16">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          {filteredLocations.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-paragraph text-base text-textprimary/60">
                No locations found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLocations.map((location, i) => (
                <motion.div
                  key={location._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.5) }}
                  className="border border-textprimary/10 hover:border-primary transition-colors overflow-hidden group"
                >
                  {location.locationImage && (
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={location.locationImage}
                        alt={location.locationName || 'Location'}
                        width={600}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-semibold text-textprimary mb-3">
                      {location.locationName}
                    </h3>

                    {(location.city || location.stateProvince || location.country) && (
                      <div className="flex items-start gap-2 mb-4">
                        <MapPin size={16} className="text-primary mt-1 flex-shrink-0" />
                        <p className="font-paragraph text-sm text-textprimary/70">
                          {[location.city, location.stateProvince, location.country]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                    )}

                    {location.description && (
                      <p className="font-paragraph text-sm text-textprimary/70 leading-relaxed mb-4">
                        {location.description}
                      </p>
                    )}

                    {(location.latitude !== undefined && location.longitude !== undefined) && (
                      <div className="pt-4 border-t border-textprimary/10">
                        <p className="font-paragraph text-xs text-textprimary/50">
                          Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="w-full bg-secondary text-secondary-foreground py-16 lg:py-24">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <MapPin size={48} className="text-primary mx-auto mb-6" />
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-6">
              Find Your Perfect Exchange Space
            </h2>
            <p className="font-paragraph text-base text-secondary-foreground/70 mb-8 leading-relaxed">
              These locations serve as community hubs for skill exchange. Whether you're looking for a quiet space for one-on-one tutoring or a collaborative environment for group learning, find the ideal setting for your next session.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 font-paragraph text-sm px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {'{ View on Map →}'}
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 font-paragraph text-sm px-6 py-3 border border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary transition-colors"
              >
                {'{ Suggest a Location }'}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
