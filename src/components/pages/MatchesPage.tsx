import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { AISkillMatches } from '@/entities';
import { Image } from '@/components/ui/image';
import { Search, Sparkles, Zap, TrendingUp, ArrowRight, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

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

export default function MatchesPage() {
  const [matches, setMatches] = useState<AISkillMatches[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<AISkillMatches[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'confidence'>('confidence');

  useEffect(() => {
    const fetchMatches = async () => {
      const { items } = await BaseCrudService.getAll<AISkillMatches>('aiskillmatches');
      setMatches(items);
      setFilteredMatches(items);
    };
    fetchMatches();
  }, []);

  useEffect(() => {
    let filtered = matches;

    if (searchTerm) {
      filtered = filtered.filter(
        (match) =>
          match.matchTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.userOneDisplayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.userTwoDisplayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.offeredSkillName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.requestedSkillName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.matchExplanation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort based on selection
    if (sortBy === 'confidence') {
      filtered.sort((a, b) => (b.matchConfidenceScore || 0) - (a.matchConfidenceScore || 0));
    } else {
      filtered.sort((a, b) => {
        const dateA = a.matchGenerationDate ? new Date(a.matchGenerationDate).getTime() : 0;
        const dateB = b.matchGenerationDate ? new Date(b.matchGenerationDate).getTime() : 0;
        return dateB - dateA;
      });
    }

    setFilteredMatches(filtered);
  }, [searchTerm, matches, sortBy]);

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
              AI-Powered Matching
            </div>
            <h1 className="font-heading text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Perfect Skill<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">
                Exchange Matches
              </span>
            </h1>
            <p className="font-paragraph text-lg text-textprimary/60 max-w-2xl">
              Our advanced AI analyzes profiles to create intelligent skill exchange partnerships. Discover perfect matches based on complementary skills and mutual learning goals.
            </p>
          </motion.div>

          {/* Search & Sort */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-textprimary/40" />
                <Input
                  type="text"
                  placeholder="Search matches by users, skills, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-3 text-base border border-textprimary/20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="flex gap-2 w-full lg:w-auto">
                <button
                  onClick={() => setSortBy('confidence')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
                    sortBy === 'confidence'
                      ? 'bg-textprimary text-background'
                      : 'border border-textprimary/20 text-textprimary hover:border-primary'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  Best Match
                </button>
                <button
                  onClick={() => setSortBy('recent')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
                    sortBy === 'recent'
                      ? 'bg-textprimary text-background'
                      : 'border border-textprimary/20 text-textprimary hover:border-primary'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Recent
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-mono text-xs text-textprimary/50">
                {filteredMatches.length} of {matches.length} matches
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Matches Grid */}
      <section className="w-full py-24 bg-background">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          {filteredMatches.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-2">No matches found</h3>
              <p className="font-paragraph text-textprimary/60 max-w-md mx-auto">
                Try adjusting your search to find skill exchange matches
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              {filteredMatches.map((match, i) => (
                <Reveal key={match._id} delay={i * 0.05}>
                  <Link to={`/matches/${match._id}`} className="group h-full">
                    <motion.div
                      whileHover={{ y: -8 }}
                      className="h-full bg-white border border-black/10 rounded-lg overflow-hidden hover:border-primary hover:shadow-[8px_8px_0px_0px_rgba(216,64,14,0.1)] transition-all duration-300"
                    >
                      {/* Header with Confidence Badge */}
                      <div className="relative p-6 lg:p-8 border-b border-black/5 bg-gradient-to-r from-primary/5 to-transparent">
                        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-white border border-primary rounded-full">
                          <Zap className="w-4 h-4 text-primary" />
                          <span className="font-bold text-sm text-primary">
                            {match.matchConfidenceScore}%
                          </span>
                        </div>

                        <h3 className="font-heading text-xl lg:text-2xl font-bold text-textprimary group-hover:text-primary transition-colors pr-24">
                          {match.matchTitle}
                        </h3>
                      </div>

                      {/* Users Section */}
                      <div className="p-6 lg:p-8">
                        <div className="flex items-center justify-between gap-4 mb-8">
                          {/* User 1 */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="relative w-14 h-14 overflow-hidden rounded-full border-2 border-black/10 group-hover:border-primary transition-colors">
                                {match.userOneProfilePicture ? (
                                  <Image
                                    src={match.userOneProfilePicture}
                                    alt={match.userOneDisplayName || 'User'}
                                    width={56}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                                    <span className="font-heading text-lg text-textprimary/40">
                                      {match.userOneDisplayName?.charAt(0).toUpperCase() || '?'}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-heading font-bold text-textprimary truncate">
                                  {match.userOneDisplayName}
                                </p>
                                <p className="font-mono text-xs text-primary">OFFERING</p>
                              </div>
                            </div>
                            <p className="font-paragraph font-bold text-lg text-textprimary ml-17">
                              {match.offeredSkillName}
                            </p>
                          </div>

                          {/* Connector */}
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-px h-8 bg-primary/20 group-hover:bg-primary transition-colors" />
                            <div className="p-2 border border-primary/20 rounded-full group-hover:bg-primary group-hover:text-white transition-all">
                              <Sparkles className="w-5 h-5" />
                            </div>
                            <div className="w-px h-8 bg-primary/20 group-hover:bg-primary transition-colors" />
                          </div>

                          {/* User 2 */}
                          <div className="flex-1 text-right">
                            <div className="flex items-center justify-end gap-3 mb-3">
                              <div className="min-w-0">
                                <p className="font-heading font-bold text-textprimary truncate">
                                  {match.userTwoDisplayName}
                                </p>
                                <p className="font-mono text-xs text-primary">SEEKING</p>
                              </div>
                              <div className="relative w-14 h-14 overflow-hidden rounded-full border-2 border-black/10 group-hover:border-primary transition-colors">
                                {match.userTwoProfilePicture ? (
                                  <Image
                                    src={match.userTwoProfilePicture}
                                    alt={match.userTwoDisplayName || 'User'}
                                    width={56}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                                    <span className="font-heading text-lg text-textprimary/40">
                                      {match.userTwoDisplayName?.charAt(0).toUpperCase() || '?'}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="font-paragraph font-bold text-lg text-textprimary">
                              {match.requestedSkillName}
                            </p>
                          </div>
                        </div>

                        {/* Match Explanation */}
                        {match.matchExplanation && (
                          <div className="pt-6 border-t border-black/5">
                            <p className="font-mono text-sm text-textprimary/60 mb-4">
                              <span className="text-primary mr-2">{'>'} ANALYSIS:</span>
                            </p>
                            <p className="font-paragraph text-sm text-textprimary/70 leading-relaxed">
                              {match.matchExplanation}
                            </p>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="mt-6 pt-6 border-t border-black/5 flex items-center justify-between">
                          <span className="text-xs font-bold text-primary group-hover:underline">
                            VIEW DETAILS
                          </span>
                          <ArrowRight className="w-4 h-4 text-textprimary/30 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </Reveal>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="w-full py-24 bg-secondary text-secondary-foreground border-t border-white/10">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-8">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6">
              How AI Matching Works
            </h2>
            <p className="font-paragraph text-lg text-secondary-foreground/70 mb-12 leading-relaxed">
              Our intelligent matching algorithm analyzes user profiles, skill offerings, and learning requests to identify optimal exchange partnerships. Each match includes a confidence score and detailed explanation to help you make informed decisions about potential collaborations.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
                  <span className="font-heading text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-heading font-bold mb-2">Profile Analysis</h3>
                <p className="font-paragraph text-sm text-secondary-foreground/70">
                  We analyze your skills, interests, and learning goals
                </p>
              </div>
              <div className="text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
                  <span className="font-heading text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-heading font-bold mb-2">Vector Matching</h3>
                <p className="font-paragraph text-sm text-secondary-foreground/70">
                  AI finds compatible skill exchange partners nearby
                </p>
              </div>
              <div className="text-left">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
                  <span className="font-heading text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-heading font-bold mb-2">Confidence Score</h3>
                <p className="font-paragraph text-sm text-secondary-foreground/70">
                  Get ranked matches with detailed explanations
                </p>
              </div>
            </div>

            <Link
              to="/discovery"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-colors"
            >
              Explore Community <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
