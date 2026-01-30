# Customization Guide

This guide explains how to customize the Neuro ICU Rounding App for your institution's specific workflows and preferences.

## 📝 Customizing SmartPhrase Templates

### Modifying Existing Templates

Templates are defined in `src/smartphrases.ts`. To modify a template:

1. Open `src/smartphrases.ts`
2. Find the template by its `id` or `label`
3. Edit the `body` field with your preferred format

**Example**: Customize the daily neuro ICU note

```typescript
{
  id: "neuroicu-daily",
  label: ".NEUROICU_DAILY",
  service: "NeuroICU",
  body: `
*** NEURO ICU PROGRESS NOTE ***
Date: @TODAY@
Patient: @NAME@ @ROOM@
Attending: [Your attending name here]  // Added custom field

// ... rest of template
  `.trim(),
}
```

### Adding New Templates

Add your custom template to the `TEMPLATES` array:

```typescript
export const TEMPLATES: SmartPhraseTemplate[] = [
  // ... existing templates
  {
    id: "my-custom-template",
    label: ".MY_CUSTOM_TEMPLATE",
    service: "NeuroICU",
    body: `
*** CUSTOM TEMPLATE TITLE ***
Date: @TODAY@
Patient: @NAME@ (@ROOM@)

[Your custom content here]

Available tokens:
- Patient: @NAME@, @ROOM@, @DIAGNOSIS@, @ONELINER@
- Vitals: @MAP@, @HR@, @SPO2@, @TEMP@, @VENT@
- Neuro: @GCS@, @PUPILS@, @MOTOR@, @ICP@, @CPP@
- Data: @LABS@, @IMAGING@, @DRIPS@, @LINES@
- Plan: @AP@, @TASKS@, @CHECKLIST@
    `.trim(),
  },
];
```

### Available Template Tokens

All available tokens are defined in `src/smartphraseEngine.ts`:

| Category | Tokens | Description |
|----------|--------|-------------|
| **Date/Time** | `@TODAY@` | Current date in YYYY-MM-DD format |
| **Patient Info** | `@NAME@`, `@ROOM@`, `@DIAGNOSIS@`, `@DAY_OF_ADMIT@`, `@ONELINER@` | Basic patient demographics |
| **Neuro Exam** | `@GCS@`, `@GCS_E@`, `@GCS_V@`, `@GCS_M@` | Glasgow Coma Scale components |
| | `@PUPILS@`, `@CN@`, `@MOTOR@` | Detailed neuro exam findings |
| | `@SEDATION@`, `@SEIZURES@` | Mental status and seizure activity |
| | `@ICP@`, `@CPP@`, `@EVD@`, `@ICP_CPP@` | Intracranial pressure monitoring |
| **Vitals** | `@MAP@`, `@HR@`, `@SPO2@`, `@TEMP@`, `@RR@` | Basic vital signs |
| | `@FIO2@`, `@PEEP@`, `@VENT@` | Ventilator settings |
| **Support** | `@DRIPS@`, `@LINES@` | Medications and lines/tubes |
| **Data** | `@LABS@`, `@IMAGING@` | Lab results and imaging findings |
| **Plan** | `@AP@`, `@TASKS@`, `@CHECKLIST@`, `@GOALS@` | Assessment, plan, and tasks |

### Creating Institution-Specific Templates

**Example**: Add your hospital's specific headers and footers

```typescript
{
  id: "my-hospital-neuroicu",
  label: ".MYHOSPITAL_NEUROICU",
  service: "NeuroICU",
  body: `
╔════════════════════════════════════════════╗
║   MY HOSPITAL NAME - Neuro ICU             ║
║   Department of Neurology/Neurosurgery     ║
╚════════════════════════════════════════════╝

Date: @TODAY@
Patient: @NAME@ | Room: @ROOM@ | @DAY_OF_ADMIT@
Attending: [Attending name]
Resident: [Resident name]

