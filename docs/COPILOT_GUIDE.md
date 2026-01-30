# GitHub Copilot Setup Guide

This repository is configured to work seamlessly with GitHub Copilot, including the Copilot coding agent. This guide explains how to make the most of Copilot when working on this project.

## What's Configured

### 1. Copilot Instructions (`.github/copilot-instructions.md`)

Comprehensive instructions that tell Copilot about:
- Repository structure and purpose
- Code conventions and style guidelines
- Development workflow (build, test, deploy)
- Clinical content requirements
- Key patterns and architecture decisions
- Common tasks and how to approach them

These instructions are automatically used by:
- GitHub Copilot in VS Code
- GitHub Copilot Chat
- GitHub Copilot coding agent

### 2. Issue Templates (`.github/ISSUE_TEMPLATE/`)

Pre-configured templates for creating well-scoped issues:

- **🐛 Bug Report** (`bug_report.yml`) - For reporting bugs with structured fields
- **✨ Feature Request** (`feature_request.yml`) - For proposing new features with clinical context
- **🤖 Copilot Task** (`copilot_task.yml`) - Optimized for Copilot coding agent with acceptance criteria
- **📝 Documentation** (`documentation.yml`) - For documentation improvements

### 3. Code Owners (`.github/CODEOWNERS`)

Defines reviewers for different parts of the codebase, especially important for:
- Clinical content requiring medical accuracy review
- Type definitions that affect the entire codebase
- Documentation changes

## Using GitHub Copilot Coding Agent

### Creating Tasks for Copilot

Use the **Copilot Task** issue template when creating issues you want Copilot to work on. The template guides you to provide:

1. **Task Type** - Bug fix, feature, refactoring, etc.
2. **Clear Objective** - What needs to be done
3. **Detailed Description** - Implementation details and context
4. **Files to Modify** - Which files are affected
5. **Acceptance Criteria** - How to verify completion
6. **Additional Context** - References, examples, constraints

### Best Practices

#### ✅ Good Tasks for Copilot

- Adding a new clinical score calculator
- Creating SmartPhrase templates
- UI/UX improvements
- Documentation updates
- Bug fixes with clear reproduction steps
- TypeScript type refinements

#### ⚠️ Requires Human Review

- Medical accuracy verification for clinical content
- Security considerations for patient data handling
- Architecture decisions
- Breaking changes to the API

### Example Workflow

1. **Create an Issue**
   ```
   Use the Copilot Task template
   Title: "[Task]: Add ASPECTS calculator for stroke patients"
   ```

2. **Assign to Copilot**
   - GitHub will automatically detect Copilot-friendly issues
   - Or manually assign using the Copilot coding agent interface

3. **Review the PR**
   - Copilot creates a draft PR with proposed changes
   - Review code quality, medical accuracy, and adherence to conventions
   - Request changes via PR comments if needed

4. **Approve and Merge**
   - Once satisfied, approve the PR
   - Merge following standard procedures

## Copilot in Your Editor

### VS Code Setup

1. Install the [GitHub Copilot extension](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
2. Copilot will automatically use the `.github/copilot-instructions.md` file
3. Chat with Copilot using Cmd+I (Mac) or Ctrl+I (Windows)

### Copilot Chat Examples

Ask Copilot context-aware questions:

```
# Code generation
"Create a new clinical score for mRS (Modified Rankin Scale)"

# Code explanation
"Explain how the SmartPhrase token replacement works"

# Debugging
"Why might the localStorage persistence fail?"

# Refactoring
"Refactor the GCS calculator to use a cleaner pattern"
```

## Medical Accuracy Requirements

⚠️ **Critical for Clinical Content**

When Copilot suggests changes to clinical content:

1. **Verify calculations** against published literature
2. **Check references** - Are citations accurate and appropriate?
3. **Test edge cases** - Do scores handle min/max values correctly?
4. **Review medical logic** - Are clinical decision rules correct?

All clinical scores must include:
- Medical references in code comments
- Validation against known reference values
- Documentation of scoring criteria

## Project-Specific Patterns

### Adding a New Clinical Score

Copilot knows to:
1. Add type definition to `src/types.ts`
2. Update `ClinicalScores` type union
3. Implement calculator in `src/ClinicalScores.tsx`
4. Include medical references and citations
5. Test against published examples

### Creating SmartPhrase Templates

Copilot knows to:
1. Add template to `TEMPLATES` array in `src/smartphrases.ts`
2. Use existing tokens from `smartphraseEngine.ts`
3. Follow medical note formatting conventions
4. Test rendering with sample data

## Tips for Working with Copilot

### 1. Provide Context

When asking Copilot for help, reference specific files and patterns:
```
"Following the pattern in ClinicalScores.tsx, create a calculator for the FOUR score"
```

### 2. Use Type Safety

Copilot respects TypeScript types. Always:
- Use existing types from `types.ts`
- Define explicit return types
- Export reusable types

### 3. Medical References

Always ask Copilot to include citations:
```
"Add a calculator for the DRAGON score and include the original citation"
```

### 4. Incremental Changes

Break large tasks into smaller, focused issues:
```
Good: "Add GCS calculator to Scores tab"
Better: "Add GCS calculator component" + "Integrate GCS into Scores tab" + "Add GCS to SmartPhrase tokens"
```

## Troubleshooting

### Copilot Suggestions Don't Match Project Style

- Check that `.github/copilot-instructions.md` is up to date
- Provide more specific context in your prompts
- Reference existing code patterns explicitly

### Medical Accuracy Concerns

- Always verify clinical content independently
- Use Copilot for structure and boilerplate
- Human review required for all medical logic

### Build Errors After Copilot Changes

```bash
# Check TypeScript errors
npm run build

# Verify all types are correct
# Ensure imports are correct
# Check that React patterns are followed
```

## Resources

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Copilot Coding Agent Guide](https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-code-review)
- [Best Practices for Copilot](https://github.blog/developer-skills/github/how-to-use-github-copilot-in-your-ide-tips-tricks-and-best-practices/)

## Feedback

If you have suggestions for improving the Copilot integration, please:
1. Open an issue using the "Documentation" template
2. Describe what could be clearer in the Copilot instructions
3. Share examples of prompts that worked well or didn't work

---

**Remember**: GitHub Copilot is a powerful assistant, but human review and medical expertise are essential for this healthcare application.
