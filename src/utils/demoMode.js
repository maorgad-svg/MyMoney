/**
 * Demo Mode Utility
 * 
 * Provides functionality to scale monetary values for demo presentations.
 * Activated/deactivated via Cmd/Ctrl + D keyboard shortcut.
 */

const DEMO_MODE_KEY = 'demoMode';
const SCALING_FACTOR_KEY = 'demoScalingFactor';

/**
 * Check if demo mode is currently active
 */
export function isDemoMode() {
  return localStorage.getItem(DEMO_MODE_KEY) === 'true';
}

/**
 * Get the current scaling factor (or generate a new one)
 */
export function getScalingFactor() {
  let factor = parseFloat(localStorage.getItem(SCALING_FACTOR_KEY));
  
  // If no factor exists or demo mode is off, return 1 (no scaling)
  if (!isDemoMode() || isNaN(factor)) {
    return 1;
  }
  
  return factor;
}

/**
 * Generate a random scaling factor between 10 and 20
 */
function generateScalingFactor() {
  return 10 + Math.random() * 10; // Random between 10 and 20
}

/**
 * Enable demo mode (if not already enabled)
 */
export function enableDemoMode() {
  if (!isDemoMode()) {
    const factor = generateScalingFactor();
    localStorage.setItem(DEMO_MODE_KEY, 'true');
    localStorage.setItem(SCALING_FACTOR_KEY, factor.toString());
    console.log(`🎭 Demo mode: ON (${factor.toFixed(1)}x real values)`);
    return true;
  }
  return true;
}

/**
 * Toggle demo mode on/off
 */
export function toggleDemoMode() {
  const isActive = isDemoMode();
  
  if (isActive) {
    // Turn off demo mode
    localStorage.removeItem(DEMO_MODE_KEY);
    localStorage.removeItem(SCALING_FACTOR_KEY);
    console.log('🔓 Demo mode: OFF');
    return false;
  } else {
    // Turn on demo mode with a new scaling factor
    const factor = generateScalingFactor();
    localStorage.setItem(DEMO_MODE_KEY, 'true');
    localStorage.setItem(SCALING_FACTOR_KEY, factor.toString());
    console.log(`🎭 Demo mode: ON (${factor.toFixed(1)}x real values)`);
    return true;
  }
}

/**
 * Apply demo mode scaling to a monetary value
 */
export function scaleValue(value) {
  if (!isDemoMode()) {
    return value;
  }
  
  const factor = getScalingFactor();
  return value * factor;
}

/**
 * Scale all monetary values in an asset object
 */
export function scaleAsset(asset) {
  if (!isDemoMode()) {
    return asset;
  }
  
  return {
    ...asset,
    originalValue: scaleValue(asset.originalValue),
    currentValueUSD: scaleValue(asset.currentValueUSD),
  };
}

/**
 * Scale all assets in an array
 */
export function scaleAssets(assets) {
  if (!isDemoMode()) {
    return assets;
  }
  
  return assets.map(scaleAsset);
}

