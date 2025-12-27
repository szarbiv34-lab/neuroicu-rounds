// RoundingApp.tsx - Neuro ICU Rounding Application
import React, { useMemo, useState, useCallback, useEffect } from "react";
import type { RoundingSheet, Task, Problem, NeuroExam, DiagnosisType } from "./types";
import { TEMPLATES } from "./smartphrases";
import { renderSmartPhrase } from "./smartphraseEngine";
import ClinicalScores from "./ClinicalScores";

type Id = string;

const uid = () => Math.random().toString(36).slice(2, 10);

const NEURO_CHECKLIST = [
  "Neuro exam documented",
  "ICP/CPP target",
  "Seizure prophylaxis",
  "DVT prophylaxis",
  "GI prophylaxis",
  "HOB >30°",
  "Glucose target 80-180",
  "Normothermia",
  "Sodium target",
  "Blood pressure goal",
  "Lines/EVD reviewed",
  "Family update",
] as const;

const TABS = ["scores", "exam", "data", "plan"] as const;
type TabKey = typeof TABS[number];

const DIAGNOSIS_TYPE_LABELS: Record<DiagnosisType, string> = {
  sah: "Subarachnoid hemorrhage",
  stroke: "Ischemic stroke",
  ich: "Intracerebral hemorrhage (ICH)",
  tbi: "Traumatic brain injury",
  seizure: "Status epilepticus",
  spine: "Spinal cord injury",
  tumor: "Brain tumor",
  other: "Other / mixed neuro",
};

const DIAGNOSIS_TEMPLATE_MAP: Partial<Record<DiagnosisType, string>> = {
  sah: "neuroicu-sah",
  stroke: "neuroicu-stroke",
  ich: "neuroicu-daily",
  tbi: "neuroicu-tbi",
  seizure: "neuroicu-status",
  spine: "neuroicu-daily",
  tumor: "neuroicu-daily",
  other: "neuroicu-daily",
};

const DEFAULT_TEMPLATE_ID = TEMPLATES[0].id;

type DiagnosisPrefill = {
  oneLiner?: string;
  diagnosisLabel?: string;
  problemTemplates?: Array<Pick<Problem, "title" | "assessment" | "plan">>;
  taskTemplates?: string[];
  drips?: string;
  linesTubes?: string;
  checklistTrue?: string[];
};

const fillTemplateText = (template: string, sheet: RoundingSheet) => {
  return template
    .replace(/\{\{HD\}\}/g, `HD ${sheet.dayOfAdmit ?? 1}`)
    .replace(/\{\{ROOM\}\}/g, sheet.room ? `Room ${sheet.room}` : "ICU");
};

const DIAGNOSIS_DEFAULTS: Partial<Record<DiagnosisType, DiagnosisPrefill>> = {
  sah: {
    oneLiner: "SAH {{HD}} s/p securing, in vasospasm window",
    problemTemplates: [
      {
        title: "SAH - vasospasm prevention",
        assessment: "Secured aneurysm, monitoring TCDs, neuro exam stable",
        plan: "- Nimodipine 60mg q4h\n- Euvolemia, Na 140-150\n- Daily TCDs, CTA if neuro change",
      },
      {
        title: "ICP management",
        assessment: "EVD draining at 15 cm, ICP controlled",
        plan: "- Keep EVD at 15 cm, hourly output\n- CPP goal >65\n- Repeat CT if ICP >20 sustained",
      },
    ],
    taskTemplates: ["Daily TCD", "Update family", "EVD leveling"],
    drips: "Nimodipine q4h, maintenance IVF",
    linesTubes: "EVD @15, A-line, Foley",
    checklistTrue: ["HOB >30°", "Neuro exam documented"],
  },
  stroke: {
    oneLiner: "Large vessel stroke {{HD}} s/p reperfusion, swelling watch",
    problemTemplates: [
      {
        title: "Malignant edema watch",
        assessment: "Post thrombectomy cerebral edema risk",
        plan: "- HOB 30°\n- Hypertonic 3% PRN\n- q1h neuro checks",
      },
      {
        title: "Secondary stroke prevention",
        assessment: "Need BP control and antithrombotics",
        plan: "- SBP goal 140-160\n- Restart antiplatelet when safe\n- PT/OT consult",
      },
    ],
    taskTemplates: ["CT head AM", "PT/OT eval", "Family update"],
    drips: "3% NaCl at goal",
    linesTubes: "ETT, OGT, Foley, A-line",
    checklistTrue: ["Blood pressure goal", "Family update"],
  },
  ich: {
    oneLiner: "Deep ICH {{HD}}, BP control + ICP monitoring",
    problemTemplates: [
      {
        title: "ICH care bundle",
        assessment: "Large basal ganglia hemorrhage with IVH",
        plan: "- SBP 140-160\n- Hypertonic therapy per protocol\n- Repeat CT in AM",
      },
      {
        title: "Airway/Ventilation",
        assessment: "Protective ventilation, sedation needs",
        plan: "- Maintain PaCO2 35-40\n- Daily SAT/SBT when appropriate",
      },
    ],
    taskTemplates: ["CT head 24h", "Discuss goals of care"],
    drips: "Nicardipine infusion",
    linesTubes: "EVD @10, A-line, Foley",
    checklistTrue: ["ICP/CPP target", "Blood pressure goal"],
  },
  tbi: {
    oneLiner: "Severe TBI {{HD}}, ICP guided therapy",
    problemTemplates: [
      {
        title: "TBI neuroprotection",
        assessment: "Monitoring ICP, sedation ongoing",
        plan: "- CPP 60-70\n- Temp <38°C\n- Sedation/analgesia per protocol",
      },
    ],
    taskTemplates: ["CT head AM", "cEEG review"],
    drips: "Propofol, hypertonic prn",
    linesTubes: "EVD, A-line, vent",
    checklistTrue: ["Normothermia", "Sodium target"],
  },
  seizure: {
    oneLiner: "Status epilepticus {{HD}}, escalating antiseizure therapy",
    problemTemplates: [
      {
        title: "Seizure control",
        assessment: "Refractory status, on cEEG",
        plan: "- ASM load complete\n- Midazolam drip titrate to burst suppression\n- Daily EEG summary",
      },
    ],
    taskTemplates: ["EEG summary note", "Antiseizure levels"],
    drips: "Midazolam, ASM per protocol",
    linesTubes: "ETT, Foley, CVC",
    checklistTrue: ["Seizure prophylaxis"],
  },
};

