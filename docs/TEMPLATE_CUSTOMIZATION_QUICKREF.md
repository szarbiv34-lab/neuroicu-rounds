# Quick Reference: Customizable Rounding Templates

**Generated:** 2026-01-15  
**For:** GitHub Issue - Clarify user requirements for customizable rounding templates

---

## 📄 What Was Delivered

Three comprehensive documents detailing requirements for customizable rounding templates:

### 1. Full Requirements Document
**File:** [docs/TEMPLATE_CUSTOMIZATION_REQUIREMENTS.md](./TEMPLATE_CUSTOMIZATION_REQUIREMENTS.md)  
**Size:** ~35KB  
**Read Time:** 25-30 minutes

**Use this for:**
- Complete technical specification
- Implementation reference
- Detailed user stories and workflows
- Compliance and regulatory requirements

### 2. Executive Summary
**File:** [docs/TEMPLATE_CUSTOMIZATION_SUMMARY.md](./TEMPLATE_CUSTOMIZATION_SUMMARY.md)  
**Size:** ~6KB  
**Read Time:** 5 minutes

**Use this for:**
- Quick overview for stakeholders
- Decision-making on priorities
- Understanding MVP scope
- High-level planning

### 3. Implementation Roadmap
**File:** [docs/TEMPLATE_CUSTOMIZATION_ROADMAP.md](./TEMPLATE_CUSTOMIZATION_ROADMAP.md)  
**Size:** ~11KB  
**Read Time:** 10-15 minutes

**Use this for:**
- Development planning
- Resource allocation
- Timeline estimation
- Risk assessment

---

## 🎯 Key Takeaways (TL;DR)

### Problem
- Current templates are hard-coded in TypeScript
- Users cannot customize without coding skills
- No sharing mechanism between users
- One-size-fits-all doesn't work for diverse institutions

### Solution
Build template customization feature in 4 phases:
1. **MVP** (6 weeks) - Basic UI editor, save/load, import/export
2. **Enhanced** (8 weeks) - Custom tokens, versioning, organization
3. **Advanced** (10 weeks) - Conditionals, rich editor, marketplace
4. **Enterprise** (12 weeks) - Admin controls, access management, EHR integration

### MVP Features (Recommended First Release)
- ✅ Template editor UI (plain text)
- ✅ Save custom templates to localStorage
- ✅ Import/export JSON files
- ✅ Template selection dropdown
- ✅ Basic validation
- ⏱️ **Estimated:** 6 weeks development

### Expected Impact
- **80%** of users create custom template within 30 days
- **30%** reduction in note generation time
- **25%** template sharing between colleagues
- **4.5/5** user satisfaction rating

---

## 👥 User Personas Identified

1. **Academic Neurointensivist** - Needs teaching notes, research compliance
2. **Community Neurologist** - Wants concise, practical templates
3. **Nurse Practitioner** - Needs mid-level provider formats, handoff templates
4. **Department Chief** - Requires standardization across team

---

## 🔥 Top 10 Pain Points Documented

1. **Hard-coded templates** (HIGH severity) - Can't modify without coding
2. **One-size-fits-all** (MEDIUM) - Doesn't fit all institutions
3. **No versioning** (MEDIUM) - Can't restore previous versions
4. **Limited tokens** (MEDIUM) - Missing custom fields like attending name
5. **No sharing** (LOW) - Can't export to colleagues
6. **Rigid diagnosis mapping** (LOW) - Can't use multiple templates per diagnosis
7. **No preview** (LOW) - Must generate full note to see template
8. **Missing scenarios** (MEDIUM) - No templates for all clinical cases
9. **No validation** (MEDIUM) - Easy to forget required sections
10. **Limited EHR integration** (HIGH) - Manual copy-paste only

---

## 📊 Functional Requirements (Prioritized)

### High Priority (Must Have)
- **FR-1:** Template Editor UI
- **FR-2:** Template Storage
- **FR-3:** Template Selection

### Medium Priority (Should Have)
- **FR-4:** Custom Token System
- **FR-5:** Conditional Sections
- **FR-7:** Multi-Template Management
- **FR-8:** Template Validation

