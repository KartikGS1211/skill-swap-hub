import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Skills, UserProfiles } from '@/entities';
import { Image } from '@/components/ui/image';
import { Search, Filter, Sparkles, MapPin, Users, Zap, ArrowRight, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

const skillCategoryIcons: Record<string, string> = {
  'Tech & Programming': '💻',
  'Design & Creative': '🎨',
  'Business & Marketing': '📊',
  'Languages': '🗣️',
  'Music & Arts': '🎵',
  'Fitness & Wellness': '💪',
  'Cooking & Food': '👨‍🍳',
  'Other': '✨',
};

const Reveal = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "0 0.8"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
};

export default function DiscoveryPage() {
  const [skills, setSkills] = useState<Skills[]>([]);
  const [users, setUsers] = useState<UserProfiles[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skills[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfiles[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'skills' | 'users'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [skillsData, usersData] = await Promise.all([
        BaseCrudService.getAll<Skills>('skills'),
        BaseCrudService.getAll<UserProfiles>('userprofiles'),
      ]);
      setSkills(skillsData.items);
      setUsers(usersData.items);
      setFilteredSkills(skillsData.items);
      setFilteredUsers(usersData.items);

      const uniqueCategories = Array.from(
        new Set(skillsData.items.map((s) => s.category).filter(Boolean))
      ) as string[];
      setCategories(uniqueCategories);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filteredS = skills;
    let filteredU = users;

    if (searchTerm) {
      filteredS = filteredS.filter(
        (skill) =>
          skill.skillName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          skill.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      filteredU = filteredU.filter(
        (user) =>
          user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filteredS = filteredS.filter((skill) => skill.category === categoryFilter);
    }

    setFilteredSkills(filteredS);
    setFilteredUsers(filteredU);
  }, [searchTerm, categoryFilter, skills, users]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-background text-textprimary">
      <Header />

      {/* Hero Section */}
      <section className="w-full py-16 lg:py-24 border-b border-black/10 bg-gradient-to-br from-background to-secondary/5">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/5 text-primary text-xs font-bold tracking-widest uppercase mb-6">
              <Sparkles className="w-3 h-3" />
              Unified Discovery
            </div>
            <h1 className="font-heading text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Discover Skills<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">
                & Community
              </span>
            </h1>
            <p className="font-paragraph text-lg text-textprimary/60 max-w-2xl">
              Explore skills to learn, find mentors, and connect with learners in your area
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textprimary/40" />
              <Input
                type="text"
                placeholder="Search skills, users, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-3 text-base border border-textprimary/20 rounded-lg focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-textprimary/20 rounded-lg hover:border-primary hover:text-primary transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              {/* Tab buttons */}
              <div className="flex gap-2 ml-auto">
                {(['all', 'skills', 'users'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
                      activeTab === tab
                        ? 'bg-textprimary text-background'
                        : 'border border-textprimary/20 text-textprimary hover:border-primary'
                    }`}
                  >
                    {tab === 'all' ? 'All' : tab === 'skills' ? 'Skills' : 'Users'}
                  </button>
                ))}
              </div>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4 border-t border-textprimary/10"
              >
                <div className="space-y-3">
                  <p className="font-bold text-sm">Categories</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setCategoryFilter('all')}
                      className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${
                        categoryFilter === 'all'
                          ? 'bg-primary text-white'
                          : 'bg-textprimary/5 text-textprimary hover:bg-textprimary/10'
                      }`}
                    >
                      All
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${
                          categoryFilter === cat
                            ? 'bg-primary text-white'
                            : 'bg-textprimary/5 text-textprimary hover:bg-textprimary/10'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="w-full py-24 bg-background">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          {/* Skills Section */}
          {(activeTab === 'all' || activeTab === 'skills') && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-24"
            >
              <div className="flex items-center justify-between mb-12 pb-8 border-b border-textprimary/10">
                <div>
                  <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-2">
                    Skills to Learn
                  </h2>
                  <p className="font-paragraph text-textprimary/60">
                    {filteredSkills.length} skill{filteredSkills.length !== 1 ? 's' : ''} available
                  </p>
                </div>
                <Link
                  to="/skills"
                  className="hidden lg:flex items-center gap-2 text-primary font-bold hover:underline decoration-2 underline-offset-4"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {filteredSkills.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSkills.slice(0, 6).map((skill, i) => (
                    <Reveal key={skill._id} delay={i * 0.05} className="h-full">
                      <Link to={`/skills/${skill._id}`} className="group h-full block">
                        <motion.div
                          whileHover={{ y: -8 }}
                          className="h-full bg-white border border-black/10 rounded-lg overflow-hidden hover:border-primary hover:shadow-[8px_8px_0px_0px_rgba(216,64,14,0.1)] transition-all duration-300"
                        >
                          {/* Skill Image */}
                          <div className="relative aspect-video overflow-hidden bg-secondary/5">
                            {skill.skillImage ? (
                              <Image
                                src={skill.skillImage}
                                alt={skill.skillName || 'Skill'}
                                width={400}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-textprimary/10">
                                <Zap className="w-12 h-12" />
                              </div>
                            )}
                            {/* Category Badge */}
                            <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 bg-white/95 rounded-full border border-black/10">
                              <span className="text-lg">
                                {skillCategoryIcons[skill.category || 'Other'] || '✨'}
                              </span>
                              <span className="font-mono text-xs font-bold text-textprimary">
                                {skill.category || 'Other'}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <h3 className="font-heading text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {skill.skillName}
                            </h3>
                            <p className="font-paragraph text-sm text-textprimary/60 line-clamp-2 mb-4">
                              {skill.description}
                            </p>

                            {/* Difficulty */}
                            <div className="flex items-center gap-2 text-xs font-mono text-textprimary/50 mb-4">
                              <span>LEVEL:</span>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <div
                                    key={level}
                                    className={`w-1.5 h-3 ${
                                      level <= (skill.difficultyLevel === 'Expert' ? 5 : skill.difficultyLevel === 'Advanced' ? 4 : skill.difficultyLevel === 'Intermediate' ? 3 : 2)
                                        ? 'bg-primary'
                                        : 'bg-textprimary/10'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                              <span className="text-xs font-bold text-primary group-hover:underline">
                                EXPLORE
                              </span>
                              <ArrowRight className="w-4 h-4 text-textprimary/30 group-hover:text-primary transition-colors" />
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </Reveal>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="font-paragraph text-textprimary/60">No skills found matching your search</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Users Section */}
          {(activeTab === 'all' || activeTab === 'users') && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-12 pb-8 border-b border-textprimary/10">
                <div>
                  <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-2">
                    Community Members
                  </h2>
                  <p className="font-paragraph text-textprimary/60">
                    {filteredUsers.length} member{filteredUsers.length !== 1 ? 's' : ''} online
                  </p>
                </div>
                <Link
                  to="/users"
                  className="hidden lg:flex items-center gap-2 text-primary font-bold hover:underline decoration-2 underline-offset-4"
                >
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {filteredUsers.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredUsers.slice(0, 6).map((user, i) => (
                    <Reveal key={user._id} delay={i * 0.05}>
                      <Link to={`/users/${user._id}`} className="group h-full">
                        <motion.div
                          whileHover={{ y: -8 }}
                          className="h-full bg-white border border-black/10 rounded-lg p-6 hover:border-primary hover:shadow-[8px_8px_0px_0px_rgba(216,64,14,0.1)] transition-all duration-300"
                        >
                          {/* Header with Avatar & Status */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="relative w-16 h-16 overflow-hidden rounded-full border-2 border-black/10 group-hover:border-primary transition-colors">
                              {user.profilePicture ? (
                                <Image
                                  src={user.profilePicture}
                                  alt={user.userName || 'User'}
                                  width={64}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                                  <Users className="w-6 h-6 text-black/20" />
                                </div>
                              )}
                            </div>
                            {user.isAvailable && (
                              <span className="flex items-center gap-1 text-[10px] font-mono border border-green-600 text-green-600 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
                                ONLINE
                              </span>
                            )}
                          </div>

                          {/* User Info */}
                          <h3 className="font-heading text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                            {user.userName}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-textprimary/50 mb-4 font-mono">
                            <MapPin className="w-3 h-3" />
                            {user.city || 'Unknown Location'}
                          </div>

                          {/* Bio */}
                          <p className="font-paragraph text-sm text-textprimary/70 line-clamp-2 mb-4 h-10">
                            {user.bio || 'No bio available'}
                          </p>

                          {/* Skills Summary */}
                          {(user.offeredSkillsSummary || user.requestedSkillsSummary) && (
                            <div className="mb-4 space-y-2 text-xs">
                              {user.offeredSkillsSummary && (
                                <div className="flex items-start gap-2">
                                  <span className="font-bold text-primary flex-shrink-0">Offers:</span>
                                  <span className="text-textprimary/60 line-clamp-1">{user.offeredSkillsSummary}</span>
                                </div>
                              )}
                              {user.requestedSkillsSummary && (
                                <div className="flex items-start gap-2">
                                  <span className="font-bold text-primary flex-shrink-0">Seeks:</span>
                                  <span className="text-textprimary/60 line-clamp-1">{user.requestedSkillsSummary}</span>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                            <span className="text-xs font-bold text-primary group-hover:underline">
                              VIEW PROFILE
                            </span>
                            <ArrowRight className="w-4 h-4 text-textprimary/30 group-hover:text-primary transition-colors" />
                          </div>
                        </motion.div>
                      </Link>
                    </Reveal>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <p className="font-paragraph text-textprimary/60">No members found matching your search</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Empty State */}
          {filteredSkills.length === 0 && filteredUsers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-2">No results found</h3>
              <p className="font-paragraph text-textprimary/60 max-w-md mx-auto">
                Try adjusting your search or filters to find what you're looking for
              </p>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
