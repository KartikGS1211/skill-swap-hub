import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { UserProfiles } from '@/entities';
import { Image } from '@/components/ui/image';
import { Search, MapPin, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfiles[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfiles[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available'>('all');

  useEffect(() => {
    const fetchUsers = async () => {
      const { items } = await BaseCrudService.getAll<UserProfiles>('userprofiles');
      setUsers(items);
      setFilteredUsers(items);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.region?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (availabilityFilter === 'available') {
      filtered = filtered.filter((user) => user.isAvailable === true);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, availabilityFilter, users]);

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
            <h1 className="font-heading text-4xl lg:text-6xl font-bold mb-6">
              Community Directory
            </h1>
            <p className="font-paragraph text-base lg:text-lg text-secondary-foreground/70">
              Browse our diverse community of skill sharers. Connect with individuals who can teach you new abilities or learn from your expertise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="w-full bg-background border-b border-textprimary/10 py-8">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textprimary/40" size={20} />
              <Input
                type="text"
                placeholder="Search users by name, location, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-paragraph text-sm border-textprimary/20 focus:border-primary"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-textprimary/60" />
                <span className="font-paragraph text-sm text-textprimary/60">Filter:</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setAvailabilityFilter('all')}
                  className={`font-paragraph text-sm px-4 py-2 transition-colors ${
                    availabilityFilter === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-textprimary/20 text-textprimary hover:border-primary'
                  }`}
                >
                  All Users
                </button>
                <button
                  onClick={() => setAvailabilityFilter('available')}
                  className={`font-paragraph text-sm px-4 py-2 transition-colors ${
                    availabilityFilter === 'available'
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-textprimary/20 text-textprimary hover:border-primary'
                  }`}
                >
                  Available Only
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="font-paragraph text-sm text-textprimary/60">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        </div>
      </section>

      {/* Users Grid */}
      <section className="w-full bg-background py-16">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-paragraph text-base text-textprimary/60">
                No users found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUsers.map((user, i) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.5) }}
                >
                  <Link
                    to={`/users/${user._id}`}
                    className="block p-6 border border-textprimary/10 hover:border-primary transition-colors h-full"
                  >
                    <div className="flex flex-col items-center text-center">
                      {user.profilePicture ? (
                        <Image
                          src={user.profilePicture}
                          alt={user.userName || 'User'}
                          width={120}
                          className="w-24 h-24 rounded-full object-cover mb-4"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-textprimary/10 mb-4 flex items-center justify-center">
                          <span className="font-heading text-2xl text-textprimary/40">
                            {user.userName?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                      )}

                      <h3 className="font-heading text-lg font-semibold text-textprimary mb-2">
                        {user.userName}
                      </h3>

                      {(user.city || user.region) && (
                        <div className="flex items-center gap-1 text-textprimary/50 mb-3">
                          <MapPin size={14} />
                          <p className="font-paragraph text-xs">
                            {[user.city, user.region].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      )}

                      {user.bio && (
                        <p className="font-paragraph text-sm text-textprimary/70 line-clamp-3 mb-4">
                          {user.bio}
                        </p>
                      )}

                      <div className="mt-auto w-full space-y-2">
                        {user.offeredSkillsSummary && (
                          <div className="text-left">
                            <p className="font-paragraph text-xs text-primary mb-1">Offers:</p>
                            <p className="font-paragraph text-xs text-textprimary/60 line-clamp-2">
                              {user.offeredSkillsSummary}
                            </p>
                          </div>
                        )}

                        {user.requestedSkillsSummary && (
                          <div className="text-left">
                            <p className="font-paragraph text-xs text-primary mb-1">Seeks:</p>
                            <p className="font-paragraph text-xs text-textprimary/60 line-clamp-2">
                              {user.requestedSkillsSummary}
                            </p>
                          </div>
                        )}

                        {user.isAvailable && (
                          <div className="pt-2">
                            <span className="inline-block font-paragraph text-xs px-3 py-1 bg-primary text-primary-foreground">
                              Available
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
