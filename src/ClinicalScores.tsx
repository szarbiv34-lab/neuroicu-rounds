// ClinicalScores.tsx - Neuro ICU Clinical Decision Tools
import React, { useEffect, useMemo, useState, useCallback } from "react";
import type { 
  RoundingSheet, 
  HuntHessGrade, 
  ModifiedFisherGrade,
  SAHScores,
  StrokeScores,
  ICHScores,
} from "./types";

// ============================================================================
// HUNT & HESS SCALE
// ============================================================================
const HUNT_HESS_DESCRIPTIONS: Record<HuntHessGrade, { description: string; mortality: string; criteria: string }> = {
  1: { 
    description: "Asymptomatic or mild headache", 
    mortality: "~1%",
    criteria: "Asymptomatic, mild headache, slight nuchal rigidity"
  },
  2: { 
    description: "Moderate-severe headache, nuchal rigidity", 
    mortality: "~5%",
    criteria: "Moderate to severe headache, nuchal rigidity, no neurologic deficit other than cranial nerve palsy"
  },
  3: { 
    description: "Drowsy, mild focal deficit", 
    mortality: "~19%",
    criteria: "Drowsiness, confusion, mild focal neurologic deficit"
  },
  4: { 
    description: "Stuporous, moderate-severe hemiparesis", 
    mortality: "~42%",
    criteria: "Stupor, moderate-severe hemiparesis, early decerebrate rigidity"
  },
  5: { 
    description: "Coma, decerebrate posturing", 
    mortality: "~77%",
    criteria: "Deep coma, decerebrate posturing, moribund appearance"
  },
} as const;

// ============================================================================
// MODIFIED FISHER SCALE
// ============================================================================
const MODIFIED_FISHER_DESCRIPTIONS: Record<ModifiedFisherGrade, { description: string; vasospasmRisk: string; criteria: string }> = {
  0: { 
    description: "No SAH or IVH", 
    vasospasmRisk: "0%",
    criteria: "No subarachnoid blood or intraventricular hemorrhage"
  },
  1: { 
    description: "Thin SAH, no IVH", 
    vasospasmRisk: "24%",
    criteria: "Focal or diffuse thin SAH (<1mm), no IVH"
  },
  2: { 
    description: "Thin SAH with IVH", 
    vasospasmRisk: "33%",
    criteria: "Focal or diffuse thin SAH with IVH"
  },
  3: { 
    description: "Thick SAH, no IVH", 
    vasospasmRisk: "33%",
    criteria: "Focal or diffuse thick SAH (≥1mm), no IVH"
  },
  4: { 
    description: "Thick SAH with IVH", 
    vasospasmRisk: "40%",
    criteria: "Focal or diffuse thick SAH with IVH"
  },
} as const;

// ============================================================================
// ICH SCORE + NIHSS LOOKUPS
// ============================================================================
const ICH_MORTALITY_TABLE: Record<number, string> = {
  0: "0%",
  1: "13%",
  2: "26%",
  3: "72%",
  4: "97%",
  5: "100%",
  6: "100%",
} as const;

const NIHSS_SEVERITY = [
  { max: 5, label: "Minor", color: "#16a34a", bg: "#dcfce7" },
  { max: 15, label: "Moderate", color: "#f97316", bg: "#ffedd5" },
  { max: Infinity, label: "Severe", color: "#dc2626", bg: "#fee2e2" },
] as const;

// ============================================================================
// GCS SCALE DESCRIPTIONS
// ============================================================================
const GCS_EYE_DESCRIPTIONS = {
  1: "No eye opening",
  2: "Eye opening to pain",
  3: "Eye opening to verbal command",
  4: "Eyes open spontaneously",
} as const;

const GCS_VERBAL_DESCRIPTIONS = {
  1: "No verbal response",
  2: "Incomprehensible sounds",
  3: "Inappropriate words",
  4: "Confused",
  5: "Oriented",
} as const;

const GCS_MOTOR_DESCRIPTIONS = {
  1: "No motor response",
  2: "Extension to pain (decerebrate)",
  3: "Abnormal flexion (decorticate)",
  4: "Withdrawal from pain",
  5: "Localizes pain",
  6: "Obeys commands",
} as const;

