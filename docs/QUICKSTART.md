# Quick Start Guide

Get started with the Neuro ICU Rounding App in 5 minutes!

## 🎯 What You'll Learn

By the end of this guide, you'll be able to:
1. Create your first patient
2. Enter clinical data
3. Generate a progress note

## 📋 Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- 5 minutes of your time

## 🚀 Let's Get Started!

### Step 1: Open the Application

**Local Development** (if running on your machine):
```bash
npm install
npm run dev
```
Then open http://localhost:3000

**Deployed Version**:
Open the GitHub Pages URL (e.g., `https://yourusername.github.io/neuroicu-rounds/`)

### Step 2: Create Your First Patient

You'll see a default patient template when the app loads.

1. **Change the patient name**: Click on "New Patient" or edit the existing name
   - Example: "Doe, Jane" or use initials "JD"
   - 💡 Tip: Avoid real patient names for privacy

2. **Enter room number** (optional):
   - Example: "NICU-12" or "Room 5"

3. **Select diagnosis type**:
   - Click the dropdown next to the patient name
   - Choose from: SAH, Stroke, ICH, TBI, Seizure, Spine, Tumor, or Other
   - Example: Select "Subarachnoid hemorrhage" for SAH patients

4. **Enter hospital day**:
   - Example: "1" for admission day, "5" for day 5
   - This helps track patient trajectory

### Step 3: Enter Clinical Scores (Optional but Recommended)

Click the **"Scores"** tab at the top.

**For SAH patients**:
- Select **Hunt & Hess Grade**: Choose 1-5 based on clinical status
- Select **Modified Fisher Grade**: Choose 0-4 based on CT findings
- Enter **Bleed Day**: Days since aneurysm rupture
- Enter **Aneurysm Location**: e.g., "AComm", "MCA"

**For Stroke patients**:
- Enter **NIHSS score**: 0-42 (will show interpretation)
- Document tPA/thrombectomy if performed

**For ICH patients**:
- The calculator will compute mortality risk based on:
  - GCS score
  - ICH volume
  - IVH presence
  - Location
  - Age

### Step 4: Document Neuro Exam

Click the **"Exam"** tab.

**Enter Glasgow Coma Scale (GCS)**:
1. **Eye Opening** (1-4):
   - 4 = Spontaneous
   - 3 = To voice
   - 2 = To pain
   - 1 = None

2. **Verbal Response** (1-5):
   - 5 = Oriented
   - 4 = Confused
   - 3 = Inappropriate words
   - 2 = Incomprehensible sounds
   - 1 = None

3. **Motor Response** (1-6):
   - 6 = Obeys commands
   - 5 = Localizes to pain
   - 4 = Withdraws from pain
   - 3 = Flexion to pain
   - 2 = Extension to pain
   - 1 = None

**Total GCS** is calculated automatically (displayed at top).

**Document Pupils**:
- **Left pupil**: Size (1-8mm) and check "Reactive"
- **Right pupil**: Size (1-8mm) and check "Reactive"
- Example: "3mm reactive" for both

**Motor Exam** (optional):
- Enter structured strength: e.g., "RUE 4/5, all others 5/5"
- Or leave as free text

**ICP Monitoring** (if applicable):
- Enter ICP value (e.g., "12" mmHg)
- Enter CPP value (e.g., "68" mmHg)
- Enter EVD settings (e.g., "draining at 15cm H2O")

### Step 5: Enter Vital Signs and Data

Click the **"Data"** tab.

**Vital Signs**:
- MAP: e.g., "85"
- Heart Rate: e.g., "72"
- SpO2: e.g., "98"
- Temperature: e.g., "37.2"
- Vent: e.g., "RA" (room air) or "SIMV 12/5 FiO2 40%"

**Lines/Tubes**:
- Example: "EVD @15cm, A-line, Foley, PIV x2"

**Drips**:
- Example: "Nimodipine 60mg q4h, NS @ 100mL/hr"

**Labs**:
- Example: "WBC 9.2, Hgb 10.5, Plt 245, Na 142, K 3.8"

**Imaging**:
- Example: "CT head: AComm SAH, Fisher 4, no hydrocephalus"

**Checklist**:
- Check off completed items (e.g., "HOB >30°", "DVT prophylaxis")

