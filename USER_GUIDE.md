# MyMoney - User Guide

## What is MyMoney?

MyMoney is a personal financial dashboard that gives you a clear, beautiful view of your net worth across all your assets. It's designed for single-user personal use with a focus on simplicity and ease of use.

## Key Features

### 📊 At-a-Glance Net Worth
See your total net worth in one big number at the top of the page, updated in real-time as you add or modify assets.

### 💰 Three Asset Categories
Track your wealth across three main categories:
- **Cash** - Bank accounts and liquid assets
- **Securities** - Stocks, bonds, and other investments
- **Real Estate** - Properties and real estate holdings

### 🏦 Predefined Subtypes
Each category has specific subtypes to organize your assets:

**Cash:**
- Leumi
- Julius Baer
- Excellence

**Securities:**
- Atai
- Bioharvest
- Excellence
- Take Two Interactive

**Real Estate:**
- Tel Aviv
- Dubai

### ➕ Easy Asset Management
Add new assets with a simple form that guides you through the process with smart dropdowns that change based on your selections.

## How to Use MyMoney

### First Time Setup

1. **Install and Configure**
   - Follow the QUICKSTART.md guide to install dependencies
   - Set up your Airtable base (see AIRTABLE_SETUP.md)
   - Create your .env file with Airtable credentials

2. **Start the App**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 in your browser

### Understanding the Dashboard

When you open MyMoney, you'll see four main sections:

#### 1. Header
- App name "MyMoney"
- Subtitle: "Simple snapshot of my net worth"

#### 2. Net Worth Summary (Top Section)
- **Large Card**: Your total net worth across all assets
- **Three Small Cards**: Breakdown by category (Cash, Securities, Real Estate)

This gives you an instant overview of your financial position.

#### 3. Asset Category Cards (Middle Section)
Three detailed cards showing:
- Category name
- Total value in that category
- Brief description
- Number of assets in that category

This helps you understand how your wealth is distributed.

#### 4. All Assets Table (Lower Section)
A complete list of all your assets showing:
- Asset name
- Category
- Subtype
- Current value (USD)
- Last updated date

This is your detailed inventory.

#### 5. Add New Asset Form (Bottom)
A form to add new assets with:
- Category dropdown
- Subtype dropdown (changes based on category)
- Asset name field
- Current value field

### Adding Your First Asset

1. **Scroll to the "Add New Asset" form** at the bottom of the page

2. **Select a Category**
   - Click the "Category" dropdown
   - Choose: Cash, Securities, or Real Estate

3. **Select a Subtype**
   - The subtype dropdown will now show options relevant to your category
   - For example, if you chose "Cash", you'll see: Leumi, Julius Baer, Excellence

4. **Enter Asset Name**
   - Give your asset a descriptive name
   - Example: "Savings Account - Leumi" or "TTWO Stock Holdings"

5. **Enter Current Value**
   - Enter the current value in USD
   - Use numbers only (no currency symbols)
   - Example: 50000

6. **Click "Add Asset"**
   - The form will submit
   - You'll see a success message
   - The asset will immediately appear in all sections above
   - The form will clear, ready for the next asset

### Example: Adding a Bank Account

```
Category: Cash
Subtype: Leumi
Asset Name: Checking Account - Leumi
Current Value (USD): 25000
```

Click "Add Asset" → Done! ✅

### Example: Adding Stock Holdings

```
Category: Securities
Subtype: Take Two Interactive
Asset Name: TTWO Stock Portfolio
Current Value (USD): 150000
```

Click "Add Asset" → Done! ✅

### Example: Adding Property

```
Category: Real Estate
Subtype: Tel Aviv
Asset Name: Tel Aviv Apartment - Dizengoff
Current Value (USD): 500000
```

Click "Add Asset" → Done! ✅

## Understanding the Numbers

### Currency
All values are displayed in **USD (US Dollars)** with proper formatting:
- $50,000 (not 50000)
- $1,250,000 (not 1250000)

### Calculations
- **Total Net Worth** = Sum of all assets across all categories
- **Category Totals** = Sum of all assets in that specific category
- All calculations update instantly when you add new assets

### Dates
The "Updated At" field shows when you last added or modified the asset:
- Format: Dec 4, 2024
- Automatically set when you add an asset

## Tips for Best Results

### Naming Your Assets
Use clear, descriptive names:
- ✅ Good: "Savings Account - Leumi Main"
- ✅ Good: "TTWO Stock - Fidelity Account"
- ✅ Good: "Dubai Marina Apartment"
- ❌ Avoid: "Account 1", "Stocks", "Property"

### Keeping Values Current
- Update asset values regularly for accurate net worth
- In v1, you'll need to update values in Airtable directly
- Future versions will support editing in the app

### Organizing by Subtype
The subtypes help you organize multiple assets:
- Multiple bank accounts at Leumi? Add them as separate assets
- Holdings at different brokers? Use different subtypes
- Multiple properties? Add each separately

## Common Questions

### Can I edit or delete assets?
Not in v1. You can edit or delete records directly in Airtable, then refresh the app to see changes.

### Can I add custom categories or subtypes?
Not in the UI, but you can add them in Airtable. The app will display any categories/subtypes you add to the Airtable table.

### How often does data sync?
The app fetches data when you first load the page. After adding an asset, it updates immediately without reloading.

### Can I export my data?
Not in v1, but you can export from Airtable as CSV or Excel.

### Is my data secure?
Your data is stored in your personal Airtable base. Keep your API key secure and never share it.

### Can multiple people use this?
v1 is designed for single-user personal use. Everyone with the API key can access and modify the data.

## Troubleshooting

### "Error Loading Assets"
- Check your .env file has correct credentials
- Verify your Airtable API key is valid
- Confirm your Base ID is correct
- See AIRTABLE_SETUP.md for detailed help

### Assets not appearing
- Check your Airtable table has the correct field names
- Verify field types match the requirements
- Look for errors in the browser console (F12)

### Form won't submit
- Make sure all fields are filled in
- Check that the value is a positive number
- Look for error messages below the form

### Values showing as $0
- Check that currentValueUSD field in Airtable is a Number type, not Text
- Verify you entered numeric values without currency symbols

## Mobile Use

MyMoney works great on mobile devices:
- All sections stack vertically
- Forms are easy to fill on touch screens
- Tables scroll horizontally if needed
- Large touch targets for buttons

## What's Next?

v1 is intentionally simple. Future versions may include:
- Edit and delete assets in the app
- Historical tracking and charts
- More categories and custom subtypes
- CSV import/export
- Asset search and filtering
- Budget tracking
- Goal setting

## Getting Help

- **Setup Issues**: See AIRTABLE_SETUP.md
- **Quick Start**: See QUICKSTART.md
- **Technical Details**: See README.md
- **What's Included**: See PROJECT_SUMMARY.md

## Enjoy!

MyMoney is designed to give you peace of mind about your financial position. Add your assets once, then check in anytime to see your net worth at a glance.

Happy tracking! 💰


