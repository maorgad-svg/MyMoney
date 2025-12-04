import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Briefcase, Calendar, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  mockTTWOGrants, 
  mockTTWOVestEvents, 
  mockMarketData,
  mockScenarios 
} from '../../data/mockData';
import { formatCurrency, formatNumber, formatPercent, formatDate, formatQuarter } from '../../utils/formatters';

function TTWOGrantDetail() {
  const { id } = useParams();
  const [selectedScenario, setSelectedScenario] = useState('scenario_medium');
  
  const grant = mockTTWOGrants.find(g => g.id === id);
  const scenario = mockScenarios.find(s => s.id === selectedScenario);
  
  const ttwoPrice = mockMarketData.TTWO.currentPrice;
  const adjustedPrice = ttwoPrice * (1 + (scenario?.ttwoAdjustment || 0) / 100);

  const vestEvents = mockTTWOVestEvents.filter(v => v.grantId === id);
  
  const vestingChartData = useMemo(() => {
    return vestEvents.map(v => ({
      date: formatQuarter(v.vestDate),
      shares: v.shares,
      value: v.shares * ttwoPrice,
      valueAdjusted: v.shares * adjustedPrice,
      status: v.status
    }));
  }, [vestEvents, ttwoPrice, adjustedPrice]);

  if (!grant) {
    return (
      <div className="empty-state">
        <h3>Grant not found</h3>
        <Link to="/assets/ttwo" className="btn btn-primary" style={{ marginTop: 16 }}>
          Back to TTWO Equity
        </Link>
      </div>
    );
  }

  const vestProgress = (grant.vestedShares / grant.totalShares) * 100;
  const vestedValue = grant.vestedShares * ttwoPrice;
  const unvestedValue = grant.unvestedShares * ttwoPrice;
  const unvestedValueAdjusted = grant.unvestedShares * adjustedPrice;
  const totalValue = grant.totalShares * ttwoPrice;

  return (
    <div>
      <header className="page-header">
        <Link to="/assets/ttwo" className="btn btn-ghost" style={{ marginBottom: 12, marginLeft: -16 }}>
        <ArrowLeft size={18} />
        Back to TTWO Equity
      </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">{grant.grantId}</h1>
            <p className="page-subtitle">
              <span className="badge amber" style={{ marginRight: 8 }}>{grant.grantType}</span>
              Granted {formatDate(grant.grantDate)} • Source: {grant.source}
            </p>
          </div>
          <select 
            className="form-input" 
            style={{ width: 'auto', padding: '10px 16px' }}
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
          >
            {mockScenarios.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="summary-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="summary-card amber">
          <div className="summary-card-icon">
            <Briefcase size={22} />
          </div>
          <div className="summary-card-label">Total Shares</div>
          <div className="summary-card-value">{formatNumber(grant.totalShares)}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            {formatCurrency(totalValue)} value
          </div>
        </div>

        <div className="summary-card emerald">
          <div className="summary-card-icon">
            <CheckCircle size={22} />
          </div>
          <div className="summary-card-label">Vested</div>
          <div className="summary-card-value">{formatNumber(grant.vestedShares)}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            {formatCurrency(vestedValue)} • {vestProgress.toFixed(0)}%
          </div>
        </div>

        <div className="summary-card sky">
          <div className="summary-card-icon">
            <Clock size={22} />
          </div>
          <div className="summary-card-label">Unvested</div>
          <div className="summary-card-value">{formatNumber(grant.unvestedShares)}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            {formatCurrency(unvestedValue)} current
          </div>
        </div>

        <div className="summary-card violet">
          <div className="summary-card-icon">
            <TrendingUp size={22} />
          </div>
          <div className="summary-card-label">Unvested (Adjusted)</div>
          <div className="summary-card-value">{formatCurrency(unvestedValueAdjusted)}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            @ {formatCurrency(adjustedPrice)}/share
          </div>
        </div>
      </div>

      {/* Vesting Progress */}
      <div className="card" style={{ marginTop: 24, marginBottom: 24 }}>
        <div className="card-header">
          <h3 className="card-title">Vesting Progress</h3>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            {vestProgress.toFixed(1)}% complete
          </span>
        </div>
        <div className="progress-bar" style={{ height: 12 }}>
          <div className="progress-fill" style={{ width: `${vestProgress}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
          <span>Start: {formatDate(grant.vestingStartDate)}</span>
          <span>End: {formatDate(grant.vestingEndDate)}</span>
        </div>
      </div>

      {/* Chart and Events */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Vesting Schedule</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={vestingChartData}>
              <XAxis 
                dataKey="date" 
                stroke="#5c6370"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#5c6370"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1a2029',
                  border: '1px solid #2d3748',
                  borderRadius: '8px',
                  color: '#e6edf3'
                }}
                formatter={(value, name) => [formatNumber(value), 'Shares']}
              />
              <Bar dataKey="shares" radius={[4, 4, 0, 0]}>
                {vestingChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.status === 'vested' ? '#10b981' : '#f59e0b'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: '#10b981' }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Vested</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: '#f59e0b' }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Pending</span>
            </div>
          </div>
        </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <Calendar size={20} />
              All Vesting Events
          </h3>
        </div>
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {vestEvents.map((vest) => {
              const vestValue = vest.shares * ttwoPrice;
              const vestValueAdjusted = vest.shares * adjustedPrice;
              
              return (
                <div key={vest.id} className="vesting-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {vest.status === 'vested' ? (
                      <CheckCircle size={18} color="var(--accent-emerald)" />
                    ) : (
                      <Clock size={18} color="var(--accent-amber)" />
                    )}
                    <div>
                      <div style={{ fontWeight: 500 }}>{formatQuarter(vest.vestDate)}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {formatDate(vest.vestDate)}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                      {formatNumber(vest.shares)}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>shares</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', color: vest.status === 'vested' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                      {formatCurrency(vestValue)}
                    </div>
                    {vest.status === 'pending' && (
                      <div style={{ fontSize: 11, color: 'var(--accent-sky)' }}>
                        {formatCurrency(vestValueAdjusted)} adj.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grant Details */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <h3 className="card-title">Grant Details</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Grant ID</div>
            <div style={{ fontWeight: 500 }}>{grant.grantId}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Grant Type</div>
            <div style={{ fontWeight: 500 }}>{grant.grantType}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Grant Date</div>
            <div style={{ fontWeight: 500 }}>{formatDate(grant.grantDate)}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Source</div>
            <div style={{ fontWeight: 500 }}>{grant.source}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Vesting Schedule</div>
            <div style={{ fontWeight: 500 }}>{grant.vestingSchedule}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Vesting Start</div>
            <div style={{ fontWeight: 500 }}>{formatDate(grant.vestingStartDate)}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Vesting End</div>
            <div style={{ fontWeight: 500 }}>{formatDate(grant.vestingEndDate)}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Current TTWO Price</div>
            <div style={{ fontWeight: 500 }}>{formatCurrency(ttwoPrice)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TTWOGrantDetail;
