# 🔗 SLAG - Searchable Link Aggregator

A searchable directory website for hosting links to useful tools and projects, both free and paid. Built with React, styled with the Dracula theme, and designed for easy community contributions.

🌐 **Live Site**: [slag.theoutdoorprogrammer.com](https://slag.theoutdoorprogrammer.com)

## Features

- **⚡ Fast Search**: Fuzzy search powered by Fuse.js for instant results
- **🎨 Dracula Theme**: Beautiful, consistent dark theme throughout
- **🏷️ Filtering**: Filter by category and pricing tier
- **📊 Sorting**: Sort by pricing (free first), alphabetical, or recently verified
- **🎲 Random Discovery**: "Surprise Me" button for discovering new tools
- **📱 Responsive**: Mobile-first design that works everywhere
- **🔒 Open Source**: Fully open source and accepting contributions
- **💰 Transparent Pricing**: Clear indicators for free, freemium, and paid tools

## Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/TheOutdoorProgrammer/slag.git
cd slag

# Install dependencies
npm install

# Run the development server
npm run dev
```

Visit `http://localhost:3000` to see the site.

### Adding Your First Project

1. Create a new YAML file in the `projects/` directory:

```yaml
# projects/my-awesome-tool.yaml
name: "My Awesome Tool"
url: "https://myawesometool.com"
description: "A brief description of what your tool does and why it's useful."
category: "Development Tools"  # Must match one of the predefined categories
pricing: "Free"  # Options: Free, Freemium, Paid
price: ""  # Empty for Free, otherwise "$10/month" or similar
tags:
  - "tag1"
  - "tag2"
  - "tag3"
lastVerified: "2025-01-15"  # ISO date format (YYYY-MM-DD)
notes: "Optional notes or personal recommendations about the tool."
```

2. Validate your changes:

```bash
npm run validate
```

3. Build and preview:

```bash
npm run build
npm run preview
```

### Fetching Favicons

After adding new projects, fetch their favicons:

```bash
npm run fetch-favicons
```

This script will attempt to fetch favicons from multiple sources and save them to `public/favicons/`.

## Project Structure

```
slag/
├── public/
│   └── favicons/           # Fetched favicons
├── scripts/
│   ├── fetch-favicons.sh   # Favicon fetching script
│   └── build-data.js       # YAML → JSON build script
├── projects/               # YAML files (one per project)
│   ├── photopea.yaml
│   ├── excalidraw.yaml
│   └── ...
├── src/
│   ├── components/         # React components
│   ├── data/
│   │   └── projects.json   # Generated from YAML (gitignored)
│   ├── styles/             # Dracula theme CSS
│   ├── App.jsx
│   └── main.jsx
├── k8s/                    # Kubernetes manifests
├── .github/workflows/      # CI/CD workflows
├── Dockerfile
├── nginx.conf
├── CONTRIBUTING.md
└── README.md
```

## Categories

Current categories (new ones can be proposed via PR):

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

## Build Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:data` - Convert YAML files to JSON
- `npm run validate` - Validate YAML files without building
- `npm run preview` - Preview production build locally
- `npm run fetch-favicons` - Fetch favicons for all projects

## Deployment

### Docker

Build and run with Docker:

```bash
docker build -t slag .
docker run -p 8080:80 slag
```

### Kubernetes

Deploy to Kubernetes:

```bash
kubectl apply -k k8s/
```

The manifests include:
- Deployment with 2 replicas
- ClusterIP Service
- Ingress for `slag.theoutdoorprogrammer.com`
- Health checks and resource limits

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- Adding new projects
- Proposing new categories
- Code contributions
- PR requirements

## Tech Stack

- **Frontend**: React 18 + Vite
- **Search**: Fuse.js (fuzzy search)
- **Styling**: Custom CSS with Dracula theme
- **Data**: YAML → JSON at build time
- **Deployment**: Docker + Kubernetes + Cloudflare
- **CI/CD**: GitHub Actions

## Design Philosophy

1. **Free & Open Source First**: Free projects get priority in sorting and subtle visual prominence
2. **Transparency**: Never mislead about pricing - all costs clearly labeled
3. **Community-Driven**: Open to contributions via PR
4. **Performance**: Client-side search, optimized builds, lazy loading
5. **Simplicity**: Easy to add projects, minimal maintenance required

## License

MIT License - feel free to fork, modify, and use for your own directory sites!

## Acknowledgments

- [Dracula Theme](https://draculatheme.com/) for the color scheme
- All the amazing projects featured in the directory
- Contributors who help maintain and expand the directory

---

**Made with 💜 by [The Outdoor Programmer](https://theoutdoorprogrammer.com)**
