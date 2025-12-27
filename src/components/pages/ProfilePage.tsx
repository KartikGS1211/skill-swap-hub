import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useMember } from '@/integrations';
import { Image } from '@/components/ui/image';
import { User, Mail, Calendar, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { member } = useMember();

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
              <User size={32} className="text-primary" />
              <h1 className="font-heading text-4xl lg:text-6xl font-bold">
                My Profile
              </h1>
            </div>
            <p className="font-paragraph text-base lg:text-lg text-secondary-foreground/70">
              Manage your account information and preferences for skill exchange.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="w-full bg-background py-16 lg:py-24">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-1"
              >
                <div className="border border-textprimary/10 p-8 text-center">
                  {member?.profile?.photo?.url ? (
                    <Image
                      src={member.profile.photo.url}
                      alt={member.profile.nickname || 'Profile'}
                      width={160}
                      className="w-32 h-32 rounded-full object-cover mx-auto mb-6"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-textprimary/10 mx-auto mb-6 flex items-center justify-center">
                      <User size={48} className="text-textprimary/40" />
                    </div>
                  )}

                  <h2 className="font-heading text-2xl font-bold text-textprimary mb-2">
                    {member?.profile?.nickname || member?.contact?.firstName || 'User'}
                  </h2>

                  {member?.profile?.title && (
                    <p className="font-paragraph text-sm text-textprimary/60 mb-4">
                      {member.profile.title}
                    </p>
                  )}

                  {member?.status && (
                    <div className="mb-4">
                      <span
                        className={`inline-block font-paragraph text-xs px-4 py-2 ${
                          member.status === 'APPROVED'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-textprimary/10 text-textprimary/60'
                        }`}
                      >
                        {member.status}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Profile Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2 space-y-6"
              >
                {/* Contact Information */}
                <div className="border border-textprimary/10 p-8">
                  <h3 className="font-heading text-xl font-bold text-textprimary mb-6 flex items-center gap-2">
                    <Mail size={20} className="text-primary" />
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    {member?.loginEmail && (
                      <div>
                        <p className="font-paragraph text-xs text-primary mb-1">Email</p>
                        <p className="font-paragraph text-sm text-textprimary">
                          {member.loginEmail}
                        </p>
                        {member.loginEmailVerified && (
                          <p className="font-paragraph text-xs text-textprimary/50 mt-1">
                            ✓ Verified
                          </p>
                        )}
                      </div>
                    )}

                    {member?.contact?.firstName && (
                      <div>
                        <p className="font-paragraph text-xs text-primary mb-1">First Name</p>
                        <p className="font-paragraph text-sm text-textprimary">
                          {member.contact.firstName}
                        </p>
                      </div>
                    )}

                    {member?.contact?.lastName && (
                      <div>
                        <p className="font-paragraph text-xs text-primary mb-1">Last Name</p>
                        <p className="font-paragraph text-sm text-textprimary">
                          {member.contact.lastName}
                        </p>
                      </div>
                    )}

                    {member?.contact?.phones && member.contact.phones.length > 0 && (
                      <div>
                        <p className="font-paragraph text-xs text-primary mb-1">Phone</p>
                        <p className="font-paragraph text-sm text-textprimary">
                          {member.contact.phones.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Information */}
                <div className="border border-textprimary/10 p-8">
                  <h3 className="font-heading text-xl font-bold text-textprimary mb-6 flex items-center gap-2">
                    <Calendar size={20} className="text-primary" />
                    Account Information
                  </h3>
                  <div className="space-y-4">
                    {member?._createdDate && (
                      <div>
                        <p className="font-paragraph text-xs text-primary mb-1">Member Since</p>
                        <p className="font-paragraph text-sm text-textprimary">
                          {new Date(member._createdDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    )}

                    {member?.lastLoginDate && (
                      <div>
                        <p className="font-paragraph text-xs text-primary mb-1">Last Login</p>
                        <p className="font-paragraph text-sm text-textprimary">
                          {new Date(member.lastLoginDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    )}

                    {member?._updatedDate && (
                      <div>
                        <p className="font-paragraph text-xs text-primary mb-1">Profile Updated</p>
                        <p className="font-paragraph text-sm text-textprimary">
                          {new Date(member._updatedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Privacy & Security */}
                <div className="bg-secondary text-secondary-foreground p-8">
                  <h3 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                    <Shield size={20} className="text-primary" />
                    Privacy & Security
                  </h3>
                  <p className="font-paragraph text-sm text-secondary-foreground/70 mb-4">
                    Your personal information is protected and only shared according to your privacy settings. We use industry-standard security measures to keep your data safe.
                  </p>
                  <p className="font-paragraph text-xs text-secondary-foreground/50">
                    To update your profile information or privacy settings, please contact support.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
