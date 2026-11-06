export interface StudyPreferences { githubToken: string; dailyBudget: 25 | 60 | 90; newCardsPerDay: number; graceDays: number; readerSize: "sm" | "md" | "lg"; readerMeasure: "narrow" | "comfortable" | "wide"; readerSerif: boolean; }
const KEY = "chiron.study-preferences.v1";
export function defaultStudyPreferences(): StudyPreferences { return { githubToken: "", dailyBudget: 25, newCardsPerDay: 15, graceDays: 1, readerSize: "md", readerMeasure: "comfortable", readerSerif: true }; }
export function loadStudyPreferences(): StudyPreferences { try { return { ...defaultStudyPreferences(), ...(JSON.parse(localStorage.getItem(KEY) ?? "{}") as Partial<StudyPreferences>) }; } catch { return defaultStudyPreferences(); } }
export function saveStudyPreferences(preferences: StudyPreferences) { try { localStorage.setItem(KEY, JSON.stringify(preferences)); } catch { /* ignore */ } }
