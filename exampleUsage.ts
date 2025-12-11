// exampleUsage.ts
// Demonstrates how to use the SmartPhrase engine programmatically
// This example shows rendering a custom template with sample patient data

import { renderSmartPhrase } from "./src/smartphraseEngine";

/**
 * Sample SmartPhrase template demonstrating available tokens.
 * Templates use @ tokens (e.g., @NAME@, @GCS@) as placeholders that will be
 * replaced with actual patient data during rendering.
 */
const template = {
  name: "Daily ICU Note",
  body: `
@TODAY@ — @NAME@ @ROOM@

One-liner: @ONELINER@

Vitals: MAP @MAP@, HR @HR@, SpO2 @SPO2@, Vent @VENT@
Drips: @DRIPS@
Lines/Tubes: @LINES@
Labs: @LABS@
Imaging: @IMAGING@

Checklist:
@CHECKLIST@

Assessment & Plan:
@AP@

Tasks:
@TASKS@
`.trim(),
};

/**
 * Sample rounding sheet with fictitious patient data.
 * In a real application, this data would come from user input in the UI.
 * This example demonstrates the structure needed for template rendering.
 */
const sampleSheet = {
  dateISO: "2025-12-05",
  patientName: "Baby Doe, M",
  room: "12A",
  oneLiner: "Premature infant with respiratory failure, post-op PDA ligation",
  vitals: {
    map: 40,
    hr: 140,
    spo2: 92,
    vent: "SIMV 18/5 FiO2 0.4",
  },
  drips: "Dopamine 5 mcg/kg/min",
  linesTubes: "UAC, UVC, ETT 3.5",
  labs: "Hg 12.1, WBC 8.2, Na 138, K 4.2",
  imaging: "CXR: mild RML atelectasis",
  checklist: {
    "Daily weights": true,
    "IV site check": true,
    "GTT rate correct": false,
    "Family updated": true,
  },
  problems: [
    {
      title: "Respiratory failure",
      assessment: "Stable on moderate ventilatory support, intermittent desaturations",
      plan: "Continue ventilator, gradually wean FiO2 as tolerated. Consider extubation criteria tomorrow.",
    },
    {
      title: "Hypotension",
      assessment: "MAP low but improving on low-dose dopamine",
      plan: "Keep dopamine, monitor urine output and lactate. Titrate as needed.",
    },
  ],
  tasks: [
    { text: "Obtain ABG after morning blood gas", done: false },
    { text: "Check UAC site and document", done: true, due: "AM" },
  ],
};

// Render the template with sample data
// The output will have all @ tokens replaced with actual values
const out = renderSmartPhrase(template as any, sampleSheet as any);

// Print the rendered note to console
console.log("=== Rendered SmartPhrase Output ===\n");
console.log(out);
console.log("\n=== End of Output ===");
