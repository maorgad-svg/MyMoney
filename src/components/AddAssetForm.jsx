import { useState } from 'react';
import { getExchangeRate } from './MarketTicker';

/**
 * AddAssetForm Component
 * 
 * Form to add a new asset with category-dependent subtype selection and currency support.
 * Supports USD and NIS with automatic conversion based on exchange rate.
 * Validates input and calls onAssetCreated callback upon successful creation.
 */
function AddAssetForm({ onAssetCreated }) {
  // Form state
  const [category, setCategory] = useState('');
  const [subtype, setSubtype] = useState('');
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [value, setValue] = useState('');
  const [liquidity, setLiquidity] = useState('Liquid');
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Define subtypes for each category
  const subtypeOptions = {
    'Cash': ['Leumi', 'Julius Baer', 'Excellence'],
    'Securities': ['Atai', 'Bioharvest', 'Excellence', 'Take Two Interactive'],
    'Real Estate': ['Tel Aviv', 'Dubai'],
    'Liabilities': ['Mortgage', 'Credit Card', 'Personal Loan', 'Business Debt', 'Other'],
  };

  // Get current subtype options based on selected category
  const currentSubtypes = category ? subtypeOptions[category] : [];

  // Handle category change - reset subtype when category changes
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubtype('');
  };

  // Calculate USD value based on currency and exchange rate
  const calculateUSDValue = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 0;
    
    if (currency === 'USD') {
      return numValue;
    } else {
      // Convert NIS to USD
      const exchangeRate = getExchangeRate();
      return numValue / exchangeRate;
    }
  };

  // Get converted value for display
  const convertedValue = calculateUSDValue();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validate inputs
    if (!category || !subtype || !name.trim() || !value || !currency) {
      setError('Please fill in all fields');
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      setError('Please enter a valid positive number for the value');
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate USD value
      const usdValue = calculateUSDValue();

      // Prepare asset data with original currency info
      const asset = {
        name: name.trim(),
        category,
        subtype,
        currency,
        originalValue: numValue,
        currentValueUSD: usdValue,
        liquidity,
      };

      // Call the parent's callback to create the asset
      await onAssetCreated(asset);

      // Reset form on success
      setCategory('');
      setSubtype('');
      setName('');
      setCurrency('USD');
      setValue('');
      setLiquidity('Liquid');
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create asset. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-asset-section">
      <form className="add-asset-form" onSubmit={handleSubmit}>
        <h2>{category === 'Liabilities' ? 'Add New Liability' : 'Add New Asset'}</h2>
        
        <div className="form-grid">
          {/* Category Select */}
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={handleCategoryChange}
              disabled={isSubmitting}
              required
            >
              <option value="">Select category...</option>
              <option value="Cash">Cash</option>
              <option value="Securities">Securities</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Liabilities">Liabilities (Debt/Mortgage)</option>
            </select>
          </div>

          {/* Subtype Select - dependent on category */}
          <div className="form-group">
            <label htmlFor="subtype">Subtype</label>
            <select
              id="subtype"
              value={subtype}
              onChange={(e) => setSubtype(e.target.value)}
              disabled={!category || isSubmitting}
              required
            >
              <option value="">Select subtype...</option>
              {currentSubtypes.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Name Input */}
          <div className="form-group">
            <label htmlFor="name">{category === 'Liabilities' ? 'Liability Name' : 'Asset Name'}</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={category === 'Liabilities' ? 'e.g., Home Mortgage - Chase' : 'e.g., Savings Account - Leumi'}
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Currency Select */}
          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              disabled={isSubmitting}
              required
            >
              <option value="USD">USD ($)</option>
              <option value="NIS">NIS (₪)</option>
            </select>
          </div>

          {/* Current Value Input */}
          <div className="form-group">
            <label htmlFor="value">
              {category === 'Liabilities' ? 'Outstanding Balance' : 'Current Value'} ({currency === 'USD' ? '$' : '₪'})
            </label>
            <input
              type="number"
              id="value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0"
              step="0.01"
              min="0"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Liquidity Select */}
          <div className="form-group">
            <label htmlFor="liquidity">Liquidity</label>
            <select
              id="liquidity"
              value={liquidity}
              onChange={(e) => setLiquidity(e.target.value)}
              disabled={isSubmitting}
              required
            >
              <option value="Liquid">Liquid (easily convertible to cash)</option>
              <option value="Illiquid">Illiquid (not easily convertible)</option>
            </select>
          </div>
        </div>

        {/* Liability Warning */}
        {category === 'Liabilities' && (
          <div className="conversion-info" style={{ backgroundColor: '#4a1f1f', borderColor: '#8b5cf6' }}>
            <span className="conversion-label">⚠️ This amount will be subtracted from your net worth</span>
          </div>
        )}

        {/* Currency Conversion Display */}
        {value && currency === 'NIS' && (
          <div className="conversion-info">
            <span className="conversion-label">Will be stored as:</span>
            <span className="conversion-value">
              ${convertedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>
            <span className="conversion-rate">
              (Rate: 1 USD = {getExchangeRate()} NIS)
            </span>
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : (category === 'Liabilities' ? 'Add Liability' : 'Add Asset')}
          </button>
          
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">Asset added successfully!</p>}
        </div>
      </form>
    </div>
  );
}

export default AddAssetForm;

