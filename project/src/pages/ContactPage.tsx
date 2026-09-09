import { useState } from 'react';
import { Mail, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setStatus('sending');
    setErrorMsg('');

    const mailtoLink = `mailto:contact@apexlens.photo?subject=${encodeURIComponent(
      `${subject || 'Portfolio Inquiry'} — from ${name}`
    )}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    )}`;

    window.location.href = mailtoLink;

    setTimeout(() => {
      setStatus('sent');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(212,175,55,0.3) 0%, transparent 60%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          <h1 className="font-display text-5xl leading-none tracking-wide text-white md:text-7xl">
            GET IN <span className="text-gold-400">TOUCH</span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg font-body text-base font-light leading-relaxed text-gray-300">
            For bookings, event coverage, editorial assignments, or print inquiries — I'd love to hear from you.
          </p>
          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
        </div>
      </section>

      {/* Contact info + form */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Info column */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10">
                  <Mail className="h-5 w-5 text-gold-400" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl tracking-wide text-gold-400">EMAIL</h3>
              </div>
              <a
                href="mailto:contact@apexlens.photo"
                className="mt-3 block font-body text-base text-gray-300 transition-colors hover:text-gold-400"
              >
                contact@apexlens.photo
              </a>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-400/30 bg-gold-400/10">
                  <MapPin className="h-5 w-5 text-gold-400" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl tracking-wide text-gold-400">LOCATION</h3>
              </div>
              <p className="mt-3 font-body text-base font-light text-gray-300">
                Available worldwide<br />Travel-ready for any circuit
              </p>
            </div>

            <div className="border-t border-white/10 pt-8">
              <p className="font-body text-sm font-light leading-relaxed text-gray-500">
                Typical response time is within 48 hours. For urgent race-weekend coverage, please mention the event and date in your message.
              </p>
            </div>
          </div>

          {/* Form column */}
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-8">
            {status === 'sent' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-gold-400" strokeWidth={1.5} />
                <h3 className="mt-4 font-display text-2xl tracking-wide text-white">MESSAGE READY</h3>
                <p className="mt-2 font-body text-sm text-gray-400">
                  Your email client should have opened with your message. If not, email me directly at contact@apexlens.photo
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 font-body text-sm text-gold-400 transition-colors hover:text-gold-300"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block font-body text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-md border border-white/10 bg-black/50 px-4 py-3 font-body text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-gold-400/50"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-body text-xs font-medium uppercase tracking-wider text-gray-500">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-md border border-white/10 bg-black/50 px-4 py-3 font-body text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-gold-400/50"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-body text-xs font-medium uppercase tracking-wider text-gray-500">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-md border border-white/10 bg-black/50 px-4 py-3 font-body text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-gold-400/50"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-body text-xs font-medium uppercase tracking-wider text-gray-500">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="w-full resize-none rounded-md border border-white/10 bg-black/50 px-4 py-3 font-body text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-gold-400/50"
                    placeholder="Tell me about your project, event, or inquiry..."
                  />
                </div>

                {status === 'error' && (
                  <p className="font-body text-sm text-red-400">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-gold-400 px-6 py-3 font-body text-sm font-semibold text-black transition-all hover:bg-gold-300 disabled:opacity-50"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Opening email...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
