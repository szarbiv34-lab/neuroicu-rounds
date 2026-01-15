# Customizable Rounding Templates - Executive Summary

**Status:** Requirements Defined  
**Full Document:** [TEMPLATE_CUSTOMIZATION_REQUIREMENTS.md](./TEMPLATE_CUSTOMIZATION_REQUIREMENTS.md)  
**Date:** 2026-01-15

## Quick Overview

This document summarizes the requirements for adding customizable rounding templates to the Neuro ICU Rounding App.

## Problem Statement

**Current State:**
- Templates are hard-coded in TypeScript (`src/smartphrases.ts`)
- Users cannot modify templates without editing code
- One-size-fits-all approach doesn't fit institutional variations
- No template sharing or versioning

**Impact:**
- Users manually edit generated notes every time (inefficient)
- Different institutions can't adapt templates to their workflows
- No way to standardize across a department
- Technical barriers prevent non-coders from customizing

## Core User Needs

### Who Needs This?

1. **Individual Clinicians** - Want templates matching their documentation style
2. **Department Administrators** - Need to standardize templates across team
3. **Diverse Institutions** - Academic vs community vs international settings
4. **Different Specialties** - NPs, residents, attendings have different needs

### What Do They Need?

1. **Easy Template Editing** - UI-based, no coding required
2. **Custom Fields** - Add institution-specific data (attending names, protocols, etc.)
3. **Template Sharing** - Export/import between users
4. **Multiple Templates** - Different templates for different contexts
5. **Template Organization** - Search, categorize, and manage many templates

## Top 5 Prioritized Features

### 1. Template Editor UI (Priority: HIGH)
- Visual editor for creating/editing templates
- Token autocomplete and help
- Live preview with sample data
- Save custom templates alongside defaults

### 2. Custom Token System (Priority: MEDIUM-HIGH)
- Create custom fields like `@ATTENDING@`, `@PROTOCOL@`, etc.
- Define default values
- Token library browser

### 3. Template Import/Export (Priority: MEDIUM-HIGH)
- Export templates to JSON file
- Import templates from file
- Share templates with colleagues

### 4. Template Versioning (Priority: MEDIUM)
- Keep history of template changes
- Restore previous versions
- Compare versions side-by-side

### 5. Template Organization (Priority: MEDIUM)
- Search templates by name or content
- Categorize by service/diagnosis
- Favorite/pin frequently used templates

## Key Workflows

### Workflow 1: Individual Customization
Dr. Chen modifies SAH template to add her hospital's header and custom fields → saves as "UH_SAH_Template" → uses for all her SAH patients

### Workflow 2: Department Rollout
Department chief creates standardized template → exports to JSON → shares with team → team imports and uses identical template

### Workflow 3: Create From Scratch
NP creates new "Shift Handoff" template → adds relevant tokens → saves → uses alongside diagnosis templates

## Recommended MVP Scope

**Include in First Release:**
1. ✅ Template editor UI (basic)
2. ✅ Save custom templates to localStorage
3. ✅ Template selector (choose from custom or default)
4. ✅ Import/export JSON
5. ✅ Basic validation (check for undefined tokens)
6. ✅ Custom token creation (manual JSON editing acceptable for MVP)

**Defer to Later:**
- ❌ Template marketplace/community library
- ❌ Advanced conditionals (if/else logic)
- ❌ Cloud sync across devices
- ❌ Rich text editor (start with plain text)
- ❌ Template collaboration features
- ❌ Admin controls for institutional deployment

## Success Metrics

**Adoption:** 80% of users create ≥1 custom template within 30 days  
**Diversity:** Average user has 3+ custom templates  
**Satisfaction:** 4.5/5 rating on template features  
**Time Savings:** 30% reduction in note generation time

## Technical Approach

**Storage:** Continue using localStorage, add import/export for backup  
**Format:** JSON structure for templates  
**Editor:** Start with `<textarea>`, upgrade to rich editor in v2  
**Validation:** Client-side validation before save  
**Backward Compatibility:** Preserve all existing default templates

## Sample Template JSON

```json
{
  "id": "custom-sah-v1",
  "name": "My Custom SAH Template",
  "version": "1.0",
  "author": "Dr. Chen",
  "service": "NeuroICU",
  "diagnosisTypes": ["sah"],
  "body": "*** SAH NOTE ***\nDate: @TODAY@\nPatient: @NAME@\n...",
  "customTokens": [
    {
      "token": "@ATTENDING@",
      "label": "Attending Physician",
      "defaultValue": "[Attending name]"
    }
  ],
  "tags": ["sah", "academic"]
}
```

## Next Steps

1. **Review & Feedback** - Share requirements doc with key stakeholders
2. **UI Mockup** - Create wireframes for template editor
3. **Technical Spike** - Prototype token autocomplete and validation
4. **MVP Planning** - Define exact scope for first release
5. **Implementation** - Build template editor and storage system
6. **Testing** - Alpha/beta testing with real users

## Questions to Resolve

1. Should we support multiple export formats (JSON, YAML, XML)?
2. Do we need template versioning in MVP or can it wait?
3. Should custom tokens be editable in UI or JSON-only initially?
4. Maximum number of templates per user? (storage limits)
5. How to handle template conflicts on import? (overwrite vs merge)

## Reference Documents

- **Full Requirements:** [TEMPLATE_CUSTOMIZATION_REQUIREMENTS.md](./TEMPLATE_CUSTOMIZATION_REQUIREMENTS.md)
- **Current Customization Guide:** [CUSTOMIZATION.md](./CUSTOMIZATION.md)
- **User Guide:** [USER_GUIDE.md](./USER_GUIDE.md)
- **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)

---

**Contact:** Open GitHub issue for questions or feedback
