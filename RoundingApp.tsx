// RoundingApp.tsx
import React, { useMemo, useState } from "react";
import type { RoundingSheet, Task, Problem } from "./types";
import { TEMPLATES } from "./smartphrases";
import { renderSmartPhrase } from "./smartphraseEngine";

type Id = string;

const uid = () => Math.random().toString(36).slice(2, 10);

const DEFAULT_CHECKLIST = [
  "DVT prophylaxis",
  "GI prophylaxis",
  "Glucose target",
  "Sedation / delirium",
  "SAT/SBT",
  "Lines necessity",
  "Antibiotics reviewed",
  "Cultures reviewed",
  "I/O & fluid goal",
  "Nutrition",
  "Mobility",
  "Family update",
] as const;

function buildBlank(patientName = "New Patient"): RoundingSheet {
  const checklist: Record<string, boolean> = {};
  DEFAULT_CHECKLIST.forEach((k) => (checklist[k] = false));
  const today = new Date();
  const dateISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;
  return {
    id: uid(),
    patientName,
    dateISO,
    oneLiner: "",
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
  lines.push(`ICU Rounds — ${s.dateISO}`);
  lines.push(`${s.patientName}${s.room ? ` (Room ${s.room})` : ""}`);
  lines.push("");
  lines.push(`One-liner: ${s.oneLiner || "-"}`);
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

export default function RoundingApp() {
  const [sheets, setSheets] = useState<RoundingSheet[]>([
    { ...buildBlank("John Smith"), room: "CVICU-12", oneLiner: "POD2 CABG, low CI, on norepi", updatedAt: Date.now() },
    { ...buildBlank("Maria Chen"), room: "MICU-8", oneLiner: "ARDS improving, weaning sedation", updatedAt: Date.now() - 1000 * 60 * 10 },
  ]);

  const [activeId, setActiveId] = useState<Id>(sheets[0].id);
  const active = useMemo(() => sheets.find((x) => x.id === activeId)!, [sheets, activeId]);

  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const activeTemplate = useMemo(() => TEMPLATES.find((t) => t.id === templateId)!, [templateId]);
  const smartphrasePreview = useMemo(() => renderSmartPhrase(activeTemplate, active), [activeTemplate, active]);

  function updateActive(patch: Partial<RoundingSheet>) {
    setSheets((prev) =>
      prev.map((s) => (s.id === activeId ? { ...s, ...patch, updatedAt: Date.now() } : s))
    );
  }

  function updateVitals(patch: Partial<RoundingSheet["vitals"]>) {
    updateActive({ vitals: { ...active.vitals, ...patch } });
  }

  function toggleChecklist(key: string) {
    updateActive({ checklist: { ...active.checklist, [key]: !active.checklist[key] } });
  }

  function addProblem() {
    updateActive({
      problems: [
        ...active.problems,
        { id: uid(), title: "New problem", assessment: "", plan: "" },
      ],
    });
  }

  function updateProblem(id: Id, patch: Partial<Problem>) {
    updateActive({ problems: active.problems.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  }

  function removeProblem(id: Id) {
    updateActive({ problems: active.problems.filter((p) => p.id !== id) });
  }

  function addTask() {
    updateActive({ tasks: [...active.tasks, { id: uid(), text: "New task", done: false, due: "Today" }] });
  }

  function updateTask(id: Id, patch: Partial<Task>) {
    updateActive({ tasks: active.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) });
  }

  function removeTask(id: Id) {
    updateActive({ tasks: active.tasks.filter((t) => t.id !== id) });
  }

  function addPatient() {
    const s = buildBlank(`Patient ${sheets.length + 1}`);
    setSheets((prev) => [s, ...prev]);
    setActiveId(s.id);
  }

  async function copyNote() {
    const text = toNoteText(active);
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied rounding note to clipboard.");
    } catch {
      window.prompt("Copy note text:", text);
    }
  }

  async function copySmartPhrase() {
    const text = smartphrasePreview;
    try {
      await navigator.clipboard.writeText(text);
      alert(`Copied ${activeTemplate.label} to clipboard.`);
    } catch {
      window.prompt("Copy SmartPhrase text:", text);
    }
  }

  const sortedSheets = useMemo(() => [...sheets].sort((a, b) => b.updatedAt - a.updatedAt), [sheets]);

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
      <div style={{ padding: 12, borderBottom: "1px solid #e5e7eb", display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ fontWeight: 700 }}>ICU Rounding App</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <select
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            style={{ ...input, width: 240 }}
            aria-label="SmartPhrase template"
          >
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
          <button onClick={copySmartPhrase} style={btnPrimary}>
            Copy SmartPhrase
          </button>
          <button onClick={addPatient} style={btnPrimary}>+ Patient</button>
          <button onClick={copyNote} style={btn}>Copy for note</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, padding: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }} className="shell">
            <div style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>Patients</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>sorted by recent</div>
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                {sortedSheets.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveId(s.id)}
                    style={{
                      textAlign: "left",
                      padding: 10,
                      borderRadius: 12,
                      border: s.id === activeId ? "1px solid #111827" : "1px solid #e5e7eb",
                      background: s.id === activeId ? "#111827" : "#fff",
                      color: s.id === activeId ? "#fff" : "#111827",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ fontWeight: 650 }}>{s.patientName}</div>
                      <div style={{ opacity: 0.8, fontSize: 12 }}>{s.room || ""}</div>
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4, lineHeight: 1.25 }}>
                      {s.oneLiner || "—"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div style={card}>
              <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                <input
                  value={active.patientName}
                  onChange={(e) => updateActive({ patientName: e.target.value })}
                  style={h1Input}
                />
                <input
                  placeholder="Room"
                  value={active.room || ""}
                  onChange={(e) => updateActive({ room: e.target.value })}
                  style={tinyInput}
                />
                <div style={{ marginLeft: "auto", fontSize: 12, color: "#6b7280" }}>{active.dateISO}</div>
              </div>

              <label style={label}>One-liner</label>
              <textarea
                value={active.oneLiner}
                onChange={(e) => updateActive({ oneLiner: e.target.value })}
                rows={2}
                style={textarea}
              />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                <div>
                  <label style={label}>MAP</label>
                  <input
                    inputMode="numeric"
                    value={active.vitals.map ?? ""}
                    onChange={(e) => updateVitals({ map: e.target.value ? Number(e.target.value) : undefined })}
                    style={input}
                  />
                </div>
                <div>
                  <label style={label}>HR</label>
                  <input
                    inputMode="numeric"
                    value={active.vitals.hr ?? ""}
                    onChange={(e) => updateVitals({ hr: e.target.value ? Number(e.target.value) : undefined })}
                    style={input}
                  />
                </div>
                <div>
                  <label style={label}>SpO₂</label>
                  <input
                    inputMode="numeric"
                    value={active.vitals.spo2 ?? ""}
                    onChange={(e) => updateVitals({ spo2: e.target.value ? Number(e.target.value) : undefined })}
                    style={input}
                  />
                </div>
                <div>
                  <label style={label}>Vent</label>
                  <input
                    value={active.vitals.vent ?? ""}
                    onChange={(e) => updateVitals({ vent: e.target.value })}
                    style={input}
                    placeholder="AC/VC 450/16/40/8"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
                <div>
                  <label style={label}>Lines / Tubes</label>
                  <input value={active.linesTubes} onChange={(e) => updateActive({ linesTubes: e.target.value })} style={input} />
                </div>
                <div>
                  <label style={label}>Drips</label>
                  <input value={active.drips} onChange={(e) => updateActive({ drips: e.target.value })} style={input} />
                </div>
                <div>
                  <label style={label}>Labs</label>
                  <textarea value={active.labs} onChange={(e) => updateActive({ labs: e.target.value })} rows={3} style={textarea} />
                </div>
                <div>
                  <label style={label}>Imaging</label>
                  <textarea value={active.imaging} onChange={(e) => updateActive({ imaging: e.target.value })} rows={2} style={textarea} />
                </div>
              </div>

              <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
                <div style={{ fontWeight: 700 }}>Checklist</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
                  {Object.keys(active.checklist).map((k) => (
                    <button key={k} onClick={() => toggleChecklist(k)} style={chip(active.checklist[k])}>
                      {active.checklist[k] ? "✓ " : ""}
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ fontWeight: 700 }}>Problem List / Plan</div>
                  <button onClick={addProblem} style={{ ...btn, marginLeft: "auto" }}>+ Problem</button>
                </div>

                {active.problems.length === 0 && (
                  <div style={{ fontSize: 13, color: "#6b7280" }}>Add problems like “Shock”, “Resp failure”, “AKI”…</div>
                )}

                {active.problems.map((p) => (
                  <div key={p.id} style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 10 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input value={p.title} onChange={(e) => updateProblem(p.id, { title: e.target.value })} style={input} />
                      <button onClick={() => removeProblem(p.id)} style={btnDanger}>Remove</button>
                    </div>
                    <label style={label}>Assessment</label>
                    <textarea value={p.assessment} onChange={(e) => updateProblem(p.id, { assessment: e.target.value })} rows={2} style={textarea} />
                    <label style={label}>Plan</label>
                    <textarea value={p.plan} onChange={(e) => updateProblem(p.id, { plan: e.target.value })} rows={3} style={textarea} placeholder={"- Continue...\n- Titrate...\n- Reassess..."} />
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ fontWeight: 700 }}>Tasks</div>
                  <button onClick={addTask} style={{ ...btn, marginLeft: "auto" }}>+ Task</button>
                </div>

                {active.tasks.map((t) => (
                  <div key={t.id} style={{ display: "grid", gridTemplateColumns: "28px 1fr 90px 90px", gap: 8, alignItems: "center" }}>
                    <input type="checkbox" checked={t.done} onChange={(e) => updateTask(t.id, { done: e.target.checked })} />
                    <input value={t.text} onChange={(e) => updateTask(t.id, { text: e.target.value })} style={input} />
                    <select value={t.due ?? "Today"} onChange={(e) => updateTask(t.id, { due: e.target.value as any })} style={input}>
                      <option>Today</option>
                      <option>AM</option>
                      <option>PM</option>
                    </select>
                    <button onClick={() => removeTask(t.id)} style={btnDanger}>Remove</button>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontWeight: 700 }}>SmartPhrase Preview</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{activeTemplate.label}</div>
                </div>
                <textarea
                  value={smartphrasePreview}
                  readOnly
                  rows={14}
                  style={{ ...textarea, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @media (min-width: 980px) {
            .shell {
              grid-template-columns: 360px 1fr !important;
              align-items: start;
            }
          }
        `}
      </style>
    </div>
  );
}

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 18,
  padding: 12,
  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
};

const label: React.CSSProperties = { display: "block", marginTop: 10, marginBottom: 4, fontSize: 12, color: "#6b7280" };

const input: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  outline: "none",
};

const tinyInput: React.CSSProperties = {
  width: 110,
  padding: "8px 10px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  outline: "none",
  fontSize: 12,
};

const h1Input: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 750,
  padding: "8px 10px",
  borderRadius: 12,
  border: "1px solid transparent",
  outline: "none",
  width: "100%",
};

const textarea: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  outline: "none",
  resize: "vertical",
};

const btn: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  background: "#fff",
  cursor: "pointer",
};

const btnPrimary: React.CSSProperties = {
  ...btn,
  background: "#111827",
  border: "1px solid #111827",
  color: "#fff",
};

const btnDanger: React.CSSProperties = {
  ...btn,
  border: "1px solid #ef4444",
  color: "#b91c1c",
};

const chip = (on: boolean): React.CSSProperties => ({
  padding: "10px 10px",
  borderRadius: 14,
  border: on ? "1px solid #111827" : "1px solid #e5e7eb",
  background: on ? "#111827" : "#fff",
  color: on ? "#fff" : "#111827",
  fontSize: 12,
  textAlign: "left",
  cursor: "pointer",
});