### Low Priority (Nice to Have)
- **FR-6:** Template Marketplace

---

## 🛠️ Technical Recommendations

### Storage
- Continue using localStorage for MVP
- Add import/export for backup
- Consider IndexedDB or cloud in future phases

### Format
- JSON structure for templates
- Schema validation on import
- Max size: 50KB per template

### Editor
- Start with `<textarea>` (simple)
- Upgrade to Monaco/CodeMirror in Phase 3
- Token autocomplete in Phase 2

### Security
- Input sanitization (prevent XSS)
- No PHI in template exports
- Template size limits

---

## 📝 Sample Custom Template

```json
{
  "id": "uh-sah-v1",
  "name": "University Hospital SAH",
  "version": "1.0",
  "service": "NeuroICU",
  "diagnosisTypes": ["sah"],
  "body": "*** SAH NOTE ***\nDate: @TODAY@\nAttending: @ATTENDING@\n...",
  "customTokens": [
    {
      "token": "@ATTENDING@",
      "defaultValue": "[Attending name]"
    }
  ]
}
```

---

## 🚀 Next Steps

### Immediate (Weeks 1-2)
1. Share requirements with stakeholders
2. Gather feedback on priorities
3. Conduct user interviews (5-10 users)
4. Shadow users during rounding

### Short-Term (Months 1-2)
5. Create UI mockups
6. Define exact MVP scope
7. Technical spike (evaluate editor libraries)
8. Prototype token autocomplete

### Implementation (Months 3+)
9. Build Phase 1 (MVP)
10. Alpha testing (small group)
11. Beta testing (larger cohort)
12. Iterate and refine

---

## ❓ Questions to Resolve

**High Priority:**
1. Should template editing work on mobile/tablet?
2. How many template versions to keep in history?
3. What happens on template import conflicts?
4. Should custom tokens be editable in UI or JSON-only for MVP?

**Medium Priority:**
5. Support for multiple export formats (JSON, YAML)?
6. Template size limits (how many KB)?
7. Real-time collaborative editing needed?
8. AI assistance for template generation?

**Low Priority:**
9. Template licensing for shared templates?
10. Multi-language support needed?

---

## 📈 Success Metrics

### Quantitative
- **Adoption:** 80% create ≥1 template in 30 days
- **Usage:** Avg 3+ custom templates per user
- **Time:** 30% reduction in note generation
- **Sharing:** 25% export/import templates
- **Rating:** 4.5/5 satisfaction score

### Qualitative
- Non-technical users can create templates
- Templates support diverse workflows
- System is stable (no data loss)
- Features are discoverable
- Templates are maintainable

---

## 🎓 For Developers

### Where to Start
1. Read [Executive Summary](./TEMPLATE_CUSTOMIZATION_SUMMARY.md) first (5 min)
2. Review [Roadmap](./TEMPLATE_CUSTOMIZATION_ROADMAP.md) for implementation plan
3. Deep dive into [Requirements](./TEMPLATE_CUSTOMIZATION_REQUIREMENTS.md) when coding

### Key Files to Modify
- `src/types.ts` - Add template types
- `src/templateStorage.ts` - New file for storage
- `src/TemplateManager.tsx` - New component for UI
- `src/RoundingApp.tsx` - Update template selection
- `src/smartphrases.ts` - Integrate with custom templates

### Testing Strategy
- Manual testing (no automated tests currently)
- Alpha/beta user testing
- Template import/export validation
- Performance testing (100+ templates)

---

## 📞 Contact & Feedback

- **Questions:** Open GitHub issue with `question` label
- **Feedback:** Comment on original requirements issue
- **Contributions:** See [CONTRIBUTING.md](../CONTRIBUTING.md)

---

**Document Navigation:**
- [← Back to Main README](../README.md)
- [Requirements (Full) →](./TEMPLATE_CUSTOMIZATION_REQUIREMENTS.md)
- [Summary (Quick) →](./TEMPLATE_CUSTOMIZATION_SUMMARY.md)
- [Roadmap (Plan) →](./TEMPLATE_CUSTOMIZATION_ROADMAP.md)
