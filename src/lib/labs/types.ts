export type LabKind = "snake" | "market" | "maze" | "rush";

export interface LabInvariant {
  id: string;
  label: string;
  /** A deliberately short explanation of why a red state matters. */
  failure: string;
}

export interface LabMutation {
  id: string;
  label: string;
  hypothesis: string;
  breaks: string[];
}

export interface LabLayer {
  id: string;
  title: string;
  concept: string;
  question: string;
  contract: string;
  code: string;
  sectionId?: string;
  invariants: LabInvariant[];
  mutations: LabMutation[];
}

export interface Lab {
  id: string;
  kind: LabKind;
  name: string;
  subtitle: string;
  description: string;
  accent: string;
  layers: LabLayer[];
}

export interface LabDraft {
  id: string;
  theme: string;
  concept?: string;
  lab: Lab;
  status: "draft" | "approved" | "rejected";
}

