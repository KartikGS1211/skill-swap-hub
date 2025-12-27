import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Zap } from 'lucide-react';
import { useMember } from '@/integrations';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { member, isAuthenticated } = useMember();
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);

  const skillCategories = [
    { id: 'tech', label: 'Tech & Programming', icon: '💻' },
    { id: 'design', label: 'Design & Creative', icon: '🎨' },
    { id: 'business', label: 'Business & Marketing', icon: '📊' },
    { id: 'language', label: 'Languages', icon: '🗣️' },
    { id: 'music', label: 'Music & Arts', icon: '🎵' },
    { id: 'fitness', label: 'Fitness & Wellness', icon: '💪' },
    { id: 'cooking', label: 'Cooking & Food', icon: '👨‍🍳' },
    { id: 'other', label: 'Other', icon: '✨' },
  ];

  const toggleInterest = (id: string) => {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleComplete = () => {
    // Store onboarding completion in localStorage
    localStorage.setItem('onboardingCompleted', 'true');
    navigate('/discovery');
  };

  // If already authenticated and onboarding is done, redirect
  if (isAuthenticated && localStorage.getItem('onboardingCompleted')) {
    navigate('/discovery');
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 text-textprimary overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#000000_1px,transparent_1px),linear-gradient(to_bottom,#000000_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-2xl"
        >
          {/* Progress indicator */}
          <motion.div variants={itemVariants} className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <span className="font-mono text-xs text-textprimary/50">STEP {step} OF 3</span>
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={`h-1 transition-all duration-300 ${
                      i <= step ? 'w-8 bg-primary' : 'w-4 bg-textprimary/10'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Step 1: Welcome */}
          {step === 1 && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <motion.div variants={itemVariants} className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/5 text-primary text-xs font-bold tracking-widest uppercase mb-6">
                  <Sparkles className="w-3 h-3" />
                  Welcome to SkillSwapAI
                </div>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="font-heading text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                Exchange Skills,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">
                  Grow Together
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="font-paragraph text-lg text-textprimary/60 mb-12 max-w-xl leading-relaxed"
              >
                Connect with learners in your community. Share your expertise, learn new skills, and build meaningful relationships through skill exchange.
              </motion.p>

              <motion.div variants={itemVariants} className="space-y-4 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold mb-1">Find Your Community</h3>
                    <p className="font-paragraph text-sm text-textprimary/60">
                      Discover thousands of learners and experts near you
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold mb-1">AI-Powered Matching</h3>
                    <p className="font-paragraph text-sm text-textprimary/60">
                      Get matched with compatible skill exchange partners instantly
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold mb-1">Learn & Share</h3>
                    <p className="font-paragraph text-sm text-textprimary/60">
                      Exchange knowledge in real-time with verified community members
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.button
                variants={itemVariants}
                onClick={() => setStep(2)}
                className="w-full px-8 py-4 bg-textprimary text-background font-bold text-lg uppercase tracking-wider hover:bg-primary transition-colors duration-300 flex items-center justify-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <motion.h2
                variants={itemVariants}
                className="font-heading text-4xl lg:text-5xl font-bold mb-4"
              >
                What interests you?
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="font-paragraph text-textprimary/60 mb-12"
              >
                Select the skills you want to learn or teach (you can change this later)
              </motion.p>

              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12"
              >
                {skillCategories.map(category => (
                  <motion.button
                    key={category.id}
                    variants={itemVariants}
                    onClick={() => toggleInterest(category.id)}
                    className={`p-6 rounded-lg border-2 transition-all duration-300 text-left group ${
                      interests.includes(category.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-textprimary/10 bg-white hover:border-primary/50'
                    }`}
                  >
                    <div className="text-3xl mb-3">{category.icon}</div>
                    <h3 className="font-heading font-bold group-hover:text-primary transition-colors">
                      {category.label}
                    </h3>
                  </motion.button>
                ))}
              </motion.div>

              <motion.div variants={itemVariants} className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-8 py-4 border border-textprimary text-textprimary font-bold text-lg uppercase tracking-wider hover:bg-textprimary/5 transition-colors duration-300"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={interests.length === 0}
                  className="flex-1 px-8 py-4 bg-textprimary text-background font-bold text-lg uppercase tracking-wider hover:bg-primary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 3: Ready to go */}
          {step === 3 && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <motion.div
                variants={itemVariants}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-8">
                  <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                </div>

                <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-4">
                  You're all set!
                </h2>

                <p className="font-paragraph text-lg text-textprimary/60 max-w-xl mx-auto mb-8">
                  Your profile is ready. Let's find your perfect skill exchange matches and start learning from the community.
                </p>

                <div className="bg-secondary/5 border border-secondary/10 rounded-lg p-8 mb-12">
                  <div className="font-mono text-sm text-textprimary/60 space-y-2">
                    <div className="flex justify-between">
                      <span>{'>'} Initializing AI matcher...</span>
                      <span className="text-green-600">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{'>'} Loading community nodes...</span>
                      <span className="text-green-600">✓</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{'>'} Analyzing skill vectors...</span>
                      <span className="text-green-600">✓</span>
                    </div>
                    <div className="flex justify-between text-primary">
                      <span>{'>'} Ready for discovery</span>
                      <span className="animate-pulse">●</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-8 py-4 border border-textprimary text-textprimary font-bold text-lg uppercase tracking-wider hover:bg-textprimary/5 transition-colors duration-300"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 px-8 py-4 bg-textprimary text-background font-bold text-lg uppercase tracking-wider hover:bg-primary transition-colors duration-300 flex items-center justify-center gap-2 group"
                >
                  Enter Platform
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
