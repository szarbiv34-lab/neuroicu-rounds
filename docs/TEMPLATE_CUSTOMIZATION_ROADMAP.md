# Implementation Roadmap: Customizable Rounding Templates

**Status:** Planning Phase  
**Related Documents:**
- [Requirements](./TEMPLATE_CUSTOMIZATION_REQUIREMENTS.md)
- [Summary](./TEMPLATE_CUSTOMIZATION_SUMMARY.md)

## Overview

This roadmap breaks down the implementation of customizable rounding templates into manageable phases.

## Phase 0: Foundation (Current State)

**Status:** ✅ Complete

- [x] Hard-coded templates in `src/smartphrases.ts`
- [x] Token-based replacement system
- [x] Basic template rendering
- [x] Documentation of current system

## Phase 1: MVP - Basic Customization (4-6 weeks)

**Goal:** Enable users to create and use custom templates without coding

### 1.1 Data Model & Storage (Week 1)

**Tasks:**
- [ ] Define TypeScript type for `CustomTemplate` 
- [ ] Extend `RoundingSheet` type to include `customTemplateId`
- [ ] Create template storage in localStorage (separate from patient data)
- [ ] Migration function for existing users
- [ ] Unit tests for storage layer

**Deliverables:**
- `src/types.ts` updated with template types
- Template storage functions in new `src/templateStorage.ts`
- Migration tested with existing data

### 1.2 Template Management UI (Week 2-3)

**Tasks:**
- [ ] Create `TemplateManager` component
- [ ] Template list view (shows default + custom templates)
- [ ] "New Template" button and form
- [ ] Template metadata input (name, description, service, diagnosis)
- [ ] Template body editor (plain textarea for MVP)
- [ ] Save/cancel/delete buttons
- [ ] Basic validation (name required, no duplicate IDs)

**Deliverables:**
- `src/TemplateManager.tsx` component
- Accessible from Settings or Plan tab
- Can create, view, edit, delete custom templates

### 1.3 Template Selection (Week 3)

**Tasks:**
- [ ] Update template selector in Plan tab
- [ ] Show both default and custom templates
- [ ] Template preview tooltip on hover
- [ ] Auto-select based on diagnosis (prefer custom if available)
- [ ] Manual override selection
- [ ] Template metadata display

**Deliverables:**
- Enhanced template dropdown in `RoundingApp.tsx`
- Visual distinction between default and custom templates
- Preview functionality

### 1.4 Import/Export (Week 4)

**Tasks:**
- [ ] Export template to JSON file
- [ ] Import template from JSON file
- [ ] Validation on import (check schema, prevent duplicates)
- [ ] Conflict resolution (rename on import if duplicate)
- [ ] Export all templates (bulk export)
- [ ] User feedback (success/error messages)

**Deliverables:**
- Import/export buttons in TemplateManager
- JSON schema validation
- Error handling and user messaging

### 1.5 Testing & Documentation (Week 5-6)

**Tasks:**
- [ ] Manual testing of all flows
- [ ] User acceptance testing with 3-5 beta users
- [ ] Update USER_GUIDE.md with template customization instructions
- [ ] Create video tutorial (optional)
- [ ] Address feedback and bugs
- [ ] Performance testing (100+ templates)

**Deliverables:**
- Beta test report
- Updated documentation
- Bug fixes
- Performance benchmarks

**MVP Release Criteria:**
- ✅ Users can create custom templates via UI
- ✅ Custom templates render correctly with patient data
- ✅ Import/export works reliably
- ✅ No data loss or corruption
- ✅ Performance acceptable (no lag in UI)
- ✅ Documentation complete

---

## Phase 2: Enhanced Features (6-8 weeks)

**Goal:** Add advanced features for power users and institutions

### 2.1 Custom Token System (Week 7-9)

**Tasks:**
- [ ] Custom token creation UI
- [ ] Token library browser (shows all available tokens)
- [ ] Token autocomplete in template editor
- [ ] Custom token storage and management
- [ ] Default values for custom tokens
- [ ] Token validation (prevent circular references)
- [ ] Token preview with sample data

