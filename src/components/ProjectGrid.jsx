import ProjectCard from './ProjectCard'

function ProjectGrid({ projects, onTagClick, onCategoryClick, onPricingClick }) {
  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <h2>No projects found</h2>
        <p>Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="projects-grid">
      {projects.map((project, index) => (
        <ProjectCard
          key={`${project.url}-${index}`}
          project={project}
          onTagClick={onTagClick}
          onCategoryClick={onCategoryClick}
          onPricingClick={onPricingClick}
        />
      ))}
    </div>
  )
}

export default ProjectGrid
