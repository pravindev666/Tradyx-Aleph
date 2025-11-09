'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, TrendingUp, BarChart3, Brain, AlertTriangle, Target } from 'lucide-react';
import AntiAdblockSmartlink from '@/components/ads/AntiAdblockSmartlink';

interface HowToUseGuideProps {
  darkMode: boolean;
}

export default function HowToUseGuide({ darkMode }: HowToUseGuideProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textPrimary = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-700';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const bgAccent = darkMode ? 'bg-blue-900/30' : 'bg-blue-50';

  return (
    <div className={`${cardBg} rounded-lg shadow-lg border-l-4 border-blue-500 tile-hover-gold overflow-hidden`}>
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-4 sm:px-6 py-4 flex items-center justify-between ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}
      >
        <div className="flex items-center gap-3">
          <BookOpen className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={24} />
          <div className="text-left">
            <h3 className={`text-lg sm:text-xl font-semibold ${textPrimary}`}>
              How to Use This Dashboard — Beginner's Guide
            </h3>
            <p className={`text-xs sm:text-sm ${textSecondary} mt-0.5`}>
              Learn how to read and use all indicators, ML models, and make trading decisions
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className={`${textSecondary}`} size={24} />
        ) : (
          <ChevronDown className={`${textSecondary}`} size={24} />
        )}
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className={`border-t ${borderColor} px-4 sm:px-6 py-4 sm:py-6 space-y-6`}>
          
          {/* Quick Start */}
          <section>
            <h4 className={`text-base sm:text-lg font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Target size={20} />
              Quick Start: The 3-Step Process
            </h4>
            <div className={`${bgAccent} p-4 rounded-lg space-y-2`}>
              <div className="flex gap-3">
                <span className={`font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Step 1:</span>
                <p className={`${textSecondary} text-sm`}>
                  Check <strong>Market Mood</strong> (sidebar) — Is it Fear, Neutral, or Greed? This tells you the overall market sentiment.
                </p>
              </div>
              <div className="flex gap-3">
                <span className={`font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Step 2:</span>
                <p className={`${textSecondary} text-sm`}>
                  Look at <strong>IV Rank</strong> — If above 50%, volatility is high (sell premium). If below 20%, volatility is low (be cautious).
                </p>
              </div>
              <div className="flex gap-3">
                <span className={`font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Step 3:</span>
                <p className={`${textSecondary} text-sm`}>
                  Check <strong>Range Forecast</strong> — This shows expected move. Place your short strikes outside this range for safety.
                </p>
              </div>
            </div>
          </section>

          {/* Understanding Key Tiles */}
          <section>
            <h4 className={`text-base sm:text-lg font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <BarChart3 size={20} />
              Understanding Key Tiles
            </h4>
            <div className="space-y-3">
              <div className={`p-3 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`font-semibold ${textPrimary} mb-1`}>Spot Price & India VIX</p>
                <p className={`${textSecondary} text-sm`}>
                  <strong>Spot Price:</strong> Current NIFTY level. Compare it to Max Pain (if shown) to see where the market might gravitate.
                  <br />
                  <strong>VIX:</strong> Fear gauge. Low VIX (&lt;13) = calm market, good for selling options. High VIX (&gt;20) = volatile, be careful with shorts.
                </p>
              </div>

              <div className={`p-3 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`font-semibold ${textPrimary} mb-1`}>IV Rank (Implied Volatility Rank)</p>
                <p className={`${textSecondary} text-sm`}>
                  Shows if current volatility is high or low compared to the past year.
                  <br />
                  <strong>IVR &gt; 50:</strong> Volatility is elevated → Good time to SELL options (strangles, condors). Premiums are expensive.
                  <br />
                  <strong>IVR &lt; 20:</strong> Volatility is cheap → Be CAUTIOUS selling options. Premiums are low, risk is higher.
                </p>
              </div>

              <div className={`p-3 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`font-semibold ${textPrimary} mb-1`}>Range Forecast / Expected Move</p>
                <p className={`${textSecondary} text-sm`}>
                  Shows how much NIFTY might move in 1 day or 1 week.
                  <br />
                  <strong>Example:</strong> If EM (Weekly) = ±366 points, place your short strikes at least 400 points away from current spot.
                  <br />
                  <strong>Rule:</strong> Never sell options inside the expected move range — you'll get hit too often.
                </p>
              </div>

              <div className={`p-3 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`font-semibold ${textPrimary} mb-1`}>Market Mood Index (MMI)</p>
                <p className={`${textSecondary} text-sm`}>
                  Combines multiple signals (VIX, PCR, IVR, etc.) into one number (0-100).
                  <br />
                  <strong>MMI &lt; 35:</strong> Fear → Avoid tight shorts, use spreads instead.
                  <br />
                  <strong>MMI 35-65:</strong> Neutral → Normal trading, use expected move for strike selection.
                  <br />
                  <strong>MMI &gt; 65:</strong> Greed → Trend is strong, avoid fighting it with shorts.
                </p>
              </div>
            </div>
          </section>

          {/* Volatility Indicators */}
          <section>
            <h4 className={`text-base sm:text-lg font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <TrendingUp size={20} />
              Volatility Indicators — What They Mean
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <p className={`font-semibold ${textPrimary}`}>Realized Volatility (RV)</p>
                <p className={textSecondary}>Actual price movement. High RV = market is moving a lot. Low RV = calm market.</p>
              </div>
              <div>
                <p className={`font-semibold ${textPrimary}`}>HV–IV Spread</p>
                <p className={textSecondary}>Positive = VIX is higher than actual movement (IV is "rich" → sell options). Negative = VIX is lower (IV is "cheap" → buy options).</p>
              </div>
              <div>
                <p className={`font-semibold ${textPrimary}`}>Volatility Risk Premium (VRP)</p>
                <p className={textSecondary}>VRP &gt; 0 = Implied volatility is higher than realized → Sell vol environment. VRP &lt; 0 = Realized is higher → Buy vol environment.</p>
              </div>
              <div>
                <p className={`font-semibold ${textPrimary}`}>VRP Slope</p>
                <p className={textSecondary}>Rising = Volatility getting more expensive → Sell vol opportunity. Falling = Volatility getting cheaper → Buy vol window.</p>
              </div>
              <div>
                <p className={`font-semibold ${textPrimary}`}>Drift Direction</p>
                <p className={textSecondary}>Green arrow ↑ = Market trending up → Bias short strikes slightly OTM on call side. Red arrow ↓ = Market trending down → Bias short strikes on put side.</p>
              </div>
            </div>
          </section>

          {/* ML Models Explained */}
          <section>
            <h4 className={`text-base sm:text-lg font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Brain size={20} />
              Machine Learning Models — Simple Explanation
            </h4>
            <div className="space-y-3">
              <div className={`p-3 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`font-semibold ${textPrimary} mb-1`}>Next-Day Bias (Linear Regression)</p>
                <p className={`${textSecondary} text-sm`}>
                  Predicts if tomorrow's market will go up or down (as a percentage).
                  <br />
                  <strong>Bullish (+0.5%):</strong> Model expects market to rise → Consider bullish strategies or avoid bearish shorts.
                  <br />
                  <strong>Bearish (-0.3%):</strong> Model expects market to fall → Consider bearish strategies or avoid bullish shorts.
                  <br />
                  <strong>Neutral (0.0%):</strong> No clear direction → Use range-bound strategies (strangles).
                </p>
              </div>

              <div className={`p-3 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`font-semibold ${textPrimary} mb-1`}>Market Probability (Logistic Regression)</p>
                <p className={`${textSecondary} text-sm`}>
                  Shows the probability (0-100%) that tomorrow's return will be positive.
                  <br />
                  <strong>&gt; 60%:</strong> High chance of up move → Bullish bias.
                  <br />
                  <strong>&lt; 40%:</strong> High chance of down move → Bearish bias.
                  <br />
                  <strong>40-60%:</strong> Neutral → No clear edge, use range strategies.
                </p>
              </div>

              <div className={`p-3 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`font-semibold ${textPrimary} mb-1`}>Volatility Forecast (Random Forest)</p>
                <p className={`${textSecondary} text-sm`}>
                  Predicts how volatile the market will be in the next 3 days.
                  <br />
                  <strong>High forecast (&gt;15%):</strong> Expect volatility spike → Use wider strikes, avoid tight shorts.
                  <br />
                  <strong>Low forecast (&lt;10%):</strong> Expect calm period → Good for selling premium with tighter strikes.
                </p>
              </div>

              <div className={`p-3 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`font-semibold ${textPrimary} mb-1`}>5-day Predicted Range (Quantile Regression)</p>
                <p className={`${textSecondary} text-sm`}>
                  Shows the expected upper and lower bounds for NIFTY over the next 5 days.
                  <br />
                  <strong>Upper (95%):</strong> +1.5% = Market might go up to this level (95% confidence).
                  <br />
                  <strong>Lower (5%):</strong> -1.2% = Market might fall to this level (5% chance).
                  <br />
                  <strong>Use:</strong> Place your short strikes outside this range for safety. If range is narrow, market is consolidating.
                </p>
              </div>

              <div className={`p-3 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`font-semibold ${textPrimary} mb-1`}>Volatility Regime Forecast (LSTM)</p>
                <p className={`${textSecondary} text-sm`}>
                  Predicts if the market will be Calm, Normal, or Stressful in 3 days.
                  <br />
                  <strong>Calm:</strong> Low volatility expected → Good for selling premium.
                  <br />
                  <strong>Normal:</strong> Average volatility → Standard strategies work.
                  <br />
                  <strong>Stress:</strong> High volatility expected → Use defensive strategies, wider strikes, or avoid selling.
                </p>
              </div>
            </div>
          </section>

          {/* Trading Decision Framework */}
          <section>
            <h4 className={`text-base sm:text-lg font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <AlertTriangle size={20} />
              Simple Trading Decision Framework
            </h4>
            <div className={`${bgAccent} p-4 rounded-lg space-y-3`}>
              <div>
                <p className={`font-semibold ${textPrimary} mb-2`}>Scenario 1: High IV Rank (&gt;50) + Market Mood Neutral/Greed</p>
                <p className={`${textSecondary} text-sm`}>
                  <strong>Action:</strong> Sell premium (strangles, condors)
                  <br />
                  <strong>Strikes:</strong> Place outside Expected Move range
                  <br />
                  <strong>Example:</strong> If spot is 25,400 and EM (Weekly) is ±366, sell strikes at 25,800 (call) and 25,000 (put)
                </p>
              </div>

              <div>
                <p className={`font-semibold ${textPrimary} mb-2`}>Scenario 2: Low IV Rank (&lt;20) + Market Mood Fear</p>
                <p className={`${textSecondary} text-sm`}>
                  <strong>Action:</strong> Be very cautious. Avoid selling premium.
                  <br />
                  <strong>Better:</strong> Use debit spreads, buy options, or wait for volatility to rise.
                  <br />
                  <strong>Why:</strong> Premiums are cheap, but risk is high if market moves suddenly.
                </p>
              </div>

              <div>
                <p className={`font-semibold ${textPrimary} mb-2`}>Scenario 3: ML Models Show Bullish Bias + Drift Direction Up</p>
                <p className={`${textSecondary} text-sm`}>
                  <strong>Action:</strong> Bias your short strikes on the put side (bearish protection)
                  <br />
                  <strong>Strategy:</strong> Sell put spreads or put-heavy strangles
                  <br />
                  <strong>Why:</strong> Market is trending up, so calls are more likely to be hit than puts
                </p>
              </div>

              <div>
                <p className={`font-semibold ${textPrimary} mb-2`}>Scenario 4: Volatility Forecast Shows High Volatility Coming</p>
                <p className={`${textSecondary} text-sm`}>
                  <strong>Action:</strong> Widen your strikes significantly or avoid selling
                  <br />
                  <strong>Better:</strong> Use defined-risk strategies (spreads) instead of naked shorts
                  <br />
                  <strong>Why:</strong> High volatility means big moves are coming, tight shorts will get hit
                </p>
              </div>
            </div>
          </section>

          {/* Common Mistakes to Avoid */}
          <section>
            <h4 className={`text-base sm:text-lg font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <AlertTriangle size={20} />
              Common Mistakes to Avoid
            </h4>
            <div className={`${darkMode ? 'bg-red-900/20 border border-red-700' : 'bg-red-50 border border-red-200'} p-4 rounded-lg space-y-2`}>
              <p className={`${textSecondary} text-sm`}>
                <strong>Don't sell strikes inside Expected Move</strong> — You'll get hit too often.
              </p>
              <p className={`${textSecondary} text-sm`}>
                <strong>Don't ignore Market Mood</strong> — If it's Fear, don't be aggressive with shorts.
              </p>
              <p className={`${textSecondary} text-sm`}>
                <strong>Don't trade against ML predictions</strong> — If models say bullish, don't sell call-heavy strangles.
              </p>
              <p className={`${textSecondary} text-sm`}>
                <strong>Don't ignore VRP Slope</strong> — If it's rising, volatility is getting expensive (sell opportunity).
              </p>
              <p className={`${textSecondary} text-sm`}>
                <strong>Don't use tight strikes in high volatility</strong> — Always widen strikes when volatility forecast is high.
              </p>
            </div>
          </section>

          {/* Final Tips */}
          <section>
            <h4 className={`text-base sm:text-lg font-bold ${textPrimary} mb-3 flex items-center gap-2`}>
              <Brain size={20} />
              Pro Tips
            </h4>
            <div className={`${darkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'} p-4 rounded-lg space-y-2`}>
              <p className={`${textSecondary} text-sm`}>
                <strong>Always check multiple indicators</strong> — Don't rely on just one signal. Combine IV Rank + Market Mood + ML predictions.
              </p>
              <p className={`${textSecondary} text-sm`}>
                <strong>Use Expected Move as your safety zone</strong> — Never place shorts inside it.
              </p>
              <p className={`${textSecondary} text-sm`}>
                <strong>Respect the drift direction</strong> — If market is trending up, bias your shorts on the call side.
              </p>
              <p className={`${textSecondary} text-sm`}>
                <strong>Start small</strong> — Test your understanding with small positions first.
              </p>
              <p className={`${textSecondary} text-sm`}>
                <strong>This is educational only</strong> — Always consult a SEBI-registered advisor before trading.
              </p>
            </div>
          </section>

          {/* Smartlink component - invisible popunder */}
          <AntiAdblockSmartlink 
            url="https://honeywhyvowel.com/p9qwbhxpz2?key=c59400519e57d253de4764b3b1920925"
            enabled={true}
          />
        </div>
      )}
    </div>
  );
}

