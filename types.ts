export type Id = string;

export type Task = {
  id: Id;
  text: string;
  done: boolean;
  due?: "AM" | "PM" | "Today";
};

export type Problem = {
  id: Id;
  title: string;
  assessment: string;
  plan: string;
};

export type RoundingSheet = {
  id: Id;
  patientName: string;
  room?: string;
  dateISO: string; // YYYY-MM-DD
  oneLiner: string;
  vitals: { map?: number; hr?: number; spo2?: number; vent?: string };
  linesTubes: string;
  drips: string;
  labs: string;
  imaging: string;
  checklist: Record<string, boolean>;
  problems: Problem[];
  tasks: Task[];
  updatedAt: number;
};
