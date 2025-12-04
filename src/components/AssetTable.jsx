import { useState } from 'react';
import EditAssetModal from './EditAssetModal';

/**
 * AssetTable Component
 * 
 * Displays a table/list of all assets with columns for name, category, subtype,
 * current value, and last updated date. Includes edit and delete functionality.
 */
function AssetTable({ assets, onAssetUpdated, onAssetDeleted }) {
  const [editingAsset, setEditingAsset] = useState(null);
  const [deletingAsset, setDeletingAsset] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'N/A';
    }
  };

  if (assets.length === 0) {
    return (
      <div className="assets-section">
        <h2 className="section-title">All Assets</h2>
        <div className="asset-table">
          <div className="empty-state">
            No assets yet. Add your first asset below!
          </div>
        </div>
      </div>
    );
  }

  // Handle edit button click
  const handleEdit = (asset) => {
    setEditingAsset(asset);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setEditingAsset(null);
  };

  // Handle asset save
  const handleSaveAsset = async (id, updatedAsset) => {
    await onAssetUpdated(id, updatedAsset);
  };

  // Handle delete button click
  const handleDelete = (asset) => {
    setDeletingAsset(asset);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingAsset) return;
    
    setIsDeleting(true);
    try {
      await onAssetDeleted(deletingAsset.id);
      setDeletingAsset(null);
    } catch (err) {
      alert('Failed to delete asset: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setDeletingAsset(null);
  };

  // Separate assets from liabilities for display
  const assetsOnly = assets.filter(asset => asset.category !== 'Liabilities');
  const liabilities = assets.filter(asset => asset.category === 'Liabilities');

  return (
    <div className="assets-section">
      <h2 className="section-title">All Assets & Liabilities</h2>
      <div className="asset-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Subtype</th>
              <th>Original Value</th>
              <th>Value (USD)</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assetsOnly.map(asset => (
              <tr key={asset.id}>
                <td>{asset.name}</td>
                <td>{asset.category}</td>
                <td>{asset.subtype}</td>
                <td>
                  {asset.currency === 'NIS' ? '₪' : '$'}
                  {asset.originalValue.toLocaleString('en-US', { 
                    minimumFractionDigits: 0, 
                    maximumFractionDigits: 0 
                  })}
                  {asset.currency === 'NIS' && <span className="currency-tag">NIS</span>}
                </td>
                <td>{formatCurrency(asset.currentValueUSD)}</td>
                <td>{formatDate(asset.updatedAt)}</td>
                <td>
                  <div className="asset-actions">
                    <button
                      className="edit-asset-button"
                      onClick={() => handleEdit(asset)}
                      title="Edit asset"
                    >
                      Edit
                    </button>
                    <button
                      className="delete-asset-button"
                      onClick={() => handleDelete(asset)}
                      title="Delete asset"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {liabilities.length > 0 && (
              <>
                <tr className="liabilities-divider">
                  <td colSpan="7">
                    <strong>Liabilities (Debts)</strong>
                  </td>
                </tr>
                {liabilities.map(liability => (
                  <tr key={liability.id} className="liability-row">
                    <td>{liability.name}</td>
                    <td><span className="liability-badge">Liability</span></td>
                    <td>{liability.subtype}</td>
                    <td>
                      {liability.currency === 'NIS' ? '₪' : '$'}
                      {liability.originalValue.toLocaleString('en-US', { 
                        minimumFractionDigits: 0, 
                        maximumFractionDigits: 0 
                      })}
                      {liability.currency === 'NIS' && <span className="currency-tag">NIS</span>}
                    </td>
                    <td className="negative-value">-{formatCurrency(liability.currentValueUSD)}</td>
                    <td>{formatDate(liability.updatedAt)}</td>
                    <td>
                      <div className="asset-actions">
                        <button
                          className="edit-asset-button"
                          onClick={() => handleEdit(liability)}
                          title="Edit liability"
                        >
                          Edit
                        </button>
                        <button
                          className="delete-asset-button"
                          onClick={() => handleDelete(liability)}
                          title="Delete liability"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingAsset && (
        <EditAssetModal
          asset={editingAsset}
          onClose={handleCloseModal}
          onSave={handleSaveAsset}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingAsset && (
        <div className="modal-overlay" onClick={handleCancelDelete}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="modal-close" onClick={handleCancelDelete}>×</button>
            </div>
            
            <div className="delete-modal-body">
              <p>Are you sure you want to delete this {deletingAsset.category === 'Liabilities' ? 'liability' : 'asset'}?</p>
              
              <div className="delete-asset-info">
                <strong>{deletingAsset.name || 'Unnamed'}</strong>
                <div className="delete-asset-details">
                  <span>{deletingAsset.category || 'Unknown'}</span>
                  <span>•</span>
                  <span>{deletingAsset.subtype || 'No subtype'}</span>
                </div>
              </div>
              
              <p className="delete-warning">⚠️ This action cannot be undone.</p>
            </div>
            
            <div className="modal-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="delete-confirm-button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssetTable;

