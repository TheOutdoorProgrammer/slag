import { useState } from 'react'

function Filters({
  categories,
  selectedCategories,
  onCategoriesChange,
  selectedPricing,
  onPricingChange,
  sortBy,
  onSortChange
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category))
    } else {
      onCategoriesChange([...selectedCategories, category])
    }
  }

  const togglePricing = (pricing) => {
    if (selectedPricing.includes(pricing)) {
      onPricingChange(selectedPricing.filter(p => p !== pricing))
    } else {
      onPricingChange([...selectedPricing, pricing])
    }
  }

  // Count active filters
  const activeFilterCount = selectedCategories.length + selectedPricing.length

  return (
    <>
      <button
        className="filters-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="filters-toggle-text">
          {isExpanded ? '▼' : '▶'} Filters
          {activeFilterCount > 0 && (
            <span className="filter-count-badge">{activeFilterCount}</span>
          )}
        </span>
      </button>

      {isExpanded && (
        <div className="filters-dropdown">
          <div className="filters-row">
            <div className="filter-group">
              <label className="filter-label">Categories</label>
              <div className="filter-checkboxes">
                {categories.map(category => (
                  <label key={category} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Pricing</label>
              <div className="filter-checkboxes">
                {['Free', 'Freemium', 'Paid'].map(pricing => (
                  <label key={pricing} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedPricing.includes(pricing)}
                      onChange={() => togglePricing(pricing)}
                    />
                    <span>{pricing}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select
                className="select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
              >
                <option value="pricing">Pricing (Free First)</option>
                <option value="alphabetical-asc">Alphabetical (A-Z)</option>
                <option value="alphabetical-desc">Alphabetical (Z-A)</option>
                <option value="recent">Recently Verified</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Filters
