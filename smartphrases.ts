export type SmartPhraseTemplate = {
  id: string;
  label: string;
  service?: string;
  body: string;
};

export const TEMPLATES: SmartPhraseTemplate[] = [
  {
    id: "icu-daily",
    label: ".ICU_DAILY (generic)",
    body: `
*** ICU PROGRESS NOTE ***
Date: @TODAY@
Patient: @NAME@ @ROOM@

Interval Events:
@INTERVAL@

Vitals/Support:
- MAP: @MAP@  HR: @HR@  SpO2: @SPO2@
- Vent: @VENT@
- Drips: @DRIPS@
- Lines/Tubes: @LINES@

Data:
Labs: @LABS@
Imaging: @IMAGING@

Checklist:
@CHECKLIST@

Assessment / Plan:
@AP@

Tasks / To-Do:
@TASKS@

Family/Goals:
@GOALS@
`.trim(),
  },
  {
    id: "cvicu-postop",
    label: ".CVICU_POSTOP",
    service: "CVICU",
    body: `
*** CVICU POST-OP NOTE ***
Date: @TODAY@
Patient: @NAME@ @ROOM@

One-liner:
@ONELINER@

Hemodynamics:
- Target MAP: ____ (default 65+ unless specified)
- MCS: ____ (Impella/ECMO/IABP/none)
- Drips: @DRIPS@

Respiratory:
- Vent: @VENT@
- Wean/SBT: ____

Lines/Tubes/Drains:
@LINES@

Assessment / Plan:
@AP@

FAST CHECKLIST:
@CHECKLIST@

Tasks:
@TASKS@
`.trim(),
  },
];
