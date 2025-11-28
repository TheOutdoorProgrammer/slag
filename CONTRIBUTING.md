# Contributing to SLAG

Thank you for considering contributing to SLAG! This document provides guidelines and instructions for contributing to the project.

## How to Contribute

### Adding a New Project

The most common contribution is adding a new project to the directory. Here's how:

1. **Fork the repository** and create a new branch:
   ```bash
   git checkout -b add-project-name
   ```

2. **Create a YAML file** in the `projects/` directory:
   ```bash
   touch projects/your-project-name.yaml
   ```

3. **Fill in the project details** following this template:
   ```yaml
   name: "Project Name"
   url: "https://project-url.com"
   description: "A clear, concise description (1-2 sentences) of what the project does and why it's useful."
   category: "Category Name"  # See categories list below
   pricing: "Free"  # Options: Free, Freemium, Paid
   price: ""  # Empty for Free, otherwise "$10/month", "$99 one-time", etc.
   tags:
     - "tag1"
     - "tag2"
     - "tag3"
   lastVerified: "2025-01-15"  # Today's date in YYYY-MM-DD format
   notes: "Optional personal notes, tips, or recommendations about using this project."
   ```

4. **Validate your YAML**:
   ```bash
   npm install  # If you haven't already
   npm run validate
   ```

5. **Fetch the favicon** (optional but recommended):
   ```bash
   npm run fetch-favicons
   ```

6. **Test locally**:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` and search for your project to ensure it displays correctly.

7. **Commit and push**:
   ```bash
   git add projects/your-project-name.yaml
   git commit -m "Add [Project Name] to [Category]"
   git push origin add-project-name
   ```

8. **Create a Pull Request** with a clear title like "Add [Project Name]"

### Schema Requirements

#### Required Fields

All fields except `price` are required:

- `name`: The official name of the project
- `url`: The main website URL (must be a valid HTTPS URL)
- `description`: 1-2 sentences describing the project
- `category`: Must match one of the predefined categories (see below)
- `pricing`: Exactly one of: `Free`, `Freemium`, or `Paid`
- `price`: Required for Freemium/Paid, must be empty string for Free
- `tags`: Array of relevant tags (3-6 recommended)
- `lastVerified`: ISO date format (YYYY-MM-DD)
- `notes`: Optional personal recommendations or tips

#### Valid Categories

Projects must use one of these categories:

- Design Tools
- Development Tools
- Productivity
- Media & Entertainment
- Education & Learning
- System Utilities
- Communication
- Security & Privacy
- Data & Analytics
- Writing & Documentation

**Want to propose a new category?** See "Proposing New Categories" below.

#### Pricing Guidelines

- **Free**: Completely free with no paid tier or restrictions
- **Freemium**: Free tier available with paid upgrades
- **Paid**: Requires payment, though may have a trial

For Freemium and Paid projects, include pricing in the `price` field:
- Monthly: `"$10/month"`
- Annual: `"$50/year"`
- One-time: `"$99 one-time"`
- Multiple tiers: `"$10/month for Pro, $50/month for Enterprise"`

### Proposing New Categories

If none of the existing categories fit your project:

1. **Check if it really needs a new category** - try to fit it into an existing one first
2. **Open an issue** explaining:
   - Why the existing categories don't fit
   - What the new category would be called
   - What types of projects would fit in it
   - Examples of 3-5 projects that would use this category
3. **If approved**, update the categories enum in `scripts/build-data.js`:
   ```javascript
   const VALID_CATEGORIES = [
     // ... existing categories
     'Your New Category'
   ]
   ```
4. Submit a PR with the category change and the initial projects

### PR Guidelines

#### One Project Per PR

- Submit one project per pull request for easier review
- Exception: Multiple related projects from the same organization can be in one PR

#### PR Title Format

- Good: `Add Photopea to Design Tools`
- Good: `Add Linear to Productivity`
- Bad: `Update projects.yaml`
- Bad: `New tool`

#### PR Description

Include in your PR description:
- Brief explanation of what the project is
- Why it's useful/relevant
- Whether you're affiliated with the project (transparency is good!)
- Any special notes for reviewers

#### Testing Requirements

Before submitting:
- ✅ YAML validation passes (`npm run validate`)
- ✅ Build succeeds (`npm run build`)
- ✅ Project displays correctly locally (`npm run dev`)
- ✅ Favicon loads (run `npm run fetch-favicons`)

### Code Contributions

Contributing code changes? Great! Please:

1. **Open an issue first** to discuss the change
2. **Follow existing patterns** in the codebase
3. **Test thoroughly** - build, run, and test manually
4. **Update documentation** if you change functionality
5. **Keep PRs focused** - one feature or fix per PR

#### Setting Up Development Environment

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/slag.git
cd slag

# Install dependencies
npm install

# Start dev server
npm run dev

# In another terminal, validate and build
npm run validate
npm run build
```

#### Code Style

- Use functional React components with hooks
- Follow existing CSS class naming conventions
- Keep components small and focused
- Add comments for complex logic
- Use semantic HTML

### Updating Existing Projects

Found outdated information? Please update it!

1. Edit the YAML file
2. Update the `lastVerified` date to today
3. Update any changed information (pricing, description, etc.)
4. Submit a PR titled `Update [Project Name] information`

### Removing Projects

Projects should only be removed if:
- The project is permanently shut down
- The URL no longer works and there's no alternative
- The project has become malware/spam

Submit a PR titled `Remove [Project Name]` with an explanation.

## Code of Conduct

### Be Respectful

- Be kind and respectful to all contributors
- Provide constructive feedback
- Accept constructive criticism gracefully
- Focus on what's best for the community

### No Spam or Self-Promotion

- Don't add your own projects unless they provide real value
- Don't add projects you're affiliated with without disclosure
- Don't add multiple similar projects you're promoting
- Quality over quantity - we value curated, useful projects

### Quality Standards

Projects should be:
- Actually useful to developers or users
- Well-maintained (not abandoned)
- Legitimate (no scams, malware, or deceptive practices)
- Accessible (working URL, not behind unnecessary signup walls)

## Questions?

- Open an issue for questions about contributing
- Check existing issues and PRs for similar discussions
- For urgent matters, reach out to the maintainers

## License

By contributing to SLAG, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make SLAG better! 💜
