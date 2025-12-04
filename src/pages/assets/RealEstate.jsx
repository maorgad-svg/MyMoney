import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Home, Edit, Archive, TrendingUp, MapPin } from 'lucide-react';
import { mockRealEstate } from '../../data/mockData';
import { formatCurrency, formatDate, formatPercent } from '../../utils/formatters';

function RealEstate() {
  const [properties, setProperties] = useState(mockRealEstate);
  const [showAddModal, setShowAddModal] = useState(false);

  const totalValue = properties.reduce((sum, p) => sum + p.currentValue, 0);
  const totalEquity = properties.reduce((sum, p) => sum + (p.currentValue - p.mortgageBalance), 0);
  const totalMortgage = properties.reduce((sum, p) => sum + p.mortgageBalance, 0);

  return (
    <div>
      <header className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Real Estate</h1>
            <p className="page-subtitle">Manage your property investments</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            Add Property
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="summary-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="summary-card emerald">
          <div className="summary-card-icon">
            <Home size={22} />
          </div>
          <div className="summary-card-label">Total Value</div>
          <div className="summary-card-value">{formatCurrency(totalValue)}</div>
        </div>

        <div className="summary-card sky">
          <div className="summary-card-icon">
            <TrendingUp size={22} />
          </div>
          <div className="summary-card-label">Net Equity</div>
          <div className="summary-card-value">{formatCurrency(totalEquity)}</div>
        </div>

        <div className="summary-card amber">
          <div className="summary-card-icon">
            <Archive size={22} />
          </div>
          <div className="summary-card-label">Total Mortgage</div>
          <div className="summary-card-value">{formatCurrency(totalMortgage)}</div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Home size={20} />
            Properties ({properties.length})
          </h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Current Value</th>
              <th>Mortgage</th>
              <th>Net Equity</th>
              <th>Monthly Cashflow</th>
              <th>Last Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => {
              const netEquity = property.currentValue - property.mortgageBalance;
              const monthlyCashflow = property.monthlyRent - property.monthlyExpenses;
              return (
                <tr key={property.id}>
                  <td>
                    <div className="asset-name">{property.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <MapPin size={12} />
                      {property.country}
                    </div>
                  </td>
                  <td className="value">{formatCurrency(property.currentValue)}</td>
                  <td className="value">{formatCurrency(property.mortgageBalance)}</td>
                  <td className="value positive">{formatCurrency(netEquity)}</td>
                  <td className={`value ${monthlyCashflow >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(monthlyCashflow)}/mo
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{formatDate(property.lastUpdated)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link to={`/assets/real-estate/${property.id}`} className="btn btn-ghost btn-icon">
                        <Edit size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Property Modal */}
      {showAddModal && (
        <AddPropertyModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

function AddPropertyModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    country: '',
    purchaseDate: '',
    purchasePrice: '',
    currentValue: '',
    mortgageBalance: '',
    mortgageRate: '',
    mortgageEndDate: '',
    monthlyRent: '',
    monthlyExpenses: '',
    appreciationAssumption: '3.0'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Would save to Airtable here
    console.log('Saving property:', formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Add Property</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Property Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g., Downtown Apartment"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Address</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Street address"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Country"
                  value={formData.country}
                  onChange={e => setFormData({...formData, country: e.target.value})}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Purchase Date</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={formData.purchaseDate}
                  onChange={e => setFormData({...formData, purchaseDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Purchase Price ($)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="0"
                  value={formData.purchasePrice}
                  onChange={e => setFormData({...formData, purchasePrice: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Current Market Value ($)</label>
              <input 
                type="number" 
                className="form-input" 
                placeholder="0"
                value={formData.currentValue}
                onChange={e => setFormData({...formData, currentValue: e.target.value})}
                required
              />
            </div>

            <div className="section-divider" />

            <h4 style={{ marginBottom: 16, color: 'var(--text-secondary)' }}>Mortgage Details</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Mortgage Balance ($)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="0"
                  value={formData.mortgageBalance}
                  onChange={e => setFormData({...formData, mortgageBalance: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Interest Rate (%)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="0.0"
                  step="0.1"
                  value={formData.mortgageRate}
                  onChange={e => setFormData({...formData, mortgageRate: e.target.value})}
                />
              </div>
            </div>

            <div className="section-divider" />

            <h4 style={{ marginBottom: 16, color: 'var(--text-secondary)' }}>Rental Income</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Monthly Rent ($)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="0"
                  value={formData.monthlyRent}
                  onChange={e => setFormData({...formData, monthlyRent: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Monthly Expenses ($)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  placeholder="0"
                  value={formData.monthlyExpenses}
                  onChange={e => setFormData({...formData, monthlyExpenses: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Expected Annual Appreciation (%)</label>
              <input 
                type="number" 
                className="form-input" 
                placeholder="3.0"
                step="0.5"
                value={formData.appreciationAssumption}
                onChange={e => setFormData({...formData, appreciationAssumption: e.target.value})}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add Property</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RealEstate;
