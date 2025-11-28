import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Schema constants
const VALID_CATEGORIES = [
  'Design Tools',
  'Development Tools',
  'Productivity',
  'Media & Entertainment',
  'Education & Learning',
  'System Utilities',
  'Communication',
  'Security & Privacy',
  'Data & Analytics',
  'Writing & Documentation'
]

const VALID_PRICING = ['Free', 'Freemium', 'Paid']

class ValidationError extends Error {
  constructor(file, message) {
    super(`${file}: ${message}`)
    this.file = file
  }
}

function validateProject(data, filename) {
  const errors = []

  // Required fields
  const requiredFields = ['name', 'url', 'description', 'category', 'pricing', 'tags', 'lastVerified']
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      errors.push(`Missing required field: ${field}`)
    }
  }

  // Validate category enum
  if (data.category && !VALID_CATEGORIES.includes(data.category)) {
    errors.push(`Invalid category: "${data.category}". Must be one of: ${VALID_CATEGORIES.join(', ')}`)
  }

  // Validate pricing enum
  if (data.pricing && !VALID_PRICING.includes(data.pricing)) {
    errors.push(`Invalid pricing: "${data.pricing}". Must be one of: ${VALID_PRICING.join(', ')}`)
  }

  // Validate price field logic
  if (data.pricing === 'Free' && data.price && data.price !== '') {
    errors.push(`Price field must be empty for Free projects, got: "${data.price}"`)
  }

  if ((data.pricing === 'Freemium' || data.pricing === 'Paid') && !data.price) {
    errors.push(`Price field is required for ${data.pricing} projects`)
  }

  // Validate URL format
  if (data.url) {
    try {
      new URL(data.url)
    } catch (e) {
      errors.push(`Invalid URL: ${data.url}`)
    }
  }

  // Validate tags is an array
  if (data.tags && !Array.isArray(data.tags)) {
    errors.push(`Tags must be an array`)
  }

  // Validate lastVerified is a valid date
  if (data.lastVerified) {
    const date = new Date(data.lastVerified)
    if (isNaN(date.getTime())) {
      errors.push(`Invalid date format for lastVerified: ${data.lastVerified}`)
    }
  }

  // Validate string fields are strings
  const stringFields = ['name', 'url', 'description', 'category', 'pricing', 'notes']
  for (const field of stringFields) {
    if (data[field] !== undefined && typeof data[field] !== 'string') {
      errors.push(`${field} must be a string`)
    }
  }

  if (errors.length > 0) {
    throw new ValidationError(filename, errors.join('\n  '))
  }

  return true
}

function loadProjects(projectsDir) {
  const projects = []
  const files = fs.readdirSync(projectsDir)

  const yamlFiles = files.filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))

  if (yamlFiles.length === 0) {
    console.warn('Warning: No YAML files found in projects directory')
  }

  for (const file of yamlFiles) {
    const filePath = path.join(projectsDir, file)
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const data = yaml.load(content)

      validateProject(data, file)
      projects.push(data)

      console.log(`✓ Loaded and validated: ${file}`)
    } catch (error) {
      if (error instanceof ValidationError) {
        console.error(`✗ Validation failed for ${error.file}:`)
        console.error(`  ${error.message}`)
      } else {
        console.error(`✗ Failed to parse ${file}:`, error.message)
      }
      process.exit(1)
    }
  }

  return projects
}

function main() {
  const validateOnly = process.argv.includes('--validate-only')

  const projectsDir = path.join(__dirname, '../projects')
  const outputDir = path.join(__dirname, '../src/data')
  const outputFile = path.join(outputDir, 'projects.json')

  console.log('🔍 Validating YAML files...\n')

  // Ensure projects directory exists
  if (!fs.existsSync(projectsDir)) {
    console.error('Error: projects directory not found')
    process.exit(1)
  }

  const projects = loadProjects(projectsDir)

  console.log(`\n✅ Successfully validated ${projects.length} project(s)`)

  if (!validateOnly) {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Write JSON file
    fs.writeFileSync(outputFile, JSON.stringify(projects, null, 2))
    console.log(`📦 Generated ${outputFile}`)
  }

  console.log('\n✨ Build complete!\n')
}

main()
