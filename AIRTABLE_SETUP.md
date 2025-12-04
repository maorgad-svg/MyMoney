# Airtable Setup Guide for MyMoney

This guide will walk you through setting up your Airtable base for the MyMoney app.

## Step 1: Create a New Base

1. Go to [Airtable](https://airtable.com)
2. Click **"Add a base"** or **"Create a base"**
3. Choose **"Start from scratch"**
4. Name your base something like **"MyMoney"** or **"Personal Net Worth"**

## Step 2: Create the Assets Table

Your base should have a table called **"Assets"**. If it's not already named that, rename the default table.

### Required Fields

Create the following fields in your Assets table:

| Field Name       | Field Type       | Configuration                                    |
|------------------|------------------|--------------------------------------------------|
| `name`           | Single line text | No special configuration needed                  |
| `category`       | Single select    | Add options: Cash, Securities, Real Estate       |
| `subtype`        | Single select    | Add options: See detailed list below             |
| `currentValueUSD`| Number           | Format: Decimal (0.00), Allow negative: No       |
| `updatedAt`      | Single line text | No special configuration needed                  |

### Detailed Field Setup

#### 1. **name** (Single line text)
- Click **"+"** to add a field
- Choose **"Single line text"**
- Name it: `name`
- Description: "Name or label of the asset"

#### 2. **category** (Single select)
- Click **"+"** to add a field
- Choose **"Single select"**
- Name it: `category`
- Add these options:
  - Cash
  - Securities
  - Real Estate
- You can assign colors to each option for visual distinction

#### 3. **subtype** (Single select)
- Click **"+"** to add a field
- Choose **"Single select"**
- Name it: `subtype`
- Add ALL these options (they'll be filtered by category in the app):
  - **For Cash:**
    - Leumi
    - Julius Baer
    - Excellence
  - **For Securities:**
    - Atai
    - Bioharvest
    - Excellence
    - Take Two Interactive
  - **For Real Estate:**
    - Tel Aviv
    - Dubai

**Note:** Add all 9 options to the single select field. The app will show only the relevant options based on the selected category.

#### 4. **currentValueUSD** (Number)
- Click **"+"** to add a field
- Choose **"Number"**
- Name it: `currentValueUSD`
- Format: **Decimal (0.00)**
- Precision: 2 decimal places
- Allow negative numbers: **No**
- Description: "Current value of the asset in USD"

#### 5. **updatedAt** (Single line text)
- Click **"+"** to add a field
- Choose **"Single line text"**
- Name it: `updatedAt`
- Description: "Timestamp of last update (auto-filled by app)"

**Alternative:** You can use a **Date** field type instead of text if you prefer. The app will work with either.

## Step 3: Add Sample Data (Optional)

To test the app, add a few sample records:

| name                      | category    | subtype              | currentValueUSD | updatedAt            |
|---------------------------|-------------|----------------------|-----------------|----------------------|
| Savings Account - Leumi   | Cash        | Leumi                | 50000           | 2024-12-04T10:00:00Z |
| Checking - Julius Baer    | Cash        | Julius Baer          | 25000           | 2024-12-04T10:00:00Z |
| TTWO Stock Holdings       | Securities  | Take Two Interactive | 150000          | 2024-12-04T10:00:00Z |
| Bioharvest Shares         | Securities  | Bioharvest           | 75000           | 2024-12-04T10:00:00Z |
| Tel Aviv Apartment        | Real Estate | Tel Aviv             | 500000          | 2024-12-04T10:00:00Z |
| Dubai Investment Property | Real Estate | Dubai                | 350000          | 2024-12-04T10:00:00Z |

## Step 4: Get Your API Credentials

### Get Your Base ID

1. Open your base in Airtable
2. Look at the URL in your browser
3. The URL will look like: `https://airtable.com/appXXXXXXXXXXXXXX/...`
4. Copy the part that starts with `app` (e.g., `appXXXXXXXXXXXXXX`)
5. This is your **Base ID**

### Create a Personal Access Token

1. Go to [https://airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Click **"Create new token"**
3. Give it a name: **"MyMoney App"**
4. Add scopes:
   - `data.records:read` - to read your assets
   - `data.records:write` - to create new assets
5. Add access to your base:
   - Click **"Add a base"**
   - Select your MyMoney base
6. Click **"Create token"**
7. **IMPORTANT:** Copy the token immediately - you won't be able to see it again!
8. The token will look like: `patXXXXXXXXXXXXXXXX`

## Step 5: Configure the App

1. In your MyMoney project folder, create a file called `.env`
2. Copy the contents from `env.example.txt`
3. Fill in your credentials:

```bash
VITE_AIRTABLE_API_KEY=patXXXXXXXXXXXXXXXX
VITE_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
VITE_AIRTABLE_TABLE_NAME=Assets
```

4. Save the file
5. Restart your dev server if it's running

## Troubleshooting

### "Error Loading Assets"

**Check your API key:**
- Make sure it starts with `pat`
- Verify it has both read and write permissions
- Confirm it has access to your specific base

**Check your Base ID:**
- Should start with `app`
- Copy it exactly from the URL
- No extra spaces or characters

**Check your table name:**
- Default is "Assets"
- Must match exactly (case-sensitive)
- No extra spaces

### "Failed to create asset"

**Check field names:**
- All field names must match exactly (case-sensitive):
  - `name`
  - `category`
  - `subtype`
  - `currentValueUSD`
  - `updatedAt`

**Check field types:**
- Make sure each field has the correct type as specified above
- Number fields must be set to allow decimals

### Assets appear but values are wrong

- Check that `currentValueUSD` is a Number field, not Text
- Verify the field is named exactly `currentValueUSD`

## Security Notes

- **Never commit your `.env` file to git** - it contains your API key
- The `.env` file is already in `.gitignore`
- If you accidentally expose your API key, delete it immediately from Airtable and create a new one
- Keep your API key secure - it has full access to your financial data

## Next Steps

Once your Airtable base is set up and configured:

1. Run `npm install` (if you haven't already)
2. Run `npm run dev`
3. Open [http://localhost:5173](http://localhost:5173)
4. You should see your assets loaded from Airtable!

## Extending Your Schema

As your needs grow, you can add more fields to track additional information:

- **purchaseDate** (Date) - When you acquired the asset
- **purchasePrice** (Number) - Original purchase price
- **notes** (Long text) - Additional notes about the asset
- **tags** (Multiple select) - Categories or tags for filtering
- **currency** (Single select) - If you want to track assets in different currencies
- **location** (Single line text) - Physical or account location

The app will continue to work with additional fields - it only reads the required fields.

