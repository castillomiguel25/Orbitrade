'use client';

import { useIntl } from 'react-intl';
import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const intl = useIntl();
  const t = (id: string) => intl.formatMessage({ id });

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setForm({ name: '', email: '', subject: '', message: '' });
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const inputClass = "w-full rounded-lg px-4 py-2.5 text-sm text-[#E6E8EC] placeholder-[#7C8AA0]/50 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-colors";
  const inputStyle = {
    background: '#0E1116',
    border: '1px solid rgba(124,138,160,0.2)',
  };

  return (
    <div className="min-h-screen" style={{ background: '#0E1116' }}>
      <div className="max-w-3xl mx-auto px-4 py-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#7C8AA0] mb-8">
          <Link href="/" className="hover:text-amber-400 transition-colors">Orbitrade</Link>
          <span>/</span>
          <span className="text-[#E6E8EC]">{t('footer.contact')}</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#E6E8EC] mb-2">
            {t('footer.contact')}
          </h1>
          <p className="text-[#7C8AA0] text-sm leading-relaxed">
            contact@orbitrade.io
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact form */}
          <div className="md:col-span-3">
            <div
              className="rounded-xl p-6 border"
              style={{ background: '#161A21', borderColor: 'rgba(124,138,160,0.12)' }}
            >
              <h2 className="text-sm font-semibold text-[#E6E8EC] mb-5">
                {t('contact.form.title')}
              </h2>

              {submitted ? (
                <div
                  className="rounded-lg p-4 text-sm text-amber-400 text-center"
                  style={{ background: 'rgba(245,165,36,0.08)', border: '1px solid rgba(245,165,36,0.2)' }}
                >
                  {t('contact.form.success')}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-[#7C8AA0] uppercase tracking-wider mb-1.5">
                        {t('contact.form.name')}
                      </label>
                      <input
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder={t('contact.form.placeholder.name')}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#7C8AA0] uppercase tracking-wider mb-1.5">
                        {t('contact.form.email')}
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder={t('contact.form.placeholder.email')}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#7C8AA0] uppercase tracking-wider mb-1.5">
                      {t('contact.form.subject')}
                    </label>
                    <input
                      name="subject"
                      required
                      value={form.subject}
                      onChange={handleChange}
                      placeholder={t('contact.form.placeholder.subject')}
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#7C8AA0] uppercase tracking-wider mb-1.5">
                      {t('contact.form.message')}
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder={t('contact.form.placeholder.message')}
                      className={`${inputClass} resize-none`}
                      style={inputStyle}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider transition-opacity disabled:opacity-50"
                    style={{ background: '#F5A524', color: '#0E1116' }}
                  >
                    {submitting ? `${t('contact.form.sending')}` : t('contact.form.submit')}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Info panel */}
          <div className="md:col-span-2 space-y-4">
            {/* Response time */}
            <div
              className="rounded-xl p-5 border"
              style={{ background: '#161A21', borderColor: 'rgba(124,138,160,0.12)' }}
            >
              <p className="text-[10px] font-semibold text-[#7C8AA0] uppercase tracking-wider mb-1">
                {t('contact.stats.responseTime.label')}
              </p>
              <p className="text-2xl font-bold text-amber-400">
                {t('contact.stats.responseTime.value')}
              </p>
              <p className="text-xs text-[#7C8AA0] mt-1">
                {t('contact.stats.responseTime.description')}
              </p>
            </div>

            {/* Direct email */}
            <div
              className="rounded-xl p-5 border"
              style={{ background: '#161A21', borderColor: 'rgba(124,138,160,0.12)' }}
            >
              <p className="text-[10px] font-semibold text-[#7C8AA0] uppercase tracking-wider mb-2">
                {t('footer.support')}
              </p>
              <a
                href="mailto:contact@orbitrade.io"
                className="text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium"
              >
                contact@orbitrade.io
              </a>
            </div>

            {/* Legal links */}
            <div
              className="rounded-xl p-5 border"
              style={{ background: '#161A21', borderColor: 'rgba(124,138,160,0.12)' }}
            >
              <p className="text-[10px] font-semibold text-[#7C8AA0] uppercase tracking-wider mb-3">
                {t('footer.legalLinks')}
              </p>
              <div className="space-y-2">
                {[
                  { href: '/terms',    label: 'footer.terms'    },
                  { href: '/privacy',  label: 'footer.privacy'  },
                  { href: '/security', label: 'footer.security' },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="block text-sm text-[#7C8AA0] hover:text-amber-400 transition-colors"
                  >
                    {t(label)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
