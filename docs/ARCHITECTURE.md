# Architecture Overview

This document describes the technical architecture and design decisions of the Neuro ICU Rounding App.

## 🏗️ Technology Stack

### Frontend Framework
- **React 18.3**: Modern UI library with hooks and functional components
- **TypeScript 5.9**: Static typing for better code quality and IDE support
- **Vite 6.0**: Fast build tool and development server

### Styling
- **Inline CSS-in-JS**: Component-scoped styles for maintainability
- **No CSS framework**: Lightweight custom styles for medical UI

### State Management
- **React useState/useEffect**: Local component state
- **Browser localStorage**: Persistent data storage
- **No global state library**: Simple architecture for single-user app

## 📦 Project Structure

```
src/
├── main.tsx                 # Application entry point and root rendering
├── RoundingApp.tsx          # Main app with patient management and UI tabs
├── ClinicalScores.tsx       # Clinical calculators and scoring components
├── types.ts                 # TypeScript type definitions
├── smartphrases.ts          # Template library with medical note formats
└── smartphraseEngine.ts     # Template rendering and token replacement
```

## 🔄 Data Flow

### Component Hierarchy

```
main.tsx
  └── RoundingApp
      ├── Patient selector dropdown
      ├── Patient info form (name, room, diagnosis)
      ├── Tab navigation (Scores, Exam, Data, Plan)
      ├── Tab content (conditional rendering)
      │   ├── ClinicalScores (when "Scores" tab active)
      │   ├── NeuroExam form (when "Exam" tab active)
      │   ├── Vitals/Labs/Imaging (when "Data" tab active)
      │   └── SmartPhrase output (when "Plan" tab active)
      └── Task/Problem lists
```

### State Management Pattern

```typescript
// Patient data is stored in a Map
const [patients, setPatients] = useState<Map<Id, RoundingSheet>>(new Map());
const [activePatientId, setActivePatientId] = useState<Id>(firstId);

// Derived state
const activePatient = patients.get(activePatientId);

// Update pattern
const updatePatient = (updates: Partial<RoundingSheet>) => {
  setPatients(prev => {
    const next = new Map(prev);
    const current = next.get(activePatientId);
    next.set(activePatientId, { ...current, ...updates });
    return next;
  });
};
```

### Data Persistence

```typescript
// Load from localStorage on mount
useEffect(() => {
  const stored = localStorage.getItem("neuroicu-patients");
  if (stored) {
    const data = JSON.parse(stored);
    setPatients(new Map(data));
  }
}, []);

// Save to localStorage on every change
useEffect(() => {
  localStorage.setItem(
    "neuroicu-patients",
    JSON.stringify(Array.from(patients.entries()))
  );
}, [patients]);
```

## 🎨 UI Architecture

### Tab-Based Navigation

The app uses a tab system with conditional rendering:

```typescript
type TabKey = "scores" | "exam" | "data" | "plan";
const [activeTab, setActiveTab] = useState<TabKey>("scores");

// Render only the active tab content
{activeTab === "scores" && <ClinicalScores {...props} />}
{activeTab === "exam" && <NeuroExamForm {...props} />}
{activeTab === "data" && <VitalsLabsForm {...props} />}
{activeTab === "plan" && <SmartPhraseOutput {...props} />}
```

### Form Pattern

All forms follow a controlled component pattern:

```typescript
<input
  type="text"
  value={patientName}
  onChange={(e) => updatePatient({ patientName: e.target.value })}
/>
```

## 🧮 Clinical Calculators Architecture

### Calculator Component Pattern

Each clinical calculator is a self-contained component:

```typescript
interface ScoreProps<T> {
  value?: T;
  onChange: (value: T) => void;
}

function MyScoreCalculator({ value, onChange }: ScoreProps<MyScore>) {
  const [localState, setLocalState] = useState(value || {});
  
  const handleChange = (field: string, val: any) => {
    const updated = { ...localState, [field]: val };
    setLocalState(updated);
    onChange(updated);
  };
  
  return (
    // Calculator UI
  );
}
```

### Diagnosis-Specific Calculators

The `ClinicalScores` component conditionally renders calculators based on diagnosis:

```typescript
if (diagnosisType === "sah") {
  return <SAHScoreCalculator />;
} else if (diagnosisType === "stroke") {
  return <StrokeScoreCalculator />;
}
// ... etc
```

## 📝 SmartPhrase Engine

### Template System

Templates use token-based placeholders:

```typescript
const template = {
  id: "neuroicu-daily",
  label: ".NEUROICU_DAILY",
  body: `
Date: @TODAY@
Patient: @NAME@ @ROOM@
GCS: @GCS@ (E@GCS_E@ V@GCS_V@ M@GCS_M@)
  `
};
```

### Token Replacement

The engine uses regex to replace all tokens in one pass:

```typescript
// Create regex from all token keys
const TOKEN_PATTERN = new RegExp(
  TOKEN_KEYS.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
  'g'
);

// Replace all tokens
let output = template.body;
output = output.replace(TOKEN_PATTERN, (match) => tokens[match] || match);
```

### Available Tokens

Tokens are organized by category:

