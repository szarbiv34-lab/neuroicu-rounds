export type SmartPhraseTemplate = {
  id: string;
  label: string;
  service?: string;
  body: string;
};

export const TEMPLATES: SmartPhraseTemplate[] = [
  {
    id: "neuroicu-daily",
    label: ".NEUROICU_DAILY",
    service: "NeuroICU",
    body: `
*** NEURO ICU PROGRESS NOTE ***
Date: @TODAY@
Patient: @NAME@ @ROOM@
@DIAGNOSIS@ | @DAY_OF_ADMIT@

Interval Events:
@INTERVAL@

NEUROLOGICAL EXAM:
- GCS: @GCS@ (E@GCS_E@ V@GCS_V@ M@GCS_M@)
- Pupils: @PUPILS@
- Cranial Nerves: @CN@
- Motor: @MOTOR@
- Sedation/RASS: @SEDATION@
- Seizure Activity: @SEIZURES@
@ICP_CPP@

Vitals/Support:
- MAP: @MAP@  HR: @HR@  Temp: @TEMP@
- SpO2: @SPO2@ on FiO2: @FIO2@
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
    id: "neuroicu-stroke",
    label: ".NEUROICU_STROKE",
    service: "NeuroICU",
    body: `
*** STROKE/NEUROVASCULAR PROGRESS NOTE ***
Date: @TODAY@
Patient: @NAME@ @ROOM@
@DIAGNOSIS@ | @DAY_OF_ADMIT@

NIHSS: ____
Last Known Well: ____
tPA/Thrombectomy: ____

NEUROLOGICAL EXAM:
- GCS: @GCS@ (E@GCS_E@ V@GCS_V@ M@GCS_M@)
- Pupils: @PUPILS@
- Motor: @MOTOR@
- Speech/Language: ____
- Neglect: ____

Blood Pressure Parameters:
- Target: ____
- Current MAP: @MAP@
- Drips: @DRIPS@

Antiplatelet/Anticoagulation:
- Current regimen: ____

Assessment / Plan:
@AP@

STROKE CHECKLIST:
[ ] Swallow eval completed
[ ] DVT prophylaxis
[ ] Statin (high intensity)
[ ] Antiplatelet therapy
[ ] A1c checked
[ ] Lipid panel
[ ] TTE/TEE
[ ] Vessel imaging
[ ] 24-48hr repeat imaging
[ ] PT/OT/SLP

Tasks:
@TASKS@
`.trim(),
  },
  {
    id: "neuroicu-tbi",
    label: ".NEUROICU_TBI",
    service: "NeuroICU",
    body: `
*** TRAUMATIC BRAIN INJURY PROGRESS NOTE ***
Date: @TODAY@
Patient: @NAME@ @ROOM@
@DIAGNOSIS@ | @DAY_OF_ADMIT@

Injury: ____
GCS at Scene: ____

NEUROLOGICAL EXAM:
- GCS: @GCS@ (E@GCS_E@ V@GCS_V@ M@GCS_M@)
- Pupils: @PUPILS@
- Motor: @MOTOR@
- Sedation/RASS: @SEDATION@

ICP MONITORING:
- ICP: @ICP@ mmHg (Target <20-22)
- CPP: @CPP@ mmHg (Target >60)
- EVD: @EVD@

TBI BUNDLE:
[ ] HOB >30°
[ ] Neck neutral / C-collar off if cleared
[ ] PaCO2 35-40
[ ] Na goal 145-155 (if edema)
[ ] Normoglycemia (glucose 80-180)
[ ] Normothermia (T <38°C)
[ ] Seizure prophylaxis (7 days)
[ ] DVT ppx (when safe)

Vitals/Support:
- MAP: @MAP@ (goal >80 if ICP elevated)
- Vent: @VENT@
- Drips: @DRIPS@

Assessment / Plan:
@AP@

Tasks:
@TASKS@
`.trim(),
  },
  {
    id: "neuroicu-sah",
    label: ".NEUROICU_SAH",
    service: "NeuroICU",
    body: `
*** SUBARACHNOID HEMORRHAGE PROGRESS NOTE ***
Date: @TODAY@
Patient: @NAME@ @ROOM@
@DIAGNOSIS@ | @DAY_OF_ADMIT@

Hunt-Hess: ____  |  Fisher: ____
Bleed Day: ____
Aneurysm: ____ | Secured: ____

NEUROLOGICAL EXAM:
- GCS: @GCS@ (E@GCS_E@ V@GCS_V@ M@GCS_M@)
- Pupils: @PUPILS@
- Motor: @MOTOR@
- New deficits (vasospasm): ____

VASOSPASM MONITORING:
- TCD results: ____
- Clinical exam changes: ____
- Nimodipine: [ ]q4h

ICP/EVD:
- ICP: @ICP@ mmHg
- CPP: @CPP@ mmHg
- EVD: @EVD@

SAH BUNDLE:
[ ] Nimodipine 60mg q4h x 21 days
[ ] Euvolemia (CVP 8-12)
[ ] Daily TCDs POD3-14
[ ] Blood pressure goal: SBP <140 pre-secured / SBP 120-180 post-secured
[ ] Sodium target 135-145
[ ] Seizure prophylaxis
[ ] Stool softeners (avoid straining)

Assessment / Plan:
@AP@

Tasks:
@TASKS@
`.trim(),
  },
  {
    id: "neuroicu-status",
    label: ".NEUROICU_STATUS_EPILEPTICUS",
    service: "NeuroICU",
    body: `
*** STATUS EPILEPTICUS PROGRESS NOTE ***
Date: @TODAY@
Patient: @NAME@ @ROOM@
@DIAGNOSIS@ | @DAY_OF_ADMIT@

Seizure History: ____
Time to treatment: ____
Etiology: ____

NEUROLOGICAL EXAM:
- GCS: @GCS@ (E@GCS_E@ V@GCS_V@ M@GCS_M@)
- Pupils: @PUPILS@
- Motor: @MOTOR@
- Sedation/RASS: @SEDATION@

EEG FINDINGS:
- cEEG monitoring: [ ] Yes [ ] No
- Last seizure: ____
- Current pattern: ____
- Burst suppression goal: ____

ANTIEPILEPTIC DRUGS:
Current AEDs and levels:
1. ____
2. ____
3. ____

IV Anesthetics (if refractory):
- ____

Labs:
@LABS@
- AED levels: ____

Assessment / Plan:
@AP@

SEIZURE CHECKLIST:
[ ] cEEG monitoring
[ ] AED levels
[ ] Infection workup if new onset
[ ] LP if indicated
[ ] MRI brain
[ ] Pyridoxine (if refractory)
[ ] Avoid precipitants (hypoglycemia, hyponatremia)

Tasks:
@TASKS@
`.trim(),
  },
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
