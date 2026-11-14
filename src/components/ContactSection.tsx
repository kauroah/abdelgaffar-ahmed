import React, { useState } from 'react';
import { Mail, Send, Phone, MapPin, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { PROFILE_DATA } from '../data/portfolioData';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Job Opportunity / Technical Role',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim() || isSending) return;

    setIsSending(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || 'Could not send message via SMTP. You can email ahmedabdelhady0246@gmail.com directly.');
        return;
      }

      setSubmitted(true);
    } catch {
      setErrorMsg('Network error while sending message. Please try again or email ahmedabdelhady0246@gmail.com directly.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 border-t border-[var(--border)] bg-[var(--background)]">
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        
        {/* Avinash-style Header */}
        <div className="text-center mb-12">
          <p className="text-xs tracking-widest text-[var(--muted)] font-semibold uppercase mb-2">
            GET IN TOUCH
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal text-[var(--foreground)] tracking-tight">
            Let's <span className="animated-text-gradient italic">Connect</span>
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-[var(--muted)] max-w-2xl mx-auto mt-3">
            Open for Flutter &amp; Applied AI engineering roles, intelligent mobile apps, and voice/RAG systems consultations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Direct Communication Channels */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Telegram Card */}
            <a
              href={PROFILE_DATA.contact.telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--muted)] transition-all flex items-start gap-4 shadow-md hover:shadow-xl group"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0 text-sky-500">
                <Send className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                    Instant Messenger
                  </span>
                  <span className="text-xs font-mono text-sky-500 group-hover:translate-x-0.5 transition-transform">
                    @xrotw &rarr;
                  </span>
                </div>
                <div className="text-base font-serif font-normal text-[var(--foreground)] mt-0.5">
                  Telegram Direct Message
                </div>
                <div className="text-xs text-[var(--muted)] mt-1">
                  Active daily for technical conversations and quick calls.
                </div>
              </div>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${PROFILE_DATA.contact.email}`}
              className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--muted)] transition-all flex items-start gap-4 shadow-md hover:shadow-xl group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 text-indigo-500">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Email
                </div>
                <div className="text-sm font-mono font-medium text-[var(--foreground)] mt-0.5">
                  {PROFILE_DATA.contact.email}
                </div>
              </div>
            </a>

            {/* Phone Card */}
            <div className="p-5 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] flex items-start gap-4 shadow-md">
              <div className="w-10 h-10 rounded-xl bg-[var(--surface)] flex items-center justify-center shrink-0 text-[var(--muted)]">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider">
                  Phone (Moscow, Russia)
                </div>
                <div className="text-sm font-mono font-medium text-[var(--foreground)] mt-0.5">
                  {PROFILE_DATA.contact.phone}
                </div>
                <div className="text-xs text-[var(--muted)] mt-1">
                  Available for phone calls and WhatsApp.
                </div>
              </div>
            </div>

            {/* Location & Work Authorization */}
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--muted)] space-y-1.5">
              <div className="flex items-center gap-2 font-medium text-[var(--foreground)]">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span>Location & Work Authorization</span>
              </div>
              <div>Residing in: <strong className="text-[var(--foreground)]">{PROFILE_DATA.location}</strong></div>
              <div>Citizenship: Egypt & Russia · Full work permit in Russian Federation.</div>
              <div>Work formats: Remote, Hybrid, or On-site in Moscow.</div>
            </div>

          </div>

          {/* Right Column: Direct Note Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] p-6 sm:p-8 shadow-md">
              
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto text-emerald-500">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-normal text-[var(--foreground)]">
                    Message Sent Successfully
                  </h3>
                  <p className="text-sm text-[var(--muted)] max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-[var(--foreground)]">{formData.name}</strong>. Your message has been received. You can also ping directly on Telegram at <a href={PROFILE_DATA.contact.telegramUrl} target="_blank" rel="noreferrer" className="text-sky-500 underline font-mono">@xrotw</a>.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: 'Job Opportunity / Technical Role', message: '' });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium text-[var(--foreground)] bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-hover)] rounded-full transition-colors cursor-pointer"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-serif font-normal text-[var(--foreground)]">
                    Send a Direct Note
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={80}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alexey Ivanov"
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-neutral-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        maxLength={254}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alexey@company.com"
                        className="w-full px-4 py-2.5 text-xs rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-neutral-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                      Inquiry Topic
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    >
                      <option value="Job Opportunity / Technical Role">Flutter &amp; Applied AI Engineering Role</option>
                      <option value="Mobile / Flutter Architecture">Flutter Mobile Application</option>
                      <option value="AI / RAG Integration">Applied AI / Voice Agent / RAG System</option>
                      <option value="Distributed Java Architecture">Full-Stack / Backend API Collaboration</option>
                      <option value="General Technical Inquiry">Other Collaboration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--muted)] mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      maxLength={4000}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about your team, system requirements, or project scope..."
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-neutral-400 resize-none"
                    />
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <span>{errorMsg}</span>{' '}
                        <a
                          href={`mailto:${PROFILE_DATA.contact.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(formData.message)}`}
                          className="underline font-medium"
                        >
                          Open in mail app &rarr;
                        </a>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3 px-6 text-xs font-medium text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-full hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending via SMTP...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