const buildDiagnosisPrefillPatch = (sheet: RoundingSheet, diagnosisType: DiagnosisType): Partial<RoundingSheet> => {
  const defaults = DIAGNOSIS_DEFAULTS[diagnosisType];
  if (!defaults) return {};
  const patch: Partial<RoundingSheet> = {};
  if (!sheet.diagnosis) {
    patch.diagnosis = defaults.diagnosisLabel || DIAGNOSIS_TYPE_LABELS[diagnosisType];
  }
  if (!sheet.oneLiner && defaults.oneLiner) {
    patch.oneLiner = fillTemplateText(defaults.oneLiner, sheet);
  }
  if (!sheet.problems.length && defaults.problemTemplates?.length) {
    patch.problems = defaults.problemTemplates.map((tpl) => ({ id: uid(), ...tpl }));
  }
  if (!sheet.tasks.length && defaults.taskTemplates?.length) {
    patch.tasks = defaults.taskTemplates.map((text) => ({ id: uid(), text, done: false, due: "Today" }));
  }
  if (!sheet.drips && defaults.drips) {
    patch.drips = defaults.drips;
  }
  if (!sheet.linesTubes && defaults.linesTubes) {
    patch.linesTubes = defaults.linesTubes;
  }
  if (defaults.checklistTrue?.length) {
    patch.checklist = {
      ...sheet.checklist,
      ...Object.fromEntries(defaults.checklistTrue.map((key) => [key, true] as const)),
    };
  }
  return patch;
};

const DIAGNOSIS_SELECT_OPTIONS = (Object.keys(DIAGNOSIS_TYPE_LABELS) as DiagnosisType[]).map((dx) => ({
  value: dx,
  label: DIAGNOSIS_TYPE_LABELS[dx],
}));

const getTemplateForDiagnosis = (diagnosisType?: DiagnosisType) => {
  if (!diagnosisType) return DEFAULT_TEMPLATE_ID;
  return DIAGNOSIS_TEMPLATE_MAP[diagnosisType] || DEFAULT_TEMPLATE_ID;
};

function buildBlank(patientName = "New Patient"): RoundingSheet {
  const checklist = Object.fromEntries(NEURO_CHECKLIST.map(k => [k, false]));
  const today = new Date();
  const dateISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;
  return {
    id: uid(),
    patientName,
    dateISO,
    diagnosis: "",
    dayOfAdmit: 1,
    oneLiner: "",
    neuroExam: {
      pupils: {
        left: { size: 3, reactive: true },
        right: { size: 3, reactive: true },
      },
    },
    vitals: {},
    linesTubes: "",
    drips: "",
    labs: "",
    imaging: "",
    checklist,
    problems: [],
    tasks: [],
    updatedAt: Date.now(),
  };
}

function toNoteText(s: RoundingSheet) {
  const lines: string[] = [];
  lines.push(`NEURO ICU Rounds — ${s.dateISO}`);
  lines.push(`${s.patientName}${s.room ? ` (Room ${s.room})` : ""}`);
  if (s.diagnosis) lines.push(`Diagnosis: ${s.diagnosis}`);
  lines.push("");
  lines.push(`One-liner: ${s.oneLiner || "-"}`);
  lines.push("");
  
  // Neuro exam
  const ne = s.neuroExam || {};
  const gcs = (ne.gcsEye || 0) + (ne.gcsVerbal || 0) + (ne.gcsMotor || 0);
  lines.push("Neuro Exam:");
  lines.push(`  GCS: ${gcs || "-"} (E${ne.gcsEye ?? "-"} V${ne.gcsVerbal ?? "-"} M${ne.gcsMotor ?? "-"})`);
  if (ne.pupils) {
    const { left, right } = ne.pupils;
    lines.push(`  Pupils: L ${left.size}mm ${left.reactive ? "+" : "-"}, R ${right.size}mm ${right.reactive ? "+" : "-"}`);
  }
  if (ne.motorExam) lines.push(`  Motor: ${ne.motorExam}`);
  if (ne.sedation) lines.push(`  RASS: ${ne.sedation}`);
  if (ne.icp !== undefined) lines.push(`  ICP: ${ne.icp} mmHg, CPP: ${ne.cpp ?? "-"} mmHg`);
  lines.push("");
  
  lines.push("Vitals / Support:");
  lines.push(
    `  MAP: ${s.vitals.map ?? "-"} | HR: ${s.vitals.hr ?? "-"} | SpO2: ${s.vitals.spo2 ?? "-"} | Vent: ${
      s.vitals.vent ?? "-"
    }`
  );
  lines.push("");
  lines.push(`Lines/Tubes: ${s.linesTubes || "-"}`);
  lines.push(`Drips: ${s.drips || "-"}`);
  lines.push("");
  lines.push("Labs:");
  lines.push(s.labs || "-");
  lines.push("");
  lines.push("Imaging:");
  lines.push(s.imaging || "-");
  lines.push("");
  lines.push("Checklist:");
  Object.entries(s.checklist).forEach(([k, v]) => lines.push(`  [${v ? "x" : " "}] ${k}`));
  lines.push("");
  lines.push("Problem List / Plan:");
  if (!s.problems.length) lines.push("  -");
  s.problems.forEach((p, i) => {
    lines.push(`${i + 1}. ${p.title}`);
    lines.push(`   A: ${p.assessment || "-"}`);
    lines.push(`   P: ${p.plan || "-"}`);
  });
  lines.push("");
  lines.push("Tasks:");
  if (!s.tasks.length) lines.push("  -");
  s.tasks.forEach((t) => lines.push(`  [${t.done ? "x" : " "}] ${t.text}${t.due ? ` (${t.due})` : ""}`));
  return lines.join("\n");
}

