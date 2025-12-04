# Quick Start Guide - MyMoney

Get up and running in 5 minutes!

## Prerequisites

- Node.js installed
- An Airtable account

## 1. Install Dependencies (1 minute)

```bash
cd net-worth-dashboard
npm install
```

## 2. Set Up Airtable (2 minutes)

### Create Your Base
1. Go to [airtable.com](https://airtable.com)
2. Create a new base called "MyMoney"
3. Create a table called "Assets" with these fields:
   - `name` - Single line text
   - `category` - Single select (Cash, Securities, Real Estate)
   - `subtype` - Single select (Leumi, Julius Baer, Excellence, Atai, Bioharvest, Take Two Interactive, Tel Aviv, Dubai)
   - `currentValueUSD` - Number
   - `updatedAt` - Single line text

### Get Your Credentials
1. **API Key**: [Create token](https://airtable.com/create/tokens) with `data.records:read` and `data.records:write` scopes
2. **Base ID**: From your URL `https://airtable.com/appXXXXXX/...` (the `appXXXXXX` part) 

## 3. Configure Environment (1 minute)

Create `.env` file:

```bash
cp env.example.txt .env
```

Edit `.env`:

```bash
VITE_AIRTABLE_API_KEY=patXXXXXXXXXXXXXXXX
VITE_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
VITE_AIRTABLE_TABLE_NAME=Assets
```

## 4. Run the App (1 minute)

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 5. Add Your First Asset

1. Scroll to "Add New Asset" form
2. Select category: Cash
3. Select subtype: Leumi
4. Enter name: "Savings Account"
5. Enter value: 50000
6. Click "Add Asset"

Done! 🎉

## Need More Help?

- **Detailed Airtable setup**: See [AIRTABLE_SETUP.md](./AIRTABLE_SETUP.md)
- **Full documentation**: See [README.md](./README.md)
- **Troubleshooting**: Check the README troubleshooting section

