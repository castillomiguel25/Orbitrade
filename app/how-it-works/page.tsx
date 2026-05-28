'use client';

import { useIntl } from 'react-intl';
import Link from 'next/link';

export default function HowItWorks() {
  const intl = useIntl();

  const procedures = [
    {
      number: 1,
      title: intl.formatMessage({ id: 'pages.howItWorks.procedures.FLEET_REGISTRATION.title' }),
      description: intl.formatMessage({ id: 'pages.howItWorks.procedures.FLEET_REGISTRATION.description' }),
      icon: "🧑‍🚀",
      classification: "ALPHA",
    },
    {
      number: 2,
      title: intl.formatMessage({ id: 'pages.howItWorks.procedures.MINING_CREDENTIALS.title' }),
      description: intl.formatMessage({ id: 'pages.howItWorks.procedures.MINING_CREDENTIALS.description' }),
      icon: "🔐",
      classification: "BETA",
    },
    {
      number: 3,
      title: intl.formatMessage({ id: 'pages.howItWorks.procedures.EXTRACTION_PROTOCOLS.title' }),
      description: intl.formatMessage({ id: 'pages.howItWorks.procedures.EXTRACTION_PROTOCOLS.description' }),
      icon: "⚡",
      classification: "GAMMA",
    },
    {
      number: 4,
      title: intl.formatMessage({ id: 'pages.howItWorks.procedures.RESOURCE_DEPLOYMENT.title' }),
      description: intl.formatMessage({ id: 'pages.howItWorks.procedures.RESOURCE_DEPLOYMENT.description' }),
      icon: "🚀",
      classification: "DELTA",
    },
    {
      number: 5,
      title: intl.formatMessage({ id: 'pages.howItWorks.procedures.YIELD_HARVESTING.title' }),
      description: intl.formatMessage({ id: 'pages.howItWorks.procedures.YIELD_HARVESTING.description' }),
      icon: "💎",
      classification: "EPSILON",
    },
  ];

  const operationalFeatures = [
    {
      title: intl.formatMessage({ id: 'pages.howItWorks.features.AUTOMATED_EXTRACTION.title' }),
      description: intl.formatMessage({ id: 'pages.howItWorks.features.AUTOMATED_EXTRACTION.description' }),
      icon: "🤖",
    },
    {
      title: intl.formatMessage({ id: 'pages.howItWorks.features.INSTANT_DEPLOYMENT.title' }),
      description: intl.formatMessage({ id: 'pages.howItWorks.features.INSTANT_DEPLOYMENT.description' }),
      icon: "⚡",
    },
    {
      title: intl.formatMessage({ id: 'pages.howItWorks.features.NETWORK_EXPANSION.title' }),
      description: intl.formatMessage({ id: 'pages.howItWorks.features.NETWORK_EXPANSION.description' }),
      icon: "🌐",
    },
    {
      title: intl.formatMessage({ id: 'pages.howItWorks.features.QUANTUM_SECURITY.title' }),
      description: intl.formatMessage({ id: 'pages.howItWorks.features.QUANTUM_SECURITY.description' }),
      icon: "🛡️",
    },
  ];

  return (
    <div className="min-h-screen whitespace-normal break-all bg-gradient-to-br from-slate-950 via-red-950 to-indigo-950 relative overflow-hidden">
      {/* Animated Stars and Nebula Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-800/20 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-pink-500/10 to-red-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        {/* Animated Stars */}
        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
          <div className="absolute top-2/3 left-2/3 w-1 h-1 bg-red-400 rounded-full animate-ping delay-300"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-700"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-1000"></div>
        </div>
      </div>

      {/* Cosmic Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>

      {/* Navigation breadcrumb */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm font-mono">
            <Link 
              href="/"
              className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 flex items-center gap-2"
            >
              <span className="text-red-400">{'>'}</span>
              {intl.formatMessage({ id: 'common.breadcrumb.home', defaultMessage: 'MAIN_DECK' })}
            </Link>
            <span className="text-red-400">/</span>
            <span className="text-cyan-300 uppercase tracking-wider">
              {intl.formatMessage({ id: 'pages.howItWorks.breadcrumb' })}
            </span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-red-600 to-cyan-600 opacity-20 animate-pulse"></div>
            </div>
            <div className="relative">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500 via-cyan-500 to-pink-500 rounded-full p-1 animate-pulse">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                  <div className="text-4xl">🛸</div>
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl whitespace-normal break-keep md:text-7xl  font-bold mb-6 bg-gradient-to-r from-cyan-400 via-red-400 to-pink-400 bg-clip-text text-transparent font-mono tracking-wider">
            {intl.formatMessage({ id: 'pages.howItWorks.header.title' })}
          </h1>
          <div className="text-xl whitespace-normal break-all md:text-2xl text-cyan-300 mb-4 font-mono tracking-wider">
            {intl.formatMessage({ id: 'pages.howItWorks.header.status' })}
          </div>
          <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {intl.formatMessage({ id: 'pages.howItWorks.subtitle' })}
          </p>
        </div>

        {/* Operational Procedures */}
        <div className="mb-20">
          <div className="space-y-12">
            {procedures.map((procedure, index) => (
              <div key={index} className="relative">
                {/* Connection line */}
                {index < procedures.length - 1 && (
                  <div className="hidden md:block absolute left-1/2 top-32 transform -translate-x-1/2 w-0.5 h-16 bg-gradient-to-b from-cyan-500/50 to-red-500/50 animate-pulse"></div>
                )}
                
                <div className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Procedure Content */}
                  <div className="flex-1">
                    <div className="backdrop-blur-sm bg-slate-900/40 border border-cyan-500/30 rounded-2xl p-8 relative overflow-hidden transition-all duration-300 hover:border-cyan-400/50">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-cyan-500 to-pink-500 animate-pulse"></div>
                      <div className="absolute top-4 text-cyan-400 font-mono text-xs opacity-60">
                        {intl.formatMessage({ id: 'pages.howItWorks.classification' }, { classification: procedure.classification })}
                      </div>
                      
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 hidden md:block bg-gradient-to-br from-red-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4 animate-pulse">
                          <div className="text-2xl">{procedure.icon}</div>
                        </div>
                        <div>
                          <h3 className="text-2xl whitespace-normal break-keep font-bold text-cyan-300 mb-1 font-mono tracking-wider">
                            {procedure.title}
                          </h3>
                          <div className="text-red-400 font-mono text-sm">STEP_{String(procedure.number).padStart(2, '0')}</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 whitespace-normal break-keep text-lg leading-relaxed">
                        {procedure.description}
                      </p>
                    </div>
                  </div>

                  {/* Procedure Number */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-600 to-red-600 flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-600 to-red-600 animate-pulse opacity-50"></div>
                      <div className="relative whitespace-normal break-keep text-white font-mono text-2xl font-bold">
                        {String(procedure.number).padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Features */}
        <div className="mb-20">
          <div className="backdrop-blur-sm bg-slate-900/40 border border-red-500/30 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-red-500 to-pink-500 animate-pulse"></div>
            <div className="absolute top-4 right-4 text-red-400 font-mono text-sm opacity-60">
              {intl.formatMessage({ id: 'pages.howItWorks.fleetCapabilitiesActive' })}
            </div>
            
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-red-500 rounded-xl flex items-center justify-center mr-6 animate-pulse">
                <div className="text-2xl">⚙️</div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-cyan-300 mb-2 font-mono tracking-wider">
                  {intl.formatMessage({ id: 'pages.howItWorks.operationalFeatures' })}
                </h2>
                <div className="text-red-400 font-mono text-sm">{intl.formatMessage({ id: 'pages.howItWorks.fleetWide' })}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {operationalFeatures.map((feature, index) => (
                <div key={index} className="bg-gradient-to-br from-red-900/30 to-cyan-900/30 rounded-xl p-6 border border-red-500/20 text-center transition-all duration-300 hover:border-cyan-400/40 hover:transform hover:scale-105">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-cyan-300 font-mono whitespace-normal break-all text-sm mb-2 tracking-wider">{feature.title}</h3>
                  <p className="text-gray-400 text-sm whitespace-normal break-all">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Statistics */}
        <div className="mb-20">
          <div className="backdrop-blur-sm bg-slate-900/40 border border-cyan-500/30 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-cyan-500 to-pink-500 animate-pulse"></div>
            <div className="absolute top-4 right-4 text-cyan-400 font-mono text-sm opacity-60">
              {intl.formatMessage({ id: 'pages.howItWorks.missionMetricsOnline' })}
            </div>
            
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-cyan-500 rounded-xl flex items-center justify-center mr-6 animate-pulse">
                <div className="text-2xl">📊</div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-red-300 mb-2 font-mono tracking-wider">
                  {intl.formatMessage({ id: 'pages.howItWorks.fleetPerformance' })}
                </h2>
                <div className="text-cyan-400 font-mono text-sm">{intl.formatMessage({ id: 'pages.howItWorks.operationalData' })}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2 font-mono">15K+</div>
                <div className="text-red-300 font-mono text-sm">{intl.formatMessage({ id: 'pages.howItWorks.activeOperators' })}</div>
                <div className="text-gray-400 text-xs">{intl.formatMessage({ id: 'pages.howItWorks.fleetPersonnelDeployed' })}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-400 mb-2 font-mono">24/7</div>
                <div className="text-cyan-300 font-mono text-sm">{intl.formatMessage({ id: 'pages.howItWorks.extractionCycles' })}</div>
                <div className="text-gray-400 text-xs">{intl.formatMessage({ id: 'pages.howItWorks.continuousOperations' })}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-400 mb-2 font-mono">99.9%</div>
                <div className="text-red-300 font-mono text-sm">{intl.formatMessage({ id: 'pages.howItWorks.successRate' })}</div>
                <div className="text-gray-400 text-xs">{intl.formatMessage({ id: 'pages.howItWorks.missionCompletion' })}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="backdrop-blur-sm bg-slate-900/40 border border-red-500/30 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-red-500 to-pink-500 animate-pulse"></div>
            <div className="absolute top-4 right-4 text-red-400 font-mono text-sm opacity-60">
              {intl.formatMessage({ id: 'pages.howItWorks.recruitmentActive' })}
            </div>
            
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-red-500 rounded-xl flex items-center justify-center mr-6 animate-pulse">
                <div className="text-2xl">🚀</div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-cyan-300 mb-2 font-mono tracking-wider">
                  {intl.formatMessage({
                    id: 'pages.howItWorks.cta.title',
                    defaultMessage: 'READY_FOR_DEPLOYMENT?'
                  })}
                </h2>
                <div className="text-red-400 font-mono text-sm">{intl.formatMessage({ id: 'pages.howItWorks.immediateAction' })}</div>
              </div>
            </div>
            
            <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
              {intl.formatMessage({
                id: 'pages.howItWorks.cta.description',
                defaultMessage: 'Explore advanced space mining protocols in our cosmic universe'
              })}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/enlist" 
                className="bg-gradient-to-r from-cyan-600 to-red-600 text-white px-8 py-4 rounded-xl font-bold hover:from-cyan-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 font-mono tracking-wider"
                style={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)' }}
              >
                {intl.formatMessage({ id: 'pages.howItWorks.initiateRegistration' })}
              </Link>
              <Link 
                href="/about" 
                className="border border-red-500/50 text-red-300 px-8 py-4 rounded-xl font-bold hover:bg-red-500/10 transition-all duration-300 font-mono tracking-wider"
              >
                {intl.formatMessage({
                  id: 'pages.howItWorks.cta.learnMore',
                  defaultMessage: 'MISSION BRIEFING'
                })}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}