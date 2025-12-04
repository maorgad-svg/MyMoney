import { useState } from 'react';
import { 
  LineChart as LineChartIcon, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  TrendingUp,
  TrendingDown,
  Home,
  Briefcase,
  Building2,
  Landmark,
  Gem,
  Wallet
} from 'lucide-react';
import { mockScenarios, mockMarketData } from '../data/mockData';
import { formatCurrency, formatPercent } from '../utils/formatters';

const ASSET_CLASS_CONFIG = [
  { key: 'realEstate', label: 'Real Estate', icon: Home, color: 'emerald' },
  { key: 'publicEquities', label: 'Public Equities', icon: TrendingUp, color: 'sky' },
  { key: 'managedPortfolio', label: 'Managed Portfolio', icon: Building2, color: 'violet' },
  { key: 'bonds', label: 'Bonds', icon: Landmark, color: 'amber' },
  { key: 'alternatives', label: 'Alternatives', icon: Gem, color: 'rose' },
  { key: 'cash', label: 'Cash', icon: Wallet, color: 'emerald' },
  { key: 'ttwoEquity', label: 'TTWO Equity', icon: Briefcase, color: 'amber' }
];

function Scenarios() {
  const [scenarios, setScenarios] = useState(mockScenarios);
  const [editingScenario, setEditingScenario] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleEdit = (scenario) => {
    setEditingScenario({ ...scenario });
  };

  const handleSave = () => {
    if (editingScenario) {
      setScenarios(scenarios.map(s => 
        s.id === editingScenario.id ? editingScenario : s
      ));
      setEditingScenario(null);
    }
  };

  const handleCancel = () => {
    setEditingScenario(null);
  };

  const updateAssumption = (key, value) => {
    setEditingScenario({
      ...editingScenario,
      assumptions: {
        ...editingScenario.assumptions,
        [key]: parseFloat(value) || 0
      }
    });
  };

  const ttwoCurrentPrice = mockMarketData.TTWO.currentPrice;

  return (
    <div>
      <header className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Scenarios</h1>
            <p className="page-subtitle">Configure projection assumptions for different market conditions</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            Create Scenario
          </button>
        </div>
      </header>

      {/* Scenarios List */}
      <div style={{ display: 'grid', gridTemplateColumns: editingScenario ? '1fr 1fr' : '1fr', gap: 24 }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <LineChartIcon size={20} />
              Projection Scenarios ({scenarios.length})
            </h3>
          </div>
          
          {scenarios.map((scenario) => (
            <div 
              key={scenario.id}
              className="asset-list-item"
              style={{ 
                marginBottom: 12,
                cursor: 'pointer',
                border: editingScenario?.id === scenario.id ? '2px solid var(--accent-emerald)' : 'none'
              }}
              onClick={() => !editingScenario && handleEdit(scenario)}
            >
              <div className="asset-info">
                <div className={`asset-icon`} style={{ 
                  background: scenario.name.includes('Low') ? 'var(--accent-amber-soft)' :
                             scenario.name.includes('High') ? 'var(--accent-emerald-soft)' :
                             'var(--accent-sky-soft)',
                  color: scenario.name.includes('Low') ? 'var(--accent-amber)' :
                         scenario.name.includes('High') ? 'var(--accent-emerald)' :
                         'var(--accent-sky)'
                }}>
                  {scenario.name.includes('Low') ? <TrendingDown size={20} /> :
                   scenario.name.includes('High') ? <TrendingUp size={20} /> :
                   <LineChartIcon size={20} />}
                </div>
                <div className="asset-details">
                  <h4>{scenario.name}</h4>
                  <p>{scenario.description}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>TTWO Adjustment</div>
                  <div style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontWeight: 500,
                    color: scenario.ttwoAdjustment >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)'
                  }}>
                    {formatPercent(scenario.ttwoAdjustment)}
                  </div>
                </div>
                {scenario.isDefault && (
                  <span className="badge sky">Default</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Edit Panel */}
        {editingScenario && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Edit size={20} />
                Edit: {editingScenario.name}
              </h3>
              <button className="btn btn-ghost btn-icon" onClick={handleCancel}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Scenario Name</label>
              <input 
                type="text" 
                className="form-input"
                value={editingScenario.name}
                onChange={e => setEditingScenario({...editingScenario, name: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <input 
                type="text" 
                className="form-input"
                value={editingScenario.description}
                onChange={e => setEditingScenario({...editingScenario, description: e.target.value})}
              />
            </div>

            <div className="section-divider" />

            <h4 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={18} />
              Annual Return Assumptions (%)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {ASSET_CLASS_CONFIG.map(({ key, label, icon: Icon, color }) => (
                <div key={key} className="form-group" style={{ marginBottom: 8 }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Icon size={14} />
                    {label}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input 
                      type="number" 
                      className="form-input"
                      style={{ flex: 1 }}
                      step="0.5"
                      value={editingScenario.assumptions[key]}
                      onChange={e => updateAssumption(key, e.target.value)}
                    />
                    <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-divider" />

            <h4 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Briefcase size={18} />
              TTWO Price Adjustment
            </h4>

            <div style={{ 
              background: 'var(--bg-secondary)', 
              padding: 16, 
              borderRadius: 'var(--radius-md)',
              marginBottom: 16
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Current TTWO Price</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                  {formatCurrency(ttwoCurrentPrice)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Scenario Price</span>
                <span style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontWeight: 500,
                  color: editingScenario.ttwoAdjustment >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)'
                }}>
                  {formatCurrency(ttwoCurrentPrice * (1 + editingScenario.ttwoAdjustment / 100))}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Price Adjustment (%)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input 
                  type="range" 
                  min="-50" 
                  max="100" 
                  step="5"
                  value={editingScenario.ttwoAdjustment}
                  onChange={e => setEditingScenario({
                    ...editingScenario, 
                    ttwoAdjustment: parseInt(e.target.value)
                  })}
                  style={{ flex: 1 }}
                />
                <input 
                  type="number" 
                  className="form-input"
                  style={{ width: 80 }}
                  value={editingScenario.ttwoAdjustment}
                  onChange={e => setEditingScenario({
                    ...editingScenario, 
                    ttwoAdjustment: parseInt(e.target.value) || 0
                  })}
                />
                <span style={{ color: 'var(--text-muted)' }}>%</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                Adjust the expected TTWO price relative to today's price for this scenario.
                This affects the valuation of unvested shares in projections.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Table */}
      {!editingScenario && (
        <div className="card" style={{ marginTop: 24 }}>
          <div className="card-header">
            <h3 className="card-title">Scenario Comparison</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset Class</th>
                {scenarios.map(s => (
                  <th key={s.id} style={{ textAlign: 'center' }}>{s.name.split(' ')[0]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ASSET_CLASS_CONFIG.map(({ key, label, icon: Icon }) => (
                <tr key={key}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon size={16} color="var(--text-muted)" />
                      {label}
                    </div>
                  </td>
                  {scenarios.map(s => (
                    <td key={s.id} style={{ textAlign: 'center' }}>
                      <span style={{ 
                        fontFamily: 'var(--font-mono)',
                        color: s.assumptions[key] > 5 ? 'var(--accent-emerald)' : 
                               s.assumptions[key] < 3 ? 'var(--accent-amber)' : 'var(--text-primary)'
                      }}>
                        {s.assumptions[key]}%
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid var(--border-color)' }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                    <Briefcase size={16} color="var(--accent-amber)" />
                    TTWO Adjustment
                  </div>
                </td>
                {scenarios.map(s => (
                  <td key={s.id} style={{ textAlign: 'center' }}>
                    <span style={{ 
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                      color: s.ttwoAdjustment > 0 ? 'var(--accent-emerald)' : 
                             s.ttwoAdjustment < 0 ? 'var(--accent-rose)' : 'var(--text-primary)'
                    }}>
                      {formatPercent(s.ttwoAdjustment)}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Add New Scenario Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create Custom Scenario</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Scenario Name</label>
                <input type="text" className="form-input" placeholder="e.g., Bull Market 2025" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input type="text" className="form-input" placeholder="Brief description of this scenario" />
              </div>
              <div className="form-group">
                <label className="form-label">Base on existing scenario</label>
                <select className="form-input">
                  <option value="">Start from scratch</option>
                  {scenarios.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary">
                <Plus size={18} />
                Create Scenario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Scenarios;


