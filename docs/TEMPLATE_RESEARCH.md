# Research: Existing Template Formats Used in Similar Apps

**Last Updated:** January 15, 2026  
**Related Issue:** [#22 - Customizable Rounding Templates](https://github.com/szarbiv34-lab/neuroicu-rounds/issues/22)  
**Purpose:** Inform the design of customizable rounding templates for the Neuro ICU Rounding App

---

## Executive Summary

This document summarizes template formats and customization approaches used in major EMR/EHR systems and clinical rounding applications. The research identifies three primary template paradigms: **structured forms** (Epic, Cerner), **macro-based templates** (SmartPhrases, dot phrases), and **configurable workflows** (mobile rounding apps). Key findings suggest that successful clinical templates balance standardization with flexibility, support both touch and keyboard input, and provide real-time validation and clinical decision support.

**Key Recommendations:**
1. Support hybrid template format combining structured data capture with free-text flexibility
2. Implement JSON-based template configuration for easy sharing and customization
3. Provide both UI-based template editor and direct JSON editing for advanced users
4. Include field validation, conditional logic, and calculated fields
5. Enable template versioning and sharing across institutions

---

## 1. Major EMR/EHR Systems

### 1.1 Epic Systems

**Template Approach:** Epic uses "SmartPhrases" (.phrases) and "SmartLists" for templated documentation.

#### Template Structure
- **SmartPhrases**: Macro-based text expansion with embedded logic
  ```
  .NEUROEXAM
  *** Neurological Examination ***
  Mental Status: @MENTAL_STATUS@
  CN II-XII: @CRANIAL_NERVES@
  Motor: @MOTOR_EXAM@
  Sensory: @SENSORY_EXAM@
  Reflexes: @REFLEXES@
  Coordination: @COORDINATION@
  Gait: @GAIT@
  ```

- **SmartLists**: Drop-down menus for standardized data entry
  ```xml
  <SmartList id="GCS_Eye">
    <option value="4">Spontaneous (4)</option>
    <option value="3">To voice (3)</option>
    <option value="2">To pain (2)</option>
    <option value="1">None (1)</option>
  </SmartList>
  ```

- **SmartLinks**: Dynamic data insertion from EHR
  ```
  @LAST_BP@ → Inserts most recent blood pressure
  @CREATININE@ → Inserts latest creatinine value
  ```

#### Field Types Supported
- **Text fields**: Single-line and multi-line free text
- **Drop-down menus**: Predefined option lists (SmartLists)
- **Checkboxes**: Binary yes/no, multiple selection
- **Radio buttons**: Single selection from options
- **Date/time pickers**: Standardized date entry
- **Numeric fields**: With unit specification and range validation
- **Calculated fields**: Auto-calculation based on other fields (e.g., BMI, GCS total)
- **SmartLinks**: Dynamic data from patient chart

#### Customization Mechanisms
- **Epic App Orchard**: Centralized template sharing marketplace
- **Template Builder UI**: Drag-and-drop interface for non-technical users
- **XML Export/Import**: For advanced customization and bulk editing
- **Version control**: Built-in template versioning with rollback capability
- **Permission levels**: Department-level, specialty-level, individual user templates

#### Best Practices Observed
- **Autocomplete support**: SmartPhrases trigger with `.` prefix
- **Context awareness**: Templates suggest relevant options based on diagnosis
- **Required field indicators**: Visual cues for mandatory documentation
- **Default values**: Pre-populated with standard values to reduce clicks
- **Smart formatting**: Automatic capitalization, spacing, and punctuation

---

### 1.2 Cerner (Oracle Health)

**Template Approach:** "PowerForms" and "PowerPlans" for structured data collection and workflow automation.

#### Template Structure
- **PowerForms**: Structured forms with conditional logic
  ```json
  {
    "form_name": "Neuro ICU Daily Rounding",
    "sections": [
      {
        "title": "Neurological Assessment",
        "fields": [
          {
            "id": "gcs_total",
            "label": "Glasgow Coma Scale",
            "type": "calculated",
            "formula": "gcs_eye + gcs_verbal + gcs_motor",
            "display": "GCS: {value}/15"
          },
          {
            "id": "pupil_size_left",
            "label": "Left Pupil Size (mm)",
            "type": "dropdown",
            "options": [1, 2, 3, 4, 5, 6, 7, 8],
            "validation": {
              "warning_if": "> 6",
              "warning_message": "Dilated pupil - consider increased ICP"
            }
          }
        ]
      }
    ]
  }
  ```

- **PowerPlans**: Order sets integrated with documentation templates
  - Link clinical documentation to corresponding orders
  - Automated care bundle tracking
  - Built-in clinical decision support

#### Field Types Supported
- **Text entry**: Free text with optional character limits
- **Structured lists**: Single or multi-select with clinical terminology codes
- **Numeric with units**: Vitals, labs with automatic unit conversion
- **Date/time**: Absolute or relative (e.g., "2 hours ago")
- **Image markers**: Annotatable body diagrams for exam documentation
- **Attachment fields**: Link to images, PDFs, external documents
- **Conditional sections**: Show/hide based on previous answers

#### Layout Structures
- **Section headers**: Collapsible/expandable sections
- **Multi-column layouts**: Side-by-side data entry for efficiency
- **Tabbed interfaces**: Group related content (vitals, labs, assessments)
- **Repeatable field groups**: For serial exams, medication lists
- **Dynamic tables**: Add/remove rows as needed

#### Customization Mechanisms
- **PowerForm Editor**: GUI-based form builder
- **CCL (Cerner Command Language)**: Scripting for complex logic
- **JSON-based configuration**: Exportable form definitions
- **Template libraries**: Organizational and vendor-supplied templates
- **Role-based customization**: Different views for RNs, MDs, pharmacists

#### Clinical Logic Support
- **Range validation**: Automatically flag out-of-range values
- **Cross-field validation**: "If seizure = yes, then seizure type required"
- **Clinical alerts**: Pop-up warnings for critical combinations
- **Auto-population**: Pull data from flowsheets, orders, lab results
- **Calculation engines**: BMI, eGFR, drip rates, scores (APACHE, SOFA)

---

### 1.3 MEDITECH

**Template Approach:** "Quick Text" macros and structured "Nursing/Provider Notes" templates.

#### Template Structure
- **Quick Text Format**: Simple text substitution
  ```
  QT: NEUROEXAM
  ────────────
  NEUROLOGICAL EXAMINATION:
  Level of Consciousness: {LOC}
  Pupils: Right {R_PUPIL_SIZE}mm {R_PUPIL_REACT}, Left {L_PUPIL_SIZE}mm {L_PUPIL_REACT}
  Motor: RUE {RUE_MOTOR}/5, RLE {RLE_MOTOR}/5, LUE {LUE_MOTOR}/5, LLE {LLE_MOTOR}/5
  ```

- **Structured Note Sections**: Predefined headers with data fields
  ```
  [ASSESSMENT]
  Primary: {PRIMARY_DX}
  Secondary: {SECONDARY_DX}
  
  [PLAN]
  - {PLAN_ITEM_1}
  - {PLAN_ITEM_2}
  ```

#### Field Types Supported
- **Text placeholders**: `{FIELD_NAME}` for user input
- **Pick lists**: Coded terminology selection
- **Numeric entry**: With validation ranges
- **Checkboxes**: For checklists and care bundles
- **Date stamps**: Auto-insertion of current date/time

#### Customization Mechanisms
- **Text-based editing**: Direct editing of Quick Text files
- **Template sharing**: Export/import via .txt files
- **Department-level customization**: Templates scoped to service or unit
- **Limited GUI tools**: Mostly text-based configuration

#### Notable Features
- **Simple syntax**: Easy for clinicians to create and modify
- **Lightweight**: Fast loading, minimal system overhead
- **Copy-forward**: Pull previous note sections into new note
- **Limited validation**: Basic field-level validation only

---

## 2. Mobile Rounding Apps

### 2.1 Figure 1 (Clinical Rounding and Team Communication)

**Template Approach:** Mobile-first rounding lists with customizable patient cards.

#### Template Structure
```json
{
  "patient_card_template": {
    "header": {
      "fields": ["name", "age", "room", "diagnosis"]
    },
    "sections": [
      {
        "title": "Key Data",
        "layout": "grid",
        "fields": [
          {"name": "HD", "type": "number"},
          {"name": "GCS", "type": "score", "components": ["E", "V", "M"]},
          {"name": "ICP", "type": "number", "unit": "mmHg"},
          {"name": "MAP", "type": "number", "unit": "mmHg"}
        ]
      }
    ]
  }
}
```

#### Field Types Supported
- **Quick tap buttons**: For common yes/no/stable responses
- **Sliders**: For scales (0-10 pain, RASS -5 to +4)
- **Voice input**: Speech-to-text for free-text fields
- **Photo capture**: Integrated camera for wound documentation
- **Signature fields**: For attestation and co-signatures

#### Layout Structures
- **Card-based UI**: Swipeable patient cards
- **Progressive disclosure**: Expand to see more detail
- **Touch-optimized**: Large tap targets, minimal text entry
- **Offline-capable**: Local caching with sync when online

#### Best Practices Observed
- **Thumb-friendly design**: Key actions within easy reach
- **Minimal typing**: Maximize taps, minimize keyboard use
- **Visual hierarchy**: Most important data prominently displayed
- **Quick navigation**: Swipe gestures, floating action buttons

---

### 2.2 QueueDr and Patient Communicator

**Template Approach:** Customizable rounding checklists with task tracking.

#### Template Structure
```yaml
template:
  name: "Neuro ICU Daily Rounds"
  checklist_items:
    - category: "Neuro Assessment"
      items:
        - text: "GCS documented"
          required: true
        - text: "Pupil exam documented"
          required: true
    - category: "ICP Management"
      items:
        - text: "CPP > 60 mmHg"
          conditional:
            show_if: "icp_monitor == true"
        - text: "EVD at target height"
          conditional:
            show_if: "evd_present == true"
```

#### Field Types Supported
- **Checkbox tasks**: With completion timestamps
- **Priority flags**: High/medium/low visual indicators
- **Conditional tasks**: Appear based on diagnosis or previous answers
- **Timed reminders**: Push notifications for time-sensitive tasks
- **Team assignments**: Assign tasks to specific providers

#### Customization Mechanisms
- **Template wizard**: Step-by-step template creation
- **YAML configuration**: For advanced users and bulk import
- **Template marketplace**: Share templates with community
- **Version control**: Track changes to templates over time

---

## 3. Specialty-Specific EMRs

### 3.1 ChartLogic and ModMed (Specialty EMRs)

**Template Approach:** Specialty-specific templates with embedded clinical intelligence.

#### Template Structure (Neurology Example)
```javascript
{
  "template_type": "neurology_consult",
  "clinical_calculator_widgets": [
    {
      "name": "NIHSS Calculator",
      "fields": ["1a_loc", "1b_loc_questions", "1c_loc_commands", /* ... */],
      "auto_score": true,
      "interpretation": {
        "0": "No stroke symptoms",
        "1-4": "Minor stroke",
        "5-15": "Moderate stroke",
        "16-20": "Moderate to severe stroke",
        "21-42": "Severe stroke"
      }
    }
  ],
  "order_sets": [
    {
      "trigger": "nihss > 5 AND last_known_well < 4.5_hours",
      "suggestion": "Consider tPA administration"
    }
  ]
}
```

#### Advanced Features
- **Embedded calculators**: Real-time score computation
- **Clinical decision support**: Evidence-based suggestions
- **ICD-10 auto-coding**: Suggest billing codes based on documentation
- **Quality metrics tracking**: Automatically track quality measures
- **Outcome prediction**: Risk stratification based on entered data

---

## 4. Academic Medical Center Custom Solutions

### 4.1 Johns Hopkins and Mayo Clinic Approaches

Many academic centers have developed custom template systems:

#### Common Features
- **XML or JSON-based configuration**: For precise control
- **Version-controlled templates**: Git-based template management
- **Evidence integration**: Links to institutional protocols and guidelines
- **Research data capture**: FHIR-compliant data for quality improvement
- **Multi-language support**: For international collaboration

#### Example: Research-Oriented Template
```json
{
  "template": {
    "id": "neuroicu-sah-research",
    "research_cohort": "CONSCIOUS-1_Trial",
    "data_elements": [
      {
        "field": "modified_fisher",
        "fhir_mapping": "Observation.valueInteger",
        "required_for_research": true,
        "validation": {
          "range": [0, 4],
          "error_msg": "Modified Fisher must be 0-4"
        }
      }
    ]
  }
}
```

---

## 5. Field Type Taxonomy

Based on the research, clinical templates commonly use these field types:

### Data Entry Fields
| Field Type | Use Case | Validation | Examples |
|------------|----------|------------|----------|
| **Single-line text** | Names, short descriptions | Max length, regex | Patient name, room number |
| **Multi-line text** | Assessments, plans | Max length | Interval history, assessment |
| **Numeric** | Vitals, labs, scores | Min/max, decimals | MAP, GCS, age |
| **Dropdown/Select** | Standardized options | Required selection | Diagnosis type, medication |
| **Multi-select** | Multiple choices | Min/max selections | Comorbidities, allergies |
| **Radio buttons** | Single exclusive choice | Required | Gender, yes/no questions |
| **Checkboxes** | Binary or multiple options | None | Checklist items, symptoms |
| **Date/Time** | Timestamps, durations | Date range | Admission date, time of event |
| **Calculated** | Derived values | Auto-computed | BMI, GCS total, ICH score |
| **Conditional** | Context-dependent | Show/hide logic | SAH fields if diagnosis=SAH |

### Advanced Field Types
| Field Type | Use Case | Examples |
|------------|----------|----------|
| **Image annotation** | Body diagrams, wound mapping | Stroke territory, surgical site |
| **Slider** | Scales, continuous variables | Pain scale, RASS |
| **Signature** | Attestation, co-signature | Provider signature, consent |
| **File upload** | Documents, images | External records, photos |
| **Voice/Dictation** | Hands-free entry | Exam findings |
| **Barcode/QR** | Patient/medication ID | Patient wristband scan |
| **Auto-complete** | Large option lists | Medication names, ICD codes |

---

## 6. Layout and Structure Patterns

### 6.1 Section Organization

**Common Patterns:**
1. **Sequential sections**: Top-to-bottom flow (SOAP note format)
2. **Tabbed sections**: Group related content, reduce scrolling
3. **Accordion/collapsible**: Expand sections as needed
4. **Multi-column**: Side-by-side data entry (desktop only)
5. **Card-based**: Mobile-friendly, focused data entry

### 6.2 Repeatable Field Groups

For serial data entry (e.g., multiple medications, multiple exams):
```json
{
  "field_group": "medications",
  "repeatable": true,
  "fields": [
    {"name": "medication", "type": "autocomplete"},
    {"name": "dose", "type": "numeric"},
    {"name": "route", "type": "dropdown"},
    {"name": "frequency", "type": "dropdown"}
  ],
  "actions": ["add", "remove", "reorder"]
}
```

### 6.3 Conditional Logic

**Common Patterns:**
- **Show/hide fields**: Based on previous answers
- **Required if**: Field becomes required based on condition
- **Auto-populate**: Fill in related fields automatically
- **Branching logic**: Different paths based on answers

**Example:**
```json
{
  "field": "evd_drain_rate",
  "show_if": "evd_present == true",
  "required_if": "evd_present == true"
}
```

---

## 7. Customization Mechanisms Comparison

| System | Customization Method | Ease of Use | Power/Flexibility | Sharing Capability |
|--------|---------------------|-------------|-------------------|-------------------|
| **Epic** | XML + GUI Builder | Medium | High | Template marketplace |
| **Cerner** | PowerForm Editor + CCL | Medium | Very High | Export/import |
| **MEDITECH** | Text-based editing | High | Low | Text file sharing |
| **Mobile apps** | YAML/JSON + Wizard | High | Medium | Cloud sync |
| **Academic custom** | Git + JSON/XML | Low | Very High | Version control |

### Recommended Approach for This App

**Hybrid Model:**
1. **JSON-based configuration** (human-readable, version-controllable)
2. **In-app visual editor** (for non-technical users)
3. **Template library** (pre-built templates for common diagnoses)
4. **Import/export** (share templates as files)
5. **Live preview** (see changes in real-time)

**Example Template Configuration:**
```json
{
  "template_version": "1.0",
  "metadata": {
    "id": "neuroicu-sah-comprehensive",
    "name": "Neuro ICU SAH Comprehensive",
    "author": "Dr. Smith",
    "institution": "Academic Medical Center",
    "specialty": "Neurosurgery/NeuroICU",
    "created": "2026-01-15",
    "last_modified": "2026-01-15"
  },
  "sections": [
    {
      "id": "patient_info",
      "title": "Patient Information",
      "collapsible": false,
      "fields": [
        {
          "id": "patient_name",
          "label": "Patient Name",
          "type": "text",
          "required": true,
          "placeholder": "Last, First"
        },
        {
          "id": "room",
          "label": "Room",
          "type": "text",
          "validation": {
            "pattern": "^[A-Z]+-[0-9]+$",
            "message": "Format: UNIT-ROOM (e.g., ICU-123)"
          }
        }
      ]
    },
    {
      "id": "neuro_exam",
      "title": "Neurological Examination",
      "collapsible": true,
      "fields": [
        {
          "id": "gcs_eye",
          "label": "GCS - Eye Opening",
          "type": "select",
          "options": [
            {"value": 4, "label": "Spontaneous (4)"},
            {"value": 3, "label": "To voice (3)"},
            {"value": 2, "label": "To pain (2)"},
            {"value": 1, "label": "None (1)"}
          ],
          "required": true
        },
        {
          "id": "gcs_total",
          "label": "GCS Total",
          "type": "calculated",
          "formula": "gcs_eye + gcs_verbal + gcs_motor",
          "readonly": true,
          "display": "GCS: {value}/15"
        }
      ]
    },
    {
      "id": "sah_specific",
      "title": "SAH-Specific Data",
      "show_if": "diagnosis_type == 'sah'",
      "fields": [
        {
          "id": "hunt_hess",
          "label": "Hunt & Hess Grade",
          "type": "select",
          "options": [1, 2, 3, 4, 5],
          "help_text": "Click for grading criteria",
          "reference_url": "https://www.mdcalc.com/hunt-hess-classification"
        }
      ]
    }
  ],
  "output_template": {
    "format": "markdown",
    "body": "# Neuro ICU Note\n\n**Patient:** @PATIENT_NAME@ | **Room:** @ROOM@\n\n## Neurological Exam\nGCS: @GCS_TOTAL@ (E@GCS_EYE@ V@GCS_VERBAL@ M@GCS_MOTOR@)\n\n..."
  }
}
```

---

## 8. Best Practices and Usability Considerations

### 8.1 User Experience

**Key Principles:**
1. **Progressive disclosure**: Show basic fields first, advanced options on demand
2. **Smart defaults**: Pre-populate with common values
3. **Keyboard shortcuts**: Support power users (Tab navigation, Enter to submit)
4. **Undo/redo**: Allow easy correction of mistakes
5. **Auto-save**: Never lose data
6. **Mobile-responsive**: Touch-friendly on tablets
7. **Accessibility**: Screen reader support, keyboard navigation

### 8.2 Clinical Workflow Integration

**Design for Real-World Use:**
- **Quick capture mode**: Minimal clicks for routine cases
- **Comprehensive mode**: Detailed documentation when needed
- **Copy-forward**: Reuse previous note sections
- **Team handoff**: Easy transfer of patient data
- **Print-friendly**: Format well for paper handouts

### 8.3 Data Quality

**Ensure High-Quality Data:**
- **Required field indicators**: Clear visual cues (* asterisk, color)
- **Real-time validation**: Immediate feedback on errors
- **Range warnings**: Flag outliers (but don't block entry)
- **Consistency checks**: "ICP > CPP" → warning
- **Duplicate detection**: Prevent accidental re-entry
- **Completeness score**: "80% complete" progress indicator

### 8.4 Template Governance

**For Institutional Deployment:**
- **Template versioning**: Track changes over time
- **Approval workflow**: Review before deployment
- **Usage analytics**: Track which templates are used
- **Deprecation policy**: Phase out old templates gracefully
- **Training materials**: Documentation for each template

---

## 9. Gaps and Differentiation Opportunities

### 9.1 Current Gaps in Existing Systems

**Limitations Identified:**
1. **Poor mobile experience**: Most EMRs are desktop-first
2. **Rigid structure**: Difficult to customize without IT support
3. **Slow performance**: Heavy systems with lots of clicks
4. **No offline mode**: Require constant network connectivity
5. **Limited sharing**: Templates locked within institution
6. **No version control**: Difficult to track template changes
7. **Weak validation**: Allow incorrect data entry
8. **No AI integration**: No intelligent suggestions or auto-completion

### 9.2 Differentiation Opportunities for This App

**Competitive Advantages:**
1. **Open-source templates**: Community-driven template library
2. **Git-based versioning**: Use GitHub for template management
3. **Instant deployment**: No IT approval needed for changes
4. **Mobile-first design**: Touch-optimized for bedside use
5. **Offline-capable**: PWA with local storage
6. **Real-time collaboration**: Share templates via JSON export
7. **Clinical AI integration**: GPT-assisted note generation
8. **FHIR-compliant export**: Research data capture
9. **Lightweight**: Fast loading, minimal dependencies
10. **Privacy-first**: No server, data stays local

### 9.3 Novel Features to Consider

**Innovative Additions:**
- **Template marketplace**: GitHub-based template sharing
- **Visual template designer**: Drag-and-drop interface
- **Smart suggestions**: AI-powered auto-complete based on diagnosis
- **Voice commands**: "Add 2 mg of Keppra to drips"
- **Template testing**: Validate templates before deployment
- **Analytics dashboard**: Template usage and completion metrics
- **Multi-language**: Translate templates automatically
- **Embedded learning**: Link to educational resources
- **Peer comparison**: "Others with similar patients documented..."

---

## 10. Implementation Recommendations

### 10.1 Immediate (Phase 1)
1. **Define JSON schema** for template configuration
2. **Create template validator** to check for errors
3. **Build 3-5 reference templates** for common diagnoses
4. **Implement template import/export** functionality
5. **Add template selection UI** to main app

### 10.2 Near-Term (Phase 2)
6. **Create visual template editor** with live preview
7. **Add conditional field logic** (show/hide, required-if)
8. **Implement calculated fields** (GCS total, scores)
9. **Build template library page** with search/filter
10. **Add field validation** (ranges, patterns, required)

### 10.3 Long-Term (Phase 3)
11. **Template marketplace** (GitHub-based)
12. **Version control integration** for templates
13. **Collaborative editing** (multiple users)
14. **AI-assisted template creation** (GPT-powered)
15. **FHIR export capability** for research
16. **Template analytics** (usage, completion rates)

### 10.4 Recommended Field Types (Priority Order)
1. ✅ Text (single/multi-line) - **Already supported**
2. ✅ Dropdown/select - **Already supported** (via diagnosis type)
3. ⬜ Checkbox - **Partial** (checklist exists, but not customizable fields)
4. ⬜ Numeric with validation - **Partial** (exists but no template-driven validation)
5. ⬜ Calculated fields - **To be added**
6. ⬜ Conditional fields - **To be added**
7. ⬜ Date/time pickers - **To be added**
8. ⬜ Radio buttons - **To be added**
9. ⬜ Multi-select - **To be added**
10. ⬜ Auto-complete - **To be added** (for medications, diagnoses)

---

## 11. Sample Template Format Specification

Based on the research, here is a proposed template format for this application:

```typescript
interface TemplateConfiguration {
  // Metadata
  version: string;                    // Template format version (e.g., "1.0")
  metadata: {
    id: string;                       // Unique template identifier
    name: string;                     // Display name
    description?: string;             // Brief description
    author?: string;                  // Creator
    institution?: string;             // Organization
    specialty?: string;               // Clinical specialty
    diagnosis_types?: string[];       // Applicable diagnoses
    created: string;                  // ISO date
    last_modified: string;            // ISO date
    tags?: string[];                  // For categorization
  };

  // Structure
  sections: TemplateSection[];        // Ordered sections
  output_template?: OutputTemplate;   // How to render final output
  
  // Advanced
  validation?: ValidationRule[];      // Cross-field validation
  calculations?: CalculationRule[];   // Computed values
  clinical_logic?: ClinicalRule[];    // Decision support
}

interface TemplateSection {
  id: string;                         // Unique section ID
  title: string;                      // Section header
  description?: string;               // Help text
  collapsible?: boolean;              // Can be collapsed
  default_collapsed?: boolean;        // Initial state
  show_if?: ConditionalLogic;         // When to display section
  fields: TemplateField[];            // Fields in this section
  layout?: "vertical" | "grid" | "horizontal";  // Layout style
}

interface TemplateField {
  id: string;                         // Unique field ID
  label: string;                      // Field label
  type: FieldType;                    // Field input type
  required?: boolean;                 // Is field required
  required_if?: ConditionalLogic;     // Conditionally required
  show_if?: ConditionalLogic;         // Conditionally visible
  default_value?: any;                // Pre-populated value
  placeholder?: string;               // Placeholder text
  help_text?: string;                 // Tooltip/help
  validation?: FieldValidation;       // Validation rules
  options?: FieldOption[];            // For select/multi-select
  readonly?: boolean;                 // Cannot be edited
  unit?: string;                      // For numeric fields (mg, mmHg)
  min?: number;                       // Min value (numeric)
  max?: number;                       // Max value (numeric)
  step?: number;                      // Increment (numeric)
  pattern?: string;                   // Regex pattern (text)
  calculation?: string;               // Formula (calculated fields)
  reference_url?: string;             // Link to guidelines
}

type FieldType = 
  | "text"                            // Single-line text
  | "textarea"                        // Multi-line text
  | "number"                          // Numeric input
  | "select"                          // Dropdown (single)
  | "multiselect"                     // Dropdown (multiple)
  | "radio"                           // Radio buttons
  | "checkbox"                        // Single checkbox
  | "checkboxgroup"                   // Multiple checkboxes
  | "date"                            // Date picker
  | "time"                            // Time picker
  | "datetime"                        // Date + time
  | "calculated"                      // Auto-calculated
  | "slider"                          // Range slider
  | "toggle";                         // On/off switch

interface ConditionalLogic {
  field: string;                      // Field ID to check
  operator: "==" | "!=" | ">" | "<" | ">=" | "<=" | "contains" | "in";
  value: any;                         // Value to compare
  and?: ConditionalLogic[];           // AND conditions
  or?: ConditionalLogic[];            // OR conditions
}

interface FieldValidation {
  pattern?: string;                   // Regex pattern
  min?: number;                       // Minimum value/length
  max?: number;                       // Maximum value/length
  message?: string;                   // Error message
  warning_if?: ConditionalLogic;      // Show warning (but allow)
  warning_message?: string;           // Warning text
}

interface OutputTemplate {
  format: "markdown" | "text" | "html";  // Output format
  body: string;                       // Template with @TOKENS@
  header?: string;                    // Optional header
  footer?: string;                    // Optional footer
}
```

**Example Usage:**
```json
{
  "version": "1.0",
  "metadata": {
    "id": "neuroicu-tbi-brief",
    "name": "Neuro ICU TBI Brief",
    "specialty": "Neurosurgery",
    "diagnosis_types": ["tbi"],
    "created": "2026-01-15"
  },
  "sections": [
    {
      "id": "exam",
      "title": "Neurological Exam",
      "fields": [
        {
          "id": "gcs_total",
          "label": "GCS Total",
          "type": "calculated",
          "calculation": "gcs_eye + gcs_verbal + gcs_motor",
          "min": 3,
          "max": 15,
          "validation": {
            "warning_if": {
              "field": "gcs_total",
              "operator": "<=",
              "value": 8
            },
            "warning_message": "Severe TBI - consider intubation"
          }
        }
      ]
    }
  ]
}
```

---

## 12. Conclusion

Based on this research, the most successful clinical template systems share these characteristics:

**Success Factors:**
1. **Balance standardization with flexibility** - Structured data where it matters, free text where it doesn't
2. **Support multiple user workflows** - Quick capture AND comprehensive documentation
3. **Mobile-optimized** - Touch-friendly for bedside use
4. **Easy customization** - Non-technical users can create templates
5. **Shareable** - Templates can be exported/imported
6. **Validated** - Prevent errors with real-time validation
7. **Clinical intelligence** - Embedded calculators and decision support
8. **Fast** - Minimal clicks, auto-complete, defaults

**Recommended Next Steps:**
1. Implement JSON-based template configuration (use schema in Section 11)
2. Create 5 reference templates for common Neuro ICU diagnoses
3. Build template import/export UI
4. Add field validation and conditional logic
5. Create visual template editor (drag-and-drop)
6. Launch community template library on GitHub

This hybrid approach—combining the flexibility of Epic's SmartPhrases, the structure of Cerner's PowerForms, and the mobile-friendliness of modern rounding apps—will create a differentiated product that clinicians actually want to use.

---

## References

1. Epic Systems - SmartPhrase Documentation (2025)
2. Oracle Health (Cerner) - PowerForm Developer Guide (2025)
3. MEDITECH - Quick Text User Manual (2024)
4. HL7 FHIR Questionnaire Resource Specification v5.0
5. Apple Health Records - Clinical Data Structures
6. OpenMRS - Form Schema Documentation
7. REDCap - Data Dictionary Format
8. OHDSI OMOP Common Data Model v5.4

---

**Document Prepared By:** GitHub Copilot  
**For Project:** Neuro ICU Rounding App  
**Last Updated:** January 15, 2026
