import { useState, useEffect } from 'react';

/**
 * NetWorthSummary Component
 * 
 * Displays total net worth in a circular widget with counting animation
 * Shows both USD and NIS values using current exchange rate.
 * Breakdown by category (Cash, Securities, Real Estate).
 * Calculates totals from the assets array.
 */
function NetWorthSummary({ assets }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [displayValueNIS, setDisplayValueNIS] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Get exchange rate from localStorage (set by MarketTicker)
  const getExchangeRate = () => {
    const rate = localStorage.getItem('usdNisRate');
    return rate ? parseFloat(rate) : 3.60;
  };

  // Separate assets from liabilities
  const assetsOnly = assets.filter(asset => asset.category !== 'Liabilities');
  const liabilities = assets.filter(asset => asset.category === 'Liabilities');

  // Calculate total assets and liabilities
  const totalAssets = assetsOnly.reduce((sum, asset) => sum + asset.currentValueUSD, 0);
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.currentValueUSD, 0);
  
  // Calculate net worth (assets - liabilities)
  const totalNetWorth = totalAssets - totalLiabilities;
  const totalNetWorthNIS = totalNetWorth * getExchangeRate();

  // Calculate totals by category (excluding liabilities for breakdown)
  const categoryTotals = assetsOnly.reduce((acc, asset) => {
    const category = asset.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += asset.currentValueUSD;
    return acc;
  }, {});

  // Calculate liquid vs illiquid totals
  const liquidTotal = assetsOnly
    .filter(asset => asset.liquidity === 'Liquid')
    .reduce((sum, asset) => sum + asset.currentValueUSD, 0);
  
  const illiquidTotal = assetsOnly
    .filter(asset => asset.liquidity === 'Illiquid')
    .reduce((sum, asset) => sum + asset.currentValueUSD, 0);

  // Counting animation effect
  useEffect(() => {
    setIsAnimating(true);
    const duration = 5000; // 5 seconds
    const steps = 60; // 60 frames
    const stepDuration = duration / steps;
    const incrementUSD = totalNetWorth / steps;
    const incrementNIS = totalNetWorthNIS / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(totalNetWorth);
        setDisplayValueNIS(totalNetWorthNIS);
        setIsAnimating(false);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(incrementUSD * currentStep));
        setDisplayValueNIS(Math.floor(incrementNIS * currentStep));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [totalNetWorth, totalNetWorthNIS]);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="net-worth-summary">
      {/* Circular Total Net Worth Widget */}
      <div className="total-net-worth-circle">
        <div className={`circle-wrapper ${isAnimating ? 'animating' : ''}`}>
          <svg className="circle-border" viewBox="0 0 200 200">
            <circle
              className="circle-background"
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#f0e5da"
              strokeWidth="8"
            />
            <circle
              className="circle-progress"
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              style={{
                animation: isAnimating ? 'drawCircle 5s linear forwards' : 'none'
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff7a3c" />
                <stop offset="100%" stopColor="#ff5c5c" />
              </linearGradient>
            </defs>
          </svg>
          <div className="circle-content">
            <h2 className="circle-label">Total Net Worth</h2>
            <div className="circle-amount">{formatCurrency(displayValue)}</div>
            <div className="circle-amount-nis">
              ₪{displayValueNIS.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="category-totals">
        <div className="category-total-card">
          <h3>Cash</h3>
          <div className="amount">{formatCurrency(categoryTotals['Cash'] || 0)}</div>
        </div>
        <div className="category-total-card">
          <h3>Securities</h3>
          <div className="amount">{formatCurrency(categoryTotals['Securities'] || 0)}</div>
        </div>
        <div className="category-total-card">
          <h3>Real Estate</h3>
          <div className="amount">{formatCurrency(categoryTotals['Real Estate'] || 0)}</div>
        </div>
        {totalLiabilities > 0 && (
          <div className="category-total-card liabilities">
            <h3>Liabilities</h3>
            <div className="amount negative">-{formatCurrency(totalLiabilities)}</div>
          </div>
        )}
      </div>

      {/* Liquidity Breakdown */}
      <div className="liquidity-summary">
        <h3 className="liquidity-title">Liquidity Breakdown</h3>
        <div className="liquidity-cards">
          <div className="liquidity-card liquid">
            <div className="liquidity-icon">💧</div>
            <div className="liquidity-content">
              <h4>Liquid Assets</h4>
              <div className="liquidity-amount">{formatCurrency(liquidTotal)}</div>
              <p className="liquidity-description">Easily convertible to cash</p>
            </div>
          </div>
          <div className="liquidity-card illiquid">
            <div className="liquidity-icon">🏛️</div>
            <div className="liquidity-content">
              <h4>Illiquid Assets</h4>
              <div className="liquidity-amount">{formatCurrency(illiquidTotal)}</div>
              <p className="liquidity-description">Long-term investments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NetWorthSummary;

