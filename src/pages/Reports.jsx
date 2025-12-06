import { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  Plus, 
  Calendar, 
  TrendingUp,
  Eye,
  Trash2
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { mockReports, mockScenarios, calculateNetWorth } from '../data/mockData';
import { formatCurrency, formatDate, formatRelativeTime } from '../utils/formatters';

function Reports() {
  const [reports, setReports] = useState(mockReports);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('scenario_medium');
  const [reportTitle, setReportTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const netWorth = useMemo(() => calculateNetWorth(), []);
  const scenario = mockScenarios.find(s => s.id === selectedScenario);

  // Generate projection preview
  const projectionPreview = useMemo(() => {
    const data = [];
    let value = netWorth.total;
    const growthRate = scenario?.assumptions?.publicEquities / 100 || 0.07;
    
    for (let year = 0; year <= 10; year++) {
      data.push({
        year: 2024 + year,
        value: Math.round(value)
      });
      value *= (1 + growthRate);
    }
    return data;
  }, [netWorth.total, scenario]);

  const handleGenerate = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const newReport = {
        id: `report_${Date.now()}`,
        title: reportTitle || `Net Worth Report - ${formatDate(new Date().toISOString())}`,
        generatedAt: new Date().toISOString(),
        scenario: scenario?.name || 'Medium',
        netWorthAtGeneration: netWorth.total,
        pdfPath: `/reports/report_${Date.now()}.pdf`
      };
      
      setReports([newReport, ...reports]);
      setIsGenerating(false);
      setShowGenerateModal(false);
      setReportTitle('');
    }, 2000);
  };

  return (
    <div>
      <header className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Reports</h1>
            <p className="page-subtitle">Generate and download PDF snapshots of your net worth</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowGenerateModal(true)}>
            <Plus size={18} />
            Generate Report
          </button>
        </div>
      </header>

      {/* Current Snapshot Preview */}
      <div className="charts-grid" style={{ marginBottom: 32 }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <TrendingUp size={20} />
              Current Net Worth
            </h3>
          </div>
          <div style={{ 
            fontSize: 42, 
            fontWeight: 700, 
            fontFamily: 'var(--font-mono)',
            marginBottom: 16,
            background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-sky))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {formatCurrency(netWorth.total)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Real Estate</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{formatCurrency(netWorth.realEstate)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Self-Managed</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{formatCurrency(netWorth.selfManagedEquities)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>TTWO Vested</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{formatCurrency(netWorth.ttwoVested)}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Family Office</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{formatCurrency(netWorth.familyOffice)}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Calendar size={20} />
              Latest Report
            </h3>
          </div>
          {reports[0] ? (
            <div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>{reports[0].title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Generated {formatRelativeTime(reports[0].generatedAt)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span className="badge violet">{reports[0].scenario}</span>
                <span style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: 13,
                  color: 'var(--text-secondary)'
                }}>
                  {formatCurrency(reports[0].netWorthAtGeneration)}
                </span>
              </div>
              <button className="btn btn-secondary" style={{ marginTop: 16, width: '100%' }}>
                <Download size={18} />
                Download PDF
              </button>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 24 }}>
              <p>No reports generated yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Reports History */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <FileText size={20} />
            Report History ({reports.length})
          </h3>
        </div>
        {reports.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Report Title</th>
                <th>Scenario</th>
                <th style={{ textAlign: 'right' }}>Net Worth</th>
                <th>Generated</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <FileText size={18} color="var(--accent-violet)" />
                      <span className="asset-name">{report.title}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge violet">{report.scenario}</span>
                  </td>
                  <td className="value" style={{ textAlign: 'right' }}>
                    {formatCurrency(report.netWorthAtGeneration)}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {formatDate(report.generatedAt)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost btn-icon" title="Preview">
                        <Eye size={16} />
                      </button>
                      <button className="btn btn-secondary btn-icon" title="Download">
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FileText size={28} />
            </div>
            <div className="empty-state-title">No reports yet</div>
            <div className="empty-state-text">
              Generate your first net worth snapshot report
            </div>
            <button className="btn btn-primary" onClick={() => setShowGenerateModal(true)}>
              <Plus size={18} />
              Generate Report
            </button>
          </div>
        )}
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="modal-overlay" onClick={() => !isGenerating && setShowGenerateModal(false)}>
          <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Generate Report</h2>
              <button 
                className="btn btn-ghost btn-icon" 
                onClick={() => setShowGenerateModal(false)}
                disabled={isGenerating}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Report Title (optional)</label>
                <input 
                  type="text" 
                  className="form-input"
                  placeholder={`Net Worth Report - ${formatDate(new Date().toISOString())}`}
                  value={reportTitle}
                  onChange={e => setReportTitle(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Projection Scenario</label>
                <select 
                  className="form-input"
                  value={selectedScenario}
                  onChange={e => setSelectedScenario(e.target.value)}
                  disabled={isGenerating}
                >
                  {mockScenarios.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                  {scenario?.description}
                </p>
              </div>

              <div style={{ 
                background: 'var(--bg-secondary)', 
                borderRadius: 'var(--radius-md)',
                padding: 20,
                marginTop: 24
              }}>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
                  10-Year Projection Preview ({scenario?.name})
                </div>
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={projectionPreview}>
                    <defs>
                      <linearGradient id="colorValueModal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="year" 
                      stroke="#5c6370"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#5c6370"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `$${(v / 1000000).toFixed(0)}M`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorValueModal)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Today</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                      {formatCurrency(netWorth.total)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Year 10</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--accent-violet)' }}>
                      {formatCurrency(projectionPreview[10]?.value || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowGenerateModal(false)}
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>Generating...</>
                ) : (
                  <>
                    <FileText size={18} />
                    Generate PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;




