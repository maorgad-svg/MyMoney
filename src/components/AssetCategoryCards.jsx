/**
 * AssetCategoryCards Component
 * 
 * Displays three cards, one for each asset category (Cash, Securities, Real Estate).
 * Each card shows the category name, total value, description, and count of assets.
 */
function AssetCategoryCards({ assets }) {
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Separate assets from liabilities
  const assetsOnly = assets.filter(asset => asset.category !== 'Liabilities');
  const liabilities = assets.filter(asset => asset.category === 'Liabilities');

  // Define asset categories with their descriptions
  const assetCategories = [
    {
      name: 'Cash',
      description: 'Liquid assets including bank accounts and money market funds.',
    },
    {
      name: 'Securities',
      description: 'Stocks, bonds, and other tradable financial instruments.',
    },
    {
      name: 'Real Estate',
      description: 'Properties and real estate investments.',
    },
  ];

  // Calculate data for each asset category
  const categoryData = assetCategories.map(category => {
    const categoryAssets = assetsOnly.filter(asset => asset.category === category.name);
    const total = categoryAssets.reduce((sum, asset) => sum + asset.currentValueUSD, 0);
    const count = categoryAssets.length;
    
    return {
      ...category,
      total,
      count,
    };
  });

  // Calculate liabilities data
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.currentValueUSD, 0);
  const liabilitiesData = liabilities.length > 0 ? {
    name: 'Liabilities',
    description: 'Mortgages, loans, credit cards, and other debts.',
    total: totalLiabilities,
    count: liabilities.length,
    isLiability: true
  } : null;

  return (
    <div className="asset-categories">
      <h2 className="section-title">Asset Categories</h2>
      <div className="category-cards">
        {categoryData.map(category => (
          <div key={category.name} className="category-card">
            <h3>{category.name}</h3>
            <div className="category-amount">{formatCurrency(category.total)}</div>
            <p className="category-description">{category.description}</p>
            <div className="asset-count">
              {category.count} {category.count === 1 ? 'asset' : 'assets'}
            </div>
          </div>
        ))}
        {liabilitiesData && (
          <div key="Liabilities" className="category-card liabilities-card">
            <h3>{liabilitiesData.name}</h3>
            <div className="category-amount negative">-{formatCurrency(liabilitiesData.total)}</div>
            <p className="category-description">{liabilitiesData.description}</p>
            <div className="asset-count">
              {liabilitiesData.count} {liabilitiesData.count === 1 ? 'liability' : 'liabilities'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssetCategoryCards;

