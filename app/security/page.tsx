'use client';

import { useIntl } from 'react-intl';
import Link from 'next/link';

export default function SecurityPage() {
  const intl = useIntl();

  const securityProtocols = [
    {
      title: intl.formatMessage({ id: 'pages.security.protocols.quantumEncryption.title' }),
      description: intl.formatMessage({ id: 'pages.security.protocols.quantumEncryption.description' }),
      icon: '🔐',
      gradient: 'from-cyan-500 to-blue-600',
      level: 'ALPHA',
      features: [
        intl.formatMessage({ id: 'pages.security.protocols.quantumEncryption.features.0' }),
        intl.formatMessage({ id: 'pages.security.protocols.quantumEncryption.features.1' }),
        intl.formatMessage({ id: 'pages.security.protocols.quantumEncryption.features.2' }),
        intl.formatMessage({ id: 'pages.security.protocols.quantumEncryption.features.3' })
      ]
    },
    {
      title: intl.formatMessage({ id: 'pages.security.protocols.biometricAuthentication.title' }),
      description: intl.formatMessage({ id: 'pages.security.protocols.biometricAuthentication.description' }),
      icon: '👁️',
      gradient: 'from-red-500 to-pink-600',
      level: 'BETA',
      features: [
        intl.formatMessage({ id: 'pages.security.protocols.biometricAuthentication.features.0' }),
        intl.formatMessage({ id: 'pages.security.protocols.biometricAuthentication.features.1' }),
        intl.formatMessage({ id: 'pages.security.protocols.biometricAuthentication.features.2' }),
        intl.formatMessage({ id: 'pages.security.protocols.biometricAuthentication.features.3' })
      ]
    },
    {
      title: intl.formatMessage({ id: 'pages.security.protocols.fleetMonitoring.title' }),
      description: intl.formatMessage({ id: 'pages.security.protocols.fleetMonitoring.description' }),
      icon: '🛡️',
      gradient: 'from-green-500 to-cyan-600',
      level: 'GAMMA',
      features: [
        intl.formatMessage({ id: 'pages.security.protocols.fleetMonitoring.features.0' }),
        intl.formatMessage({ id: 'pages.security.protocols.fleetMonitoring.features.1' }),
        intl.formatMessage({ id: 'pages.security.protocols.fleetMonitoring.features.2' }),
        intl.formatMessage({ id: 'pages.security.protocols.fleetMonitoring.features.3' })
      ]
    },
    {
      title: intl.formatMessage({ id: 'pages.security.protocols.cargoProtection.title' }),
      description: intl.formatMessage({ id: 'pages.security.protocols.cargoProtection.description' }),
      icon: '🔒',
      gradient: 'from-orange-500 to-red-600',
      level: 'DELTA',
      features: [
        intl.formatMessage({ id: 'pages.security.protocols.cargoProtection.features.0' }),
        intl.formatMessage({ id: 'pages.security.protocols.cargoProtection.features.1' }),
        intl.formatMessage({ id: 'pages.security.protocols.cargoProtection.features.2' }),
        intl.formatMessage({ id: 'pages.security.protocols.cargoProtection.features.3' })
      ]
    }
  ];

  const securityMeasures = [
    {
      title: intl.formatMessage({ id: 'pages.security.bestPractices.secureAccount.title' }),
      description: intl.formatMessage({ id: 'pages.security.bestPractices.secureAccount.description' }),
      icon: '🔐',
      measures: [
        intl.formatMessage({ id: 'pages.security.bestPractices.secureAccount.measures.0' }),
        intl.formatMessage({ id: 'pages.security.bestPractices.secureAccount.measures.1' }),
        intl.formatMessage({ id: 'pages.security.bestPractices.secureAccount.measures.2' }),
        intl.formatMessage({ id: 'pages.security.bestPractices.secureAccount.measures.3' })
      ]
    },
    {
      title: intl.formatMessage({ id: 'pages.security.bestPractices.safeCommunication.title' }),
      description: intl.formatMessage({ id: 'pages.security.bestPractices.safeCommunication.description' }),
      icon: '📡',
      measures: [
        intl.formatMessage({ id: 'pages.security.bestPractices.safeCommunication.measures.0' }),
        intl.formatMessage({ id: 'pages.security.bestPractices.safeCommunication.measures.1' }),
        intl.formatMessage({ id: 'pages.security.bestPractices.safeCommunication.measures.2' }),
        intl.formatMessage({ id: 'pages.security.bestPractices.safeCommunication.measures.3' })
      ]
    },
    {
      title: intl.formatMessage({ id: 'pages.security.bestPractices.extractionSecurity.title' }),
      description: intl.formatMessage({ id: 'pages.security.bestPractices.extractionSecurity.description' }),
      icon: '🚛',
      measures: [
        intl.formatMessage({ id: 'pages.security.bestPractices.extractionSecurity.measures.0' }),
        intl.formatMessage({ id: 'pages.security.bestPractices.extractionSecurity.measures.1' }),
        intl.formatMessage({ id: 'pages.security.bestPractices.extractionSecurity.measures.2' }),
        intl.formatMessage({ id: 'pages.security.bestPractices.extractionSecurity.measures.3' })
      ]
    }
  ];

  const threatLevels = [
    {
      level: 'GREEN',
      status: intl.formatMessage({ id: 'pages.security.threatLevels.green.status' }),
      description: intl.formatMessage({ id: 'pages.security.threatLevels.green.description' }),
      color: 'from-green-400 to-emerald-500'
    },
    {
      level: 'YELLOW',
      status: intl.formatMessage({ id: 'pages.security.threatLevels.yellow.status' }),
      description: intl.formatMessage({ id: 'pages.security.threatLevels.yellow.description' }),
      color: 'from-yellow-400 to-orange-500'
    },
    {
      level: 'ORANGE',
      status: intl.formatMessage({ id: 'pages.security.threatLevels.orange.status' }),
      description: intl.formatMessage({ id: 'pages.security.threatLevels.orange.description' }),
      color: 'from-orange-400 to-red-500'
    },
    {
      level: 'RED',
      status: intl.formatMessage({ id: 'pages.security.threatLevels.red.status' }),
      description: intl.formatMessage({ id: 'pages.security.threatLevels.red.description' }),
      color: 'from-red-400 to-red-600'
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
      <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>

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
                    {intl.formatMessage({ id: 'pages.security.breadcrumb' })}
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
                    <div className="text-4xl">🛡️</div>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-red-400 to-pink-400 bg-clip-text text-transparent font-mono tracking-wider">
              {intl.formatMessage({ id: 'pages.security.header.title' })}
            </h1>
            <div className="text-xl md:text-2xl text-cyan-300 mb-4 font-mono tracking-wider">
              {intl.formatMessage({ id: 'pages.security.header.status' })}
            </div>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {intl.formatMessage({
                id: 'pages.security.subtitle',
                defaultMessage: 'Advanced security protocols protecting your space mining operations across the galaxy with military-grade encryption and monitoring systems'
              })}
            </p>
          </div>

          {/* Current Threat Level */}
          <div className="mb-20">
            <div className="backdrop-blur-sm bg-slate-900/40 border border-green-500/30 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-cyan-500 to-green-500 animate-pulse"></div>
              <div className="absolute top-4 right-4 text-green-400 font-mono text-sm opacity-60">
                {intl.formatMessage({ id: 'pages.security.threatAssessmentActive' })}
              </div>
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-16 hidden md:block h-16 bg-gradient-to-br from-green-500 to-cyan-500 rounded-xl flex items-center justify-center mr-6 animate-pulse">
                    <div className="text-2xl">🟢</div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-green-300 mb-2 font-mono tracking-wider">
                      {intl.formatMessage({ id: 'pages.security.currentThreatLevel' })}
                    </h2>
                    <div className="text-cyan-400 font-mono text-sm">{intl.formatMessage({ id: 'pages.security.realTimeMonitoring' })}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold font-mono">
                    <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                      GREEN
                    </span>
                  </div>
                  <div className="text-green-300 font-mono text-sm">{intl.formatMessage({ id: 'pages.security.secureStatus' })}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {threatLevels.map((threat, index) => (
                  <div 
                    key={index}
                    className={`backdrop-blur-sm bg-slate-800/30 border ${
                      threat.level === 'GREEN' ? 'border-green-500/40' : 'border-gray-500/20'
                    } rounded-xl p-4 ${
                      threat.level === 'GREEN' ? 'ring-2 ring-green-500/30' : ''
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 bg-gradient-to-br ${threat.color} rounded-lg flex items-center justify-center mx-auto mb-3 ${
                        threat.level === 'GREEN' ? 'animate-pulse' : ''
                      }`}>
                        <span className="text-white font-mono text-sm">{threat.level[0]}</span>
                      </div>
                      <h3 className={`text-lg font-bold font-mono mb-2 ${
                        threat.level === 'GREEN' ? 'text-green-300' : 'text-gray-400'
                      }`}>
                        {threat.status}
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        {threat.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Protocols */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center mb-12 font-mono tracking-wider">
              <span className="bg-gradient-to-r from-cyan-400 to-red-400 bg-clip-text text-transparent">
                {intl.formatMessage({ id: 'pages.security.protocols.title' })}
              </span>
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {securityProtocols.map((protocol, index) => (
                <div 
                  key={index}
                  className="backdrop-blur-sm bg-slate-900/40 border border-cyan-500/30 rounded-2xl p-8 hover:border-red-400/40 transition-all duration-300 hover:transform hover:scale-105 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 right-4 text-cyan-400 font-mono text-xs opacity-60">
                    {intl.formatMessage({ id: 'pages.security.protocols.level' }, { level: protocol.level })}
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${protocol.gradient} rounded-xl flex items-center justify-center mr-6 animate-pulse`}>
                      <div className="text-2xl">{protocol.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-cyan-300 mb-2 font-mono tracking-wider">
                        {protocol.title}
                      </h3>
                      <p className="text-red-400 font-mono text-sm">
                        {protocol.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {protocol.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-mono text-xs">✓</span>
                        </div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-red-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-red-400 font-mono text-xs">{intl.formatMessage({ id: 'pages.security.protocols.protocolActive' })}</span>
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Best Practices */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12 font-mono tracking-wider">
              <span className="bg-gradient-to-r from-red-400 to-cyan-400 bg-clip-text text-transparent">
                {intl.formatMessage({ id: 'pages.security.bestPractices.title' })}
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {securityMeasures.map((measure, index) => (
                <div 
                  key={index}
                  className="backdrop-blur-sm bg-slate-900/40 border border-red-500/20 rounded-2xl p-8 hover:border-cyan-400/40 transition-all duration-300 hover:transform hover:scale-105 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <div className="text-2xl">{measure.icon}</div>
                    </div>
                    <h3 className="text-xl font-bold text-cyan-300 mb-2 font-mono tracking-wider">
                      {measure.title}
                    </h3>
                    <p className="text-red-400 text-sm leading-relaxed">
                      {measure.description}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    {measure.measures.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-gradient-to-r from-cyan-500 to-red-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white font-mono text-xs">▶</span>
                        </div>
                        <span className="text-gray-300 text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Statistics */}
          <div className="mb-20">
            <div className="backdrop-blur-sm bg-slate-900/40 border border-cyan-500/30 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-red-500 to-pink-500 animate-pulse"></div>
              <div className="absolute top-4 right-4 text-cyan-400 font-mono text-sm opacity-60">
                {intl.formatMessage({ id: 'pages.security.metrics.active' })}
              </div>
              
              <h2 className="text-3xl font-bold text-center mb-12 font-mono tracking-wider">
                <span className="bg-gradient-to-r from-red-400 to-cyan-400 bg-clip-text text-transparent">
                  {intl.formatMessage({ id: 'pages.security.metrics.title' })}
                </span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto animate-pulse">
                    <div className="text-2xl">🛡️</div>
                  </div>
                  <div className="text-3xl font-bold font-mono">
                    <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                      99.98%
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-cyan-300 font-mono">{intl.formatMessage({ id: 'pages.security.metrics.uptimeSecurity' })}</h3>
                  <p className="text-gray-400 text-xs">{intl.formatMessage({ id: 'pages.security.metrics.uptimeDescription' })}</p>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto animate-pulse">
                    <div className="text-2xl">🔐</div>
                  </div>
                  <div className="text-3xl font-bold font-mono">
                    <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                      0
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-red-300 font-mono">{intl.formatMessage({ id: 'pages.security.metrics.breachesYtd' })}</h3>
                  <p className="text-gray-400 text-xs">{intl.formatMessage({ id: 'pages.security.metrics.breachesDescription' })}</p>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto animate-pulse">
                    <div className="text-2xl">⚡</div>
                  </div>
                  <div className="text-3xl font-bold font-mono">
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      &lt;15ms
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-cyan-300 font-mono">{intl.formatMessage({ id: 'pages.security.metrics.responseTime' })}</h3>
                  <p className="text-gray-400 text-xs">{intl.formatMessage({ id: 'pages.security.metrics.responseDescription' })}</p>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto animate-pulse">
                    <div className="text-2xl">🚨</div>
                  </div>
                  <div className="text-3xl font-bold font-mono">
                    <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                      24/7
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-orange-300 font-mono">{intl.formatMessage({ id: 'pages.security.metrics.monitoring' })}</h3>
                  <p className="text-gray-400 text-xs">{intl.formatMessage({ id: 'pages.security.metrics.monitoringDescription' })}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Security Protocols */}
          <div className="mb-20">
            <div className="backdrop-blur-sm bg-slate-900/40 border border-red-500/30 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-pulse"></div>
              <div className="absolute top-4 right-4 text-red-400 font-mono text-sm opacity-60">
                {intl.formatMessage({ id: 'pages.security.emergency.active' })}
              </div>
              
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mr-6 animate-pulse">
                  <div className="text-2xl">🚨</div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-red-300 mb-2 font-mono tracking-wider">
                    {intl.formatMessage({ id: 'pages.security.emergency.title' })}
                  </h2>
                  <div className="text-orange-400 font-mono text-sm">{intl.formatMessage({ id: 'pages.security.emergency.immediateResponse' })}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-red-300 font-mono">{intl.formatMessage({ id: 'pages.security.emergency.incidents.title' })}</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 text-lg mt-1">⚠️</span>
                      <p className="text-gray-300 leading-relaxed">
                        {intl.formatMessage({ id: 'pages.security.emergency.incidents.unauthorizedAccess' })}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 text-lg mt-1">⚠️</span>
                      <p className="text-gray-300 leading-relaxed">
                        {intl.formatMessage({ id: 'pages.security.emergency.incidents.compromisedKeys' })}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-red-400 text-lg mt-1">⚠️</span>
                      <p className="text-gray-300 leading-relaxed">
                        {intl.formatMessage({ id: 'pages.security.emergency.incidents.phishing' })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-orange-300 font-mono">{intl.formatMessage({ id: 'pages.security.emergency.actions.title' })}</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-orange-400 text-lg mt-1">🔧</span>
                      <p className="text-gray-300 leading-relaxed">
                        {intl.formatMessage({ id: 'pages.security.emergency.actions.lockdown' })}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-orange-400 text-lg mt-1">🔧</span>
                      <p className="text-gray-300 leading-relaxed">
                        {intl.formatMessage({ id: 'pages.security.emergency.actions.encryption' })}
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-orange-400 text-lg mt-1">🔧</span>
                      <p className="text-gray-300 leading-relaxed">
                        {intl.formatMessage({ id: 'pages.security.emergency.actions.forensic' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Link
                  href="/contact"
                  className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-xl font-mono tracking-wider hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                >
                  {intl.formatMessage({ id: 'pages.security.emergency.reportIncident' })}
                </Link>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="backdrop-blur-sm bg-slate-900/40 border border-red-500/30 rounded-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-cyan-500/5 to-pink-500/5 animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-cyan-500 to-pink-500 animate-pulse"></div>
              
              <div className="text-4xl mb-4">🛡️</div>
              <h2 className="text-3xl font-bold mb-6 font-mono tracking-wider">
                <span className="bg-gradient-to-r from-cyan-400 to-red-400 bg-clip-text text-transparent">
                  {intl.formatMessage({ id: 'pages.security.cta.title' })}
                </span>
              </h2>
              
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                {intl.formatMessage({
                  id: 'pages.security.cta.description',
                  defaultMessage: 'Join thousands of secure mining operators protected by our quantum defense systems and become part of the most secure space mining network in the galaxy.'
                })}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/enlist"
                  className="bg-gradient-to-r from-red-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-mono tracking-wider hover:from-red-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                >
                  {intl.formatMessage({ id: 'pages.security.cta.initializeAccount' })}
                </Link>
                <Link
                  href="/training-center"
                  className="border border-cyan-500/50 text-cyan-300 px-8 py-4 rounded-xl font-mono tracking-wider hover:bg-cyan-500/10 transition-all duration-300 transform hover:scale-105"
                >
                  {intl.formatMessage({ id: 'pages.security.cta.trainingCenter' })}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}