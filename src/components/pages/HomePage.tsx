// HPI 1.6-V
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { Skills, UserProfiles, AISkillMatches } from '@/entities';
import { Image } from '@/components/ui/image';
import { ArrowRight, Users, Sparkles, MapPin, MessageSquare, Terminal, Cpu, Globe, ArrowUpRight } from 'lucide-react';
import { useMember } from '@/integrations';

// --- Utility Components for Motion & Layout ---

const Reveal = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "0 0.8"] // Trigger when top of element hits 80% of viewport height
  });
  
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
};

const ParallaxText = ({ children, baseVelocity = 100 }: { children: React.ReactNode; baseVelocity?: number }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useSpring(scrollY, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(scrollVelocity, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, (v) => `${v}%`);
  const directionFactor = useRef<number>(1);

  useSpring(scrollY, { damping: 50, stiffness: 400 }).onChange((v) => {
     // Logic to handle infinite scroll direction based on scroll speed would go here
     // Simplified for stability
  });

  useEffect(() => {
    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000; // seconds
      lastTime = time;
      let moveBy = baseVelocity * delta * directionFactor.current;
      // Apply velocity from scroll
      // moveBy += directionFactor.current * moveBy * velocityFactor.get(); 
      baseX.set(baseX.get() + moveBy);
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [baseVelocity, baseX]);

  return (
    <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap">
      <motion.div style={{ x }} className="flex whitespace-nowrap flex-nowrap gap-8">
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
};

// --- Main Component ---

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useMember();
  
  // --- Data Fidelity Protocol: Canonical Data Sources ---
  const [skills, setSkills] = useState<Skills[]>([]);
  const [users, setUsers] = useState<UserProfiles[]>([]);
  const [matches, setMatches] = useState<AISkillMatches[]>([]);

  // Check onboarding status on mount
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (!onboardingCompleted && isAuthenticated) {
      navigate('/onboarding');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const [skillsData, usersData, matchesData] = await Promise.all([
        BaseCrudService.getAll<Skills>('skills'),
        BaseCrudService.getAll<UserProfiles>('userprofiles'),
        BaseCrudService.getAll<AISkillMatches>('aiskillmatches'),
      ]);
      setSkills(skillsData.items.slice(0, 6));
      setUsers(usersData.items.slice(0, 4));
      setMatches(matchesData.items.slice(0, 3));
    };
    fetchData();
  }, []);

  // --- Scroll Hooks for Parallax ---
  const { scrollYProgress } = useScroll();
  const heroGridY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const heroContentY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <div className="min-h-screen bg-background text-textprimary font-paragraph selection:bg-primary selection:text-white overflow-x-hidden">
      <Header />

      {/* --- HERO SECTION: The Grid Room --- */}
      <section className="relative w-full h-[95vh] flex items-center justify-center overflow-hidden border-b border-black/10">
        {/* 3D Grid Background */}
        <div className="absolute inset-0 perspective-1000 pointer-events-none">
          <motion.div 
            style={{ y: heroGridY }}
            className="absolute inset-[-50%] w-[200%] h-[200%] origin-center"
          >
            {/* Floor Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] [transform:rotateX(60deg)_translateZ(-100px)]" />
            
            {/* Ceiling Grid (Faint) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:8rem_8rem] [transform:rotateX(60deg)_translateZ(200px)]" />
          </motion.div>
        </div>

        {/* Floating Data Blocks (Orange Cubes) */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { top: '20%', left: '15%', w: 60, h: 60, d: 0 },
            { top: '60%', left: '80%', w: 100, h: 40, d: 0.2 },
            { top: '30%', left: '70%', w: 40, h: 40, d: 0.4 },
            { top: '75%', left: '25%', w: 80, h: 80, d: 0.1 },
            { top: '15%', left: '60%', w: 50, h: 50, d: 0.3 },
          ].map((block, i) => (
            <motion.div
              key={i}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 1.5, 
                delay: block.d, 
                ease: [0.22, 1, 0.36, 1],
                repeat: Infinity,
                repeatType: "reverse",
                repeatDelay: 2
              }}
              className="absolute bg-primary shadow-lg"
              style={{ 
                top: block.top, 
                left: block.left, 
                width: block.w, 
                height: block.h,
                boxShadow: '10px 10px 0px rgba(0,0,0,0.1)'
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <motion.div 
          style={{ y: heroContentY }}
          className="relative z-10 max-w-[100rem] w-full px-6 lg:px-12 grid lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3 py-1 border border-primary/30 bg-primary/5 text-primary text-xs font-bold tracking-widest uppercase mb-6"
            >
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              System Online // v2.0.4
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              className="font-heading text-6xl lg:text-8xl font-bold leading-[0.9] tracking-tight text-textprimary mb-8"
            >
              SKILL<br/>
              EXCHANGE<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">PROTOCOL</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-paragraph text-lg lg:text-xl text-textprimary/60 max-w-2xl mb-10 leading-relaxed border-l-2 border-primary pl-6"
            >
              Decentralized local knowledge transfer facilitated by advanced AI matching algorithms. Connect, learn, and collaborate in real-time.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <Link 
                to="/discovery" 
                className="group relative px-8 py-4 bg-textprimary text-background font-bold text-sm uppercase tracking-wider overflow-hidden hover:bg-primary transition-colors duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {'{ Explore Now }'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link 
                to="/matches" 
                className="group px-8 py-4 border border-textprimary text-textprimary font-bold text-sm uppercase tracking-wider hover:bg-textprimary/5 transition-colors duration-300"
              >
                <span className="flex items-center gap-2">
                  AI Matches
                </span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Decorative Corner Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 border-l border-t border-black/20 m-8" />
        <div className="absolute bottom-0 right-0 w-32 h-32 border-r border-b border-black/20 m-8" />
      </section>

      {/* --- MARQUEE SECTION: Live Data Stream --- */}
      <section className="w-full border-b border-black/10 bg-secondary text-secondary-foreground py-4 overflow-hidden">
        <ParallaxText baseVelocity={-2}>
          <span className="text-sm font-mono mx-4 text-primary">/// LIVE MATCHING ACTIVE</span>
          <span className="text-sm font-mono mx-4">SKILL_SWAP_DAEMON_RUNNING</span>
          <span className="text-sm font-mono mx-4 text-primary">/// NEW NODES DETECTED</span>
          <span className="text-sm font-mono mx-4">OPTIMIZING_LOCAL_CONNECTIONS</span>
          <span className="text-sm font-mono mx-4 text-primary">/// AI_CONFIDENCE_98%</span>
          <span className="text-sm font-mono mx-4">EXCHANGE_PROTOCOL_READY</span>
        </ParallaxText>
      </section>

      {/* --- AI MATCHING PROCESSOR --- */}
      <section className="w-full py-24 lg:py-32 bg-background relative overflow-hidden">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-16">
            {/* Left: Header & Explanation */}
            <div className="lg:col-span-4 sticky top-24 self-start">
              <Reveal>
                <div className="flex items-center gap-2 text-primary mb-4">
                  <Cpu className="w-5 h-5" />
                  <span className="font-mono text-xs uppercase tracking-widest">AI Core Processing</span>
                </div>
                <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Intelligent<br/>Matchmaking<br/>Engine
                </h2>
                <p className="font-paragraph text-textprimary/60 mb-8 leading-relaxed">
                  Our proprietary algorithms analyze skill vectors, location data, and user availability to generate high-confidence exchange opportunities.
                </p>
                <div className="p-6 bg-secondary/5 border border-secondary/10 rounded-sm">
                  <div className="flex justify-between items-center mb-2 font-mono text-xs text-textprimary/50">
                    <span>SYSTEM STATUS</span>
                    <span className="text-green-600">ONLINE</span>
                  </div>
                  <div className="w-full bg-secondary/10 h-1 mb-4">
                    <motion.div 
                      initial={{ width: "0%" }}
                      whileInView={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-full bg-primary"
                    />
                  </div>
                  <div className="space-y-2 font-mono text-xs text-textprimary">
                    <div className="flex justify-between">
                      <span>{'>'} Analyzing profiles...</span>
                      <span>DONE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{'>'} Calculating vectors...</span>
                      <span>DONE</span>
                    </div>
                    <div className="flex justify-between text-primary">
                      <span>{'>'} Matches found:</span>
                      <span>{matches.length}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right: The Matches Grid */}
            <div className="lg:col-span-8">
              <div className="grid gap-6">
                {matches.map((match, i) => (
                  <Reveal key={match._id} delay={i * 0.1}>
                    <Link to={`/matches/${match._id}`} className="group block">
                      <div className="relative bg-white border border-black/10 p-8 hover:border-primary transition-all duration-300 hover:shadow-[8px_8px_0px_0px_rgba(216,64,14,1)]">
                        <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground px-3 py-1 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                          CONFIDENCE: {match.matchConfidenceScore}%
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                          {/* User 1 */}
                          <div className="flex-1 flex items-center gap-4">
                            <div className="relative w-16 h-16 overflow-hidden rounded-full border-2 border-black/5 group-hover:border-primary transition-colors">
                              {match.userOneProfilePicture ? (
                                <Image 
                                  src={match.userOneProfilePicture} 
                                  alt={match.userOneDisplayName || 'User'} 
                                  width={64} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-secondary/10" />
                              )}
                            </div>
                            <div>
                              <div className="text-xs font-mono text-textprimary/50 mb-1">OFFERING</div>
                              <div className="font-bold text-lg">{match.offeredSkillName}</div>
                              <div className="text-sm text-textprimary/70">{match.userOneDisplayName}</div>
                            </div>
                          </div>

                          {/* Connector */}
                          <div className="flex flex-col items-center justify-center text-primary">
                            <div className="w-px h-8 bg-primary/20 group-hover:bg-primary transition-colors" />
                            <div className="p-2 border border-primary/20 rounded-full group-hover:bg-primary group-hover:text-white transition-all">
                              <Sparkles className="w-5 h-5" />
                            </div>
                            <div className="w-px h-8 bg-primary/20 group-hover:bg-primary transition-colors" />
                          </div>

                          {/* User 2 */}
                          <div className="flex-1 flex items-center gap-4 md:flex-row-reverse md:text-right">
                            <div className="relative w-16 h-16 overflow-hidden rounded-full border-2 border-black/5 group-hover:border-primary transition-colors">
                              {match.userTwoProfilePicture ? (
                                <Image 
                                  src={match.userTwoProfilePicture} 
                                  alt={match.userTwoDisplayName || 'User'} 
                                  width={64} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-secondary/10" />
                              )}
                            </div>
                            <div>
                              <div className="text-xs font-mono text-textprimary/50 mb-1">REQUESTING</div>
                              <div className="font-bold text-lg">{match.requestedSkillName}</div>
                              <div className="text-sm text-textprimary/70">{match.userTwoDisplayName}</div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-black/5">
                          <p className="font-mono text-sm text-textprimary/60">
                            <span className="text-primary mr-2">{'>'} ANALYSIS:</span>
                            {match.matchExplanation}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
              
              <div className="mt-12 text-right">
                <Link to="/matches" className="inline-flex items-center gap-2 text-primary font-bold hover:underline decoration-2 underline-offset-4">
                  VIEW ALL MATCH VECTORS <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SKILL MATRIX SECTION --- */}
      <section className="w-full py-24 bg-secondary text-secondary-foreground relative">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:2rem_2rem]" />
        
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/20 pb-8">
            <div>
              <h2 className="font-heading text-4xl lg:text-6xl font-bold mb-4">SKILL_MATRIX</h2>
              <p className="font-mono text-sm text-secondary-foreground/60 max-w-md">
                Browse available knowledge modules. Select a node to initiate transfer protocol.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-right font-mono text-xs text-primary mb-1">DATABASE_SIZE: {skills.length}</div>
              <div className="w-32 h-1 bg-white/10">
                <div className="w-2/3 h-full bg-primary" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/20 border border-white/20">
            {skills.map((skill, i) => (
              <Reveal key={skill._id} delay={i * 0.05} className="bg-secondary group relative overflow-hidden h-full">
                <Link to={`/skills/${skill._id}`} className="block h-full p-8 hover:bg-white/5 transition-colors duration-300">
                  <div className="flex justify-between items-start mb-8">
                    <span className="font-mono text-xs text-primary border border-primary/30 px-2 py-1">
                      {skill.category || 'UNCATEGORIZED'}
                    </span>
                    <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-primary transition-colors" />
                  </div>
                  
                  <div className="mb-6 relative aspect-video overflow-hidden bg-white/5 grayscale group-hover:grayscale-0 transition-all duration-500">
                    {skill.skillImage ? (
                      <Image 
                        src={skill.skillImage} 
                        alt={skill.skillName || 'Skill'} 
                        width={400} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10">
                        <Terminal className="w-12 h-12" />
                      </div>
                    )}
                    {/* Overlay Scan Effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 ease-in-out" />
                  </div>

                  <h3 className="font-heading text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {skill.skillName}
                  </h3>
                  <p className="font-paragraph text-sm text-secondary-foreground/60 line-clamp-2 mb-4">
                    {skill.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                    <span>DIFFICULTY:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div 
                          key={level} 
                          className={`w-1 h-3 ${
                            // Simple logic to map difficulty string to 1-5 scale visually
                            level <= (skill.difficultyLevel === 'Expert' ? 5 : skill.difficultyLevel === 'Advanced' ? 4 : skill.difficultyLevel === 'Intermediate' ? 3 : 2) 
                            ? 'bg-primary' 
                            : 'bg-white/10'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link 
              to="/skills" 
              className="px-8 py-4 border border-white/20 text-white font-mono text-sm hover:bg-white hover:text-black transition-colors duration-300"
            >
              [ LOAD_MORE_MODULES ]
            </Link>
          </div>
        </div>
      </section>

      {/* --- COMMUNITY NODES SECTION --- */}
      <section className="w-full py-24 bg-background overflow-hidden">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <Reveal>
                <div className="flex items-center gap-2 text-primary mb-4">
                  <Globe className="w-5 h-5" />
                  <span className="font-mono text-xs uppercase tracking-widest">Global Network</span>
                </div>
                <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6">
                  Active Nodes<br/>Detected
                </h2>
                <p className="font-paragraph text-textprimary/60 mb-8">
                  Our community is a decentralized network of experts and learners. Each node represents a unique combination of skills and needs.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-secondary/5 border-l-2 border-primary">
                    <div className="text-2xl font-bold font-heading">2.4k+</div>
                    <div className="text-xs font-mono text-textprimary/50">ACTIVE USERS</div>
                  </div>
                  <div className="p-4 bg-secondary/5 border-l-2 border-primary">
                    <div className="text-2xl font-bold font-heading">150+</div>
                    <div className="text-xs font-mono text-textprimary/50">CITIES</div>
                  </div>
                </div>

                <Link 
                  to="/users" 
                  className="inline-flex items-center gap-2 font-bold text-lg hover:text-primary transition-colors"
                >
                  <span className="border-b-2 border-primary">Explore The Network</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {users.map((user, i) => (
                  <Reveal key={user._id} delay={i * 0.1}>
                    <Link to={`/users/${user._id}`} className="group block relative">
                      <div className="absolute inset-0 bg-primary translate-x-2 translate-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative bg-white border border-black p-6 hover:-translate-y-1 hover:-translate-x-1 transition-transform duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <div className="relative w-16 h-16 overflow-hidden rounded-full border border-black">
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
                        
                        <h3 className="font-heading text-xl font-bold mb-1">{user.userName}</h3>
                        <div className="flex items-center gap-1 text-xs text-textprimary/50 mb-4 font-mono">
                          <MapPin className="w-3 h-3" />
                          {user.city || 'Unknown Location'}
                        </div>
                        
                        <p className="font-paragraph text-sm text-textprimary/70 line-clamp-2 mb-4 h-10">
                          {user.bio || 'No bio available.'}
                        </p>

                        <div className="pt-4 border-t border-black/5 flex justify-between items-center">
                          <span className="text-xs font-bold text-primary group-hover:underline">VIEW PROFILE</span>
                          <MessageSquare className="w-4 h-4 text-black/20 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA / TERMINAL SECTION --- */}
      <section className="w-full py-24 bg-secondary text-secondary-foreground border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <div className="inline-block mb-8 p-4 border border-primary/50 bg-primary/10 rounded-sm">
              <Terminal className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="font-mono text-xs text-primary">TERMINAL_ACCESS_GRANTED</p>
            </div>
            
            <h2 className="font-heading text-5xl lg:text-7xl font-bold mb-8">
              READY TO<br/>
              <span className="text-primary">EXCHANGE?</span>
            </h2>
            
            <p className="font-paragraph text-lg text-secondary-foreground/60 mb-12 max-w-2xl mx-auto">
              Initialize your profile to begin the matching process. The network is waiting for your input.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link 
                to="/contact" 
                className="px-8 py-4 bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                {'{ START_PROTOCOL }'}
              </Link>
              <Link 
                to="/locations" 
                className="px-8 py-4 border border-white/20 text-white font-bold text-lg hover:bg-white hover:text-black transition-colors"
              >
                LOCATE_NODES
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}