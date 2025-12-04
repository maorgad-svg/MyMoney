# Airtable Schema for Net Worth Dashboard

This document provides the complete schema and setup instructions for creating your Airtable base.

---

## 📋 Overview

Your base will contain **12 tables** organized into these groups:

| Group | Tables |
|-------|--------|
| **Core Assets** | Real Estate, Public Equity Holdings, Equity Comp Grants, Equity Comp Vest Events, Family Office Holdings |
| **Data Ingestion** | Upload Batches, OCR Tables |
| **Market Data** | Price History |
| **Projections** | Scenarios, Scenario Assumptions |
| **Output** | Reports |
| **System** | Settings (single-user config) |

---

## 🏗️ Step-by-Step Setup

### Step 1: Create a New Base

1. Go to [airtable.com](https://airtable.com)
2. Click **"Add a base"** → **"Start from scratch"**
3. Name it: `Net Worth Dashboard`

---

### Step 2: Create Tables

Create each table below in order (relationships depend on this order).

---

## 📊 Table Schemas

### 1. Settings (Single User Config)

> This replaces a full `users` table since it's a single-user app.

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| `Name` | Single line text | Your name |
| `Email` | Email | Your email |
| `Base Currency` | Single select | `USD`, `EUR`, `ILS`, `GBP` |
| `TTWO Ticker` | Single line text | Default: `TTWO` |
| `Created At` | Created time | Auto |

**Initial Record:** Add one record with your info.

---

### 2. Real Estate

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| `Name` | Single line text | Primary field, e.g., "Tel Aviv Apartment" |
| `Address` | Long text | Full street address |
| `Country` | Single select | `USA`, `Israel`, `UK`, `Other` |
| `Purchase Date` | Date | Date format |
| `Purchase Price` | Currency | USD |
| `Current Value` | Currency | USD - manually updated |
| `Currency` | Single select | `USD`, `EUR`, `ILS`, `GBP` |
| `Mortgage Balance` | Currency | USD |
| `Mortgage Rate` | Percent | e.g., 3.5% |
| `Mortgage End Date` | Date | |
| `Monthly Rent` | Currency | USD |
| `Monthly Expenses` | Currency | USD |
| `Appreciation Assumption` | Percent | For projections, e.g., 3% |
| `Notes` | Long text | |
| `Status` | Single select | `Active`, `Archived` |
| `Last Updated` | Last modified time | Auto |
| `Net Equity` | Formula | `{Current Value} - {Mortgage Balance}` |
| `Monthly Cashflow` | Formula | `{Monthly Rent} - {Monthly Expenses}` |

---

### 3. Upload Batches

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| `Batch ID` | Autonumber | Primary field |
| `Source Type` | Single select | `Self Managed Equities`, `TTWO Equity Fidelity`, `TTWO Equity IBI`, `Family Office Excel`, `Family Office PDF` |
| `File Name` | Single line text | Original filename |
| `File Attachment` | Attachment | The uploaded file |
| `Status` | Single select | `Pending`, `Processing`, `Completed`, `Failed` |
| `Rows Parsed` | Number | Integer |
| `Errors` | Long text | JSON array of error messages |
| `Warnings` | Long text | JSON array of warnings |
| `As Of Date` | Date | Date the data represents |
| `Uploaded At` | Created time | Auto |
| `Public Equity Holdings` | Link to another record | → Public Equity Holdings (many) |
| `Equity Comp Grants` | Link to another record | → Equity Comp Grants (many) |
| `Family Office Holdings` | Link to another record | → Family Office Holdings (many) |

---

### 4. Public Equity Holdings

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| `Record ID` | Autonumber | Primary field |
| `Ticker` | Single line text | e.g., `AAPL` |
| `Name` | Single line text | e.g., "Apple Inc." |
| `Quantity` | Number | Decimal |
| `Cost Basis` | Currency | USD - per share |
| `Current Price` | Currency | USD - can be updated via API |
| `Currency` | Single select | `USD` |
| `As Of Date` | Date | From upload |
| `Upload Batch` | Link to another record | → Upload Batches |
| `Market Value` | Formula | `{Quantity} * {Current Price}` |
| `Total Cost` | Formula | `{Quantity} * {Cost Basis}` |
| `Gain Loss` | Formula | `{Market Value} - {Total Cost}` |
| `Gain Loss Percent` | Formula | `IF({Total Cost} > 0, {Gain Loss} / {Total Cost}, 0)` |

---

### 5. Equity Comp Grants

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| `Grant ID` | Single line text | Primary field, e.g., "RSU-2024-001" |
| `Grant Type` | Single select | `RSU`, `Stock Option`, `ESPP` |
| `Grant Date` | Date | |
| `Total Shares` | Number | Integer |
| `Vesting Schedule` | Single select | `Quarterly`, `Annual`, `Monthly`, `Cliff` |
| `Vesting Start Date` | Date | |
| `Vesting End Date` | Date | |
| `Source` | Single select | `Fidelity`, `IBI` |
| `Upload Batch` | Link to another record | → Upload Batches |
| `Vest Events` | Link to another record | → Equity Comp Vest Events (many) |
| `Notes` | Long text | |
| `Status` | Single select | `Active`, `Completed`, `Cancelled` |
| `Vested Shares` | Rollup | COUNTA or SUM from Vest Events where status = vested |
| `Unvested Shares` | Formula | `{Total Shares} - {Vested Shares}` |

---

### 6. Equity Comp Vest Events

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| `Event ID` | Autonumber | Primary field |
| `Grant` | Link to another record | → Equity Comp Grants |
| `Vest Date` | Date | |
| `Shares` | Number | Integer |
| `Status` | Single select | `Vested`, `Pending`, `Cancelled` |
| `Price At Vest` | Currency | USD - filled when vested |
| `Value At Vest` | Formula | `IF({Status} = "Vested", {Shares} * {Price At Vest}, 0)` |

---

### 7. Family Office Holdings

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| `Record ID` | Autonumber | Primary field |
| `Description` | Single line text | e.g., "US Treasury 10Y" |
| `Category` | Single select | `Cash`, `Bonds`, `Funds`, `Alternatives`, `Other` |
| `Value` | Currency | In original currency |
| `Currency` | Single select | `USD`, `EUR`, `ILS`, `GBP` |
| `Value USD` | Currency | Converted to USD |
| `Quantity` | Number | Optional, if applicable |
| `As Of Date` | Date | Statement date |
| `Upload Batch` | Link to another record | → Upload Batches |
| `Notes` | Long text | |

---

### 8. Price History

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| `Record ID` | Autonumber | Primary field |
| `Ticker` | Single line text | e.g., `TTWO` |
| `Date` | Date | |
| `Open` | Currency | USD |
| `High` | Currency | USD |
| `Low` | Currency | USD |
| `Close` | Currency | USD |
| `Volume` | Number | Integer |
| `Source` | Single select | `Yahoo Finance`, `Manual` |
| `Fetched At` | Created time | Auto |

---

### 9. OCR Tables

> For PDF processing results before normalization

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| `Record ID` | Autonumber | Primary field |
| `Upload Batch` | Link to another record | → Upload Batches |
| `Page Number` | Number | |
| `Table Index` | Number | If multiple tables on page |
| `Raw JSON` | Long text | Extracted table as JSON |
| `Confidence Score` | Percent | OCR confidence |
| `Status` | Single select | `Pending Review`, `Approved`, `Rejected` |
| `Processed At` | Created time | Auto |

---

### 10. Scenarios

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| `Name` | Single line text | Primary field, e.g., "Medium / Base Case" |
| `Description` | Long text | |
| `Is Default` | Checkbox | True for Low/Medium/High |
| `TTWO Price Adjustment` | Percent | e.g., -20%, 0%, +30% |
| `Assumptions` | Link to another record | → Scenario Assumptions (many) |
| `Created At` | Created time | Auto |
| `Last Modified` | Last modified time | Auto |

---

### 11. Scenario Assumptions

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| `Record ID` | Autonumber | Primary field |
| `Scenario` | Link to another record | → Scenarios |
| `Asset Class` | Single select | `Real Estate`, `Public Equities`, `Managed Portfolio`, `Bonds`, `Alternatives`, `Cash`, `TTWO Equity` |
| `Annual Return` | Percent | e.g., 7% |

---

### 12. Reports

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| `Report ID` | Autonumber | Primary field |
| `Title` | Single line text | e.g., "Q4 2024 Net Worth Snapshot" |
| `Scenario` | Link to another record | → Scenarios |
| `Net Worth At Generation` | Currency | USD |
| `Asset Breakdown JSON` | Long text | JSON with breakdown |
| `Projection JSON` | Long text | JSON with year-by-year projection |
| `PDF File` | Attachment | Generated PDF |
| `Generated At` | Created time | Auto |

---

## 🔗 Relationship Summary

```
Settings (1 record)

Real Estate (standalone)
    └── Status: Active/Archived

Upload Batches
    ├── → Public Equity Holdings (1:many)
    ├── → Equity Comp Grants (1:many)
    ├── → Family Office Holdings (1:many)
    └── → OCR Tables (1:many, for PDFs)

Equity Comp Grants
    └── → Equity Comp Vest Events (1:many)

Scenarios
    └── → Scenario Assumptions (1:many, 7 per scenario)

Reports
    └── → Scenarios (many:1)

Price History (standalone, for TTWO and other tickers)
```

---

## 🎯 Initial Data Setup

### Create Default Scenarios

After creating tables, add these 3 default scenarios:

**Scenario: Low / Conservative**
| Asset Class | Annual Return |
|-------------|---------------|
| Real Estate | 1.5% |
| Public Equities | 4.0% |
| Managed Portfolio | 3.5% |
| Bonds | 2.0% |
| Alternatives | 5.0% |
| Cash | 1.0% |
| TTWO Equity | 3.0% |
| **TTWO Price Adjustment** | **-20%** |

**Scenario: Medium / Base Case**
| Asset Class | Annual Return |
|-------------|---------------|
| Real Estate | 3.0% |
| Public Equities | 7.0% |
| Managed Portfolio | 6.0% |
| Bonds | 3.5% |
| Alternatives | 8.0% |
| Cash | 2.0% |
| TTWO Equity | 7.0% |
| **TTWO Price Adjustment** | **0%** |

**Scenario: High / Optimistic**
| Asset Class | Annual Return |
|-------------|---------------|
| Real Estate | 5.0% |
| Public Equities | 10.0% |
| Managed Portfolio | 9.0% |
| Bonds | 4.5% |
| Alternatives | 12.0% |
| Cash | 3.0% |
| TTWO Equity | 12.0% |
| **TTWO Price Adjustment** | **+30%** |

---

---

### 13. Assets (General Table for Simple Setup)

> This is the simplified table used for the current implementation. It handles all asset types including liabilities in a single table.

| Field Name | Field Type | Options/Notes |
|------------|------------|---------------|
| `name` | Single line text | Primary field, e.g., "Savings Account" or "Home Mortgage" |
| `category` | Single select | `Cash`, `Securities`, `Real Estate`, `Liabilities` |
| `subtype` | Single line text | e.g., "Leumi", "Atai", "Tel Aviv", "Mortgage", "Credit Card" |
| `currency` | Single select | `USD`, `NIS` |
| `originalValue` | Currency | Value in original currency |
| `currentValueUSD` | Currency | Current value in USD (for liabilities, this is the outstanding balance) |
| `updatedAt` | Last modified time | Auto |

**Notes:**
- For **Liabilities** (Mortgages, Loans, Debts): Enter the outstanding balance as a positive number in `currentValueUSD`. The application will automatically subtract this from the total net worth.
- Liabilities include subtypes: `Mortgage`, `Credit Card`, `Personal Loan`, `Business Debt`, `Other`

---

## 🔑 API Access Setup

### Get Your API Credentials

1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Click **"Create new token"**
3. Name: `Net Worth Dashboard`
4. **Scopes:** Select these permissions:
   - `data.records:read`
   - `data.records:write`
   - `schema.bases:read`
5. **Access:** Select your `Net Worth Dashboard` base
6. Click **Create token**
7. **Copy and save** the token (starts with `pat...`)

### Get Your Base ID

1. Open your base in Airtable
2. Look at the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
3. The `appXXXXXXXXXXXXXX` part is your **Base ID**

### Environment Variables

Create a `.env` file in your project:

```env
VITE_AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
VITE_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

---

## 📝 Table Creation Checklist

Use this checklist as you create each table:

- [ ] **Settings** - Add 1 record with your info
- [ ] **Real Estate** - Ready for manual entries
- [ ] **Upload Batches** - Will be populated by uploads
- [ ] **Public Equity Holdings** - Link to Upload Batches
- [ ] **Equity Comp Grants** - Link to Upload Batches
- [ ] **Equity Comp Vest Events** - Link to Equity Comp Grants
- [ ] **Family Office Holdings** - Link to Upload Batches
- [ ] **Price History** - For TTWO price tracking
- [ ] **OCR Tables** - Link to Upload Batches
- [ ] **Scenarios** - Create 3 default scenarios
- [ ] **Scenario Assumptions** - Create 7 records per scenario (21 total)
- [ ] **Reports** - Link to Scenarios

---

## 🧪 Testing Your Setup

After setup, verify by:

1. **Add a test real estate property** - Check formulas work
2. **Create a test upload batch** - Verify links work
3. **Check scenario rollups** - Verify assumptions link correctly

---

## 📊 Recommended Views

Create these views for easier management:

### Real Estate Table
- **Active Properties** - Filter: Status = Active
- **Archived** - Filter: Status = Archived

### Upload Batches Table
- **Recent Uploads** - Sort by Uploaded At (desc)
- **By Source Type** - Group by Source Type

### Equity Comp Vest Events
- **Upcoming Vests** - Filter: Status = Pending, Sort by Vest Date
- **Vested History** - Filter: Status = Vested

### Price History
- **TTWO Prices** - Filter: Ticker = TTWO, Sort by Date (desc)

---

## Next Steps

Once your Airtable base is set up:

1. Share your Base ID with me
2. I'll create the API integration layer
3. We'll connect the React frontend to live Airtable data

Let me know when you've completed the setup!


