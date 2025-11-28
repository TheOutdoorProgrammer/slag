import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import SearchBar from './components/SearchBar'
import Filters from './components/Filters'
import ProjectGrid from './components/ProjectGrid'
import Header from './components/Header'
import projectsData from './data/projects.json'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedPricing, setSelectedPricing] = useState([])
  const [sortBy, setSortBy] = useState('pricing') // Default: free first

  // Initialize Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(projectsData, {
      keys: ['name', 'description', 'tags', 'notes', 'category'],
      threshold: 0.3,
      includeScore: true
    })
  }, [])

  // Perform search and filtering
  const filteredProjects = useMemo(() => {
    let results = searchQuery
      ? fuse.search(searchQuery).map(result => result.item)
      : projectsData

    // Filter by category
    if (selectedCategories.length > 0) {
      results = results.filter(project =>
        selectedCategories.includes(project.category)
      )
    }

    // Filter by pricing
    if (selectedPricing.length > 0) {
      results = results.filter(project =>
        selectedPricing.includes(project.pricing)
      )
    }

    // Apply sorting
    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical-asc':
          return a.name.localeCompare(b.name)
        case 'alphabetical-desc':
          return b.name.localeCompare(a.name)
        case 'pricing':
          const pricingOrder = { 'Free': 0, 'Freemium': 1, 'Paid': 2 }
          return pricingOrder[a.pricing] - pricingOrder[b.pricing]
        case 'recent':
          return new Date(b.lastVerified) - new Date(a.lastVerified)
        default:
          return 0
      }
    })

    return results
  }, [searchQuery, selectedCategories, selectedPricing, sortBy, fuse])

  // Get unique categories for filter
  const categories = useMemo(() => {
    return [...new Set(projectsData.map(p => p.category))].sort()
  }, [])

  const handleReset = () => {
    setSearchQuery('')
    setSelectedCategories([])
    setSelectedPricing([])
  }

  return (
    <div className="app">
      <Header onReset={handleReset} />
      <main className="container">
        <div className="search-filters-wrapper">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            resultCount={filteredProjects.length}
          />
          <Filters
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoriesChange={setSelectedCategories}
            selectedPricing={selectedPricing}
            onPricingChange={setSelectedPricing}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
        <ProjectGrid
          projects={filteredProjects}
          onTagClick={setSearchQuery}
          onCategoryClick={(category) => {
            if (!selectedCategories.includes(category)) {
              setSelectedCategories([...selectedCategories, category])
            }
          }}
          onPricingClick={(pricing) => {
            if (!selectedPricing.includes(pricing)) {
              setSelectedPricing([...selectedPricing, pricing])
            }
          }}
        />
      </main>
    </div>
  )
}

export default App
