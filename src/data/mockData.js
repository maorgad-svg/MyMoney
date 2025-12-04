// Mock data mirroring Airtable schema structure
// This will be replaced with Airtable API calls

export const mockUser = {
  id: 'user_1',
  email: 'gad@example.com',
  name: 'Gad Maor',
  baseCurrency: 'USD',
  createdAt: '2024-01-01'
};

// Real Estate Assets
export const mockRealEstate = [
  {
    id: 're_1',
    name: 'Tel Aviv Apartment',
    address: '123 Rothschild Blvd, Tel Aviv',
    country: 'Israel',
    purchaseDate: '2019-06-15',
    purchasePrice: 850000,
    currentValue: 1200000,
    currency: 'USD',
    mortgageBalance: 320000,
    mortgageRate: 3.5,
    mortgageEndDate: '2044-06-15',
    monthlyRent: 3500,
    monthlyExpenses: 800,
    appreciationAssumption: 3.5,
    lastUpdated: '2024-11-01',
    notes: 'Prime location, recently renovated'
  },
  {
    id: 're_2',
    name: 'NYC Investment Property',
    address: '456 Park Ave, New York',
    country: 'USA',
    purchaseDate: '2021-03-20',
    purchasePrice: 1500000,
    currentValue: 1650000,
    currency: 'USD',
    mortgageBalance: 950000,
    mortgageRate: 4.2,
    mortgageEndDate: '2051-03-20',
    monthlyRent: 8500,
    monthlyExpenses: 2200,
    appreciationAssumption: 2.5,
    lastUpdated: '2024-10-15',
    notes: 'Managed by property management company'
  }
];

// Self-managed Equities (from Excel uploads)
export const mockSelfManagedEquities = [
  { id: 'eq_1', ticker: 'AAPL', name: 'Apple Inc.', quantity: 150, costBasis: 125.50, currentPrice: 178.25, currency: 'USD', asOfDate: '2024-11-28' },
  { id: 'eq_2', ticker: 'MSFT', name: 'Microsoft Corp.', quantity: 80, costBasis: 285.00, currentPrice: 378.50, currency: 'USD', asOfDate: '2024-11-28' },
  { id: 'eq_3', ticker: 'GOOGL', name: 'Alphabet Inc.', quantity: 45, costBasis: 98.75, currentPrice: 141.20, currency: 'USD', asOfDate: '2024-11-28' },
  { id: 'eq_4', ticker: 'NVDA', name: 'NVIDIA Corp.', quantity: 60, costBasis: 220.00, currentPrice: 467.80, currency: 'USD', asOfDate: '2024-11-28' },
  { id: 'eq_5', ticker: 'VTI', name: 'Vanguard Total Stock ETF', quantity: 200, costBasis: 195.00, currentPrice: 248.30, currency: 'USD', asOfDate: '2024-11-28' },
  { id: 'eq_6', ticker: 'VOO', name: 'Vanguard S&P 500 ETF', quantity: 120, costBasis: 380.00, currentPrice: 518.45, currency: 'USD', asOfDate: '2024-11-28' },
];

// TTWO Equity Compensation Grants
export const mockTTWOGrants = [
  {
    id: 'grant_1',
    grantId: 'RSU-2022-001',
    grantDate: '2022-03-15',
    grantType: 'RSU',
    totalShares: 400,
    vestedShares: 300,
    unvestedShares: 100,
    vestingSchedule: 'quarterly',
    vestingStartDate: '2022-06-15',
    vestingEndDate: '2026-03-15',
    source: 'Fidelity'
  },
  {
    id: 'grant_2',
    grantId: 'RSU-2023-002',
    grantDate: '2023-06-01',
    grantType: 'RSU',
    totalShares: 600,
    vestedShares: 225,
    unvestedShares: 375,
    vestingSchedule: 'quarterly',
    vestingStartDate: '2023-09-01',
    vestingEndDate: '2027-06-01',
    source: 'Fidelity'
  },
  {
    id: 'grant_3',
    grantId: 'RSU-2024-003',
    grantDate: '2024-01-15',
    grantType: 'RSU',
    totalShares: 500,
    vestedShares: 62,
    unvestedShares: 438,
    vestingSchedule: 'quarterly',
    vestingStartDate: '2024-04-15',
    vestingEndDate: '2028-01-15',
    source: 'IBI'
  }
];

