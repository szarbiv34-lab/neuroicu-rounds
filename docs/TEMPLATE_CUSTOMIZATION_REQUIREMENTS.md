# Requirements Document: Customizable Rounding Templates

**Document Version:** 1.0  
**Date:** 2026-01-15  
**Status:** Requirements Gathering

## Executive Summary

This document captures user requirements for implementing customizable rounding templates in the Neuro ICU Rounding App. The goal is to enable healthcare institutions and individual users to tailor SmartPhrase templates to their specific workflows, documentation standards, and clinical protocols.

## Table of Contents

1. [Background and Context](#background-and-context)
2. [Current State Analysis](#current-state-analysis)
3. [User Personas](#user-personas)
4. [User Stories](#user-stories)
5. [Functional Requirements](#functional-requirements)
6. [Workflow Requirements](#workflow-requirements)
7. [Template Field Requirements](#template-field-requirements)
8. [Clinical and Institutional Guidelines](#clinical-and-institutional-guidelines)
9. [Current Pain Points](#current-pain-points)
10. [Success Criteria](#success-criteria)
11. [Technical Considerations](#technical-considerations)
12. [Open Questions](#open-questions)

---

## Background and Context

### Current System

The Neuro ICU Rounding App currently provides:
- **8 pre-built SmartPhrase templates** for different diagnoses (SAH, stroke, ICH, TBI, seizure, etc.)
- **Token-based system** for populating patient data (e.g., `@NAME@`, `@GCS@`, `@LABS@`)
- **Hard-coded templates** in `src/smartphrases.ts`
- **Limited customization** requiring code changes

### Motivation

Different institutions have varying:
- Documentation standards and formatting preferences
- Clinical protocols and order sets
- EHR integration requirements
- Institutional-specific fields (attending names, service lines, billing codes)
- Teaching vs. non-teaching hospital workflows

---

## Current State Analysis

### Existing Templates

The app includes these templates:

1. **NEUROICU_DAILY** - General neuro ICU progress note
2. **NEUROICU_SAH** - Subarachnoid hemorrhage specific
3. **NEUROICU_STROKE** - Ischemic stroke specific
4. **NEUROICU_TBI** - Traumatic brain injury specific
5. **NEUROICU_STATUS** - Status epilepticus specific
6. **NEUROICU_ICH** - Intracerebral hemorrhage specific
7. **CVICU_DAILY** - General CVICU note
8. **CVICU_POST_OP** - Post-operative cardiac surgery

### Current Limitations

1. **No UI-based template editing** - requires code changes
2. **No template versioning or backup** - changes overwrite originals
3. **No institution-specific templates** - one size fits all
4. **No template sharing** - cannot export/import between users
5. **Limited token library** - fixed set of available placeholders
6. **No conditional sections** - all template sections always appear
7. **No template validation** - syntax errors only caught at runtime

---

## User Personas

### Persona 1: Dr. Sarah Chen - Academic Neurointensivist
- **Role:** Attending physician at large teaching hospital
- **Needs:** 
  - Templates that include resident/fellow names
  - Teaching points sections
  - Research protocol compliance checklists
  - Institutional review board (IRB) documentation
- **Pain Points:**
  - Current templates too brief for academic documentation
  - Missing billing/coding sections
  - Need department-specific headers/footers

### Persona 2: Dr. James Rodriguez - Community Hospital Neurologist
- **Role:** Solo neurologist covering small ICU
- **Needs:**
  - Concise templates for efficiency
  - Integration with local EHR shortcuts
  - Templates for non-neuro conditions he manages
- **Pain Points:**
  - Too much neuro-specific jargon for community setting
  - Missing general ICU management sections
  - Templates assume specialized resources not available

### Persona 3: Emily Thompson - Nurse Practitioner
- **Role:** NP on neuro-ICU team
- **Needs:**
  - Mid-level provider templates
  - Procedure documentation templates
  - Handoff templates for shift changes
- **Pain Points:**
  - Current templates physician-centric
  - Missing nursing-specific assessments
  - No handoff communication templates

### Persona 4: Dr. Michael Patel - Department Chief
- **Role:** Department administrator
- **Needs:**
  - Standardized templates across department
  - Quality metrics documentation
  - Compliance with institutional protocols
  - Template version control
- **Pain Points:**
  - Cannot enforce template standards
  - No audit trail for template changes
  - Difficult to update templates across team

---

## User Stories

### Template Creation and Editing

**As a** clinical user  
**I want to** create my own custom rounding templates  
**So that** I can document according to my institution's standards

**Acceptance Criteria:**
- UI for creating new templates without coding
- Template preview before saving
- Ability to clone existing templates as starting point
- Template naming and description fields

---

**As a** department administrator  
**I want to** edit existing templates to match our protocols  
**So that** all team members use consistent documentation

**Acceptance Criteria:**
- In-app template editor with syntax highlighting
- Ability to edit template structure and content
- Changes apply immediately or can be scheduled
- Rollback to previous template versions

---

### Template Organization

**As a** user managing multiple services  
**I want to** organize templates by service or diagnosis  
**So that** I can quickly find the right template

**Acceptance Criteria:**
- Templates grouped by category/service
- Search and filter functionality
- Favorites or pinned templates
- Recently used templates list

---

### Template Sharing

**As a** department chief  
**I want to** share approved templates with my team  
**So that** we maintain documentation consistency

**Acceptance Criteria:**
- Export templates to shareable format (JSON, YAML, or custom)
- Import templates from file or URL
- Template library or marketplace
- Version indicators on imported templates

---

### Field Customization

**As a** clinical user  
**I want to** customize which fields appear in my templates  
**So that** I only document what's relevant to my patients

**Acceptance Criteria:**
- Toggle visibility of template sections
- Reorder template sections via drag-and-drop
- Add custom fields with custom tokens
- Conditional sections based on diagnosis type

---

### Token Management

**As a** template editor  
**I want to** see all available tokens and their meanings  
**So that** I can build effective templates

**Acceptance Criteria:**
- Token library with descriptions
- Token preview showing sample output
- Token autocomplete in template editor
- Custom token creation interface

---

### Institutional Compliance

**As a** compliance officer  
**I want to** ensure templates meet regulatory requirements  
**So that** documentation is billable and defensible

**Acceptance Criteria:**
- Required fields marked as mandatory
- Template validation against institutional rules
- Audit log of template usage
- Quality metrics tracking

---

## Functional Requirements

### FR-1: Template Editor UI

**Priority:** HIGH  
**Description:** In-app visual template editor

**Detailed Requirements:**
- Rich text editor with markdown support
- Token insertion via dropdown/autocomplete
- Live preview pane showing rendered template
- Syntax validation and error highlighting
- Save/cancel/reset buttons
- Template metadata (name, description, author, version)

---

### FR-2: Template Storage

**Priority:** HIGH  
**Description:** Persistent storage for custom templates

**Detailed Requirements:**
- Store templates in localStorage alongside patient data
- Support for template import/export (JSON format)
- Template versioning with timestamps
- Ability to restore deleted templates (recycle bin)
- Template size limits (prevent localStorage overflow)

---

### FR-3: Template Selection

**Priority:** HIGH  
**Description:** Enhanced template selection mechanism

**Detailed Requirements:**
- Dropdown shows all available templates
- Auto-select template based on diagnosis type
- Override auto-selection manually
- Template preview before applying
- Quick-switch between templates

---

### FR-4: Custom Token System

**Priority:** MEDIUM  
**Description:** Allow users to create custom tokens

**Detailed Requirements:**
- Define custom tokens with default values
- Custom token can reference other tokens
- Support for computed tokens (e.g., `@APACHE_SCORE@`)
- Token validation prevents circular references
- Token library management UI

---

### FR-5: Conditional Sections

**Priority:** MEDIUM  
**Description:** Template sections appear conditionally

**Detailed Requirements:**
- Syntax: `{{#if diagnosis == "SAH"}} ... {{/if}}`
- Support for basic conditionals (if/else/endif)
- Conditions based on patient data (diagnosis, scores, etc.)
- Nested conditional support
- Default behavior if condition invalid

---

### FR-6: Template Marketplace

**Priority:** LOW  
**Description:** Community-shared template library

**Detailed Requirements:**
- Browse community-contributed templates
- Rate and review templates
- One-click import of templates
- Tag-based categorization
- Report inappropriate templates

---

### FR-7: Multi-Template Management

**Priority:** MEDIUM  
**Description:** Manage multiple templates efficiently

**Detailed Requirements:**
- Create template collections/folders
- Bulk operations (delete, export, duplicate)
- Search templates by name or content
- Sort by last used, most used, or alphabetical
- Archive unused templates

---

### FR-8: Template Validation

**Priority:** MEDIUM  
**Description:** Validate templates before use

**Detailed Requirements:**
- Check for undefined tokens
- Warn about missing required sections
- Validate conditional syntax
- Character limit warnings
- Preview with sample data

---

## Workflow Requirements

### Workflow 1: Individual Clinician Customization

**Scenario:** Dr. Chen wants to modify the SAH template for her institution

**Steps:**
1. Navigate to Settings → Templates
2. Find "NEUROICU_SAH" template
3. Click "Edit" or "Duplicate"
4. Modify template in visual editor
5. Add institution header: `*** UNIVERSITY HOSPITAL NEURO ICU ***`
6. Add custom fields: `@ATTENDING@`, `@RESIDENT@`, `@FELLOW@`
7. Preview template with sample data
8. Save as "UH_NEUROICU_SAH"
9. Set as default for SAH patients
10. Test by creating a SAH patient and generating note

**Expected Outcome:**
- New template appears in template selector
- Auto-selected for SAH diagnosis
- Custom fields populate from patient data
- Original template remains unchanged

---

### Workflow 2: Department-Wide Template Rollout

**Scenario:** Department chief wants to standardize templates across 10 clinicians

**Steps:**
1. Chief creates/edits template in their instance
2. Tests template thoroughly
3. Exports template to file: `neuroicu-sah-v2.json`
4. Shares file via email/shared drive
5. Team members:
   - Navigate to Settings → Templates → Import
   - Select the JSON file
   - Review template preview
   - Confirm import
   - Template appears in their library

**Expected Outcome:**
- All team members have identical template
- Updates require re-import of new version
- Old template can be archived or deleted

---

### Workflow 3: Creating Template from Scratch

**Scenario:** NP wants to create a handoff template

**Steps:**
1. Navigate to Settings → Templates → New Template
2. Enter template name: "Shift Handoff"
3. Select category: "Nursing"
4. Choose base layout or start blank
5. Build template:
   ```
   HANDOFF - @NAME@ (@ROOM@)
   
   One-liner: @ONELINER@
   
   Events this shift:
   - [Manual entry]
   
   Current condition: @GCS@, @PUPILS@, @ICP_CPP@
   
   Overnight plan:
   @TASKS@
   
   Concerns: [Manual entry]
   ```
6. Add to token library: Browse available tokens
7. Preview with test data
8. Save template
9. Set availability: "Available for all diagnoses"

**Expected Outcome:**
- New template available in template selector
- Can be used alongside diagnosis-specific templates
- Shareable with other NPs

---

### Workflow 4: Template Versioning and Updates

**Scenario:** Template needs to be updated to reflect new institutional protocol

**Steps:**
1. Edit existing template
2. System prompts: "Save as new version or overwrite?"
3. User selects "New version"
4. System creates "Template v2"
5. User can switch between v1 and v2
6. After testing, user sets v2 as default
7. v1 remains available for historical notes

**Expected Outcome:**
- Multiple versions coexist
- Can compare versions side-by-side
- Historical data references correct version used

---

## Template Field Requirements

### Required Fields (Must be present in all templates)

1. **Patient Identification**
   - Patient name (`@NAME@`)
   - Room/location (`@ROOM@`)
   - Date (`@TODAY@`)
   
2. **Clinical Context**
   - Diagnosis (`@DIAGNOSIS@`)
   - Hospital day (`@DAY_OF_ADMIT@`)

3. **Neurological Exam**
   - GCS (`@GCS@` or components `@GCS_E@`, `@GCS_V@`, `@GCS_M@`)
   - Pupils (`@PUPILS@`)

4. **Assessment and Plan**
   - At least one section for assessment/plan (`@AP@` or manual entry)

### Optional Standard Fields

These should be available but not mandatory:

**Vital Signs:**
- `@MAP@`, `@HR@`, `@SPO2@`, `@TEMP@`, `@RR@`
- `@FIO2@`, `@PEEP@`, `@VENT@`

**Support:**
- `@DRIPS@` - Continuous medications
- `@LINES@` - Lines, tubes, devices

**Data:**
- `@LABS@` - Laboratory results
- `@IMAGING@` - Imaging findings and interpretations
- `@MICROBIOLOGY@` - Culture results

**Plans and Tasks:**
- `@AP@` - Assessment and plan
- `@TASKS@` - Task list
- `@CHECKLIST@` - Checklist items
- `@GOALS@` - Goals of care / family communication

**ICP Monitoring:**
- `@ICP@`, `@CPP@`, `@EVD@`, `@ICP_CPP@`

**Motor Exam:**
- `@MOTOR@` - Free text motor exam
- Individual limbs: `@LUE@`, `@RUE@`, `@LLE@`, `@RLE@`

**Sedation:**
- `@SEDATION@` - RASS or sedation description
- `@SEIZURES@` - Seizure activity

### Institution-Specific Field Examples

Different institutions may need:

1. **Academic Centers:**
   - `@ATTENDING@` - Attending physician name
   - `@RESIDENT@` - Resident name
   - `@FELLOW@` - Fellow name
   - `@MEDICAL_STUDENT@` - Student name
   - `@TEACHING_POINTS@` - Educational notes

2. **Community Hospitals:**
   - `@HOSPITALIST@` - Hospitalist co-managing
   - `@CONSULTING_SERVICE@` - Consulting service names
   - `@PRIMARY_CARE_MD@` - Outpatient PCP

3. **Billing/Coding:**
   - `@TIME_SPENT@` - Time spent on patient
   - `@COMPLEXITY@` - Complexity level
   - `@CPT_CODE@` - Suggested CPT codes
   - `@ICD_CODES@` - Diagnosis codes

4. **Research Settings:**
   - `@PROTOCOL_NUMBER@` - Research protocol ID
   - `@CONSENT_STATUS@` - Research consent status
   - `@STUDY_DAY@` - Day in research protocol

5. **Quality Metrics:**
   - `@BUNDLE_COMPLIANCE@` - Care bundle checklist
   - `@SAFETY_EVENTS@` - Falls, pressure injuries, etc.
   - `@FAMILY_MEETING@` - Family communication documentation

### Custom Field Specifications

**Format:** Fields should support:
- **Plain text** - Simple string replacement
- **Multi-line text** - Preserves formatting
- **Structured data** - Lists, bullet points, tables
- **Calculated values** - Derived from other fields
- **Conditional content** - Show/hide based on criteria

**Example Custom Field Definition:**
```json
{
  "tokenName": "@ATTENDING@",
  "displayName": "Attending Physician",
  "dataType": "text",
  "defaultValue": "[Attending name]",
  "required": false,
  "validationRule": "^[A-Za-z\\s,\\.]+$",
  "helpText": "Name of attending physician"
}
```

---

## Clinical and Institutional Guidelines

### Regulatory Compliance

Templates must support compliance with:

1. **The Joint Commission (TJC) Requirements**
   - Date and time of note
   - Author identification
   - Authentication (signature)
   - Timely documentation

2. **CMS (Medicare) Documentation Requirements**
   - Medical necessity justification
   - Clinical reasoning for orders
   - Progress toward treatment goals
   - Discharge planning

3. **HIPAA Privacy**
   - No patient identifiers in template export
   - Secure storage of custom templates
   - Audit logging of template access

### Clinical Practice Guidelines

Templates should accommodate:

1. **Neurocritical Care Society Guidelines**
   - SAH management bundles
   - Stroke thresholds and interventions
   - TBI tier therapy protocols
   - Status epilepticus treatment algorithms

2. **Institutional Protocols**
   - Local antibiotic formularies
   - Institutional care pathways
   - Sedation protocols
   - Weaning protocols

3. **Evidence-Based Metrics**
   - Core measure documentation
   - Get With The Guidelines compliance
   - Surviving Sepsis Campaign bundles

### Documentation Standards

1. **SOAP Format Support**
   - Subjective
   - Objective
   - Assessment
   - Plan

2. **Problem-Oriented Format**
   - Problem list
   - Assessment for each problem
   - Plan for each problem

3. **Systems-Based Format**
   - Neuro
   - Respiratory
   - Cardiovascular
   - etc.

### Institutional Customization Examples

#### Example 1: Academic Medical Center
- Include teaching service structure
- Resident/fellow education documentation
- Research protocol compliance
- Complex family meeting documentation

#### Example 2: Community Hospital
- Simplified format
- Focus on core clinical data
- Telemedicine consultation documentation
- Transfer coordination

#### Example 3: Stroke Center Certification
- NIHSS documentation required
- Thrombolysis checklist
- Time metrics (last known well, door-to-needle)
- Quality metrics for Joint Commission

#### Example 4: International Hospital
- Multi-language support
- Different units of measurement (metric vs imperial)
- Local medication names (generic vs brand)
- Cultural considerations in documentation

---

## Current Pain Points

Based on review of existing system and anticipated user needs:

### 1. Hard-Coded Templates

**Problem:** Templates defined in TypeScript code  
**Impact:** Non-technical users cannot modify templates  
**User Quote:** "I'd love to adjust the format but I'm not a programmer"  
**Frequency:** HIGH  
**Severity:** HIGH  

**Proposed Solution:**
- Visual template editor accessible from UI
- No coding required for basic edits
- Advanced users can still edit JSON directly

---

### 2. One-Size-Fits-All Approach

**Problem:** Templates assume certain workflows  
**Impact:** Users forced to delete irrelevant sections or add missing ones manually  
**User Quote:** "We don't have fellows or residents, so I delete those lines every time"  
**Frequency:** HIGH  
**Severity:** MEDIUM  

**Proposed Solution:**
- Customizable field visibility
- Institution-specific template profiles
- Conditional sections that auto-hide if not applicable

---

### 3. No Template Versioning

**Problem:** Editing a template overwrites previous version  
**Impact:** Cannot revert to older version if needed  
**User Quote:** "I wish I hadn't changed that template, now I can't remember what it said before"  
**Frequency:** MEDIUM  
**Severity:** MEDIUM  

**Proposed Solution:**
- Version history with timestamps
- Ability to view and restore previous versions
- Template comparison view (diff)

---

### 4. Limited Token Library

**Problem:** Fixed set of tokens, cannot add custom fields  
**Impact:** Users add placeholders manually that don't auto-populate  
**User Quote:** "I want to add our attending's name but there's no token for that"  
**Frequency:** HIGH  
**Severity:** MEDIUM  

**Proposed Solution:**
- Custom token creation UI
- Token library browser
- User-defined default values for custom tokens

---

### 5. No Template Sharing Mechanism

**Problem:** Cannot easily share templates between users  
**Impact:** Each user must recreate templates manually  
**User Quote:** "I'd like to share this template with my colleagues but there's no way to export it"  
**Frequency:** MEDIUM  
**Severity:** LOW  

**Proposed Solution:**
- Export template to JSON file
- Import template from JSON file or URL
- Template marketplace or community library

---

### 6. Diagnosis-Template Mapping Too Rigid

**Problem:** One diagnosis maps to one template  
**Impact:** Cannot use different templates for same diagnosis in different contexts  
**User Quote:** "I want different templates for SAH depending on whether it's secured or not"  
**Frequency:** MEDIUM  
**Severity:** LOW  

**Proposed Solution:**
- Multiple templates per diagnosis
- Template selection based on additional criteria (secured status, severity, etc.)
- Template favorites for quick access

---

### 7. No Template Preview Before Use

**Problem:** Must generate full note to see template output  
**Impact:** Waste time generating notes with wrong template  
**User Quote:** "I selected the wrong template and had to re-enter everything"  
**Frequency:** MEDIUM  
**Severity:** LOW  

**Proposed Solution:**
- Template preview with sample data
- Template description and metadata display
- Quick-switch between templates without losing data

---

### 8. Missing Common Clinical Scenarios

**Problem:** Not all clinical scenarios have templates  
**Impact:** Users create free-text notes instead of using templates  
**User Quote:** "There's no template for post-op craniotomy, so I just type it out"  
**Frequency:** MEDIUM  
**Severity:** MEDIUM  

**Proposed Solution:**
- Expanded template library
- Easy custom template creation
- Community contributions for niche scenarios

---

### 9. No Quality Assurance Features

**Problem:** No validation that required elements are documented  
**Impact:** Incomplete or non-compliant documentation  
**User Quote:** "I forgot to document the GCS and didn't notice until later"  
**Frequency:** LOW  
**Severity:** MEDIUM  

**Proposed Solution:**
- Required field validation before note generation
- Warning for empty critical sections
- Completeness score or checklist

---

### 10. Limited EHR Integration

**Problem:** Copy-paste is only export method  
**Impact:** Manual workflow, prone to errors  
**User Quote:** "I wish this could auto-populate into EPIC"  
**Frequency:** HIGH  
**Severity:** HIGH  

**Proposed Solution:**
- (Future consideration) API integration with EHR systems
- Support for EHR-specific formats (EPIC, Cerner, etc.)
- HL7 FHIR compliance for interoperability

---

## Success Criteria

### Metrics for Success

1. **Adoption Rate**
   - **Target:** 80% of users create or edit at least one custom template within 30 days
   - **Measurement:** Track template creation/edit events in usage analytics

2. **Template Diversity**
   - **Target:** Average user has 3+ custom templates
   - **Measurement:** Count custom templates per user account

3. **Reduced Manual Editing**
   - **Target:** 50% reduction in post-generation manual edits to notes
   - **Measurement:** User survey before/after implementation

4. **User Satisfaction**
   - **Target:** 4.5/5 average rating on template customization features
   - **Measurement:** In-app rating system and user surveys

5. **Time Savings**
   - **Target:** 30% reduction in time to generate clinical note
   - **Measurement:** User-reported time tracking

6. **Template Sharing**
   - **Target:** 25% of users share templates with colleagues
   - **Measurement:** Track template export/import events

### Qualitative Success Indicators

- **Ease of Use:** Non-technical users can create templates without assistance
- **Flexibility:** Templates support diverse institutional workflows
- **Reliability:** Template system stable with no data loss
- **Discoverability:** Users can easily find and try new templates
- **Maintainability:** Templates can be updated without breaking existing functionality

### User Acceptance Testing Scenarios

#### Scenario 1: Create Custom Template
- User with no coding experience successfully creates a new template
- Template includes custom fields specific to their institution
- Template renders correctly with patient data

#### Scenario 2: Edit Existing Template
- User modifies existing SAH template
- Changes are saved without overwriting original
- Both versions coexist and are selectable

#### Scenario 3: Share Template
- User exports template to file
- Colleague imports template successfully
- Template works identically for both users

#### Scenario 4: Template Validation
- User creates template with syntax error
- System highlights error and prevents save
- User corrects error and saves successfully

#### Scenario 5: Migration from Old System
- Existing users retain access to default templates
- Custom templates (if any) are preserved
- New features are discoverable without breaking existing workflow

---

## Technical Considerations

### Data Storage

**Options:**

1. **Browser localStorage** (Current approach)
   - Pros: Simple, no server required, fast access
   - Cons: 5-10MB limit, not shared across devices, cleared if user clears browser data
   - **Recommendation:** Keep for now, with export/import as backup

2. **IndexedDB**
   - Pros: Larger storage capacity (~1GB), structured queries
   - Cons: More complex API, still local to device
   - **Recommendation:** Consider for future if template size grows

3. **Cloud Storage** (Firebase, AWS S3, etc.)
   - Pros: Shared across devices, unlimited storage, backup included
   - Cons: Requires authentication, privacy concerns, ongoing costs
   - **Recommendation:** Long-term goal for institutional deployment

### Template Format

**Recommendation:** JSON format for templates

**Example Template Structure:**
```json
{
  "id": "custom-sah-v1",
  "name": "University Hospital SAH Template",
  "version": "1.0",
  "author": "Dr. Sarah Chen",
  "createdAt": "2026-01-15T10:30:00Z",
  "modifiedAt": "2026-01-15T10:30:00Z",
  "service": "NeuroICU",
  "diagnosisTypes": ["sah"],
  "description": "SAH template for academic center with research protocols",
  "customTokens": [
    {
      "token": "@ATTENDING@",
      "label": "Attending Physician",
      "defaultValue": "[Attending name]",
      "dataType": "text"
    }
  ],
  "body": "*** SUBARACHNOID HEMORRHAGE NOTE ***\n...",
  "requiredFields": ["@NAME@", "@GCS@", "@DIAGNOSIS@"],
  "tags": ["sah", "academic", "university-hospital"]
}
```

### Template Validation

**Requirements:**
- Validate JSON structure
- Check for undefined tokens (warn, don't block)
- Detect circular references in custom tokens
- Limit template size (e.g., 50KB max)
- Sanitize user input to prevent XSS

### Performance Considerations

- **Template rendering:** Should complete in <100ms even for complex templates
- **Template editor:** Auto-save every 30 seconds to prevent data loss
- **Template list:** Paginate if user has >50 templates
- **Search:** Debounce search input to avoid excessive filtering

### Backward Compatibility

- **Must not break existing templates:** Default templates remain available
- **Migration path:** Old template format converts to new format automatically
- **Fallback:** If custom template fails to render, fall back to default template

### Security Considerations

1. **Input Sanitization**
   - Escape HTML in user-entered template content
   - Prevent JavaScript injection via custom tokens
   - Validate token names match safe regex pattern

2. **Data Privacy**
   - Template export strips patient data
   - Template sharing does not include PHI
   - Audit log for template access in institutional settings

3. **Access Control** (Future)
   - Department-level template libraries
   - Admin-approved templates vs user templates
   - Read-only vs edit permissions

---

## Open Questions

### Questions for Stakeholders

1. **Template Scope**
   - Q: Should templates be limited to progress notes, or expand to other documentation types (admission notes, discharge summaries, procedure notes)?
   - **Impact:** Determines scope of customization engine

2. **Collaboration**
   - Q: Is real-time collaborative template editing needed (like Google Docs)?
   - **Impact:** Significant technical complexity if yes

3. **Marketplace**
   - Q: Should there be a centralized template marketplace with ratings and reviews?
   - **Impact:** Requires moderation, hosting, and community management

4. **Institutional IT Integration**
   - Q: Do hospitals need admin-level control over which templates their staff can use?
   - **Impact:** Requires authentication, role-based access control, and enterprise deployment

5. **Template Analytics**
   - Q: Should we track which templates are most used, by whom, and when?
   - **Impact:** Privacy considerations, requires analytics infrastructure

6. **Mobile Editing**
   - Q: Should template editing be fully supported on mobile/tablet, or desktop only?
   - **Impact:** Mobile UI complexity for template editor

7. **Language Support**
   - Q: Should templates support multiple languages or character sets (e.g., Spanish, Chinese)?
   - **Impact:** Internationalization complexity

8. **Version Control**
   - Q: How many historical versions should be kept? 10? Unlimited?
   - **Impact:** Storage requirements

9. **Template Licensing**
   - Q: Should templates have licenses (public domain, creative commons, etc.)?
   - **Impact:** Legal considerations for template sharing

10. **AI Assistance**
    - Q: Should AI help generate or improve templates (e.g., "suggest a template for this diagnosis")?
    - **Impact:** Integration with LLMs, prompt engineering

### Technical Questions

1. **Editor Framework**
   - Q: Use a rich text editor library (Quill, Draft.js, etc.) or build custom?
   - **Consideration:** Trade-off between features and bundle size

2. **Template Engine**
   - Q: Use existing template engine (Handlebars, Mustache) or custom token system?
   - **Consideration:** Existing engines have more features but add dependencies

3. **Import/Export Format**
   - Q: Support multiple formats (JSON, YAML, XML) or just JSON?
   - **Consideration:** Flexibility vs simplicity

4. **Cloud Sync**
   - Q: If cloud storage added later, use Firebase, Supabase, custom backend, or other?
   - **Consideration:** Cost, vendor lock-in, privacy compliance

5. **Template Size Limits**
   - Q: What's the maximum size for a template (in characters or KB)?
   - **Consideration:** Balance flexibility with performance and storage

---

## Next Steps

### Immediate Actions (Next 2 Weeks)

1. **Stakeholder Review**
   - Share this document with key users
   - Gather feedback on priority and scope
   - Identify any missing requirements

2. **User Research**
   - Conduct interviews with 5-10 target users
   - Shadow users during rounding workflow
   - Identify most painful points to address first

3. **Prototype**
   - Create mockup of template editor UI
   - Test with representative users
   - Iterate based on feedback

### Short-Term (1-2 Months)

4. **MVP Definition**
   - Prioritize must-have vs nice-to-have features
   - Define scope for first release
   - Create development roadmap

5. **Technical Spike**
   - Evaluate template editor libraries
   - Prototype token autocomplete
   - Test template validation logic

### Medium-Term (3-6 Months)

6. **Implementation**
   - Build template editor UI
   - Implement custom token system
   - Add import/export functionality
   - Create template validation

7. **Testing**
   - Alpha testing with small user group
   - Beta testing with larger cohort
   - Gather feedback and iterate

### Long-Term (6+ Months)

8. **Advanced Features**
   - Template marketplace
   - Cloud synchronization
   - Institutional admin features
   - EHR integration

9. **Continuous Improvement**
   - Monitor usage analytics
   - Gather user feedback
   - Regular template library updates
   - Community engagement

---

## Appendix

### Appendix A: Sample Custom Template

**Scenario:** Academic neuro ICU wants to add teaching points

```
*** SUBARACHNOID HEMORRHAGE - TEACHING HOSPITAL ***
Date: @TODAY@
Service: Neurology/Neurosurgery ICU

TEAM:
- Attending: @ATTENDING@
- Fellow: @FELLOW@
- Resident: @RESIDENT@
- Medical Student: @MEDICAL_STUDENT@

PATIENT: @NAME@ (@ROOM@)
@DIAGNOSIS@ | @DAY_OF_ADMIT@
MRN: @MRN@ | DOB: @DOB@ | Age: @AGE@

PROTOCOL ENROLLMENT:
@RESEARCH_PROTOCOL@

BRIEF HISTORY:
@ONELINER@

Hunt-Hess: @HUNT_HESS@ | Fisher: @FISHER@
Aneurysm: @ANEURYSM_LOCATION@ | Secured: @SECURED_METHOD@
Bleed Day: @BLEED_DAY@

NEUROLOGICAL EXAM:
- GCS: @GCS@ (E@GCS_E@ V@GCS_V@ M@GCS_M@) [Admission: @ADMISSION_GCS@]
- Pupils: @PUPILS@
- Motor: @MOTOR@
@ICP_CPP@

VITAL SIGNS:
MAP: @MAP@ | HR: @HR@ | Temp: @TEMP@ | SpO2: @SPO2@

SUPPORT:
- Ventilator: @VENT@
- Drips: @DRIPS@
- Lines/Tubes: @LINES@

LABS:
@LABS@

IMAGING:
@IMAGING@

SAH BUNDLE CHECKLIST:
@CHECKLIST@

ASSESSMENT & PLAN:
@AP@

TEACHING POINTS:
@TEACHING_POINTS@

TASKS:
@TASKS@

FAMILY COMMUNICATION:
@GOALS@

TIME SPENT: @TIME_SPENT@ minutes
COMPLEXITY: @COMPLEXITY@

___________________________
Electronically signed: @ATTENDING@
Co-signed: @RESIDENT@ (PGY-@PGY_YEAR@)
```

### Appendix B: Token Reference

**Complete list of available tokens:**

| Token | Description | Example Output |
|-------|-------------|----------------|
| `@TODAY@` | Current date | "2026-01-15" |
| `@NAME@` | Patient name | "Doe, Jane" |
| `@ROOM@` | Room number | "NICU-12" |
| `@DIAGNOSIS@` | Primary diagnosis | "SAH" |
| `@DAY_OF_ADMIT@` | Hospital day | "HD#3" |
| `@ONELINER@` | One-line summary | "SAH HD3 s/p coiling..." |
| `@GCS@` | Total GCS | "13" |
| `@GCS_E@` | GCS eye | "3" |
| `@GCS_V@` | GCS verbal | "4" |
| `@GCS_M@` | GCS motor | "6" |
| `@PUPILS@` | Pupil exam | "L 3mm reactive, R 3mm reactive" |
| `@MOTOR@` | Motor exam | "RUE 4/5, all others 5/5" |
| `@CN@` | Cranial nerves | "II-XII intact" |
| `@SEDATION@` | Sedation level | "RASS -2" |
| `@SEIZURES@` | Seizure activity | "No clinical seizures" |
| `@ICP@` | Intracranial pressure | "12" |
| `@CPP@` | Cerebral perfusion pressure | "75" |
| `@EVD@` | EVD settings | "Draining @ 15cm, 10cc output/hr" |
| `@ICP_CPP@` | Combined ICP/CPP | "ICP: 12 | CPP: 75" |
| `@MAP@` | Mean arterial pressure | "85" |
| `@HR@` | Heart rate | "72" |
| `@SPO2@` | Oxygen saturation | "98" |
| `@TEMP@` | Temperature | "37.2" |
| `@RR@` | Respiratory rate | "14" |
| `@FIO2@` | Oxygen percentage | "40" |
| `@PEEP@` | PEEP setting | "5" |
| `@VENT@` | Ventilator settings | "SIMV 12/5 FiO2 40%" |
| `@DRIPS@` | Continuous medications | "Nimodipine 60mg q4h" |
| `@LINES@` | Lines and tubes | "EVD @15, A-line, Foley" |
| `@LABS@` | Lab results | "WBC 9.2, Hgb 10.5..." |
| `@IMAGING@` | Imaging findings | "CT head: stable SAH" |
| `@AP@` | Assessment and plan | "1) SAH..." |
| `@TASKS@` | Task list | "- Daily TCD\n- Update family" |
| `@CHECKLIST@` | Checklist items | "☑ HOB >30°\n☑ Neuro exam" |
| `@GOALS@` | Goals/family notes | "Family updated, agreeable to plan" |

### Appendix C: Conditional Syntax Examples

**Basic conditional:**
```
{{#if diagnosis == "sah"}}
Hunt-Hess: @HUNT_HESS@ | Fisher: @FISHER@
{{/if}}
```

**If-else:**
```
{{#if secured == true}}
Aneurysm secured via @SECURED_METHOD@
{{else}}
Aneurysm NOT YET SECURED - High risk
{{/if}}
```

**Multiple conditions:**
```
{{#if gcs < 8}}
CRITICAL: GCS @GCS@ - Airway protection needed
{{else if gcs < 13}}
MODERATE: GCS @GCS@ - Close monitoring
{{else}}
STABLE: GCS @GCS@
{{/if}}
```

**Nested conditions:**
```
{{#if diagnosis == "sah"}}
  {{#if bleedDay >= 3 && bleedDay <= 14}}
    ⚠️ VASOSPASM WINDOW - Days 3-14 highest risk
  {{/if}}
{{/if}}
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-15 | GitHub Copilot | Initial requirements document |

---

**End of Requirements Document**
