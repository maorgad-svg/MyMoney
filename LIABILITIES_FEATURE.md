# Liabilities Feature - Mortgages and Debt Tracking

## Overview

The Net Worth Dashboard now supports tracking **Liabilities** (Mortgages, Loans, Credit Cards, and other debts) which are automatically subtracted from your total net worth calculation.

## What's New

### 1. New Liabilities Category

Assets are now organized into 4 categories:
- **Cash** - Bank accounts, savings, money market funds
- **Securities** - Stocks, bonds, ETFs, mutual funds
- **Real Estate** - Properties and real estate investments
- **Liabilities** - Mortgages, loans, credit cards, and debts ⚠️

### 2. Liability Subtypes

When adding a liability, you can categorize it by subtype:
- **Mortgage** - Home loans, property mortgages
- **Credit Card** - Credit card balances
- **Personal Loan** - Personal loans, car loans
- **Business Debt** - Business loans and credit lines
- **Other** - Any other type of debt

### 3. Visual Indicators

Liabilities are displayed with clear visual distinction:
- **Red negative values** (-$XX,XXX) throughout the interface
- **Separate "Liabilities" card** in the category breakdown
- **Pink/red highlighting** in the asset table
- **Warning message** when adding a new liability

## How to Use

### Adding a Liability

1. Scroll to the "Add New Asset" form
2. Select **"Liabilities (Debt/Mortgage)"** from the Category dropdown
3. Choose a **subtype** (Mortgage, Credit Card, etc.)
4. Enter a **descriptive name** (e.g., "Home Mortgage - Chase Bank")
5. Select the **currency** (USD or NIS)
6. Enter the **outstanding balance** as a positive number
7. Click **"Add Liability"**

**Important:** Enter liabilities as positive numbers. The app will automatically subtract them from your net worth.

### Example

If you have a mortgage with an outstanding balance of $320,000:
- Category: `Liabilities`
- Subtype: `Mortgage`
- Name: `Home Mortgage - Wells Fargo`
- Currency: `USD`
- Outstanding Balance: `320000`

This will appear as `-$320,000` in your net worth calculation.

## Net Worth Calculation

Your net worth is now calculated as:

```
Total Assets (Cash + Securities + Real Estate)
  - Total Liabilities (Mortgages + Loans + Debts)
  = Net Worth
```

### Example Calculation

```
Assets:
  Cash:           $50,000
  Securities:     $200,000
  Real Estate:    $500,000
  ─────────────────────────
  Total Assets:   $750,000

Liabilities:
  Mortgage:       $320,000
  Car Loan:       $25,000
  ─────────────────────────
  Total Liabilities: $345,000

Net Worth:        $405,000
```

## Where Liabilities Appear

### 1. Net Worth Summary (Top Circle)
The circular widget shows your **net worth** (assets minus liabilities)

### 2. Category Breakdown Cards
A separate **Liabilities card** appears showing:
- Total liabilities in red (-$XXX,XXX)
- Number of liabilities
- Description

### 3. Asset Table
Liabilities appear in a **separate section** at the bottom:
- Pink/red row highlighting
- "Liability" badge instead of category
- Negative values in red

## Airtable Setup

### Table Structure

Your Airtable "Assets" table should include these fields:

| Field Name | Type | Options |
|------------|------|---------|
| name | Single line text | Asset or liability name |
| category | Single select | Cash, Securities, Real Estate, **Liabilities** |
| subtype | Single line text | Bank name, loan type, etc. |
| currency | Single select | USD, NIS |
| originalValue | Currency | Value in original currency |
| currentValueUSD | Currency | Current value/balance in USD |
| updatedAt | Last modified time | Auto-populated |

### Adding "Liabilities" to Category Field

1. Open your Airtable base
2. Go to the "Assets" table
3. Click on the **category** field header
4. Click **"Customize field type"**
5. Add `Liabilities` as a new option
6. Choose a red color for visual distinction

## Best Practices

### 1. Regular Updates
Update your liability balances regularly to maintain accurate net worth:
- Monthly for mortgages and loans
- Weekly or bi-weekly for credit cards
- After any large payments

### 2. Include All Debts
Track all significant liabilities:
- ✅ Primary residence mortgage
- ✅ Investment property mortgages
- ✅ Car loans
- ✅ Student loans
- ✅ Credit card balances
- ✅ Business loans
- ✅ Personal loans
- ❌ Small balances under $500 (optional)

### 3. Naming Convention
Use clear, descriptive names:
- ✅ "Primary Home Mortgage - Chase Bank"
- ✅ "Tesla Model 3 Loan - Tesla Finance"
- ✅ "Visa Credit Card - Chase Sapphire"
- ❌ "Mortgage 1"
- ❌ "Loan"

### 4. Currency Consistency
- Enter mortgages in their native currency (USD or NIS)
- The app will automatically convert to USD using the current exchange rate
- Update exchange rates regularly via the Settings

## Real Estate & Mortgages

### Important Note

If you're using the **Real Estate** category for properties:
- Enter the **property value** in the Real Estate asset
- Enter the **mortgage balance** as a separate Liability
- Your net worth will show: Property Value - Mortgage Balance

### Example

**Property:**
- Category: Real Estate
- Name: "Tel Aviv Apartment"
- Value: $1,200,000

**Associated Mortgage:**
- Category: Liabilities
- Subtype: Mortgage
- Name: "Tel Aviv Apartment Mortgage - Leumi"
- Balance: $320,000

**Net Real Estate Value:** $1,200,000 - $320,000 = $880,000

## Technical Details

### Data Storage
- Liabilities are stored in the same Airtable table as assets
- Distinguished by the `category` field set to "Liabilities"
- Values are stored as positive numbers in the database
- Application logic handles the subtraction

### Calculations
- Assets: SUM of all non-liability items
- Liabilities: SUM of all items with category = "Liabilities"
- Net Worth: Total Assets - Total Liabilities

## Troubleshooting

### Liability not appearing?
1. Check that the category is set to exactly "Liabilities" in Airtable
2. Verify the `currentValueUSD` field has a value
3. Refresh the browser page

### Value not subtracting?
1. Ensure you added the "Liabilities" option to the category field in Airtable
2. Check that the spelling is exact: "Liabilities" (capital L, plural)
3. Clear browser cache and reload

### Negative showing as positive?
1. Check that the category is "Liabilities" not "Real Estate" or another category
2. Verify the row styling - liabilities should have a pink background

## Future Enhancements

Potential future features:
- Payment schedules and tracking
- Interest rate tracking
- Amortization calculators
- Historical liability trends
- Liability-to-asset ratio charts
- Debt payoff projections

---

**Need Help?** Check the main README.md or QUICKSTART.md for general setup instructions.