// Demo patients for NeuroICU
const DEMO_PATIENTS: RoundingSheet[] = [
  {
    ...buildBlank("James Wilson"),
    room: "NICU-4",
    diagnosis: "SAH - ruptured MCA aneurysm",
    diagnosisType: "sah",
    dayOfAdmit: 5,
    oneLiner: "POD5 clipping, bleed day 5, monitoring for vasospasm",
    neuroExam: {
      gcsEye: 4, gcsVerbal: 5, gcsMotor: 6,
      admissionGcsEye: 3, admissionGcsVerbal: 4, admissionGcsMotor: 5,
      pupils: { left: { size: 3, reactive: true }, right: { size: 3, reactive: true } },
      motorExam: "Full strength bilateral",
      motorStrength: { lue: 5, rue: 5, lle: 5, rle: 5 },
      sedation: "RASS 0",
      icp: 12, cpp: 72,
      evdDrain: "Set at 15cm, draining clear CSF",
    },
    clinicalScores: {
      sah: {
        huntHess: 2,
        modifiedFisher: 3,
        ruptureDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 days ago
      },
    },
    vitals: { map: 85, hr: 72, spo2: 98, vent: "2L NC" },
    drips: "Nimodipine 60mg q4h",
    linesTubes: "EVD, A-line, PIV x2",
    problems: [
      { id: uid(), title: "SAH - Hunt Hess 2, Fisher 3", assessment: "POD5, bleed day 5, peak vasospasm window", plan: "- Continue nimodipine\n- Daily TCDs\n- Maintain euvolemia" },
    ],
  },
  {
    ...buildBlank("Maria Garcia"),
    room: "NICU-7",
    diagnosis: "Large R MCA stroke",
    diagnosisType: "stroke",
    dayOfAdmit: 2,
    oneLiner: "s/p thrombectomy, TICI 2b, now with malignant edema",
    neuroExam: {
      gcsEye: 3, gcsVerbal: 2, gcsMotor: 5,
      admissionGcsEye: 2, admissionGcsVerbal: 1, admissionGcsMotor: 4,
      pupils: { left: { size: 3, reactive: true }, right: { size: 4, reactive: false } },
      motorExam: "L sided weakness 0/5, R intact",
      motorStrength: { lue: 0, rue: 5, lle: 0, rle: 5 },
      sedation: "RASS -2",
    },
    clinicalScores: {
      stroke: {
        nihss: 18,
        aspects: 6,
        territory: "R MCA M1",
        thrombectomy: true,
        ticiScore: "2b",
        lastKnownWell: "2 days ago, 6:00 AM",
        tpaGiven: true,
        strokeType: "ischemic",
      },
    },
    vitals: { map: 90, hr: 88, spo2: 96, vent: "AC/VC 500/14/40%/5" },
    drips: "Propofol 20mcg/kg/min, 3% NaCl",
    linesTubes: "ETT, OGT, Foley, R IJ CVC, A-line",
    problems: [
      { id: uid(), title: "Malignant MCA edema", assessment: "Worsening edema on repeat CT, R pupil sluggish", plan: "- HOB 30°\n- 3% NaCl bolus PRN\n- Neurosurgery consult for hemicraniectomy" },
    ],
  },
  {
    ...buildBlank("Priya Patel"),
    room: "NICU-2",
    diagnosis: "Left basal ganglia ICH with IVH",
    diagnosisType: "ich",
    dayOfAdmit: 1,
    oneLiner: "Hypertensive emergency, large deep hemorrhage requiring EVD",
    neuroExam: {
      gcsEye: 2, gcsVerbal: 2, gcsMotor: 4,
      admissionGcsEye: 3, admissionGcsVerbal: 2, admissionGcsMotor: 5,
      pupils: { left: { size: 5, reactive: true }, right: { size: 4, reactive: true } },
      motorExam: "R hemiplegia 0/5, L follows",
      motorStrength: { lue: 4, rue: 0, lle: 4, rle: 0 },
      sedation: "Propofol 15mcg/kg/min",
      icp: 20,
      cpp: 60,
      evdDrain: "EVD @ 10cm, draining blood-tinged CSF",
    },
    clinicalScores: {
      ich: {
        gcsScore: 8,
        ichVolume: 42,
        ichLocation: "deep",
        ivhPresent: true,
        infratentorial: false,
        age80Plus: false,
        functionalOutcome: "Family aware of ~70% mortality; reassess goals if no improvement in 72h.",
      },
    },
    vitals: { map: 110, hr: 62, spo2: 99, vent: "SIMV/PS 450/16/35%/8" },
    drips: "Nicardipine 7mg/hr, Propofol 15mcg/kg/min",
    linesTubes: "EVD, A-line, Foley, PIV x2",
    problems: [
      { id: uid(), title: "Large deep ICH", assessment: "ICH score elevated due to volume and IVH", plan: "- Maintain SBP 140-160\n- Scheduled hypertonic 3%\n- EVD draining q1h" },
    ],
  },
];

const STORAGE_KEY = "neuroicu-rounds-data";
const STORAGE_VERSION = 1;

function loadFromStorage(): RoundingSheet[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed.version !== STORAGE_VERSION) return null;
    return parsed.sheets || null;
  } catch {
    return null;
  }
}

function saveToStorage(sheets: RoundingSheet[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, sheets }));
  } catch (error) {
    // Handle quota exceeded or other localStorage errors
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Consider clearing old patient data.');
    }
    // Silently fail for other errors (e.g., localStorage disabled)
  }
}

