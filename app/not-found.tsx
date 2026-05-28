"use client"
import { useIntl } from 'react-intl';

export default function NotFound() {
  const intl = useIntl();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
      {/* Animated space background */}
      <div className="absolute inset-0 bg-space-deep"></div>
      <div className="absolute inset-0 bg-stars-animation"></div>
      
      {/* Floating cosmic elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-red-500/20 rounded-full blur-2xl animate-pulse"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
      
      <div className="relative z-10 max-w-2xl mx-auto px-4">
        {/* Astronaut Lost Animation */}
        <div className="mb-8 relative">
          <div className="text-8xl md:text-9xl mb-4 animate-bounce">
            👨‍🚀
          </div>
          <div className="absolute -top-4 -right-4 text-2xl animate-spin">
            🌌
          </div>
        </div>
        
        {/* Error Code */}
        <div className="mb-8">
          <h1 className="font-exo2 text-8xl md:text-9xl font-900 text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-pink-300 to-cyan-300 mb-4 tracking-wider">
            404
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-red-400"></div>
            <span className="font-mono text-sm text-gray-300 tracking-wider">{intl.formatMessage({ id: 'notFound.sectorNotFound' })}</span>
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-blue-400"></div>
          </div>
        </div>
        
        {/* Error Message */}
        <div className="mb-12">
          <h2 className="font-exo2 text-2xl md:text-3xl font-bold text-white mb-4">
            {intl.formatMessage({ id: 'notFound.lostExplorer' })}
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            {intl.formatMessage({ id: 'notFound.unexploredSector' })} <span className="text-red-300 font-semibold"></span>
            {intl.formatMessage({ id: 'notFound.notMapped' })}
          </p>
          
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="astro-status-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono text-gray-300">{intl.formatMessage({ id: 'notFound.gpsSignal' })}</span>
              </div>
              <span className="text-red-400 font-bold">{intl.formatMessage({ id: 'notFound.lost' })}</span>
            </div>
            
            <div className="astro-status-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono text-gray-300">{intl.formatMessage({ id: 'notFound.fuel' })}</span>
              </div>
              <span className="text-yellow-400 font-bold">{intl.formatMessage({ id: 'notFound.low' })}</span>
            </div>
            
            <div className="astro-status-card">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono text-gray-300">{intl.formatMessage({ id: 'notFound.communication' })}</span>
              </div>
              <span className="text-green-400 font-bold">{intl.formatMessage({ id: 'notFound.active' })}</span>
            </div>
          </div>
        </div>
        
        {/* Navigation Options */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a
            href="/"
            className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-lg border-0 shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2">
              <span>🚀</span>
              {intl.formatMessage({ id: 'notFound.returnBase' })}
            </span>
          </a>
          
          <a
            href="/command-center"
            className="group relative overflow-hidden bg-transparent border-2 border-red-500/50 text-red-300 hover:bg-red-500/10 font-bold py-4 px-8 rounded-lg hover:border-red-400 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              <span>🏠</span>
              {intl.formatMessage({ id: 'notFound.commandCenter' })}
            </span>
          </a>
        </div>
        
        {/* Fun Messages */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400 font-mono">
            {intl.formatMessage({ id: 'notFound.funMessage' })}
          </p>
        </div>
      </div>
      
      {/* Floating cosmic debris */}
      <div className="absolute top-1/4 left-1/4 text-2xl opacity-20 animate-float">⭐</div>
      <div className="absolute top-1/3 right-1/3 text-xl opacity-30 animate-float-delay-1">🌙</div>
      <div className="absolute bottom-1/4 right-1/4 text-2xl opacity-20 animate-float-delay-2">🛸</div>
      <div className="absolute bottom-1/3 left-1/3 text-xl opacity-30 animate-float-delay-3">💫</div>
    </main>
  );
} 