**Deliverables:**
- Token management UI in TemplateManager
- Autocomplete in template editor
- Token library viewer

### 2.2 Template Versioning (Week 10-11)

**Tasks:**
- [ ] Version history storage (last 10 versions)
- [ ] View version history UI
- [ ] Compare versions (diff view)
- [ ] Restore previous version
- [ ] Version metadata (timestamp, author)
- [ ] Auto-save drafts

**Deliverables:**
- Version history viewer
- Diff comparison UI
- Restore functionality

### 2.3 Template Organization (Week 12-13)

**Tasks:**
- [ ] Search templates by name or content
- [ ] Filter by service, diagnosis, tags
- [ ] Favorite/pin templates
- [ ] Recently used templates
- [ ] Sort templates (alphabetical, most used, newest)
- [ ] Template tags/categories
- [ ] Bulk operations (delete, export multiple)

**Deliverables:**
- Search and filter UI
- Favorites system
- Enhanced template list view

### 2.4 Validation & Quality (Week 14)

**Tasks:**
- [ ] Required field validation
- [ ] Warn on empty critical sections
- [ ] Template completeness score
- [ ] Syntax highlighting in editor
- [ ] Real-time error detection
- [ ] Template quality suggestions (AI-powered optional)

**Deliverables:**
- Validation engine
- Error highlighting in editor
- Quality feedback UI

---

## Phase 3: Advanced Features (8-10 weeks)

**Goal:** Enterprise features and polish

### 3.1 Conditional Sections (Week 15-17)

**Tasks:**
- [ ] Define conditional syntax (e.g., `{{#if diagnosis == "sah"}}...{{/if}}`)
- [ ] Parser for conditional logic
- [ ] Support for if/else/endif
- [ ] Nested conditionals
- [ ] Conditional validation
- [ ] UI helper for creating conditionals
- [ ] Documentation and examples

**Deliverables:**
- Conditional rendering engine
- Syntax documentation
- UI helpers for common conditionals

### 3.2 Rich Template Editor (Week 18-20)

**Tasks:**
- [ ] Integrate rich text editor library (e.g., Monaco, CodeMirror)
- [ ] Syntax highlighting for tokens
- [ ] Auto-indentation and formatting
- [ ] Code folding
- [ ] Find/replace
- [ ] Keyboard shortcuts
- [ ] Dark mode support

**Deliverables:**
- Advanced editor component
- Enhanced editing experience
- Keyboard shortcut documentation

### 3.3 Template Marketplace (Week 21-23)

**Tasks:**
- [ ] Design marketplace UI
- [ ] Browse community templates
- [ ] Template ratings and reviews
- [ ] One-click import from marketplace
- [ ] Submit template to marketplace
- [ ] Moderation workflow
- [ ] Trending/popular templates
- [ ] Category browsing

**Deliverables:**
- Marketplace UI (in-app or web)
- Submission and moderation system
- Rating/review system

### 3.4 Cloud Sync (Week 24)

**Tasks:**
- [ ] Choose cloud provider (Firebase, Supabase, etc.)
- [ ] Authentication system
- [ ] Cloud storage for templates
- [ ] Sync across devices
- [ ] Conflict resolution
- [ ] Offline support
- [ ] Privacy controls

**Deliverables:**
- Cloud sync functionality
- Multi-device support
- Privacy documentation

---

## Phase 4: Enterprise Features (10-12 weeks)

**Goal:** Features for institutional deployment

### 4.1 Admin Controls

**Tasks:**
- [ ] Admin dashboard
- [ ] Department-level template libraries
- [ ] Template approval workflow
- [ ] Lock templates (prevent editing)
- [ ] Template distribution to team
- [ ] Usage analytics

### 4.2 Access Control

**Tasks:**
- [ ] Role-based permissions (admin, editor, viewer)
- [ ] Template sharing permissions
- [ ] Audit logs
- [ ] Department hierarchy

