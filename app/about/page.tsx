'use client';
import { useIntl } from 'react-intl';
import Link from 'next/link';

export default function About() {
  const intl = useIntl();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-indigo-950 relative overflow-hidden">
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
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>

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
              {intl.formatMessage({ id: 'pages.about.breadcrumb' })}
            </span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header with Astronaut */}
        <div className="text-center mb-20">
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-red-600 to-cyan-600 opacity-20 animate-pulse"></div>
            </div>
            <div className="relative">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500 via-cyan-500 to-pink-500 rounded-full p-1 animate-pulse">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                  <div className="text-4xl">🚀</div>
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-red-400 to-pink-400 bg-clip-text text-transparent font-mono tracking-wider">
            {intl.formatMessage({ id: 'pages.about.header.title' })}
          </h1>
          <div className="text-xl md:text-2xl text-cyan-300 mb-4 font-mono tracking-wider break-words whitespace-normal">
            [{intl.formatMessage({ id: 'pages.about.header.protocol' })}]
          </div>
          <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {intl.formatMessage({
              id: 'pages.about.subtitle',
              defaultMessage: 'Pioneering the future of cosmic resource extraction through advanced blockchain technology and autonomous mining operations'
            })}
          </p>
        </div>

        {/* Mission Control Section */}
        <div className="mb-20">
          <div className="backdrop-blur-sm bg-slate-900/40 border border-cyan-500/30 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-cyan-500 to-pink-500 animate-pulse"></div>
            <div className="absolute  top-4 right-4 text-cyan-400 font-mono text-sm opacity-60">
              [{intl.formatMessage({ id: 'pages.about.mission.status' })}]
            </div>
            
            <div className="flex items-center  mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-cyan-500 rounded-xl flex items-center justify-center mr-6 animate-pulse">
                <div className="text-2xl">🛸</div>
              </div>
              <div>
                <h2 className="text-2xl break-words whitespace-normal font-bold text-cyan-300 mb-2 font-mono tracking-wider">
                  {intl.formatMessage({ id: 'pages.about.mission.title' })}
                </h2>
                <div className="text-red-400 font-mono text-sm break-words whitespace-normal">[{intl.formatMessage({ id: 'pages.about.mission.classification' })}]</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 text-lg mt-1">▶</span>
                  <p className="text-gray-300 leading-relaxed">
                    {intl.formatMessage({ id: 'pages.about.mission.point1' })}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 text-lg mt-1">▶</span>
                  <p className="text-gray-300 leading-relaxed">
                    {intl.formatMessage({ id: 'pages.about.mission.point2' })}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 text-lg mt-1">▶</span>
                  <p className="text-gray-300 leading-relaxed">
                    {intl.formatMessage({ id: 'pages.about.mission.point3' })}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-red-400 text-lg mt-1">▶</span>
                  <p className="text-gray-300 leading-relaxed">
                    {intl.formatMessage({ id: 'pages.about.mission.point4' })}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-400 text-lg mt-1">▶</span>
                  <p className="text-gray-300 leading-relaxed">
                    {intl.formatMessage({ id: 'pages.about.mission.point5' })}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-400 text-lg mt-1">▶</span>
                  <p className="text-gray-300 leading-relaxed">
                    {intl.formatMessage({ id: 'pages.about.mission.point6' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Galactic Vision Section */}
        <div className="mb-20">
          <div className="backdrop-blur-sm bg-slate-900/40 border border-red-500/30 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-red-500 to-pink-500 animate-pulse"></div>
            <div className="absolute top-4 right-4 text-red-400 font-mono text-sm opacity-60">
              [{intl.formatMessage({ id: 'pages.about.vision.status' })}]
            </div>
            
            <div className="flex items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-red-500 rounded-xl flex items-center justify-center mr-6 animate-pulse">
                <div className="text-2xl">🌌</div>
              </div>
              <div>
                <h2 className="text-2xl break-all whitespace-normal font-bold text-red-300 mb-2 font-mono tracking-wider">
                  {intl.formatMessage({ id: 'pages.about.vision.title' })}
                </h2>
                <div className="text-cyan-400 font-mono text-sm break-all whitespace-normal">[{intl.formatMessage({ id: 'pages.about.vision.classification' })}]</div>
              </div>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              {intl.formatMessage({ id: 'pages.about.vision.description' })}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-red-900/30 to-cyan-900/30 rounded-xl p-6 border border-red-500/20">
                <div className="text-3xl mb-3">🛰️</div>
                <h3 className="text-cyan-300 font-mono text-sm mb-2">{intl.formatMessage({ id: 'pages.about.vision.card1.title' })}</h3>
                <p className="text-gray-400 text-sm">{intl.formatMessage({ id: 'pages.about.vision.card1.description' })}</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-900/30 to-pink-900/30 rounded-xl p-6 border border-cyan-500/20">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-red-300 font-mono text-sm mb-2">{intl.formatMessage({ id: 'pages.about.vision.card2.title' })}</h3>
                <p className="text-gray-400 text-sm">{intl.formatMessage({ id: 'pages.about.vision.card2.description' })}</p>
              </div>
              <div className="bg-gradient-to-br from-pink-900/30 to-red-900/30 rounded-xl p-6 border border-pink-500/20">
                <div className="text-3xl mb-3">🔬</div>
                <h3 className="text-cyan-300 font-mono text-sm mb-2">{intl.formatMessage({ id: 'pages.about.vision.card3.title' })}</h3>
                <p className="text-gray-400 text-sm">{intl.formatMessage({ id: 'pages.about.vision.card3.description' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values - Astronaut Fleet */}
        <div className="mb-20">
          <h2 className="text-2xl whitespace-normal break-all font-bold text-center mb-12 font-mono tracking-wider">
            <span className="bg-gradient-to-r from-cyan-400 to-red-400 bg-clip-text text-transparent">
              {intl.formatMessage({ id: 'pages.about.fleet.title' })}
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: intl.formatMessage({ id: 'pages.about.fleet.card1.title' }),
                description: intl.formatMessage({ id: 'pages.about.fleet.card1.description' }),
                icon: "🛡️",
                color: "from-red-500 to-cyan-500"
              },
              {
                title: intl.formatMessage({ id: 'pages.about.fleet.card2.title' }),
                description: intl.formatMessage({ id: 'pages.about.fleet.card2.description' }),
                icon: "📡",
                color: "from-cyan-500 to-pink-500"
              },
              {
                title: intl.formatMessage({ id: 'pages.about.fleet.card3.title' }),
                description: intl.formatMessage({ id: 'pages.about.fleet.card3.description' }),
                icon: "⚙️",
                color: "from-pink-500 to-red-500"
              },
              {
                title: intl.formatMessage({ id: 'pages.about.fleet.card4.title' }),
                description: intl.formatMessage({ id: 'pages.about.fleet.card4.description' }),
                icon: "🌟",
                color: "from-red-500 to-cyan-500"
              }
            ].map((value, index) => (
              <div 
                key={index}
                className="backdrop-blur-sm bg-slate-900/40 border border-cyan-500/20 rounded-2xl p-8 hover:border-red-400/40 transition-all duration-300 hover:transform hover:scale-105 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="flex items-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mr-6 animate-pulse`}>
                    <div className="text-2xl">{value.icon}</div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-cyan-300 mb-2 font-mono tracking-wider">
                      {value.title}
                    </h3>
                    <div className="text-red-400 font-mono text-xs">[{intl.formatMessage({ id: `pages.about.fleet.card${index + 1}.status` })}]</div>
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Statistics */}
        <div className="mb-20">
          <div className="backdrop-blur-sm bg-slate-900/40 border border-cyan-500/30 rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-red-500 to-pink-500 animate-pulse"></div>
            <div className="absolute top-4 right-4 text-cyan-400 font-mono text-sm opacity-60">
              [{intl.formatMessage({ id: 'pages.about.metrics.status' })}]
            </div>
            
            <h2 className="text-2xl whitespace-normal break-all font-bold text-center mb-12 font-mono tracking-wider">
              <span className="bg-gradient-to-r from-red-400 to-cyan-400 bg-clip-text text-transparent">
                {intl.formatMessage({ id: 'pages.about.metrics.title' })}
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4">
                <div className="text-4xl font-bold font-mono">
                  <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                    {intl.formatMessage({ id: 'pages.about.metrics.uptime.value' })}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-cyan-300 font-mono">{intl.formatMessage({ id: 'pages.about.metrics.uptime.title' })}</h3>
                <p className="text-gray-400 text-sm">{intl.formatMessage({ id: 'pages.about.metrics.uptime.description' })}</p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl font-bold font-mono">
                  <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                    {intl.formatMessage({ id: 'pages.about.metrics.encryption.value' })}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-red-300 font-mono">{intl.formatMessage({ id: 'pages.about.metrics.encryption.title' })}</h3>
                <p className="text-gray-400 text-sm">{intl.formatMessage({ id: 'pages.about.metrics.encryption.description' })}</p>
              </div>
              <div className="space-y-4">
                <div className="text-4xl font-bold font-mono">
                  <span className="bg-gradient-to-r from-cyan-400 to-red-400 bg-clip-text text-transparent">
                    {intl.formatMessage({ id: 'pages.about.metrics.monitoring.value' })}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-cyan-300 font-mono">{intl.formatMessage({ id: 'pages.about.metrics.monitoring.title' })}</h3>
                <p className="text-gray-400 text-sm">{intl.formatMessage({ id: 'pages.about.metrics.monitoring.description' })}</p>
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
            <h2 className="text-2xl whitespace-normal break-all font-bold mb-6 font-mono tracking-wider">
              <span className="bg-gradient-to-r from-cyan-400 to-red-400 bg-clip-text text-transparent">
                {intl.formatMessage({ id: 'pages.about.cta.title' })}
              </span>
            </h2>
            
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              {intl.formatMessage({
                id: 'pages.about.cta.description',
                defaultMessage: 'Ready to become part of the cosmic mining revolution? Join thousands of space miners already building their galactic empire.'
              })}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/enlist"
                className="bg-gradient-to-r from-red-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-mono tracking-wider hover:from-red-700 hover:to-cyan-700 whitespace-normal break-all transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
              >
                [{intl.formatMessage({ id: 'pages.about.cta.register' })}]
              </Link>
              <Link
                href="/how-it-works"
                className="border border-cyan-500/50 text-cyan-300 px-8 py-4 rounded-xl font-mono tracking-wider hover:bg-cyan-500/10 transition-all duration-300 transform hover:scale-105"
              >
                [{intl.formatMessage({ id: 'pages.about.cta.explore' })}]
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}