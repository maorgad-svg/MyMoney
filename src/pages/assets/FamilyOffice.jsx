import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Upload, ExternalLink, Wallet, TrendingUp, Landmark, Gem } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { mockFamilyOffice, mockUploadBatches, mockExchangeRates } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';

const CATEGORY_COLORS = {
  'Cash': '#10b981',
  'Bonds': '#0ea5e9',
  'Funds': '#8b5cf6',
  'Alternatives': '#f59e0b'
};

const CATEGORY_ICONS = {
  'Cash': Wallet,
  'Bonds': Landmark,
  'Funds': TrendingUp,
  'Alternatives': Gem
};

function FamilyOffice() {
  const [holdings, setHoldings] = useState(mockFamilyOffice);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const lastUpload = mockUploadBatches.find(b => 
    b.sourceType === 'family_office_excel' || b.sourceType === 'family_office_pdf'
  );

  // Calculate totals by category (convert to USD)
  const categoryTotals = useMemo(() => {
    const totals = {};
    holdings.forEach(h => {
      const rate = mockExchangeRates[h.currency] || 1;
      const valueUSD = h.value * rate;
      totals[h.category] = (totals[h.category] || 0) + valueUSD;
    });
    return totals;
  }, [holdings]);

  const totalValue = Object.values(categoryTotals).reduce((sum, v) => sum + v, 0);

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || '#5c6370'
  }));

  const filteredHoldings = selectedCategory === 'all' 
    ? holdings 
    : holdings.filter(h => h.category === selectedCategory);

  return (
    <div>
      <header className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Family Office Portfolio</h1>
            <p className="page-subtitle">Managed investments and alternative assets</p>
          </div>
          <Link to="/uploads" className="btn btn-primary">
            <Upload size={18} />
            Upload Statement
          </Link>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="summary-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <div className="summary-card violet">
          <div className="summary-card-icon">
            <Building2 size={22} />
          </div>
          <div className="summary-card-label">Total Value</div>
          <div className="summary-card-value">{formatCurrency(totalValue)}</div>
        </div>

        {Object.entries(categoryTotals).map(([category, value]) => {
          const IconComponent = CATEGORY_ICONS[category] || Building2;
          const colorClass = category === 'Cash' ? 'emerald' : 
                            category === 'Bonds' ? 'sky' : 
                            category === 'Funds' ? 'violet' : 'amber';
          return (
            <div key={category} className={`summary-card ${colorClass}`}>
              <div className="summary-card-icon">
                <IconComponent size={22} />
              </div>
              <div className="summary-card-label">{category}</div>
              <div className="summary-card-value">{formatCurrency(value)}</div>
            </div>
          );
        })}
      </div>

      {/* Data Source Info */}
      {lastUpload && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="asset-icon" style={{ background: 'var(--accent-violet-soft)', color: 'var(--accent-violet)' }}>
                <Upload size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 500 }}>Data from: {lastUpload.fileName}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Uploaded {formatDate(lastUpload.uploadedAt)} • {lastUpload.rowsParsed} holdings
                  {lastUpload.sourceType === 'family_office_pdf' && (
                    <span className="badge amber" style={{ marginLeft: 8 }}>PDF/OCR</span>
                  )}
                </div>
              </div>
            </div>
            <Link to="/uploads" className="btn btn-ghost">
              View Upload History
              <ExternalLink size={16} />
            </Link>
          </div>
        </div>
      )}

      <div className="charts-grid">
        {/* Allocation Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Building2 size={20} />
              Asset Allocation
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1a2029',
                    border: '1px solid #2d3748',
                    borderRadius: '8px',
                    color: '#e6edf3'
                  }}
                  formatter={(value) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {pieData.map((item) => {
                const percent = ((item.value / totalValue) * 100).toFixed(1);
                return (
                  <div 
                    key={item.name} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: '1px solid var(--border-subtle)',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedCategory(selectedCategory === item.name ? 'all' : item.name)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: 3, 
                        backgroundColor: item.color 
                      }} />
                      <span style={{ fontWeight: 500 }}>{item.name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                        {formatCurrency(item.value)}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{percent}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Filter by Category</h3>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button 
              className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            {Object.keys(categoryTotals).map(cat => (
              <button 
                key={cat}
                className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
              {selectedCategory === 'all' ? 'Total Portfolio' : selectedCategory}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {formatCurrency(selectedCategory === 'all' ? totalValue : categoryTotals[selectedCategory])}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              {filteredHoldings.length} holdings
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <h3 className="card-title">
            <Building2 size={20} />
            Holdings ({filteredHoldings.length})
          </h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th style={{ textAlign: 'right' }}>Value</th>
              <th style={{ textAlign: 'right' }}>Currency</th>
              <th style={{ textAlign: 'right' }}>Value (USD)</th>
              <th>As Of</th>
            </tr>
          </thead>
          <tbody>
            {filteredHoldings.map((holding) => {
              const rate = mockExchangeRates[holding.currency] || 1;
              const valueUSD = holding.value * rate;
              const badgeClass = holding.category === 'Cash' ? 'emerald' : 
                                holding.category === 'Bonds' ? 'sky' : 
                                holding.category === 'Funds' ? 'violet' : 'amber';
              
              return (
                <tr key={holding.id}>
                  <td className="asset-name">{holding.description}</td>
                  <td>
                    <span className={`badge ${badgeClass}`}>{holding.category}</span>
                  </td>
                  <td className="value" style={{ textAlign: 'right' }}>
                    {new Intl.NumberFormat('en-US', { 
                      minimumFractionDigits: 0 
                    }).format(holding.value)}
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--text-secondary)' }}>
                    {holding.currency}
                  </td>
                  <td className="value" style={{ textAlign: 'right' }}>{formatCurrency(valueUSD)}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{formatDate(holding.asOfDate)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '2px solid var(--border-color)', fontWeight: 600 }}>
              <td colSpan={4} style={{ paddingTop: 16 }}>Total</td>
              <td className="value" style={{ textAlign: 'right', paddingTop: 16 }}>
                {formatCurrency(filteredHoldings.reduce((sum, h) => {
                  const rate = mockExchangeRates[h.currency] || 1;
                  return sum + (h.value * rate);
                }, 0))}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default FamilyOffice;
