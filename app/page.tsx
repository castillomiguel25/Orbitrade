'use client';

import { useState, useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/navigation";
import { investmentPlans } from "./constants/investmentPlans";

// Hero Section Component - Figma Design Style
function HeroSection() {
  const router = useRouter();
  const intl = useIntl();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background - Dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1f1a] via-[#0a1510] to-void-black" />

      {/* Hero Image - Full width miners */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative w-full h-full"
          style={{
            backgroundImage: 'url(/hero-landing.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Gradient overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(10, 31, 26, 0.3) 0%, rgba(0, 2, 1, 0.7) 70%, rgba(0, 2, 1, 0.95) 100%)'
            }}
          />
        </div>
      </div>

      {/* Subtle glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[150px] opacity-20"
          style={{
            background: 'radial-gradient(circle, #13f187 0%, transparent 70%)',
            top: '10%',
            left: '20%',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-15"
          style={{
            background: 'radial-gradient(circle, #00f5ff 0%, transparent 70%)',
            top: '20%',
            right: '20%',
          }}
        />
      </div>

      {/* Content - Centered */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center mt-20">
        <div
          className={`max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          {/* Main Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-wider">
            <span className="text-star-white">{intl.formatMessage({ id: 'pages.home.hero.title.word1' })} </span>
            <span
              style={{
                background: 'linear-gradient(135deg, #13f187 0%, #00f5ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {intl.formatMessage({ id: 'pages.home.hero.title.word2' })}
            </span>
            <span className="text-star-white"> {intl.formatMessage({ id: 'pages.home.hero.title.word3' })}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-cosmic-gray max-w-2xl mx-auto mb-10 font-body leading-relaxed">
            {intl.formatMessage({ id: 'pages.home.hero.subtitle' })}{' '}
            <span className="text-miner-green font-semibold">{intl.formatMessage({ id: 'pages.home.hero.subtitle.highlight' })}</span>{' '}
            {intl.formatMessage({ id: 'pages.home.hero.subtitle.end' })}
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <button
              onClick={() => router.push('/enlist')}
              className="group px-8 py-4 rounded-lg font-display font-bold text-base tracking-wider uppercase transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #13f187 0%, #0a9f5a 100%)',
                color: '#000201',
                boxShadow: '0 0 30px rgba(19, 241, 135, 0.4)'
              }}
            >
              {intl.formatMessage({ id: 'pages.home.hero.cta.primary' })}
            </button>

            <button
              onClick={() => router.push('/access')}
              className="px-8 py-4 rounded-lg font-display font-bold text-base tracking-wider uppercase transition-all duration-300 hover:bg-white/10"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#e8e8e8',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {intl.formatMessage({ id: 'pages.home.hero.cta.secondary' })}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60"
        style={{ animation: 'bounce 2s infinite' }}
      >
        <svg className="w-6 h-6 text-miner-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

// Stats Section
function StatsSection() {
  const intl = useIntl();
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      value: intl.formatMessage({ id: 'pages.home.stats.collectors.value' }),
      label: intl.formatMessage({ id: 'pages.home.stats.collectors.label' }),
      color: '#13f187'
    },
    {
      value: intl.formatMessage({ id: 'pages.home.stats.plasma.value' }),
      label: intl.formatMessage({ id: 'pages.home.stats.plasma.label' }),
      color: '#00f5ff'
    },
    {
      value: intl.formatMessage({ id: 'pages.home.stats.species.value' }),
      label: intl.formatMessage({ id: 'pages.home.stats.species.label' }),
      color: '#dc95e6'
    },
    {
      value: intl.formatMessage({ id: 'pages.home.stats.uptime.value' }),
      label: intl.formatMessage({ id: 'pages.home.stats.uptime.label' }),
      color: '#c8ff00'
    },
  ];

  return (
    <section ref={ref} className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-void-black" />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(19, 241, 135, 0.03) 0%, transparent 50%, rgba(220, 149, 230, 0.03) 100%)'
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl transition-all duration-500"
              style={{
                background: 'rgba(15, 15, 20, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transitionDelay: `${index * 100}ms`
              }}
            >
              <div
                className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold mb-2"
                style={{ color: stat.color, textShadow: `0 0 30px ${stat.color}50` }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-cosmic-gray font-body">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// NFT Card Component
function NFTCard({
  imagePath,
  name,
  price,
  rarity,
  yield: yieldPercent,
  index,
  onClick
}: {
  imagePath: string;
  name: string;
  price: number | string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  yield: string;
  index: number;
  onClick?: () => void;
}) {
  const intl = useIntl();
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const rarityConfig = {
    common: {
      color: '#13f187',
      label: intl.formatMessage({ id: 'pages.home.collection.card.rarity.common' }),
      bg: 'rgba(19, 241, 135, 0.1)'
    },
    rare: {
      color: '#00f5ff',
      label: intl.formatMessage({ id: 'pages.home.collection.card.rarity.rare' }),
      bg: 'rgba(0, 245, 255, 0.1)'
    },
    epic: {
      color: '#dc95e6',
      label: intl.formatMessage({ id: 'pages.home.collection.card.rarity.epic' }),
      bg: 'rgba(220, 149, 230, 0.1)'
    },
    legendary: {
      color: '#c8ff00',
      label: intl.formatMessage({ id: 'pages.home.collection.card.rarity.legendary' }),
      bg: 'rgba(200, 255, 0, 0.1)'
    }
  };

  const config = rarityConfig[rarity];

  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{
        background: 'linear-gradient(180deg, rgba(15, 15, 20, 0.9) 0%, rgba(10, 10, 15, 0.95) 100%)',
        border: `1px solid ${isHovered ? config.color : 'rgba(255, 255, 255, 0.1)'}`,
        boxShadow: isHovered ? `0 0 40px ${config.color}30, 0 20px 60px rgba(0, 0, 0, 0.4)` : '0 10px 40px rgba(0, 0, 0, 0.3)',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        transitionDelay: `${index * 100}ms`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${config.color}20, transparent 70%)`
        }}
      />

      {/* Image container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={imagePath}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, transparent 50%, ${config.color}15 100%)`
          }}
        />

        {/* Rarity badge */}
        <div
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider"
          style={{
            background: config.bg,
            color: config.color,
            border: `1px solid ${config.color}50`,
            backdropFilter: 'blur(10px)'
          }}
        >
          {config.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-bold text-lg text-star-white mb-2 truncate">{name}</h3>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-cosmic-gray font-mono mb-1">
              {intl.formatMessage({ id: 'pages.home.collection.card.price' })}
            </div>
            <div className="font-mono font-bold text-star-white">
              {typeof price === 'number' ? `${price.toLocaleString()}` : price}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-cosmic-gray font-mono mb-1">
              {intl.formatMessage({ id: 'pages.home.collection.card.dailyYield' })}
            </div>
            <div className="font-mono font-bold" style={{ color: config.color }}>{yieldPercent}</div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
          opacity: isHovered ? 1 : 0.5
        }}
      />
    </div>
  );
}

