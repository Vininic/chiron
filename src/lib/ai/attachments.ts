export interface FileAttachment { id: string; name: string; mimeType: string; size: number; data: string; }
const MAX_FILE_SIZE = 1_500_000;
const EXTENSIONS = [".csv", ".json", ".md", ".txt"];
export async function readAttachment(file: File): Promise<FileAttachment | { error: string }> {
  if (!(file.type.startsWith("text/") || file.type === "application/json" || EXTENSIONS.some((extension) => file.name.toLowerCase().endsWith(extension)))) return { error: `unsupported:${file.name}` };
  if (file.size > MAX_FILE_SIZE) return { error: `toolarge:${file.name}` };
  try { return { id: crypto.randomUUID(), name: file.name, mimeType: file.type || "text/plain", size: file.size, data: await file.text() }; } catch { return { error: `failed:${file.name}` }; }
}
export function withAttachments(text: string, attachments: FileAttachment[]): string { const files = attachments.map((file) => `Arquivo “${file.name}”:\n\`\`\`\n${file.data}\n\`\`\``).join("\n\n"); return files ? (text ? `${text}\n\n${files}` : files) : text; }

