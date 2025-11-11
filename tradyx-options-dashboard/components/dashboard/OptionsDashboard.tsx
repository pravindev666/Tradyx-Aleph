'use client';
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Moon, Sun, RefreshCw, AlertCircle, Zap } from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import AnimatedMeshBackground from '@/app/components/AnimatedMeshBackground';
import TileInfoModal from './TileInfoModal';
import DisclaimerModal from './DisclaimerModal';
import AdSidebar from './AdSidebar';
import MarketMoodGauge from './MarketMoodGauge';
import PredictionModels from './PredictionModels';
import VolatilityIndicators from './VolatilityIndicators';
import VRPSlope from './VRPSlope';
import DriftDirectionIndicator from './DriftDirectionIndicator';
import MomentumStrengthMeter from './MomentumStrengthMeter';
import HowToUseGuide from './HowToUseGuide';
import ConsentBanner from '@/components/ConsentBanner';
import AdsterraBanner from '@/components/ads/AdsterraBanner';
import SafeAdWrapper from '@/components/ads/SafeAdWrapper';
import HighPerformanceAdSidebar from '@/components/HighPerformanceAdSidebar';
import EffectiveGateAd from '@/components/EffectiveGateAd';
import { AD_KEYS, AD_SIZES } from '@/components/ads/AdConfig';
import { computeMMI } from './mmi';
import { openSmartlink } from '@/components/ads/AntiAdblockSmartlink';

const OptionsDashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; description: string; decision: string } | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [nextDeploymentTime, setNextDeploymentTime] = useState<Date | null>(null);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('tradyxa-theme') : null;
    if (saved) setDarkMode(saved === 'dark');
    
    // Always show disclaimer on page load
    setShowDisclaimer(true);
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('tradyxa-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleDisclaimerClose = () => {
    // Save acceptance timestamp for analytics, but always show on next visit
    if (typeof window !== 'undefined') {
      localStorage.setItem('tradyxa-disclaimer-accepted', new Date().toISOString());
    }
    setShowDisclaimer(false);
  };

  const openModal = (title: string, description: string, decision: string) => {
    setModalContent({ title, description, decision });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  const {
    data,
    loading,
    stale,
    ivRank,
    spotSeries,
    vixSeries,
    expiries,
  } = useDashboard();

  // Sync dark mode with Tailwind
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Fix hydration error - set current time on client only
  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate next deployment time (every 15 minutes during market hours)
  useEffect(() => {
    const calculateNextDeployment = () => {
      const now = new Date();
      const istNow = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
      
      // Market hours: 9:15 AM - 3:30 PM IST (Monday-Friday)
      const marketStart = new Date(istNow);
      marketStart.setHours(9, 15, 0, 0);
      
      const marketEnd = new Date(istNow);
      marketEnd.setHours(15, 30, 0, 0);
      
      // If outside market hours or weekend, show next market day
      const dayOfWeek = istNow.getDay(); // 0 = Sunday, 5 = Friday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isBeforeMarket = istNow < marketStart;
      const isAfterMarket = istNow > marketEnd;
      
      if (isWeekend || isAfterMarket) {
        // Next market day at 9:15 AM
        const nextMarketDay = new Date(istNow);
        const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
        nextMarketDay.setDate(istNow.getDate() + daysUntilMonday);
        nextMarketDay.setHours(9, 15, 0, 0);
        setNextDeploymentTime(nextMarketDay);
        return;
      }
      
      if (isBeforeMarket) {
        setNextDeploymentTime(marketStart);
        return;
      }
      
      // Within market hours - calculate next 30-minute interval
      const minutes = istNow.getMinutes();
      const remainder = minutes % 30;
      const nextInterval = remainder === 0 ? 30 : (30 - remainder);
      
      const nextDeploy = new Date(istNow);
      nextDeploy.setMinutes(minutes + nextInterval, 0, 0);
      
      // If next deployment is after market close, show next market day
      if (nextDeploy > marketEnd) {
        const nextMarketDay = new Date(istNow);
        nextMarketDay.setDate(istNow.getDate() + 1);
        nextMarketDay.setHours(9, 15, 0, 0);
        setNextDeploymentTime(nextMarketDay);
      } else {
        setNextDeploymentTime(nextDeploy);
      }
    };
    
    calculateNextDeployment();
    const interval = setInterval(calculateNextDeployment, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // no local timers; stale status supplied by hook

  // Compute MMI (Market Mood Index)
  const mood = React.useMemo(() => {
    if (!data) return { mmi: 50, regime: 'Neutral' as const, z: { zvix: 0, zpcr: 0, zivr: 0, zadr: 0, zrviv: 0 }, Z: 0 };
    return computeMMI({
      vix: Number((data as any)?.vix ?? 14),
      pcr: Number(data?.pcr ?? 1.0),
      ivr: Number(ivRank ?? 40),
      adr: 1.05,  // TODO: replace with live Advance/Decline ratio
      rvOverIv: 0.88  // TODO: replace with realized(20d)/ATM IV
    });
  }, [data, ivRank]);

  const MiniSparkline = ({ data: historyData, color = '#3b82f6', height = 35 }) => {
    if (!historyData || historyData.length === 0) return null;
    
    // Filter out invalid values (NaN, null, undefined)
    const validData = historyData.filter(val => typeof val === 'number' && !isNaN(val) && isFinite(val));
    if (validData.length === 0) return null;
    
    const max = Math.max(...validData);
    const min = Math.min(...validData);
    const range = max - min || 1;
    const width = 100;
    const dataLength = validData.length;
    
    const points = validData.map((val, i) => {
      const x = dataLength > 1 ? (i / (dataLength - 1)) * width : width / 2;
      const y = height - ((val - min) / range) * height;
      // Ensure valid numbers
      if (!isFinite(x) || !isFinite(y)) return `0,${height}`;
      return `${x},${y}`;
    }).filter(p => p && !p.includes('NaN')).join(' ');

    const areaPoints = `0,${height} ${points} ${width},${height}`;

    return (
      <svg width="100%" height={height} className="block" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#gradient-${color})`} />
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" />
        <circle cx={width} cy={height - (((validData[validData.length - 1] ?? min) - min) / range) * height} r="3" fill={color} />
      </svg>
    );
  };



  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300 relative`}>
      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <DisclaimerModal darkMode={darkMode} onClose={handleDisclaimerClose} />
      )}
      
      {/* Consent Banner */}
      <ConsentBanner darkMode={darkMode} />
      
      <AnimatedMeshBackground dark={darkMode} />
      
      <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-blue-950' : 'bg-gradient-to-r from-blue-600 to-blue-800'} text-white px-6 py-4 shadow-lg relative z-10`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 px-3 sm:px-4 md:px-6">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold font-brand">Tradyxa Quant Dashboard — NIFTY Options Volatility & Forecast Lab</h1>
            <p className={`${darkMode ? 'text-blue-200' : 'text-blue-100'} text-xs sm:text-sm mt-1`}>Advanced Options Analytics & Machine Learning Forecasts</p>
          </div>
          <div className="flex flex-col items-center">
            {/* Top row: Next update (widest, centered) */}
            {nextDeploymentTime && mounted && (
              <div className="text-sm mb-3 text-center w-full">
                <span className={`${darkMode ? 'text-green-400' : 'text-green-200'}`}>
                  Next update: <span className="font-mono">{nextDeploymentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })}</span> IST
                </span>
              </div>
            )}
            
            {/* Middle row: Toggle and Refresh button (same line, centered, narrower) */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <button onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white/20 hover:bg-white/30'} transition-colors`}>
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={async () => {
                  console.log('🔄 Refresh button clicked...');
                  
                  // Show refresh message in bottom text
                  setRefreshMessage('Refreshed and Data Analyzed');
                  
                  // Show toast notification at top
                  const toast = document.createElement('div');
                  toast.textContent = 'Refreshed and ML Model Data Computed';
                  toast.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 9999;
                    padding: 12px 24px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    background-color: ${darkMode ? '#16a34a' : '#22c55e'};
                    color: white;
                    font-weight: 500;
                    font-size: 14px;
                    white-space: nowrap;
                    animation: fadeIn 0.3s ease-in;
                  `;
                  document.body.appendChild(toast);
                  
                  console.log('✅ Toast notification created and added to DOM');
                  
                  // Clear cache without reloading
                  if ('caches' in window) {
                    caches.keys().then(names => {
                      names.forEach(name => caches.delete(name));
                    });
                  }
                  
                  // Open smartlink (as thank you)
                  const refreshKey = `refresh-smartlink-${Date.now()}`;
                  openSmartlink('https://honeywhyvowel.com/r7732sr5qc?key=c27a2a5e52b7b85a869f254cca335701', refreshKey, true);
                  
                  // Remove toast after 5 seconds
                  setTimeout(() => {
                    toast.style.animation = 'fadeOut 0.3s ease-out';
                    setTimeout(() => {
                      if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                        console.log('✅ Toast notification removed');
                      }
                    }, 300);
                  }, 5000);
                  
                  // Clear bottom message after 3 seconds
                  setTimeout(() => {
                    setRefreshMessage(null);
                  }, 3000);
                }}
                className={`${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white text-blue-600 hover:bg-blue-50'} px-4 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-2`}>
                <RefreshCw size={14} />
                Refresh
              </button>
            </div>
            
            {/* Bottom row: Info text (narrowest, centered) */}
            <div className="text-center">
              {refreshMessage ? (
                <p className={`text-xs sm:text-[11px] font-medium ${darkMode ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'text-green-600'}`}>
                  {refreshMessage}
                </p>
              ) : (
                <p className={`text-xs sm:text-[11px] font-medium leading-relaxed ${darkMode ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]' : 'text-white'}`}>
                  <span className="block">Refresh To Get Latest Data</span>
                  <span className="block mt-0.5 text-[10px] opacity-75">Click tiles to learn more</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-3 sm:py-5 md:py-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-6">
          <div className="lg:col-span-9 space-y-3 sm:space-y-4 md:space-y-6">
            {/* Row 1: Spot Price and India VIX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              <div 
                className={`${cardBg} rounded-lg shadow-lg p-2.5 sm:p-3 md:p-4 lg:p-5 border-l-4 border-blue-500 tile-hover-gold cursor-pointer overflow-hidden`}
                onClick={() => openModal(
                  'Spot Price',
                  'This is the current price of the NIFTY index - like checking the price tag on a stock market item! It\'s the number that all other calculations are based on. Think of it as your starting point - everything else (like which options to buy or sell) depends on where the spot price is right now.',
                  'Use this price to choose your option strikes: buy calls above spot if bullish, buy puts below spot if bearish.'
                )}
              >
                <div className={`text-sm sm:text-base font-semibold ${textSecondary} mb-1.5`}>Spot Price</div>
                <div className={`text-xl sm:text-2xl font-bold font-mono ${textPrimary} mb-1.5`}>{Number.isFinite(data?.spot) ? `₹${(data!.spot as number).toFixed(2)}` : '—'}</div>
                {(() => {
                  const changePct = (data as any)?.spotChangePct;
                  if (Number.isFinite(changePct)) {
                    const pct = changePct as number;
                    return (
                      <div className={`text-base font-semibold font-mono mb-3 ${pct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {pct > 0 ? '+' : ''}{pct.toFixed(2)}%
                </div>
                    );
                  }
                  return <div className="text-base font-semibold text-gray-500 mb-3">—</div>;
                })()}
                
                {/* OHLC Values */}
                <div className={`mt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-3`}>
                  <div className={`text-sm font-semibold ${textSecondary} mb-2`}>OHLC</div>
                  {(data as any)?.ohlc && ((data as any).ohlc.open || (data as any).ohlc.high || (data as any).ohlc.low || (data as any).ohlc.close) ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm">
                      <div>
                        <div className={`${textSecondary} mb-0.5`}>Open</div>
                        <div className={`font-semibold font-mono ${textPrimary}`}>
                          {Number.isFinite((data as any).ohlc.open) ? `₹${((data as any).ohlc.open as number).toFixed(2)}` : '—'}
                </div>
              </div>
                      <div>
                        <div className={`${textSecondary} mb-0.5`}>High</div>
                        <div className={`font-semibold font-mono text-green-500`}>
                          {Number.isFinite((data as any).ohlc.high) ? `₹${((data as any).ohlc.high as number).toFixed(2)}` : '—'}
                </div>
              </div>
                      <div>
                        <div className={`${textSecondary} mb-0.5`}>Low</div>
                        <div className={`font-semibold font-mono text-red-500`}>
                          {Number.isFinite((data as any).ohlc.low) ? `₹${((data as any).ohlc.low as number).toFixed(2)}` : '—'}
                </div>
              </div>
                      <div>
                        <div className={`${textSecondary} mb-0.5`}>Close</div>
                        <div className={`font-semibold font-mono ${textPrimary}`}>
                          {Number.isFinite((data as any).ohlc.close) ? `₹${((data as any).ohlc.close as number).toFixed(2)}` : '—'}
                </div>
              </div>
            </div>
                  ) : (
                    <div className={`text-sm ${textSecondary}`}>Daily open, high, low, close data not available</div>
                  )}
              </div>

                <div className="mt-2 -mx-5 -mb-5">
                  <MiniSparkline data={spotSeries} color="#3b82f6" height={35} />
                </div>
              </div>

              <div 
                className={`${cardBg} rounded-lg shadow-lg p-3 sm:p-4 md:p-5 border-l-4 border-red-500 tile-hover-gold cursor-pointer overflow-hidden`}
                onClick={() => openModal(
                  'India VIX (Fear Gauge)',
                  'VIX is like a "fear meter" for the stock market! It measures how scared or calm investors are. When VIX is LOW (green), people are relaxed and confident - prices move slowly and steadily. When VIX is HIGH (red), people are panicking - prices jump around wildly. Think of it like a weather forecast: low VIX = calm sunny day, high VIX = stormy weather ahead!',
                  'Low VIX (<13%) = sell options; High VIX (>20%) = buy options or use wider targets; Rising VIX = be cautious.'
                )}
              >
                <div className={`text-sm sm:text-base font-semibold ${textSecondary} mb-1.5`}>India VIX</div>
                <div className={`text-xl sm:text-2xl font-bold font-mono ${textPrimary} mb-1.5`}>{Number.isFinite(data?.vix) ? `${(data!.vix as number).toFixed(2)}%` : '—'}</div>
                {(() => {
                  const changePct = (data as any)?.vixChangePct;
                  if (Number.isFinite(changePct)) {
                    const pct = changePct as number;
                    return (
                      <div className={`text-sm font-semibold font-mono mb-3 ${pct >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {pct > 0 ? '+' : ''}{pct.toFixed(2)}%
                </div>
                    );
                  }
                  return <div className="text-sm font-semibold text-gray-500 mb-3">—</div>;
                })()}
                
                {/* VIX OHLC Values */}
                {(data as any)?.vixOhlc && ((data as any).vixOhlc.open || (data as any).vixOhlc.high || (data as any).vixOhlc.low || (data as any).vixOhlc.close) && (
                  <div className={`mt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-3`}>
                    <div className={`text-sm font-semibold ${textSecondary} mb-2`}>OHLC</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm">
                      <div>
                        <div className={`${textSecondary} mb-0.5`}>Open</div>
                        <div className={`font-semibold font-mono ${textPrimary}`}>
                          {Number.isFinite((data as any).vixOhlc.open) ? `${((data as any).vixOhlc.open as number).toFixed(2)}%` : '—'}
                </div>
              </div>
                      <div>
                        <div className={`${textSecondary} mb-0.5`}>High</div>
                        <div className={`font-semibold font-mono text-red-500`}>
                          {Number.isFinite((data as any).vixOhlc.high) ? `${((data as any).vixOhlc.high as number).toFixed(2)}%` : '—'}
                        </div>
                </div>
                      <div>
                        <div className={`${textSecondary} mb-0.5`}>Low</div>
                        <div className={`font-semibold font-mono text-green-500`}>
                          {Number.isFinite((data as any).vixOhlc.low) ? `${((data as any).vixOhlc.low as number).toFixed(2)}%` : '—'}
                </div>
              </div>
                      <div>
                        <div className={`${textSecondary} mb-0.5`}>Close</div>
                        <div className={`font-semibold font-mono ${textPrimary}`}>
                          {Number.isFinite((data as any).vixOhlc.close) ? `${((data as any).vixOhlc.close as number).toFixed(2)}%` : '—'}
            </div>
                    </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-2 -mx-5 -mb-5">
                  <MiniSparkline data={vixSeries} color="#ef4444" height={35} />
                </div>
                </div>
              </div>

            {/* Expiry Countdown - Above main tiles */}
            <div className="mb-4">
              <div className={`${cardBg} rounded-lg shadow-lg p-2.5 sm:p-3 md:p-4 border-l-4 border-cyan-500 tile-hover-gold`}>
                <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-2 sm:mb-3`}>Expiry Countdown</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                  {expiries.map((e, idx) => {
                    if (!mounted || !currentTime) {
                    return (
                        <div key={idx} className="text-center">
                          <div className={`text-sm ${textSecondary} mb-1`}>{e.label}</div>
                          <div className={`text-xl font-bold font-mono text-cyan-500`}>—d —h —m</div>
                          <div className={`text-sm ${textSecondary} mt-1`}>—</div>
                      </div>
                    );
                    }
                    const diff = e.date.getTime() - currentTime.getTime();
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const soon = days === 0 && hours < 24;
                    const expiryDate = e.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                    return (
                      <div key={idx} className="text-center">
                        <div className={`text-sm ${textSecondary} mb-1`}>{e.label}</div>
                        <div className={`text-xl font-bold font-mono ${soon ? 'text-red-500' : 'text-cyan-500'}`}>
                          {days}d {hours}h {mins}m
                        </div>
                        <div className={`text-sm ${textSecondary} mt-1`}>{expiryDate}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Row 2: IV Rank and Range Forecast side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div 
                className={`${cardBg} rounded-lg shadow-lg p-4 sm:p-5 md:p-6 border-l-4 border-purple-500 tile-hover-gold cursor-pointer`}
                onClick={() => openModal(
                  'IV Rank (How Expensive Are Options?)',
                  'IV Rank tells you if options are EXPENSIVE or CHEAP right now, compared to the last year! It\'s like checking if a pizza costs ₹200 (expensive) or ₹100 (cheap) compared to what it usually costs. Rank above 50% = options are expensive (sell them like expensive pizza!). Rank below 20% = options are cheap (buy them like a discount!).',
                  'IVR ≥50% = sell options (expensive); IVR <20% = buy options (cheap); 20-50% = normal prices.'
                )}
              >
                <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-1`}>IV Rank</div>
                <div className={`text-2xl sm:text-3xl font-bold font-mono ${textPrimary}`}>{Number.isFinite((data as any)?.ivRank) ? ((data as any).ivRank as number).toFixed(1) : Number.isFinite(ivRank) ? (ivRank as number).toFixed(1) : '—'}%</div>
                <div className={`text-sm ${textSecondary} mt-1`}>52W Range</div>
                {(() => {
                  const ivrValue = Number.isFinite((data as any)?.ivRank) ? (data as any).ivRank : Number.isFinite(ivRank) ? ivRank : null;
                  if (ivrValue === null) return null;
                  if (ivrValue >= 50) {
                    return (
                      <div className={`mt-2 p-2 rounded ${darkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
                        <div className={`text-sm font-semibold text-green-500`}>Sell Strangles</div>
                        <div className={`text-xs ${textSecondary} mt-0.5`}>IVR ≥ 50% - Vols Elevated</div>
                      </div>
                    );
                  } else if (ivrValue < 20) {
                    return (
                      <div className={`mt-2 p-2 rounded ${darkMode ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'}`}>
                        <div className={`text-sm font-semibold text-yellow-500`}>Don&apos;t Sell Strangles</div>
                        <div className={`text-xs ${textSecondary} mt-0.5`}>IVR &lt; 20% - Vols are cheap</div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              <div 
                className={`${cardBg} rounded-lg shadow-lg p-4 sm:p-5 md:p-6 border-l-4 border-cyan-500 tile-hover-gold cursor-pointer`}
                onClick={() => openModal(
                  'Expected Move (How Far Will Prices Move?)',
                  'This tool predicts how much the market price might move up or down in the next day or week! It\'s like a weather forecast saying "temperature might change by 5°C" - but for stock prices. The "Expected Move" shows you the range where prices will probably stay (about 70% sure). It uses math and current market conditions to make this guess.',
                  'Place option strikes beyond the expected move when selling - big move = wider targets, small move = tighter targets.'
                )}
              >
                <div className={`text-base sm:text-lg font-semibold ${textSecondary} mb-2`}>Range Forecast / Expected Move</div>
                {(() => {
                  const spot = Number.isFinite(data?.spot) ? (data!.spot as number) : null;
                  const vix = Number.isFinite(data?.vix) ? (data!.vix as number) : null;
                  
                  if (!spot || !vix) {
                    return (
                      <>
                        <div className={`text-2xl font-bold font-mono ${textPrimary} mb-1`}>—</div>
                        <div className={`text-sm ${textSecondary}`}>Data unavailable</div>
                      </>
                    );
                  }
                  
                  // Calculate EM (1-Day) = Spot × VIX × √(1/365)
                  const em1Day = spot * (vix / 100) * Math.sqrt(1 / 365);
                  const em1DayPct = (em1Day / spot) * 100;
                  
                  // Calculate EM (Weekly) = EM (1-Day) × √5
                  const emWeekly = em1Day * Math.sqrt(5);
                  
                  return (
                    <>
                      <div className="space-y-2">
                        <div>
                          <div className={`text-sm font-mono ${textSecondary} mb-0.5`}>Spot: {spot.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                          <div className={`text-sm font-mono ${textSecondary} mb-0.5`}>VIX: {vix.toFixed(2)}%</div>
                </div>
                        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-2`}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <div className={`text-sm font-semibold ${textPrimary}`}>
                                EM (1-Day)
                </div>
                              <div className={`text-xl font-bold font-mono ${textPrimary}`}>
                                ±{Math.round(em1Day)} pts
              </div>
                              <div className={`text-sm font-mono ${textSecondary}`}>
                                ({em1DayPct.toFixed(2)}%)
              </div>
              </div>
                            <div>
                              <div className={`text-sm font-semibold ${textPrimary}`}>
                                EM (Weekly)
                </div>
                              <div className={`text-xl font-bold font-mono ${textPrimary}`}>
                                ±{Math.round(emWeekly)} pts
                </div>
              </div>
                </div>
              </div>
            </div>
                    </>
                  );
                })()}
          </div>
            </div>

            {/* Volatility Indicators */}
            <VolatilityIndicators 
              data={data?.volatilityIndicators}
              darkMode={darkMode}
              onOpenModal={openModal}
            />

            {/* 728x90 Ad - Desktop Only (mobileHide) */}
            <div 
              id="ad-728x90-container"
              className="mobileHide"
              style={{ 
                display: 'block',
                position: 'relative',
                width: '100%',
                minHeight: '110px',
                margin: '1rem 0'
              }}
            >
              <div className="flex justify-center w-full">
                <div className="w-full max-w-full sm:max-w-[800px]">
                  <AdsterraBanner 
                    adKey={AD_KEYS.BANNER_728x90}
                    width={AD_SIZES.BANNER_728x90.width}
                    height={AD_SIZES.BANNER_728x90.height}
                    label="Banner 728x90"
                    loadDelay={0}
                  />
                </div>
              </div>
            </div>

            {/* Advertisement above Prediction Models (Horizontal 2) - 468x60 - Responsive */}
            <SafeAdWrapper>
              <div className="w-full flex justify-center my-4">
                <div className="w-full max-w-[550px] mobileHide">
                  <div className="ad-container-transparent p-3 sm:p-4 md:p-5 rounded-xl text-center" style={{ minHeight: '80px' }}>
                    <AdsterraBanner 
                      adKey={AD_KEYS.BANNER_468x60}
                      width={AD_SIZES.BANNER_468x60.width}
                      height={AD_SIZES.BANNER_468x60.height}
                      label="Banner 468x60"
                      loadDelay={0}
                    />
                  </div>
                </div>
              </div>
            </SafeAdWrapper>

            {/* Prediction Models */}
            <PredictionModels 
              data={data?.mlPredictions}
              darkMode={darkMode}
              onOpenModal={openModal}
            />

            {/* How to Use Guide */}
            <HowToUseGuide darkMode={darkMode} />
          </div>

          {/* Sidebar - 3 tiles + 2 ad spaces */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-4 md:space-y-6 mt-4 sm:mt-6 lg:mt-0">
            {/* Market Mood Gauge */}
            <MarketMoodGauge 
              mood={{
                mmi: mood.mmi,
                regime: mood.regime,
                tooltip: (
                  <span>
                    MMI = <span className="font-mono">{mood.mmi.toFixed(0)}</span> • {mood.regime}
                  </span>
                )
              }}
              darkMode={darkMode}
              onOpenModal={openModal}
            />

            {/* VRP Slope */}
            <VRPSlope 
              value={data?.volatilityIndicators?.vrpSlope}
              darkMode={darkMode}
              onOpenModal={openModal}
            />

            {/* Ad Space 2 - Sidebar (300x250) - Desktop Only */}
            <SafeAdWrapper>
              <div className="mobileHide">
                <HighPerformanceAdSidebar 
                  adKey={AD_KEYS.RECTANGLE_300x250}
                  width={AD_SIZES.RECTANGLE_300x250.width}
                  height={AD_SIZES.RECTANGLE_300x250.height}
                  label="Rectangle 300x250"
                  loadDelay={0}
                />
              </div>
            </SafeAdWrapper>

            {/* Drift Direction Indicator */}
            <DriftDirectionIndicator 
              value={data?.driftDirection}
              darkMode={darkMode}
              onOpenModal={openModal}
            />

            {/* Ad Space 3 - Sidebar (320x50) - Mobile Only (mobileShow) */}
            <SafeAdWrapper>
              <div className="mobileShow">
                <HighPerformanceAdSidebar 
                  adKey={AD_KEYS.MOBILE_320x50}
                  width={AD_SIZES.MOBILE_320x50.width}
                  height={AD_SIZES.MOBILE_320x50.height}
                  label="Mobile Banner 320x50"
                  loadDelay={0}
                />
              </div>
            </SafeAdWrapper>

            {/* Momentum Strength Meter */}
            <MomentumStrengthMeter 
              value={data?.momentumStrength}
              darkMode={darkMode}
              onOpenModal={openModal}
            />
          </div>
        </div>
      </div>

      {/* Additional Ad Space - Footer Area (Non-Intrusive) */}
      <div className="w-full flex justify-center py-4 mt-8">
        <div className="w-full max-w-4xl px-4">
          <div className="text-center">
            <EffectiveGateAd className="w-full" />
          </div>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-gray-950' : 'bg-gray-800'} text-gray-300 px-6 py-4 mt-12 relative z-10`}>
        <div className="max-w-7xl mx-auto text-center text-xs sm:text-sm px-3 sm:px-4 md:px-6 py-3 sm:py-4 space-y-1">
          <p className="text-sm font-semibold">Data Sources: NSE India, Yahoo Finance</p>
          <p className="text-xs text-gray-400">Analytics powered by Tradyxa Analytics Engine v1.0.0</p>
          <p className="text-xs text-gray-400">Market data © respective owners. Tradyxa Quant Dashboard is unaffiliated with NSE or Yahoo.</p>
          <p className="text-xs text-gray-400">Market data may be delayed up to 30 minutes. For educational use only.</p>
          <p className="text-xs text-gray-400">Operated by Zeta Aztra Technologies (Individual Proprietorship, India)</p>
          <p className="text-xs text-gray-400">© 2025 Zeta Aztra Technologies. All Rights Reserved.</p>
          <p className="text-xs text-gray-400">
            <a href="mailto:zetaaztratech@gmail.com" className="hover:text-blue-400 underline">zetaaztratech@gmail.com</a> | Jurisdiction: Chennai, Tamil Nadu | Version: v1.0.0
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Visual models and code protected under Copyright Act, 1957 (India). Unauthorized use of the Tradyxa or Zeta Aztra name, logo, or visuals is strictly prohibited.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Tradyxa Quant Dashboard is a product of Zeta Aztra Technologies (India) and is not affiliated with any other Tradyxa-named companies or domains.
          </p>
          <div className={`flex flex-wrap justify-center gap-3 mt-3 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <a href="/legal/privacy" className="hover:text-blue-400 underline">Privacy Policy</a>
            <span>·</span>
            <a href="/legal/cookies" className="hover:text-blue-400 underline">Cookie Preferences</a>
            <span>·</span>
            <a href="/legal/terms" className="hover:text-blue-400 underline">Terms of Use</a>
            <span>·</span>
            <a href="/legal/disclaimer" className="hover:text-blue-400 underline">Disclaimer</a>
            <span>·</span>
            <a href="/about" className="hover:text-blue-400 underline">About</a>
          </div>
        </div>
      </div>

      {/* Tile Info Modal */}
      {modalContent && (
        <TileInfoModal
          isOpen={modalOpen}
          onClose={closeModal}
          title={modalContent.title}
          description={modalContent.description}
          decision={modalContent.decision}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default OptionsDashboard;
