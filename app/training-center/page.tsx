'use client';

import { useIntl } from 'react-intl';
import Link from 'next/link';

export default function HelpPage() {
  const intl = useIntl();

  const trainingModules = [
    {
      title: intl.formatMessage({ id: 'pages.help.trainingModules.operatorInitialization.title' }),
      description: intl.formatMessage({ id: 'pages.help.trainingModules.operatorInitialization.description' }),
      icon: '🎓',
      gradient: 'from-red-600 to-blue-600',
      level: 'NOVICE',
      courses: [
        intl.formatMessage({ id: 'pages.help.trainingModules.operatorInitialization.courses.0' }),
        intl.formatMessage({ id: 'pages.help.trainingModules.operatorInitialization.courses.1' }),
        intl.formatMessage({ id: 'pages.help.trainingModules.operatorInitialization.courses.2' }),
        intl.formatMessage({ id: 'pages.help.trainingModules.operatorInitialization.courses.3' })
      ]
    },
    {
      title: intl.formatMessage({ id: 'pages.help.trainingModules.miningOperations.title' }),
      description: intl.formatMessage({ id: 'pages.help.trainingModules.miningOperations.description' }),
      icon: '⛏️',
      gradient: 'from-blue-600 to-indigo-600',
      level: 'OPERATIVE',
      courses: [
        intl.formatMessage({ id: 'pages.help.trainingModules.miningOperations.courses.0' }),
        intl.formatMessage({ id: 'pages.help.trainingModules.miningOperations.courses.1' }),
        intl.formatMessage({ id: 'pages.help.trainingModules.miningOperations.courses.2' }),
        intl.formatMessage({ id: 'pages.help.trainingModules.miningOperations.courses.3' })
      ]
    },
    {
      title: intl.formatMessage({ id: 'pages.help.trainingModules.cargoExtraction.title' }),
      description: intl.formatMessage({ id: 'pages.help.trainingModules.cargoExtraction.description' }),
      icon: '🚛',
      gradient: 'from-indigo-600 to-red-600',
      level: 'ADVANCED',
      courses: [
        intl.formatMessage({ id: 'pages.help.trainingModules.cargoExtraction.courses.0' }),
        intl.formatMessage({ id: 'pages.help.trainingModules.cargoExtraction.courses.1' }),
        intl.formatMessage({ id: 'pages.help.trainingModules.cargoExtraction.courses.2' })
      ]
    },
    {
      title: intl.formatMessage({ id: 'pages.help.trainingModules.fleetNetwork.title' }),
      description: intl.formatMessage({ id: 'pages.help.trainingModules.fleetNetwork.description' }),
      icon: '🌐',
      gradient: 'from-red-600 to-pink-600',
      level: 'COMMANDER',
      courses: [
        intl.formatMessage({ id: 'pages.help.trainingModules.fleetNetwork.courses.0' }),
        intl.formatMessage({ id: 'pages.help.trainingModules.fleetNetwork.courses.1' }),
        intl.formatMessage({ id: 'pages.help.trainingModules.fleetNetwork.courses.2' })
      ]
    },
    {
      title: intl.formatMessage({ id: 'pages.help.trainingModules.securityProtocols.title' }),
      description: intl.formatMessage({ id: 'pages.help.trainingModules.securityProtocols.description' }),
      icon: '🛡️',
      gradient: 'from-green-600 to-blue-600',
      level: 'SPECIALIST',
      courses: [
        intl.formatMessage({ id: 'pages.help.trainingModules.securityProtocols.courses.0' }),
        intl.formatMessage({ id: 'pages.help.trainingModules.securityProtocols.courses.1' }),
        intl.formatMessage({ id: 'pages.help.trainingModules.securityProtocols.courses.2' }),
        intl.formatMessage({ id: 'pages.help.trainingModules.securityProtocols.courses.3' })
      ]
    }
  ];

  const quickAccessCommands = [
    {
      title: intl.formatMessage({ id: 'pages.help.quickAccess.validateDeployment.title' }),
      description: intl.formatMessage({ id: 'pages.help.quickAccess.validateDeployment.description' }),
      icon: '🔍',
      link: '/deposits'
    },
    {
      title: intl.formatMessage({ id: 'pages.help.quickAccess.claimResources.title' }),
      description: intl.formatMessage({ id: 'pages.help.quickAccess.claimResources.description' }),
      icon: '💰',
      link: '/production'
    },
    {
      title: intl.formatMessage({ id: 'pages.help.quickAccess.fleetReferrals.title' }),
      description: intl.formatMessage({ id: 'pages.help.quickAccess.fleetReferrals.description' }),
      icon: '👥',
      link: '/partners'
    },
    {
      title: intl.formatMessage({ id: 'pages.help.quickAccess.cargoTransport.title' }),
      description: intl.formatMessage({ id: 'pages.help.quickAccess.cargoTransport.description' }),
      icon: '🚀',
      link: '/withdrawals'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-indigo-950 relative overflow-hidden">
      {/* Animated Stars and Nebula Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-800/20 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-pink-500/10 to-red-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        {/* Animated Stars */}
        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-1/5 left-1/6 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-red-400 rounded-full animate-ping delay-300"></div>
          <div className="absolute top-1/2 right-1/5 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-700"></div>
          <div className="absolute bottom-1/5 left-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-1000"></div>
        </div>
      </div>

      {/* Cosmic Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>

      <div className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex mb-8 font-mono" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                  <span className="text-red-400 mr-2">{'>'}</span>
                  {intl.formatMessage({ id: 'common.breadcrumb.home', defaultMessage: 'MAIN_DECK' })}
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-red-400 mr-2">/</span>
                  <span className="text-cyan-300 text-sm font-medium uppercase tracking-wider">
                    {intl.formatMessage({ id: 'pages.help.breadcrumb.trainingCenter' })}
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Header */}
          <div className="text-center mb-20">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-red-600 to-cyan-600 opacity-20 animate-pulse"></div>
              </div>
              <div className="relative">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500 via-cyan-500 to-pink-500 rounded-full p-1 animate-pulse">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <div className="text-4xl">🗒️</div>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-red-400 to-pink-400 bg-clip-text text-transparent font-mono tracking-wider">
              {intl.formatMessage({ id: 'pages.help.header.trainingCenter' })}
            </h1>
            <div className="text-xl md:text-2xl text-cyan-300 mb-4 font-mono tracking-wider">
              {intl.formatMessage({ id: 'pages.help.header.trainingProtocolsActive' })}
            </div>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {intl.formatMessage({
                id: 'pages.help.subtitle',
                defaultMessage: 'Comprehensive training modules for mastering space mining operations and fleet management across the galaxy'
              })}
            </p>
          </div>

          {/* Training Modules */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 font-mono tracking-wider">
              <span className="bg-gradient-to-r from-cyan-400 to-red-400 bg-clip-text text-transparent">
                {intl.formatMessage({ id: 'pages.help.trainingModules.header.trainingModules' })}
              </span>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {trainingModules.map((module, index) => (
                <div 
                  key={index}
                  className="backdrop-blur-sm bg-slate-900/40 border border-cyan-500/30 rounded-2xl p-8 hover:border-red-400/40 transition-all duration-300 hover:transform hover:scale-105 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 text-cyan-400 font-mono text-xs opacity-60">
                    {intl.formatMessage({ id: 'pages.help.trainingModules.level' })} {module.level}
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${module.gradient} rounded-xl flex items-center justify-center mr-6 animate-pulse`}>
                      <div className="text-2xl">{module.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-cyan-300 mb-2 font-mono tracking-wider">
                        {module.title}
                      </h3>
                      <p className="text-red-400 font-mono text-sm">
                        {module.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {module.courses.map((course, courseIndex) => (
                      <div key={courseIndex} className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-mono text-xs">▶</span>
                        </div>
                        <span className="text-gray-300 text-sm">{course}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-red-500/20">
                    <button className="w-full bg-gradient-to-r from-red-600/20 to-cyan-600/20 border border-cyan-500/30 text-cyan-300 px-6 py-3 rounded-xl font-mono tracking-wider hover:from-red-600/30 hover:to-cyan-600/30 transition-all duration-300">
                      {intl.formatMessage({ id: 'pages.help.trainingModules.accessTrainingModule' })}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access Commands */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 font-mono tracking-wider">
              <span className="bg-gradient-to-r from-red-400 to-cyan-400 bg-clip-text text-transparent">
                {intl.formatMessage({ id: 'pages.help.quickAccess.header.quickAccessCommands' })}
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickAccessCommands.map((command, index) => (
                <Link
                  key={index}
                  href={command.link}
                  className="backdrop-blur-sm bg-slate-900/40 border border-red-500/20 rounded-2xl p-6 hover:border-cyan-400/40 transition-all duration-300 hover:transform hover:scale-105 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <div className="text-xl">{command.icon}</div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-cyan-300 mb-2 font-mono tracking-wider">
                      {command.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {command.description}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-red-500/20">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-red-400 font-mono text-xs">{intl.formatMessage({ id: 'pages.help.quickAccess.execute' })}</span>
                        <svg className="w-4 h-4 text-cyan-400 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Emergency Protocols */}
          <div className="mb-20">
            <div className="backdrop-blur-sm bg-slate-900/40 border border-red-500/30 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-pulse"></div>
              <div className="absolute top-4 right-4 text-red-400 font-mono text-sm opacity-60">
                {intl.formatMessage({ id: 'pages.help.emergencyProtocols.header' })}
              </div>
              
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mr-6 animate-pulse">
                  <div className="text-2xl">🚨</div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-red-300 mb-2 font-mono tracking-wider">
                    {intl.formatMessage({ id: 'pages.help.emergencyProtocols.header.emergencySupport' })}
                  </h2>
                  <div className="text-orange-400 font-mono text-sm">{intl.formatMessage({ id: 'pages.help.emergencyProtocols.header.criticalAssistanceAvailable' })}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-red-300 font-mono">{intl.formatMessage({ id: 'pages.help.emergencyProtocols.criticalSituations.header' })}</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 text-lg mt-1">⚠️</span>
                      <p className="text-gray-300 leading-relaxed">
                        {intl.formatMessage({ id: 'pages.help.emergencyProtocols.criticalSituations.fleetDeploymentFailures' })}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 text-lg mt-1">⚠️</span>
                      <p className="text-gray-300 leading-relaxed">
                        {intl.formatMessage({ id: 'pages.help.emergencyProtocols.criticalSituations.unauthorizedAccessAttempts' })}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 text-lg mt-1">⚠️</span>
                      <p className="text-gray-300 leading-relaxed">
                        {intl.formatMessage({ id: 'pages.help.emergencyProtocols.criticalSituations.cargoExtractionSystemFailures' })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-orange-300 font-mono">{intl.formatMessage({ id: 'pages.help.emergencyProtocols.responseProtocols.header' })}</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-orange-400 text-lg mt-1">🔧</span>
                      <p className="text-gray-300 leading-relaxed">
                        {intl.formatMessage({ id: 'pages.help.emergencyProtocols.responseProtocols.immediateTechnicalSupport' })}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-orange-400 text-lg mt-1">🔧</span>
                      <p className="text-gray-300 leading-relaxed">
                        {intl.formatMessage({ id: 'pages.help.emergencyProtocols.responseProtocols.directCommunication' })}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-orange-400 text-lg mt-1">🔧</span>
                      <p className="text-gray-300 leading-relaxed">
                        {intl.formatMessage({ id: 'pages.help.emergencyProtocols.responseProtocols.sevenDaySupport' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Link
                  href="/contact"
                  className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-2 p-4 py-4 rounded-xl font-mono tracking-wider hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                >
                  {intl.formatMessage({ id: 'pages.help.emergencyProtocols.activateProtocols' })}
                </Link>
              </div>
            </div>
          </div>

          {/* Training Statistics */}
          <div className="mb-20">
            <div className="backdrop-blur-sm bg-slate-900/40 border border-cyan-500/30 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-red-500 to-pink-500 animate-pulse"></div>
              <div className="absolute top-4 right-4 text-cyan-400 font-mono text-sm opacity-60">
                {intl.formatMessage({ id: 'pages.help.trainingStatistics.header' })}
              </div>
              
              <h2 className="text-3xl font-bold text-center mb-12 font-mono tracking-wider">
                <span className="bg-gradient-to-r from-red-400 to-cyan-400 bg-clip-text text-transparent">
                  {intl.formatMessage({ id: 'pages.help.trainingStatistics.header.operatorSuccessMetrics' })}
                </span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto animate-pulse">
                    <div className="text-2xl">📈</div>
                  </div>
                  <div className="text-3xl font-bold font-mono">
                    <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                      94%
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-cyan-300 font-mono">{intl.formatMessage({ id: 'pages.help.trainingStatistics.successRate' })}</h3>
                  <p className="text-gray-400 text-xs">{intl.formatMessage({ id: 'pages.help.trainingStatistics.trainingCompletionRate' })}</p>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto animate-pulse">
                    <div className="text-2xl">⏱️</div>
                  </div>
                  <div className="text-3xl font-bold font-mono">
                    <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                      2.3H
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-red-300 font-mono">{intl.formatMessage({ id: 'pages.help.trainingStatistics.avgTraining' })}</h3>
                  <p className="text-gray-400 text-xs">{intl.formatMessage({ id: 'pages.help.trainingStatistics.averageCompletionTime' })}</p>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-red-500 rounded-xl flex items-center justify-center mx-auto animate-pulse">
                    <div className="text-2xl">🎓</div>
                  </div>
                  <div className="text-3xl font-bold font-mono">
                    <span className="bg-gradient-to-r from-cyan-400 to-red-400 bg-clip-text text-transparent">
                      12K+
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-cyan-300 font-mono">{intl.formatMessage({ id: 'pages.help.trainingStatistics.graduates' })}</h3>
                  <p className="text-gray-400 text-xs">{intl.formatMessage({ id: 'pages.help.trainingStatistics.certifiedOperators' })}</p>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center mx-auto animate-pulse">
                    <div className="text-2xl">🌟</div>
                  </div>
                  <div className="text-3xl font-bold font-mono">
                    <span className="bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent">
                      4.9/5
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-pink-300 font-mono">{intl.formatMessage({ id: 'pages.help.trainingStatistics.satisfaction' })}</h3>
                  <p className="text-gray-400 text-xs">{intl.formatMessage({ id: 'pages.help.trainingStatistics.trainingQualityRating' })}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="backdrop-blur-sm bg-slate-900/40 border border-red-500/30 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-cyan-500/5 to-pink-500/5 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-cyan-500 to-pink-500 animate-pulse"></div>
              
              <div className="text-4xl mb-4">🚀</div>
              <h2 className="text-3xl font-bold mb-6 font-mono tracking-wider">
                <span className="bg-gradient-to-r from-cyan-400 to-red-400 bg-clip-text text-transparent">
                  {intl.formatMessage({ id: 'pages.help.cta.header.readyForAdvancedTraining' })}
                </span>
              </h2>
              
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                {intl.formatMessage({
                  id: 'pages.help.cta.description',
                  defaultMessage: 'Master all aspects of space mining operations with our comprehensive training programs and become an elite fleet commander.'
                })}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/enlist"
                  className="bg-gradient-to-r from-red-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-mono tracking-wider hover:from-red-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                >
                  {intl.formatMessage({ id: 'pages.help.cta.startOperatorTraining' })}
                </Link>
                <Link
                  href="/how-it-works"
                  className="border border-cyan-500/50 text-cyan-300 px-8 py-4 rounded-xl font-mono tracking-wider hover:bg-cyan-500/10 transition-all duration-300 transform hover:scale-105"
                >
                  {intl.formatMessage({ id: 'pages.help.cta.learnMiningBasics' })}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}