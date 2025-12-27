// smartphraseEngine.ts
// Template rendering engine for generating medical documentation from patient data.
// Replaces placeholder tokens (e.g., @NAME@, @GCS@) with actual patient values.

import type { RoundingSheet } from "./types";
import type { SmartPhraseTemplate } from "./smartphrases";

/**
 * Formats checklist items into markdown-style checkbox format.
 * @example
 * Input: { "DVT prophylaxis": true, "Family update": false }
 * Output: "[x] DVT prophylaxis\n[ ] Family update"
 */
function fmtChecklist(sheet: RoundingSheet) {
  return Object.entries(sheet.checklist)
    .map(([k, v]) => `[${v ? "x" : " "}] ${k}`)
    .join("\n");
}

/**
 * Formats assessment and plan (A&P) section from problems list.
 * Each problem is numbered with separate Assessment and Plan lines.
 * @example Output:
 * 1) SAH - vasospasm prevention
 * A: Post-coiling HD1, Fisher 4
 * P: - Nimodipine 60mg q4h
 *     - Daily TCDs
 */
function fmtAP(sheet: RoundingSheet) {
  if (!sheet.problems.length) return "-";
  return sheet.problems
    .map((p, i) => {
      const a = (p.assessment || "-").trim();
      const plan = (p.plan || "-").trim();
      return `${i + 1}) ${p.title}\nA: ${a}\nP: ${plan}`;
    })
    .join("\n\n");
}

/**
 * Formats task list with checkboxes and optional timing labels.
 * @example Output: "- [x] Draw troponin (AM)\n- [ ] Family meeting (PM)"
 */
function fmtTasks(sheet: RoundingSheet) {
  if (!sheet.tasks.length) return "-";
  return sheet.tasks
    .map((t) => `- [${t.done ? "x" : " "}] ${t.text}${t.due ? ` (${t.due})` : ""}`)
    .join("\n");
}

/**
 * Formats pupillary exam in standard neurological format.
 * @example Output: "L 3mm reactive, R 4mm non-reactive"
 */
function fmtPupils(sheet: RoundingSheet) {
  const pupils = sheet.neuroExam?.pupils;
  if (!pupils) return "-";
  const { left, right } = pupils;
  const lReact = left.reactive ? "reactive" : "non-reactive";
  const rReact = right.reactive ? "reactive" : "non-reactive";
  return `L ${left.size}mm ${lReact}, R ${right.size}mm ${rReact}`;
}

/**
 * Formats intracranial pressure (ICP) monitoring data including CPP and EVD.
 * CPP (Cerebral Perfusion Pressure) = MAP - ICP (typically calculated elsewhere)
 * EVD = External Ventricular Drain
 */
function fmtIcpCpp(sheet: RoundingSheet) {
  const { icp, cpp, evdDrain } = sheet.neuroExam || {};
  if (!icp && !cpp && !evdDrain) return "";
  let lines: string[] = [];
  if (icp !== undefined || cpp !== undefined) {
    lines.push(`- ICP: ${icp ?? "-"} mmHg  CPP: ${cpp ?? "-"} mmHg`);
  }
  if (evdDrain) {
    lines.push(`- EVD: ${evdDrain}`);
  }
  return lines.join("\n");
}

/**
 * All available token placeholders that can be used in SmartPhrase templates.
 * These tokens will be replaced with actual patient data during rendering.
 * Organized by category: Patient Info, Neuro Exam, Vitals, Support, Data, and Plan.
 */
const TOKEN_KEYS = [
  "@TODAY@", "@NAME@", "@ROOM@", "@DIAGNOSIS@", "@DAY_OF_ADMIT@",
  "@ONELINER@", "@INTERVAL@",
  "@GCS@", "@GCS_E@", "@GCS_V@", "@GCS_M@", "@PUPILS@", "@CN@", "@MOTOR@",
  "@SEDATION@", "@SEIZURES@", "@ICP@", "@CPP@", "@EVD@", "@ICP_CPP@",
  "@MAP@", "@HR@", "@SPO2@", "@TEMP@", "@RR@", "@FIO2@", "@PEEP@",
  "@VENT@", "@DRIPS@", "@LINES@",
  "@LABS@", "@IMAGING@", "@CHECKLIST@", "@AP@", "@TASKS@", "@GOALS@"
];

/**
 * Pre-compiled regex pattern for efficient token replacement.
 * Escapes special regex characters and combines all tokens with OR operator (|).
 * Cached at module level to avoid recompiling on every render.
 */
const TOKEN_PATTERN = new RegExp(
  TOKEN_KEYS.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
  'g'
);

