import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-24">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-4">
              SkillSwap<span className="text-primary">AI</span>
            </h3>
            <p className="font-paragraph text-sm text-secondary-foreground/80">
              Exchange skills locally with AI-powered matching. Connect, learn, and grow together.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-paragraph text-sm font-semibold mb-4 text-primary">
              {'{ Platform }'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/users" className="font-paragraph text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  Browse Users
                </Link>
              </li>
              <li>
                <Link to="/skills" className="font-paragraph text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  Explore Skills
                </Link>
              </li>
              <li>
                <Link to="/matches" className="font-paragraph text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  AI Matches
                </Link>
              </li>
              <li>
                <Link to="/locations" className="font-paragraph text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  Locations
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-paragraph text-sm font-semibold mb-4 text-primary">
              {'{ Resources }'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="font-paragraph text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/profile" className="font-paragraph text-sm text-secondary-foreground/80 hover:text-primary transition-colors">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-paragraph text-sm font-semibold mb-4 text-primary">
              {'{ Connect }'}
            </h4>
            <p className="font-paragraph text-sm text-secondary-foreground/80 mb-4">
              Join our community and start exchanging skills today.
            </p>
            <Link
              to="/contact"
              className="inline-block font-paragraph text-sm px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {'{ Get Started →}'}
            </Link>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-xs text-secondary-foreground/60">
              © {new Date().getFullYear()} SkillSwapAI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="font-paragraph text-xs text-secondary-foreground/60 hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="font-paragraph text-xs text-secondary-foreground/60 hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
