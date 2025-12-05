# Currency Support Update Guide

## Overview

MyMoney now supports multi-currency! You can add assets in either USD or NIS (Israeli Shekel), and the app will automatically convert to USD for net worth calculations.

## New Features

✅ **Currency Selection** - Choose USD or NIS when adding assets  
✅ **Exchange Rate Settings** - Set your own USD/NIS exchange rate  
✅ **Automatic Conversion** - NIS values automatically converted to USD  
✅ **Display Original Values** - See both original and USD values in the table  

---

## Required Airtable Schema Updates

You need to add **two new fields** to your Assets table in Airtable:

### 1. Add "currency" Field

- **Field Name:** `currency`
- **Field Type:** Single select
- **Options:**
  - USD
  - NIS
- **Default:** USD (optional)

**Steps:**
1. Open your Airtable base
2. Click the **"+"** button to add a new field
3. Choose **"Single select"**
4. Name it: `currency`
5. Add options: `USD` and `NIS`
6. Click **"Create field"**

### 2. Add "originalValue" Field

- **Field Name:** `originalValue`
- **Field Type:** Number
- **Format:** Decimal (0.00)
- **Precision:** 2 decimal places
- **Allow negative:** No

**Steps:**
1. Click the **"+"** button to add another field
2. Choose **"Number"**
3. Name it: `originalValue`
4. Set format to **Decimal (0.00)**
5. Set precision to 2 decimal places
6. Uncheck "Allow negative numbers"
7. Click **"Create field"**

---

## Updated Table Schema

Your Assets table should now have these fields:

| Field Name       | Field Type       | Notes                                    |
|------------------|------------------|------------------------------------------|
| `name`           | Single line text | Asset name                               |
| `category`       | Single select    | Cash, Securities, Real Estate            |
| `subtype`        | Single select    | 9 options based on category              |
| `currency`       | Single select    | ✨ NEW: USD or NIS                       |
| `originalValue`  | Number           | ✨ NEW: Value in original currency       |
| `currentValueUSD`| Number           | Converted value in USD                   |
| `updatedAt`      | Single line text | Last update timestamp                    |

---

## How It Works

### Adding Assets in USD
1. Select currency: **USD**
2. Enter value: e.g., `50000`
3. App stores:
   - `currency`: USD
   - `originalValue`: 50000
   - `currentValueUSD`: 50000

### Adding Assets in NIS
1. Select currency: **NIS**
2. Enter value: e.g., `180000`
3. App automatically converts (if rate is 3.60):
   - `currency`: NIS
   - `originalValue`: 180000
   - `currentValueUSD`: 50000 (180000 ÷ 3.60)

---

## Setting the Exchange Rate

### Default Rate
The app starts with a default rate of **1 USD = 3.60 NIS**.

### Updating the Rate
1. Look for the **"Exchange Rate Settings"** card at the top of the page
2. Click **"Edit Rate"**
3. Enter the current exchange rate (e.g., `3.65`)
4. Click **"Save"**

The rate is saved in your browser's localStorage and persists between sessions.

### When to Update
- Update the rate whenever you want to reflect current market rates
- The rate is only used for **new assets** - existing assets won't be recalculated
- Consider updating weekly or monthly for accuracy

---

## Existing Assets

### What Happens to Old Assets?

**Existing assets without currency fields will:**
- Display as USD (default)
- Show originalValue = currentValueUSD
- Continue working normally

**No data loss** - all existing assets remain intact!

### Should I Update Old Assets?

**Optional:** You can manually update old assets in Airtable:
1. Open your Airtable base
2. For each asset, set:
   - `currency` = USD (or NIS if it was in NIS)
   - `originalValue` = the original value

This is optional - the app handles missing values gracefully.

---

## Display Changes

### Asset Table Now Shows:
- **Original Value** - The value in the original currency (₪ or $)
- **Value (USD)** - The converted USD value
- Currency tag for NIS assets

### Example Display:

| Name | Original Value | Value (USD) |
|------|----------------|-------------|
| Leumi Account | ₪180,000 NIS | $50,000 |
| TTWO Stock | $150,000 | $150,000 |
| Tel Aviv Apt | ₪1,800,000 NIS | $500,000 |

---

## Testing the New Features

### Quick Test:

1. **Set the exchange rate:**
   - Click "Edit Rate"
   - Enter `3.60`
   - Click "Save"

2. **Add a USD asset:**
   - Currency: USD
   - Value: 10000
   - Should show as $10,000 USD

3. **Add a NIS asset:**
   - Currency: NIS
   - Value: 36000
   - Should show:
     - Original: ₪36,000 NIS
     - USD: $10,000
     - Conversion info appears below the form

4. **Verify calculations:**
   - Net worth should include both assets
   - Total should be $20,000

---

## Troubleshooting

### "Missing currency or originalValue"

**Problem:** You added the asset but it's not showing correctly.

**Solution:**
1. Make sure you added both fields to Airtable (`currency` and `originalValue`)
2. Field names must be **exact** (case-sensitive)
3. Refresh the page after adding fields

### "Conversion not working"

**Problem:** NIS assets showing wrong USD values.

**Solution:**
1. Check the exchange rate in settings
2. The conversion happens when you **add** the asset
3. Changing the rate doesn't update existing assets

### "Can't see exchange rate settings"

**Problem:** Settings card not visible.

**Solution:**
1. Restart the dev server: `Ctrl+C` then `npm run dev`
2. Clear browser cache and reload
3. Check browser console for errors

---

## Benefits of Multi-Currency Support

✅ **More Accurate** - Track assets in their native currency  
✅ **Flexible** - Set your own exchange rates  
✅ **Transparent** - See both original and converted values  
✅ **Easy to Use** - Automatic conversion, no manual math  

---

## Future Enhancements

Potential v2 features:
- Support for more currencies (EUR, GBP, etc.)
- Automatic exchange rate fetching from APIs
- Historical rate tracking
- Recalculate existing assets with new rates

---

## Need Help?

If you run into issues:
1. Check that both new fields exist in Airtable
2. Verify field names are exactly: `currency` and `originalValue`
3. Make sure field types match the specifications above
4. Restart the dev server after making Airtable changes

---

**Ready to add the new fields?** Open your Airtable base and follow the steps above! 🚀


