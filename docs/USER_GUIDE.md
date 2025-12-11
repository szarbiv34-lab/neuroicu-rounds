# User Guide

This guide provides step-by-step instructions for using the Neuro ICU Rounding App effectively.

## 🎯 Overview

The Neuro ICU Rounding App is designed to streamline patient rounds by providing:
- Structured data entry for neurological assessments
- Clinical scoring calculators
- Automated generation of progress notes
- Task and checklist management

## 🏁 Getting Started

### First Time Setup

1. **Open the application** in your web browser (Chrome, Firefox, Safari, or Edge recommended)
2. **Create your first patient** using the "New Patient" button or by modifying the default template
3. **Select the diagnosis type** that matches your patient
4. **Navigate through tabs** to enter patient information

### Understanding the Interface

The app has four main tabs:

1. **Scores**: Clinical calculators specific to the diagnosis
2. **Exam**: Detailed neurological examination findings
3. **Data**: Vitals, labs, imaging, and support
4. **Plan**: SmartPhrase template output for copy/paste

## 📋 Step-by-Step Workflows

### Workflow 1: SAH Patient Initial Documentation

**Scenario**: New patient admitted with subarachnoid hemorrhage

#### Step 1: Patient Setup
1. Click "New Patient" button
2. Enter patient name (e.g., "Doe, Jane")
3. Enter room number (e.g., "NICU-12")
4. Select diagnosis type: "Subarachnoid hemorrhage"
5. Enter hospital day (e.g., "1" for admission day)

#### Step 2: Document Clinical Scores
Navigate to **Scores** tab:

1. **Hunt & Hess Grade**: Select grade based on clinical presentation
   - Grade 1: Asymptomatic or mild headache
   - Grade 2: Moderate-severe headache, nuchal rigidity
   - Grade 3: Drowsy, mild focal deficit
   - Grade 4: Stuporous, moderate-severe hemiparesis
   - Grade 5: Coma, decerebrate posturing

2. **Modified Fisher Scale**: Select based on CT findings
   - Grade 0: No SAH or IVH
   - Grade 1: Thin SAH, no IVH
   - Grade 2: Thin SAH with IVH
   - Grade 3: Thick SAH, no IVH
   - Grade 4: Thick SAH with IVH

3. **Additional SAH Data**:
   - Bleed day (days since rupture)
   - Aneurysm location (e.g., "AComm")
   - Secured status (yes/no)
   - Securing method (clip/coil/flow-diverter)

#### Step 3: Document Neuro Exam
Navigate to **Exam** tab:

1. **Glasgow Coma Scale**:
   - Eye opening (1-4)
   - Verbal response (1-5)
   - Motor response (1-6)
   - Total GCS is calculated automatically

2. **Pupils**:
   - Left: Size (2-8mm) and reactive (yes/no)
   - Right: Size (2-8mm) and reactive (yes/no)

3. **Motor Exam**:
   - Enter strength for each extremity (0-5 scale)
   - Or use free text (e.g., "RUE 4/5, all others 5/5")

4. **ICP Monitoring** (if applicable):
   - ICP value (mmHg)
   - CPP value (mmHg)
   - EVD drainage settings

#### Step 4: Enter Clinical Data
Navigate to **Data** tab:

1. **Vitals**:
   - MAP (e.g., "85")
   - Heart rate (e.g., "72")
   - SpO2 (e.g., "98")
   - Temperature (e.g., "37.2")
   - Ventilator settings (e.g., "RA" or "SIMV 12/5 FiO2 40%")

2. **Lines/Tubes**:
   - Example: "EVD @15cm, A-line, Foley, PIV x2"

3. **Drips**:
   - Example: "Nimodipine 60mg q4h, NS @ 100mL/hr"

4. **Labs**:
   - Example: "WBC 9.2, Hgb 10.5, Plt 245, Na 142, K 3.8, Cr 0.8"

5. **Imaging**:
   - Example: "CT head: AComm SAH, Fisher 4, no hydrocephalus"

6. **Checklist**: Check off completed items
   - Examples: HOB >30°, Neuro exam documented, DVT prophylaxis

#### Step 5: Document Problems and Plan
Scroll to **Problems** section:

1. Click "Add Problem"
2. Enter problem title (e.g., "SAH - vasospasm prevention")
3. Enter assessment (e.g., "Post-coiling HD1, Fisher 4")
4. Enter plan with bullet points:
   ```
   - Nimodipine 60mg q4h x21 days
   - Goal euvolemia, CVP 8-12
   - Daily TCDs starting POD3
   - Neuro checks q1h
   ```

#### Step 6: Generate Note
Navigate to **Plan** tab:

1. Template automatically selected (`.NEUROICU_SAH`)
2. Review the generated note with all fields populated
3. Click "Copy to Clipboard"
4. Paste into your EHR system

