import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BaseCrudService } from '@/integrations';
import { ContactSubmissions } from '@/entities';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    subject: '',
    messageContent: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submission: ContactSubmissions = {
      _id: crypto.randomUUID(),
      senderName: formData.senderName,
      senderEmail: formData.senderEmail,
      subject: formData.subject,
      messageContent: formData.messageContent,
      submissionDateTime: new Date().toISOString(),
      status: 'pending',
    };

    await BaseCrudService.create('contactsubmissions', submission);

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({
      senderName: '',
      senderEmail: '',
      subject: '',
      messageContent: '',
    });

    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

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
              <Mail size={32} className="text-primary" />
              <h1 className="font-heading text-4xl lg:text-6xl font-bold">
                Get in Touch
              </h1>
            </div>
            <p className="font-paragraph text-base lg:text-lg text-secondary-foreground/70">
              Have questions about skill exchange? Want to suggest a feature or report an issue? We're here to help. Send us a message and we'll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="w-full bg-background py-16 lg:py-24">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="border border-textprimary/10 p-8 lg:p-12">
                <h2 className="font-heading text-2xl font-bold text-textprimary mb-6">
                  Send Us a Message
                </h2>

                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-primary/10 border border-primary flex items-center gap-3"
                  >
                    <CheckCircle size={20} className="text-primary" />
                    <p className="font-paragraph text-sm text-textprimary">
                      Thank you! Your message has been sent successfully.
                    </p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="senderName" className="block font-paragraph text-sm text-textprimary mb-2">
                      Your Name *
                    </label>
                    <Input
                      type="text"
                      id="senderName"
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleChange}
                      required
                      className="font-paragraph text-sm border-textprimary/20 focus:border-primary"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="senderEmail" className="block font-paragraph text-sm text-textprimary mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      id="senderEmail"
                      name="senderEmail"
                      value={formData.senderEmail}
                      onChange={handleChange}
                      required
                      className="font-paragraph text-sm border-textprimary/20 focus:border-primary"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block font-paragraph text-sm text-textprimary mb-2">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="font-paragraph text-sm border-textprimary/20 focus:border-primary"
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div>
                    <label htmlFor="messageContent" className="block font-paragraph text-sm text-textprimary mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="messageContent"
                      name="messageContent"
                      value={formData.messageContent}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="font-paragraph text-sm border-textprimary/20 focus:border-primary resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full font-paragraph text-sm px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        {'{ Send Message →}'}
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-heading text-2xl font-bold text-textprimary mb-6">
                  Why Contact Us?
                </h2>
                <div className="space-y-4">
                  <div className="p-6 border border-textprimary/10">
                    <h3 className="font-heading text-lg font-semibold text-textprimary mb-2">
                      General Inquiries
                    </h3>
                    <p className="font-paragraph text-sm text-textprimary/70">
                      Questions about how the platform works, skill exchange best practices, or community guidelines.
                    </p>
                  </div>

                  <div className="p-6 border border-textprimary/10">
                    <h3 className="font-heading text-lg font-semibold text-textprimary mb-2">
                      Technical Support
                    </h3>
                    <p className="font-paragraph text-sm text-textprimary/70">
                      Experiencing issues with the platform? Report bugs or request technical assistance.
                    </p>
                  </div>

                  <div className="p-6 border border-textprimary/10">
                    <h3 className="font-heading text-lg font-semibold text-textprimary mb-2">
                      Feature Suggestions
                    </h3>
                    <p className="font-paragraph text-sm text-textprimary/70">
                      Have ideas for new features or improvements? We'd love to hear your feedback.
                    </p>
                  </div>

                  <div className="p-6 border border-textprimary/10">
                    <h3 className="font-heading text-lg font-semibold text-textprimary mb-2">
                      Partnership Opportunities
                    </h3>
                    <p className="font-paragraph text-sm text-textprimary/70">
                      Interested in partnering with SkillSwapAI? Let's discuss collaboration possibilities.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-secondary text-secondary-foreground p-8">
                <h3 className="font-heading text-xl font-bold mb-4">
                  Response Time
                </h3>
                <p className="font-paragraph text-sm text-secondary-foreground/70 mb-4">
                  We typically respond to all inquiries within 24-48 hours during business days. For urgent matters, please indicate so in your subject line.
                </p>
                <p className="font-paragraph text-xs text-secondary-foreground/50">
                  All submissions are reviewed by our team and handled with confidentiality.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
