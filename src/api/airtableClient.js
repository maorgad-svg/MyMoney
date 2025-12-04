/**
 * Airtable API Client
 * 
 * This module handles all communication with the Airtable REST API.
 * Environment variables required:
 * - VITE_AIRTABLE_API_KEY: Your Airtable personal access token
 * - VITE_AIRTABLE_BASE_ID: The ID of your Airtable base
 * - VITE_AIRTABLE_TABLE_NAME: The name of the table (e.g., "Assets")
 */

const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME || 'Assets';

const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

/**
 * Fetches all asset records from Airtable
 * @returns {Promise<Array>} Array of normalized asset objects
 */
export async function fetchAssets() {
  try {
    const response = await fetch(BASE_URL, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Normalize Airtable records to our app's data structure
    const assets = data.records.map(record => ({
      id: record.id,
      name: record.fields.name || '',
      category: record.fields.category || '',
      subtype: record.fields.subtype || '',
      currency: record.fields.currency || 'USD',
      originalValue: record.fields.originalValue || record.fields.currentValueUSD || 0,
      currentValueUSD: record.fields.currentValueUSD || 0,
      updatedAt: record.fields.updatedAt || '',
    }));

    return assets;
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
}

/**
 * Creates a new asset record in Airtable
 * @param {Object} asset - The asset data to create
 * @param {string} asset.name - Asset name
 * @param {string} asset.category - Asset category (Cash, Securities, Real Estate)
 * @param {string} asset.subtype - Asset subtype
 * @param {string} asset.currency - Currency (USD or NIS)
 * @param {number} asset.originalValue - Original value in the specified currency
 * @param {number} asset.currentValueUSD - Current value in USD
 * @returns {Promise<Object>} The created asset object
 */
export async function createAsset(asset) {
  try {
    // Prepare base fields that always exist
    const fields = {
      name: asset.name,
      category: asset.category,
      subtype: asset.subtype,
      currentValueUSD: asset.currentValueUSD,
      updatedAt: new Date().toISOString(),
    };

    // Add currency fields only if they exist in the asset object
    // This provides backward compatibility
    if (asset.currency) {
      fields.currency = asset.currency;
    }
    if (asset.originalValue !== undefined) {
      fields.originalValue = asset.originalValue;
    }

    const payload = { fields };

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Airtable error details:', errorData);
      console.error('Payload sent:', payload);
      
      const errorMessage = errorData.error?.message || response.statusText;
      throw new Error(`Airtable API error: ${response.status} - ${errorMessage}`);
    }

    const data = await response.json();
    
    // Normalize the created record
    return {
      id: data.id,
      name: data.fields.name || '',
      category: data.fields.category || '',
      subtype: data.fields.subtype || '',
      currency: data.fields.currency || 'USD',
      originalValue: data.fields.originalValue || data.fields.currentValueUSD || 0,
      currentValueUSD: data.fields.currentValueUSD || 0,
      updatedAt: data.fields.updatedAt || '',
    };
  } catch (error) {
    console.error('Error creating asset:', error);
    throw error;
  }
}

/**
 * Updates an existing asset record in Airtable
 * @param {string} id - The Airtable record ID
 * @param {Object} asset - The asset data to update
 * @returns {Promise<Object>} The updated asset object
 */
export async function updateAsset(id, asset) {
  try {
    // Prepare base fields
    const fields = {
      name: asset.name,
      category: asset.category,
      subtype: asset.subtype,
      currentValueUSD: asset.currentValueUSD,
      updatedAt: new Date().toISOString(),
    };

    // Add currency fields if they exist
    if (asset.currency) {
      fields.currency = asset.currency;
    }
    if (asset.originalValue !== undefined) {
      fields.originalValue = asset.originalValue;
    }

    const payload = { fields };

    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Airtable error details:', errorData);
      console.error('Payload sent:', payload);
      
      const errorMessage = errorData.error?.message || response.statusText;
      throw new Error(`Airtable API error: ${response.status} - ${errorMessage}`);
    }

    const data = await response.json();
    
    // Normalize the updated record
    return {
      id: data.id,
      name: data.fields.name || '',
      category: data.fields.category || '',
      subtype: data.fields.subtype || '',
      currency: data.fields.currency || 'USD',
      originalValue: data.fields.originalValue || data.fields.currentValueUSD || 0,
      currentValueUSD: data.fields.currentValueUSD || 0,
      updatedAt: data.fields.updatedAt || '',
    };
  } catch (error) {
    console.error('Error updating asset:', error);
    throw error;
  }
}

/**
 * Deletes an asset record from Airtable
 * @param {string} id - The Airtable record ID
 * @returns {Promise<void>}
 */
export async function deleteAsset(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Airtable error details:', errorData);
      
      const errorMessage = errorData.error?.message || response.statusText;
      throw new Error(`Airtable API error: ${response.status} - ${errorMessage}`);
    }

    // Return the deleted record data for confirmation
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting asset:', error);
    throw error;
  }
}

