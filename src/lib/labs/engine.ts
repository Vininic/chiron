import type { Lab, LabLayer, LabMutation } from "./types";

export interface LabValidationIssue {
  path: string;
  message: string;
}

/** Data-level safeguard: a mutation that turns nothing red is theatre, not a lesson. */
export function validateLab(lab: Lab): LabValidationIssue[] {
  const issues: LabValidationIssue[] = [];
  if (!lab.layers.length) issues.push({ path: "layers", message: "Um lab precisa de pelo menos uma camada." });
  for (const layer of lab.layers) {
    if (!layer.question.trim()) issues.push({ path: `${layer.id}.question`, message: "Toda camada começa com uma previsão." });
    if (!layer.contract.trim()) issues.push({ path: `${layer.id}.contract`, message: "Toda camada precisa declarar seu contrato." });
    if (!layer.invariants.length) issues.push({ path: `${layer.id}.invariants`, message: "Toda camada precisa de uma invariante verificável." });
    const invariantIds = new Set(layer.invariants.map((invariant) => invariant.id));
    for (const mutation of layer.mutations) {
      if (!mutation.breaks.length || mutation.breaks.some((id) => !invariantIds.has(id))) {
        issues.push({ path: `${layer.id}.mutations.${mutation.id}`, message: `A mutação “${mutation.label}” precisa quebrar uma invariante desta camada.` });
      }
    }
  }
  return issues;
}

export function activeMutations(layer: LabLayer, selected: string[]): LabMutation[] {
  const selectedSet = new Set(selected);
  return layer.mutations.filter((mutation) => selectedSet.has(mutation.id));
}

export function invariantIsBroken(invariantId: string, mutations: LabMutation[]): boolean {
  return mutations.some((mutation) => mutation.breaks.includes(invariantId));
}

export function labCompletion(lab: Lab, completedLayerIds: string[]): number {
  if (!lab.layers.length) return 0;
  const ids = new Set(completedLayerIds);
  return Math.round((lab.layers.filter((layer) => ids.has(layer.id)).length / lab.layers.length) * 100);
}

