# GitHub Copilot Instructions for Neuro ICU Rounds

## Project Overview

This is a **Neuro ICU Rounding Application** built with React, TypeScript, and Vite. The application provides a cockpit for bedside workflows in neurological intensive care units, supporting various diagnosis types including SAH, ischemic stroke, ICH, TBI, status epilepticus, spinal cord injury, and brain tumors.

## Technology Stack

- **Frontend Framework**: React 18.3+
- **Language**: TypeScript (strict mode enabled)
- **Build Tool**: Vite 6.0+
- **Package Manager**: npm
- **Deployment**: GitHub Pages via GitHub Actions

## Prerequisites

- Node.js 18+ (CI uses Node 20)
- npm 9+

## Development Commands

### Setup
```bash
npm install
```

### Local Development
```bash
npm run dev
```
The Vite dev server is configured to open automatically, preferring http://localhost:3000 (and then 3001), but if those ports are busy it will fall back to the next available port (see vite.config.ts and README.md).

### Production Build
```bash
npm run build
```
This runs TypeScript compilation followed by Vite build. Artifacts land in `dist/`.

### Preview Production Build
```bash
npm run preview
```

## Code Style and Conventions

### TypeScript
- **Strict mode is enabled** - all strict TypeScript checks are enforced
- Use explicit types where appropriate; leverage type inference where it improves readability
- No unused locals or parameters allowed (`noUnusedLocals`, `noUnusedParameters` are enabled)
- `noFallthroughCasesInSwitch` is enabled - always handle switch cases properly

### React
- Use functional components with hooks
- Use `React.StrictMode` (already configured in main.tsx)
- JSX transform: `react-jsx` (no need to import React in every file for JSX)

### File Organization
- Source code lives in `src/` directory
- Components: Place React components in `src/` (e.g., `RoundingApp.tsx`, `ClinicalScores.tsx`)
- Types: Centralized in `src/types.ts`
- Business logic: Separate modules (e.g., `smartphraseEngine.ts`, `smartphrases.ts`)

### Naming Conventions
- React components: PascalCase (e.g., `RoundingApp`, `ClinicalScores`)
- Files containing React components: PascalCase with `.tsx` extension
- Other TypeScript files: camelCase with `.ts` extension
- Types/Interfaces: PascalCase

## Key Application Concepts

### Clinical Focus
This application manages neuro ICU rounding data including:
- **Clinical Scores**: GCS, NIHSS, mRS, Hunt & Hess, Fisher scale
- **Neuro Exam**: Pupils, motor, mental status
- **Diagnosis Types**: SAH, stroke, ICH, TBI, seizure, spine, tumor, other
- **Neuro Checklist**: ICP/CPP targets, seizure prophylaxis, DVT prophylaxis, etc.

### Smart Phrases
The app includes a template engine (`smartphraseEngine.ts`) that renders clinical templates (`smartphrases.ts`) based on diagnosis type.

## Testing

This project **does not use automated tests** at this time and **relies on thorough manual testing**, which is especially important because this is a Neuro ICU clinical application.

When making changes, you **must** manually test all affected areas of the app with a focus on clinical accuracy and bedside usability:
- Verify all clinical scores (e.g., GCS, NIHSS, Hunt & Hess, Fisher, mRS) against published reference values and edge-case examples
- Confirm SmartPhrase generation produces clinically accurate, well-formatted text for each relevant diagnosis type
- Ensure patient data persists correctly in `localStorage` across reloads and basic navigation flows
- Exercise key rounding workflows end-to-end (adding patients, updating exams/scores, generating notes)
- Check the UI on tablet and desktop form factors to ensure it is usable at the bedside
- Inspect the browser console for errors or warnings

More detailed guidance on manual and clinical testing expectations is available in this repository’s documentation and custom instructions (see the `custom-instructions` directory and docs under `docs/`).
## Deployment

### GitHub Pages
The repository uses GitHub Actions for automated deployment:
- Workflow: `.github/workflows/deploy.yml`
- Triggered on push to `main` or manual workflow dispatch
- Build uses `VITE_BASE_PATH=/neuroicu-rounds/` for proper asset URLs
- Deploys to GitHub Pages (URL available in Settings → Pages)

### Configuration
`vite.config.ts` reads from `VITE_BASE_PATH` environment variable:
- Local dev: defaults to "/"
- GitHub Pages: set to `/neuroicu-rounds/`

## Important Notes for AI Coding Agents

### Making Changes
1. Always maintain TypeScript strict mode compliance
2. Preserve existing clinical logic and medical terminology
3. Test changes locally with `npm run dev` before committing
4. Ensure build succeeds with `npm run build`
5. Do not modify the deployment workflow unless specifically requested

### Adding Dependencies
- Use `npm install <package>` to add dependencies
- Update `package.json` appropriately
- Prefer well-maintained packages with TypeScript support
- Consider bundle size impact (this is a frontend application)

### Medical Domain Knowledge
- This is a medical application for neurological ICU care
- Preserve clinical accuracy and medical terminology
- Clinical scores (GCS, NIHSS, mRS, etc.) have specific medical meanings - do not alter their definitions
- When in doubt about medical logic, ask for clarification

### Common Tasks
- **Adding new diagnosis types**: Update `DiagnosisType` in `types.ts`, add to `DIAGNOSIS_TYPE_LABELS` and `DIAGNOSIS_TEMPLATE_MAP`
- **Adding clinical scores**: Extend `ClinicalScores.tsx` component
- **Modifying templates**: Update `smartphrases.ts` and ensure compatibility with `smartphraseEngine.ts`
- **UI changes**: Modify `RoundingApp.tsx` and maintain responsive design

## Best Practices for Working on Issues

1. **Scope**: Focus on the specific issue at hand; avoid unrelated refactoring
2. **Testing**: Test changes locally before pushing
3. **Documentation**: Update README.md if adding new features or changing setup
4. **Breaking Changes**: Avoid breaking changes to existing functionality unless explicitly requested
5. **Incremental Changes**: Make small, focused commits rather than large rewrites