// ============================================================================
// MOTOR STRENGTH SCALE
// ============================================================================
const MOTOR_STRENGTH_DESCRIPTIONS = {
  0: "No contraction (0/5)",
  1: "Flicker or trace (1/5)",
  2: "Movement with gravity eliminated (2/5)",
  3: "Movement against gravity (3/5)",
  4: "Movement against some resistance (4/5)",
  5: "Normal strength (5/5)",
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function calculateBleedDay(ruptureDate: string | undefined): number | null {
  if (!ruptureDate) return null;
  const rupture = new Date(ruptureDate);
  const today = new Date();
  const diffTime = today.getTime() - rupture.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 1;
}

function getGcsCategory(gcs: number): { label: string; color: string; bgColor: string } {
  if (gcs <= 8) return { label: "Severe", color: "#dc2626", bgColor: "#fef2f2" };
  if (gcs <= 12) return { label: "Moderate", color: "#f59e0b", bgColor: "#fffbeb" };
  return { label: "Mild", color: "#16a34a", bgColor: "#f0fdf4" };
}

function getHuntHessColor(grade: HuntHessGrade): { color: string; bgColor: string } {
  if (grade <= 2) return { color: "#16a34a", bgColor: "#f0fdf4" };
  if (grade === 3) return { color: "#f59e0b", bgColor: "#fffbeb" };
  return { color: "#dc2626", bgColor: "#fef2f2" };
}

function getModifiedFisherColor(grade: ModifiedFisherGrade): { color: string; bgColor: string } {
  if (grade <= 1) return { color: "#16a34a", bgColor: "#f0fdf4" };
  if (grade <= 2) return { color: "#f59e0b", bgColor: "#fffbeb" };
  return { color: "#dc2626", bgColor: "#fef2f2" };
}

function computeIchScore(ich: ICHScores | undefined, fallbackGcs: number): { score: number; applied: boolean } {
  if (!ich) return { score: 0, applied: false };
  let score = 0;
  let applied = false;
  const gcs = ich.gcsScore ?? fallbackGcs;
  if (gcs) {
    applied = true;
    if (gcs >= 13) score += 0;
    else if (gcs >= 5) score += 1;
    else score += 2;
  }
  if (ich.ichVolume !== undefined) {
    applied = true;
    if (ich.ichVolume >= 30) score += 1;
  }
  if (ich.ivhPresent) {
    applied = true;
    score += 1;
  }
  if (ich.infratentorial) {
    applied = true;
    score += 1;
  }
  if (ich.age80Plus) {
    applied = true;
    score += 1;
  }
  return { score, applied };
}

function getIchSeverity(score: number) {
  if (score <= 1) return { label: "Low risk", color: "#16a34a", bg: "#dcfce7" };
  if (score <= 3) return { label: "Intermediate", color: "#f97316", bg: "#ffedd5" };
  return { label: "High risk", color: "#dc2626", bg: "#fee2e2" };
}

function getNihssCategory(nihss?: number) {
  if (nihss === undefined || nihss === null) return null;
  return NIHSS_SEVERITY.find((tier) => nihss <= tier.max) ?? NIHSS_SEVERITY[NIHSS_SEVERITY.length - 1];
}

function getNihssGuidance(score?: number): string {
  if (score === undefined || score === null) return "Document NIHSS to unlock severity-driven prompts.";
  if (score <= 5) return "Minor deficits — optimize BP and consider DAPT if high-risk TIA.";
  if (score <= 15) return "Moderate stroke — meets NIHSS ≥6 threshold for EVT when LVO confirmed.";
  return "Severe stroke — anticipate airway protection, edema, and malignant edema rescue.";
}

// ============================================================================
// HIPAA GUARDS
// ============================================================================
const HIPAA_RULES = [
  { regex: /\bmrn\b/i, message: "MRN detected" },
  { regex: /\bdob\b/i, message: "DOB detected" },
  { regex: /\bssn\b/i, message: "SSN detected" },
  { regex: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/, message: "SSN-like number detected" },
  { regex: /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/, message: "Phone number detected" },
  { regex: /@/, message: "Email address detected" },
];

function findHipaaIssue(text: string): string | null {
  if (!text) return null;
  const hit = HIPAA_RULES.find((rule) => rule.regex.test(text));
  if (hit) return hit.message;
  if (text.length > 200) return "Entry is too long for a structured score field";
  return null;
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================
interface ClinicalScoresProps {
  sheet: RoundingSheet;
  onUpdate: (patch: Partial<RoundingSheet>) => void;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function ClinicalScores({ sheet, onUpdate }: ClinicalScoresProps) {
  const scores = sheet.clinicalScores || {};
  const neuro = sheet.neuroExam || {};
  const diagnosisText = (sheet.diagnosis || "").toLowerCase();
  const noDxType = !sheet.diagnosisType;
  const showSAH = noDxType || sheet.diagnosisType === "sah" || diagnosisText.includes("sah") || diagnosisText.includes("subarachnoid");
  const showStroke = noDxType || sheet.diagnosisType === "stroke" || diagnosisText.includes("stroke");
  const showICH = noDxType || sheet.diagnosisType === "ich" || diagnosisText.includes("ich") || diagnosisText.includes("intracerebral") || diagnosisText.includes("hemorrhage");
  const [hipaaWarning, setHipaaWarning] = useState<string | null>(null);

  // Build section registry once per diagnosis type changes
  const sectionRegistry = useMemo(() => ([
    { id: "gcs", label: "GCS", required: true, condition: true },
    { id: "sah", label: "SAH scales", required: false, condition: showSAH },
    { id: "ich", label: "ICH score", required: false, condition: showICH },
    { id: "stroke", label: "Stroke aids", required: false, condition: showStroke },
    { id: "motor", label: "Motor exam", required: true, condition: true },
    { id: "pupils", label: "Pupils", required: true, condition: true },
  ]), [showSAH, showICH, showStroke]);

  const [enabledSections, setEnabledSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sectionRegistry.map((section) => [section.id, section.required ? true : section.condition]))
  );

  useEffect(() => {
    setEnabledSections((prev) => {
      const next = { ...prev };
      sectionRegistry.forEach((section) => {
        if (section.required) {
          next[section.id] = true;
        } else if (!section.condition) {
          next[section.id] = false;
        } else if (!(section.id in next)) {
          next[section.id] = true;
        }
      });
      return next;
    });
  }, [sectionRegistry]);

  // Calculate current GCS - memoized to prevent recalculation
  const currentGcs = useMemo(() => {
    return (neuro.gcsEye || 0) + (neuro.gcsVerbal || 0) + (neuro.gcsMotor || 0);
  }, [neuro.gcsEye, neuro.gcsVerbal, neuro.gcsMotor]);

  // Calculate admission GCS - memoized to prevent recalculation
  const admissionGcs = useMemo(() => {
    return (neuro.admissionGcsEye || 0) + (neuro.admissionGcsVerbal || 0) + (neuro.admissionGcsMotor || 0);
  }, [neuro.admissionGcsEye, neuro.admissionGcsVerbal, neuro.admissionGcsMotor]);

  // Calculate bleed day for SAH - only when rupture date changes
  const bleedDay = useMemo(() => {
    return calculateBleedDay(scores.sah?.ruptureDate);
  }, [scores.sah?.ruptureDate]);

  // Compute ICH score - memoized with proper dependencies
  const ichScoreInfo = useMemo(() => 
    computeIchScore(scores.ich, currentGcs || admissionGcs), 
    [scores.ich, currentGcs, admissionGcs]
  );
  
  // Compute NIHSS tier - memoized
  const nihssTier = useMemo(() => 
    getNihssCategory(scores.stroke?.nihss), 
    [scores.stroke?.nihss]
  );
  
  // Compute ICH tier and mortality - memoized
  const ichTier = useMemo(() => 
    ichScoreInfo.applied ? getIchSeverity(ichScoreInfo.score) : null,
    [ichScoreInfo.applied, ichScoreInfo.score]
  );
  
  const ichMortality = useMemo(() => 
    ichScoreInfo.applied ? (ICH_MORTALITY_TABLE[ichScoreInfo.score] ?? "—") : null,
    [ichScoreInfo.applied, ichScoreInfo.score]
  );

  // Compute ASPECTS badge and guidance - memoized
  const aspectsScore = scores.stroke?.aspects;
  const aspectsBadge = useMemo(() => {
    if (aspectsScore === undefined || aspectsScore === null) return { label: "Awaiting score", color: "#64748b", bg: "#f1f5f9" };
    if (aspectsScore <= 5) return { label: "Large core", color: "#b91c1c", bg: "#fee2e2" };
    if (aspectsScore >= 7) return { label: "Favorable", color: "#15803d", bg: "#dcfce7" };
    return { label: "Borderline", color: "#b45309", bg: "#ffedd5" };
  }, [aspectsScore]);
  
  const aspectsGuidance = useMemo(() => {
    if (aspectsScore === undefined || aspectsScore === null) return "Document ASPECTS to quantify early ischemic change.";
    if (aspectsScore <= 5) return "Large core (>1/3 MCA) — focus on edema control and early hemicraniectomy planning.";
    if (aspectsScore >= 7) return "Favorable core — thrombectomy candidate if LVO and within 24h window.";
    return "Borderline core — obtain perfusion imaging for penumbra estimate and discuss with neurointervention.";
  }, [aspectsScore]);

  // HIPAA validation with useCallback
  const guardHipaaText = useCallback((value: string, field: string, onSafe: (clean: string) => void) => {
    const issue = findHipaaIssue(value);
    if (issue) {
      setHipaaWarning(`${field}: ${issue}. Keep entries de-identified (no names, MRN, phone, email).`);
      return;
    }
    setHipaaWarning(null);
    onSafe(value);
  }, []);

  // Update functions - all memoized with useCallback
  const updateSAH = useCallback((patch: Partial<SAHScores>) => {
    const currentScores = sheet.clinicalScores || {};
    onUpdate({ clinicalScores: { ...currentScores, sah: { ...currentScores.sah, ...patch } } });
  }, [onUpdate, sheet.clinicalScores]);

  const updateStroke = useCallback((patch: Partial<StrokeScores>) => {
    const currentScores = sheet.clinicalScores || {};
    onUpdate({ clinicalScores: { ...currentScores, stroke: { ...currentScores.stroke, ...patch } } });
  }, [onUpdate, sheet.clinicalScores]);

  const updateICH = useCallback((patch: Partial<ICHScores>) => {
    const currentScores = sheet.clinicalScores || {};
    onUpdate({ clinicalScores: { ...currentScores, ich: { ...currentScores.ich, ...patch } } });
  }, [onUpdate, sheet.clinicalScores]);

  const updateNeuro = useCallback((patch: Partial<typeof neuro>) => {
    onUpdate({ neuroExam: { ...sheet.neuroExam, ...patch } });
  }, [onUpdate, sheet.neuroExam]);

  const updateMotorStrength = useCallback((limb: "lue" | "rue" | "lle" | "rle", value: number) => {
    onUpdate({
      neuroExam: {
        ...sheet.neuroExam,
        motorStrength: {
          ...sheet.neuroExam?.motorStrength,
          [limb]: value as 0 | 1 | 2 | 3 | 4 | 5,
        },
      },
    });
  }, [onUpdate, sheet.neuroExam]);

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={hipaaBox}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "#0f172a" }}>
          <span>🛡️</span>
          <span>De-identified workspace — no names, MRN, phone numbers, DOB, or emails.</span>
        </div>
        <div style={{ fontSize: 12, color: "#475569", marginTop: 6 }}>
          Toggle sections to keep only what you need; structured fields reduce PHI risk.
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {sectionRegistry.map((section) => {
            const disabled = section.required || !section.condition;
            const checked = (enabledSections[section.id] ?? false) && section.condition;
            return (
              <label key={section.id} style={toggleChip(disabled, checked)}>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={(e) => setEnabledSections((prev) => ({ ...prev, [section.id]: e.target.checked }))}
                  style={{ marginRight: 6 }}
                />
                {section.label}
              </label>
            );
          })}
        </div>
        {hipaaWarning && (
          <div style={{ marginTop: 8, fontSize: 12, color: "#b91c1c", fontWeight: 700 }}>
            🚫 {hipaaWarning}
          </div>
        )}
      </div>

      {/* GCS Calculator - Current & Admission */}
      {enabledSections.gcs && (
      <div style={card}>
        <h3 style={sectionTitle}>
          <span style={{ marginRight: 8 }}>🧠</span>
          Glasgow Coma Scale (GCS)
        </h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Current GCS */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 12, color: "#475569" }}>Current GCS</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                fontSize: 36,
                fontWeight: 800,
                ...getGcsCategory(currentGcs),
                padding: "8px 20px",
                borderRadius: 12,
              }}>
                {currentGcs || "—"}
              </div>
              {currentGcs > 0 && (
                <div style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  ...getGcsCategory(currentGcs),
                }}>
                  {getGcsCategory(currentGcs).label}
                </div>
              )}
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
              E{neuro.gcsEye ?? "—"} V{neuro.gcsVerbal ?? "—"} M{neuro.gcsMotor ?? "—"}
            </div>

            {/* Eye */}
            <div style={{ marginBottom: 12 }}>
              <label style={label}>Eye Response (1-4)</label>
              <select
                value={neuro.gcsEye ?? ""}
                onChange={(e) => updateNeuro({ gcsEye: e.target.value ? Number(e.target.value) as any : undefined })}
                style={select}
              >
                <option value="">Select...</option>
                {[4, 3, 2, 1].map((v) => (
                  <option key={v} value={v}>{v} - {GCS_EYE_DESCRIPTIONS[v as keyof typeof GCS_EYE_DESCRIPTIONS]}</option>
                ))}
              </select>
            </div>

            {/* Verbal */}
            <div style={{ marginBottom: 12 }}>
              <label style={label}>Verbal Response (1-5)</label>
              <select
                value={neuro.gcsVerbal ?? ""}
                onChange={(e) => updateNeuro({ gcsVerbal: e.target.value ? Number(e.target.value) as any : undefined })}
                style={select}
              >
                <option value="">Select...</option>
                {[5, 4, 3, 2, 1].map((v) => (
                  <option key={v} value={v}>{v} - {GCS_VERBAL_DESCRIPTIONS[v as keyof typeof GCS_VERBAL_DESCRIPTIONS]}</option>
                ))}
              </select>
            </div>

            {/* Motor */}
            <div>
              <label style={label}>Motor Response (1-6)</label>
              <select
                value={neuro.gcsMotor ?? ""}
                onChange={(e) => updateNeuro({ gcsMotor: e.target.value ? Number(e.target.value) as any : undefined })}
                style={select}
              >
                <option value="">Select...</option>
                {[6, 5, 4, 3, 2, 1].map((v) => (
                  <option key={v} value={v}>{v} - {GCS_MOTOR_DESCRIPTIONS[v as keyof typeof GCS_MOTOR_DESCRIPTIONS]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Admission GCS */}
          <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 12, color: "#475569" }}>Admission GCS</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{
                fontSize: 36,
                fontWeight: 800,
                ...(admissionGcs > 0 ? getGcsCategory(admissionGcs) : { color: "#94a3b8", bgColor: "#f8fafc" }),
                padding: "8px 20px",
                borderRadius: 12,
              }}>
                {admissionGcs || "—"}
              </div>
              {admissionGcs > 0 && currentGcs > 0 && (
                <div style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  color: currentGcs > admissionGcs ? "#16a34a" : currentGcs < admissionGcs ? "#dc2626" : "#64748b",
                  background: currentGcs > admissionGcs ? "#f0fdf4" : currentGcs < admissionGcs ? "#fef2f2" : "#f8fafc",
                }}>
                  {currentGcs > admissionGcs ? `↑ +${currentGcs - admissionGcs}` : 
                   currentGcs < admissionGcs ? `↓ ${currentGcs - admissionGcs}` : "No change"}
                </div>
              )}
            </div>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
              E{neuro.admissionGcsEye ?? "—"} V{neuro.admissionGcsVerbal ?? "—"} M{neuro.admissionGcsMotor ?? "—"}
            </div>

            {/* Eye */}
            <div style={{ marginBottom: 12 }}>
              <label style={label}>Eye Response (1-4)</label>
              <select
                value={neuro.admissionGcsEye ?? ""}
                onChange={(e) => updateNeuro({ admissionGcsEye: e.target.value ? Number(e.target.value) as any : undefined })}
                style={select}
              >
                <option value="">Select...</option>
                {[4, 3, 2, 1].map((v) => (
                  <option key={v} value={v}>{v} - {GCS_EYE_DESCRIPTIONS[v as keyof typeof GCS_EYE_DESCRIPTIONS]}</option>
                ))}
              </select>
            </div>

            {/* Verbal */}
            <div style={{ marginBottom: 12 }}>
              <label style={label}>Verbal Response (1-5)</label>
              <select
                value={neuro.admissionGcsVerbal ?? ""}
                onChange={(e) => updateNeuro({ admissionGcsVerbal: e.target.value ? Number(e.target.value) as any : undefined })}
                style={select}
              >
                <option value="">Select...</option>
                {[5, 4, 3, 2, 1].map((v) => (
                  <option key={v} value={v}>{v} - {GCS_VERBAL_DESCRIPTIONS[v as keyof typeof GCS_VERBAL_DESCRIPTIONS]}</option>
                ))}
              </select>
            </div>

            {/* Motor */}
            <div>
              <label style={label}>Motor Response (1-6)</label>
              <select
                value={neuro.admissionGcsMotor ?? ""}
                onChange={(e) => updateNeuro({ admissionGcsMotor: e.target.value ? Number(e.target.value) as any : undefined })}
                style={select}
              >
                <option value="">Select...</option>
                {[6, 5, 4, 3, 2, 1].map((v) => (
                  <option key={v} value={v}>{v} - {GCS_MOTOR_DESCRIPTIONS[v as keyof typeof GCS_MOTOR_DESCRIPTIONS]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      )}

      {enabledSections.sah && showSAH && (
        <div style={card}>
          <h3 style={sectionTitle}>
            <span style={{ marginRight: 8 }}>🩸</span>
            Hunt & Hess Scale (SAH Severity)
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
            <div>
              <label style={label}>Grade</label>
              <select
                value={scores.sah?.huntHess ?? ""}
                onChange={(e) => updateSAH({ huntHess: e.target.value ? Number(e.target.value) as HuntHessGrade : undefined })}
                style={select}
              >
                <option value="">Select grade...</option>
                {([1, 2, 3, 4, 5] as HuntHessGrade[]).map((grade) => (
                  <option key={grade} value={grade}>
                    Grade {grade} - {HUNT_HESS_DESCRIPTIONS[grade].description}
                  </option>
                ))}
              </select>

              {scores.sah?.huntHess && (
                <div style={{
                  marginTop: 16,
                  padding: 16,
                  borderRadius: 12,
                  ...getHuntHessColor(scores.sah.huntHess),
                  border: `1px solid ${getHuntHessColor(scores.sah.huntHess).color}20`,
                }}>
                  <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
                    Grade {scores.sah.huntHess}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                    {HUNT_HESS_DESCRIPTIONS[scores.sah.huntHess].description}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>
                    30-day mortality: {HUNT_HESS_DESCRIPTIONS[scores.sah.huntHess].mortality}
                  </div>
                </div>
              )}
            </div>

            <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#475569" }}>
                Grade Criteria Reference
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                {([1, 2, 3, 4, 5] as HuntHessGrade[]).map((grade) => (
                  <div
                    key={grade}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      background: scores.sah?.huntHess === grade ? getHuntHessColor(grade).bgColor : "#f8fafc",
                      border: scores.sah?.huntHess === grade ? `2px solid ${getHuntHessColor(grade).color}` : "1px solid #e2e8f0",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ fontWeight: 700, marginRight: 8 }}>Grade {grade}:</span>
                    {HUNT_HESS_DESCRIPTIONS[grade].criteria}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {enabledSections.sah && showSAH && (
        <div style={card}>
          <h3 style={sectionTitle}>
            <span style={{ marginRight: 8 }}>🔬</span>
            Modified Fisher Scale (Vasospasm Risk)
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
            <div>
              <label style={label}>Grade</label>
              <select
                value={scores.sah?.modifiedFisher ?? ""}
                onChange={(e) => updateSAH({ modifiedFisher: e.target.value !== "" ? Number(e.target.value) as ModifiedFisherGrade : undefined })}
                style={select}
              >
                <option value="">Select grade...</option>
                {([0, 1, 2, 3, 4] as ModifiedFisherGrade[]).map((grade) => (
                  <option key={grade} value={grade}>
                    Grade {grade} - {MODIFIED_FISHER_DESCRIPTIONS[grade].description}
                  </option>
                ))}
              </select>

              {scores.sah?.modifiedFisher !== undefined && (
                <div style={{
                  marginTop: 16,
                  padding: 16,
                  borderRadius: 12,
                  ...getModifiedFisherColor(scores.sah.modifiedFisher),
                  border: `1px solid ${getModifiedFisherColor(scores.sah.modifiedFisher).color}20`,
                }}>
                  <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
                    Grade {scores.sah.modifiedFisher}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                    {MODIFIED_FISHER_DESCRIPTIONS[scores.sah.modifiedFisher].description}
                  </div>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>
                    Vasospasm risk: {MODIFIED_FISHER_DESCRIPTIONS[scores.sah.modifiedFisher].vasospasmRisk}
                  </div>
                </div>
              )}

              {/* Bleed Day Calculator */}
              <div style={{ marginTop: 20 }}>
                <label style={label}>Rupture/Bleed Date</label>
                <input
                  type="date"
                  value={scores.sah?.ruptureDate ?? ""}
                  onChange={(e) => updateSAH({ ruptureDate: e.target.value })}
                  style={input}
                />
                {bleedDay && (
                  <div style={{
                    marginTop: 12,
                    padding: 12,
                    borderRadius: 10,
                    background: bleedDay >= 3 && bleedDay <= 14 ? "#fef2f2" : "#f0fdf4",
                    border: bleedDay >= 3 && bleedDay <= 14 ? "1px solid #fecaca" : "1px solid #bbf7d0",
                  }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: bleedDay >= 3 && bleedDay <= 14 ? "#dc2626" : "#16a34a" }}>
                      Bleed Day {bleedDay}
                    </div>
                    {bleedDay >= 3 && bleedDay <= 14 && (
                      <div style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>
                        ⚠️ Peak vasospasm window (days 3-14)
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#475569" }}>
                Grade Criteria Reference
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                {([0, 1, 2, 3, 4] as ModifiedFisherGrade[]).map((grade) => (
                  <div
                    key={grade}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      background: scores.sah?.modifiedFisher === grade ? getModifiedFisherColor(grade).bgColor : "#f8fafc",
                      border: scores.sah?.modifiedFisher === grade ? `2px solid ${getModifiedFisherColor(grade).color}` : "1px solid #e2e8f0",
                      fontSize: 13,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, marginRight: 8 }}>Grade {grade}:</span>
                      {MODIFIED_FISHER_DESCRIPTIONS[grade].criteria}
                    </div>
                    <div style={{ 
                      padding: "2px 8px", 
                      borderRadius: 4, 
                      background: "#fff",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#64748b",
                    }}>
                      {MODIFIED_FISHER_DESCRIPTIONS[grade].vasospasmRisk}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16, padding: 12, background: "#fffbeb", borderRadius: 10, border: "1px solid #fef3c7" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#92400e", marginBottom: 4 }}>
                  📌 Vasospasm Monitoring
                </div>
                <div style={{ fontSize: 12, color: "#78350f" }}>
                  • Peak risk: Days 3-14 after bleed<br/>
                  • Daily TCDs starting POD3<br/>
                  • Watch for: New focal deficits, decreased LOC<br/>
                  • Treatment: Triple-H therapy, intra-arterial verapamil, angioplasty
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {enabledSections.ich && showICH && (
        <div style={card}>
          <h3 style={sectionTitle}>
            <span style={{ marginRight: 8 }}>🧯</span>
            ICH Score & Hemorrhage Planning
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label style={label}>GCS used for score</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="number"
                  min={3}
                  max={15}
                  value={scores.ich?.gcsScore ?? ""}
                  onChange={(e) => updateICH({ gcsScore: e.target.value === "" ? undefined : Number(e.target.value) })}
                  style={{ ...input, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => updateICH({ gcsScore: currentGcs || admissionGcs || undefined })}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: "1px solid #cbd5f5",
                    background: "#eff6ff",
                    fontWeight: 600,
                    color: "#1d4ed8",
                    cursor: "pointer",
                  }}
                >
                  Use current ({currentGcs || "—"})
                </button>
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                Defaults to bedside GCS if left blank.
              </div>

              <div style={{ marginTop: 12 }}>
                <label style={label}>ICH Volume (mL)</label>
                <input
                  type="number"
                  min={0}
                  value={scores.ich?.ichVolume ?? ""}
                  onChange={(e) => updateICH({ ichVolume: e.target.value === "" ? undefined : Number(e.target.value) })}
                  style={input}
                  placeholder="ABC/2 estimate"
                />
              </div>

              <div style={{ marginTop: 12 }}>
                <label style={label}>Location</label>
                <select
                  value={scores.ich?.ichLocation ?? ""}
                  onChange={(e) => updateICH({ ichLocation: e.target.value ? e.target.value as ICHScores["ichLocation"] : undefined })}
                  style={select}
                >
                  <option value="">Select...</option>
                  <option value="deep">Deep (basal ganglia/thalamus)</option>
                  <option value="lobar">Lobar</option>
                  <option value="cerebellar">Cerebellar</option>
                  <option value="brainstem">Brainstem</option>
                </select>
              </div>

              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => updateICH({ ivhPresent: !scores.ich?.ivhPresent })}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: scores.ich?.ivhPresent ? "1px solid #0f766e" : "1px solid #cbd5f5",
                    background: scores.ich?.ivhPresent ? "#ccfbf1" : "#f8fafc",
                    fontWeight: 600,
                    color: scores.ich?.ivhPresent ? "#0f766e" : "#475569",
                    cursor: "pointer",
                  }}
                >
                  {scores.ich?.ivhPresent ? "✓ IVH present" : "Add IVH"}
                </button>
                <button
                  type="button"
                  onClick={() => updateICH({ infratentorial: !scores.ich?.infratentorial })}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: scores.ich?.infratentorial ? "1px solid #0f172a" : "1px solid #cbd5f5",
                    background: scores.ich?.infratentorial ? "#e0e7ff" : "#f8fafc",
                    fontWeight: 600,
                    color: scores.ich?.infratentorial ? "#1e3a8a" : "#475569",
                    cursor: "pointer",
                  }}
                >
                  {scores.ich?.infratentorial ? "✓ Infratentorial" : "Supratentorial"}
                </button>
                <button
                  type="button"
                  onClick={() => updateICH({ age80Plus: !scores.ich?.age80Plus })}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 10,
                    border: scores.ich?.age80Plus ? "1px solid #b45309" : "1px solid #cbd5f5",
                    background: scores.ich?.age80Plus ? "#ffedd5" : "#f8fafc",
                    fontWeight: 600,
                    color: scores.ich?.age80Plus ? "#b45309" : "#475569",
                    cursor: "pointer",
                  }}
                >
                  {scores.ich?.age80Plus ? "Age ≥80" : "Age <80"}
                </button>
              </div>

              <div style={{ marginTop: 16 }}>
                <label style={label}>Functional outcome / GOC notes</label>
                <textarea
                  value={scores.ich?.functionalOutcome ?? ""}
                  onChange={(e) => guardHipaaText(e.target.value, "ICH outcome notes", (clean) => updateICH({ functionalOutcome: clean }))}
                  style={{ ...input, minHeight: 70, resize: "vertical" }}
                  placeholder="eg. Discuss comfort-focused care if score ≥4"
                  maxLength={200}
                />
                {hipaaWarning && (
                  <div style={{ fontSize: 12, color: "#b91c1c", marginTop: 4, fontWeight: 600 }}>
                    🚫 {hipaaWarning}
                  </div>
                )}
              </div>
            </div>

            <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: 20 }}>
              <div style={{
                padding: 16,
                borderRadius: 12,
                background: "#f8fafc",
                marginBottom: 16,
                border: "1px solid #e2e8f0",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>ICH Score</div>
                <div style={{ fontSize: 48, fontWeight: 800, color: ichTier?.color ?? "#94a3b8", lineHeight: 1 }}>
                  {ichScoreInfo.applied ? ichScoreInfo.score : "—"}
                </div>
                {ichScoreInfo.applied ? (
                  <>
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: ichTier?.bg,
                      color: ichTier?.color,
                      fontWeight: 700,
                      fontSize: 13,
                      marginTop: 8,
                    }}>
                      {ichTier?.label}
                    </div>
                    <div style={{ marginTop: 8, fontSize: 13, color: "#475569" }}>
                      Predicted 30-day mortality: {ichMortality}
                    </div>
                  </>
                ) : (
                  <div style={{ marginTop: 8, fontSize: 13, color: "#94a3b8" }}>
                    Add score components to estimate mortality.
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                {Object.entries(ICH_MORTALITY_TABLE).map(([score, rate]) => {
                  const numericScore = Number(score);
                  const isActive = ichScoreInfo.applied && numericScore === ichScoreInfo.score;
                  return (
                    <div
                      key={score}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: isActive ? `2px solid ${ichTier?.color ?? "#0ea5e9"}` : "1px solid #e2e8f0",
                        background: isActive ? ichTier?.bg : "#fff",
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 13,
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? ichTier?.color : "#475569",
                      }}
                    >
                      <span>Score {score}</span>
                      <span>{rate} mortality</span>
                    </div>
                  );
                })}
              </div>

              {ichScoreInfo.applied && ichScoreInfo.score >= 3 && (
                <div style={{
                  marginTop: 16,
                  padding: 12,
                  borderRadius: 10,
                  background: "#fff7ed",
                  border: "1px solid #fed7aa",
                  fontSize: 13,
                  color: "#9a3412",
                  lineHeight: 1.5,
                }}>
                  ⚠️ Score ≥3: discuss goals of care, aggressive BP control, and reversal agents early.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {enabledSections.stroke && showStroke && (
        <div style={card}>
          <h3 style={sectionTitle}>
            <span style={{ marginRight: 8 }}>⚡</span>
            Stroke Activation Aids
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label style={label}>NIH Stroke Scale (0-42)</label>
              <input
                type="number"
                min={0}
                max={42}
                value={scores.stroke?.nihss ?? ""}
                onChange={(e) => updateStroke({ nihss: e.target.value === "" ? undefined : Number(e.target.value) })}
                style={input}
              />
              {nihssTier && (
                <div style={{
                  marginTop: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  borderRadius: 999,
                  background: nihssTier.bg,
                  color: nihssTier.color,
                  fontWeight: 700,
                  fontSize: 13,
                }}>
                  {nihssTier.label} severity
                </div>
              )}
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                {getNihssGuidance(scores.stroke?.nihss)}
              </div>

              <div style={{ marginTop: 12 }}>
                <label style={label}>ASPECTS (0-10)</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={scores.stroke?.aspects ?? ""}
                  onChange={(e) => updateStroke({ aspects: e.target.value === "" ? undefined : Number(e.target.value) })}
                  style={input}
                />
                <div style={{
                  marginTop: 8,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "3px 10px",
                  borderRadius: 999,
                  background: aspectsBadge.bg,
                  color: aspectsBadge.color,
                  fontWeight: 700,
                  fontSize: 12,
                }}>
                  {aspectsBadge.label}
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                  {aspectsGuidance}
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <label style={label}>Last Known Well</label>
                <input
                  value={scores.stroke?.lastKnownWell ?? ""}
                  onChange={(e) => updateStroke({ lastKnownWell: e.target.value })}
                  style={input}
                  placeholder="2024-05-01 14:30"
                />
              </div>

              <div style={{ marginTop: 12 }}>
                <label style={label}>Stroke territory / vessel</label>
                <input
                  value={scores.stroke?.territory ?? ""}
                  onChange={(e) => updateStroke({ territory: e.target.value })}
                  style={input}
                  placeholder="R MCA M1"
                />
              </div>

              <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => updateStroke({ tpaGiven: !scores.stroke?.tpaGiven })}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 999,
                    border: scores.stroke?.tpaGiven ? "1px solid #be123c" : "1px solid #e2e8f0",
                    background: scores.stroke?.tpaGiven ? "#fee2e2" : "#f8fafc",
                    color: scores.stroke?.tpaGiven ? "#be123c" : "#475569",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {scores.stroke?.tpaGiven ? "✓ IV tPA given" : "IV tPA pending"}
                </button>
                <button
                  type="button"
                  onClick={() => updateStroke({ thrombectomy: !scores.stroke?.thrombectomy })}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 999,
                    border: scores.stroke?.thrombectomy ? "1px solid #0f172a" : "1px solid #e2e8f0",
                    background: scores.stroke?.thrombectomy ? "#e0e7ff" : "#f8fafc",
                    color: scores.stroke?.thrombectomy ? "#1e3a8a" : "#475569",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {scores.stroke?.thrombectomy ? "✓ EVT performed" : "EVT not yet"}
                </button>
              </div>

              {scores.stroke?.thrombectomy && (
                <div style={{ marginTop: 12 }}>
                  <label style={label}>TICI score</label>
                  <select
                    value={scores.stroke?.ticiScore ?? ""}
                    onChange={(e) => updateStroke({ ticiScore: e.target.value || undefined })}
                    style={select}
                  >
                    <option value="">Select...</option>
                    {["0", "1", "2a", "2b", "2c", "3"].map((grade) => (
                      <option key={grade} value={grade}>TICI {grade}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: 20, display: "grid", gap: 12 }}>
              <div style={{
                padding: 14,
                borderRadius: 12,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>Reperfusion timeline</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginTop: 4 }}>
                  {scores.stroke?.lastKnownWell || "Not documented"}
                </div>
                <div style={{ fontSize: 13, color: "#475569", marginTop: 8, lineHeight: 1.5 }}>
                  {scores.stroke?.lastKnownWell
                    ? "Confirm imaging-to-needle metrics and keep BP <185/110 prior to thrombolysis."
                    : "Capture LKW time to decide IV tPA and EVT eligibility windows."}
                </div>
              </div>

              <div style={{
                padding: 14,
                borderRadius: 12,
                background: "#fff1f2",
                border: "1px solid #fecdd3",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#be123c", textTransform: "uppercase" }}>Therapy status</div>
                <div style={{ fontSize: 13, color: "#881337", marginTop: 8, lineHeight: 1.6 }}>
                  • IV tPA: {scores.stroke?.tpaGiven ? "administered" : "not given"}<br/>
                  • EVT: {scores.stroke?.thrombectomy ? `s/p thrombectomy (TICI ${scores.stroke?.ticiScore || "pending"})` : "awaiting imaging / criteria"}
                </div>
                <div style={{ fontSize: 12, color: "#9f1239", marginTop: 8 }}>
                  Ensure post-therapy neuro checks (q15 min x2h), BP goals, and reversal meds at bedside.
                </div>
              </div>

              <div style={{
                padding: 14,
                borderRadius: 12,
                background: "#ecfeff",
                border: "1px solid #bae6fd",
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0369a1", textTransform: "uppercase" }}>Rounds prompts</div>
                <div style={{ fontSize: 13, color: "#0c4a6e", lineHeight: 1.6 }}>
                  • Territory: {scores.stroke?.territory || "—"}<br/>
                  • Sodium/edema plan: hypertonic vs. mannitol?<br/>
                  • NIHSS trending every shift and document motor exam wording.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {enabledSections.motor && (
        <div style={card}>
        <h3 style={sectionTitle}>
          <span style={{ marginRight: 8 }}>💪</span>
          Motor Strength Examination
        </h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Left Side */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: 12, color: "#475569" }}>Left Side</div>
            
            <div style={{ marginBottom: 12 }}>
              <label style={label}>Left Upper Extremity (LUE)</label>
              <select
                value={neuro.motorStrength?.lue ?? ""}
                onChange={(e) => updateMotorStrength("lue", Number(e.target.value))}
                style={select}
              >
                <option value="">Select...</option>
                {[5, 4, 3, 2, 1, 0].map((v) => (
                  <option key={v} value={v}>{MOTOR_STRENGTH_DESCRIPTIONS[v as keyof typeof MOTOR_STRENGTH_DESCRIPTIONS]}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={label}>Left Lower Extremity (LLE)</label>
              <select
                value={neuro.motorStrength?.lle ?? ""}
                onChange={(e) => updateMotorStrength("lle", Number(e.target.value))}
                style={select}
              >
                <option value="">Select...</option>
                {[5, 4, 3, 2, 1, 0].map((v) => (
                  <option key={v} value={v}>{MOTOR_STRENGTH_DESCRIPTIONS[v as keyof typeof MOTOR_STRENGTH_DESCRIPTIONS]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Side */}
          <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 12, color: "#475569" }}>Right Side</div>
            
            <div style={{ marginBottom: 12 }}>
              <label style={label}>Right Upper Extremity (RUE)</label>
              <select
                value={neuro.motorStrength?.rue ?? ""}
                onChange={(e) => updateMotorStrength("rue", Number(e.target.value))}
                style={select}
              >
                <option value="">Select...</option>
                {[5, 4, 3, 2, 1, 0].map((v) => (
                  <option key={v} value={v}>{MOTOR_STRENGTH_DESCRIPTIONS[v as keyof typeof MOTOR_STRENGTH_DESCRIPTIONS]}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={label}>Right Lower Extremity (RLE)</label>
              <select
                value={neuro.motorStrength?.rle ?? ""}
                onChange={(e) => updateMotorStrength("rle", Number(e.target.value))}
                style={select}
              >
                <option value="">Select...</option>
                {[5, 4, 3, 2, 1, 0].map((v) => (
                  <option key={v} value={v}>{MOTOR_STRENGTH_DESCRIPTIONS[v as keyof typeof MOTOR_STRENGTH_DESCRIPTIONS]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Visual Motor Summary */}
        <div style={{ marginTop: 20, padding: 16, background: "#f8fafc", borderRadius: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#475569" }}>Motor Summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, textAlign: "center" }}>
            <div style={motorBox(neuro.motorStrength?.lue)}>
              LUE: {neuro.motorStrength?.lue ?? "—"}/5
            </div>
            <div style={motorBox(neuro.motorStrength?.rue)}>
              RUE: {neuro.motorStrength?.rue ?? "—"}/5
            </div>
            <div style={motorBox(neuro.motorStrength?.lle)}>
              LLE: {neuro.motorStrength?.lle ?? "—"}/5
            </div>
            <div style={motorBox(neuro.motorStrength?.rle)}>
              RLE: {neuro.motorStrength?.rle ?? "—"}/5
            </div>
          </div>
          
          {/* Text summary */}
          <div style={{ marginTop: 12 }}>
            <label style={label}>Free Text Summary (no identifiers)</label>
            <input
              value={neuro.motorExam ?? ""}
              onChange={(e) => guardHipaaText(e.target.value, "Motor summary", (clean) => updateNeuro({ motorExam: clean }))}
              style={input}
              placeholder="e.g., Full strength bilateral or L hemiparesis 3/5"
              maxLength={200}
            />
            {hipaaWarning && (
              <div style={{ marginTop: 4, fontSize: 12, color: "#b91c1c", fontWeight: 600 }}>
                🚫 {hipaaWarning}
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {enabledSections.pupils && (
        <div style={card}>
          <h3 style={sectionTitle}>
            <span style={{ marginRight: 8 }}>👁️</span>
            Pupillary Examination
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {(["left", "right"] as const).map((side) => (
              <div key={side} style={{ padding: 16, background: "#f8fafc", borderRadius: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 12, textTransform: "capitalize" }}>{side} Pupil</div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div>
                    <label style={label}>Size (mm)</label>
                    <input
                      type="number"
                      min={1}
                      max={9}
                      value={neuro.pupils?.[side]?.size ?? ""}
                      onChange={(e) => {
                        const pupils = { ...neuro.pupils } as any;
                        pupils[side] = { ...pupils[side], size: Number(e.target.value) };
                        updateNeuro({ pupils });
                      }}
                      style={{ ...input, width: 80 }}
                    />
                  </div>
                  <div>
                    <label style={label}>Reactive</label>
                    <button
                      onClick={() => {
                        const pupils = { ...neuro.pupils } as any;
                        pupils[side] = { ...pupils[side], reactive: !pupils[side]?.reactive };
                        updateNeuro({ pupils });
                      }}
                      style={{
                        padding: "10px 20px",
                        borderRadius: 10,
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 600,
                        background: neuro.pupils?.[side]?.reactive ? "#16a34a" : "#dc2626",
                        color: "#fff",
                      }}
                    >
                      {neuro.pupils?.[side]?.reactive ? "✓ Reactive" : "✗ Non-reactive"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Visual Pupil Summary */}
          <div style={{ marginTop: 16, padding: 16, background: "#f8fafc", borderRadius: 12, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 40, alignItems: "center" }}>
              {(["left", "right"] as const).map((side) => {
                const pupil = neuro.pupils?.[side];
                const size = pupil?.size ?? 3;
                const reactive = pupil?.reactive ?? true;
                return (
                  <div key={side}>
                    <div
                      style={{
                        width: size * 8 + 20,
                        height: size * 8 + 20,
                        borderRadius: "50%",
                        background: "#1e293b",
                        margin: "0 auto 8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: reactive ? "3px solid #16a34a" : "3px solid #dc2626",
                      }}
                    >
                      <div
                        style={{
                          width: size * 4,
                          height: size * 4,
                          borderRadius: "50%",
                          background: "#000",
                        }}
                      />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>
                      {side}: {size}mm {reactive ? "+" : "-"}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 12, fontSize: 14, fontWeight: 500, color: "#475569" }}>
              {neuro.pupils?.left && neuro.pupils?.right && (
                neuro.pupils.left.size === neuro.pupils.right.size
                  ? `PERRL ${neuro.pupils.left.size}mm`
                  : `Anisocoria: L ${neuro.pupils.left.size}mm, R ${neuro.pupils.right.size}mm`
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// STYLES - Defined at module level to prevent recreation on every render
// ============================================================================
const hipaaBox: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px dashed #cbd5e1",
  borderRadius: 14,
  padding: 14,
};

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 16,
  padding: 20,
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: "#1e293b",
  marginBottom: 16,
  display: "flex",
  alignItems: "center",
};

const label: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontSize: 12,
  fontWeight: 500,
  color: "#64748b",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  outline: "none",
  fontSize: 14,
};

const select: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  outline: "none",
  fontSize: 14,
  background: "#fff",
  cursor: "pointer",
};

// Memoized motorBox style creator - uses sentinel value for undefined
const motorBoxCache = new Map<number, React.CSSProperties>();
const UNDEFINED_STRENGTH = -1;
const motorBox = (strength?: number): React.CSSProperties => {
  const key = strength ?? UNDEFINED_STRENGTH;
  if (!motorBoxCache.has(key)) {
    motorBoxCache.set(key, {
      padding: "12px 16px",
      borderRadius: 10,
      background: strength === undefined ? "#f1f5f9" : 
                  strength === 5 ? "#f0fdf4" : 
                  strength >= 3 ? "#fffbeb" : "#fef2f2",
      color: strength === undefined ? "#94a3b8" :
             strength === 5 ? "#16a34a" :
             strength >= 3 ? "#f59e0b" : "#dc2626",
      fontWeight: 700,
      fontSize: 16,
      border: strength === undefined ? "1px solid #e2e8f0" :
              strength === 5 ? "1px solid #bbf7d0" :
              strength >= 3 ? "1px solid #fef3c7" : "1px solid #fecaca",
    });
  }
  return motorBoxCache.get(key)!;
};

// Memoized toggleChip style creator - uses bitwise key for efficiency
const toggleChipCache = new Map<number, React.CSSProperties>();
const toggleChip = (disabled: boolean, active: boolean): React.CSSProperties => {
  const key = (disabled ? 2 : 0) | (active ? 1 : 0);
  if (!toggleChipCache.has(key)) {
    toggleChipCache.set(key, {
      display: "inline-flex",
      alignItems: "center",
      padding: "6px 10px",
      borderRadius: 12,
      border: active ? "1px solid #1d4ed8" : "1px solid #e2e8f0",
      background: disabled ? "#f1f5f9" : active ? "#eff6ff" : "#fff",
      color: disabled ? "#94a3b8" : active ? "#1d4ed8" : "#475569",
      fontSize: 12,
      fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
    });
  }
  return toggleChipCache.get(key)!;
};
