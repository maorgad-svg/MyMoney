import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Home, 
  Briefcase, 
  Building2, 
  LineChart,
  Plus,
  Upload,
  FileText,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  calculateNetWorth, 
  calculateTTWOUnvestedValue,
  mockUploadBatches, 
  mockReports,
  mockMarketData,
  mockScenarios
} from '../data/mockData';
import { formatCurrency, formatCompactCurrency, formatPercent, formatRelativeTime } from '../utils/formatters';

const COLORS = ['#10b981', '#0ea5e9', '#f59e0b', '#8b5cf6'];

function Dashboard() {
  const [selectedScenario, setSelectedScenario] = useState('scenario_medium');
  
  const netWorth = useMemo(() => calculateNetWorth(), []);
  const scenario = mockScenarios.find(s => s.id === selectedScenario);
  const ttwoUnvested = useMemo(() => 
    calculateTTWOUnvestedValue(scenario?.ttwoAdjustment || 0), 
    [scenario]
  );

  // Pie chart data
  const pieData = [
    { name: 'Real Estate', value: netWorth.realEstate, color: '#10b981' },
    { name: 'Self-Managed', value: netWorth.selfManagedEquities, color: '#0ea5e9' },
    { name: 'TTWO Vested', value: netWorth.ttwoVested, color: '#f59e0b' },
    { name: 'Family Office', value: netWorth.familyOffice, color: '#8b5cf6' }
  ];

  // Projection data (simplified - would come from projection engine)
  const projectionData = useMemo(() => {
    const data = [];
    let value = netWorth.total;
    const growthRate = scenario?.assumptions?.publicEquities / 100 || 0.07;
    
    for (let year = 0; year <= 10; year++) {
      data.push({
        year: 2024 + year,
        value: Math.round(value),
        label: `Year ${year}`
      });
      value *= (1 + growthRate);
    }
    return data;
  }, [netWorth.total, scenario]);

  const recentUploads = mockUploadBatches.slice(0, 3);
  const recentReports = mockReports.slice(0, 2);

  return (
    <div>
      <header className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Your complete financial overview</p>
      </header>

      {/* Net Worth Display */}
      <div className="net-worth-display">
        <div className="net-worth-label">Total Net Worth</div>
        <div className="net-worth-value">{formatCurrency(netWorth.total)}</div>
        <div className="net-worth-updated">
          Updated {formatRelativeTime(new Date().toISOString())} • TTWO @ {formatCurrency(mockMarketData.TTWO.currentPrice)}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card emerald">
          <div className="summary-card-icon">
            <Home size={22} />
          </div>
          <div className="summary-card-label">Real Estate (Net)</div>
          <div className="summary-card-value">{formatCompactCurrency(netWorth.realEstate)}</div>
          <div className="summary-card-change positive">
            <TrendingUp size={14} />
            {formatPercent(((netWorth.realEstate / netWorth.total) * 100), 1).replace('+', '')} of total
          </div>
        </div>

        <div className="summary-card sky">
          <div className="summary-card-icon">
            <TrendingUp size={22} />
          </div>
          <div className="summary-card-label">Self-Managed Equities</div>
          <div className="summary-card-value">{formatCompactCurrency(netWorth.selfManagedEquities)}</div>
          <div className="summary-card-change positive">
            <TrendingUp size={14} />
            {formatPercent(((netWorth.selfManagedEquities / netWorth.total) * 100), 1).replace('+', '')} of total
          </div>
        </div>

        <div className="summary-card amber">
          <div className="summary-card-icon">
            <Briefcase size={22} />
          </div>
          <div className="summary-card-label">TTWO Vested</div>
          <div className="summary-card-value">{formatCompactCurrency(netWorth.ttwoVested)}</div>
          <div className="summary-card-change positive">
            <DollarSign size={14} />
            {formatCompactCurrency(ttwoUnvested)} unvested
          </div>
        </div>

        <div className="summary-card violet">
          <div className="summary-card-icon">
            <Building2 size={22} />
          </div>
          <div className="summary-card-label">Family Office</div>
          <div className="summary-card-value">{formatCompactCurrency(netWorth.familyOffice)}</div>
          <div className="summary-card-change positive">
            <TrendingUp size={14} />
            {formatPercent(((netWorth.familyOffice / netWorth.total) * 100), 1).replace('+', '')} of total
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">10-Year Projection</h3>
            <select 
              className="form-input" 
              style={{ width: 'auto', padding: '8px 12px' }}
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
            >
              {mockScenarios.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="year" 
                stroke="#5c6370"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#5c6370"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1a2029',
                  border: '1px solid #2d3748',
                  borderRadius: '8px',
                  color: '#e6edf3'
                }}
                formatter={(value) => [formatCurrency(value), 'Net Worth']}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Asset Allocation</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {pieData.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: item.color }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <Link to="/assets/real-estate" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
              <Plus size={18} />
              Add Property
            </Link>
            <Link to="/uploads" className="btn btn-secondary" style={{ justifyContent: 'center' }}>
              <Upload size={18} />
              Upload File
            </Link>
            <Link to="/reports" className="btn btn-primary" style={{ justifyContent: 'center' }}>
              <FileText size={18} />
              Generate Report
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Uploads</h3>
            <Link to="/uploads" className="btn btn-ghost btn-icon">
              <ArrowRight size={18} />
            </Link>
          </div>
          {recentUploads.map((upload) => (
            <div key={upload.id} className="asset-list-item" style={{ marginBottom: 8 }}>
              <div className="asset-info">
                <div className="asset-icon" style={{ 
                  background: upload.status === 'completed' ? 'var(--accent-emerald-soft)' : 'var(--accent-amber-soft)',
                  color: upload.status === 'completed' ? 'var(--accent-emerald)' : 'var(--accent-amber)'
                }}>
                  <Upload size={18} />
                </div>
                <div className="asset-details">
                  <h4>{upload.fileName}</h4>
                  <p>{upload.sourceType.replace(/_/g, ' ')}</p>
                </div>
              </div>
              <div className="asset-value-info">
                <span className={`badge ${upload.status === 'completed' ? 'emerald' : 'amber'}`}>
                  {upload.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TTWO Live Price Widget */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <h3 className="card-title">
            <Briefcase size={20} />
            TTWO Live Price
          </h3>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Last updated: {formatRelativeTime(mockMarketData.TTWO.lastUpdated)}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {formatCurrency(mockMarketData.TTWO.currentPrice)}
            </div>
            <div className={`summary-card-change ${mockMarketData.TTWO.change >= 0 ? 'positive' : 'negative'}`}>
              {mockMarketData.TTWO.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {formatCurrency(mockMarketData.TTWO.change)} ({formatPercent(mockMarketData.TTWO.changePercent)})
            </div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 4 }}>
              Scenario Adjusted ({scenario?.name})
            </div>
            <div style={{ fontSize: 20, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--accent-sky)' }}>
              {formatCurrency(mockMarketData.TTWO.currentPrice * (1 + (scenario?.ttwoAdjustment || 0) / 100))}
              <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 8 }}>
                ({formatPercent(scenario?.ttwoAdjustment || 0)})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
