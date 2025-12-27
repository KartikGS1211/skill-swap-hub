import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { AISkillMatches } from '@/entities';
import { Image } from '@/components/ui/image';
import { Search, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function MatchesPage() {
  const [matches, setMatches] = useState<AISkillMatches[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<AISkillMatches[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      const { items } = await BaseCrudService.getAll<AISkillMatches>('aiskillmatches');
      const sortedItems = items.sort((a, b) => {
        const dateA = a.matchGenerationDate ? new Date(a.matchGenerationDate).getTime() : 0;
        const dateB = b.matchGenerationDate ? new Date(b.matchGenerationDate).getTime() : 0;
        return dateB - dateA;
      });
      setMatches(sortedItems);
      setFilteredMatches(sortedItems);
    };
    fetchMatches();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = matches.filter(
        (match) =>
          match.matchTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.userOneDisplayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.userTwoDisplayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.offeredSkillName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.requestedSkillName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          match.matchExplanation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMatches(filtered);
    } else {
      setFilteredMatches(matches);
    }
  }, [searchTerm, matches]);

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
              <Sparkles size={32} className="text-primary" />
              <h1 className="font-heading text-4xl lg:text-6xl font-bold">
                AI Skill Matches
              </h1>
            </div>
            <p className="font-paragraph text-base lg:text-lg text-secondary-foreground/70">
              Our advanced AI analyzes user profiles to create intelligent skill exchange matches. Discover perfect partnerships based on complementary skills and mutual learning goals.
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
                placeholder="Search matches by users, skills, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-paragraph text-sm border-textprimary/20 focus:border-primary"
              />
            </div>

            <div>
              <p className="font-paragraph text-sm text-textprimary/60">
                Showing {filteredMatches.length} of {matches.length} matches
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Matches Grid */}
      <section className="w-full bg-background py-16">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          {filteredMatches.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-paragraph text-base text-textprimary/60">
                No matches found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {filteredMatches.map((match, i) => (
                <motion.div
                  key={match._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.5) }}
                >
                  <Link
                    to={`/matches/${match._id}`}
                    className="block p-6 lg:p-8 border border-textprimary/10 hover:border-primary transition-colors h-full"
                  >
                    {/* Users */}
                    <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-textprimary/10">
                      <div className="flex items-center gap-3 flex-1">
                        {match.userOneProfilePicture ? (
                          <Image
                            src={match.userOneProfilePicture}
                            alt={match.userOneDisplayName || 'User'}
                            width={56}
                            className="w-14 h-14 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-textprimary/10 flex items-center justify-center">
                            <span className="font-heading text-lg text-textprimary/40">
                              {match.userOneDisplayName?.charAt(0).toUpperCase() || '?'}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-paragraph text-sm font-semibold text-textprimary truncate">
                            {match.userOneDisplayName}
                          </p>
                          <p className="font-paragraph text-xs text-primary truncate">
                            Offers: {match.offeredSkillName}
                          </p>
                        </div>
                      </div>

                      <div className="text-primary text-2xl">⇄</div>

                      <div className="flex items-center gap-3 flex-1 justify-end">
                        <div className="flex-1 min-w-0 text-right">
                          <p className="font-paragraph text-sm font-semibold text-textprimary truncate">
                            {match.userTwoDisplayName}
                          </p>
                          <p className="font-paragraph text-xs text-primary truncate">
                            Seeks: {match.requestedSkillName}
                          </p>
                        </div>
                        {match.userTwoProfilePicture ? (
                          <Image
                            src={match.userTwoProfilePicture}
                            alt={match.userTwoDisplayName || 'User'}
                            width={56}
                            className="w-14 h-14 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-textprimary/10 flex items-center justify-center">
                            <span className="font-heading text-lg text-textprimary/40">
                              {match.userTwoDisplayName?.charAt(0).toUpperCase() || '?'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Match Details */}
                    <div className="space-y-4">
                      <h3 className="font-heading text-xl font-semibold text-textprimary">
                        {match.matchTitle}
                      </h3>

                      {/* Confidence Score */}
                      {match.matchConfidenceScore !== undefined && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-paragraph text-xs text-textprimary/60">
                              Match Confidence
                            </span>
                            <span className="font-paragraph text-xs font-semibold text-primary">
                              {match.matchConfidenceScore}%
                            </span>
                          </div>
                          <div className="h-2 bg-textprimary/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-500"
                              style={{ width: `${match.matchConfidenceScore}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Explanation */}
                      {match.matchExplanation && (
                        <p className="font-paragraph text-sm text-textprimary/70 leading-relaxed">
                          {match.matchExplanation}
                        </p>
                      )}

                      {/* Date */}
                      {match.matchGenerationDate && (
                        <p className="font-paragraph text-xs text-textprimary/50 pt-4 border-t border-textprimary/10">
                          Generated on{' '}
                          {new Date(match.matchGenerationDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  </Link>
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
            <Sparkles size={48} className="text-primary mx-auto mb-6" />
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-6">
              How AI Matching Works
            </h2>
            <p className="font-paragraph text-base text-secondary-foreground/70 mb-8 leading-relaxed">
              Our intelligent matching algorithm analyzes user profiles, skill offerings, and learning requests to identify optimal exchange partnerships. Each match includes a confidence score and detailed explanation to help you make informed decisions about potential collaborations.
            </p>
            <Link
              to="/users"
              className="inline-flex items-center gap-2 font-paragraph text-sm px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {'{ Browse Community →}'}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
