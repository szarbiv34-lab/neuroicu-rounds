// smartphraseEngine.ts
import type { RoundingSheet } from "./types";
import type { SmartPhraseTemplate } from "./smartphrases";

function fmtChecklist(sheet: RoundingSheet) {
  return Object.entries(sheet.checklist)
    .map(([k, v]) => `[${v ? "x" : " "}] ${k}`)
    .join("\n");
}

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

function fmtTasks(sheet: RoundingSheet) {
  if (!sheet.tasks.length) return "-";
  return sheet.tasks
    .map((t) => `- [${t.done ? "x" : " "}] ${t.text}${t.due ? ` (${t.due})` : ""}`)
    .join("\n");
}

function fmtPupils(sheet: RoundingSheet) {
  const pupils = sheet.neuroExam?.pupils;
  if (!pupils) return "-";
  const { left, right } = pupils;
  const lReact = left.reactive ? "reactive" : "non-reactive";
  const rReact = right.reactive ? "reactive" : "non-reactive";
  return `L ${left.size}mm ${lReact}, R ${right.size}mm ${rReact}`;
}

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

// Pre-compile regex pattern for optimal performance
const TOKEN_PATTERN = /@(?:TODAY|NAME|ROOM|DIAGNOSIS|DAY_OF_ADMIT|ONELINER|INTERVAL|GCS(?:_[EVM])?|PUPILS|CN|MOTOR|SEDATION|SEIZURES|ICP(?:_CPP)?|CPP|EVD|MAP|HR|SPO2|TEMP|RR|FIO2|PEEP|VENT|DRIPS|LINES|LABS|IMAGING|CHECKLIST|AP|TASKS|GOALS)@/g;

// Pre-compile whitespace cleanup patterns
const CRLF_PATTERN = /\r\n/g;
const MULTIPLE_NEWLINES = /\n{3,}/g;

export function renderSmartPhrase(template: SmartPhraseTemplate, sheet: RoundingSheet) {
  const neuro = sheet.neuroExam || {};
  const calculatedGcs = (neuro.gcsEye ?? 0) + (neuro.gcsVerbal ?? 0) + (neuro.gcsMotor ?? 0);
  const gcsTotal = neuro.gcsTotal ?? (calculatedGcs > 0 ? calculatedGcs : "-");
  
  // Pre-compute formatted values to avoid redundant function calls
  const pupilsFormatted = fmtPupils(sheet);
  const icpCppFormatted = fmtIcpCpp(sheet);
  const checklistFormatted = fmtChecklist(sheet);
  const apFormatted = fmtAP(sheet);
  const tasksFormatted = fmtTasks(sheet);
  
  const tokens: Record<string, string> = {
    "@TODAY@": sheet.dateISO || new Date().toISOString().slice(0, 10),
    "@NAME@": sheet.patientName || "",
    "@ROOM@": sheet.room ? `(Room ${sheet.room})` : "",
    "@DIAGNOSIS@": sheet.diagnosis || "",
    "@DAY_OF_ADMIT@": sheet.dayOfAdmit ? `HD#${sheet.dayOfAdmit}` : "",
    "@ONELINER@": sheet.oneLiner || "-",
    "@INTERVAL@": "-",
    // Neuro exam tokens
    "@GCS@": String(gcsTotal),
    "@GCS_E@": String(neuro.gcsEye ?? "-"),
    "@GCS_V@": String(neuro.gcsVerbal ?? "-"),
    "@GCS_M@": String(neuro.gcsMotor ?? "-"),
    "@PUPILS@": pupilsFormatted,
    "@CN@": neuro.cranialNerves || "grossly intact",
    "@MOTOR@": neuro.motorExam || "-",
    "@SEDATION@": neuro.sedation || "-",
    "@SEIZURES@": neuro.seizures || "none",
    "@ICP@": String(neuro.icp ?? "-"),
    "@CPP@": String(neuro.cpp ?? "-"),
    "@EVD@": neuro.evdDrain || "-",
    "@ICP_CPP@": icpCppFormatted,
    // Vitals
    "@MAP@": String(sheet.vitals.map ?? "-"),
    "@HR@": String(sheet.vitals.hr ?? "-"),
    "@SPO2@": String(sheet.vitals.spo2 ?? "-"),
    "@TEMP@": String(sheet.vitals.temp ?? "-"),
    "@RR@": String(sheet.vitals.rr ?? "-"),
    "@FIO2@": sheet.vitals.fio2 ? `${sheet.vitals.fio2}%` : "-",
    "@PEEP@": sheet.vitals.peep ? `${sheet.vitals.peep}` : "-",
    "@VENT@": sheet.vitals.vent ?? "-",
    "@DRIPS@": sheet.drips || "-",
    "@LINES@": sheet.linesTubes || "-",
    "@LABS@": sheet.labs || "-",
    "@IMAGING@": sheet.imaging || "-",
    "@CHECKLIST@": checklistFormatted,
    "@AP@": apFormatted,
    "@TASKS@": tasksFormatted,
    "@GOALS@": "-",
  };

  // Single-pass replacement using pre-compiled regex
  let out = template.body.replace(TOKEN_PATTERN, (match) => tokens[match] || match);
  
  // Efficient whitespace cleanup
  out = out.replace(CRLF_PATTERN, "\n").replace(MULTIPLE_NEWLINES, "\n\n").trim();
  
  return out;
}
