import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Upload, ExternalLink, RefreshCw } from 'lucide-react';
import { mockSelfManagedEquities, mockUploadBatches } from '../../data/mockData';
import { formatCurrency, formatNumber, formatPercent, formatDate } from '../../utils/formatters';

function SelfManagedEquities() {
  const [holdings, setHoldings] = useState(mockSelfManagedEquities);

  const lastUpload = mockUploadBatches.find(b => b.sourceType === 'self_managed_equities');

  const totals = useMemo(() => {
    return holdings.reduce((acc, h) => {
      const marketValue = h.quantity * h.currentPrice;
      const costValue = h.quantity * h.costBasis;
      return {
        marketValue: acc.marketValue + marketValue,
        costBasis: acc.costBasis + costValue,
        gainLoss: acc.gainLoss + (marketValue - costValue)
      };
    }, { marketValue: 0, costBasis: 0, gainLoss: 0 });
  }, [holdings]);

  const gainLossPercent = (totals.gainLoss / totals.costBasis) * 100;

  return (
    <div>
      <header className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Self-Managed Equities</h1>
            <p className="page-subtitle">Your personal stock and ETF portfolio</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary">
              <RefreshCw size={18} />
              Refresh Prices
            </button>
            <Link to="/uploads" className="btn btn-primary">
              <Upload size={18} />
              Upload New
            </Link>
          </div>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="summary-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="summary-card sky">
          <div className="summary-card-icon">
            <TrendingUp size={22} />
          </div>
          <div className="summary-card-label">Market Value</div>
          <div className="summary-card-value">{formatCurrency(totals.marketValue)}</div>
        </div>

        <div className="summary-card violet">
          <div className="summary-card-icon">
            <TrendingUp size={22} />
          </div>
          <div className="summary-card-label">Cost Basis</div>
          <div className="summary-card-value">{formatCurrency(totals.costBasis)}</div>
        </div>

        <div className={`summary-card ${totals.gainLoss >= 0 ? 'emerald' : 'rose'}`}>
          <div className="summary-card-icon">
            {totals.gainLoss >= 0 ? <TrendingUp size={22} /> : <TrendingDown size={22} />}
          </div>
          <div className="summary-card-label">Total Gain/Loss</div>
          <div className="summary-card-value">{formatCurrency(totals.gainLoss)}</div>
          <div className={`summary-card-change ${totals.gainLoss >= 0 ? 'positive' : 'negative'}`}>
            {totals.gainLoss >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {formatPercent(gainLossPercent)}
          </div>
        </div>
      </div>

      {/* Data Source Info */}
      {lastUpload && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="asset-icon" style={{ background: 'var(--accent-emerald-soft)', color: 'var(--accent-emerald)' }}>
                <Upload size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 500 }}>Data from: {lastUpload.fileName}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Uploaded {formatDate(lastUpload.uploadedAt)} • {lastUpload.rowsParsed} holdings
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

      {/* Holdings Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <TrendingUp size={20} />
            Holdings ({holdings.length})
          </h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Name</th>
              <th style={{ textAlign: 'right' }}>Quantity</th>
              <th style={{ textAlign: 'right' }}>Avg Cost</th>
              <th style={{ textAlign: 'right' }}>Current Price</th>
              <th style={{ textAlign: 'right' }}>Market Value</th>
              <th style={{ textAlign: 'right' }}>Gain/Loss</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => {
              const marketValue = holding.quantity * holding.currentPrice;
              const costValue = holding.quantity * holding.costBasis;
              const gainLoss = marketValue - costValue;
              const gainLossPercent = (gainLoss / costValue) * 100;
              
              return (
                <tr key={holding.id}>
                  <td>
                    <span className="badge sky">{holding.ticker}</span>
                  </td>
                  <td className="asset-name">{holding.name}</td>
                  <td className="value" style={{ textAlign: 'right' }}>{formatNumber(holding.quantity)}</td>
                  <td className="value" style={{ textAlign: 'right' }}>{formatCurrency(holding.costBasis)}</td>
                  <td className="value" style={{ textAlign: 'right' }}>{formatCurrency(holding.currentPrice)}</td>
                  <td className="value" style={{ textAlign: 'right' }}>{formatCurrency(marketValue)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className={gainLoss >= 0 ? 'positive' : 'negative'} style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                      {formatCurrency(gainLoss)}
                    </div>
                    <div style={{ fontSize: 12, color: gainLoss >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                      {formatPercent(gainLossPercent)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '2px solid var(--border-color)', fontWeight: 600 }}>
              <td colSpan={5} style={{ paddingTop: 16 }}>Total</td>
              <td className="value" style={{ textAlign: 'right', paddingTop: 16 }}>{formatCurrency(totals.marketValue)}</td>
              <td style={{ textAlign: 'right', paddingTop: 16 }}>
                <div className={totals.gainLoss >= 0 ? 'positive' : 'negative'} style={{ fontFamily: 'var(--font-mono)' }}>
                  {formatCurrency(totals.gainLoss)}
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default SelfManagedEquities;
