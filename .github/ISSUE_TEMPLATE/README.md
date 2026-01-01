# Issue Templates Guide

This directory contains GitHub issue templates for organizing different types of contributions and work items.

## Available Templates

### 🐛 Bug Report (`bug_report.yml`)
Use for reporting bugs or unexpected behavior in the application.

**When to use:**
- Application crashes or errors
- Incorrect calculations in clinical scores
- UI/layout problems
- Data persistence issues
- Deployment failures

**Key sections:**
- Clear reproduction steps
- Expected vs actual behavior
- Environment details
- Screenshots for visual issues

---

### ✨ Feature Request (`feature_request.yml`)
Use for suggesting new features or enhancements.

**When to use:**
- Proposing new clinical scores
- Requesting new SmartPhrase templates
- Suggesting UI/UX improvements
- Requesting workflow enhancements

**Key sections:**
- Clinical use case and value
- Proposed solution
- Acceptance criteria
- Clinical references (if applicable)

---

### 🤖 Copilot Task (`copilot_task.yml`)
Use for creating well-scoped tasks optimized for GitHub Copilot coding agent.

**When to use:**
- Creating atomic, focused development tasks
- Assigning work to GitHub Copilot
- Tasks with clear acceptance criteria
- Well-defined bug fixes or small features

**Best practices:**
- Keep scope small (< 200 lines changed)
- Provide specific file paths
- List clear acceptance criteria
- Include implementation details

---

### 📝 Documentation (`documentation.yml`)
Use for documentation improvements or updates.

**When to use:**
- Unclear or missing documentation
- Outdated instructions
- New features needing documentation
- Improving code comments

**Key sections:**
- Location of documentation issue
- Suggested improvements
- Affected documentation type

---

### 📊 Information Gathering / Triage (`information_gathering.yml`)
Use for collecting requirements and clarifications before development.

**When to use:**
- Requirements are unclear
- Technical approach needs investigation
- Clinical accuracy needs verification
- Multiple solutions need evaluation
- Stakeholder input required

**Workflow:**
1. Create issue to document unknowns
2. List key questions needing answers
3. Identify and consult stakeholders
4. Document findings and decisions
5. Create implementation issues once clear

**Example scenarios:**
- "Do we need to support ASPECTS score variants?"
- "What is the correct mortality calculation for ICH score?"
- "Which clinical references should we cite for NIHSS?"
- "Should we store data in localStorage or IndexedDB?"

---

### 🎯 Parent Issue / Epic (`parent_issue.yml`)
Use for organizing multiple related sub-issues into larger initiatives.

**When to use:**
- Major features spanning multiple PRs
- Architecture improvements
- Large documentation overhauls
- Clinical content expansions
- Cross-cutting initiatives

**Workflow:**
1. Create parent issue defining overall scope
2. Break down into logical sub-issues
3. Create sub-issues and link to parent
4. Update checklist as work completes
5. Close when all sub-issues done

**Example epics:**
- "Add comprehensive stroke workflow support"
- "Implement offline-first architecture"
- "Expand clinical scoring library"
- "Performance optimization initiative"

---

## Choosing the Right Template

### Decision Tree

```
Is this about a bug or error?
  └─ Yes → Use Bug Report

Is this about documentation?
  └─ Yes → Use Documentation

Do you need to gather information first?
  └─ Yes → Use Information Gathering

Is this a large initiative with multiple parts?
  └─ Yes → Use Parent Issue/Epic
         → Create sub-issues for each part

Is this a well-defined task for Copilot?
  └─ Yes → Use Copilot Task

Is this a feature request?
  └─ Yes → Use Feature Request
```

## Template Relationships

### Typical Flow for Complex Features

```
1. Create Parent Issue (Epic)
   ├─ 2. Create Information Gathering sub-issues
   │    ├─ Research clinical requirements
   │    ├─ Evaluate technical approaches
   │    └─ Assess performance impact
   ├─ 3. Create Implementation sub-issues (after info gathered)
   │    ├─ Add clinical score calculator (Copilot Task)
   │    ├─ Add SmartPhrase template (Copilot Task)
   │    └─ Update UI components (Copilot Task)
   └─ 4. Create Documentation sub-issue
        └─ Update user guide and architecture docs
```

## Tips for Effective Issues

### General Best Practices

1. **Be specific**: Vague issues lead to unclear solutions
2. **One issue per problem**: Don't combine multiple unrelated requests
3. **Link related issues**: Use GitHub's linking syntax (#123)
4. **Update as needed**: Add information as you learn more
5. **Close when done**: Don't leave stale issues open

### For Medical/Clinical Content

1. **Include citations**: Reference clinical literature for scores/formulas
2. **Verify accuracy**: Double-check calculations against published sources
3. **Note variations**: Document any regional or institutional differences
4. **Consider edge cases**: What happens with missing data or invalid inputs?

### For Technical Issues

1. **Provide context**: What have you tried? What works elsewhere?
2. **Include versions**: Browser, Node.js, dependency versions
3. **Minimal reproduction**: Strip down to simplest failing case
4. **Expected behavior**: What should happen vs what does happen

## Label System

Issues are automatically labeled based on template:

- `bug` - Bug reports
- `enhancement` - Feature requests
- `documentation` - Documentation issues
- `copilot-task` - Tasks for Copilot
- `triage` - Information gathering
- `epic` - Parent/tracking issues

Additional labels can be added manually:

- `good first issue` - Suitable for newcomers
- `help wanted` - Extra attention needed
- `priority:high` - Urgent work
- `clinical-accuracy` - Needs medical verification
- `security` - Security implications
- `performance` - Performance related

## Questions?

If you're unsure which template to use:

1. Check this guide's decision tree
2. Review existing issues for similar examples
3. Ask in GitHub Discussions
4. When in doubt, start with Information Gathering template
5. Templates can always be adjusted after creation

## Continuous Improvement

These templates evolve based on team needs. If you have suggestions for improving them:

1. Open a Documentation issue
2. Describe what's unclear or could be better
3. Suggest specific improvements
4. Link to examples where current templates fell short
