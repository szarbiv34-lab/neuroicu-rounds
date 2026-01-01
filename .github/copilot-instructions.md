# GitHub Copilot Instructions for Neuro ICU Rounding App

## Repository Overview

This is a comprehensive neurological intensive care unit (Neuro ICU) rounding application built with React + Vite. The application streamlines bedside workflows by providing structured patient rounding sheets, clinical scoring systems, and SmartPhrase templates for generating medical documentation.

**Key Features:**
- Structured rounding sheets for organizing patient information
- Clinical scoring systems (Hunt & Hess, Modified Fisher, ICH Score, NIHSS, GCS, etc.)
- SmartPhrase templates for medical note generation
- Clinical checklists and task tracking
- Local storage for patient data persistence
- Responsive design for tablets and mobile devices

## Technology Stack

- **Frontend**: React 18.3 with TypeScript 5.9
- **Build Tool**: Vite 6.0
- **Styling**: Inline CSS-in-JS (no CSS framework)
- **State Management**: React hooks (useState, useEffect)
- **Data Persistence**: Browser localStorage
- **Deployment**: GitHub Pages via GitHub Actions

## Code Style and Conventions

### TypeScript
- Use TypeScript for all code files
- Define explicit types for function parameters and return values
- Use existing types from `src/types.ts` when possible
- Export types that might be reused across components

### Naming Conventions
- **Components**: PascalCase (e.g., `ClinicalScores`, `RoundingApp`)
- **Functions**: camelCase (e.g., `calculateICHScore`, `renderSmartPhrase`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `HUNT_HESS_DESCRIPTIONS`, `DEFAULT_TEMPLATE_ID`)
- **Types/Interfaces**: PascalCase (e.g., `RoundingSheet`, `SAHScores`)

### React Components
- Use functional components with hooks
- Keep components focused and single-purpose
- Use controlled component pattern for forms
- Extract reusable logic into custom hooks when appropriate

### Comments
- Add JSDoc comments for exported functions
- Explain "why" not "what" in inline comments
- Document medical calculations with clinical references
- Include citations for clinical scoring systems

## Project Structure

```
src/
├── main.tsx              # Application entry point
├── RoundingApp.tsx       # Main application component with patient management
├── ClinicalScores.tsx    # Clinical scoring calculators
├── types.ts              # TypeScript type definitions
├── smartphrases.ts       # SmartPhrase template library
└── smartphraseEngine.ts  # Template rendering engine

.github/
└── workflows/
    ├── deploy.yml        # GitHub Pages deployment
    └── run-example.yml   # CI test workflow
```

## Key Patterns

### State Management
- Patient data stored in a `Map<Id, RoundingSheet>`
- Active patient selected via `activePatientId`
- Updates use immutable patterns with spread operators
- Automatic localStorage sync via useEffect

### Form Pattern
All forms use controlled components:
```typescript
<input
  type="text"
  value={patientName}
  onChange={(e) => updatePatient({ patientName: e.target.value })}
/>
```

### Clinical Calculator Pattern
Each calculator is self-contained with this interface:
```typescript
interface ScoreProps<T> {
  value?: T;
  onChange: (value: T) => void;
}
```

### SmartPhrase Templates
- Templates use token-based placeholders (e.g., `@NAME@`, `@GCS@`, `@TODAY@`)
- Tokens are replaced by the engine in `smartphraseEngine.ts`
- Templates are diagnosis-specific and organized in `smartphrases.ts`

## Development Workflow

### Building the Project
```bash
npm run build  # Runs TypeScript compiler + Vite build
```

### Running Development Server
```bash
npm run dev  # Starts Vite dev server with HMR
```

### No Automated Tests
This project currently relies on manual testing. When making changes:
- Test all affected features in the UI
- Verify data persists correctly in localStorage
- Check SmartPhrase templates render correctly
- Test on both desktop and mobile viewports
- Verify clinical calculations against reference values
- Ensure no console errors in browser DevTools

## Clinical Content Guidelines

### Medical Accuracy
- **Critical**: All clinical scores and calculations must be accurate
- Cross-reference against published medical literature
- Include citations in code comments for all scoring systems
- Test edge cases and validate against known reference values

### Adding Clinical Scores
1. Add type definition to `src/types.ts`
2. Add to `ClinicalScores` type union
3. Implement calculator component in `src/ClinicalScores.tsx`
4. Include medical references and citations
5. Test calculations against published examples

### Adding SmartPhrase Templates
1. Add template to `TEMPLATES` array in `src/smartphrases.ts`
2. Use existing tokens or add new ones in `smartphraseEngine.ts`
3. Follow medical note formatting conventions
4. Test template rendering with sample data

## Important Considerations

### Security and Privacy
- This is a healthcare application - accuracy and safety are paramount
- Patient data stays in browser (no server-side storage)
- Users should NOT enter real patient identifiers (PHI considerations)
- No user-generated HTML to prevent XSS attacks

### Performance
- Small bundle size is important for bedside use
- Avoid unnecessary dependencies
- Consider localStorage limits (~5-10MB per origin)
- Target ~50-100 patients with full data capacity

### Browser Compatibility
- Target modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Internet Explorer is not supported

## Common Tasks

### Adding a New Diagnosis Type
1. Update `DiagnosisType` union in `src/types.ts`
2. Add label to `DIAGNOSIS_TYPE_LABELS` in `RoundingApp.tsx`
3. (Optional) Add template mapping in `DIAGNOSIS_TEMPLATE_MAP`
4. (Optional) Add diagnosis defaults in `DIAGNOSIS_DEFAULTS`

### Modifying the UI
- Use inline styles for component-scoped styling
- Follow existing color scheme and layout patterns
- Ensure responsive design works on tablets and mobile
- Test with actual medical workflow scenarios

### Debugging
- Check browser console for errors
- Verify localStorage data with DevTools
- Test SmartPhrase token replacement
- Validate TypeScript types with `npm run build`

## Dependencies Philosophy

- **Minimal dependencies**: Reduces bundle size and maintenance burden
- **Standard libraries**: Prefer platform APIs over npm packages
- **No UI frameworks**: Custom styling for maximum flexibility
- **TypeScript first**: Type safety over runtime validation

Only add new dependencies if absolutely necessary and they provide significant value.

## Documentation

Comprehensive documentation is available:
- **README.md**: Quick start and overview
- **CONTRIBUTING.md**: Contribution guidelines and code style
- **docs/ARCHITECTURE.md**: Technical architecture details
- **docs/USER_GUIDE.md**: Detailed usage instructions
- **docs/CUSTOMIZATION.md**: Customization guide
- **docs/QUICKSTART.md**: 5-minute quick start
- **docs/FAQ.md**: Frequently asked questions

## Key Reminders for Copilot

1. **Medical accuracy is critical** - always verify clinical calculations
2. **Type safety** - use TypeScript types from `types.ts`
3. **Minimal dependencies** - avoid adding new packages unless necessary
4. **Clinical references** - include citations for all medical content
5. **Test manually** - no automated tests, so manual testing is required
6. **Respect conventions** - follow existing patterns and naming conventions
7. **Privacy first** - never include real patient data or PHI
8. **Documentation** - update docs when adding features or changing behavior
