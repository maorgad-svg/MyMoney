import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, MapPin, Calendar, Percent, DollarSign } from 'lucide-react';
import { mockRealEstate } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';

function RealEstateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = mockRealEstate.find(p => p.id === id);

  const [formData, setFormData] = useState(property || {});

  if (!property) {
    return (
      <div className="empty-state">
        <h3>Property not found</h3>
        <Link to="/assets/real-estate" className="btn btn-primary" style={{ marginTop: 16 }}>
          Back to Real Estate
        </Link>
      </div>
    );
  }

  const handleSave = () => {
    console.log('Saving property:', formData);
    // Would update in Airtable
    navigate('/assets/real-estate');
  };

  const netEquity = formData.currentValue - formData.mortgageBalance;
  const monthlyMortgagePayment = (formData.mortgageBalance * (formData.mortgageRate / 100 / 12));
  const netCashflow = formData.monthlyRent - formData.monthlyExpenses - monthlyMortgagePayment;

  return (
    <div>
      <header className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Link to="/assets/real-estate" className="btn btn-ghost" style={{ marginBottom: 12, marginLeft: -16 }}>
              <ArrowLeft size={18} />
              Back to Real Estate
            </Link>
            <h1 className="page-title">{property.name}</h1>
            <p className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={16} />
              {property.address}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary">
              <Trash2 size={18} />
              Archive
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="summary-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 32 }}>
        <div className="summary-card emerald">
          <div className="summary-card-label">Net Equity</div>
          <div className="summary-card-value">{formatCurrency(netEquity)}</div>
        </div>
        <div className="summary-card sky">
          <div className="summary-card-label">Current Value</div>
          <div className="summary-card-value">{formatCurrency(formData.currentValue)}</div>
        </div>
        <div className="summary-card amber">
          <div className="summary-card-label">Mortgage Balance</div>
          <div className="summary-card-value">{formatCurrency(formData.mortgageBalance)}</div>
        </div>
        <div className="summary-card violet">
          <div className="summary-card-label">Net Cashflow/mo</div>
          <div className="summary-card-value">{formatCurrency(netCashflow)}</div>
        </div>
      </div>

      <div className="charts-grid">
        {/* Property Details */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Property Details</h3>
          </div>
          
          <div className="form-group">
            <label className="form-label">Property Name</label>
            <input 
              type="text" 
              className="form-input"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Address</label>
              <input 
                type="text" 
                className="form-input"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Country</label>
              <input 
                type="text" 
                className="form-input"
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
                value={formData.purchasePrice}
                onChange={e => setFormData({...formData, purchasePrice: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Current Market Value ($)</label>
            <input 
              type="number" 
              className="form-input"
              value={formData.currentValue}
              onChange={e => setFormData({...formData, currentValue: Number(e.target.value)})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea 
              className="form-input"
              rows={3}
              value={formData.notes || ''}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              placeholder="Add any notes about this property..."
            />
          </div>
        </div>

        {/* Mortgage & Income */}
        <div>
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <h3 className="card-title">
                <DollarSign size={20} />
                Mortgage
              </h3>
            </div>
            
            <div className="form-group">
              <label className="form-label">Mortgage Balance ($)</label>
              <input 
                type="number" 
                className="form-input"
                value={formData.mortgageBalance}
                onChange={e => setFormData({...formData, mortgageBalance: Number(e.target.value)})}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Interest Rate (%)</label>
                <input 
                  type="number" 
                  className="form-input"
                  step="0.1"
                  value={formData.mortgageRate}
                  onChange={e => setFormData({...formData, mortgageRate: Number(e.target.value)})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={formData.mortgageEndDate}
                  onChange={e => setFormData({...formData, mortgageEndDate: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <h3 className="card-title">
                <Calendar size={20} />
                Rental Income
              </h3>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Monthly Rent ($)</label>
                <input 
                  type="number" 
                  className="form-input"
                  value={formData.monthlyRent}
                  onChange={e => setFormData({...formData, monthlyRent: Number(e.target.value)})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Monthly Expenses ($)</label>
                <input 
                  type="number" 
                  className="form-input"
                  value={formData.monthlyExpenses}
                  onChange={e => setFormData({...formData, monthlyExpenses: Number(e.target.value)})}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Percent size={20} />
                Projections
              </h3>
            </div>
            
            <div className="form-group">
              <label className="form-label">Expected Annual Appreciation (%)</label>
              <input 
                type="number" 
                className="form-input"
                step="0.5"
                value={formData.appreciationAssumption}
                onChange={e => setFormData({...formData, appreciationAssumption: Number(e.target.value)})}
              />
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              This rate is used in future projections when calculating your net worth growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RealEstateDetail;