PRIMARY DIAGNOSIS: @DIAGNOSIS@
One-liner: @ONELINER@

NEURO EXAMINATION:
────────────────────
GCS: @GCS@ (E@GCS_E@ V@GCS_V@ M@GCS_M@)
Pupils: @PUPILS@
Motor: @MOTOR@
@ICP_CPP@

VITAL SIGNS & SUPPORT:
────────────────────
MAP: @MAP@ | HR: @HR@ | SpO2: @SPO2@ | Temp: @TEMP@
Ventilator: @VENT@
Pressors/Drips: @DRIPS@
Lines/Access: @LINES@

LABS & IMAGING:
────────────────────
@LABS@

@IMAGING@

CHECKLIST:
────────────────────
@CHECKLIST@

ASSESSMENT & PLAN:
────────────────────
@AP@

TODAY'S TASKS:
────────────────────
@TASKS@

═══════════════════════════════════════════
Electronically signed: [Your name], MD
  `.trim(),
}
```

## 🎯 Customizing Clinical Checklists

### Modifying the Default Checklist

The default checklist is defined in `src/RoundingApp.tsx`:

```typescript
const NEURO_CHECKLIST = [
  "Neuro exam documented",
  "ICP/CPP target",
  "Seizure prophylaxis",
  "DVT prophylaxis",
  "GI prophylaxis",
  "HOB >30°",
  "Glucose target 80-180",
  "Normothermia",
  "Sodium target",
  "Blood pressure goal",
  "Lines/EVD reviewed",
  "Family update",
] as const;
```

To customize, edit this array with your institution's preferred checklist items:

```typescript
const NEURO_CHECKLIST = [
  "Neuro exam Q1H documented",
  "ICP <20 / CPP >60",
  "Seizure prophylaxis (Keppra 1000mg BID)",
  "DVT prophylaxis (if no bleeding)",
  "PPI for stress ulcer prophylaxis",
  "HOB 30-45 degrees",
  "Blood glucose 140-180 mg/dL",
  "Temperature <38°C",
  "Sodium 145-155 mEq/L (if edema)",
  "MAP goal documented",
  "Sedation vacation attempted",
  "EVD level verified",
  "Family meeting completed",
  "PT/OT consulted",
] as const;
```

### Diagnosis-Specific Checklists

You can add diagnosis-specific checklist items in the `DIAGNOSIS_DEFAULTS` object:

```typescript
const DIAGNOSIS_DEFAULTS: Partial<Record<DiagnosisType, DiagnosisPrefill>> = {
  sah: {
    // ... other fields
    checklistTrue: [
      "HOB >30°",
      "Neuro exam documented",
      "Nimodipine 60mg q4h given",  // Add custom item
      "TCD completed",               // Add custom item
    ],
  },
  // ... other diagnoses
};
```

## 🧮 Adding Custom Clinical Scores

### Step 1: Define the Score Type

Add your score type to `src/types.ts`:

```typescript
export type MyCustomScore = {
  parameter1?: number;
  parameter2?: string;
  calculatedValue?: number;
  riskCategory?: "low" | "moderate" | "high";
};
```

### Step 2: Add to ClinicalScores Type

```typescript
export type ClinicalScores = {
  sah?: SAHScores;
  stroke?: StrokeScores;
  // ... existing scores
  myCustomScore?: MyCustomScore;  // Add your score
};
```

### Step 3: Create Calculator Component

Add your calculator in `src/ClinicalScores.tsx`:

```typescript
function MyCustomScoreCalculator({ 
  value, 
  onChange 
}: { 
  value?: MyCustomScore; 
  onChange: (v: MyCustomScore) => void;
}) {
  const [score, setScore] = useState(value || {});

  const calculate = () => {
    // Your calculation logic
    const result = (score.parameter1 || 0) * 2;
    const risk = result > 10 ? "high" : result > 5 ? "moderate" : "low";
    
    setScore({
      ...score,
      calculatedValue: result,
      riskCategory: risk,
    });
    onChange({ ...score, calculatedValue: result, riskCategory: risk });
  };

  return (
    <div style={{ padding: "1rem", background: "#f8fafc", borderRadius: "8px" }}>
      <h3>My Custom Score Calculator</h3>
      <p style={{ fontSize: "0.9rem", color: "#64748b" }}>
        Brief description and reference citation
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <label>
          Parameter 1:
          <input
            type="number"
            value={score.parameter1 || ""}
            onChange={(e) => setScore({ ...score, parameter1: Number(e.target.value) })}
          />
        </label>

        <button onClick={calculate}>Calculate</button>

        {score.calculatedValue !== undefined && (
          <div style={{ 
            padding: "1rem", 
            background: score.riskCategory === "high" ? "#fee" : "#efe",
            borderRadius: "4px" 
          }}>
            <strong>Result:</strong> {score.calculatedValue}
            <br />
            <strong>Risk:</strong> {score.riskCategory}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Step 4: Integrate into ClinicalScores Component

Add your calculator to the appropriate diagnosis section:

```typescript
export default function ClinicalScores({ sheet, updateSheet }: ClinicalScoresProps) {
  const diagnosisType = sheet.diagnosisType;

  // ... existing code

  if (diagnosisType === "mydiagnosis") {
    return (
      <div>
        <MyCustomScoreCalculator
          value={sheet.clinicalScores?.myCustomScore}
          onChange={(v) => updateSheet({
            clinicalScores: { ...sheet.clinicalScores, myCustomScore: v }
          })}
        />
      </div>
    );
  }

  // ... rest of component
}
```

## 🏥 Adding New Diagnosis Types

### Step 1: Add Diagnosis Type

In `src/types.ts`:

```typescript
export type DiagnosisType = 
  | "sah" 
  | "stroke" 
  | "ich" 
  | "tbi" 
  | "seizure" 
  | "spine" 
  | "tumor" 
  | "mydiagnosis"  // Add your diagnosis
  | "other";
```

### Step 2: Add Label

In `src/RoundingApp.tsx`:

```typescript
const DIAGNOSIS_TYPE_LABELS: Record<DiagnosisType, string> = {
  // ... existing labels
  mydiagnosis: "My Custom Diagnosis",
};
```

### Step 3: Map to Template

```typescript
const DIAGNOSIS_TEMPLATE_MAP: Partial<Record<DiagnosisType, string>> = {
  // ... existing mappings
  mydiagnosis: "my-custom-template",
};
```

### Step 4: Add Diagnosis Defaults (Optional)

```typescript
const DIAGNOSIS_DEFAULTS: Partial<Record<DiagnosisType, DiagnosisPrefill>> = {
  // ... existing defaults
  mydiagnosis: {
    oneLiner: "Custom diagnosis {{HD}}, specific management",
    problemTemplates: [
      {
        title: "Problem 1",
        assessment: "Assessment template",
        plan: "Plan template",
      },
    ],
    taskTemplates: ["Task 1", "Task 2"],
    drips: "Common drips for this diagnosis",
    linesTubes: "Common lines/tubes",
    checklistTrue: ["Common checklist items"],
  },
};
```

## 🎨 Customizing UI Styles

### Modifying Component Styles

All styles are inline in the components. To customize:

**Example**: Change the color scheme

```typescript
// In RoundingApp.tsx or ClinicalScores.tsx
<div style={{
  background: "#your-color",  // Change background
  color: "#your-text-color",   // Change text color
  border: "1px solid #your-border-color",
  borderRadius: "8px",
  padding: "1rem",
}}>
  {/* Component content */}
</div>
```

### Global Styles

Modify `index.html` for global styling:

```html
<style>
  /* Change primary color */
  ::selection {
    background: #10b981;  /* Your brand color */
    color: white;
  }
  
  :focus-visible {
    outline: 2px solid #10b981;  /* Match your color */
    outline-offset: 2px;
  }
  
  /* Change scrollbar colors */
  ::-webkit-scrollbar-thumb {
    background: #10b981;
  }