**Expected Output**:
```
*** SUBARACHNOID HEMORRHAGE PROGRESS NOTE ***
Date: 2024-12-11
Patient: Doe, Jane (Room NICU-12)
SAH | HD#1

Hunt-Hess: 3  |  Fisher: 4
Bleed Day: 1
Aneurysm: AComm | Secured: coiled

NEUROLOGICAL EXAM:
- GCS: 13 (E3 V4 M6)
- Pupils: L 3mm reactive, R 3mm reactive
- Motor: RUE 4/5, all others 5/5
...
```

### Workflow 2: Stroke Patient Daily Progress Note

**Scenario**: Stroke patient on day 3, need daily progress note

#### Quick Entry Method

1. **Select patient** from dropdown
2. **Update vitals** (Data tab)
3. **Update neuro exam** (Exam tab) - focus on any changes
4. **Check today's labs/imaging** (Data tab)
5. **Update checklist** (check off completed items)
6. **Review/update problems** (modify assessments and plans as needed)
7. **Generate note** (Plan tab)

#### Daily Exam Documentation Tips

Focus on **changes from baseline**:
- New focal deficits (concern for malignant edema)
- GCS trends (improving/stable/worsening)
- Pupil changes
- New seizure activity

### Workflow 3: TBI Patient with ICP Monitoring

**Scenario**: Severe TBI with EVD, documenting ICP management

#### Critical Data to Track

1. **Scores tab**:
   - GCS at scene (for comparison)
   - Mechanism of injury
   - Marshall CT classification
   - Pupillary findings at scene

2. **Exam tab** - Document frequently:
   - Current GCS (hourly changes)
   - Pupils (size and reactivity)
   - ICP readings (document trends)
   - CPP (calculate: MAP - ICP)
   - EVD output and settings

3. **Data tab**:
   - MAP goal >80 if ICP elevated
   - PaCO2 target 35-40 (avoid hypercapnia)
   - Temperature (maintain normothermia <38°C)
   - Sodium target 145-155 if cerebral edema

4. **Plan tab**:
   - Use `.NEUROICU_TBI` template
   - Includes TBI bundle checklist
   - Documents ICP management strategy

## 🧮 Using Clinical Calculators

### ICH Score Calculator

**When to use**: All intracerebral hemorrhage patients

**Parameters**:
1. GCS (3-15)
2. ICH volume (mL, calculated by ABC/2 method)
3. IVH present (yes/no)
4. Infratentorial location (yes/no)
5. Age ≥80 (yes/no)

**Interpretation**:
- Score 0: 0% 30-day mortality
- Score 1: 13% mortality
- Score 2: 26% mortality
- Score 3: 72% mortality
- Score 4: 97% mortality
- Score 5-6: 100% mortality

**Example**:
```
Patient: 65yo with 45mL basal ganglia ICH, IVH present, GCS 8
- GCS 8 = 2 points
- Volume >30mL = 1 point
- IVH = 1 point
- Not infratentorial = 0 points
- Age <80 = 0 points
Total: ICH Score = 4 (97% 30-day mortality)
```

### NIHSS Calculator

**When to use**: All ischemic stroke patients

**Tips for accurate scoring**:
1. Score what you observe, not what you think the deficit should be
2. "Worst case" rule: if unsure, score the more severe deficit
3. Score at consistent time points (admission, post-tPA, 24hr, discharge)
4. Document who performed the exam

**Score interpretation**:
- 0: No stroke symptoms
- 1-4: Minor stroke
- 5-15: Moderate stroke
- 16-20: Moderate to severe stroke
- 21-42: Severe stroke

## ✅ Checklist Best Practices

### Daily ICU Checklist Strategy

**Morning rounds**:
1. Review overnight events
2. Document neuro exam
3. Check all boxes that are met
4. Identify gaps (unchecked items)
5. Create tasks for missing items

**Example workflow**:
```
☑ Neuro exam documented
☑ DVT prophylaxis (heparin 5000 TID)
☑ HOB >30°
☐ ICP/CPP target - Need to adjust EVD
☐ Family update - Family not available yet

Tasks created:
- Call family at 2pm
- Titrate EVD to achieve CPP >60
```

### Diagnosis-Specific Bundles

The app pre-populates diagnosis-specific checklist items:

**SAH Bundle**:
- Nimodipine q4h
- Euvolemia
- Daily TCDs (POD 3-14)
- BP control per securing status

**TBI Bundle**:
- HOB >30°
- Neck neutral
- PaCO2 35-40
- Sodium 145-155
- Normoglycemia
- Normothermia
- Seizure prophylaxis (7 days)

## 📝 SmartPhrase Tips

### Customizing Output Before Copy

Before copying to clipboard:
1. Review all auto-populated fields
2. Add free-text details in appropriate sections
3. Delete any sections that don't apply
4. Add institution-specific headers if needed

### Creating Multi-Problem Notes

For complex patients with multiple problems:

