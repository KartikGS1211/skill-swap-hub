import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Skills } from '@/entities';
import { Image } from '@/components/ui/image';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skills[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skills[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<string[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      const { items } = await BaseCrudService.getAll<Skills>('skills');
      setSkills(items);
      setFilteredSkills(items);

      const uniqueCategories = Array.from(
        new Set(items.map((s) => s.category).filter(Boolean))
      ) as string[];
      setCategories(uniqueCategories);

      const uniqueDifficulties = Array.from(
        new Set(items.map((s) => s.difficultyLevel).filter(Boolean))
      ) as string[];
      setDifficulties(uniqueDifficulties);
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    let filtered = skills;

    if (searchTerm) {
      filtered = filtered.filter(
        (skill) =>
          skill.skillName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          skill.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          skill.keywords?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((skill) => skill.category === categoryFilter);
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter((skill) => skill.difficultyLevel === difficultyFilter);
    }

    setFilteredSkills(filtered);
  }, [searchTerm, categoryFilter, difficultyFilter, skills]);

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
              Skills Directory
            </h1>
            <p className="font-paragraph text-base lg:text-lg text-secondary-foreground/70">
              Explore the diverse range of skills available for exchange in our community. From technical expertise to creative talents, find what you need.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="w-full bg-background border-b border-textprimary/10 py-8">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textprimary/40" size={20} />
              <Input
                type="text"
                placeholder="Search skills by name, description, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-paragraph text-sm border-textprimary/20 focus:border-primary"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-textprimary/60" />
                <span className="font-paragraph text-sm text-textprimary/60">Filters:</span>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`font-paragraph text-sm px-4 py-2 transition-colors ${
                    categoryFilter === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-textprimary/20 text-textprimary hover:border-primary'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`font-paragraph text-sm px-4 py-2 transition-colors ${
                      categoryFilter === category
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-textprimary/20 text-textprimary hover:border-primary'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Difficulty Filter */}
              {difficulties.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setDifficultyFilter('all')}
                    className={`font-paragraph text-sm px-4 py-2 transition-colors ${
                      difficultyFilter === 'all'
                        ? 'bg-secondary text-secondary-foreground'
                        : 'border border-textprimary/20 text-textprimary hover:border-primary'
                    }`}
                  >
                    All Levels
                  </button>
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => setDifficultyFilter(difficulty)}
                      className={`font-paragraph text-sm px-4 py-2 transition-colors ${
                        difficultyFilter === difficulty
                          ? 'bg-secondary text-secondary-foreground'
                          : 'border border-textprimary/20 text-textprimary hover:border-primary'
                      }`}
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <p className="font-paragraph text-sm text-textprimary/60">
              Showing {filteredSkills.length} of {skills.length} skills
            </p>
          </div>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="w-full bg-background py-16">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          {filteredSkills.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-paragraph text-base text-textprimary/60">
                No skills found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((skill, i) => (
                <motion.div
                  key={skill._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.5) }}
                >
                  <Link
                    to={`/skills/${skill._id}`}
                    className="block border border-textprimary/10 hover:border-primary transition-colors overflow-hidden group h-full flex flex-col"
                  >
                    {skill.skillImage && (
                      <div className="aspect-video overflow-hidden">
                        <Image
                          src={skill.skillImage}
                          alt={skill.skillName || 'Skill'}
                          width={600}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        {skill.category && (
                          <span className="font-paragraph text-xs text-primary">
                            {skill.category}
                          </span>
                        )}
                        {skill.difficultyLevel && (
                          <>
                            <span className="text-textprimary/30">•</span>
                            <span className="font-paragraph text-xs text-textprimary/50">
                              {skill.difficultyLevel}
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="font-heading text-xl font-semibold text-textprimary mb-3">
                        {skill.skillName}
                      </h3>

                      {skill.description && (
                        <p className="font-paragraph text-sm text-textprimary/70 line-clamp-3 mb-4 flex-1">
                          {skill.description}
                        </p>
                      )}

                      {skill.keywords && (
                        <div className="mt-auto pt-4 border-t border-textprimary/10">
                          <p className="font-paragraph text-xs text-textprimary/50">
                            {skill.keywords}
                          </p>
                        </div>
                      )}
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
