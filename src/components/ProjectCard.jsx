import { useState } from 'react'

function ProjectCard({ project, onTagClick, onCategoryClick, onPricingClick }) {
  const [faviconError, setFaviconError] = useState(false)

  // Extract domain from URL for favicon
  const getDomain = (url) => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname.replace('www.', '')
    } catch {
      return ''
    }
  }

  const domain = getDomain(project.url)
  const faviconPath = `/favicons/${domain.replace(/\./g, '-')}.ico`

  const getPricingClass = (pricing) => {
    return `pricing-${pricing.toLowerCase()}`
  }

  return (
    <div className="project-card">
      <div className="project-header">
        {!faviconError ? (
          <img
            src={faviconPath}
            alt={`${project.name} favicon`}
            className="project-favicon"
            onError={() => setFaviconError(true)}
          />
        ) : (
          <div className="project-favicon-placeholder">
            {project.name.charAt(0)}
          </div>
        )}
        <div className="project-title-section">
          <h3 className="project-name">
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              {project.name}
            </a>
          </h3>
          <div className="project-meta">
            <button
              className="project-category"
              onClick={() => onCategoryClick(project.category)}
              title={`Filter by ${project.category}`}
            >
              {project.category}
            </button>
            <button
              className={`pricing-badge ${getPricingClass(project.pricing)}`}
              onClick={() => onPricingClick(project.pricing)}
              title={`Filter by ${project.pricing}`}
            >
              {project.pricing}
            </button>
          </div>
        </div>
      </div>

      <p className="project-description">{project.description}</p>

      {project.tags && project.tags.length > 0 && (
        <div className="project-tags">
          {project.tags.map((tag, index) => (
            <button
              key={index}
              className="tag"
              onClick={() => onTagClick(tag)}
              title={`Search for "${tag}"`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {project.price && (
        <div className="project-price">
          💰 {project.price}
        </div>
      )}

      {project.notes && (
        <div className="project-notes">
          {project.notes}
        </div>
      )}
    </div>
  )
}

export default ProjectCard