- **Patient**: `@NAME@`, `@ROOM@`, `@DIAGNOSIS@`, `@DAY_OF_ADMIT@`
- **Neuro Exam**: `@GCS@`, `@PUPILS@`, `@MOTOR@`, `@ICP@`, `@CPP@`
- **Vitals**: `@MAP@`, `@HR@`, `@SPO2@`, `@TEMP@`, `@VENT@`
- **Data**: `@LABS@`, `@IMAGING@`, `@DRIPS@`, `@LINES@`
- **Plan**: `@AP@`, `@TASKS@`, `@CHECKLIST@`

## 💾 Data Models

### Core Types

```typescript
// Main patient data structure
type RoundingSheet = {
  id: Id;
  patientName: string;
  room?: string;
  dateISO: string;
  diagnosis?: string;
  diagnosisType?: DiagnosisType;
  dayOfAdmit?: number;
  oneLiner: string;
  neuroExam: NeuroExam;
  clinicalScores?: ClinicalScores;
  vitals: Vitals;
  linesTubes: string;
  drips: string;
  labs: string;
  imaging: string;
  checklist: Record<string, boolean>;
  problems: Problem[];
  tasks: Task[];
  notes?: string;
  updatedAt: number;
};
```

### Type Hierarchy

```
RoundingSheet (top-level patient data)
├── NeuroExam (GCS, pupils, motor, ICP)
├── ClinicalScores (diagnosis-specific scores)
│   ├── SAHScores
│   ├── StrokeScores
│   ├── ICHScores
│   ├── TBIScores
│   ├── SeizureScores
│   └── SpineScores
├── Vitals (MAP, HR, SpO2, vent settings)
├── Problem[] (assessment & plan by system)
└── Task[] (to-do items with priorities)
```

## 🚀 Build and Deployment

### Development Build

```sh
npm run dev
# Vite dev server with HMR
# Base path: "/"
# Source maps enabled
```

### Production Build

```sh
npm run build
# 1. TypeScript compilation (tsc)
# 2. Vite production build
# Output: dist/ directory
```

### GitHub Pages Deployment

```yaml
# .github/workflows/deploy.yml
- run: npm run build
  env:
    VITE_BASE_PATH: /neuroicu-rounds/
```

The `VITE_BASE_PATH` environment variable configures the base URL for assets.

## 🔐 Security Considerations

### No Server-Side Components

- All data stays in the browser
- No authentication/authorization needed
- No network requests (except static assets)

### Data Privacy

- Patient data stored in browser localStorage
- Data never leaves the user's device
- No analytics or tracking
- PHI considerations: Users should not enter real patient identifiers

### Input Validation

- TypeScript provides type safety
- No user-generated HTML (XSS protection)
- Controlled inputs prevent injection attacks

## 🎯 Performance Characteristics

### Render Performance

- **Small bundle size**: ~220KB JavaScript (gzipped: ~66KB)
- **Fast initial load**: Vite's optimized bundling
- **Instant navigation**: Client-side routing with tab state

### Memory Usage

- **localStorage limit**: Typically 5-10MB per origin
- **Estimated capacity**: ~50-100 patients with full data
- **No memory leaks**: React's cleanup in useEffect

### Optimization Opportunities

1. **Virtual scrolling** for large patient lists
2. **Code splitting** by diagnosis type
3. **Web Workers** for heavy calculations
4. **IndexedDB** for larger data storage

## 🧩 Extension Points

### Adding New Features

1. **New clinical score**: Add type to `types.ts`, component to `ClinicalScores.tsx`
2. **New template**: Add to `TEMPLATES` array in `smartphrases.ts`
3. **New token**: Add to `renderSmartPhrase` in `smartphraseEngine.ts`
4. **New diagnosis**: Add to `DiagnosisType` union and related maps

### Customization Examples

```typescript
// Add a custom checkbox to the checklist
const CUSTOM_CHECKLIST = [
  ...NEURO_CHECKLIST,
  "Custom item 1",
  "Custom item 2"
];

// Add a custom diagnosis with template
const DIAGNOSIS_TEMPLATE_MAP = {
  ...existingMap,
  "mydiagnosis": "my-template-id"
};
```

## 📚 Dependencies

### Production Dependencies

- `react`: UI library
- `react-dom`: React rendering

### Development Dependencies

- `typescript`: Type checking
- `vite`: Build tool
- `@vitejs/plugin-react`: React integration
- `@types/*`: TypeScript definitions

### Dependency Philosophy

- **Minimal dependencies**: Reduces bundle size and maintenance
- **Standard libraries**: Prefer platform APIs over npm packages
- **No UI frameworks**: Custom styling for flexibility
- **TypeScript first**: Type safety over runtime validation

## 🔄 Future Architecture Considerations

### Potential Improvements

1. **State management library**: Consider Zustand or Jotai if state becomes complex
2. **Form library**: React Hook Form for complex forms
3. **Testing framework**: Vitest + React Testing Library
4. **Backend integration**: Optional server sync for team use
5. **Mobile app**: React Native or PWA packaging

### Backwards Compatibility

- localStorage schema versioning
- Migration utilities for data format changes
- Export/import functionality for data portability

## 📖 References

- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
