// exampleUsage.ts
import { renderSmartPhrase } from "./smartphraseEngine";

// Sample SmartPhrase template
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

// Sample rounding sheet
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
    { id: "task-1", text: "Obtain ABG after morning blood gas", done: false },
    { id: "task-2", text: "Check UAC site and document", done: true, due: "AM" },
  ],
};

const out = renderSmartPhrase(template as any, sampleSheet as any);
console.log(out);
