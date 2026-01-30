export type Id = string;

export type Task = {
  id: Id;
  text: string;
  done: boolean;
  due?: "AM" | "PM" | "Today";
  priority?: "routine" | "urgent" | "stat";
};

export type Problem = {
  id: Id;
  title: string;
  assessment: string;
  plan: string;
  category?: "neuro" | "resp" | "cv" | "id" | "renal" | "gi" | "heme" | "endo" | "other";
};

// Clinical Scoring Types
export type HuntHessGrade = 1 | 2 | 3 | 4 | 5;
export type ModifiedFisherGrade = 0 | 1 | 2 | 3 | 4;
export type WFNSGrade = 1 | 2 | 3 | 4 | 5;

export type SAHScores = {
  huntHess?: HuntHessGrade;
  modifiedFisher?: ModifiedFisherGrade;
  wfns?: WFNSGrade;
  bleedDay?: number;
  ruptureDate?: string;
  aneurysmLocation?: string;
  aneurysmSecured?: boolean;
  securedMethod?: "clip" | "coil" | "flow-diverter" | "other";
};

export type StrokeScores = {
  nihss?: number;
  aspects?: number; // 0-10 for MCA territory
  lastKnownWell?: string;
  tpaGiven?: boolean;
  thrombectomy?: boolean;
  ticiScore?: string;
  strokeType?: "ischemic" | "hemorrhagic-conversion" | "tia";
  territory?: string;
};

export type ICHScores = {
  ichScore?: number; // 0-6
  ichVolume?: number; // in mL (ABC/2)
  ichLocation?: "deep" | "lobar" | "brainstem" | "cerebellar";
  ivhPresent?: boolean;
  infratentorial?: boolean;
  age80Plus?: boolean;
  gcsScore?: number;
  functionalOutcome?: string;
};

export type TBIScores = {
  gcsAtScene?: number;
  mechanism?: string;
  marshallCT?: 1 | 2 | 3 | 4 | 5 | 6;
  tbiFinding?: string[];
  pupilsAtScene?: string;
  hypotensionEpisode?: boolean;
  hypoxiaEpisode?: boolean;
};

export type SeizureScores = {
  statusEpilepticus?: boolean;
  seizureType?: string;
  stess?: number; // Status Epilepticus Severity Score
  etiology?: string;
  eegFindings?: string;
  refractoryStatus?: boolean;
};

export type SpineScores = {
  asiaGrade?: "A" | "B" | "C" | "D" | "E";
  injuryLevel?: string;
  mechanism?: string;
  slic?: number; // Subaxial Cervical Spine Injury Classification
  tlics?: number; // Thoracolumbar Injury Classification and Severity
};

export type ClinicalScores = {
  sah?: SAHScores;
  stroke?: StrokeScores;
  ich?: ICHScores;
  tbi?: TBIScores;
  seizure?: SeizureScores;
  spine?: SpineScores;
};

// Neuro-specific exam components
export type NeuroExam = {
  // GCS - Current
  gcsTotal?: number;
  gcsEye?: 1 | 2 | 3 | 4;
  gcsVerbal?: 1 | 2 | 3 | 4 | 5;
  gcsMotor?: 1 | 2 | 3 | 4 | 5 | 6;
  // GCS - On Admission (for comparison)
  admissionGcsEye?: 1 | 2 | 3 | 4;
  admissionGcsVerbal?: 1 | 2 | 3 | 4 | 5;
  admissionGcsMotor?: 1 | 2 | 3 | 4 | 5 | 6;
  // Pupils
  pupils?: {
    left: { size: number; reactive: boolean };
    right: { size: number; reactive: boolean };
  };
  // Motor exam - detailed
  motorExam?: string;  // e.g., "LUE 4/5, RUE 5/5, LLE 4/5, RLE 5/5"
  motorStrength?: {
    lue?: 0 | 1 | 2 | 3 | 4 | 5;
    rue?: 0 | 1 | 2 | 3 | 4 | 5;
    lle?: 0 | 1 | 2 | 3 | 4 | 5;
    rle?: 0 | 1 | 2 | 3 | 4 | 5;
  };
  // Other neuro exam
  cranialNerves?: string;
  sedation?: string;  // RASS score or description
  rpiScore?: number;  // RASS if numeric
  seizures?: string;  // seizure activity / EEG findings
  // ICP monitoring
  icp?: number;       // intracranial pressure if EVD present
  cpp?: number;       // cerebral perfusion pressure
  evdDrain?: string;  // EVD drainage settings
};

export type DiagnosisType = "sah" | "stroke" | "ich" | "tbi" | "seizure" | "spine" | "tumor" | "other";

export type RoundingSheet = {
  id: Id;
  patientName: string;
  room?: string;
  dateISO: string; // YYYY-MM-DD
  diagnosis?: string; // Primary neuro diagnosis
  diagnosisType?: DiagnosisType;
  dayOfAdmit?: number; // Hospital day / ICU day
  oneLiner: string;
  neuroExam: NeuroExam;
  clinicalScores?: ClinicalScores;
  vitals: { 
    map?: number; 
    hr?: number; 
    spo2?: number; 
    vent?: string;
    temp?: number;
    rr?: number;
    fio2?: number;
    peep?: number;
  };
  linesTubes: string;
  drips: string;
  labs: string;
  imaging: string;
  checklist: Record<string, boolean>;
  problems: Problem[];
  tasks: Task[];
  notes?: string;
  updatedAt: number;
};
