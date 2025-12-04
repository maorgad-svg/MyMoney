import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, TrendingUp, Calendar, Clock, Upload, RefreshCw, ChevronRight } from 'lucide-react';
import { 
  mockTTWOGrants, 
  mockTTWOVestEvents, 
  mockMarketData, 
  mockScenarios 
} from '../../data/mockData';
import { formatCurrency, formatNumber, formatPercent, formatDate, formatQuarter } from '../../utils/formatters';

function TTWOEquity() {
  const [selectedScenario, setSelectedScenario] = useState('scenario_medium');
  const scenario = mockScenarios.find(s => s.id === selectedScenario);
  
  const ttwoPrice = mockMarketData.TTWO.currentPrice;
  const adjustedPrice = ttwoPrice * (1 + (scenario?.ttwoAdjustment || 0) / 100);

  const totals = useMemo(() => {
    const totalShares = mockTTWOGrants.reduce((sum, g) => sum + g.totalShares, 0);
    const vestedShares = mockTTWOGrants.reduce((sum, g) => sum + g.vestedShares, 0);
    const unvestedShares = mockTTWOGrants.reduce((sum, g) => sum + g.unvestedShares, 0);
    
    return {
      totalShares,
      vestedShares,
      unvestedShares,
      vestedValue: vestedShares * ttwoPrice,
      unvestedValue: unvestedShares * ttwoPrice,
      unvestedValueAdjusted: unvestedShares * adjustedPrice
    };
  }, [ttwoPrice, adjustedPrice]);

  // Get upcoming vest events
  const upcomingVests = mockTTWOVestEvents
    .filter(v => v.status === 'pending')
    .sort((a, b) => new Date(a.vestDate) - new Date(b.vestDate))
    .slice(0, 5);

  return (
    <div>
      <header className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">TTWO Equity Compensation</h1>
            <p className="page-subtitle">Track your Take-Two Interactive stock grants and vesting</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary">
              <RefreshCw size={18} />
              Refresh Price
            </button>
            <Link to="/uploads" className="btn btn-primary">
              <Upload size={18} />
              Upload New
            </Link>
          </div>
        </div>
      </header>

      {/* TTWO Price Card */}
      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, var(--bg-card), var(--bg-tertiary))' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>TTWO Live Price</div>
            <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
              {formatCurrency(ttwoPrice)}
            </div>
            <div className={`summary-card-change ${mockMarketData.TTWO.change >= 0 ? 'positive' : 'negative'}`} style={{ marginTop: 8 }}>
              {mockMarketData.TTWO.change >= 0 ? <TrendingUp size={14} /> : <TrendingUp size={14} />}
              {formatCurrency(mockMarketData.TTWO.change)} ({formatPercent(mockMarketData.TTWO.changePercent)}) today
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Scenario Adjusted Price ({scenario?.name})
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
              <div style={{ fontSize: 28, fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--accent-sky)' }}>
                {formatCurrency(adjustedPrice)}
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              {formatPercent(scenario?.ttwoAdjustment || 0)} from current
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="summary-card amber">
          <div className="summary-card-icon">
            <Briefcase size={22} />
          </div>
          <div className="summary-card-label">Total Shares</div>
          <div className="summary-card-value">{formatNumber(totals.totalShares)}</div>
        </div>

        <div className="summary-card emerald">
          <div className="summary-card-icon">
            <TrendingUp size={22} />
          </div>
          <div className="summary-card-label">Vested Value</div>
          <div className="summary-card-value">{formatCurrency(totals.vestedValue)}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            {formatNumber(totals.vestedShares)} shares
          </div>
        </div>

        <div className="summary-card sky">
          <div className="summary-card-icon">
            <Clock size={22} />
          </div>
          <div className="summary-card-label">Unvested Value</div>
          <div className="summary-card-value">{formatCurrency(totals.unvestedValue)}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            {formatNumber(totals.unvestedShares)} shares
              </div>
            </div>

        <div className="summary-card violet">
          <div className="summary-card-icon">
            <Calendar size={22} />
              </div>
          <div className="summary-card-label">Unvested (Adjusted)</div>
          <div className="summary-card-value">{formatCurrency(totals.unvestedValueAdjusted)}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
            Using {scenario?.name} scenario
          </div>
        </div>
      </div>

      <div className="charts-grid" style={{ marginTop: 32 }}>
        {/* Grants Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Briefcase size={20} />
              Stock Grants ({mockTTWOGrants.length})
            </h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Grant ID</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Total</th>
                <th style={{ textAlign: 'right' }}>Vested</th>
                <th style={{ textAlign: 'right' }}>Unvested</th>
                <th style={{ textAlign: 'right' }}>Value Today</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {mockTTWOGrants.map((grant) => {
                const vestedValue = grant.vestedShares * ttwoPrice;
                const vestProgress = (grant.vestedShares / grant.totalShares) * 100;
                
                return (
                  <tr key={grant.id}>
                    <td>
                      <div className="asset-name">{grant.grantId}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {formatDate(grant.grantDate)}
                      </div>
                    </td>
                    <td>
                      <span className="badge amber">{grant.grantType}</span>
                    </td>
                    <td className="value" style={{ textAlign: 'right' }}>{formatNumber(grant.totalShares)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="value positive">{formatNumber(grant.vestedShares)}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        {vestProgress.toFixed(0)}%
                      </div>
                    </td>
                    <td className="value" style={{ textAlign: 'right', color: 'var(--accent-amber)' }}>
                      {formatNumber(grant.unvestedShares)}
                    </td>
                    <td className="value" style={{ textAlign: 'right' }}>{formatCurrency(vestedValue)}</td>
                    <td>
                      <Link to={`/assets/ttwo/${grant.id}`} className="btn btn-ghost btn-icon">
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Upcoming Vests */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Calendar size={20} />
              Upcoming Vests
            </h3>
          </div>
          <div className="vesting-timeline">
            {upcomingVests.map((vest) => {
              const grant = mockTTWOGrants.find(g => g.id === vest.grantId);
              const vestValue = vest.shares * ttwoPrice;
              const vestValueAdjusted = vest.shares * adjustedPrice;
              
              return (
              <div key={vest.id} className="vesting-item">
                <div>
                    <div className="vesting-date">{formatQuarter(vest.vestDate)}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {formatDate(vest.vestDate)}
                    </div>
                  </div>
                  <div>
                    <div className="vesting-shares">{formatNumber(vest.shares)} shares</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {grant?.grantId}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="vesting-value">{formatCurrency(vestValue)}</div>
                    <div style={{ fontSize: 12, color: 'var(--accent-sky)' }}>
                      {formatCurrency(vestValueAdjusted)} adj.
                    </div>
                  </div>
                  <span className={`vesting-status ${vest.status}`}>{vest.status}</span>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link to="/assets/ttwo/all-vests" className="btn btn-ghost">
              View All Vesting Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TTWOEquity;
