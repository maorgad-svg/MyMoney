# MyMoney - Personal Financial Dashboard

A simple, beautiful personal net worth tracker built with React and Airtable.

## Features

- 📊 **Net Worth Summary** - View your total net worth at a glance
- 💰 **Category Breakdown** - Track Cash, Securities, and Real Estate separately
- 📝 **Asset Management** - Add and view all your assets in one place
- 🎨 **Beautiful UI** - Clean, pastel design that's easy on the eyes
- 📱 **Responsive** - Works great on desktop and mobile

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Airtable** - Backend database
- **JavaScript** - Programming language (ES6+)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- An Airtable account with an API key

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Airtable

#### Create Your Airtable Base

1. Go to [Airtable](https://airtable.com) and create a new base
2. Create a table called **"Assets"** with the following fields:

| Field Name       | Field Type      | Options/Notes                                    |
|------------------|-----------------|--------------------------------------------------|
| `name`           | Single line text| Name of the asset                                |
| `category`       | Single select   | Options: Cash, Securities, Real Estate           |
| `subtype`        | Single select   | Options: See below*                              |
| `currentValueUSD`| Number          | Current value in USD                             |
| `updatedAt`      | Date or text    | Auto-filled by the app                           |

**Subtype Options by Category:**
- **Cash:** Leumi, Julius Baer, Excellence
- **Securities:** Atai, Bioharvest, Excellence, Take Two Interactive
- **Real Estate:** Tel Aviv, Dubai

#### Get Your Airtable Credentials

1. **API Key**: Create a personal access token at [https://airtable.com/create/tokens](https://airtable.com/create/tokens)
   - Give it a name like "MyMoney App"
   - Add scopes: `data.records:read` and `data.records:write`
   - Add access to your base

2. **Base ID**: Find it in your base URL
   - When viewing your base, the URL looks like: `https://airtable.com/appXXXXXXXXXXXXXX/...`
   - The part after `airtable.com/` (starting with `app`) is your Base ID

3. **Table Name**: Should be "Assets" (or whatever you named your table)

### 3. Configure Environment Variables

Create a `.env` file in the project root (copy from `env.example.txt`):

```bash
# On Mac/Linux:
cp env.example.txt .env

# On Windows:
copy env.example.txt .env
```

Edit `.env` and add your Airtable credentials:

```bash
VITE_AIRTABLE_API_KEY=patXXXXXXXXXXXXXXXX
VITE_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXXXX
VITE_AIRTABLE_TABLE_NAME=Assets
```

### 4. Run the Development Server

```bash
npm run dev
```

The app will open at [http://localhost:5173](http://localhost:5173)

### 5. Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

## Project Structure

```
net-worth-dashboard/
├── src/
│   ├── api/
│   │   └── airtableClient.js    # Airtable API integration
│   ├── components/
│   │   ├── Header.jsx            # App header
│   │   ├── NetWorthSummary.jsx   # Total net worth display
│   │   ├── AssetCategoryCards.jsx # Category breakdown cards
│   │   ├── AssetTable.jsx        # Asset list/table
│   │   └── AddAssetForm.jsx      # Form to add new assets
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # App entry point
│   └── styles.css                # Global styles
├── .env.example                  # Environment variables template
├── .env                          # Your actual env vars (not in git)
├── package.json                  # Dependencies
├── vite.config.js                # Vite configuration
└── README.md                     # This file
```

## Usage

### Adding Assets

1. Scroll to the "Add New Asset" form at the bottom
2. Select a category (Cash, Securities, or Real Estate)
3. Choose a subtype (options change based on category)
4. Enter the asset name and current value in USD
5. Click "Add Asset"

The asset will be saved to Airtable and immediately appear in your dashboard.

### Viewing Your Net Worth

- The **Total Net Worth** card at the top shows your complete financial picture
- **Category totals** show how your wealth is distributed
- **Category cards** provide detailed breakdowns with asset counts
- The **asset table** lists all your individual holdings

## Extending the App

This is a minimal v1 designed to be easily extended. Some ideas:

- Add asset editing and deletion
- Track historical values and show trends
- Add more categories and subtypes
- Import data from CSV files
- Add charts and visualizations
- Set up automated data fetching from financial APIs

## Deployment

The app can be deployed to any static hosting service:

- **Google Cloud Storage** (planned)
- Vercel
- Netlify
- GitHub Pages

Build the app with `npm run build` and upload the `dist/` folder.

## Troubleshooting

### "Error Loading Assets"

- Check that your `.env` file exists and has all three variables
- Verify your Airtable API key has the correct permissions
- Make sure your Base ID is correct
- Confirm the table name matches exactly (case-sensitive)

### Assets Not Appearing

- Check the browser console for errors
- Verify your Airtable table has the correct field names (case-sensitive)
- Make sure the field types match the expected types

### Form Not Submitting

- Check that all fields are filled in
- Verify the current value is a valid positive number
- Check the browser console for API errors

## License

Personal use only.

## Author

Built with ❤️ for personal financial tracking.
# MyMoney
