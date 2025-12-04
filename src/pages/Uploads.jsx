import { useState, useRef } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X,
  ArrowRight,
  ArrowLeft,
  Eye
} from 'lucide-react';
import { mockUploadBatches } from '../data/mockData';
import { formatDate, formatRelativeTime } from '../utils/formatters';

const SOURCE_TYPES = [
  { 
    id: 'self_managed_equities', 
    name: 'Self-Managed Equities',
    description: 'Excel export from your brokerage',
    icon: FileSpreadsheet,
    color: 'sky',
    accepts: '.xlsx,.xls,.csv'
  },
  { 
    id: 'ttwo_equity', 
    name: 'TTWO Equity Compensation',
    description: 'Excel export from Fidelity or IBI',
    icon: FileSpreadsheet,
    color: 'amber',
    accepts: '.xlsx,.xls,.csv'
  },
  { 
    id: 'family_office_excel', 
    name: 'Family Office (Excel)',
    description: 'Monthly statement in Excel format',
    icon: FileSpreadsheet,
    color: 'violet',
    accepts: '.xlsx,.xls,.csv'
  },
  { 
    id: 'family_office_pdf', 
    name: 'Family Office (PDF)',
    description: 'Monthly statement PDF (OCR processing)',
    icon: FileText,
    color: 'rose',
    accepts: '.pdf'
  }
];

