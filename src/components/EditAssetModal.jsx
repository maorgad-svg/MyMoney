import { useState, useEffect } from 'react';
import { getExchangeRate } from './MarketTicker';

/**
 * EditAssetModal Component
 * 
 * Modal dialog for editing an existing asset.
 * Supports currency selection and automatic conversion.
 */
function EditAssetModal({ asset, onClose, onSave }) {
  // Form state - initialize with asset values
  const [category, setCategory] = useState(asset.category);
  const [subtype, setSubtype] = useState(asset.subtype);
  const [name, setName] = useState(asset.name);
  const [currency, setCurrency] = useState(asset.currency || 'USD');
  const [value, setValue] = useState(asset.originalValue || asset.currentValueUSD);
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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

      // Prepare updated asset data
      const updatedAsset = {
        name: name.trim(),
        category,
        subtype,
        currency,
        originalValue: numValue,
        currentValueUSD: usdValue,
      };

      // Call the parent's callback to save
      await onSave(asset.id, updatedAsset);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update asset. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{category === 'Liabilities' ? 'Edit Liability' : 'Edit Asset'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Category Select */}
            <div className="form-group">
              <label htmlFor="edit-category">Category</label>
              <select
                id="edit-category"
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
              <label htmlFor="edit-subtype">Subtype</label>
              <select
                id="edit-subtype"
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
              <label htmlFor="edit-name">{category === 'Liabilities' ? 'Liability Name' : 'Asset Name'}</label>
              <input
                type="text"
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={category === 'Liabilities' ? 'e.g., Home Mortgage - Chase' : 'e.g., Savings Account - Leumi'}
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Currency Select */}
            <div className="form-group">
              <label htmlFor="edit-currency">Currency</label>
              <select
                id="edit-currency"
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
              <label htmlFor="edit-value">
                {category === 'Liabilities' ? 'Outstanding Balance' : 'Current Value'} ({currency === 'USD' ? '$' : '₪'})
              </label>
              <input
                type="number"
                id="edit-value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0"
                step="0.01"
                min="0"
                disabled={isSubmitting}
                required
              />
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
          <div className="modal-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default EditAssetModal;