/**
 * Renders a SmartPhrase template by replacing all token placeholders with patient data.
 * Uses efficient single-pass replacement with pre-built token map.
 * 
 * @param template - The SmartPhrase template containing token placeholders
 * @param sheet - The patient rounding sheet with all clinical data
 * @returns Fully rendered medical note with all tokens replaced
 * 
 * @example
 * const template = { body: "GCS: @GCS@ (@GCS_E@/@GCS_V@/@GCS_M@)" };
 * const sheet = { neuroExam: { gcsEye: 4, gcsVerbal: 5, gcsMotor: 6 } };
 * renderSmartPhrase(template, sheet); // Returns: "GCS: 15 (4/5/6)"
 */
export function renderSmartPhrase(template: SmartPhraseTemplate, sheet: RoundingSheet) {
  const neuro = sheet.neuroExam || {};
  
  // Calculate GCS total from components (Eye + Verbal + Motor)
  // GCS ranges: 3 (lowest) to 15 (highest/normal)
  const calculatedGcs = (neuro.gcsEye ?? 0) + (neuro.gcsVerbal ?? 0) + (neuro.gcsMotor ?? 0);
  const gcsTotal = neuro.gcsTotal ?? (calculatedGcs > 0 ? calculatedGcs : "-");
  
  // Build token mapping: each token key maps to its corresponding patient data value
  // Missing values default to "-" to indicate data not entered
  const tokens: Record<string, string> = {
    // Date and patient demographics
    "@TODAY@": sheet.dateISO || new Date().toISOString().slice(0, 10),
    "@NAME@": sheet.patientName || "",
    "@ROOM@": sheet.room ? `(Room ${sheet.room})` : "",
    "@DIAGNOSIS@": sheet.diagnosis || "",
    "@DAY_OF_ADMIT@": sheet.dayOfAdmit ? `HD#${sheet.dayOfAdmit}` : "", // HD = Hospital Day
    "@ONELINER@": sheet.oneLiner || "-",
    "@INTERVAL@": "-", // Interval events - not yet implemented
    
    // Neurological examination findings
    "@GCS@": String(gcsTotal),
    "@GCS_E@": String(neuro.gcsEye ?? "-"),       // Eye opening (1-4)
    "@GCS_V@": String(neuro.gcsVerbal ?? "-"),    // Verbal response (1-5)
    "@GCS_M@": String(neuro.gcsMotor ?? "-"),     // Motor response (1-6)
    "@PUPILS@": fmtPupils(sheet),                 // Formatted: "L 3mm reactive, R 3mm reactive"
    "@CN@": neuro.cranialNerves || "grossly intact",
    "@MOTOR@": neuro.motorExam || "-",            // Free text or structured strength exam
    "@SEDATION@": neuro.sedation || "-",          // RASS score or sedation description
    "@SEIZURES@": neuro.seizures || "none",       // Seizure activity or EEG findings
    "@ICP@": String(neuro.icp ?? "-"),            // Intracranial pressure (mmHg)
    "@CPP@": String(neuro.cpp ?? "-"),            // Cerebral perfusion pressure (mmHg)
    "@EVD@": neuro.evdDrain || "-",               // External ventricular drain settings
    "@ICP_CPP@": fmtIcpCpp(sheet),                // Combined ICP/CPP/EVD formatted output
    
    // Vital signs and ventilator settings
    "@MAP@": String(sheet.vitals.map ?? "-"),     // Mean arterial pressure
    "@HR@": String(sheet.vitals.hr ?? "-"),       // Heart rate
    "@SPO2@": String(sheet.vitals.spo2 ?? "-"),   // Oxygen saturation
    "@TEMP@": String(sheet.vitals.temp ?? "-"),   // Temperature (°C)
    "@RR@": String(sheet.vitals.rr ?? "-"),       // Respiratory rate
    "@FIO2@": sheet.vitals.fio2 ? `${sheet.vitals.fio2}%` : "-",  // Fraction of inspired oxygen
    "@PEEP@": sheet.vitals.peep ? `${sheet.vitals.peep}` : "-",   // Positive end-expiratory pressure
    "@VENT@": sheet.vitals.vent ?? "-",           // Ventilator mode and settings
    
    // Lines, medications, and support
    "@DRIPS@": sheet.drips || "-",                // IV drips and medications
    "@LINES@": sheet.linesTubes || "-",           // Lines, tubes, and access devices
    
    // Diagnostic data
    "@LABS@": sheet.labs || "-",                  // Laboratory results
    "@IMAGING@": sheet.imaging || "-",            // Imaging findings
    
    // Care plan elements
    "@CHECKLIST@": fmtChecklist(sheet),           // Formatted checklist with checkboxes
    "@AP@": fmtAP(sheet),                         // Assessment and Plan by problem
    "@TASKS@": fmtTasks(sheet),                   // Task list with timing
    "@GOALS@": "-",                               // Goals of care - not yet implemented
  };

  // Efficient single-pass token replacement using pre-compiled regex
  // Replace all tokens in one operation to minimize string manipulation
  const out = template.body.replace(TOKEN_PATTERN, (match) => tokens[match] || match);
  
  // Normalize line endings and remove excessive blank lines
  return out.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