export default function RoundingApp() {
  const [sheets, setSheets] = useState<RoundingSheet[]>(() => loadFromStorage() || DEMO_PATIENTS);
  const [activeId, setActiveId] = useState<Id>(sheets[0].id);
  const [activeTab, setActiveTab] = useState<TabKey>("scores");
  
  const active = useMemo(() => sheets.find((x) => x.id === activeId)!, [sheets, activeId]);

  const [templateId, setTemplateId] = useState(DEFAULT_TEMPLATE_ID);
  const [autoTemplate, setAutoTemplate] = useState(true);
  const activeTemplate = useMemo(() => TEMPLATES.find((t) => t.id === templateId)!, [templateId]);
  const smartphrasePreview = useMemo(() => renderSmartPhrase(activeTemplate, active), [activeTemplate, active]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToStorage(sheets);
    }, 1000); // Increased from 500ms to 1000ms to reduce localStorage write frequency
    return () => clearTimeout(timeoutId);
  }, [sheets]);

  useEffect(() => {
    if (!autoTemplate) return;
    const suggested = getTemplateForDiagnosis(active.diagnosisType);
    if (suggested !== templateId) {
      setTemplateId(suggested);
    }
  }, [active.diagnosisType, autoTemplate, templateId]);


  const updateActive = useCallback((patch: Partial<RoundingSheet>) => {
    setSheets((prev) =>
      prev.map((s) => (s.id === activeId ? { ...s, ...patch, updatedAt: Date.now() } : s))
    );
  }, [activeId]);

  const updateNeuroExam = useCallback((patch: Partial<NeuroExam>) => {
    setSheets((prev) =>
      prev.map((s) => (s.id === activeId ? { ...s, neuroExam: { ...s.neuroExam, ...patch }, updatedAt: Date.now() } : s))
    );
  }, [activeId]);

  const updateVitals = useCallback((patch: Partial<RoundingSheet["vitals"]>) => {
    setSheets((prev) =>
      prev.map((s) => (s.id === activeId ? { ...s, vitals: { ...s.vitals, ...patch }, updatedAt: Date.now() } : s))
    );
  }, [activeId]);

  const toggleChecklist = useCallback((key: string) => {
    setSheets((prev) =>
      prev.map((s) => (s.id === activeId ? { ...s, checklist: { ...s.checklist, [key]: !s.checklist[key] }, updatedAt: Date.now() } : s))
    );
  }, [activeId]);

  const addProblem = useCallback(() => {
    setSheets((prev) =>
      prev.map((s) => (s.id === activeId ? { ...s, problems: [...s.problems, { id: uid(), title: "New problem", assessment: "", plan: "" }], updatedAt: Date.now() } : s))
    );
  }, [activeId]);

  const updateProblem = useCallback((id: Id, patch: Partial<Problem>) => {
    setSheets((prev) =>
      prev.map((s) => (s.id === activeId ? { ...s, problems: s.problems.map((p) => (p.id === id ? { ...p, ...patch } : p)), updatedAt: Date.now() } : s))
    );
  }, [activeId]);

  const removeProblem = useCallback((id: Id) => {
    setSheets((prev) =>
      prev.map((s) => (s.id === activeId ? { ...s, problems: s.problems.filter((p) => p.id !== id), updatedAt: Date.now() } : s))
    );
  }, [activeId]);

  const addTask = useCallback(() => {
    setSheets((prev) =>
      prev.map((s) => (s.id === activeId ? { ...s, tasks: [...s.tasks, { id: uid(), text: "New task", done: false, due: "Today" }], updatedAt: Date.now() } : s))
    );
  }, [activeId]);

  const updateTask = useCallback((id: Id, patch: Partial<Task>) => {
    setSheets((prev) =>
      prev.map((s) => (s.id === activeId ? { ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)), updatedAt: Date.now() } : s))
    );
  }, [activeId]);

  const removeTask = useCallback((id: Id) => {
    setSheets((prev) =>
      prev.map((s) => (s.id === activeId ? { ...s, tasks: s.tasks.filter((t) => t.id !== id), updatedAt: Date.now() } : s))
    );
  }, [activeId]);

  const handleDiagnosisTypeChange = useCallback((value: DiagnosisType | "") => {
    setSheets((prev) =>
      prev.map((s) => {
        if (s.id !== activeId) return s;
        const nextType = (value || undefined) as DiagnosisType | undefined;
        const patch: Partial<RoundingSheet> = { diagnosisType: nextType };
        if (nextType) {
          Object.assign(patch, buildDiagnosisPrefillPatch(s, nextType));
        }
        return { ...s, ...patch, updatedAt: Date.now() };
      })
    );
  }, [activeId]);

  const handleDiagnosisPrefill = useCallback(() => {
    setSheets((prev) =>
      prev.map((s) => {
        if (s.id !== activeId || !s.diagnosisType) return s;
        const patch = buildDiagnosisPrefillPatch(s, s.diagnosisType);
        if (!Object.keys(patch).length) return s;
        return { ...s, ...patch, updatedAt: Date.now() };
      })
    );
  }, [activeId]);


  const handleTemplateChange = useCallback((nextId: string) => {
    setTemplateId(nextId);
    setAutoTemplate(false);
  }, []);

  const handleAutoTemplateToggle = useCallback((checked: boolean) => {
    setAutoTemplate(checked);
    if (checked) {
      // Use the active object directly since it's already memoized
      const currentActive = sheets.find((s) => s.id === activeId);
      if (currentActive) {
        setTemplateId(getTemplateForDiagnosis(currentActive.diagnosisType));
      }
    }
  }, [activeId, sheets]);

  const addPatient = useCallback(() => {
    const s = buildBlank(`Patient ${sheets.length + 1}`);
    setSheets((prev) => [s, ...prev]);
    setActiveId(s.id);
  }, [sheets.length]);

  const deletePatient = useCallback((id: Id) => {
    if (sheets.length <= 1) return;
    const newSheets = sheets.filter(s => s.id !== id);
    setSheets(newSheets);
    if (activeId === id) {
      setActiveId(newSheets[0].id);
    }
  }, [sheets, activeId]);

  const copyNote = useCallback(async () => {
    const text = toNoteText(active);
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied rounding note to clipboard.");
    } catch {
      window.prompt("Copy note text:", text);
    }
  }, [active]);

  const copySmartPhrase = useCallback(async () => {
    const text = smartphrasePreview;
    try {
      await navigator.clipboard.writeText(text);
      alert(`Copied ${activeTemplate.label} to clipboard.`);
    } catch {
      window.prompt("Copy SmartPhrase text:", text);
    }
  }, [smartphrasePreview, activeTemplate.label]);

  const clearData = useCallback(() => {
    if (!confirm("This will clear all patient data and reset to demo patients. Continue?")) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSheets(DEMO_PATIENTS);
      setActiveId(DEMO_PATIENTS[0].id);
      alert("Data cleared. Demo patients restored.");
    } catch {
      alert("Failed to clear data.");
    }
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (!meta) return;
      const lowerKey = event.key.toLowerCase();
      if (event.shiftKey && lowerKey === "p") {
        event.preventDefault();
        addProblem();
        return;
      }
      if (event.shiftKey && lowerKey === "t") {
        event.preventDefault();
        addTask();
        return;
      }
      if (event.shiftKey && lowerKey === "c") {
        event.preventDefault();
        void copySmartPhrase();
        return;
      }
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const currentIndex = TABS.indexOf(activeTab);
        const nextIndex = (currentIndex + direction + TABS.length) % TABS.length;
        setActiveTab(TABS[nextIndex]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeTab, addProblem, addTask, copySmartPhrase]);

  const sortedSheets = useMemo(() => [...sheets].sort((a, b) => b.updatedAt - a.updatedAt), [sheets]);

  const gcsTotal = useMemo(() => {
    const ne = active.neuroExam || {};
    return (ne.gcsEye || 0) + (ne.gcsVerbal || 0) + (ne.gcsMotor || 0);
  }, [active.neuroExam]);

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      {/* Header */}
      <header style={{ 
        padding: "12px 16px", 
        borderBottom: "1px solid #e2e8f0", 
        display: "flex", 
        gap: 12, 
        alignItems: "center",
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 24 }}>🧠</span>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#1e293b" }}>Neuro ICU Rounds</span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <select
            value={templateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            style={{ ...input, width: 200, opacity: autoTemplate ? 0.6 : 1 }}
            disabled={autoTemplate}
            aria-label="SmartPhrase template"
          >
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#475569" }}>
            <input
              type="checkbox"
              checked={autoTemplate}
              onChange={(e) => handleAutoTemplateToggle(e.target.checked)}
            />
            Auto-match template
          </label>
          <button onClick={copySmartPhrase} style={btnPrimary} title="Cmd/Ctrl+Shift+C">
            📋 Copy SmartPhrase
          </button>
          <a
            href="https://amaranth-ula-81.tiiny.site"
            target="_blank"
            rel="noreferrer"
            style={{ ...btn, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
            title="Open published link"
          >
            🔗 Open tiny.host link
          </a>
          <button onClick={addPatient} style={btnSuccess}>+ Add Patient</button>
          <button onClick={copyNote} style={btn}>Copy Note</button>
          <button onClick={clearData} style={{ ...btn, color: "#dc2626" }} title="Clear all data and reset to demo patients">🔄 Reset Data</button>
        </div>
      </header>

      <div className="main-layout" style={{ display: "grid", gap: 16, padding: 16 }}>
        {/* Patient List Sidebar */}
        <aside className="sidebar" style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontWeight: 700, color: "#475569" }}>Patient List</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{sheets.length} patients</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {sortedSheets.map((s) => (
              <div key={s.id} style={{ position: "relative" }}>
                <button
                  onClick={() => setActiveId(s.id)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: s.id === activeId ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                    background: s.id === activeId ? "#eff6ff" : "#fff",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
                    <div style={{ fontWeight: 600, color: "#1e293b" }}>{s.patientName}</div>
                    <div style={{ fontSize: 11, color: "#64748b", background: "#f1f5f9", padding: "2px 6px", borderRadius: 4 }}>
                      {s.room || "—"}
                    </div>
                  </div>
                  {s.diagnosis && (
                    <div style={{ fontSize: 12, color: "#3b82f6", marginTop: 4, fontWeight: 500 }}>
                      {s.diagnosis}
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, lineHeight: 1.4 }}>
                    {s.oneLiner || "—"}
                  </div>
                  {s.dayOfAdmit && (
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 6 }}>
                      HD #{s.dayOfAdmit}
                    </div>
                  )}
                </button>
                {sheets.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); deletePatient(s.id); }}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 14,
                      color: "#94a3b8",
                      opacity: 0.6,
                    }}
                    title="Remove patient"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="content">
          {/* Patient Header */}
          <div style={{ ...card, marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <input
                value={active.patientName}
                onChange={(e) => updateActive({ patientName: e.target.value })}
                style={{ ...h1Input, flex: 1, minWidth: 200 }}
                placeholder="Patient Name"
              />
              <input
                placeholder="Room"
                value={active.room || ""}
                onChange={(e) => updateActive({ room: e.target.value })}
                style={{ ...tinyInput, width: 100 }}
              />
              <input
                placeholder="Diagnosis"
                value={active.diagnosis || ""}
                onChange={(e) => updateActive({ diagnosis: e.target.value })}
                style={{ ...input, flex: 1, minWidth: 200 }}
              />
              <div style={{ display: "flex", flexDirection: "column", minWidth: 220 }}>
                <label style={{ ...label, marginTop: 0 }}>Diagnosis Type</label>
                <select
                  value={active.diagnosisType ?? ""}
                  onChange={(e) => handleDiagnosisTypeChange(e.target.value as DiagnosisType | "")}
                  style={{ ...input, minWidth: 200 }}
                >
                  <option value="">Select type...</option>
                  {DIAGNOSIS_SELECT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleDiagnosisPrefill}
                  disabled={!active.diagnosisType}
                  style={{
                    ...btn,
                    marginTop: 6,
                    fontSize: 12,
                    opacity: active.diagnosisType ? 1 : 0.6,
                  }}
                >
                  ⚡ Prefill note
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 12, color: "#64748b" }}>HD#</span>
                <input
                  type="number"
                  min={1}
                  value={active.dayOfAdmit || ""}
                  onChange={(e) => updateActive({ dayOfAdmit: e.target.value ? Number(e.target.value) : undefined })}
                  style={{ ...tinyInput, width: 60 }}
                />
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>{active.dateISO}</div>
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={label}>One-liner</label>
              <textarea
                value={active.oneLiner}
                onChange={(e) => updateActive({ oneLiner: e.target.value })}
                rows={2}
                style={textarea}
                placeholder="Brief summary: diagnosis, hospital day, key events, current status..."
              />
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: "none",
                  background: activeTab === tab ? "#1e293b" : "#e2e8f0",
                  color: activeTab === tab ? "#fff" : "#475569",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                  textTransform: "capitalize",
                }}
              >
                {tab === "scores" ? "📊 Clinical Scores" : tab === "exam" ? "🧠 Neuro Exam" : tab === "data" ? "💊 Data" : "📋 Plan & Tasks"}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "scores" && (
            <ClinicalScores sheet={active} onUpdate={updateActive} />
          )}

          {activeTab === "exam" && (
            <div style={card}>
              <h3 style={sectionTitle}>Neurological Examination</h3>
              
              {/* GCS */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <span style={{ fontWeight: 600, color: "#1e293b" }}>GCS:</span>
                  <span style={{ 
                    fontSize: 24, 
                    fontWeight: 700, 
                    color: gcsTotal <= 8 ? "#dc2626" : gcsTotal <= 12 ? "#f59e0b" : "#16a34a",
                    background: "#f8fafc",
                    padding: "4px 12px",
                    borderRadius: 8,
                  }}>
                    {gcsTotal || "—"}
                  </span>
                  <span style={{ fontSize: 13, color: "#64748b" }}>
                    (E{active.neuroExam?.gcsEye ?? "—"} V{active.neuroExam?.gcsVerbal ?? "—"} M{active.neuroExam?.gcsMotor ?? "—"})
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  <div>
                    <label style={label}>Eye (1-4)</label>
                    <select
                      value={active.neuroExam?.gcsEye ?? ""}
                      onChange={(e) => updateNeuroExam({ gcsEye: e.target.value ? Number(e.target.value) as any : undefined })}
                      style={input}
                    >
                      <option value="">—</option>
                      <option value="1">1 - None</option>
                      <option value="2">2 - To pain</option>
                      <option value="3">3 - To voice</option>
                      <option value="4">4 - Spontaneous</option>
                    </select>
                  </div>
                  <div>
                    <label style={label}>Verbal (1-5)</label>
                    <select
                      value={active.neuroExam?.gcsVerbal ?? ""}
                      onChange={(e) => updateNeuroExam({ gcsVerbal: e.target.value ? Number(e.target.value) as any : undefined })}
                      style={input}
                    >
                      <option value="">—</option>
                      <option value="1">1 - None</option>
                      <option value="2">2 - Incomprehensible</option>
                      <option value="3">3 - Inappropriate</option>
                      <option value="4">4 - Confused</option>
                      <option value="5">5 - Oriented</option>
                    </select>
                  </div>
                  <div>
                    <label style={label}>Motor (1-6)</label>
                    <select
                      value={active.neuroExam?.gcsMotor ?? ""}
                      onChange={(e) => updateNeuroExam({ gcsMotor: e.target.value ? Number(e.target.value) as any : undefined })}
                      style={input}
                    >
                      <option value="">—</option>
                      <option value="1">1 - None</option>
                      <option value="2">2 - Extension</option>
                      <option value="3">3 - Flexion</option>
                      <option value="4">4 - Withdrawal</option>
                      <option value="5">5 - Localizes</option>
                      <option value="6">6 - Obeys</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pupils */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>Pupils</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {(["left", "right"] as const).map((side) => (
                    <div key={side} style={{ padding: 12, background: "#f8fafc", borderRadius: 10 }}>
                      <div style={{ fontWeight: 500, marginBottom: 8, textTransform: "capitalize" }}>{side}</div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div>
                          <label style={{ ...label, marginTop: 0 }}>Size (mm)</label>
                          <input
                            type="number"
                            min={1}
                            max={9}
                            value={active.neuroExam?.pupils?.[side]?.size ?? 3}
                            onChange={(e) => {
                              const pupils = { ...active.neuroExam?.pupils } as any;
                              pupils[side] = { ...pupils[side], size: Number(e.target.value) };
                              updateNeuroExam({ pupils });
                            }}
                            style={{ ...tinyInput, width: 60 }}
                          />
                        </div>
                        <div>
                          <label style={{ ...label, marginTop: 0 }}>Reactive</label>
                          <button
                            onClick={() => {
                              const pupils = { ...active.neuroExam?.pupils } as any;
                              pupils[side] = { ...pupils[side], reactive: !pupils[side]?.reactive };
                              updateNeuroExam({ pupils });
                            }}
                            style={{
                              ...btn,
                              background: active.neuroExam?.pupils?.[side]?.reactive ? "#16a34a" : "#dc2626",
                              color: "#fff",
                              border: "none",
                            }}
                          >
                            {active.neuroExam?.pupils?.[side]?.reactive ? "✓ Yes" : "✗ No"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <CollapsibleSection title="Advanced Neuro Exam" defaultCollapsed>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={label}>Motor Exam</label>
                    <input
                      value={active.neuroExam?.motorExam ?? ""}
                      onChange={(e) => updateNeuroExam({ motorExam: e.target.value })}
                      style={input}
                      placeholder="LUE 5/5, RUE 5/5, LLE 5/5, RLE 5/5"
                    />
                  </div>
                  <div>
                    <label style={label}>Cranial Nerves</label>
                    <input
                      value={active.neuroExam?.cranialNerves ?? ""}
                      onChange={(e) => updateNeuroExam({ cranialNerves: e.target.value })}
                      style={input}
                      placeholder="Grossly intact"
                    />
                  </div>
                  <div>
                    <label style={label}>Sedation / RASS</label>
                    <input
                      value={active.neuroExam?.sedation ?? ""}
                      onChange={(e) => updateNeuroExam({ sedation: e.target.value })}
                      style={input}
                      placeholder="RASS 0, calm and alert"
                    />
                  </div>
                  <div>
                    <label style={label}>Seizure Activity</label>
                    <input
                      value={active.neuroExam?.seizures ?? ""}
                      onChange={(e) => updateNeuroExam({ seizures: e.target.value })}
                      style={input}
                      placeholder="None, on cEEG"
                    />
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="ICP / Drainage" defaultCollapsed>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  <div>
                    <label style={label}>ICP (mmHg)</label>
                    <input
                      type="number"
                      value={active.neuroExam?.icp ?? ""}
                      onChange={(e) => updateNeuroExam({ icp: e.target.value ? Number(e.target.value) : undefined })}
                      style={input}
                      placeholder="Target <20"
                    />
                  </div>
                  <div>
                    <label style={label}>CPP (mmHg)</label>
                    <input
                      type="number"
                      value={active.neuroExam?.cpp ?? ""}
                      onChange={(e) => updateNeuroExam({ cpp: e.target.value ? Number(e.target.value) : undefined })}
                      style={input}
                      placeholder="Target >60"
                    />
                  </div>
                  <div>
                    <label style={label}>EVD Settings</label>
                    <input
                      value={active.neuroExam?.evdDrain ?? ""}
                      onChange={(e) => updateNeuroExam({ evdDrain: e.target.value })}
                      style={input}
                      placeholder="Set at 15cm, draining"
                    />
                  </div>
                </div>
              </CollapsibleSection>
            </div>
          )}

          {activeTab === "data" && (
            <div style={card}>
              <h3 style={sectionTitle}>Vitals & Support</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                <div>
                  <label style={label}>MAP</label>
                  <input
                    type="number"
                    value={active.vitals.map ?? ""}
                    onChange={(e) => updateVitals({ map: e.target.value ? Number(e.target.value) : undefined })}
                    style={input}
                  />
                </div>
                <div>
                  <label style={label}>HR</label>
                  <input
                    type="number"
                    value={active.vitals.hr ?? ""}
                    onChange={(e) => updateVitals({ hr: e.target.value ? Number(e.target.value) : undefined })}
                    style={input}
                  />
                </div>
                <div>
                  <label style={label}>SpO₂</label>
                  <input
                    type="number"
                    value={active.vitals.spo2 ?? ""}
                    onChange={(e) => updateVitals({ spo2: e.target.value ? Number(e.target.value) : undefined })}
                    style={input}
                  />
                </div>
                <div>
                  <label style={label}>Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={active.vitals.temp ?? ""}
                    onChange={(e) => updateVitals({ temp: e.target.value ? Number(e.target.value) : undefined })}
                    style={input}
                  />
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <label style={label}>Ventilator Settings</label>
                <input
                  value={active.vitals.vent ?? ""}
                  onChange={(e) => updateVitals({ vent: e.target.value })}
                  style={input}
                  placeholder="AC/VC 450/16/40%/8 or 2L NC"
                />
              </div>

              <div style={{ marginTop: 16 }}>
                <label style={label}>Lines / Tubes</label>
                <input value={active.linesTubes} onChange={(e) => updateActive({ linesTubes: e.target.value })} style={input} placeholder="EVD, CVC, A-line, ETT, OGT, Foley" />
              </div>
              <div style={{ marginTop: 12 }}>
                <label style={label}>Drips / Infusions</label>
                <input value={active.drips} onChange={(e) => updateActive({ drips: e.target.value })} style={input} placeholder="Propofol, Norepi, Nimodipine..." />
              </div>

              <CollapsibleSection title="Labs & Imaging" defaultCollapsed>
                <div>
                  <label style={label}>Labs</label>
                  <textarea
                    value={active.labs}
                    onChange={(e) => updateActive({ labs: e.target.value })}
                    rows={4}
                    style={textarea}
                    placeholder="Na 142, K 4.0, Cr 0.9, WBC 8.2, Hgb 10.1, Plt 180..."
                  />
                </div>
                <div style={{ marginTop: 16 }}>
                  <label style={label}>Imaging</label>
                  <textarea
                    value={active.imaging}
                    onChange={(e) => updateActive({ imaging: e.target.value })}
                    rows={3}
                    style={textarea}
                    placeholder="CT Head: Stable SAH, no new hemorrhage. CTA: No vasospasm..."
                  />
                </div>
              </CollapsibleSection>
            </div>
          )}

          {activeTab === "plan" && (
            <div style={card}>
              {/* Checklist */}
              <h3 style={sectionTitle}>Daily Checklist</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 24 }}>
                {Object.keys(active.checklist).map((k) => (
                  <button key={k} onClick={() => toggleChecklist(k)} style={chip(active.checklist[k])}>
                    {active.checklist[k] ? "✓ " : "○ "}
                    {k}
                  </button>
                ))}
              </div>

              {/* Problems */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: 12, gap: 8 }}>
                <h3 style={{ ...sectionTitle, marginBottom: 0, marginRight: "auto" }}>Problem List / Plan</h3>
                <span style={hotkeyHint}>Hotkey: Cmd/Ctrl+Shift+P</span>
                <button onClick={addProblem} style={btnSuccess} title="Cmd/Ctrl+Shift+P">+ Add Problem</button>
              </div>

              {active.problems.length === 0 && (
                <div style={{ padding: 20, textAlign: "center", color: "#94a3b8", background: "#f8fafc", borderRadius: 12 }}>
                  Add problems: "SAH - vasospasm", "Resp failure", "Seizures"...
                </div>
              )}

              {active.problems.map((p, idx) => (
                <div key={p.id} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontWeight: 700, color: "#3b82f6" }}>#{idx + 1}</span>
                    <input
                      value={p.title}
                      onChange={(e) => updateProblem(p.id, { title: e.target.value })}
                      style={{ ...input, fontWeight: 600, flex: 1 }}
                      placeholder="Problem title"
                    />
                    <button onClick={() => removeProblem(p.id)} style={btnDanger}>Remove</button>
                  </div>
                  <label style={label}>Assessment</label>
                  <textarea value={p.assessment} onChange={(e) => updateProblem(p.id, { assessment: e.target.value })} rows={2} style={textarea} placeholder="Current status, trends, concerns..." />
                  <label style={label}>Plan</label>
                  <textarea value={p.plan} onChange={(e) => updateProblem(p.id, { plan: e.target.value })} rows={3} style={textarea} placeholder="- Continue...\n- Monitor...\n- Consult..." />
                </div>
              ))}

              {/* Tasks */}
              <div style={{ display: "flex", alignItems: "center", marginTop: 24, marginBottom: 12, gap: 8 }}>
                <h3 style={{ ...sectionTitle, marginBottom: 0, marginRight: "auto" }}>Tasks</h3>
                <span style={hotkeyHint}>Hotkey: Cmd/Ctrl+Shift+T</span>
                <button onClick={addTask} style={btnSuccess} title="Cmd/Ctrl+Shift+T">+ Add Task</button>
              </div>

              {active.tasks.map((t) => (
                <div key={t.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={(e) => updateTask(t.id, { done: e.target.checked })}
                    style={{ width: 20, height: 20, cursor: "pointer" }}
                  />
                  <input
                    value={t.text}
                    onChange={(e) => updateTask(t.id, { text: e.target.value })}
                    style={{ ...input, flex: 1, textDecoration: t.done ? "line-through" : "none", opacity: t.done ? 0.6 : 1 }}
                  />
                  <select value={t.due ?? "Today"} onChange={(e) => updateTask(t.id, { due: e.target.value as any })} style={{ ...input, width: 90 }}>
                    <option>Today</option>
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                  <button onClick={() => removeTask(t.id)} style={btnDanger}>×</button>
                </div>
              ))}
            </div>
          )}

          {/* SmartPhrase Preview */}
          <div style={{ ...card, marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontWeight: 700, color: "#1e293b" }}>SmartPhrase Preview</span>
              <span style={{ fontSize: 12, color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: 4 }}>
                {activeTemplate.label}
              </span>
              <button onClick={copySmartPhrase} style={{ ...btnPrimary, marginLeft: "auto", fontSize: 12, padding: "6px 12px" }}>
                📋 Copy
              </button>
            </div>
            <textarea
              value={smartphrasePreview}
              readOnly
              rows={16}
              style={{ ...textarea, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: 12, background: "#f8fafc" }}
            />
          </div>
        </main>
      </div>

      <style>
        {`
          .main-layout {
            grid-template-columns: 1fr;
          }
          @media (min-width: 1024px) {
            .main-layout {
              grid-template-columns: 320px 1fr;
            }
          }
          .sidebar {
            position: sticky;
            top: 80px;
            max-height: calc(100vh - 100px);
            overflow-y: auto;
          }
        `}
      </style>
    </div>
  );
}

