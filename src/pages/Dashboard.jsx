import { useState, useEffect } from 'react';
import Header from '../components/Header';
import NetWorthSummary from '../components/NetWorthSummary';
import AssetCategoryCards from '../components/AssetCategoryCards';
import AssetTable from '../components/AssetTable';
import AddAssetForm from '../components/AddAssetForm';
import MarketTicker from '../components/MarketTicker';
import { fetchAssets, createAsset, updateAsset, deleteAsset } from '../api/airtableClient';
import { toggleDemoMode, isDemoMode, scaleAssets, enableDemoMode } from '../utils/demoMode';

/**
 * Dashboard Component
 * 
 * Manages the global state for assets and coordinates data flow between components.
 * Fetches assets from Airtable on mount and handles asset creation.
 */
function Dashboard() {
  // State management
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [demoMode, setDemoMode] = useState(isDemoMode());

  // Enable demo mode by default on first load
  useEffect(() => {
    enableDemoMode();
    setDemoMode(true);
  }, []);

  // Fetch assets on mount
  useEffect(() => {
    loadAssets();
  }, []);

  // Keyboard shortcut listener for demo mode (Cmd/Ctrl + D)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Cmd+D (Mac) or Ctrl+D (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        const isActive = toggleDemoMode();
        setDemoMode(isActive);
        // Force re-render by reloading assets
        loadAssets();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * Loads all assets from Airtable
   */
  const loadAssets = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedAssets = await fetchAssets();
      setAssets(fetchedAssets);
    } catch (err) {
      console.error('Failed to load assets:', err);
      setError(err.message || 'Failed to load assets. Please check your Airtable configuration.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles creating a new asset
   * Called by AddAssetForm component
   */
  const handleAssetCreated = async (assetData) => {
    try {
      // Create asset in Airtable
      const newAsset = await createAsset(assetData);
      
      // Update local state by adding the new asset
      setAssets(prevAssets => [...prevAssets, newAsset]);
      
      return newAsset;
    } catch (err) {
      console.error('Failed to create asset:', err);
      throw err;
    }
  };

  /**
   * Handles updating an existing asset
   * Called by EditAssetModal via AssetTable
   */
  const handleAssetUpdated = async (id, assetData) => {
    try {
      // Update asset in Airtable
      const updatedAsset = await updateAsset(id, assetData);
      
      // Update local state by replacing the asset
      setAssets(prevAssets =>
        prevAssets.map(asset => asset.id === id ? updatedAsset : asset)
      );
      
      return updatedAsset;
    } catch (err) {
      console.error('Failed to update asset:', err);
      throw err;
    }
  };

  /**
   * Handles deleting an asset
   * Called by AssetTable
   */
  const handleAssetDeleted = async (id) => {
    try {
      // Delete asset from Airtable
      await deleteAsset(id);
      
      // Update local state by removing the asset
      setAssets(prevAssets => prevAssets.filter(asset => asset.id !== id));
    } catch (err) {
      console.error('Failed to delete asset:', err);
      throw err;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="app-container">
        <Header />
        <div className="loading-spinner">
          Loading your assets...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="app-container">
        <Header />
        <div className="error-container">
          <h2>Error Loading Assets</h2>
          <p>{error}</p>
          <p style={{ marginTop: '16px' }}>
            Please check that your <code>.env</code> file is configured correctly with:
          </p>
          <ul style={{ textAlign: 'left', display: 'inline-block', marginTop: '8px' }}>
            <li><code>VITE_AIRTABLE_API_KEY</code></li>
            <li><code>VITE_AIRTABLE_BASE_ID</code></li>
            <li><code>VITE_AIRTABLE_TABLE_NAME</code></li>
          </ul>
        </div>
      </div>
    );
  }

  // Get scaled assets for display (if demo mode is active)
  const displayAssets = scaleAssets(assets);

  // Main dashboard render
  return (
    <div className="app-container">
      <Header />
      
      {/* Subtle demo mode indicator */}
      {demoMode && (
        <div className="demo-mode-indicator" title="Demo Mode Active (Cmd/Ctrl+D to toggle)">
          🎭
        </div>
      )}
      
      {/* Market Ticker */}
      <MarketTicker />
      
      {/* Net Worth Summary - shows total and category breakdown */}
      <NetWorthSummary assets={displayAssets} />
      
      {/* Asset Category Cards - detailed view per category */}
      <AssetCategoryCards assets={displayAssets} />
      
      {/* Asset Table - list of all assets */}
      <AssetTable 
        assets={displayAssets} 
        onAssetUpdated={handleAssetUpdated}
        onAssetDeleted={handleAssetDeleted}
      />
      
      {/* Add Asset Form - create new assets */}
      <AddAssetForm onAssetCreated={handleAssetCreated} />
    </div>
  );
}

export default Dashboard;
