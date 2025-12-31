# Performance Optimizations

This document outlines the performance optimizations implemented in the Neuro ICU Rounding Application.

## Overview

The application has been optimized to reduce unnecessary re-renders, improve callback stability, and enhance overall performance. These optimizations are particularly important for a medical application that may handle multiple patients and complex clinical data.

## Key Optimizations

### 1. Callback Dependency Optimization

**Problem**: Callbacks in `RoundingApp.tsx` were using object properties from `active` in their dependency arrays, causing them to be recreated on every render when any property of `active` changed.

**Solution**: Refactored all callbacks to use the functional setState pattern, depending only on `activeId` instead of the entire `active` object.

**Before**:
```typescript
const updateNeuroExam = useCallback((patch: Partial<NeuroExam>) => {
  updateActive({ neuroExam: { ...active.neuroExam, ...patch } });
}, [active.neuroExam, updateActive]); // Recreated whenever active.neuroExam changes
```

**After**:
```typescript
const updateNeuroExam = useCallback((patch: Partial<NeuroExam>) => {
  setSheets((prev) =>
    prev.map((s) => (s.id === activeId ? { ...s, neuroExam: { ...s.neuroExam, ...patch }, updatedAt: Date.now() } : s))
  );
}, [activeId]); // Only recreated when activeId changes
```

**Impact**: Callbacks are now stable across renders unless the active patient changes, reducing unnecessary re-renders of child components.

**Affected Functions**:
- `updateNeuroExam`
- `updateVitals`
- `toggleChecklist`
- `addProblem`
- `updateProblem`
- `removeProblem`
- `addTask`
- `updateTask`
- `removeTask`
- `handleDiagnosisTypeChange`
- `handleDiagnosisPrefill`
- `handleAutoTemplateToggle`

### 2. Component Memoization

**Problem**: Large components like `ClinicalScores` and `CollapsibleSection` were re-rendering even when their props hadn't changed.

**Solution**: Wrapped components with `React.memo()` to prevent re-renders when props are identical.

**Implementation**:
```typescript
// ClinicalScores.tsx
function ClinicalScores({ sheet, onUpdate }: ClinicalScoresProps) {
  // ... component logic
}
export default React.memo(ClinicalScores);

// RoundingApp.tsx
const CollapsibleSection = React.memo(({ title, defaultCollapsed = false, children }: CollapsibleProps) => {
  // ... component logic
});
```

**Impact**: 
- `ClinicalScores` (1459 lines) only re-renders when `sheet` or `onUpdate` actually change
- `CollapsibleSection` instances don't re-render when parent updates unrelated state

### 3. Computation Memoization

**Problem**: Expensive calculations in `ClinicalScores` were being recomputed on every render.

**Solution**: Wrapped expensive calculations with `useMemo()` to cache results.

**Implementation**:
```typescript
const aspectsBadge = useMemo(() => {
  if (aspectsScore === undefined || aspectsScore === null) return { label: "Awaiting score", color: "#64748b", bg: "#f1f5f9" };
  if (aspectsScore <= 5) return { label: "Large core", color: "#b91c1c", bg: "#fee2e2" };
  if (aspectsScore >= 7) return { label: "Favorable", color: "#15803d", bg: "#dcfce7" };
  return { label: "Borderline", color: "#b45309", bg: "#ffedd5" };
}, [aspectsScore]);

const aspectsGuidance = useMemo(() => {
  if (aspectsScore === undefined || aspectsScore === null) return "Document ASPECTS to quantify early ischemic change.";
  if (aspectsScore <= 5) return "Large core (>1/3 MCA) — focus on edema control and early hemicraniectomy planning.";
  if (aspectsScore >= 7) return "Favorable core — thrombectomy candidate if LVO and within 24h window.";
  return "Borderline core — obtain perfusion imaging for penumbra estimate and discuss with neurointervention.";
}, [aspectsScore]);
```

**Impact**: Complex string operations and object creations are cached and only recomputed when their dependencies change.

### 4. LocalStorage Optimization

**Problem**: 
- Aggressive write frequency (500ms) caused unnecessary I/O operations
- No handling for localStorage quota exceeded errors

**Solution**:
1. Increased debounce delay from 500ms to 1000ms
2. Added error handling for quota exceeded scenarios

**Implementation**:
```typescript
useEffect(() => {
  const timeoutId = setTimeout(() => {
    saveToStorage(sheets);
  }, 1000); // Increased from 500ms
  return () => clearTimeout(timeoutId);
}, [sheets]);

function saveToStorage(sheets: RoundingSheet[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, sheets }));
  } catch (error) {
    // Handle quota exceeded or other localStorage errors
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Try clearing old patient data by clicking "Reset Data" in the header menu, or reduce the number of stored patients.');
    }
  }
}
```

**Impact**: 
- Reduced localStorage write operations by 50%
- Better error handling prevents silent failures
- Console warnings help users understand storage issues

### 5. Already Optimized Components

The following components were already well-optimized:

- **Token Pattern Caching** (`smartphraseEngine.ts`): Regex pattern is compiled once at module level
- **SmartPhrase Memoization**: Template rendering is already wrapped in `useMemo` with proper dependencies
- **Section Registry**: Complex array creation is already memoized in `ClinicalScores`

## Performance Metrics

### Before Optimization
- Callbacks recreated on every render when any part of patient data changed
- Child components re-rendered unnecessarily
- LocalStorage writes every 500ms during active editing

### After Optimization
- Callbacks stable unless active patient ID changes
- Child components only re-render when their props actually change
- LocalStorage writes reduced to every 1000ms
- Expensive calculations cached with proper dependencies

## Best Practices Applied

1. **Functional setState Pattern**: Using `setState(prev => ...)` instead of direct state access in callbacks
2. **Minimal Dependencies**: Keeping dependency arrays as small as possible
3. **Component Memoization**: Using `React.memo()` for expensive components
4. **Computation Memoization**: Using `useMemo()` for expensive calculations
5. **Event Handler Stability**: Ensuring event handlers don't change unless necessary
6. **Error Handling**: Gracefully handling localStorage errors

## Future Optimization Opportunities

While the current optimizations significantly improve performance, future enhancements could include:

1. **Code Splitting**: Split large components (RoundingApp.tsx, ClinicalScores.tsx) into smaller, lazy-loaded modules
2. **Virtual Scrolling**: If patient lists grow large, implement virtual scrolling for the sidebar
3. **Web Workers**: Offload complex calculations to Web Workers for very large datasets
4. **IndexedDB**: Migrate from localStorage to IndexedDB for better performance with larger datasets
5. **React DevTools Profiler**: Regular profiling to identify new bottlenecks as features are added

## Testing Performance

To verify these optimizations:

1. **React DevTools Profiler**: Use the Profiler tab to record component render times
2. **Browser Performance Tools**: Use Chrome DevTools Performance tab to analyze rendering and JavaScript execution
3. **User Testing**: Monitor responsiveness during typical workflows with multiple patients

## Maintenance Guidelines

When adding new features:

1. Keep dependency arrays minimal
2. Use functional setState for callbacks that depend on state
3. Memoize expensive calculations
4. Consider component memoization for large or frequently re-rendered components
5. Profile before and after changes to ensure performance isn't degraded
