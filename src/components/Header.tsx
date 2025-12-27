import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useMember } from '@/integrations';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { member, isAuthenticated, isLoading, actions } = useMember();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/discovery', label: 'Discover' },
    { path: '/matches', label: 'AI Matches' },
  ];

  return (
    <header className="bg-background border-b border-textprimary/10 sticky top-0 z-50">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="font-heading text-xl lg:text-2xl font-bold text-textprimary tracking-tight">
            SkillSwap<span className="text-primary">AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-paragraph text-sm transition-colors ${
                  isActive(link.path)
                    ? 'text-primary'
                    : 'text-textprimary hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth & Mobile Menu */}
          <div className="flex items-center gap-4">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="hidden lg:flex items-center gap-4">
                    <Link
                      to="/profile"
                      className="font-paragraph text-sm text-textprimary hover:text-primary transition-colors"
                    >
                      {member?.profile?.nickname || 'Profile'}
                    </Link>
                    <button
                      onClick={actions.logout}
                      className="font-paragraph text-sm px-4 py-2 border border-textprimary text-textprimary hover:bg-textprimary hover:text-background transition-colors"
                    >
                      {'{ Logout }'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={actions.login}
                    className="hidden lg:block font-paragraph text-sm px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    {'{ Login }'}
                  </button>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-textprimary"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-textprimary/10">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-paragraph text-sm transition-colors ${
                    isActive(link.path)
                      ? 'text-primary'
                      : 'text-textprimary hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="font-paragraph text-sm text-textprimary hover:text-primary transition-colors"
                      >
                        {member?.profile?.nickname || 'Profile'}
                      </Link>
                      <button
                        onClick={() => {
                          actions.logout();
                          setMobileMenuOpen(false);
                        }}
                        className="font-paragraph text-sm px-4 py-2 border border-textprimary text-textprimary hover:bg-textprimary hover:text-background transition-colors text-left"
                      >
                        {'{ Logout }'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        actions.login();
                        setMobileMenuOpen(false);
                      }}
                      className="font-paragraph text-sm px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-left"
                    >
                      {'{ Login }'}
                    </button>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
