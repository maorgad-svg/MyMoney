# 🎭 Demo Mode Feature

## Overview

Demo Mode allows you to present your Net Worth Dashboard to others without revealing your actual financial numbers. All monetary values are scaled by a random percentage (65-85%) to maintain realistic proportions while protecting your privacy.

---

## How It Works

### Activation

Press **`Cmd + D`** (Mac) or **`Ctrl + D`** (Windows/Linux) to toggle Demo Mode on/off.

- ✅ **No UI button** - Only accessible via keyboard shortcut
- ✅ **Instant toggle** - Activates/deactivates immediately
- ✅ **Consistent scaling** - Same percentage applied across all values during a session
- ✅ **Visual indicator** - Small 🎭 emoji appears in bottom-right corner when active

### What Gets Scaled

**All monetary values are scaled:**
- ✅ Total Net Worth
- ✅ Category totals (Cash, Securities, Real Estate, Liabilities)
- ✅ Individual asset values (Original Value and USD Value)
- ✅ Net Worth Summary chart
- ✅ Category breakdown cards
- ✅ Asset table values

**What stays the same:**
- ✅ Asset names
- ✅ Categories and subtypes
- ✅ Dates
- ✅ Number of assets
- ✅ Proportions between assets

---

## Usage Guide

### Before Your Demo

1. Open the dashboard with your real data
2. Press **`Cmd/Ctrl + D`** to activate Demo Mode
3. Check the bottom-right corner for the 🎭 indicator
4. Verify the numbers look realistic but different

### During Your Demo

- Present as normal - all numbers are fake
- The 🎭 indicator is subtle and won't draw attention
- Proportions and relationships remain accurate
- Charts and graphs maintain realistic shapes

### After Your Demo

1. Press **`Cmd/Ctrl + D`** again to deactivate
2. The 🎭 indicator disappears
3. All real values are restored immediately

---

## Technical Details

### Scaling Algorithm

```javascript
// Random scaling factor between 0.65 and 0.85
scalingFactor = 0.65 + Math.random() * 0.2;

// Applied to all monetary values
demoValue = realValue * scalingFactor;
```

### Example

If your real net worth is **$1,000,000**:
- Demo Mode might show: **$730,000** (73% scaling)
- Or: **$820,000** (82% scaling)
- The factor is random each time you activate it

### Data Storage

- Demo mode state stored in `localStorage`
- Scaling factor persists during the session
- **No real data is changed** - scaling only affects the display
- All Airtable data remains unchanged

### Browser Console

When toggling Demo Mode, the console shows:
```
🎭 Demo mode: ON (73% of real values)
```
or
```
🔓 Demo mode: OFF
```

---

## Privacy & Security

### What's Protected

✅ **Your actual net worth** - Hidden from viewers  
✅ **Individual asset values** - Scaled consistently  
✅ **Total wealth** - Disguised but realistic  

### What's Visible

⚠️ **Asset names** - Still visible (e.g., "Primary Residence", "Chase Mortgage")  
⚠️ **Categories** - Visible (Cash, Securities, Real Estate, Liabilities)  
⚠️ **Structure** - Number and types of assets are visible  

### Best Practices

1. **Review asset names** - Consider generic names for demos
2. **Check the indicator** - Always verify 🎭 is showing before presenting
3. **Practice first** - Try toggling on/off before the actual demo
4. **Close browser after** - Refresh to ensure you're back to real values

---

## Keyboard Shortcut Reference

| Action | Mac | Windows/Linux |
|--------|-----|---------------|
| Toggle Demo Mode | `⌘ + D` | `Ctrl + D` |

**Note:** The browser's default bookmark action (Cmd/Ctrl+D) is prevented when this shortcut is used.

---

## Troubleshooting

### Demo Mode won't activate
- Make sure you're on the Dashboard page
- Try clicking on the page first (to ensure focus)
- Check browser console for error messages

### Numbers look the same
- The scaling might be close to 100% by chance
- Toggle off and on again for a new random factor
- Check for the 🎭 indicator to confirm it's active

### Numbers jumping around
- Each toggle generates a new random factor
- Once activated, the factor stays consistent
- Avoid toggling during presentations

### Forgot if Demo Mode is on
- Look for 🎭 indicator in bottom-right
- Hover over it to see the tooltip
- Check browser console for confirmation

---

## Use Cases

### ✅ Recommended For

- **Investor pitches** - Show the app without revealing personal wealth
- **Client demos** - Demonstrate features with realistic data
- **Screenshots/videos** - Share publicly without privacy concerns
- **Team presentations** - Show colleagues how the app works
- **Portfolio reviews** - General structure without exact numbers

### ⚠️ Not Recommended For

- **Personal financial planning** - Use real numbers
- **Tax preparation** - Must use actual values
- **Loan applications** - Requires authentic data
- **Legal/audit purposes** - Real data required

---

## FAQ

**Q: Does Demo Mode change my Airtable data?**  
A: No! It only scales the display. All data in Airtable remains unchanged.

**Q: Will others see the keyboard shortcut?**  
A: No. There's no UI button or menu item. Only you know the shortcut.

**Q: Can I customize the scaling percentage?**  
A: Currently it's random (65-85%). This can be customized in `src/utils/demoMode.js`.

**Q: Does Demo Mode persist after closing the browser?**  
A: No. It's stored in localStorage and will reset when you refresh or reopen.

**Q: What if I present in Demo Mode and forget to turn it off?**  
A: Simply press Cmd/Ctrl+D again after the demo. Real values return instantly.

**Q: Can I hide the 🎭 indicator?**  
A: Yes, but it's recommended to keep it visible so you always know when Demo Mode is active. Edit `src/pages/Dashboard.jsx` to remove it if needed.

---

## Developer Notes

### Files Modified

- `src/utils/demoMode.js` - Core demo mode logic
- `src/pages/Dashboard.jsx` - Keyboard listener and scaling application
- `src/styles.css` - Demo mode indicator styling

### Customization

To change the scaling range, edit `src/utils/demoMode.js`:

```javascript
function generateScalingFactor() {
  return 0.65 + Math.random() * 0.2; // Change these values
}
```

To change the keyboard shortcut, edit `src/pages/Dashboard.jsx`:

```javascript
if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
  // Change 'd' to another key
}
```

---

## Version History

- **v1.0** (Dec 2024) - Initial demo mode implementation
  - Random scaling (65-85%)
  - Cmd/Ctrl+D keyboard shortcut
  - Visual indicator
  - No UI toggle

---

**Remember:** Always verify the 🎭 indicator is showing before presenting!