// TTWO Vesting Events
export const mockTTWOVestEvents = [
  // Grant 1 events
  { id: 'vest_1', grantId: 'grant_1', vestDate: '2022-06-15', shares: 25, status: 'vested' },
  { id: 'vest_2', grantId: 'grant_1', vestDate: '2022-09-15', shares: 25, status: 'vested' },
  { id: 'vest_3', grantId: 'grant_1', vestDate: '2022-12-15', shares: 25, status: 'vested' },
  { id: 'vest_4', grantId: 'grant_1', vestDate: '2023-03-15', shares: 25, status: 'vested' },
  { id: 'vest_5', grantId: 'grant_1', vestDate: '2023-06-15', shares: 25, status: 'vested' },
  { id: 'vest_6', grantId: 'grant_1', vestDate: '2023-09-15', shares: 25, status: 'vested' },
  { id: 'vest_7', grantId: 'grant_1', vestDate: '2023-12-15', shares: 25, status: 'vested' },
  { id: 'vest_8', grantId: 'grant_1', vestDate: '2024-03-15', shares: 25, status: 'vested' },
  { id: 'vest_9', grantId: 'grant_1', vestDate: '2024-06-15', shares: 25, status: 'vested' },
  { id: 'vest_10', grantId: 'grant_1', vestDate: '2024-09-15', shares: 25, status: 'vested' },
  { id: 'vest_11', grantId: 'grant_1', vestDate: '2024-12-15', shares: 25, status: 'vested' },
  { id: 'vest_12', grantId: 'grant_1', vestDate: '2025-03-15', shares: 25, status: 'pending' },
  { id: 'vest_13', grantId: 'grant_1', vestDate: '2025-06-15', shares: 25, status: 'pending' },
  { id: 'vest_14', grantId: 'grant_1', vestDate: '2025-09-15', shares: 25, status: 'pending' },
  { id: 'vest_15', grantId: 'grant_1', vestDate: '2025-12-15', shares: 25, status: 'pending' },
  // Grant 2 events (partial)
  { id: 'vest_20', grantId: 'grant_2', vestDate: '2023-09-01', shares: 37, status: 'vested' },
  { id: 'vest_21', grantId: 'grant_2', vestDate: '2023-12-01', shares: 37, status: 'vested' },
  { id: 'vest_22', grantId: 'grant_2', vestDate: '2024-03-01', shares: 38, status: 'vested' },
  { id: 'vest_23', grantId: 'grant_2', vestDate: '2024-06-01', shares: 37, status: 'vested' },
  { id: 'vest_24', grantId: 'grant_2', vestDate: '2024-09-01', shares: 38, status: 'vested' },
  { id: 'vest_25', grantId: 'grant_2', vestDate: '2024-12-01', shares: 38, status: 'vested' },
  { id: 'vest_26', grantId: 'grant_2', vestDate: '2025-03-01', shares: 37, status: 'pending' },
  { id: 'vest_27', grantId: 'grant_2', vestDate: '2025-06-01', shares: 38, status: 'pending' },
  { id: 'vest_28', grantId: 'grant_2', vestDate: '2025-09-01', shares: 37, status: 'pending' },
  { id: 'vest_29', grantId: 'grant_2', vestDate: '2025-12-01', shares: 38, status: 'pending' },
];

// Family Office Holdings
export const mockFamilyOffice = [
  { id: 'fo_1', category: 'Cash', description: 'USD Cash Account', value: 450000, currency: 'USD', asOfDate: '2024-11-01' },
  { id: 'fo_2', category: 'Cash', description: 'EUR Cash Account', value: 125000, currency: 'EUR', asOfDate: '2024-11-01' },
  { id: 'fo_3', category: 'Bonds', description: 'US Treasury 10Y', value: 500000, currency: 'USD', asOfDate: '2024-11-01' },
  { id: 'fo_4', category: 'Bonds', description: 'Corporate Bond Fund', value: 350000, currency: 'USD', asOfDate: '2024-11-01' },
  { id: 'fo_5', category: 'Funds', description: 'Global Equity Fund', value: 820000, currency: 'USD', asOfDate: '2024-11-01' },
  { id: 'fo_6', category: 'Funds', description: 'Emerging Markets Fund', value: 280000, currency: 'USD', asOfDate: '2024-11-01' },
  { id: 'fo_7', category: 'Alternatives', description: 'Private Equity Fund I', value: 400000, currency: 'USD', asOfDate: '2024-11-01' },
  { id: 'fo_8', category: 'Alternatives', description: 'Hedge Fund Allocation', value: 350000, currency: 'USD', asOfDate: '2024-11-01' },
  { id: 'fo_9', category: 'Alternatives', description: 'Real Assets Fund', value: 200000, currency: 'USD', asOfDate: '2024-11-01' },
];

