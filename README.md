# Neuro ICU Rounding App

A comprehensive neurological intensive care unit (Neuro ICU) rounding application built with React + Vite. This application streamlines bedside workflows by providing structured patient rounding sheets, clinical scoring systems, and SmartPhrase templates for generating medical documentation.

## 🏥 Features

- **📋 Structured Rounding Sheets**: Organize patient information including vitals, neuro exams, labs, imaging, and assessments
- **🧠 Clinical Scoring Systems**: Built-in calculators for:
  - Hunt & Hess Scale (SAH)
  - Modified Fisher Scale (vasospasm risk)
  - ICH Score (hemorrhage mortality)
  - NIHSS (stroke severity)
  - GCS (Glasgow Coma Scale)
  - And more specialized neuro ICU scores
- **📝 SmartPhrase Templates**: Pre-built medical note templates for:
  - Subarachnoid hemorrhage (SAH)
  - Ischemic stroke
  - Traumatic brain injury (TBI)
  - Status epilepticus
  - Intracerebral hemorrhage (ICH)
  - General ICU and CVICU notes
- **✅ Clinical Checklists**: Automated care bundles and task tracking
- **💾 Local Storage**: Patient data persists in browser (no server required)
- **📱 Responsive Design**: Works on tablets and mobile devices for bedside use
- **🚀 Easy Deployment**: Deploy to GitHub Pages or run locally

## 📖 Table of Contents