1. Add each problem separately in the Problems section
2. Use clear problem titles:
   - "Respiratory: Ventilator management"
   - "Neuro: ICP management"
   - "ID: Meningitis treatment"
   - "CV: Blood pressure control"

3. The assessment/plan section will format as:
   ```
   1) Respiratory: Ventilator management
   A: Improving oxygenation, ready for SBT
   P: - Trial SBT today
       - Wean FiO2 as tolerated
   
   2) Neuro: ICP management
   A: ICP well controlled at 12-15
   P: - Continue EVD at current settings
       - Wean sedation per protocol
   ```

## 📊 Task Management

### Task Priority System

- **STAT**: Immediate (within 1 hour)
  - Example: "Repeat CT if ICP >25 sustained"
- **Urgent**: Today, high priority
  - Example: "Discuss trach/PEG with family"
- **Routine**: Standard timing
  - Example: "PT/OT evaluation"

### Task Timing

- **AM**: Complete before noon
  - Example: "Draw trough levels before 8am dose"
- **PM**: Afternoon/evening
  - Example: "Evening family meeting at 5pm"
- **Today**: Anytime today
  - Example: "Adjust propofol for RASS -2"

## 💾 Data Management

### Saving and Loading

**Automatic saving**:
- Data saves automatically to browser localStorage
- No manual save button needed
- Data persists across browser sessions

**Data persistence**:
- ✅ Persists: Normal browser use, closing tabs
- ❌ Lost: Clearing browser data, incognito mode

### Managing Multiple Patients

**Patient selector dropdown**:
1. Shows all active patients
2. Click to switch between patients
3. Each patient's data is separate

**Adding new patients**:
1. Click "New Patient" button
2. Creates blank template
3. Select diagnosis type to auto-populate relevant fields

**Archiving patients**:
- Currently, manually delete outdated patients
- Future feature: Export/import for archiving

## 🔧 Troubleshooting Common Issues

### Issue: Missing Clinical Scores

**Problem**: Scores tab shows "Select a diagnosis type to view relevant scoring systems"

**Solution**: 
1. Make sure diagnosis type is selected in the patient header
2. Each diagnosis has specific score calculators

### Issue: Template Doesn't Auto-Populate

**Problem**: SmartPhrase shows empty fields like "GCS: -"

**Solution**:
1. Check that data is entered in the relevant tabs
2. Example: GCS shows "-" if not entered in Exam tab
3. Navigate to Exam tab and enter GCS components

### Issue: Copy to Clipboard Fails

**Problem**: "Copy to Clipboard" button doesn't work

**Solution**:
1. Browser may need clipboard permissions
2. Alternative: Manually select text and Ctrl+C / Cmd+C
3. Try a different browser if issue persists

## 📱 Mobile/Tablet Use

### Optimizing for Bedside Use

**Best practices**:
1. Use landscape orientation for better view
2. Zoom to comfortable reading size
3. Use browser full-screen mode (F11)
4. Keep screen on (adjust device settings)

**Quick data entry**:
1. Tab through form fields with Tab key
2. Use number pad for vital signs
3. Memorize keyboard shortcuts (Ctrl+C for copy)

## 🎓 Training Resources

### For New Users

**Week 1**: Familiarize with interface
- Create test patients
- Practice data entry
- Try all clinical calculators

**Week 2**: Template usage
- Generate notes for different diagnoses
- Customize templates if needed
- Practice daily workflow

**Week 3**: Efficient workflow
- Speed up data entry
- Use keyboard shortcuts
- Integrate into actual rounds

### Common Questions

**Q: Can I use this for actual patient data?**
A: Be mindful of HIPAA/PHI. Avoid using full names or identifiable information. Consider using medical record numbers only or initials.

**Q: Can I share data between devices?**
A: Not currently. Data is stored locally in each browser.

**Q: Can multiple users collaborate on the same patient?**
A: Not currently. This is a single-user application.

**Q: How accurate are the clinical calculators?**
A: Calculators are based on published literature. Always verify calculations independently and follow institutional protocols.

## 📞 Getting Help

**Documentation**:
- README.md: Quick start and setup
- ARCHITECTURE.md: Technical details
- CUSTOMIZATION.md: How to customize
- CONTRIBUTING.md: For developers

**Support**:
- GitHub Issues: Report bugs or request features
- Pull Requests: Contribute improvements

## 🏆 Best Practices Summary

1. **Daily workflow**:
   - Update patient data first thing in morning
   - Document neuro exam changes immediately
   - Generate note after rounds
   - Review checklist for gaps

2. **Data accuracy**:
   - Double-check GCS calculations
   - Verify clinical scores against references
   - Document time-sensitive data (ICP trends, pupil changes)

3. **Efficiency**:
   - Use tab navigation
   - Copy previous day's data and modify
   - Keep diagnosis-specific templates handy

4. **Safety**:
   - Never replace clinical judgment with calculators
   - Follow institutional protocols
   - Verify all auto-populated fields before using

---

**Happy rounding! 🏥**
