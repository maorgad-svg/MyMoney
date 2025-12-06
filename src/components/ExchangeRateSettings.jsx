import { useState, useEffect } from 'react';

/**
 * ExchangeRateSettings Component
 * 
 * Allows user to set and update the USD/NIS exchange rate.
 * Rate is stored in localStorage for persistence.
 */
function ExchangeRateSettings() {
  const [exchangeRate, setExchangeRate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempRate, setTempRate] = useState('');

  // Load exchange rate from localStorage on mount
  useEffect(() => {
    const savedRate = localStorage.getItem('usdNisRate');
    if (savedRate) {
      setExchangeRate(savedRate);
    } else {
      // Default rate
      setExchangeRate('3.60');
      localStorage.setItem('usdNisRate', '3.60');
    }
  }, []);

  const handleEdit = () => {
    setTempRate(exchangeRate);
    setIsEditing(true);
  };

  const handleSave = () => {
    const rate = parseFloat(tempRate);
    if (isNaN(rate) || rate <= 0) {
      alert('Please enter a valid positive number');
      return;
    }
    setExchangeRate(tempRate);
    localStorage.setItem('usdNisRate', tempRate);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempRate('');
    setIsEditing(false);
  };

  return (
    <div className="exchange-rate-settings">
      <div className="settings-card">
        <h3>Exchange Rate Settings</h3>
        
        {!isEditing ? (
          <div className="rate-display">
            <div className="rate-info">
              <span className="rate-label">1 USD =</span>
              <span className="rate-value">{exchangeRate} NIS</span>
            </div>
            <button 
              type="button"
              className="edit-rate-button" 
              onClick={handleEdit}
            >
              Edit Rate
            </button>
          </div>
        ) : (
          <div className="rate-edit">
            <div className="form-group">
              <label htmlFor="exchangeRate">1 USD = ? NIS</label>
              <input
                type="number"
                id="exchangeRate"
                value={tempRate}
                onChange={(e) => setTempRate(e.target.value)}
                placeholder="3.60"
                step="0.01"
                min="0"
                autoFocus
              />
            </div>
            <div className="rate-actions">
              <button 
                type="button"
                className="save-rate-button" 
                onClick={handleSave}
              >
                Save
              </button>
              <button 
                type="button"
                className="cancel-rate-button" 
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <p className="rate-note">
          This rate will be used to convert NIS values to USD when adding assets.
        </p>
      </div>
    </div>
  );
}

export default ExchangeRateSettings;

/**
 * Utility function to get current exchange rate
 * Can be imported by other components
 */
export function getExchangeRate() {
  const rate = localStorage.getItem('usdNisRate');
  return rate ? parseFloat(rate) : 3.60; // Default fallback
}