// Styles
const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 16,
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: "#1e293b",
  marginBottom: 12,
};

const label: React.CSSProperties = { 
  display: "block", 
  marginTop: 8, 
  marginBottom: 4, 
  fontSize: 12, 
  fontWeight: 500,
  color: "#64748b" 
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  outline: "none",
  fontSize: 14,
  transition: "border-color 0.15s",
};

const tinyInput: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #e2e8f0",
  outline: "none",
  fontSize: 13,
};

const h1Input: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 700,
  padding: "8px 12px",
  borderRadius: 10,
  border: "1px solid transparent",
  outline: "none",
  color: "#1e293b",
};

const textarea: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  outline: "none",
  resize: "vertical",
  fontSize: 14,
  lineHeight: 1.5,
};

const btn: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  background: "#fff",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 500,
  transition: "all 0.15s",
};

const btnPrimary: React.CSSProperties = {
  ...btn,
  background: "#3b82f6",
  border: "1px solid #3b82f6",
  color: "#fff",
};

const btnSuccess: React.CSSProperties = {
  ...btn,
  background: "#16a34a",
  border: "1px solid #16a34a",
  color: "#fff",
};

const btnDanger: React.CSSProperties = {
  ...btn,
  border: "1px solid #fecaca",
  color: "#dc2626",
  background: "#fef2f2",
};

