import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { UserProfiles } from '@/entities';
import { Image } from '@/components/ui/image';
import { MapPin, ArrowLeft, Mail } from 'lucide-react';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserProfiles | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      const userData = await BaseCrudService.getById<UserProfiles>('userprofiles', id);
      setUser(userData);
      setLoading(false);
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="font-paragraph text-base text-textprimary/60">Loading user profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="font-paragraph text-base text-textprimary/60">User not found.</p>
          <Link
            to="/users"
            className="inline-flex items-center gap-2 font-paragraph text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Users
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Back Navigation */}
      <section className="w-full bg-background border-b border-textprimary/10 py-6">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <Link
            to="/users"
            className="inline-flex items-center gap-2 font-paragraph text-sm text-textprimary hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} /> Back to Users
          </Link>
        </div>
      </section>

      {/* User Profile Section */}
      <section className="w-full bg-background py-16 lg:py-24">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="border border-textprimary/10 p-8 sticky top-24">
                <div className="text-center">
                  {user.profilePicture ? (
                    <Image
                      src={user.profilePicture}
                      alt={user.userName || 'User'}
                      width={200}
                      className="w-40 h-40 rounded-full object-cover mx-auto mb-6"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-textprimary/10 mx-auto mb-6 flex items-center justify-center">
                      <span className="font-heading text-5xl text-textprimary/40">
                        {user.userName?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                  )}

                  <h1 className="font-heading text-3xl font-bold text-textprimary mb-3">
                    {user.userName}
                  </h1>

                  {(user.city || user.region) && (
                    <div className="flex items-center justify-center gap-2 text-textprimary/60 mb-4">
                      <MapPin size={16} />
                      <p className="font-paragraph text-sm">
                        {[user.city, user.region].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  )}

                  {user.isAvailable !== undefined && (
                    <div className="mb-6">
                      <span
                        className={`inline-block font-paragraph text-xs px-4 py-2 ${
                          user.isAvailable
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-textprimary/10 text-textprimary/60'
                        }`}
                      >
                        {user.isAvailable ? 'Available for Exchange' : 'Currently Unavailable'}
                      </span>
                    </div>
                  )}

                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 w-full font-paragraph text-sm px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Mail size={16} /> {'{ Contact User }'}
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Bio */}
              {user.bio && (
                <div>
                  <h2 className="font-heading text-2xl font-bold text-textprimary mb-4">
                    About
                  </h2>
                  <p className="font-paragraph text-base text-textprimary/70 leading-relaxed">
                    {user.bio}
                  </p>
                </div>
              )}

              {/* Offered Skills */}
              {user.offeredSkillsSummary && (
                <div className="border-t border-textprimary/10 pt-8">
                  <h2 className="font-heading text-2xl font-bold text-textprimary mb-4">
                    Skills I Can Offer
                  </h2>
                  <div className="bg-secondary/5 border border-textprimary/10 p-6">
                    <p className="font-paragraph text-base text-textprimary/70 leading-relaxed">
                      {user.offeredSkillsSummary}
                    </p>
                  </div>
                </div>
              )}

              {/* Requested Skills */}
              {user.requestedSkillsSummary && (
                <div className="border-t border-textprimary/10 pt-8">
                  <h2 className="font-heading text-2xl font-bold text-textprimary mb-4">
                    Skills I'm Looking For
                  </h2>
                  <div className="bg-secondary/5 border border-textprimary/10 p-6">
                    <p className="font-paragraph text-base text-textprimary/70 leading-relaxed">
                      {user.requestedSkillsSummary}
                    </p>
                  </div>
                </div>
              )}

              {/* Profile Info */}
              <div className="border-t border-textprimary/10 pt-8">
                <h2 className="font-heading text-2xl font-bold text-textprimary mb-4">
                  Profile Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {user._createdDate && (
                    <div>
                      <p className="font-paragraph text-xs text-primary mb-1">Member Since</p>
                      <p className="font-paragraph text-sm text-textprimary">
                        {new Date(user._createdDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                  {user._updatedDate && (
                    <div>
                      <p className="font-paragraph text-xs text-primary mb-1">Last Updated</p>
                      <p className="font-paragraph text-sm text-textprimary">
                        {new Date(user._updatedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="border-t border-textprimary/10 pt-8">
                <div className="bg-secondary text-secondary-foreground p-8">
                  <h3 className="font-heading text-xl font-bold mb-3">
                    Interested in Connecting?
                  </h3>
                  <p className="font-paragraph text-sm text-secondary-foreground/70 mb-6">
                    Reach out to {user.userName} to discuss potential skill exchanges and collaboration opportunities.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 font-paragraph text-sm px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Mail size={16} /> {'{ Send Message →}'}
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