// Collection Section
function CollectionSection() {
  const router = useRouter();
  const intl = useIntl();
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const featuredCreatures = investmentPlans.slice(0, 8);
  const rarities: Array<'common' | 'rare' | 'epic' | 'legendary'> =
    ['common', 'rare', 'epic', 'legendary', 'rare', 'epic', 'legendary', 'common'];
  const powerLevels = ['Low', 'Med', 'High', 'Max'];

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-void-black" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block px-4 py-1 rounded-full text-sm font-mono text-miner-green mb-4" style={{ background: 'rgba(19, 241, 135, 0.1)', border: '1px solid rgba(19, 241, 135, 0.3)' }}>
            {intl.formatMessage({ id: 'pages.home.collection.badge' })}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-wider">
            <span className="text-star-white">{intl.formatMessage({ id: 'pages.home.collection.title.part1' })} </span>
            <span style={{ background: 'linear-gradient(135deg, #13f187 0%, #00f5ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {intl.formatMessage({ id: 'pages.home.collection.title.part2' })}
            </span>
          </h2>
          <p className="text-cosmic-gray text-lg max-w-2xl mx-auto font-body">
            {intl.formatMessage({ id: 'pages.home.collection.subtitle' })}
          </p>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCreatures.map((creature, index) => (
            <NFTCard
              key={creature.titleKey}
              imagePath={creature.imagePath}
              name={intl.formatMessage({ id: creature.titleKey })}
              price={creature.minPrice ? `${creature.minPrice} - ${creature.maxPrice}` : (creature.monto || 0)}
              rarity={rarities[index]}
              yield={powerLevels[index]}
              index={index}
              onClick={() => router.push('/enlist')}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button
            onClick={() => router.push('/enlist')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-display font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-miner-green/10"
            style={{
              background: 'transparent',
              color: '#13f187',
              border: '2px solid rgba(19, 241, 135, 0.5)'
            }}
          >
            {intl.formatMessage({ id: 'pages.home.collection.viewAll' })}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

// Features Section
function FeaturesSection() {
  const intl = useIntl();
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: intl.formatMessage({ id: 'pages.home.features.passiveIncome.icon' }),
      title: intl.formatMessage({ id: 'pages.home.features.passiveIncome.title' }),
      description: intl.formatMessage({ id: 'pages.home.features.passiveIncome.description' }),
      color: '#13f187'
    },
    {
      icon: intl.formatMessage({ id: 'pages.home.features.secure.icon' }),
      title: intl.formatMessage({ id: 'pages.home.features.secure.title' }),
      description: intl.formatMessage({ id: 'pages.home.features.secure.description' }),
      color: '#00f5ff'
    },
    {
      icon: intl.formatMessage({ id: 'pages.home.features.instant.icon' }),
      title: intl.formatMessage({ id: 'pages.home.features.instant.title' }),
      description: intl.formatMessage({ id: 'pages.home.features.instant.description' }),
      color: '#dc95e6'
    },
    {
      icon: intl.formatMessage({ id: 'pages.home.features.community.icon' }),
      title: intl.formatMessage({ id: 'pages.home.features.community.title' }),
      description: intl.formatMessage({ id: 'pages.home.features.community.description' }),
      color: '#c8ff00'
    }
  ];

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10, 31, 26, 0.5) 0%, rgba(10, 10, 15, 0.8) 50%, rgba(10, 31, 26, 0.5) 100%)' }} />

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block px-4 py-1 rounded-full text-sm font-mono text-cyber-cyan mb-4" style={{ background: 'rgba(0, 245, 255, 0.1)', border: '1px solid rgba(0, 245, 255, 0.3)' }}>
            {intl.formatMessage({ id: 'pages.home.features.badge' })}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-wider">
            <span className="text-star-white">{intl.formatMessage({ id: 'pages.home.features.title.part1' })} </span>
            <span className="italic font-light text-cosmic-gray">{intl.formatMessage({ id: 'pages.home.features.title.part2' })}</span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative p-6 rounded-2xl transition-all duration-500 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{
                background: 'rgba(15, 15, 20, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                transitionDelay: `${index * 100}ms`
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: `inset 0 0 60px ${feature.color}10` }}
              />

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4"
                style={{
                  background: `linear-gradient(135deg, ${feature.color}20, transparent)`,
                  border: `1px solid ${feature.color}30`
                }}
              >
                {feature.icon}
              </div>

              <h3 className="font-display font-bold text-xl text-star-white mb-2">{feature.title}</h3>
              <p className="text-cosmic-gray font-body text-sm leading-relaxed">{feature.description}</p>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-4 right-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorksSection() {
  const intl = useIntl();
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: intl.formatMessage({ id: 'pages.home.howItWorks.step1.number' }),
      title: intl.formatMessage({ id: 'pages.home.howItWorks.step1.title' }),
      description: intl.formatMessage({ id: 'pages.home.howItWorks.step1.description' }),
      color: '#13f187'
    },
    {
      number: intl.formatMessage({ id: 'pages.home.howItWorks.step2.number' }),
      title: intl.formatMessage({ id: 'pages.home.howItWorks.step2.title' }),
      description: intl.formatMessage({ id: 'pages.home.howItWorks.step2.description' }),
      color: '#00f5ff'
    },
    {
      number: intl.formatMessage({ id: 'pages.home.howItWorks.step3.number' }),
      title: intl.formatMessage({ id: 'pages.home.howItWorks.step3.title' }),
      description: intl.formatMessage({ id: 'pages.home.howItWorks.step3.description' }),
      color: '#dc95e6'
    },
    {
      number: intl.formatMessage({ id: 'pages.home.howItWorks.step4.number' }),
      title: intl.formatMessage({ id: 'pages.home.howItWorks.step4.title' }),
      description: intl.formatMessage({ id: 'pages.home.howItWorks.step4.description' }),
      color: '#c8ff00'
    }
  ];

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-void-black" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="inline-block px-4 py-1 rounded-full text-sm font-mono text-plasma-pink mb-4" style={{ background: 'rgba(220, 149, 230, 0.1)', border: '1px solid rgba(220, 149, 230, 0.3)' }}>
            {intl.formatMessage({ id: 'pages.home.howItWorks.badge' })}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-wider">
            <span className="text-star-white">{intl.formatMessage({ id: 'pages.home.howItWorks.title.part1' })} </span>
            <span style={{ background: 'linear-gradient(135deg, #13f187 0%, #dc95e6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {intl.formatMessage({ id: 'pages.home.howItWorks.title.part2' })}
            </span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`relative transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div
                className="relative p-5 md:p-6 rounded-2xl h-full text-center"
                style={{
                  background: 'rgba(15, 15, 20, 0.6)',
                  border: `1px solid ${step.color}30`,
                  backdropFilter: 'blur(20px)'
                }}
              >
                {/* Step number */}
                <div
                  className="w-12 h-12 mx-auto rounded-full flex items-center justify-center font-mono font-bold text-lg mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}30, ${step.color}10)`,
                    border: `2px solid ${step.color}`,
                    color: step.color,
                    boxShadow: `0 0 20px ${step.color}30`
                  }}
                >
                  {step.number}
                </div>

                <h3 className="font-display font-bold text-base md:text-lg text-star-white mb-2">{step.title}</h3>
                <p className="text-cosmic-gray font-body text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  const intl = useIntl();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const badges = [
    intl.formatMessage({ id: 'pages.home.cta.badge1' }),
    intl.formatMessage({ id: 'pages.home.cta.badge2' }),
    intl.formatMessage({ id: 'pages.home.cta.badge3' })
  ];

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10, 10, 15, 0.95) 0%, rgba(10, 31, 26, 0.8) 50%, rgba(10, 10, 15, 0.95) 100%)' }} />

      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-20"
          style={{
            background: 'radial-gradient(circle, #13f187 0%, transparent 70%)',
            top: '20%',
            left: '20%',
            animation: 'float 8s ease-in-out infinite'
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-15"
          style={{
            background: 'radial-gradient(circle, #dc95e6 0%, transparent 70%)',
            bottom: '20%',
            right: '20%',
            animation: 'float 10s ease-in-out infinite reverse'
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div
          className={`max-w-4xl mx-auto text-center p-8 sm:p-12 md:p-16 rounded-3xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{
            background: 'linear-gradient(180deg, rgba(15, 15, 20, 0.8) 0%, rgba(10, 36, 25, 0.6) 100%)',
            border: '1px solid rgba(19, 241, 135, 0.3)',
            boxShadow: '0 0 80px rgba(19, 241, 135, 0.1)'
          }}
        >
          {/* Top glow line */}
          <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl" style={{ background: 'linear-gradient(90deg, transparent, #13f187, #dc95e6, transparent)' }} />

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-wider">
            <span className="text-star-white">{intl.formatMessage({ id: 'pages.home.cta.title.part1' })}</span>
            <br />
            <span style={{ background: 'linear-gradient(135deg, #13f187 0%, #00f5ff 50%, #dc95e6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {intl.formatMessage({ id: 'pages.home.cta.title.part2' })}
            </span>
            <span className="text-star-white">{intl.formatMessage({ id: 'pages.home.cta.title.part3' })}</span>
          </h2>

          <p className="text-cosmic-gray text-lg max-w-xl mx-auto mb-8 font-body">
            {intl.formatMessage({ id: 'pages.home.cta.subtitle' })}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/enlist')}
              className="px-10 py-4 rounded-lg font-display font-bold text-base tracking-wider uppercase transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #13f187 0%, #0a9f5a 100%)',
                color: '#000201',
                boxShadow: '0 0 40px rgba(19, 241, 135, 0.5)'
              }}
            >
              {intl.formatMessage({ id: 'pages.home.cta.button' })}
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 pt-8 border-t border-white/10">
            {badges.map((badge) => (
              <div key={badge} className="flex items-center gap-2 text-sm text-cosmic-gray">
                <svg className="w-4 h-4 text-miner-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Page Component
export default function OrbitradeLanding() {
  return (
    <div className="relative bg-void-black min-h-screen">
      {/* Page Sections */}
      <HeroSection />
      <StatsSection />
      <CollectionSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </div>
  );
}