const chip = (on: boolean): React.CSSProperties => ({
  padding: "10px 12px",
  borderRadius: 10,
  border: on ? "1px solid #16a34a" : "1px solid #e2e8f0",
  background: on ? "#dcfce7" : "#fff",
  color: on ? "#166534" : "#475569",
  fontSize: 12,
  fontWeight: 500,
  textAlign: "left",
  cursor: "pointer",
  transition: "all 0.15s",
});

const hotkeyHint: React.CSSProperties = {
  fontSize: 11,
  color: "#94a3b8",
};

type CollapsibleProps = {
  title: string;
  defaultCollapsed?: boolean;
  children: React.ReactNode;
};

const CollapsibleSection = React.memo(({ title, defaultCollapsed = false, children }: CollapsibleProps) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, marginBottom: 16, background: "#f8fafc" }}>
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        style={{
          width: "100%",
          background: "none",
          border: "none",
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontWeight: 600,
          fontSize: 13,
          color: "#0f172a",
          cursor: "pointer",
        }}
        aria-expanded={!collapsed}
      >
        <span>{collapsed ? "▸" : "▾"}</span>
        <span>{title}</span>
      </button>
      {!collapsed && (
        <div style={{ padding: 12, borderTop: "1px solid #e2e8f0", background: "#fff", borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
          {children}
        </div>
      )}
    </div>
  );
});

CollapsibleSection.displayName = 'CollapsibleSection';
