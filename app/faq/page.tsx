'use client';

import { useIntl } from 'react-intl';
import Link from 'next/link';
import { useState } from 'react';

export default function FAQPage() {
  const intl = useIntl();
  const [openSection, setOpenSection] = useState<number | null>(null);

  const knowledgeModules = [
    {
      title: intl.formatMessage({ id: 'faq.module.fleet.title' }),
      subtitle: intl.formatMessage({ id: 'faq.module.fleet.subtitle' }),
      icon: '🚀',
      gradient: 'from-red-500 to-cyan-500',
      questions: [
        {
          question: intl.formatMessage({ id: 'faq.qa.fleet.q1' }),
          answer: intl.formatMessage({ id: 'faq.qa.fleet.a1' })
        },
        {
          question: intl.formatMessage({ id: 'faq.qa.fleet.q2' }),
          answer: intl.formatMessage({ id: 'faq.qa.fleet.a2' })
        },
        {
          question: intl.formatMessage({ id: 'faq.qa.fleet.q3' }),
          answer: intl.formatMessage({ id: 'faq.qa.fleet.a3' })
        }
      ]
    },
    {
      title: intl.formatMessage({ id: 'faq.module.mining.title' }),
      subtitle: intl.formatMessage({ id: 'faq.module.mining.subtitle' }),
      icon: '⛏️',
      gradient: 'from-cyan-500 to-pink-500',
      questions: [
        {
          question: intl.formatMessage({ id: 'faq.qa.mining.q1' }),
          answer: intl.formatMessage({ id: 'faq.qa.mining.a1' })
        },
        {
          question: intl.formatMessage({ id: 'faq.qa.mining.q2' }),
          answer: intl.formatMessage({ id: 'faq.qa.mining.a2' })
        },
        {
          question: intl.formatMessage({ id: 'faq.qa.mining.q3' }),
          answer: intl.formatMessage({ id: 'faq.qa.mining.a3' })
        }
      ]
    },
    {
      title: intl.formatMessage({ id: 'faq.module.extraction.title' }),
      subtitle: intl.formatMessage({ id: 'faq.module.extraction.subtitle' }),
      icon: '🛸',
      gradient: 'from-pink-500 to-red-500',
      questions: [
        {
          question: intl.formatMessage({ id: 'faq.qa.extraction.q1' }),
          answer: intl.formatMessage({ id: 'faq.qa.extraction.a1' })
        },
        {
          question: intl.formatMessage({ id: 'faq.qa.extraction.q2' }),
          answer: intl.formatMessage({ id: 'faq.qa.extraction.a2' })
        },
        {
          question: intl.formatMessage({ id: 'faq.qa.extraction.q3' }),
          answer: intl.formatMessage({ id: 'faq.qa.extraction.a3' })
        }
      ]
    }
  ];

  const quickAccessModules = [
    {
      icon: intl.formatMessage({ id: 'faq.quickAccess.fleetDeployment.iconLabel' }),
      title: intl.formatMessage({ id: 'faq.quickAccess.fleetDeployment.title' }),
      description: intl.formatMessage({ id: 'faq.quickAccess.fleetDeployment.description' }),
      protocolAccess: intl.formatMessage({ id: 'faq.quickAccess.fleetDeployment.protocolAccess' })
    },
    {
      icon: intl.formatMessage({ id: 'faq.quickAccess.securityProtocols.iconLabel' }),
      title: intl.formatMessage({ id: 'faq.quickAccess.securityProtocols.title' }),
      description: intl.formatMessage({ id: 'faq.quickAccess.securityProtocols.description' }),
      protocolAccess: intl.formatMessage({ id: 'faq.quickAccess.securityProtocols.protocolAccess' })
    },
    {
      icon: intl.formatMessage({ id: 'faq.quickAccess.supportFleet.iconLabel' }),
      title: intl.formatMessage({ id: 'faq.quickAccess.supportFleet.title' }),
      description: intl.formatMessage({ id: 'faq.quickAccess.supportFleet.description' }),
      protocolAccess: intl.formatMessage({ id: 'faq.quickAccess.supportFleet.protocolAccess' })
    }
  ];

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <div className="min-h-screen whitespace-normal break-all bg-gradient-to-br from-slate-950 via-red-950 to-indigo-950 relative overflow-hidden">
      {/* Animated Stars and Nebula Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-800/20 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-red-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-pink-500/10 to-red-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        
        {/* Animated Stars */}
        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-1/6 left-1/5 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
          <div className="absolute top-2/3 left-2/3 w-1 h-1 bg-red-400 rounded-full animate-ping delay-300"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-700"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-1000"></div>
        </div>
      </div>

      {/* Cosmic Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>

      <div className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
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
                    {intl.formatMessage({ id: 'faq.breadcrumb' })}
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Header */}
          <div className="text-center mb-16">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-red-600 to-cyan-600 opacity-20 animate-pulse"></div>
              </div>
              <div className="relative">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500 via-cyan-500 to-pink-500 rounded-full p-1 animate-pulse">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <div className="text-4xl">🧠</div>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-3xl whitespace-normal break-keep md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-red-400 to-pink-400 bg-clip-text text-transparent font-mono tracking-wider">
              {intl.formatMessage({ id: 'faq.header.title' })}
            </h1>
            <div className="text-xl md:text-2xl text-cyan-300 mb-4 font-mono tracking-wider">
              {intl.formatMessage({ id: 'faq.header.status' })}
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {intl.formatMessage({ id: 'faq.header.subtitle' })}
            </p>
          </div>

          {/* Knowledge Modules */}
          <div className="space-y-6">
            {knowledgeModules.map((module, index) => (
              <div key={index} className="backdrop-blur-sm bg-slate-900/40 border border-cyan-500/30 rounded-2xl overflow-hidden hover:border-red-400/40 transition-all duration-300">
                <div className="relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-cyan-500 to-pink-500 animate-pulse"></div>
                  
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full p-8 text-left hover:bg-gradient-to-r hover:from-red-500/5 hover:to-cyan-500/5 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className={`w-16 h-16 bg-gradient-to-br ${module.gradient} rounded-xl flex items-center justify-center animate-pulse`}>
                          <div className="text-2xl">{module.icon}</div>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-cyan-300 mb-2 font-mono tracking-wider">
                            {module.title}
                          </h2>
                          <p className="text-red-400 font-mono text-sm">
                            {module.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-cyan-400 hidden md:block font-mono text-sm">
                          {openSection === index ? intl.formatMessage({ id: 'faq.button.minimize' }) : intl.formatMessage({ id: 'faq.button.expand' })}
                        </div>
                        <div className={`transform transition-transform duration-300 ${openSection === index ? 'rotate-180' : ''}`}>
                          <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>

                  {openSection === index && (
                    <div className="px-8 pb-8">
                      <div className="border-t border-red-500/20 pt-6">
                        <div className="space-y-6">
                          {module.questions.map((qa, qaIndex) => (
                            <div key={qaIndex} className="backdrop-blur-sm bg-slate-800/30 border border-red-500/20 rounded-xl p-6">
                              <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                  <span className="text-white font-mono text-sm">Q</span>
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-bold text-cyan-300 mb-3 font-mono">
                                    {qa.question}
                                  </h3>
                                  <div className="flex items-start space-x-4">
                                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <span className="text-white font-mono text-sm">A</span>
                                    </div>
                                    <p className="text-gray-300 font-mono text-base">
                                      {qa.answer}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Advanced Search Protocols */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-4 font-mono tracking-wider">
              {intl.formatMessage({ id: 'faq.advancedSearch.title' })}
            </h2>
            <p className="text-center text-gray-300 mb-6">
              {intl.formatMessage({ id: 'faq.advancedSearch.description' })}
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-4">
              <button className="bg-gradient-to-r whitespace-normal break-keep from-cyan-600 to-red-600 text-white px-6 py-3 rounded-xl font-mono tracking-wider hover:from-cyan-700 hover:to-red-700 transition-all duration-300">
                {intl.formatMessage({ id: 'faq.advancedSearch.contactMissionControl' })}
              </button>
              <button className="border whitespace-normal break-keep border-cyan-500/50 text-cyan-300 px-6 py-3 rounded-xl font-mono tracking-wider hover:bg-cyan-500/10 transition-all duration-300">
                {intl.formatMessage({ id: 'faq.advancedSearch.accessHelpProtocols' })}
              </button>
            </div>
          </div>

          {/* Quick Access Modules */}
          <div className="mb-16">
            <h2 className="text-2xl whitespace-normal break-keep font-bold text-center mb-8 font-mono tracking-wider">
              {intl.formatMessage({ id: 'faq.quickAccess.title' })}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {quickAccessModules.map((module, idx) => (
                <div key={idx} className="backdrop-blur-sm bg-slate-900/40 border border-red-500/30 rounded-2xl p-8 flex flex-col items-center">
                  <div className="text-4xl mb-4">{module.icon}</div>
                  <h3 className="text-xl font-bold text-cyan-300 mb-2 font-mono tracking-wider whitespace-normal break-keep text-center">{module.title}</h3>
                  <p className="text-gray-300 text-center mb-4">{module.description}</p>
                  <button className="bg-gradient-to-r  from-red-600 to-cyan-600 text-white px-6 py-2 rounded-xl font-mono tracking-wider hover:from-red-700 hover:to-cyan-700 transition-all duration-300">
                    {module.protocolAccess}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 