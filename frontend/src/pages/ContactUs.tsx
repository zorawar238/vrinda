import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

export function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Mock API call
    setTimeout(() => {
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 min-h-screen animate-fade-in">
      <div className="mb-20 text-center">
        <h1 className="text-5xl md:text-7xl font-display tracking-wide mb-6">
          Hit Us Up
        </h1>
        <p className="font-sans text-xs tracking-widest uppercase text-foreground/50">
          Questions? Collabs? We're all ears.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 md:gap-24">
        {/* Contact Info */}
        <div className="space-y-12">
          <div className="border border-foreground/10 bg-background/50 p-10 md:p-14">
            <h2 className="text-3xl font-display tracking-wide mb-10 border-b border-foreground/10 pb-4">
              Get In Touch
            </h2>
            
            <div className="space-y-10">
              <div className="flex items-center gap-6 group">
                <div className="text-foreground/50 group-hover:text-primary transition-colors">
                  <Mail className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-foreground/50 mb-1">Email</p>
                  <a href="mailto:hello@vrinda.com" className="font-sans text-sm tracking-wide hover:text-primary transition-colors">hello@vrinda.com</a>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="text-foreground/50 group-hover:text-primary transition-colors">
                  <Phone className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-foreground/50 mb-1">Phone</p>
                  <a href="tel:+919876543210" className="font-sans text-sm tracking-wide hover:text-primary transition-colors">+91 98765 43210</a>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="text-foreground/50 group-hover:text-primary transition-colors">
                  <MapPin className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-sans text-xs tracking-widest uppercase text-foreground/50 mb-1">HQ</p>
                  <p className="font-sans text-sm tracking-wide">Cyber Hub, Gurugram, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="border border-foreground/10 bg-background/50 p-10 md:p-14">
          <h2 className="text-sm font-sans tracking-widest uppercase text-foreground/50 mb-10">Send a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-3">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-b border-foreground/30 py-3 bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors placeholder-foreground/20"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-3">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-foreground/30 py-3 bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors placeholder-foreground/20"
                placeholder="Your email"
              />
            </div>
            
            <div>
              <label className="block font-sans text-xs tracking-widest uppercase text-foreground/50 mb-3">Message</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full border-b border-foreground/30 py-3 bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors placeholder-foreground/20 resize-none"
                placeholder="What's on your mind?"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full flex items-center justify-center gap-4 bg-foreground text-background font-sans text-xs tracking-widest uppercase py-4 hover:bg-primary transition-colors disabled:opacity-50 mt-8"
            >
              {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent!' : (
                <>
                   Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