- [Quick Start](#-quick-start)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Production Build](#production-build)
- [GitHub Pages Deployment](#github-pages-deployment)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [GitHub Copilot Integration](#-github-copilot-integration)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)

## 🚀 Quick Start

Get up and running in 3 steps:

```sh
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:3000 in your browser
```

## Prerequisites

- **Node.js** 18+ (the CI deploy job uses Node 20)
- **npm** 9+

> **Note**: If you don't have Node.js installed, download it from [nodejs.org](https://nodejs.org/)

## Local Development

```sh
npm install
npm run dev
```

The Vite dev server opens automatically (defaults to http://localhost:3000). If ports 3000/3001 are busy it will fall back to the next available port.

### Development Tips

- **Hot Module Replacement (HMR)**: Changes to source files automatically reload in the browser
- **TypeScript checking**: Run `npm run build` to check for type errors
- **Data persistence**: Patient data is stored in browser localStorage for testing

## Production Build

```sh
npm run build
```

Artifacts land in `dist/`. Serve that folder with any static host.

## GitHub Pages Deployment

This repo now ships with `.github/workflows/deploy.yml`. Every push to `main` (or a manual "Run workflow") will:

1. Install dependencies via `npm ci`
2. Build the site with `VITE_BASE_PATH=/neuroicu-rounds/` so asset URLs work under `https://<user>.github.io/neuroicu-rounds/`
3. Publish the `dist/` artifact to GitHub Pages using the official `deploy-pages` action

### Initial setup

1. Push the repo to GitHub if you have not already (`git remote add origin ... && git push -u origin main`).
2. In the GitHub UI, go to **Settings → Pages** and set the source to **GitHub Actions** (only needed once).
3. Trigger the "Deploy to GitHub Pages" workflow (push to `main` or click **Actions → Deploy to GitHub Pages → Run workflow**).

GitHub will surface the live link (for example `https://szarbiv34-lab.github.io/neuroicu-rounds/`) in the workflow summary and under **Settings → Pages**. Share that URL with your team.

> `vite.config.ts` reads from the `VITE_BASE_PATH` env var. Leave it unset for local dev (defaults to "/"), but set it to `/neuroicu-rounds/`—or whatever repo path you host under—before building for Pages.

## 📱 Usage Guide

### Creating a Patient Rounding Sheet

1. **Start a new patient**: Click "New Patient" or modify the default template
2. **Select diagnosis type**: Choose from SAH, stroke, ICH, TBI, seizure, spine, tumor, or other
3. **Fill in patient details**:
   - Patient name and room number
   - Hospital day / ICU day
   - Primary diagnosis and one-liner summary

### Using Clinical Scores

The **Scores** tab provides quick access to specialized clinical calculators:

- **SAH patients**: Hunt-Hess grade, Modified Fisher scale, bleed day tracking
- **Stroke patients**: NIHSS calculation, ASPECTS score, tPA/thrombectomy documentation
- **ICH patients**: ICH score with mortality prediction
- **TBI patients**: GCS tracking, Marshall CT classification
- **Seizure patients**: Status epilepticus tracking, EEG findings

### Documenting Neuro Exam

The **Exam** tab captures detailed neurological assessments:

- **GCS components**: Eye, verbal, motor (with admission baseline)
- **Pupils**: Size and reactivity for left and right
- **Motor strength**: 0-5 scale for all four extremities
- **ICP monitoring**: ICP, CPP, EVD drainage settings
- **Additional findings**: Cranial nerves, sedation level, seizure activity

### Using SmartPhrase Templates

1. Navigate to the **Plan** tab
2. Select a template that matches the diagnosis (e.g., `.NEUROICU_SAH` for SAH patients)
3. Fill in patient data across all tabs
4. Click "Copy to Clipboard" to generate a formatted note with all fields populated
5. Paste into your EHR or documentation system

### Managing Tasks and Checklists

- **Checklists**: Pre-populated care bundle items specific to the diagnosis
- **Tasks**: Add custom to-dos with priorities (routine, urgent, STAT) and timing (AM, PM, Today)
- **Problems**: Document assessment and plan for each active problem

## 📁 Project Structure

```
neuroicu-rounds/
├── src/
│   ├── main.tsx              # Application entry point
│   ├── RoundingApp.tsx       # Main application component
│   ├── ClinicalScores.tsx    # Clinical scoring calculators
│   ├── types.ts              # TypeScript type definitions
│   ├── smartphrases.ts       # SmartPhrase template library
│   └── smartphraseEngine.ts  # Template rendering engine
├── .github/
│   └── workflows/
│       ├── deploy.yml        # GitHub Pages deployment
│       └── run-example.yml   # CI test workflow
├── index.html                # HTML entry point
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

### Key Files Explained

- **`types.ts`**: Contains all TypeScript interfaces for patient data, clinical scores, and app state
- **`smartphrases.ts`**: Library of medical note templates with placeholder tokens
- **`smartphraseEngine.ts`**: Renders templates by replacing tokens with actual patient data
- **`ClinicalScores.tsx`**: Interactive calculators with clinical reference data (e.g., mortality tables)
- **`RoundingApp.tsx`**: Main UI with tabs for scores, exam, data, and plan
- **`exampleUsage.ts`**: Demonstrates how to use the SmartPhrase engine programmatically

## 📚 Documentation

Comprehensive guides are available in the `docs/` directory:

- **[Quick Start Guide](./docs/QUICKSTART.md)** - Get started in 5 minutes
- **[User Guide](./docs/USER_GUIDE.md)** - Detailed usage instructions and workflows
- **[Architecture Overview](./docs/ARCHITECTURE.md)** - Technical architecture and design decisions
- **[Customization Guide](./docs/CUSTOMIZATION.md)** - How to customize templates, scores, and UI
- **[Copilot Guide](./docs/COPILOT_GUIDE.md)** - Using GitHub Copilot with this repository
- **[FAQ](./docs/FAQ.md)** - Frequently asked questions
- **[Contributing Guidelines](./CONTRIBUTING.md)** - How to contribute to the project

## 🤖 GitHub Copilot Integration

This repository is optimized for use with [GitHub Copilot](https://github.com/features/copilot), including the Copilot coding agent. The repository includes:

- **[Copilot Instructions](./.github/copilot-instructions.md)** - Comprehensive guidance for Copilot on code style, conventions, and project patterns
- **Issue Templates** - Pre-configured templates for creating well-scoped tasks:
  - 🐛 Bug reports
  - ✨ Feature requests
  - 🤖 Copilot-optimized tasks
  - 📝 Documentation updates
  - 📊 Information gathering / Triage
  - 🎯 Parent issues / Epics
  - See the [Issue Templates Guide](./.github/ISSUE_TEMPLATE/README.md) for details

### Working with Copilot Coding Agent

To get the best results when using GitHub Copilot coding agent:

1. **Create clear, focused issues** using the provided templates
2. **Use the Copilot Task template** for AI-friendly issue descriptions
3. **Review Copilot's pull requests** just like any team member's work
4. **Provide feedback** via PR comments to refine the solution

The Copilot instructions include project-specific details about:
- TypeScript and React patterns used in this codebase
- Medical accuracy requirements for clinical content
- Build and testing workflows
- Code review expectations

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:

- Setting up your development environment
- Code style and conventions
- Adding new clinical scores or templates
- Submitting pull requests

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and test thoroughly
4. Commit with clear messages (`git commit -m 'Add ASPECTS calculator'`)
5. Push to your fork (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 🔧 Troubleshooting

### Build Errors

**Problem**: `npm run build` fails with TypeScript errors

```sh
# Solution: Ensure dependencies are installed
npm install

# Check TypeScript version
npx tsc --version  # Should be 5.9+
```

**Problem**: Port 3000 is already in use

```sh
# Solution: Vite will automatically try the next available port
# Or specify a different port:
npm run dev -- --port 3001
```

### Deployment Issues

**Problem**: GitHub Pages shows 404 or assets don't load

- ✅ Check that `VITE_BASE_PATH` matches your repository name in deploy.yml
- ✅ Verify Pages is enabled in repository Settings → Pages
- ✅ Ensure the workflow has `pages: write` and `id-token: write` permissions

**Problem**: Build works locally but fails in CI

- ✅ Ensure `package.json` and `package-lock.json` are committed to git
- ✅ Check that Node.js version in workflow matches your local version
- ✅ Review workflow logs in Actions tab for specific errors

### Data Issues

**Problem**: Patient data disappears after refresh

- Patient data is stored in browser localStorage
- Clearing browser data or using incognito mode will reset the app
- Consider exporting important data before clearing browser storage

**Problem**: App is slow with many patients

- The app stores all data in browser memory
- For production use with many patients, consider adding export/import functionality
- Regularly archive completed patients to maintain performance

### Browser Compatibility

**Recommended browsers**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Known issues**:
- Internet Explorer is not supported (use a modern browser)
- Some mobile browsers may have limited localStorage capacity

## 📄 License

ISC License - see package.json for details

## 🙏 Acknowledgments

This application is designed for medical professionals in neurological intensive care units. It is intended as a documentation aid and should not replace clinical judgment or institutional protocols.

**Medical Disclaimer**: This software is provided for informational purposes only. Always follow your institution's guidelines and verify all clinical calculations independently.