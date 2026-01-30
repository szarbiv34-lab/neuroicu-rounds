# Contributing to Neuro ICU Rounding App

Thank you for your interest in contributing! This document provides guidelines and information for contributors.

## 🎯 Ways to Contribute

- **Report bugs**: Open an issue describing the problem
- **Suggest features**: Propose new clinical scores, templates, or workflow improvements
- **Improve documentation**: Help clarify setup, usage, or code documentation
- **Submit code**: Fix bugs, add features, or improve performance
- **Add clinical content**: Contribute new SmartPhrase templates or scoring systems

## 🚀 Getting Started

### 1. Fork and Clone

```sh
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/neuroicu-rounds.git
cd neuroicu-rounds

# Add upstream remote
git remote add upstream https://github.com/szarbiv34-lab/neuroicu-rounds.git
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Create a Branch

```sh
# Create a branch for your feature or fix
git checkout -b feature/your-feature-name

# Or for bug fixes:
git checkout -b fix/issue-description
```

### 4. Make Your Changes

- Write clear, readable code
- Follow existing code style and conventions
- Add comments for complex logic
- Test your changes thoroughly

### 5. Test Your Changes

```sh
# Build the project to check for TypeScript errors
npm run build

# Start the dev server and test manually
npm run dev
```

### 6. Commit and Push

```sh
# Stage your changes
git add .

# Commit with a clear message
git commit -m "Add ASPECTS calculator for stroke patients"

# Push to your fork
git push origin feature/your-feature-name
```

### 7. Open a Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Describe your changes clearly
4. Reference any related issues
5. Wait for review and address any feedback

## 📝 Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define explicit types for function parameters and return values
- Use existing types from `types.ts` when possible
- Export types that might be reused

```typescript
// Good
function calculateGCS(eye: number, verbal: number, motor: number): number {
  return eye + verbal + motor;
}

// Avoid
function calculateGCS(e, v, m) {
  return e + v + m;
}
```

### React Components

- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use meaningful prop names

```typescript
// Good
interface PatientHeaderProps {
  patientName: string;
  room?: string;
  diagnosisType: DiagnosisType;
}

function PatientHeader({ patientName, room, diagnosisType }: PatientHeaderProps) {
  // Component implementation
}
```

### Naming Conventions

- **Components**: PascalCase (e.g., `ClinicalScores`, `RoundingApp`)
- **Functions**: camelCase (e.g., `calculateICHScore`, `renderSmartPhrase`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `HUNT_HESS_DESCRIPTIONS`, `DEFAULT_TEMPLATE_ID`)
- **Types/Interfaces**: PascalCase (e.g., `RoundingSheet`, `SAHScores`)

### Comments

- Add JSDoc comments for exported functions
- Explain "why" not "what" in inline comments
- Document medical calculations with references

```typescript
/**
 * Calculates ICH score (0-6) based on clinical and imaging parameters.
 * Higher scores correlate with increased 30-day mortality.
 * Reference: Hemphill JC et al. Stroke. 2001;32(4):891-7
 */
function calculateICHScore(params: ICHScoreParams): number {
  // Implementation
}
```

## 🧪 Testing Guidelines

Currently, this project relies on manual testing. When making changes:

### Manual Testing Checklist

- [ ] Test all affected features in the UI
- [ ] Verify data persists correctly in localStorage
- [ ] Check that SmartPhrase templates render correctly
- [ ] Test on both desktop and mobile viewports
- [ ] Verify clinical calculations against reference values
- [ ] Ensure no console errors in browser DevTools

### Testing Clinical Calculations

When adding or modifying clinical scores:

1. **Verify accuracy**: Cross-reference calculations with published literature
2. **Test edge cases**: Min/max values, missing data, invalid inputs
3. **Document sources**: Include citations for scoring systems
4. **Add examples**: Include sample calculations in code comments

## 🏥 Adding Clinical Content

### Adding a New SmartPhrase Template

1. Open `src/smartphrases.ts`
2. Add your template to the `TEMPLATES` array:

```typescript
{
  id: "neuroicu-mytemplate",
  label: ".NEUROICU_MYTEMPLATE",
  service: "NeuroICU",
  body: `
*** YOUR TEMPLATE TITLE ***
Date: @TODAY@
Patient: @NAME@ @ROOM@

[Your template content with tokens]
  `.trim(),
}
```

3. Available tokens are defined in `smartphraseEngine.ts`
4. Test your template with sample data

### Adding a New Clinical Score

1. Open `src/types.ts` and add your score type:

```typescript
export type MyScore = {
  parameter1?: number;
  parameter2?: string;
  calculatedResult?: number;
};
```

2. Add the score to `ClinicalScores` type:

```typescript
export type ClinicalScores = {
  // ... existing scores
  myScore?: MyScore;
};
```

3. Implement the calculator in `src/ClinicalScores.tsx`:

```typescript
function MyScoreCalculator({ value, onChange }: ScoreProps<MyScore>) {
  // Calculator UI implementation
  return (
    <div>
      {/* Calculator interface */}
    </div>
  );
}
```

4. Add documentation and reference citations in comments

### Adding a New Diagnosis Type

1. Update the `DiagnosisType` union in `src/types.ts`
2. Add label to `DIAGNOSIS_TYPE_LABELS` in `RoundingApp.tsx`
3. (Optional) Add template mapping in `DIAGNOSIS_TEMPLATE_MAP`
4. (Optional) Add diagnosis defaults in `DIAGNOSIS_DEFAULTS`

## 🐛 Reporting Bugs

When reporting bugs, please include:

- **Description**: Clear description of the problem
- **Steps to reproduce**: Exact steps to trigger the bug
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Environment**: Browser version, OS, Node.js version
- **Screenshots**: If applicable, add screenshots

### Bug Report Template

```markdown
### Bug Description
[Clear description of the bug]

### Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Enter '...'
4. See error

### Expected Behavior
[What you expected to happen]

### Actual Behavior
[What actually happened]

### Environment
- Browser: Chrome 120.0
- OS: macOS 14.0
- Node.js: 20.10.0

### Screenshots
[If applicable]
```

## 💡 Suggesting Features

We welcome feature suggestions! Please include:

- **Use case**: Describe the clinical scenario or workflow need
- **Proposed solution**: How you envision the feature working
- **Alternatives**: Other approaches you've considered
- **Clinical value**: How this improves patient care or workflow

## 📊 Issue Triage & Information Gathering

Before starting implementation on complex features or unclear issues, we use a structured information gathering process to ensure we have all the necessary details.

### When to Use Information Gathering

Use the **Information Gathering / Triage** issue template when:

- Requirements are unclear or incomplete
- Technical approach needs investigation
- Multiple solutions need evaluation
- Clinical accuracy verification is required
- Dependencies or impacts need assessment
- Stakeholder input is needed before proceeding

### Creating Parent/Epic Issues

For large initiatives that span multiple related tasks, use the **Parent Issue / Epic** template to:

1. **Organize work**: Break down complex features into manageable sub-issues
2. **Track progress**: Use checklists to monitor completion of related tasks
3. **Coordinate effort**: Ensure all stakeholders understand scope and dependencies
4. **Document decisions**: Keep context and rationale in one place

### Triage Process

1. **Create info-gathering issue**: Use the template to document what needs clarification
2. **List key questions**: Enumerate specific questions that need answers
3. **Identify stakeholders**: Tag relevant experts or team members
4. **Gather information**: Collect requirements, research options, verify clinical accuracy
5. **Document findings**: Update the issue with answers and decisions
6. **Create implementation issues**: Once clarity is achieved, create focused task issues
7. **Link related issues**: Connect sub-issues to parent epic for tracking

### Example Workflow

For a complex feature request:

1. Create a **Parent Issue** using the Epic template to define overall scope
2. Create **Information Gathering** sub-issues for each area needing clarification:
   - Technical feasibility investigation
   - Clinical accuracy requirements
   - UI/UX design considerations
   - Performance impact assessment
3. Once information is gathered, create **Implementation** sub-issues using Copilot Task or Feature templates
4. Update parent issue checklist as work progresses
5. Close parent issue when all sub-issues are complete

### Benefits

- **Reduces rework**: Clarify requirements before coding
- **Better estimates**: Understand scope before committing to timelines
- **Improved quality**: Ensure clinical accuracy and technical soundness
- **Clear decisions**: Document why choices were made
- **Team alignment**: Keep everyone informed and coordinated

## 📋 Code Review Process

1. **Automated checks**: Code must build without errors
2. **Review**: At least one maintainer will review your PR
3. **Feedback**: Address any requested changes
4. **Medical accuracy**: Clinical content will be verified for accuracy
5. **Merge**: Once approved, your PR will be merged

## 🎓 Learning Resources

### React & TypeScript
- [React documentation](https://react.dev/)
- [TypeScript handbook](https://www.typescriptlang.org/docs/)
- [Vite guide](https://vitejs.dev/guide/)

### Clinical References
- [Hunt & Hess Scale](https://www.ncbi.nlm.nih.gov/books/NBK560538/)
- [Modified Fisher Scale](https://radiopaedia.org/articles/modified-fisher-scale)
- [ICH Score](https://www.mdcalc.com/calc/1894/ich-score)
- [NIHSS](https://www.ninds.nih.gov/health-information/public-education/know-stroke/health-professionals/nih-stroke-scale)

## ❓ Questions?

- Open a GitHub issue with the `question` label
- Review existing issues and discussions
- Check the README for common troubleshooting steps

## 📜 Code of Conduct

- Be respectful and professional
- Focus on constructive feedback
- Remember this is a healthcare application - accuracy and safety are paramount
- Help create an inclusive environment for all contributors

## 🙏 Thank You!

Every contribution helps improve patient care workflows. Thank you for taking the time to contribute to this project!