// Upload Batches
export const mockUploadBatches = [
  {
    id: 'batch_1',
    sourceType: 'self_managed_equities',
    fileName: 'portfolio_nov_2024.xlsx',
    status: 'completed',
    rowsParsed: 6,
    errors: [],
    uploadedAt: '2024-11-28T10:30:00Z'
  },
  {
    id: 'batch_2',
    sourceType: 'ttwo_equity',
    fileName: 'fidelity_grants_nov_2024.xlsx',
    status: 'completed',
    rowsParsed: 3,
    errors: [],
    uploadedAt: '2024-11-25T14:15:00Z'
  },
  {
    id: 'batch_3',
    sourceType: 'family_office_excel',
    fileName: 'family_office_statement_nov.xlsx',
    status: 'completed',
    rowsParsed: 9,
    errors: [],
    uploadedAt: '2024-11-20T09:45:00Z'
  },
  {
    id: 'batch_4',
    sourceType: 'family_office_pdf',
    fileName: 'fo_statement_oct.pdf',
    status: 'completed',
    rowsParsed: 8,
    errors: ['Warning: Low confidence on row 5'],
    uploadedAt: '2024-10-22T11:20:00Z'
  }
];

// Scenarios
export const mockScenarios = [
  {
    id: 'scenario_low',
    name: 'Low / Conservative',
    description: 'Conservative growth assumptions with lower risk',
    isDefault: true,
    assumptions: {
      realEstate: 1.5,
      publicEquities: 4.0,
      managedPortfolio: 3.5,
      bonds: 2.0,
      alternatives: 5.0,
      cash: 1.0,
      ttwoEquity: 3.0
    },
    ttwoAdjustment: -20 // -20% from current price
  },
  {
    id: 'scenario_medium',
    name: 'Medium / Base Case',
    description: 'Moderate growth based on historical averages',
    isDefault: true,
    assumptions: {
      realEstate: 3.0,
      publicEquities: 7.0,
      managedPortfolio: 6.0,
      bonds: 3.5,
      alternatives: 8.0,
      cash: 2.0,
      ttwoEquity: 7.0
    },
    ttwoAdjustment: 0 // Current price
  },
  {
    id: 'scenario_high',
    name: 'High / Optimistic',
    description: 'Optimistic growth with higher risk tolerance',
    isDefault: true,
    assumptions: {
      realEstate: 5.0,
      publicEquities: 10.0,
      managedPortfolio: 9.0,
      bonds: 4.5,
      alternatives: 12.0,
      cash: 3.0,
      ttwoEquity: 12.0
    },
    ttwoAdjustment: 30 // +30% from current price
  }
];

// Reports
export const mockReports = [
  {
    id: 'report_1',
    title: 'Q3 2024 Net Worth Snapshot',
    generatedAt: '2024-10-01T10:00:00Z',
    scenario: 'Medium / Base Case',
    netWorthAtGeneration: 8250000,
    pdfPath: '/reports/q3_2024_snapshot.pdf'
  },
  {
    id: 'report_2',
    title: 'November 2024 Monthly Review',
    generatedAt: '2024-11-15T14:30:00Z',
    scenario: 'Medium / Base Case',
    netWorthAtGeneration: 8456000,
    pdfPath: '/reports/nov_2024_review.pdf'
  }
];

// Live market data (simulated)
export const mockMarketData = {
  TTWO: {
    ticker: 'TTWO',
    name: 'Take-Two Interactive Software',
    currentPrice: 178.50,
    change: 2.35,
    changePercent: 1.33,
    lastUpdated: new Date().toISOString()
  }
};

// Currency exchange rates (USD base)
export const mockExchangeRates = {
  USD: 1.0,
  EUR: 1.08,
  GBP: 1.27,
  ILS: 0.27
};

// Helper functions to calculate values
export const calculateNetWorth = () => {
  // Real Estate net equity
  const realEstateNet = mockRealEstate.reduce((sum, prop) => 
    sum + (prop.currentValue - prop.mortgageBalance), 0);
  
  // Self-managed equities
  const selfManagedValue = mockSelfManagedEquities.reduce((sum, eq) => 
    sum + (eq.quantity * eq.currentPrice), 0);
  
  // TTWO vested shares value
  const ttwoVestedShares = mockTTWOGrants.reduce((sum, g) => sum + g.vestedShares, 0);
  const ttwoVestedValue = ttwoVestedShares * mockMarketData.TTWO.currentPrice;
  
  // Family office total
  const familyOfficeValue = mockFamilyOffice.reduce((sum, h) => {
    const rate = mockExchangeRates[h.currency] || 1;
    return sum + (h.value * rate);
  }, 0);
  
  return {
    realEstate: realEstateNet,
    selfManagedEquities: selfManagedValue,
    ttwoVested: ttwoVestedValue,
    familyOffice: familyOfficeValue,
    total: realEstateNet + selfManagedValue + ttwoVestedValue + familyOfficeValue
  };
};

export const calculateTTWOUnvestedValue = (scenarioAdjustment = 0) => {
  const unvestedShares = mockTTWOGrants.reduce((sum, g) => sum + g.unvestedShares, 0);
  const adjustedPrice = mockMarketData.TTWO.currentPrice * (1 + scenarioAdjustment / 100);
  return unvestedShares * adjustedPrice;
};
