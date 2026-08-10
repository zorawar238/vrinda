import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-6 py-24 min-h-screen">
      <div className="mb-16 border-b-8 border-foreground pb-6">
        <h1 className="text-6xl md:text-8xl font-display font-bold uppercase tracking-tighter">
          Hit Us Up
        </h1>
        <p className="text-2xl font-bold uppercase mt-4 text-primary">
          Questions? Collabs? We're all ears.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div className="space-y-12">
          <div className="bg-foreground text-background p-12 border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(233,69,96,1)]">
            <h2 className="text-4xl font-display font-bold uppercase mb-8 border-b-4 border-background/20 pb-4">
              Get In Touch
            </h2>
            
            <div className="space-y-8 text-xl font-bold uppercase">
              <div className="flex items-center gap-6 group">
                <div className="bg-primary p-4 border-4 border-background group-hover:-translate-y-1 transition-transform">
                  <Mail className="w-8 h-8 text-foreground" />
                </div>
                <div>
                  <p className="text-background/60 text-sm">Email</p>
                  <a href="mailto:hello@vrinda.com" className="hover:text-primary transition-colors">hello@vrinda.com</a>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="bg-primary p-4 border-4 border-background group-hover:-translate-y-1 transition-transform">
                  <Phone className="w-8 h-8 text-foreground" />
                </div>
                <div>
                  <p className="text-background/60 text-sm">Phone</p>
                  <a href="tel:+919876543210" className="hover:text-primary transition-colors">+91 98765 43210</a>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="bg-primary p-4 border-4 border-background group-hover:-translate-y-1 transition-transform">
                  <MapPin className="w-8 h-8 text-foreground" />
                </div>
                <div>
                  <p className="text-background/60 text-sm">HQ</p>
                  <p>Cyber Hub, Gurugram, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-background border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(17,17,17,1)] p-8 md:p-12">
          <h2 className="text-3xl font-bold uppercase mb-8">Send a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xl font-bold uppercase mb-2">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-secondary/10 border-4 border-foreground p-4 font-bold outline-none focus:border-primary transition-colors uppercase"
                placeholder="YOUR NAME"
              />
            </div>
            
            <div>
              <label className="block text-xl font-bold uppercase mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary/10 border-4 border-foreground p-4 font-bold outline-none focus:border-primary transition-colors uppercase"
                placeholder="YOUR EMAIL"
              />
            </div>
            
            <div>
              <label className="block text-xl font-bold uppercase mb-2">Message</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full bg-secondary/10 border-4 border-foreground p-4 font-bold outline-none focus:border-primary transition-colors uppercase resize-none"
                placeholder="WHAT'S ON YOUR MIND?"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full flex items-center justify-center gap-4 bg-primary text-background font-bold text-xl uppercase px-8 py-5 border-4 border-foreground shadow-[6px_6px_0px_0px_rgba(17,17,17,1)] hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {status === 'sending' ? 'Sending...' : status === 'success' ? 'Message Sent!' : (
                <>
                  <Send className="w-6 h-6" /> Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
