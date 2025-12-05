// smartphraseEngine.ts
import type { RoundingSheet } from "./types";
import type { SmartPhraseTemplate } from "./smartphrases";

function fmtChecklist(sheet: RoundingSheet) {
  // Optimize using map instead of loop + push
  return Object.entries(sheet.checklist)
    .map(([k, v]) => `- [${v ? "x" : " "}] ${k}`)
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

// Cache the token pattern regex for better performance
const TOKEN_KEYS = [
  "@TODAY@", "@NAME@", "@ROOM@", "@ONELINER@", "@INTERVAL@",
  "@MAP@", "@HR@", "@SPO2@", "@VENT@", "@DRIPS@", "@LINES@",
  "@LABS@", "@IMAGING@", "@CHECKLIST@", "@AP@", "@TASKS@", "@GOALS@"
];
const TOKEN_PATTERN = new RegExp(
  TOKEN_KEYS.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
  'g'
);

export function renderSmartPhrase(template: SmartPhraseTemplate, sheet: RoundingSheet) {
  const tokens: Record<string, string> = {
    "@TODAY@": sheet.dateISO || new Date().toISOString().slice(0, 10),
    "@NAME@": sheet.patientName || "",
    "@ROOM@": sheet.room ? `(Room ${sheet.room})` : "",
    "@ONELINER@": sheet.oneLiner || "-",
    "@INTERVAL@": "-", // add a field later if you want
    "@MAP@": String(sheet.vitals.map ?? "-"),
    "@HR@": String(sheet.vitals.hr ?? "-"),
    "@SPO2@": String(sheet.vitals.spo2 ?? "-"),
    "@VENT@": sheet.vitals.vent ?? "-",
    "@DRIPS@": sheet.drips || "-",
    "@LINES@": sheet.linesTubes || "-",
    "@LABS@": sheet.labs || "-",
    "@IMAGING@": sheet.imaging || "-",
    "@CHECKLIST@": fmtChecklist(sheet),
    "@AP@": fmtAP(sheet),
    "@TASKS@": fmtTasks(sheet),
    "@GOALS@": "-", // add a field later if you want
  };

  let out = template.body;
  // Use a single regex pass for all token replacements (pattern is cached for performance)
  out = out.replace(TOKEN_PATTERN, (match) => tokens[match] || match);

  // Cerner-friendly: plain text, tidy spacing
  out = out.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return out;
}