### 4.3 EHR Integration

**Tasks:**
- [ ] EPIC integration (SmartPhrase export)
- [ ] Cerner integration
- [ ] FHIR compliance
- [ ] HL7 support
- [ ] API documentation

---

## Success Metrics by Phase

### Phase 1 (MVP)
- **Target:** 50% of users create ≥1 custom template
- **Measurement:** Template creation analytics
- **Timeline:** 3 months after release

### Phase 2 (Enhanced)
- **Target:** 75% adoption, avg 3+ templates per user
- **Measurement:** Usage analytics
- **Timeline:** 6 months after release

### Phase 3 (Advanced)
- **Target:** 90% adoption, template sharing active
- **Measurement:** Import/export analytics, marketplace activity
- **Timeline:** 9 months after release

### Phase 4 (Enterprise)
- **Target:** 5+ institutional deployments
- **Measurement:** Enterprise licenses, admin dashboard usage
- **Timeline:** 12 months after release

---

## Risk Assessment

### High-Risk Items

1. **Data Migration** - Risk of data loss when updating storage format
   - **Mitigation:** Thorough testing, backup/restore functionality

2. **Performance** - Template rendering could be slow with complex templates
   - **Mitigation:** Performance testing, optimization, caching

3. **User Adoption** - Users may not want to customize
   - **Mitigation:** Make defaults excellent, show value proposition

4. **Template Errors** - Invalid templates crash app
   - **Mitigation:** Robust validation, fallback to default template

### Medium-Risk Items

1. **Browser Compatibility** - localStorage limits vary by browser
   - **Mitigation:** Detect limits, warn users, cloud sync in phase 3

2. **User Experience** - Template editor too complex
   - **Mitigation:** User testing, iterative design, help documentation

3. **Maintenance** - Many custom features increase maintenance burden
   - **Mitigation:** Modular design, comprehensive testing, clear docs

---

## Dependencies

### External Dependencies

- **UI Library:** None (using React built-ins)
- **Editor:** Monaco Editor or CodeMirror (Phase 3)
- **Cloud:** Firebase/Supabase (Phase 3)
- **Testing:** Jest, React Testing Library

### Internal Dependencies

- Must not break existing template system
- Must maintain backward compatibility
- Must preserve patient data integrity

---

## Open Questions

1. **Bundle Size:** Will adding editor library bloat app too much?
2. **Mobile Support:** Should template editing work on mobile?
3. **Offline:** How to handle offline template creation?
4. **Conflicts:** How to merge conflicting template changes?
5. **Analytics:** What usage data should we collect (privacy)?

---

## Resource Requirements

### Phase 1 (MVP)
- **Development:** 1 engineer, 6 weeks
- **Design:** 1 designer, 2 weeks (UI mockups)
- **Testing:** 5 beta users, 2 weeks
- **Total Effort:** ~8 week-equivalents

### Phase 2 (Enhanced)
- **Development:** 1 engineer, 8 weeks
- **Testing:** 10 users, ongoing
- **Total Effort:** ~8 week-equivalents

### Phase 3 (Advanced)
- **Development:** 1-2 engineers, 10 weeks
- **Design:** 1 designer, 2 weeks (marketplace UI)
- **DevOps:** 1 engineer, 2 weeks (cloud setup)
- **Total Effort:** ~14 week-equivalents

### Phase 4 (Enterprise)
- **Development:** 2 engineers, 12 weeks
- **Sales/Marketing:** 1 person, ongoing
- **Support:** 1 person, ongoing
- **Total Effort:** ~24 week-equivalents

**Grand Total:** ~54 week-equivalents across all phases

---

## Review Schedule

- **Monthly:** Review progress against roadmap
- **Quarterly:** Adjust priorities based on user feedback
- **Bi-annually:** Major feature planning and resource allocation

---

**Last Updated:** 2026-01-15  
**Next Review:** 2026-02-15
