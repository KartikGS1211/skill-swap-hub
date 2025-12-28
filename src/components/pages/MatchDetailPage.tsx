import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMember } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { AISkillMatches, ChatConversations } from '@/entities';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, TrendingUp, Calendar, MessageCircle } from 'lucide-react';

export default function MatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { member } = useMember();
  const navigate = useNavigate();
  const [match, setMatch] = useState<AISkillMatches | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [existingConversation, setExistingConversation] = useState<ChatConversations | null>(null);

  useEffect(() => {
    const fetchMatch = async () => {
      if (!id) return;
      const matchData = await BaseCrudService.getById<AISkillMatches>('aiskillmatches', id);
      setMatch(matchData);

      // Check if conversation already exists
      if (member?._id) {
        const { items } = await BaseCrudService.getAll<ChatConversations>('chatconversations');
        const existing = items.find(
          (conv) =>
            conv.matchId === id &&
            ((conv.participantOneId === member._id && conv.participantTwoId === matchData?.userTwoDisplayName) ||
              (conv.participantTwoId === member._id && conv.participantOneId === matchData?.userOneDisplayName))
        );
        if (existing) {
          setExistingConversation(existing);
        }
      }

      setLoading(false);
    };
    fetchMatch();
  }, [id, member?._id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="font-paragraph text-base text-textprimary/60">Loading match details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="font-paragraph text-base text-textprimary/60">Match not found.</p>
          <Link
            to="/matches"
            className="inline-flex items-center gap-2 font-paragraph text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Matches
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
            to="/matches"
            className="inline-flex items-center gap-2 font-paragraph text-sm text-textprimary hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} /> Back to Matches
          </Link>
        </div>
      </section>

      {/* Match Detail Section */}
      <section className="w-full bg-background py-16 lg:py-24">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles size={32} className="text-primary" />
                <h1 className="font-heading text-3xl lg:text-5xl font-bold text-textprimary">
                  {match.matchTitle}
                </h1>
              </div>
              {match.matchGenerationDate && (
                <div className="flex items-center justify-center gap-2 text-textprimary/60">
                  <Calendar size={16} />
                  <p className="font-paragraph text-sm">
                    Generated on{' '}
                    {new Date(match.matchGenerationDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Users Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid md:grid-cols-2 gap-8 mb-12"
            >
              {/* User One */}
              <div className="p-8 border border-textprimary/10">
                <div className="text-center">
                  {match.userOneProfilePicture ? (
                    <Image
                      src={match.userOneProfilePicture}
                      alt={match.userOneDisplayName || 'User'}
                      width={120}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-textprimary/10 mx-auto mb-4 flex items-center justify-center">
                      <span className="font-heading text-3xl text-textprimary/40">
                        {match.userOneDisplayName?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                  <h3 className="font-heading text-xl font-semibold text-textprimary mb-2">
                    {match.userOneDisplayName}
                  </h3>
                  <div className="mt-4 pt-4 border-t border-textprimary/10">
                    <p className="font-paragraph text-xs text-primary mb-2">Offers</p>
                    <p className="font-paragraph text-sm text-textprimary font-semibold">
                      {match.offeredSkillName}
                    </p>
                  </div>
                </div>
              </div>

              {/* User Two */}
              <div className="p-8 border border-textprimary/10">
                <div className="text-center">
                  {match.userTwoProfilePicture ? (
                    <Image
                      src={match.userTwoProfilePicture}
                      alt={match.userTwoDisplayName || 'User'}
                      width={120}
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-textprimary/10 mx-auto mb-4 flex items-center justify-center">
                      <span className="font-heading text-3xl text-textprimary/40">
                        {match.userTwoDisplayName?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                  <h3 className="font-heading text-xl font-semibold text-textprimary mb-2">
                    {match.userTwoDisplayName}
                  </h3>
                  <div className="mt-4 pt-4 border-t border-textprimary/10">
                    <p className="font-paragraph text-xs text-primary mb-2">Seeks</p>
                    <p className="font-paragraph text-sm text-textprimary font-semibold">
                      {match.requestedSkillName}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Match Confidence */}
            {match.matchConfidenceScore !== undefined && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-12 p-8 bg-secondary text-secondary-foreground"
              >
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp size={24} className="text-primary" />
                  <h2 className="font-heading text-2xl font-bold">Match Confidence Score</h2>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-4 bg-darkbackground rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-1000"
                      style={{ width: `${match.matchConfidenceScore}%` }}
                    />
                  </div>
                  <span className="font-heading text-3xl font-bold text-primary">
                    {match.matchConfidenceScore}%
                  </span>
                </div>
                <p className="font-paragraph text-sm text-secondary-foreground/70 mt-4">
                  This score represents the AI's confidence in the compatibility of this skill exchange match based on user profiles and preferences.
                </p>
              </motion.div>
            )}

            {/* Match Explanation */}
            {match.matchExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-12"
              >
                <h2 className="font-heading text-2xl font-bold text-textprimary mb-4">
                  Why This Match Works
                </h2>
                <div className="p-8 border border-textprimary/10 bg-textprimary/5">
                  <p className="font-paragraph text-base text-textprimary/70 leading-relaxed">
                    {match.matchExplanation}
                  </p>
                </div>
              </motion.div>
            )}

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-secondary text-secondary-foreground p-8 text-center"
            >
              <h3 className="font-heading text-2xl font-bold mb-4">
                Ready to Connect?
              </h3>
              <p className="font-paragraph text-base text-secondary-foreground/70 mb-6 max-w-2xl mx-auto">
                This AI-generated match suggests a strong potential for mutual benefit. Reach out to explore this skill exchange opportunity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {existingConversation ? (
                  <Button
                    onClick={() => navigate(`/chat/${existingConversation._id}`)}
                    className="inline-flex items-center justify-center gap-2 font-paragraph text-sm px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <MessageCircle size={16} />
                    {'{ Continue Chat →}'}
                  </Button>
                ) : (
                  <Button
                    onClick={async () => {
                      if (!member?._id) {
                        navigate('/profile');
                        return;
                      }
                      setConnecting(true);
                      try {
                        // Create new conversation
                        const conversation: ChatConversations = {
                          _id: crypto.randomUUID(),
                          participantOneId: member._id,
                          participantTwoId: match?.userTwoDisplayName || '',
                          matchId: id,
                          status: 'active',
                          createdAt: new Date(),
                          lastMessageAt: new Date(),
                          participantOneContactShared: false,
                          participantTwoContactShared: false,
                        };

                        await BaseCrudService.create('chatconversations', conversation);
                        navigate(`/chat/${conversation._id}`);
                      } catch (error) {
                        console.error('Error creating conversation:', error);
                      } finally {
                        setConnecting(false);
                      }
                    }}
                    disabled={connecting}
                    className="inline-flex items-center justify-center gap-2 font-paragraph text-sm px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <MessageCircle size={16} />
                    {connecting ? 'Connecting...' : '{ Connect & Chat →}'}
                  </Button>
                )}
                <Link
                  to="/matches"
                  className="inline-flex items-center justify-center gap-2 font-paragraph text-sm px-6 py-3 border border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary transition-colors"
                >
                  {'{ View More Matches }'}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