### Step 6: Add Problems and Plan

Scroll down on any tab to find the **Problems** section.

1. **Click "Add Problem"**

2. **Enter problem details**:
   - **Title**: e.g., "SAH - vasospasm prevention"
   - **Assessment**: e.g., "Post-coiling HD1, Fisher 4, in vasospasm window"
   - **Plan**: Enter plan with bullet points
     ```
     - Nimodipine 60mg q4h x21 days
     - Goal euvolemia, CVP 8-12
     - Daily TCDs starting POD3
     - Neuro checks q1h
     ```

3. **Add more problems** as needed (click "Add Problem" again)

### Step 7: Generate Your Note

Click the **"Plan"** tab.

**You'll see**:
- A fully formatted note with all your data populated
- The template is automatically selected based on diagnosis type
- All @ tokens (like @NAME@, @GCS@) are replaced with actual values

**To use the note**:
1. Review the generated content
2. Click **"Copy to Clipboard"**
3. Paste into your EHR or note system
4. Make any final edits in your EHR

**Example Output**:
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

[... continues with all sections ...]
```

## 🎉 Congratulations!

You've just created your first patient and generated a progress note!

## 📚 Next Steps

### Learn More Features

1. **Try different diagnosis types**:
   - Create a stroke patient
   - Create a TBI patient
   - See how templates and calculators change

2. **Explore clinical calculators**:
   - ICH Score mortality calculator
   - NIHSS stroke severity
   - TBI Marshall CT classification

3. **Add tasks**:
   - Create to-do items with priorities (Routine, Urgent, STAT)
   - Set timing (AM, PM, Today)
   - Check off completed tasks

### Customize for Your Workflow

- Read [CUSTOMIZATION.md](./CUSTOMIZATION.md) to:
  - Modify templates to match your note format
  - Add institution-specific checklists
  - Create custom clinical scores

### Daily Usage Tips

**Morning Rounds Workflow**:
1. Open the app on your tablet/laptop
2. Select patient from dropdown (if multiple patients)
3. Update overnight data:
   - New vitals
   - New labs/imaging
   - Changes in neuro exam
4. Update checklist (check off completed items)
5. Review and update problems
6. Generate note and copy to EHR

**Efficient Data Entry**:
- Use Tab key to navigate between fields
- Copy data from yesterday and modify (faster than starting fresh)
- Keep commonly used phrases in your clipboard

## 🔧 Troubleshooting

**Problem**: Can't see my patient after refresh
- **Solution**: Check that you're on the same browser/device. Data is stored locally.

**Problem**: Template is empty or shows "-" for values
- **Solution**: Make sure you've entered data in the respective tabs (Exam, Data, etc.)

**Problem**: Copy to Clipboard doesn't work
- **Solution**: Try manually selecting the text and pressing Ctrl+C (Cmd+C on Mac)

**Problem**: Scores tab is empty
- **Solution**: Make sure you've selected a diagnosis type in the patient header

## 💡 Pro Tips

1. **Use keyboard shortcuts**:
   - Tab: Navigate between fields
   - Ctrl+C / Cmd+C: Copy text
   - Enter: Submit forms

2. **Organize your patients**:
   - Use consistent naming (Last, First format)
   - Include room number for quick reference
   - Update hospital day daily

3. **Standardize your workflow**:
   - Update data in the same order each day
   - Use the checklist to ensure nothing is missed
   - Review all tabs before generating final note

4. **Mobile optimization**:
   - Use landscape mode on tablets
   - Zoom to comfortable reading size
   - Enable full-screen mode in browser

## 📖 Additional Resources

- **[README.md](../README.md)**: Overview and setup
- **[USER_GUIDE.md](./USER_GUIDE.md)**: Detailed usage instructions
- **[FAQ.md](./FAQ.md)**: Common questions answered
- **[CUSTOMIZATION.md](./CUSTOMIZATION.md)**: How to customize
- **[CONTRIBUTING.md](../CONTRIBUTING.md)**: For developers

## 🆘 Need Help?

- **GitHub Issues**: Report bugs or ask questions
- **Documentation**: Check the guides above
- **Examples**: Review the sample data in `exampleUsage.ts`

---

**Ready to start rounding smarter? Get started now!** 🏥