function Uploads() {
  const [showUploadFlow, setShowUploadFlow] = useState(false);
  const [uploadStep, setUploadStep] = useState(1);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const startUpload = (sourceType) => {
    setSelectedSource(sourceType);
    setShowUploadFlow(true);
    setUploadStep(2);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadStep(3);
      simulateParsing();
    }
  };

  const simulateParsing = () => {
    setIsProcessing(true);
    // Simulate parsing delay
    setTimeout(() => {
      // Mock parsed data based on source type
      const mockParsedRows = selectedSource.id === 'self_managed_equities' ? [
        { ticker: 'AAPL', name: 'Apple Inc.', quantity: 150, costBasis: 125.50, currentValue: 178.25 },
        { ticker: 'MSFT', name: 'Microsoft Corp.', quantity: 80, costBasis: 285.00, currentValue: 378.50 },
        { ticker: 'GOOGL', name: 'Alphabet Inc.', quantity: 45, costBasis: 98.75, currentValue: 141.20 },
      ] : selectedSource.id === 'ttwo_equity' ? [
        { grantId: 'RSU-2024-001', grantDate: '2024-01-15', totalShares: 500, vestedShares: 62 },
        { grantId: 'RSU-2023-002', grantDate: '2023-06-01', totalShares: 600, vestedShares: 225 },
      ] : [
        { description: 'USD Cash Account', category: 'Cash', value: 450000, currency: 'USD' },
        { description: 'US Treasury 10Y', category: 'Bonds', value: 500000, currency: 'USD' },
        { description: 'Global Equity Fund', category: 'Funds', value: 820000, currency: 'USD' },
      ];
      
      setParsedData({
        rows: mockParsedRows,
        columns: Object.keys(mockParsedRows[0]),
        warnings: selectedSource.id === 'family_office_pdf' ? ['Low confidence on row 3'] : []
      });
      setIsProcessing(false);
    }, 1500);
  };

  const handleConfirm = () => {
    // Would save to Airtable here
    console.log('Saving parsed data:', parsedData);
    setUploadStep(4);
    setTimeout(() => {
      resetUpload();
    }, 2000);
  };

  const resetUpload = () => {
    setShowUploadFlow(false);
    setUploadStep(1);
    setSelectedSource(null);
    setSelectedFile(null);
    setParsedData(null);
  };

  return (
    <div>
      <header className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
        <h1 className="page-title">Uploads</h1>
            <p className="page-subtitle">Import data from Excel and PDF files</p>
      </div>
        </div>
      </header>

      {/* Source Type Selection */}
      {!showUploadFlow && (
        <>
          <div className="card" style={{ marginBottom: 32 }}>
            <div className="card-header">
              <h3 className="card-title">
                <Upload size={20} />
                New Upload
              </h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              Select the type of data you want to import:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {SOURCE_TYPES.map((source) => {
                const IconComponent = source.icon;
                return (
                  <div 
                    key={source.id}
                    className="asset-list-item"
                    style={{ cursor: 'pointer', padding: 20 }}
                    onClick={() => startUpload(source)}
                  >
                    <div className="asset-info">
                      <div className={`asset-icon`} style={{ 
                        background: `var(--accent-${source.color}-soft)`,
                        color: `var(--accent-${source.color})`
                      }}>
                        <IconComponent size={20} />
        </div>
                      <div className="asset-details">
                        <h4>{source.name}</h4>
                        <p>{source.description}</p>
        </div>
      </div>
                    <ArrowRight size={20} color="var(--text-muted)" />
        </div>
                );
              })}
        </div>
      </div>

          {/* Upload History */}
      <div className="card">
            <div className="card-header">
              <h3 className="card-title">Upload History</h3>
            </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>File</th>
              <th>Source Type</th>
              <th>Status</th>
                  <th>Rows</th>
              <th>Uploaded</th>
                  <th></th>
            </tr>
          </thead>
          <tbody>
                {mockUploadBatches.map((batch) => {
                  const source = SOURCE_TYPES.find(s => s.id === batch.sourceType);
              return (
                <tr key={batch.id}>
                  <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <FileSpreadsheet size={18} color="var(--text-muted)" />
                          <span className="asset-name">{batch.fileName}</span>
                    </div>
                  </td>
                  <td>
                        <span className={`badge ${source?.color || 'sky'}`}>
                          {source?.name || batch.sourceType}
                    </span>
                  </td>
                  <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {batch.status === 'completed' ? (
                            <CheckCircle size={16} color="var(--accent-emerald)" />
                          ) : (
                            <AlertCircle size={16} color="var(--accent-amber)" />
                          )}
                          <span style={{ 
                            color: batch.status === 'completed' ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                            textTransform: 'capitalize'
                          }}>
                            {batch.status}
                      </span>
                    </div>
                  </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{batch.rowsParsed}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                        {formatRelativeTime(batch.uploadedAt)}
                  </td>
                  <td>
                        <button className="btn btn-ghost btn-icon">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
        </>
      )}

      {/* Upload Flow Modal */}
      {showUploadFlow && (
        <div className="card">
          {/* Progress Steps */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: 32,
            padding: '0 48px'
          }}>
            {['Select Source', 'Upload File', 'Preview & Validate', 'Complete'].map((step, i) => (
              <div 
                key={step} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  opacity: uploadStep > i ? 1 : 0.4
                }}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: uploadStep > i ? 'var(--accent-emerald)' : 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: 14,
                  marginBottom: 8
                }}>
                  {uploadStep > i + 1 ? <CheckCircle size={18} /> : i + 1}
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{step}</span>
              </div>
            ))}
          </div>

          {/* Step 2: File Upload */}
          {uploadStep === 2 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h3 style={{ marginBottom: 8 }}>Upload {selectedSource?.name}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{selectedSource?.description}</p>
              </div>
              
              <input 
                type="file" 
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept={selectedSource?.accepts}
                onChange={handleFileSelect}
              />
              
              <div 
                className="upload-zone"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="upload-zone-icon">
                  <Upload size={24} />
                </div>
                <div className="upload-zone-text">
                  Drop your file here or click to browse
                </div>
                <div className="upload-zone-hint">
                  Accepts {selectedSource?.accepts}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                <button className="btn btn-secondary" onClick={resetUpload}>
                  <ArrowLeft size={18} />
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {uploadStep === 3 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h3 style={{ marginBottom: 8 }}>Preview & Validate</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {selectedFile?.name} • Review the parsed data before confirming
                </p>
              </div>

              {isProcessing ? (
                <div style={{ textAlign: 'center', padding: 48 }}>
                  <div className="upload-zone-icon" style={{ margin: '0 auto 16px' }}>
                    <FileSpreadsheet size={24} />
                  </div>
                  <p>Processing file...</p>
                </div>
              ) : parsedData && (
                <>
                  {parsedData.warnings.length > 0 && (
                    <div style={{ 
                      background: 'var(--accent-amber-soft)', 
                      border: '1px solid var(--accent-amber)',
                      borderRadius: 'var(--radius-md)',
                      padding: 16,
                      marginBottom: 24,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12
                    }}>
                      <AlertCircle size={20} color="var(--accent-amber)" />
                      <div>
                        <div style={{ fontWeight: 500, color: 'var(--accent-amber)' }}>Warnings</div>
                        {parsedData.warnings.map((w, i) => (
                          <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{w}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ 
                    background: 'var(--bg-secondary)', 
                    borderRadius: 'var(--radius-md)',
                    padding: 16,
                    marginBottom: 24
                  }}>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
                      Detected {parsedData.rows.length} rows with columns: {parsedData.columns.join(', ')}
                    </div>
                  </div>

                  <div style={{ maxHeight: 300, overflow: 'auto', marginBottom: 24 }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          {parsedData.columns.map(col => (
                            <th key={col}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parsedData.rows.map((row, i) => (
                          <tr key={i}>
                            {parsedData.columns.map(col => (
                              <td key={col}>
                                {typeof row[col] === 'number' 
                                  ? row[col].toLocaleString() 
                                  : row[col]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                <button className="btn btn-secondary" onClick={() => setUploadStep(2)}>
                  <ArrowLeft size={18} />
                  Re-upload
                </button>
                <button className="btn btn-primary" onClick={handleConfirm} disabled={isProcessing}>
                  Confirm & Save
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {uploadStep === 4 && (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ 
                width: 64, 
                height: 64, 
                borderRadius: '50%',
                background: 'var(--accent-emerald-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <CheckCircle size={32} color="var(--accent-emerald)" />
              </div>
              <h3 style={{ marginBottom: 8 }}>Upload Complete!</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                {parsedData?.rows.length} records have been imported successfully.
              </p>
          </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Uploads;
