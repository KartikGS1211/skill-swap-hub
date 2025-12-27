import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Skills } from '@/entities';
import { Image } from '@/components/ui/image';
import { ArrowLeft, Tag, BarChart3 } from 'lucide-react';

export default function SkillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [skill, setSkill] = useState<Skills | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkill = async () => {
      if (!id) return;
      const skillData = await BaseCrudService.getById<Skills>('skills', id);
      setSkill(skillData);
      setLoading(false);
    };
    fetchSkill();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="font-paragraph text-base text-textprimary/60">Loading skill details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="font-paragraph text-base text-textprimary/60">Skill not found.</p>
          <Link
            to="/skills"
            className="inline-flex items-center gap-2 font-paragraph text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Skills
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
            to="/skills"
            className="inline-flex items-center gap-2 font-paragraph text-sm text-textprimary hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} /> Back to Skills
          </Link>
        </div>
      </section>

      {/* Skill Detail Section */}
      <section className="w-full bg-background py-16 lg:py-24">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {skill.skillImage ? (
                <div className="aspect-square overflow-hidden border border-textprimary/10">
                  <Image
                    src={skill.skillImage}
                    alt={skill.skillName || 'Skill'}
                    width={800}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-textprimary/5 border border-textprimary/10 flex items-center justify-center">
                  <span className="font-heading text-6xl text-textprimary/20">
                    {skill.skillName?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Right Column - Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3">
                {skill.category && (
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-primary" />
                    <span className="font-paragraph text-sm text-primary">
                      {skill.category}
                    </span>
                  </div>
                )}
                {skill.difficultyLevel && (
                  <div className="flex items-center gap-2">
                    <BarChart3 size={16} className="text-textprimary/60" />
                    <span className="font-paragraph text-sm text-textprimary/60">
                      {skill.difficultyLevel}
                    </span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="font-heading text-4xl lg:text-5xl font-bold text-textprimary">
                {skill.skillName}
              </h1>

              {/* Description */}
              {skill.description && (
                <div className="border-t border-textprimary/10 pt-6">
                  <h2 className="font-heading text-xl font-semibold text-textprimary mb-4">
                    About This Skill
                  </h2>
                  <p className="font-paragraph text-base text-textprimary/70 leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              )}

              {/* Keywords */}
              {skill.keywords && (
                <div className="border-t border-textprimary/10 pt-6">
                  <h2 className="font-heading text-xl font-semibold text-textprimary mb-4">
                    Related Keywords
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {skill.keywords.split(',').map((keyword, i) => (
                      <span
                        key={i}
                        className="font-paragraph text-xs px-3 py-1 border border-textprimary/20 text-textprimary/70"
                      >
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="border-t border-textprimary/10 pt-6">
                <div className="bg-secondary text-secondary-foreground p-6">
                  <h3 className="font-heading text-lg font-bold mb-3">
                    Interested in This Skill?
                  </h3>
                  <p className="font-paragraph text-sm text-secondary-foreground/70 mb-4">
                    Browse our community to find users who can teach this skill or are looking to learn it.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/users"
                      className="inline-flex items-center justify-center gap-2 font-paragraph text-sm px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      {'{ Find Teachers →}'}
                    </Link>
                    <Link
                      to="/matches"
                      className="inline-flex items-center justify-center gap-2 font-paragraph text-sm px-6 py-3 border border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary transition-colors"
                    >
                      {'{ View Matches }'}
                    </Link>
                  </div>
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
