import { useState, useEffect } from 'react';

/**
 * MarketTicker Component
 * 
 * Stock ticker-style banner showing USD/NIS exchange rate and TTWO stock price.
 * Supports both automatic (real-time API) and manual modes with toggle.
 */
function MarketTicker() {
  // Mode: 'auto' or 'manual'
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('tickerMode') || 'auto';
  });

  // Exchange rate (USD/NIS)
  const [usdNisRate, setUsdNisRate] = useState(() => {
    const saved = localStorage.getItem('usdNisRate');
    return saved ? parseFloat(saved) : 3.60;
  });

  // TTWO stock price
  const [ttwoPrice, setTtwoPrice] = useState(() => {
    const saved = localStorage.getItem('ttwoPrice');
    return saved ? parseFloat(saved) : 175.00; // Default to ~175 if no saved value
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [tempUsdNis, setTempUsdNis] = useState('');
  const [tempTtwo, setTempTtwo] = useState('');

  /**
   * Fetch USD/NIS exchange rate
   * Using exchangerate-api.com free API
   */
  const fetchExchangeRate = async () => {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      if (data.rates && data.rates.ILS) {
        return data.rates.ILS;
      }
      throw new Error('Exchange rate not found');
    } catch (err) {
      console.error('Error fetching exchange rate:', err);
      // Fallback to current value
      return usdNisRate;
    }
  };

  /**
   * Fetch TTWO stock price
   * Using multiple fallback sources due to CORS restrictions
   */
  const fetchTTWOPrice = async () => {
    try {
      // Method 1: Try Finnhub API (free, requires no key for basic quotes)
      try {
        const response = await fetch(
          'https://finnhub.io/api/v1/quote?symbol=TTWO&token=demo'
        );
        const data = await response.json();
        
        if (data.c && data.c > 0) {
          console.log('TTWO price from Finnhub:', data.c);
          return data.c; // Current price
        }
      } catch (err) {
        console.log('Finnhub API failed, trying next source...');
      }

      // Method 2: Try Yahoo Finance via CORS proxy
      try {
        const response = await fetch(
          'https://query1.finance.yahoo.com/v8/finance/chart/TTWO?interval=1d&range=1d',
          { mode: 'cors' }
        );
        const data = await response.json();
        
        if (data.chart?.result?.[0]?.meta?.regularMarketPrice) {
          console.log('TTWO price from Yahoo:', data.chart.result[0].meta.regularMarketPrice);
          return data.chart.result[0].meta.regularMarketPrice;
        }
      } catch (err) {
        console.log('Yahoo Finance API failed, trying next source...');
      }

      // Method 3: Use a default reasonable value if all APIs fail
      console.warn('All TTWO price sources failed. Using last known value or default.');
      return ttwoPrice > 0 ? ttwoPrice : 175.00; // Fallback to last known or reasonable default
      
    } catch (err) {
      console.error('Error fetching TTWO price:', err);
      return ttwoPrice > 0 ? ttwoPrice : 175.00;
    }
  };

  /**
   * Fetch all market data
   */
  const fetchMarketData = async () => {
    if (mode !== 'auto') return;
    
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching market data...');
      
      const [newUsdNis, newTtwo] = await Promise.all([
        fetchExchangeRate(),
        fetchTTWOPrice(),
      ]);

      console.log('Fetched USD/NIS:', newUsdNis);
      console.log('Fetched TTWO:', newTtwo);

      setUsdNisRate(newUsdNis);
      setTtwoPrice(newTtwo);
      
      // Save to localStorage
      localStorage.setItem('usdNisRate', newUsdNis.toString());
      localStorage.setItem('ttwoPrice', newTtwo.toString());
      
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch market data');
      console.error('Market data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Auto-fetch on mount and every 5 minutes in auto mode
   */
  useEffect(() => {
    if (mode === 'auto') {
      fetchMarketData();
      
      // Refresh every 5 minutes
      const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  /**
   * Toggle between auto and manual mode
   */
  const handleToggleMode = () => {
    const newMode = mode === 'auto' ? 'manual' : 'auto';
    setMode(newMode);
    localStorage.setItem('tickerMode', newMode);
    
    if (newMode === 'auto') {
      fetchMarketData();
    }
  };

  /**
   * Handle manual edit
   */
  const handleEdit = () => {
    setTempUsdNis(usdNisRate.toString());
    setTempTtwo(ttwoPrice.toString());
    setIsEditing(true);
  };

  const handleSaveManual = () => {
    const newUsdNis = parseFloat(tempUsdNis);
    const newTtwo = parseFloat(tempTtwo);

    if (isNaN(newUsdNis) || newUsdNis <= 0) {
      alert('Please enter a valid USD/NIS rate');
      return;
    }
    if (isNaN(newTtwo) || newTtwo <= 0) {
      alert('Please enter a valid TTWO price');
      return;
    }

    setUsdNisRate(newUsdNis);
    setTtwoPrice(newTtwo);
    
    localStorage.setItem('usdNisRate', newUsdNis.toString());
    localStorage.setItem('ttwoPrice', newTtwo.toString());
    
    setIsEditing(false);
    setLastUpdated(new Date());
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  /**
   * Format time ago
   */
  const getTimeAgo = () => {
    if (!lastUpdated) return 'Never';
    
    const seconds = Math.floor((new Date() - lastUpdated) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="market-ticker">
      <div className="ticker-container">
        {/* Header with Mode Toggle */}
        <div className="ticker-header">
          <div className="ticker-title">
            <span className="ticker-icon">📊</span>
            <span>Market Data</span>
          </div>
          
          <div className="ticker-controls">
            <div className="mode-toggle">
              <span className={`mode-label ${mode === 'auto' ? 'active' : ''}`}>
                Auto
              </span>
              <button 
                className={`toggle-switch ${mode === 'auto' ? 'on' : 'off'}`}
                onClick={handleToggleMode}
                title={mode === 'auto' ? 'Switch to Manual' : 'Switch to Auto'}
              >
                <span className="toggle-slider"></span>
              </button>
              <span className={`mode-label ${mode === 'manual' ? 'active' : ''}`}>
                Manual
              </span>
            </div>

            {mode === 'manual' && !isEditing && (
              <button className="ticker-edit-btn" onClick={handleEdit}>
                Edit
              </button>
            )}

            {mode === 'auto' && (
              <button 
                className="ticker-refresh-btn" 
                onClick={fetchMarketData}
                disabled={isLoading}
              >
                🔄
              </button>
            )}
          </div>
        </div>

        {/* Ticker Values */}
        {!isEditing ? (
          <div className="ticker-values">
            <div className="ticker-item">
              <div className="ticker-label">USD/NIS</div>
              <div className="ticker-value">
                ₪{usdNisRate.toFixed(4)}
              </div>
            </div>

            <div className="ticker-divider"></div>

            <div className="ticker-item">
              <div className="ticker-label">TTWO</div>
              <div className="ticker-value">
                ${ttwoPrice.toFixed(2)}
              </div>
            </div>

            <div className="ticker-status">
              {isLoading && <span className="ticker-loading">Updating...</span>}
              {error && <span className="ticker-error">{error}</span>}
              {!isLoading && !error && (
                <span className="ticker-updated">
                  Updated: {getTimeAgo()}
                </span>
              )}
              {mode === 'auto' && (
                <span className="ticker-badge auto">Live</span>
              )}
              {mode === 'manual' && (
                <span className="ticker-badge manual">Manual</span>
              )}
            </div>
          </div>
        ) : (
          <div className="ticker-edit-form">
            <div className="ticker-edit-group">
              <label>USD/NIS Rate</label>
              <input
                type="number"
                value={tempUsdNis}
                onChange={(e) => setTempUsdNis(e.target.value)}
                step="0.0001"
                min="0"
                placeholder="3.6000"
              />
            </div>

            <div className="ticker-edit-group">
              <label>TTWO Price ($)</label>
              <input
                type="number"
                value={tempTtwo}
                onChange={(e) => setTempTtwo(e.target.value)}
                step="0.01"
                min="0"
                placeholder="150.00"
              />
            </div>

            <div className="ticker-edit-actions">
              <button className="ticker-save-btn" onClick={handleSaveManual}>
                Save
              </button>
              <button className="ticker-cancel-btn" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MarketTicker;

/**
 * Utility function to get current exchange rate
 * Can be imported by other components
 */
export function getExchangeRate() {
  const rate = localStorage.getItem('usdNisRate');
  return rate ? parseFloat(rate) : 3.60;
}

/**
 * Utility function to get current TTWO price
 * Can be imported by other components
 */
export function getTTWOPrice() {
  const price = localStorage.getItem('ttwoPrice');
  return price ? parseFloat(price) : 175.00; // Default fallback
}