</style>
```

## 📊 Customizing Data Fields

### Adding Custom Patient Fields

Modify the `RoundingSheet` type in `src/types.ts`:

```typescript
export type RoundingSheet = {
  // ... existing fields
  
  // Add custom fields
  mrn?: string;              // Medical record number
  attendingPhysician?: string;
  consultServices?: string[];
  customField1?: string;
  customField2?: number;
};
```

Then add input fields in the appropriate component.

### Adding Custom Vitals

Extend the `vitals` object type:

```typescript
export type RoundingSheet = {
  // ... existing fields
  vitals: { 
    map?: number; 
    hr?: number; 
    // ... existing vitals
    
    // Add custom vitals
    cvp?: number;      // Central venous pressure
    svr?: number;      // Systemic vascular resistance
    co?: number;       // Cardiac output
  };
};
```

## 🔧 Advanced Customization

### Adding Custom Token Types

To add new tokens to the SmartPhrase engine:

1. Add to `TOKEN_KEYS` in `src/smartphraseEngine.ts`:

```typescript
const TOKEN_KEYS = [
  // ... existing tokens
  "@MY_CUSTOM_TOKEN@",
];
```

2. Add to the `tokens` object in `renderSmartPhrase`:

```typescript
const tokens: Record<string, string> = {
  // ... existing tokens
  "@MY_CUSTOM_TOKEN@": sheet.customField1 || "default value",
};
```

### Custom Formatters

Add custom formatting functions:

```typescript
function formatMyCustomData(sheet: RoundingSheet): string {
  // Your custom formatting logic
  return `Custom format: ${sheet.customField1}`;
}

// Use in tokens
const tokens: Record<string, string> = {
  "@MY_FORMATTED_DATA@": formatMyCustomData(sheet),
};
```

## 🚀 Deployment Customization

### Custom Base Path

For GitHub Pages with a custom organization name:

```yaml
# .github/workflows/deploy.yml
- name: Build site
  run: npm run build
  env:
    VITE_BASE_PATH: /your-repo-name/
```

### Custom Domain

See [GitHub Pages custom domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## 📚 Examples

### Complete Example: Adding "Myocardial Infarction" Diagnosis

```typescript
// 1. In types.ts
export type DiagnosisType = "sah" | "stroke" | "mi" | /* ... */;

export type MIScores = {
  troponinLevel?: number;
  timi?: number;
  grace?: number;
};

export type ClinicalScores = {
  // ... existing
  mi?: MIScores;
};

// 2. In RoundingApp.tsx
const DIAGNOSIS_TYPE_LABELS = {
  // ... existing
  mi: "Myocardial Infarction (STEMI/NSTEMI)",
};

const DIAGNOSIS_TEMPLATE_MAP = {
  // ... existing
  mi: "cvicu-mi",
};

// 3. In smartphrases.ts
{
  id: "cvicu-mi",
  label: ".CVICU_MI",
  body: `
*** MYOCARDIAL INFARCTION NOTE ***
Date: @TODAY@
Patient: @NAME@ @ROOM@

MI Type: [STEMI/NSTEMI]
Peak Troponin: ___
Time to PCI: ___

Current Status:
- Chest pain: ___
- Hemodynamics: MAP @MAP@, HR @HR@

Cath results: ___

Assessment & Plan:
@AP@
  `.trim(),
}
```

## 💡 Tips for Customization

1. **Test thoroughly**: After customization, test all features
2. **Keep backups**: Commit your changes to version control
3. **Document changes**: Add comments explaining custom logic
4. **Stay organized**: Group related customizations together
5. **Consider forking**: For heavy customization, fork the repository

## ❓ Need Help?

- Check existing issues on GitHub
- Open a new issue with the `question` label
- Review the ARCHITECTURE.md for technical details
