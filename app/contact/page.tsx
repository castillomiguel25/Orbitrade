'use client';

import { useIntl } from 'react-intl';
import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const intl = useIntl();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const channels = [
    {
      title: intl.formatMessage({ id: 'contact.channel.missionControl.title' }),
      description: intl.formatMessage({ id: 'contact.channel.missionControl.desc' }),
      handle: '@OrbiTrade_Control',
      color: '#13f187',
    },
    {
      title: intl.formatMessage({ id: 'contact.channel.businessConsortium.title' }),
      description: intl.formatMessage({ id: 'contact.channel.businessConsortium.desc' }),
      handle: '@OrbiTrade_Business',
      color: '#00f5ff',
    },
    {
      title: intl.formatMessage({ id: 'contact.channel.technicalSupport.title' }),
      description: intl.formatMessage({ id: 'contact.channel.technicalSupport.desc' }),
      handle: '@OrbiTrade_Tech',
      color: '#dc95e6',
    }
  ];

  const inputStyle = {
    background: 'rgba(15, 15, 20, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const inputFocusClass = 'focus:outline-none focus:ring-1 focus:ring-miner-green/50 focus:border-miner-green/30';

  return (
    <div className="min-h-screen bg-void-black relative overflow-hidden">
      {/* Background - matching landing */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f1a] via-[#0a1510] to-void-black" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[150px] opacity-10"
          style={{ background: 'radial-gradient(circle, #13f187 0%, transparent 70%)', top: '15%', left: '20%' }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[120px] opacity-8"
          style={{ background: 'radial-gradient(circle, #dc95e6 0%, transparent 70%)', bottom: '10%', right: '15%' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 max-w-5xl">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-mono text-cosmic-gray mb-12">
          <Link href="/" className="text-miner-green hover:text-miner-green/80 transition-colors">
            ORBITRADE
          </Link>
          <span className="text-cosmic-gray/40">/</span>
          <span className="text-star-white">
            {intl.formatMessage({ id: 'contact.breadcrumb' })}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-16">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-wider">
            <span className="text-star-white">{intl.formatMessage({ id: 'contact.header.title' })}</span>
          </h1>
          <p className="text-lg text-cosmic-gray font-body leading-relaxed max-w-2xl">
            {intl.formatMessage({ id: 'contact.header.subtitle' })}
          </p>
        </div>

        {/* Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {channels.map((channel, index) => (
            <div
              key={index}
              className="rounded-xl p-6 transition-all duration-300 hover:translate-y-[-2px]"
              style={{
                background: 'rgba(15, 15, 20, 0.6)',
                border: `1px solid ${channel.color}15`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ background: channel.color }} />
                <h3 className="font-display text-sm font-bold tracking-wider" style={{ color: channel.color }}>
                  {channel.title}
                </h3>
              </div>
              <p className="text-cosmic-gray text-sm font-body leading-relaxed mb-4">
                {channel.description}
              </p>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-xs"
                style={{ background: `${channel.color}10`, color: channel.color }}
              >
                {channel.handle}
              </div>
            </div>
          ))}
        </div>

        {/* Form + Stats grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

          {/* Form */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{
                background: 'rgba(15, 15, 20, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <h2 className="font-display text-xl font-bold text-star-white tracking-wide mb-6">
                {intl.formatMessage({ id: 'contact.form.title' })}
              </h2>

              {submitted && (
                <div
                  className="rounded-lg p-4 mb-6 text-sm font-mono"
                  style={{ background: 'rgba(19, 241, 135, 0.08)', border: '1px solid rgba(19, 241, 135, 0.2)', color: '#13f187' }}
                >
                  Message sent successfully. We will respond shortly.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono text-cosmic-gray uppercase tracking-wider mb-2">
                      {intl.formatMessage({ id: 'contact.form.name' })}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg text-star-white text-sm font-body placeholder:text-cosmic-gray/40 transition-all duration-200 ${inputFocusClass}`}
                      style={inputStyle}
                      placeholder={intl.formatMessage({ id: 'contact.form.placeholder.name' })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-cosmic-gray uppercase tracking-wider mb-2">
                      {intl.formatMessage({ id: 'contact.form.email' })}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg text-star-white text-sm font-body placeholder:text-cosmic-gray/40 transition-all duration-200 ${inputFocusClass}`}
                      style={inputStyle}
                      placeholder={intl.formatMessage({ id: 'contact.form.placeholder.email' })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-cosmic-gray uppercase tracking-wider mb-2">
                    {intl.formatMessage({ id: 'contact.form.subject' })}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg text-star-white text-sm font-body placeholder:text-cosmic-gray/40 transition-all duration-200 ${inputFocusClass}`}
                    style={inputStyle}
                    placeholder={intl.formatMessage({ id: 'contact.form.placeholder.subject' })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-cosmic-gray uppercase tracking-wider mb-2">
                    {intl.formatMessage({ id: 'contact.form.message' })}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-lg text-star-white text-sm font-body placeholder:text-cosmic-gray/40 transition-all duration-200 resize-none ${inputFocusClass}`}
                    style={inputStyle}
                    placeholder={intl.formatMessage({ id: 'contact.form.placeholder.message' })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-lg font-display font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #13f187 0%, #0a9f5a 100%)',
                    color: '#000201',
                  }}
                >
                  {isSubmitting
                    ? intl.formatMessage({ id: 'contact.form.sending' })
                    : intl.formatMessage({ id: 'contact.form.submit' })
                  }
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar stats */}
          <div className="space-y-5">
            {[
              { label: intl.formatMessage({ id: 'contact.stats.responseTime.label' }), value: '< 2H', color: '#13f187' },
              { label: intl.formatMessage({ id: 'contact.stats.missionSuccess.label' }), value: '98.7%', color: '#00f5ff' },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-xl p-6 text-center"
                style={{
                  background: 'rgba(15, 15, 20, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div className="font-mono text-3xl font-bold mb-2" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs font-mono text-cosmic-gray uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}

            {/* Quick links */}
            <div
              className="rounded-xl p-6"
              style={{
                background: 'rgba(15, 15, 20, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <h3 className="font-display text-sm font-bold text-star-white tracking-wider mb-4">
                {intl.formatMessage({ id: 'pages.contact.cta.title', defaultMessage: 'Quick Links' })}
              </h3>
              <div className="space-y-3">
                <Link
                  href="/terms"
                  className="flex items-center gap-2 text-sm text-cosmic-gray hover:text-miner-green transition-colors font-body"
                >
                  <span className="w-1 h-1 rounded-full bg-miner-green" />
                  {intl.formatMessage({ id: 'footer.terms', defaultMessage: 'Terms of Service' })}
                </Link>
                <Link
                  href="/privacy"
                  className="flex items-center gap-2 text-sm text-cosmic-gray hover:text-cyber-cyan transition-colors font-body"
                >
                  <span className="w-1 h-1 rounded-full bg-cyber-cyan" />
                  {intl.formatMessage({ id: 'footer.privacy', defaultMessage: 'Privacy Policy' })}
                </Link>
                <Link
                  href="/how-it-works"
                  className="flex items-center gap-2 text-sm text-cosmic-gray hover:text-plasma-pink transition-colors font-body"
                >
                  <span className="w-1 h-1 rounded-full bg-plasma-pink" />
                  {intl.formatMessage({ id: 'components.navBar.howItWorks', defaultMessage: 'How It Works' })}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
