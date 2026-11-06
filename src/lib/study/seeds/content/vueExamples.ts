export type VueExample = { lang: "typescript" | "vue"; code: string; purpose: string };
export const VUE_EXAMPLES: Record<string, [VueExample, VueExample]> = {
  "Versões, createApp e mounts": [
    { lang: "typescript", purpose: "Bootstrap valida container e configuração antes de instalar plugins e montar uma única instância.", code: `import { createApp, type App as VueApp, type Component } from "vue";

type PublicConfig = Readonly<{ apiBaseUrl: string; release: string }>;
export function bootstrap(root: Component, config: PublicConfig, container: Element | null): () => void {
  if (!container) throw new Error("Vue mount container was not found");
  if (!config.apiBaseUrl.startsWith("https://")) throw new Error("invalid public API URL");
  const app: VueApp = createApp(root);
  app.provide("public-config", config);
  app.config.errorHandler = (error, _instance, info) => console.error("vue-boundary", { info, release: config.release, error });
  app.mount(container);
  return () => app.unmount();
}` },
    { lang: "typescript", purpose: "Plugin mantém estado por aplicação e oferece descarte explícito para recurso fora da árvore.", code: `import type { App, InjectionKey, Ref } from "vue";
import { readonly, ref } from "vue";

export const onlineKey: InjectionKey<Readonly<Ref<boolean>>> = Symbol("online");
export function installConnectivity(app: App): () => void {
  const online = ref(globalThis.navigator?.onLine ?? true);
  const update = () => { online.value = globalThis.navigator?.onLine ?? true; };
  globalThis.addEventListener?.("online", update);
  globalThis.addEventListener?.("offline", update);
  app.provide(onlineKey, readonly(online));
  return () => {
    globalThis.removeEventListener?.("online", update);
    globalThis.removeEventListener?.("offline", update);
  };
}` },
  ],
  "Single-File Components": [
    { lang: "vue", purpose: "SFC declara props, emits, estado derivado e estilos locais sem mutar entrada.", code: `<script setup lang="ts">
import { computed } from "vue";
const props = withDefaults(defineProps<{ available: number; label?: string }>(), { label: "Vagas" });
const emit = defineEmits<{ reserve: [quantity: number] }>();
const status = computed(() => props.available > 0 ? \`\${props.available} disponíveis\` : "Esgotado");
function submit(): void { if (props.available > 0) emit("reserve", 1); }
</script>

<template>
  <section class="availability" aria-labelledby="availability-title">
    <h2 id="availability-title">{{ label }}</h2><p aria-live="polite">{{ status }}</p>
    <button type="button" :disabled="available === 0" @click="submit">Reservar</button>
  </section>
</template>

<style scoped>.availability { display: grid; gap: .75rem; }</style>` },
    { lang: "typescript", purpose: "Compiler gate parseia descriptor e reprova SFC sem template ou script TypeScript.", code: `import { parse } from "@vue/compiler-sfc";

export function inspectSfc(source: string, filename: string): { bindings: boolean; scopedStyles: number } {
  const { descriptor, errors } = parse(source, { filename, sourceMap: true });
  if (errors.length) throw new AggregateError(errors, \`invalid SFC: \${filename}\`);
  if (!descriptor.template) throw new Error("template block is required");
  if (descriptor.scriptSetup?.lang !== "ts") throw new Error("script setup lang=ts is required");
  return { bindings: descriptor.scriptSetup.content.includes("defineProps"), scopedStyles: descriptor.styles.filter(s => s.scoped).length };
}` },
  ],
  "Templates, directives e expressions": [
    { lang: "vue", purpose: "Lista usa identidade de domínio, elementos semânticos e handlers explícitos.", code: `<script setup lang="ts">
type Reservation = Readonly<{ id: string; attendee: string; status: "held" | "confirmed" }>;
defineProps<{ reservations: readonly Reservation[] }>();
const emit = defineEmits<{ cancel: [reservationId: string] }>();
</script>

<template>
  <ul aria-label="Reservas">
    <li v-for="reservation in reservations" :key="reservation.id">
      <span>{{ reservation.attendee }} — {{ reservation.status }}</span>
      <button type="button" @click="emit('cancel', reservation.id)">Cancelar</button>
    </li>
  </ul>
</template>` },
    { lang: "typescript", purpose: "Política de URL fecha protocolos e origens antes de produzir href para o template.", code: `const TRUSTED_ORIGINS = new Set(["https://chiron.example", "https://help.chiron.example"]);

export function safeNavigationUrl(raw: string, base = "https://chiron.example"): string {
  const url = new URL(raw, base);
  if (url.protocol !== "https:") throw new Error("HTTPS is required");
  if (!TRUSTED_ORIGINS.has(url.origin)) throw new Error("untrusted navigation origin");
  if (url.username || url.password) throw new Error("credentials in URL are forbidden");
  url.hash = "";
  return url.toString();
}

console.assert(safeNavigationUrl("/reservations/42") === "https://chiron.example/reservations/42");` },
  ],
  "Lifecycle e cleanup": [
    { lang: "typescript", purpose: "Composable cancela request anterior e impede resposta obsoleta de publicar estado.", code: `import { onScopeDispose, ref, watch, type Ref } from "vue";

export function useJson<T>(url: Ref<string>, decode: (value: unknown) => T) {
  const data = ref<T>(); const error = ref<unknown>(); let generation = 0;
  const stop = watch(url, async (current, _previous, onCleanup) => {
    const mine = ++generation; const controller = new AbortController();
    onCleanup(() => controller.abort()); error.value = undefined;
    try {
      const response = await fetch(current, { signal: controller.signal, credentials: "same-origin" });
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
      const decoded = decode(await response.json());
      if (mine === generation) data.value = decoded;
    } catch (cause) { if (!controller.signal.aborted && mine === generation) error.value = cause; }
  }, { immediate: true });
  onScopeDispose(stop); return { data, error };
}` },
    { lang: "typescript", purpose: "Listener global conserva a mesma referência e é liberado pelo effect scope.", code: `import { onScopeDispose, readonly, ref, type Ref } from "vue";

export function useWindowWidth(target: Window = window): Readonly<Ref<number>> {
  const width = ref(target.innerWidth);
  const update = (): void => { width.value = target.innerWidth; };
  target.addEventListener("resize", update, { passive: true });
  onScopeDispose(() => target.removeEventListener("resize", update));
  return readonly(width);
}

// A component or an explicit effectScope owns this composable; repeated
// mount/unmount cycles must return the listener count to its baseline.` },
  ],
  "ref, reactive e identidade": [
    { lang: "typescript", purpose: "Estado canônico preserva identidade por ID e expõe somente leituras aos consumidores.", code: `import { computed, reactive, readonly, toRef } from "vue";

type Reservation = { id: string; attendee: string; status: "held" | "confirmed" };
const state = reactive({ byId: new Map<string, Reservation>(), order: [] as string[] });

export const reservations = computed(() => state.order.map(id => state.byId.get(id)).filter((item): item is Reservation => Boolean(item)));
export const reservationOrder = readonly(toRef(state, "order"));
export function upsertReservation(item: Reservation): void {
  if (!state.byId.has(item.id)) state.order.push(item.id);
  state.byId.set(item.id, { ...item });
}` },
    { lang: "typescript", purpose: "shallowRef integra objeto imutável externo por substituição, sem proxy profundo acidental.", code: `import { readonly, shallowRef, triggerRef } from "vue";

type ImmutableIndex = Readonly<{ revision: number; values: ReadonlyMap<string, number> }>;
const index = shallowRef<ImmutableIndex>({ revision: 0, values: new Map() });
export const publicIndex = readonly(index);

export function replaceIndex(values: ReadonlyMap<string, number>): void {
  index.value = { revision: index.value.revision + 1, values: new Map(values) };
}
export function notifyExternalMutationForLegacyAdapter(): void {
  // Temporary compatibility boundary; prefer replaceIndex with immutable input.
  triggerRef(index);
}` },
  ],
  "computed e estado derivado": [
    { lang: "typescript", purpose: "Computed deriva disponibilidade e ordenação sem escrever a coleção canônica.", code: `import { computed, reactive } from "vue";

const state = reactive({ capacity: 4, confirmedIds: new Set<string>(), names: new Map<string, string>() });
export const remaining = computed(() => Math.max(0, state.capacity - state.confirmedIds.size));
export const confirmedNames = computed(() => [...state.confirmedIds]
  .map(id => ({ id, name: state.names.get(id) ?? "Participante" }))
  .sort((left, right) => left.name.localeCompare(right.name, "pt-BR")));

export function confirm(id: string, name: string): void {
  if (state.confirmedIds.size >= state.capacity && !state.confirmedIds.has(id)) throw new Error("sold out");
  state.names.set(id, name); state.confirmedIds.add(id);
}` },
    { lang: "typescript", purpose: "Writable computed adapta texto de formulário a inteiro validado sem duplicar estado.", code: `import { computed, ref } from "vue";

const quantity = ref(1); const validationError = ref<string>();
export const quantityText = computed<string>({
  get: () => String(quantity.value),
  set: raw => {
    const parsed = Number(raw.trim());
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 8) {
      validationError.value = "Informe um inteiro entre 1 e 8"; return;
    }
    validationError.value = undefined; quantity.value = parsed;
  },
});
export const quantityError = computed(() => validationError.value);` },
  ],
  "watch, watchEffect e flush": [
    { lang: "typescript", purpose: "Watcher de busca cancela a execução anterior e publica apenas a geração corrente.", code: `import { ref, watch, type Ref } from "vue";

export function watchSearch(query: Ref<string>, search: (term: string, signal: AbortSignal) => Promise<readonly string[]>) {
  const results = ref<readonly string[]>([]); const pending = ref(false); let generation = 0;
  const stop = watch(() => query.value.trim(), async (term, _old, onCleanup) => {
    const mine = ++generation; const controller = new AbortController(); onCleanup(() => controller.abort());
    if (!term) { results.value = []; pending.value = false; return; }
    pending.value = true;
    try { const found = await search(term, controller.signal); if (mine === generation) results.value = found; }
    finally { if (mine === generation) pending.value = false; }
  }, { immediate: true });
  return { results, pending, stop };
}` },
    { lang: "typescript", purpose: "Watch post-flush foca o resumo de erros somente quando ele entrou no DOM.", code: `import { nextTick, ref, watch, type Ref } from "vue";

export function useErrorFocus(errors: Ref<readonly string[]>) {
  const summary = ref<HTMLElement | null>(null);
  const stop = watch(() => errors.value.length, async (count, previous) => {
    if (count === 0 || count === previous) return;
    await nextTick();
    summary.value?.focus({ preventScroll: false });
  }, { flush: "post" });
  return { summary, stop };
}

// Template: <div ref="summary" tabindex="-1" role="alert">...</div>` },
  ],
  "Scheduler, nextTick e DOM": [
    { lang: "typescript", purpose: "Foco aguarda exatamente o patch que cria o painel, sem timeout arbitrário.", code: `import { nextTick, ref } from "vue";

export function useDisclosureFocus() {
  const open = ref(false); const panel = ref<HTMLElement | null>(null);
  async function reveal(): Promise<void> {
    open.value = true;
    await nextTick();
    if (!panel.value) throw new Error("panel was not mounted after Vue flush");
    panel.value.focus();
  }
  function hide(): void { open.value = false; }
  return { open, panel, reveal, hide };
}` },
    { lang: "typescript", purpose: "Processamento incremental limita lote e cede ao browser para evitar bloquear interação.", code: `export async function processInFrames<T>(items: readonly T[], apply: (item: T) => void, batchSize = 100): Promise<void> {
  if (!Number.isInteger(batchSize) || batchSize < 1) throw new RangeError("batchSize");
  for (let start = 0; start < items.length; start += batchSize) {
    for (const item of items.slice(start, start + batchSize)) apply(item);
    await new Promise<void>(resolve => {
      if (typeof requestAnimationFrame === "function") requestAnimationFrame(() => resolve());
      else queueMicrotask(resolve);
    });
  }
}` },
  ],
  "Props, defaults e validação": [
    { lang: "vue", purpose: "Prop readonly com default primitivo e union fechada mantém a API do componente pequena.", code: `<script setup lang="ts">
import { computed } from "vue";
type Tone = "neutral" | "success" | "danger";
const props = withDefaults(defineProps<{ message: string; tone?: Tone; details?: readonly string[] }>(), {
  tone: "neutral", details: () => [],
});
const cssClass = computed(() => \`notice notice--\${props.tone}\`);
</script>
<template>
  <section :class="cssClass" role="status"><p>{{ message }}</p>
    <ul v-if="details.length"><li v-for="detail in details" :key="detail">{{ detail }}</li></ul>
  </section>
</template>` },
    { lang: "typescript", purpose: "Decoder runtime valida dados externos antes que eles sejam entregues como props tipadas.", code: `export type SessionSummary = Readonly<{ id: string; title: string; remaining: number }>;

export function decodeSessionSummary(value: unknown): SessionSummary {
  if (!value || typeof value !== "object") throw new TypeError("session must be an object");
  const record = value as Record<string, unknown>;
  if (typeof record.id !== "string" || !record.id) throw new TypeError("session.id");
  if (typeof record.title !== "string" || !record.title) throw new TypeError("session.title");
  if (!Number.isInteger(record.remaining) || Number(record.remaining) < 0) throw new TypeError("session.remaining");
  return Object.freeze({ id: record.id, title: record.title, remaining: Number(record.remaining) });
}` },
  ],
  "Emits e v-model": [
    { lang: "vue", purpose: "Componente emite intenção tipada com identidade estável sem anunciar persistência concluída.", code: `<script setup lang="ts">
const props = defineProps<{ reservationId: string; pending: boolean }>();
const emit = defineEmits<{ cancelRequested: [payload: { reservationId: string; operationId: string }] }>();
let operationId: string | undefined;
function requestCancellation(): void {
  operationId ??= crypto.randomUUID();
  emit("cancelRequested", { reservationId: props.reservationId, operationId });
}
</script>
<template><button type="button" :disabled="pending" @click="requestCancellation">
  {{ pending ? "Cancelando…" : "Cancelar reserva" }}
</button></template>` },
    { lang: "vue", purpose: "v-model nomeado adapta texto a quantidade validada sem mutar prop diretamente.", code: `<script setup lang="ts">
import { computed, ref } from "vue";
const quantity = defineModel<number>("quantity", { required: true });
const error = ref<string>();
const text = computed({ get: () => String(quantity.value), set: (raw: string) => {
  const parsed = Number(raw.trim());
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 8) { error.value = "Use 1 a 8"; return; }
  error.value = undefined; quantity.value = parsed;
}});
</script>
<template><label>Quantidade <input v-model="text" inputmode="numeric" :aria-invalid="Boolean(error)"></label>
  <p v-if="error" role="alert">{{ error }}</p></template>` },
  ],
  "Slots e composição visual": [
    { lang: "vue", purpose: "Lista expõe item readonly e callback estreito por scoped slot, preservando key de domínio.", code: `<script setup lang="ts" generic="T extends { id: string }">
defineProps<{ items: readonly T[]; label: string }>();
const emit = defineEmits<{ select: [id: string] }>();
defineSlots<{ default(props: { item: Readonly<T>; select: () => void }): unknown; empty(): unknown }>();
</script>
<template><ul :aria-label="label">
  <li v-for="item in items" :key="item.id"><slot :item="item" :select="() => emit('select', item.id)" /></li>
  <li v-if="items.length === 0"><slot name="empty">Nenhum item disponível.</slot></li>
</ul></template>` },
    { lang: "vue", purpose: "Dialog usa slots semânticos, Teleport e fallback mantendo estrutura acessível.", code: `<script setup lang="ts">
defineProps<{ open: boolean; titleId: string }>();
const emit = defineEmits<{ close: [] }>();
defineSlots<{ title(): unknown; default(): unknown; actions(): unknown }>();
</script>
<template><Teleport to="body"><div v-if="open" class="backdrop" @click.self="emit('close')">
  <section role="dialog" aria-modal="true" :aria-labelledby="titleId">
    <h2 :id="titleId"><slot name="title">Confirmação</slot></h2>
    <div><slot /></div><footer><slot name="actions"><button @click="emit('close')">Fechar</button></slot></footer>
  </section>
</div></Teleport></template>` },
  ],
  "Provide, inject e boundaries": [
    { lang: "typescript", purpose: "InjectionKey expõe estado readonly e comandos mínimos, falhando cedo sem provider.", code: `import { inject, type InjectionKey, type Ref } from "vue";

export type ReservationContext = Readonly<{
  remaining: Readonly<Ref<number>>;
  reserve: (quantity: number, operationId: string) => Promise<void>;
}>;
export const reservationKey: InjectionKey<ReservationContext> = Symbol("reservation-context");

export function useReservationContext(): ReservationContext {
  const context = inject(reservationKey);
  if (!context) throw new Error("ReservationContext provider is required");
  return context;
}` },
    { lang: "typescript", purpose: "Provider cria estado por instância e centraliza mutation em command validado.", code: `import { provide, readonly, ref } from "vue";
import { reservationKey } from "./reservation-context";

export function provideReservation(initialCapacity: number): void {
  if (!Number.isInteger(initialCapacity) || initialCapacity < 0) throw new RangeError("capacity");
  const remaining = ref(initialCapacity);
  provide(reservationKey, { remaining: readonly(remaining), async reserve(quantity, operationId) {
    if (!operationId || !Number.isInteger(quantity) || quantity < 1) throw new TypeError("reservation command");
    if (quantity > remaining.value) throw new Error("sold out");
    // A real adapter confirms the outcome before local state is changed.
    remaining.value -= quantity;
  }});
}` },
  ],
  "Inputs, v-model e parsing": [
    { lang: "typescript", purpose: "Parser diferencia vazio, formato inválido e inteiro válido sem converter ausência em zero.", code: `export type ParsedQuantity =
  | { ok: true; value: number }
  | { ok: false; reason: "required" | "integer" | "range" };

export function parseQuantity(raw: string): ParsedQuantity {
  const normalized = raw.trim();
  if (!normalized) return { ok: false, reason: "required" };
  if (!/^[0-9]+$/u.test(normalized)) return { ok: false, reason: "integer" };
  const value = Number(normalized);
  if (!Number.isSafeInteger(value) || value < 1 || value > 8) return { ok: false, reason: "range" };
  return { ok: true, value };
}
console.assert(!parseQuantity("").ok && parseQuantity("2").ok);` },
    { lang: "vue", purpose: "Campo conserva draft textual e só emite valor canônico após parsing bem-sucedido.", code: `<script setup lang="ts">
import { ref, watch } from "vue";
import { parseQuantity } from "./parse-quantity";
const props = defineProps<{ modelValue: number }>();
const emit = defineEmits<{ "update:modelValue": [value: number] }>();
const draft = ref(String(props.modelValue)); const error = ref<string>();
watch(() => props.modelValue, value => { draft.value = String(value); });
function commit(): void { const parsed = parseQuantity(draft.value);
  if (!parsed.ok) { error.value = parsed.reason; return; }
  error.value = undefined; emit("update:modelValue", parsed.value); }
</script>
<template><label>Quantidade <input v-model="draft" inputmode="numeric" @blur="commit"></label>
  <p v-if="error" role="alert">Quantidade inválida: {{ error }}</p></template>` },
  ],
  "Validação e errors": [
    { lang: "typescript", purpose: "Validador retorna erros estruturados e estáveis para campo e formulário.", code: `export type FieldError = Readonly<{ path: "email" | "quantity" | "$form"; code: string; message: string }>;
type Draft = Readonly<{ email: string; quantity: string }>;

export function validateDraft(draft: Draft): readonly FieldError[] {
  const errors: FieldError[] = [];
  const email = draft.email.trim();
  if (!email) errors.push({ path: "email", code: "required", message: "Informe o e-mail." });
  else if (!/^[^@\s]+@[^@\s]+$/u.test(email)) errors.push({ path: "email", code: "format", message: "Revise o e-mail." });
  if (!/^[1-8]$/u.test(draft.quantity.trim())) errors.push({ path: "quantity", code: "range", message: "Use uma quantidade de 1 a 8." });
  return errors;
}` },
    { lang: "typescript", purpose: "Validação remota descarta resposta de valor antigo e trata abort como controle esperado.", code: `export function createLatestValidator(validate: (value: string, signal: AbortSignal) => Promise<boolean>) {
  let controller: AbortController | undefined; let generation = 0;
  return async (value: string): Promise<{ value: string; valid: boolean } | undefined> => {
    controller?.abort(); controller = new AbortController(); const mine = ++generation;
    try {
      const valid = await validate(value, controller.signal);
      return mine === generation ? { value, valid } : undefined;
    } catch (error) {
      if (controller.signal.aborted || mine !== generation) return undefined;
      throw error;
    }
  };
}` },
  ],
  "Acessibilidade e foco": [
    { lang: "vue", purpose: "Form liga label, descrição, erro e estado inválido por IDs estáveis.", code: `<script setup lang="ts">
defineProps<{ value: string; error?: string; hint?: string }>();
const emit = defineEmits<{ "update:value": [value: string] }>();
const id = "reservation-email";
</script>
<template><div><label :for="id">E-mail</label>
  <p v-if="hint" :id="id + '-hint'">{{ hint }}</p>
  <input :id="id" type="email" :value="value" :aria-invalid="Boolean(error)"
    :aria-describedby="[hint && id + '-hint', error && id + '-error'].filter(Boolean).join(' ')"
    @input="emit('update:value', ($event.currentTarget as HTMLInputElement).value)">
  <p v-if="error" :id="id + '-error'" role="alert">{{ error }}</p></div></template>` },
    { lang: "typescript", purpose: "Gerenciador restaura foco ao trigger ainda conectado após fechar dialog.", code: `import { nextTick, ref } from "vue";

export function useDialogFocus() {
  const dialog = ref<HTMLElement | null>(null); let trigger: HTMLElement | null = null;
  async function opened(by: HTMLElement): Promise<void> {
    trigger = by; await nextTick();
    const target = dialog.value?.querySelector<HTMLElement>("[autofocus],button,[href],input,select,textarea,[tabindex]:not([tabindex='-1'])");
    (target ?? dialog.value)?.focus();
  }
  async function closed(): Promise<void> {
    await nextTick(); if (trigger?.isConnected) trigger.focus(); trigger = null;
  }
  return { dialog, opened, closed };
}` },
  ],
  "Submit, optimistic UI e replay": [
    { lang: "typescript", purpose: "State machine conserva operationId durante timeout e replay da mesma intenção.", code: `type SubmitState =
  | { tag: "idle" }
  | { tag: "submitting" | "unknown"; operationId: string; fingerprint: string }
  | { tag: "confirmed"; operationId: string; reservationId: string }
  | { tag: "rejected"; code: string };

export function beginSubmit(current: SubmitState, fingerprint: string): SubmitState {
  if ((current.tag === "submitting" || current.tag === "unknown") && current.fingerprint === fingerprint) return current;
  return { tag: "submitting", operationId: crypto.randomUUID(), fingerprint };
}
export function timeout(state: SubmitState): SubmitState {
  return state.tag === "submitting" ? { ...state, tag: "unknown" } : state;
}` },
    { lang: "typescript", purpose: "Cliente repete mutation com a mesma chave e decodifica identidade retornada.", code: `type ReservationResult = Readonly<{ outcome: "created" | "replayed"; reservationId: string; eventId: string }>;
export async function reserve(command: unknown, operationId: string, signal?: AbortSignal): Promise<ReservationResult> {
  if (!operationId) throw new TypeError("stable operationId is required");
  const response = await fetch("/v1/reservations", { method: "POST", credentials: "same-origin", signal,
    headers: { "content-type": "application/json", "idempotency-key": operationId }, body: JSON.stringify(command) });
  if (!response.ok) throw new Error(\`reservation HTTP \${response.status}\`);
  const body = await response.json() as Partial<ReservationResult>;
  if (!body.reservationId || !body.eventId || !["created", "replayed"].includes(String(body.outcome))) throw new TypeError("invalid response");
  return body as ReservationResult;
}` },
  ],
  "Composables e ownership": [
    { lang: "typescript", purpose: "Composable aceita getter reativo, cancela timers e expõe somente leitura.", code: `import { computed, onScopeDispose, ref, toValue, watch, type MaybeRefOrGetter } from "vue";

export function useDebouncedValue<T>(source: MaybeRefOrGetter<T>, delayMs = 250) {
  if (!Number.isFinite(delayMs) || delayMs < 0) throw new RangeError("delayMs");
  const value = ref<T>(toValue(source)) as { value: T }; let timer: ReturnType<typeof setTimeout> | undefined;
  const stop = watch(() => toValue(source), next => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { value.value = next; timer = undefined; }, delayMs);
  });
  onScopeDispose(() => { stop(); if (timer) clearTimeout(timer); });
  return computed(() => value.value);
}` },
    { lang: "typescript", purpose: "Effect scope torna ownership de um serviço reativo independente explícito.", code: `import { effectScope, ref, watch, type EffectScope } from "vue";

export function createClock(intervalMs = 1000): { now: Readonly<{ value: number }>; dispose: () => void } {
  const scope: EffectScope = effectScope(); const now = ref(Date.now()); let timer: ReturnType<typeof setInterval>;
  scope.run(() => {
    timer = setInterval(() => { now.value = Date.now(); }, intervalMs);
    watch(now, value => { if (!Number.isFinite(value)) throw new Error("clock invariant"); });
  });
  return { now, dispose: () => { clearInterval(timer!); scope.stop(); } };
}` },
  ],
  "Ports, services e adapters": [
    { lang: "typescript", purpose: "Porta de domínio retorna outcomes exaustivos e preserva operationId.", code: `export type ReserveCommand = Readonly<{ sessionId: string; quantity: number; operationId: string }>;
export type ReserveOutcome =
  | { type: "created" | "replayed"; reservationId: string; eventId: string }
  | { type: "sold-out" }
  | { type: "conflict"; code: string }
  | { type: "unknown"; operationId: string };
export interface ReservationGateway {
  reserve(command: ReserveCommand, signal: AbortSignal): Promise<ReserveOutcome>;
  lookup(operationId: string, signal: AbortSignal): Promise<ReserveOutcome>;
}
export function outcomeMessage(outcome: ReserveOutcome): string {
  switch (outcome.type) {
    case "created": case "replayed": return \`Reserva \${outcome.reservationId} confirmada\`;
    case "sold-out": return "Sessão esgotada"; case "conflict": return "A operação conflita";
    case "unknown": return "Verificando resultado";
  }
}` },
    { lang: "typescript", purpose: "Adapter HTTP fecha endpoint, credenciais, key idempotente e decoding mínimo.", code: `import type { ReservationGateway, ReserveCommand, ReserveOutcome } from "./reservation-port";
export class HttpReservationGateway implements ReservationGateway {
  constructor(private readonly baseUrl: URL) { if (baseUrl.protocol !== "https:") throw new Error("HTTPS required"); }
  async reserve(command: ReserveCommand, signal: AbortSignal): Promise<ReserveOutcome> {
    const response = await fetch(new URL("/v1/reservations", this.baseUrl), { method: "POST", signal, credentials: "include",
      headers: { "content-type": "application/json", "idempotency-key": command.operationId }, body: JSON.stringify(command) });
    if (response.status === 409) return { type: "conflict", code: "idempotency-conflict" };
    if (response.status === 410) return { type: "sold-out" };
    if (!response.ok) return { type: "unknown", operationId: command.operationId };
    return await response.json() as ReserveOutcome;
  }
  async lookup(operationId: string, signal: AbortSignal) { return await (await fetch(new URL(\`/v1/operations/\${encodeURIComponent(operationId)}\`, this.baseUrl), { signal, credentials: "include" })).json() as ReserveOutcome; }
}` },
  ],
  "Estado de servidor e cache": [
    { lang: "typescript", purpose: "Query key inclui tenant, locale, schema e parâmetros canônicos.", code: `export type ReservationQuery = Readonly<{ tenantId: string; locale: string; status?: string; cursor?: string }>;
export function reservationQueryKey(query: ReservationQuery): readonly unknown[] {
  if (!query.tenantId || !query.locale) throw new TypeError("query context");
  return ["reservations", { tenant: query.tenantId, locale: query.locale, schema: 2,
    status: query.status ?? null, cursor: query.cursor ?? null }] as const;
}
const alpha = JSON.stringify(reservationQueryKey({ tenantId: "alpha", locale: "pt-BR" }));
const beta = JSON.stringify(reservationQueryKey({ tenantId: "beta", locale: "pt-BR" }));
console.assert(alpha !== beta);` },
    { lang: "typescript", purpose: "Rollback otimista só desfaz a própria versão e não apaga atualização concorrente.", code: `type Cached<T> = { value: T; revision: number; optimisticOperation?: string };
export function optimisticallyUpdate<T>(entry: Cached<T>, operationId: string, update: (value: T) => T): Cached<T> {
  return { value: update(entry.value), revision: entry.revision + 1, optimisticOperation: operationId };
}
export function rollbackIfOwned<T>(current: Cached<T>, operationId: string, previous: Cached<T>): Cached<T> {
  if (current.optimisticOperation !== operationId) return current;
  return { value: previous.value, revision: current.revision + 1 };
}
const before = { value: 2, revision: 4 };
const pending = optimisticallyUpdate(before, "op-1", value => value - 1);
console.assert(rollbackIfOwned(pending, "op-1", before).value === 2);` },
  ],
  "Pinia e estado compartilhado": [
    { lang: "typescript", purpose: "Setup store usa union de estado e action com resposta fora de ordem protegida.", code: `import { defineStore } from "pinia";
import { computed, ref } from "vue";
type LoadState = { tag: "idle" } | { tag: "loading"; generation: number } | { tag: "ready"; items: readonly string[] } | { tag: "error"; message: string };
export const useSessionsStore = defineStore("sessions", () => {
  const state = ref<LoadState>({ tag: "idle" }); let generation = 0;
  const items = computed(() => state.value.tag === "ready" ? state.value.items : []);
  async function load(fetchSessions: () => Promise<readonly string[]>): Promise<void> {
    const mine = ++generation; state.value = { tag: "loading", generation: mine };
    try { const found = await fetchSessions(); if (mine === generation) state.value = { tag: "ready", items: found }; }
    catch { if (mine === generation) state.value = { tag: "error", message: "Não foi possível carregar." }; }
  }
  return { state, items, load };
});` },
    { lang: "typescript", purpose: "Envelope persistido usa allowlist, versão e identidade sem armazenar token.", code: `type PreferenceState = Readonly<{ locale: string; reducedMotion: boolean }>;
type Envelope = Readonly<{ schema: 2; userId: string; savedAt: number; preferences: PreferenceState }>;
export function encodePreferences(userId: string, preferences: PreferenceState): string {
  if (!userId || !/^[a-z]{2}(?:-[A-Z]{2})?$/u.test(preferences.locale)) throw new TypeError("preferences");
  const envelope: Envelope = { schema: 2, userId, savedAt: Date.now(), preferences: { ...preferences } };
  return JSON.stringify(envelope);
}
export function decodePreferences(raw: string, expectedUser: string): PreferenceState | undefined {
  const value = JSON.parse(raw) as Partial<Envelope>;
  if (value.schema !== 2 || value.userId !== expectedUser || !value.preferences) return undefined;
  return { locale: String(value.preferences.locale), reducedMotion: Boolean(value.preferences.reducedMotion) };
}` },
  ],
  "Routes, params e query": [
    { lang: "typescript", purpose: "Codec de query diferencia ausência e valida enum, inteiro e cursor.", code: `type Filters = Readonly<{ status?: "open" | "confirmed"; page: number; cursor?: string }>;
export function decodeFilters(query: Record<string, unknown>): Filters {
  const rawStatus = Array.isArray(query.status) ? query.status[0] : query.status;
  if (rawStatus !== undefined && rawStatus !== "open" && rawStatus !== "confirmed") throw new TypeError("status");
  const rawPage = Array.isArray(query.page) ? query.page[0] : query.page;
  const page = rawPage === undefined ? 1 : Number(rawPage);
  if (!Number.isSafeInteger(page) || page < 1 || page > 1000) throw new RangeError("page");
  const cursor = typeof query.cursor === "string" && query.cursor ? query.cursor : undefined;
  return { status: rawStatus as Filters["status"], page, cursor };
}` },
    { lang: "typescript", purpose: "Redirect interno aceita somente route names declarados e params simples.", code: `const ALLOWED_DESTINATIONS = new Set(["sessions", "reservation-detail", "profile"]);
type SafeDestination = { name: string; params?: Record<string, string> };
export function decodeDestination(raw: string | null): SafeDestination {
  if (!raw) return { name: "sessions" };
  const parsed = JSON.parse(raw) as Partial<SafeDestination>;
  if (!parsed.name || !ALLOWED_DESTINATIONS.has(parsed.name)) return { name: "sessions" };
  const params = Object.fromEntries(Object.entries(parsed.params ?? {}).filter(([, value]) => typeof value === "string" && value.length <= 100));
  return { name: parsed.name, params };
}` },
  ],
  "Guards e autorização": [
    { lang: "typescript", purpose: "Guard retorna decisões sem callback next e preserva destino apenas como rota interna.", code: `import type { NavigationGuard } from "vue-router";
type Session = { ready: boolean; authenticated: boolean; capabilities: ReadonlySet<string>; ensureReady(): Promise<void> };
export function requireCapability(session: Session): NavigationGuard {
  return async to => {
    await session.ensureReady();
    if (!session.authenticated && to.name !== "login") return { name: "login", query: { next: String(to.name ?? "sessions") } };
    const required = typeof to.meta.capability === "string" ? to.meta.capability : undefined;
    if (required && !session.capabilities.has(required)) return { name: "forbidden", replace: true };
    return true;
  };
}` },
    { lang: "typescript", purpose: "Policy pura combina capabilities sem confundir decisão cliente com autorização do servidor.", code: `export type RoutePolicy = Readonly<{ all?: readonly string[]; any?: readonly string[] }>;
export function mayNavigate(capabilities: ReadonlySet<string>, policy: RoutePolicy): boolean {
  const all = policy.all ?? []; const any = policy.any ?? [];
  return all.every(capability => capabilities.has(capability)) && (any.length === 0 || any.some(capability => capabilities.has(capability)));
}
const viewer = new Set(["reservation:read"]);
console.assert(mayNavigate(viewer, { all: ["reservation:read"] }));
console.assert(!mayNavigate(viewer, { all: ["reservation:write"] }));
// The API repeats the authoritative tenant/resource policy for every request.` },
  ],
  "Lazy routes e chunks": [
    { lang: "typescript", purpose: "Mapa fechado associa nomes de rota a imports analisáveis pelo bundler.", code: `import type { Component } from "vue";
const routeComponents: Record<string, () => Promise<{ default: Component }>> = {
  sessions: () => import("../pages/SessionsPage.vue"),
  reservation: () => import("../pages/ReservationPage.vue"),
  profile: () => import("../pages/ProfilePage.vue"),
};
export async function loadRouteComponent(name: string): Promise<Component> {
  const load = routeComponents[name];
  if (!load) throw new Error(\`unknown route component: \${name}\`);
  const module = await load();
  if (!module.default) throw new Error(\`route component missing: \${name}\`);
  return module.default;
}` },
    { lang: "typescript", purpose: "Recovery de chunk limita reload a uma tentativa por release e preserva diagnóstico.", code: `const KEY = "chiron:chunk-recovery";
export function mayReloadForChunkFailure(release: string, storage: Storage, online: boolean): boolean {
  if (!online || !release) return false;
  const previous = storage.getItem(KEY);
  if (previous === release) return false;
  storage.setItem(KEY, release);
  return true;
}
export function clearChunkRecovery(storage: Storage): void { storage.removeItem(KEY); }
// The caller shows an accessible fallback when reload is unsafe or already attempted;
// it never recursively reloads from a global unhandled-rejection handler.` },
  ],
  "Scroll, foco e transições": [
    { lang: "typescript", purpose: "Scroll behavior preserva popstate e valida anchors internos antes de usá-los.", code: `import type { RouterScrollBehavior } from "vue-router";
export const scrollBehavior: RouterScrollBehavior = async (to, from, savedPosition) => {
  if (savedPosition) return savedPosition;
  if (to.hash && /^#[A-Za-z][\w:.-]*$/u.test(to.hash)) return { el: to.hash, top: 72, behavior: "auto" };
  if (to.path === from.path) return false;
  return { left: 0, top: 0, behavior: "auto" };
};` },
    { lang: "typescript", purpose: "Hook de foco atua apenas após navegação confirmada e DOM atualizado.", code: `import { nextTick } from "vue";
import type { Router } from "vue-router";
export function installRouteFocus(router: Router): () => void {
  return router.afterEach(async (_to, _from, failure) => {
    if (failure) return;
    await nextTick();
    const target = document.querySelector<HTMLElement>("main h1, main [data-route-focus]");
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  });
}` },
  ],
  "HTTP client e contratos": [
    { lang: "typescript", purpose: "Decoder trata JSON como unknown e rejeita capacidade ou IDs inválidos.", code: `type Session = Readonly<{ id: string; title: string; remaining: number }>;
export function decodeSession(input: unknown): Session {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new TypeError("session object");
  const value = input as Record<string, unknown>;
  if (typeof value.id !== "string" || !/^[A-Za-z0-9_-]{1,80}$/u.test(value.id)) throw new TypeError("session.id");
  if (typeof value.title !== "string" || value.title.length > 200) throw new TypeError("session.title");
  if (!Number.isSafeInteger(value.remaining) || Number(value.remaining) < 0) throw new TypeError("session.remaining");
  return Object.freeze({ id: value.id, title: value.title, remaining: Number(value.remaining) });
}` },
    { lang: "typescript", purpose: "Deadline combina signal externo e timer, sempre liberando listeners e timer.", code: `export async function fetchWithDeadline(url: URL, init: RequestInit, timeoutMs: number): Promise<Response> {
  if (url.protocol !== "https:") throw new Error("HTTPS required");
  const controller = new AbortController(); const timer = setTimeout(() => controller.abort("deadline"), timeoutMs);
  const abort = () => controller.abort(init.signal?.reason ?? "caller");
  init.signal?.addEventListener("abort", abort, { once: true });
  try { return await fetch(url, { ...init, signal: controller.signal, credentials: "same-origin", redirect: "error" }); }
  finally { clearTimeout(timer); init.signal?.removeEventListener("abort", abort); }
}` },
  ],
  "Auth, cookies e CSRF": [
    { lang: "typescript", purpose: "Mutation same-origin exige token CSRF e nunca aceita destino controlado pelo caller.", code: `export async function mutate<T>(path: string, body: unknown, csrfToken: string, decode: (value: unknown) => T): Promise<T> {
  if (!path.startsWith("/v1/") || path.startsWith("//") || !csrfToken) throw new TypeError("mutation boundary");
  const response = await fetch(path, { method: "POST", credentials: "same-origin", redirect: "error",
    headers: { "content-type": "application/json", "x-csrf-token": csrfToken }, body: JSON.stringify(body) });
  if (response.status === 401) throw new Error("session-expired");
  if (response.status === 403) throw new Error("forbidden-or-csrf");
  if (!response.ok) throw new Error(\`mutation HTTP \${response.status}\`);
  return decode(await response.json());
}` },
    { lang: "typescript", purpose: "Coordenador permite apenas um refresh e não persiste token em storage.", code: `let activeRefresh: Promise<"authenticated" | "anonymous"> | undefined;
export function refreshSession(run: () => Promise<"authenticated" | "anonymous">): Promise<"authenticated" | "anonymous"> {
  if (activeRefresh) return activeRefresh;
  activeRefresh = run().finally(() => { activeRefresh = undefined; });
  return activeRefresh;
}
export async function withSessionRetry<T>(request: () => Promise<T>, refresh: () => Promise<"authenticated" | "anonymous">): Promise<T> {
  try { return await request(); }
  catch (error) {
    if (!(error instanceof Error) || error.message !== "session-expired") throw error;
    if (await refreshSession(refresh) !== "authenticated") throw error;
    return await request(); // mutations still preserve their idempotency key inside request
  }
}` },
  ],
  "SSE, WebSocket e ordering": [
    { lang: "typescript", purpose: "Reducer ignora duplicata/antigo e solicita resync ao detectar gap de revisão.", code: `type StreamState<T> = Readonly<{ revision: number; value: T; seen: ReadonlySet<string>; stale: boolean }>;
type Event<T> = Readonly<{ eventId: string; revision: number; value: T }>;
export function applyEvent<T>(state: StreamState<T>, event: Event<T>): StreamState<T> {
  if (state.seen.has(event.eventId) || event.revision <= state.revision) return state;
  if (event.revision !== state.revision + 1) return { ...state, stale: true };
  const seen = new Set(state.seen); seen.add(event.eventId);
  if (seen.size > 1000) seen.delete(seen.values().next().value!);
  return { revision: event.revision, value: event.value, seen, stale: false };
}` },
    { lang: "typescript", purpose: "Backoff com jitter e limite evita tempestade de reconnect sincronizada.", code: `export function reconnectDelay(attempt: number, random: () => number = Math.random): number {
  if (!Number.isInteger(attempt) || attempt < 0) throw new RangeError("attempt");
  const cap = 30_000; const base = Math.min(cap, 500 * 2 ** Math.min(attempt, 10));
  return Math.floor(base * (0.5 + random() * 0.5));
}
export async function waitForReconnect(attempt: number, signal: AbortSignal): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, reconnectDelay(attempt));
    signal.addEventListener("abort", () => { clearTimeout(timer); reject(signal.reason); }, { once: true });
  });
}` },
  ],
  "Service worker e offline": [
    { lang: "typescript", purpose: "Fila offline persiste envelope versionado com operationId, nunca Request ou token.", code: `export type OfflineCommand = Readonly<{ schema: 1; operationId: string; fingerprint: string; userId: string; kind: "reserve"; payload: { sessionId: string; quantity: number }; createdAt: number }>;
export function createOfflineCommand(userId: string, sessionId: string, quantity: number, operationId: string): OfflineCommand {
  if (!userId || !sessionId || !operationId || !Number.isInteger(quantity) || quantity < 1) throw new TypeError("offline command");
  const fingerprint = [userId, sessionId, quantity].join(":");
  return { schema: 1, userId, operationId, fingerprint, kind: "reserve", payload: { sessionId, quantity }, createdAt: Date.now() };
}
// Replay sends the same operationId; authentication is reacquired rather than stored.
` },
    { lang: "typescript", purpose: "Fetch strategy só usa cache-first para assets imutáveis allowlisted.", code: `const ASSET = /\\/assets\\/[A-Za-z0-9_.-]+-[A-Za-z0-9_-]{8,}\\.(?:js|css|png|svg|woff2)$/u;
export async function immutableAsset(request: Request, cacheName: string): Promise<Response> {
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || !ASSET.test(url.pathname)) return fetch(request);
  const cache = await caches.open(cacheName); const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (!response.ok || response.type === "opaque") return response;
  await cache.put(request, response.clone()); return response;
}` },
  ],
  "Unit e component tests": [
    { lang: "typescript", purpose: "Component test interage pelo nome acessível e valida evento público tipado.", code: `import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ReserveButton from "./ReserveButton.vue";

describe("ReserveButton", () => {
  it("emite uma intenção com a quantidade escolhida", async () => {
    const wrapper = mount(ReserveButton, { props: { remaining: 2 } });
    await wrapper.get("input[aria-label='Quantidade']").setValue("2");
    await wrapper.get("button").trigger("click");
    expect(wrapper.emitted("reserve")).toEqual([[{ quantity: 2 }]]);
    wrapper.unmount();
  });
});` },
    { lang: "typescript", purpose: "EffectScope test prova atualização e cleanup de composable sem componente artificial.", code: `import { effectScope, nextTick, ref } from "vue";
import { expect, it, vi } from "vitest";
import { useDebouncedValue } from "./useDebouncedValue";

it("para o timer ao encerrar o owner", async () => {
  vi.useFakeTimers(); const source = ref("a"); const scope = effectScope();
  const result = scope.run(() => useDebouncedValue(source, 100))!;
  source.value = "b"; await nextTick(); scope.stop();
  await vi.advanceTimersByTimeAsync(100);
  expect(result.value).toBe("a");
  vi.useRealTimers();
});` },
  ],
  "Router, store e integration": [
    { lang: "typescript", purpose: "Harness cria router e Pinia novos por teste e espera readiness antes da asserção.", code: `import { mount } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import { createPinia } from "pinia";
import App from "./App.vue";
import SessionPage from "./SessionPage.vue";

export async function mountAt(path: string) {
  const router = createRouter({ history: createMemoryHistory(), routes: [
    { path: "/sessions/:id", name: "session", component: SessionPage },
  ] });
  await router.push(path); await router.isReady();
  const wrapper = mount(App, { global: { plugins: [createPinia(), router] } });
  return { wrapper, router, dispose: () => wrapper.unmount() };
}` },
    { lang: "typescript", purpose: "Recording adapter valida idempotency e permite controlar outcome sem mockar component internals.", code: `type Command = Readonly<{ sessionId: string; operationId: string }>;
type Outcome = Readonly<{ type: "created"; reservationId: string }>;
export class RecordingGateway {
  readonly commands: Command[] = []; private pending: ((value: Outcome) => void)[] = [];
  reserve(command: Command): Promise<Outcome> {
    if (!command.operationId) throw new TypeError("operationId");
    this.commands.push(Object.freeze({ ...command }));
    return new Promise(resolve => this.pending.push(resolve));
  }
  resolveNext(outcome: Outcome): void {
    const resolve = this.pending.shift(); if (!resolve) throw new Error("no pending command"); resolve(outcome);
  }
}` },
  ],
  "Browser e visual": [
    { lang: "typescript", purpose: "Playwright exerce formulário por roles e confirma identidade no response e na UI.", code: `import { expect, test } from "@playwright/test";

test("reserva a última vaga com uma identidade lógica", async ({ page }) => {
  await page.goto("/sessions/session-1");
  await page.getByLabel("Quantidade").fill("1");
  const responsePromise = page.waitForResponse(response => response.url().endsWith("/v1/reservations") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Reservar" }).click();
  const response = await responsePromise; expect(response.ok()).toBeTruthy();
  const body = await response.json(); expect(body.reservationId).toMatch(/^res-/);
  await expect(page.getByRole("status")).toContainText(body.reservationId);
});` },
    { lang: "typescript", purpose: "Teste de teclado valida dialog, foco inicial e restauração ao trigger.", code: `import { expect, test } from "@playwright/test";

test("dialog mantém e restaura foco", async ({ page }) => {
  await page.goto("/reservations");
  const trigger = page.getByRole("button", { name: "Cancelar reserva" });
  await trigger.focus(); await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Confirmar cancelamento" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Manter reserva" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden(); await expect(trigger).toBeFocused();
});` },
  ],
  "Static, mutation e property": [
    { lang: "typescript", purpose: "Property test prova round-trip e canonicalização do codec de query.", code: `import fc from "fast-check";
import { expect, it } from "vitest";
import { decodeFilters, encodeFilters } from "./filters";

it("preserva filtros válidos em encode/decode", () => {
  fc.assert(fc.property(fc.record({
    status: fc.option(fc.constantFrom("open" as const, "confirmed" as const), { nil: undefined }),
    page: fc.integer({ min: 1, max: 1000 }),
    cursor: fc.option(fc.stringMatching(/^[A-Za-z0-9_-]{1,40}$/u), { nil: undefined }),
  }), filters => {
    expect(decodeFilters(encodeFilters(filters))).toEqual(filters);
  }), { numRuns: 500 });
});` },
    { lang: "typescript", purpose: "Modelo de eventos verifica dedupe, ordering e convergência para permutations.", code: `import fc from "fast-check";
import { expect, it } from "vitest";
import { applyEvent } from "./stream-state";

it("nunca reduz revision nem reaplica eventId", () => fc.assert(fc.property(
  fc.array(fc.record({ eventId: fc.uuid(), revision: fc.integer({ min: 1, max: 20 }), value: fc.integer() }), { maxLength: 100 }),
  events => {
    let state = { revision: 0, value: 0, seen: new Set<string>(), stale: false };
    for (const event of events) { const before = state.revision; state = applyEvent(state, event); expect(state.revision).toBeGreaterThanOrEqual(before); }
    expect(state.seen.size).toBeLessThanOrEqual(1000);
  }
)));` },
  ],
  "XSS, HTML e URLs": [
    { lang: "typescript", purpose: "URL policy restringe protocolo, origem, credenciais e tamanho antes do binding.", code: `const ALLOWED = new Set(["https://chiron.example", "https://docs.chiron.example"]);
export function trustedHref(raw: string, base = "https://chiron.example"): string {
  if (raw.length > 2048) throw new RangeError("URL too long");
  const url = new URL(raw, base);
  if (url.protocol !== "https:" || !ALLOWED.has(url.origin)) throw new Error("untrusted URL");
  if (url.username || url.password) throw new Error("URL credentials are forbidden");
  url.hash = "";
  return url.href;
}
console.assert(trustedHref("/help") === "https://chiron.example/help");` },
    { lang: "vue", purpose: "Registry fechado seleciona componentes permitidos sem compilar template ou import arbitrário.", code: `<script setup lang="ts">
import { computed } from "vue";
import InfoNotice from "./InfoNotice.vue";
import WarningNotice from "./WarningNotice.vue";
const props = defineProps<{ kind: string; message: string }>();
const registry = { info: InfoNotice, warning: WarningNotice } as const;
const selected = computed(() => props.kind in registry ? registry[props.kind as keyof typeof registry] : InfoNotice);
</script>
<template><component :is="selected" :message="message" /></template>` },
  ],
  "Supply chain e build": [
    { lang: "typescript", purpose: "Manifesto canônico associa release, lock e arquivos do artifact por digest.", code: `import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
type ArtifactManifest = Readonly<{ release: string; node: string; lockDigest: string; files: Record<string, string> }>;
const sha256 = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");
export async function buildManifest(release: string, lockPath: string, files: readonly string[]): Promise<ArtifactManifest> {
  const entries: Record<string, string> = {};
  for (const path of [...files].sort()) entries[path] = sha256(await readFile(path));
  return { release, node: process.version, lockDigest: sha256(await readFile(lockPath)), files: entries };
}` },
    { lang: "typescript", purpose: "Scanner de artifact procura canaries secretos sem imprimir o valor encontrado.", code: `type Finding = Readonly<{ file: string; canaryId: string }>;
export function scanArtifact(files: ReadonlyMap<string, string>, canaries: ReadonlyMap<string, string>): Finding[] {
  const findings: Finding[] = [];
  for (const [file, contents] of files) {
    for (const [canaryId, secret] of canaries) {
      if (!secret || secret.length < 12) throw new Error("canary must be distinctive");
      if (contents.includes(secret)) findings.push({ file, canaryId });
    }
  }
  return findings;
}` },
  ],
  "Secrets e configuração pública": [
    { lang: "typescript", purpose: "Runtime config decoder aceita somente valores públicos e origens HTTPS aprovadas.", code: `export type PublicConfig = Readonly<{ apiOrigin: string; release: string; telemetryEnabled: boolean }>;
export function decodePublicConfig(input: unknown): PublicConfig {
  if (!input || typeof input !== "object") throw new TypeError("public config");
  const value = input as Record<string, unknown>; const origin = new URL(String(value.apiOrigin));
  if (origin.protocol !== "https:" || !["api.chiron.example", "api-staging.chiron.example"].includes(origin.hostname)) throw new Error("api origin");
  if (typeof value.release !== "string" || !/^sha256:[a-f0-9]{16,}$/u.test(value.release)) throw new Error("release");
  if (typeof value.telemetryEnabled !== "boolean") throw new Error("telemetryEnabled");
  return Object.freeze({ apiOrigin: origin.origin, release: value.release, telemetryEnabled: value.telemetryEnabled });
}` },
    { lang: "typescript", purpose: "Persistência aplica allowlist e rejeita campos que podem carregar credenciais.", code: `type Preferences = Readonly<{ locale: string; theme: "light" | "dark" | "system" }>;
export function persistPreferences(storage: Storage, userId: string, value: Preferences): void {
  if (!userId || !/^[a-z]{2}(?:-[A-Z]{2})?$/u.test(value.locale)) throw new TypeError("preferences");
  storage.setItem(\`chiron:prefs:\${userId}\`, JSON.stringify({ schema: 1, locale: value.locale, theme: value.theme }));
}
export function assertNoCredentialFields(value: Record<string, unknown>): void {
  const forbidden = ["token", "secret", "password", "authorization", "cookie"];
  for (const key of Object.keys(value)) if (forbidden.some(term => key.toLowerCase().includes(term))) throw new Error("credential field is not persistable");
}` },
  ],
  "DoS, abuse e incidentes": [
    { lang: "typescript", purpose: "Fila concorrente impõe limite e respeita cancellation sem iniciar trabalho ilimitado.", code: `export class BoundedPool {
  private active = 0; private readonly queue: (() => void)[] = [];
  constructor(private readonly limit: number, private readonly maxQueued = 100) { if (limit < 1) throw new RangeError("limit"); }
  async run<T>(task: () => Promise<T>, signal?: AbortSignal): Promise<T> {
    if (this.active >= this.limit) {
      if (this.queue.length >= this.maxQueued) throw new Error("client-overloaded");
      await new Promise<void>((resolve, reject) => { const start = () => signal?.aborted ? reject(signal.reason) : resolve(); this.queue.push(start); });
    }
    if (signal?.aborted) throw signal.reason; this.active++;
    try { return await task(); } finally { this.active--; this.queue.shift()?.(); }
  }
}` },
    { lang: "typescript", purpose: "Validação de envelope limita bytes, profundidade e cardinalidade antes de renderizar.", code: `export function assertPayloadBudget(value: unknown, maxNodes = 10_000, maxDepth = 20): void {
  let nodes = 0; const visit = (current: unknown, depth: number): void => {
    if (++nodes > maxNodes) throw new RangeError("payload nodes");
    if (depth > maxDepth) throw new RangeError("payload depth");
    if (typeof current === "string" && current.length > 100_000) throw new RangeError("payload string");
    if (Array.isArray(current)) { for (const item of current) visit(item, depth + 1); return; }
    if (current && typeof current === "object") { for (const item of Object.values(current as Record<string, unknown>)) visit(item, depth + 1); }
  };
  visit(value, 0);
}` },
  ],
  "Renderização e virtual DOM": [
    { lang: "vue", purpose: "Lista usa key de domínio e props estáveis para preservar identidade durante reorder.", code: `<script setup lang="ts">
import { computed } from "vue";
type Row = Readonly<{ id: string; attendee: string; confirmed: boolean }>;
const props = defineProps<{ rows: readonly Row[]; filter: string }>();
const visible = computed(() => { const term = props.filter.trim().toLocaleLowerCase("pt-BR");
  return props.rows.filter(row => !term || row.attendee.toLocaleLowerCase("pt-BR").includes(term)); });
</script>
<template><ul aria-label="Participantes"><li v-for="row in visible" :key="row.id">
  <label><input type="checkbox" :checked="row.confirmed"> {{ row.attendee }}</label>
</li></ul></template>` },
    { lang: "typescript", purpose: "Janela virtual calcula intervalo bounded por IDs sem transformar índice em identidade.", code: `export type VirtualWindow<T> = Readonly<{ start: number; end: number; offset: number; items: readonly T[] }>;
export function virtualWindow<T>(items: readonly T[], scrollTop: number, viewport: number, rowHeight: number, overscan = 4): VirtualWindow<T> {
  if ([scrollTop, viewport, rowHeight].some(value => !Number.isFinite(value)) || rowHeight <= 0 || viewport < 0) throw new RangeError("geometry");
  const first = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const count = Math.ceil(viewport / rowHeight) + overscan * 2;
  const end = Math.min(items.length, first + count);
  return { start: first, end, offset: first * rowHeight, items: items.slice(first, end) };
}` },
  ],
  "Bundles e carregamento": [
    { lang: "typescript", purpose: "Budget gate reprova crescimento por entry e tipo usando manifesto real do build.", code: `type Asset = Readonly<{ file: string; bytes: number; entry: string; type: "js" | "css" | "image" | "font" }>;
type Budget = Readonly<{ entry: string; type: Asset["type"]; maxBytes: number }>;
export function budgetViolations(assets: readonly Asset[], budgets: readonly Budget[]): string[] {
  return budgets.flatMap(budget => {
    const used = assets.filter(asset => asset.entry === budget.entry && asset.type === budget.type).reduce((sum, asset) => sum + asset.bytes, 0);
    return used > budget.maxBytes ? [\`\${budget.entry}/\${budget.type}: \${used} > \${budget.maxBytes}\`] : [];
  });
}` },
    { lang: "typescript", purpose: "Preload policy mantém allowlist, cap e respeito a conexão restrita.", code: `type NetworkInfo = Readonly<{ saveData?: boolean; effectiveType?: string }>;
const PREFETCHABLE = new Set(["sessions", "profile"]);
export function mayPrefetch(routeName: string, network: NetworkInfo, activePrefetches: number): boolean {
  if (!PREFETCHABLE.has(routeName) || activePrefetches >= 2 || network.saveData) return false;
  if (network.effectiveType === "slow-2g" || network.effectiveType === "2g") return false;
  return true;
}
console.assert(!mayPrefetch("admin", {}, 0));
console.assert(!mayPrefetch("sessions", { saveData: true }, 0));` },
  ],
  "Web Vitals e profiling": [
    { lang: "typescript", purpose: "Agregação calcula percentil sem anexar URL ou identificador à métrica.", code: `type Vital = Readonly<{ name: "LCP" | "INP" | "CLS"; value: number; route: string; release: string }>;
export function percentile(values: readonly number[], quantile: number): number {
  if (!values.length || quantile < 0 || quantile > 1 || values.some(value => !Number.isFinite(value))) throw new RangeError("sample");
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(quantile * sorted.length) - 1)];
}
export function summarize(samples: readonly Vital[]) {
  return Object.fromEntries(["LCP", "INP", "CLS"].map(name => [name, percentile(samples.filter(sample => sample.name === name).map(sample => sample.value), 0.75)]));
}` },
    { lang: "typescript", purpose: "Performance marks medem operação com cleanup e labels bounded.", code: `const OPERATIONS = new Set(["route.load", "reservation.submit", "cache.hydrate"]);
export async function measureOperation<T>(operation: string, run: () => Promise<T>): Promise<{ value: T; durationMs: number }> {
  if (!OPERATIONS.has(operation)) throw new TypeError("unbounded operation label");
  const start = performance.now();
  try { const value = await run(); return { value, durationMs: performance.now() - start }; }
  finally {
    performance.clearMarks(\`\${operation}:start\`);
    performance.clearMeasures(operation);
  }
}` },
  ],
  "Logs, traces e privacy": [
    { lang: "typescript", purpose: "Evento estruturado usa allowlist e redação antes de qualquer transport.", code: `const SAFE_KEYS = new Set(["release", "route", "operation", "outcome", "durationMs", "errorClass"]);
export function telemetryEvent(name: string, input: Record<string, unknown>): Record<string, unknown> {
  if (!/^[a-z][a-z0-9_.-]{1,80}$/u.test(name)) throw new TypeError("event name");
  const event: Record<string, unknown> = { name, timestamp: Date.now() };
  for (const [key, value] of Object.entries(input)) {
    if (!SAFE_KEYS.has(key)) continue;
    if (typeof value === "string" && /bearer|token|cookie|password|@/iu.test(value)) event[key] = "[REDACTED]";
    else event[key] = value;
  }
  return event;
}` },
    { lang: "typescript", purpose: "Fila de telemetria limita quantidade e bytes e descarta sem bloquear aplicação.", code: `export class TelemetryQueue {
  private events: string[] = []; private bytes = 0;
  constructor(private readonly maxEvents = 100, private readonly maxBytes = 64_000) {}
  enqueue(event: Record<string, unknown>): boolean {
    const encoded = JSON.stringify(event); const size = new TextEncoder().encode(encoded).byteLength;
    if (size > this.maxBytes || this.events.length >= this.maxEvents || this.bytes + size > this.maxBytes) return false;
    this.events.push(encoded); this.bytes += size; return true;
  }
  drain(): string[] { const batch = this.events; this.events = []; this.bytes = 0; return batch; }
}` },
  ],
  "Build, lock e provenance Vue": [
    { lang: "typescript", purpose: "Artifact gate valida manifesto, referências e ausência de arquivos inesperados.", code: `type Manifest = Readonly<{ release: string; entry: string; files: Readonly<Record<string, string>> }>;
export function verifyArtifact(manifest: Manifest, files: ReadonlyMap<string, Uint8Array>): void {
  if (!/^sha256:[a-f0-9]{16,}$/u.test(manifest.release)) throw new Error("release digest");
  if (!files.has(manifest.entry)) throw new Error("missing entry");
  for (const [logical, path] of Object.entries(manifest.files)) {
    if (!logical || !/^[A-Za-z0-9_./-]+$/u.test(path) || !files.has(path)) throw new Error(\`missing artifact reference: \${logical}\`);
  }
  for (const path of files.keys()) if (/\.env$|secret|private-key/iu.test(path)) throw new Error("forbidden artifact file");
}` },
    { lang: "typescript", purpose: "Build identity canonicaliza materiais antes de produzir attestation assinável.", code: `type Material = Readonly<{ uri: string; digest: string }>;
export function provenanceStatement(subjectDigest: string, builderId: string, materials: readonly Material[]) {
  if (!/^[a-f0-9]{64}$/u.test(subjectDigest) || !builderId) throw new TypeError("provenance identity");
  return {
    _type: "https://in-toto.io/Statement/v1",
    subject: [{ name: "chiron-vue", digest: { sha256: subjectDigest } }],
    predicateType: "https://slsa.dev/provenance/v1",
    predicate: { builder: { id: builderId }, materials: [...materials].sort((a, b) => a.uri.localeCompare(b.uri)) },
  } as const;
}` },
  ],
  "Deploy, CDN e rollback": [
    { lang: "typescript", purpose: "Plano de publicação exige upload e checksum completos antes de ativar HTML.", code: `type PublishState = Readonly<{ expected: ReadonlyMap<string, string>; uploaded: ReadonlyMap<string, string>; activeRelease?: string }>;
export function nextPublishAction(state: PublishState, release: string): "upload" | "verify" | "activate" | "complete" {
  if ([...state.expected.keys()].some(path => !state.uploaded.has(path))) return "upload";
  if ([...state.expected].some(([path, digest]) => state.uploaded.get(path) !== digest)) return "verify";
  if (state.activeRelease !== release) return "activate";
  return "complete";
}
// Activation changes only the release pointer/HTML after immutable objects exist.
` },
    { lang: "typescript", purpose: "Canary gate combina chunk, CSP, API, estado e Web Vitals em decisão auditável.", code: `type Canary = Readonly<{ samples: number; jsErrors: number; chunkErrors: number; cspViolations: number; stateDivergence: number; p75InpMs: number }>;
export function canExpand(value: Canary): { approved: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (value.samples < 100) reasons.push("insufficient-sample");
  if (value.jsErrors / Math.max(1, value.samples) > .005) reasons.push("js-errors");
  if (value.chunkErrors) reasons.push("chunk-errors");
  if (value.cspViolations) reasons.push("csp");
  if (value.stateDivergence) reasons.push("state-divergence");
  if (value.p75InpMs > 200) reasons.push("inp-budget");
  return { approved: reasons.length === 0, reasons };
}` },
  ],
  "Migrations de estado cliente": [
    { lang: "typescript", purpose: "Migration pura valida versão e preserva operation IDs em comandos pendentes.", code: `type V1 = { schema: 1; user: string; pending: { session: string; key: string }[] };
type V2 = { schema: 2; userId: string; commands: { kind: "reserve"; sessionId: string; operationId: string }[] };
export function migrateToV2(input: unknown): V2 {
  if (!input || typeof input !== "object") throw new TypeError("state");
  const value = input as Partial<V1>;
  if (value.schema !== 1 || typeof value.user !== "string" || !Array.isArray(value.pending)) throw new TypeError("v1 state");
  const commands = value.pending.map(item => {
    if (!item || typeof item.session !== "string" || typeof item.key !== "string" || !item.key) throw new TypeError("pending command");
    return { kind: "reserve" as const, sessionId: item.session, operationId: item.key };
  });
  return { schema: 2, userId: value.user, commands };
}` },
    { lang: "typescript", purpose: "Recovery separa cache descartável de obrigações que nunca podem ser apagadas silenciosamente.", code: `type StoredArea = Readonly<{ name: string; kind: "cache" | "draft" | "obligation"; valid: boolean; bytes: number }>;
export function recoveryPlan(areas: readonly StoredArea[]): ReadonlyArray<{ name: string; action: "keep" | "rebuild" | "export" | "quarantine" }> {
  return areas.map(area => {
    if (area.valid) return { name: area.name, action: "keep" as const };
    if (area.kind === "cache") return { name: area.name, action: "rebuild" as const };
    if (area.kind === "draft") return { name: area.name, action: "export" as const };
    return { name: area.name, action: "quarantine" as const };
  });
}` },
  ],
  "Falhas, recovery e runbooks": [
    { lang: "typescript", purpose: "Classificador escolhe recovery bounded sem confundir abort local com rollback remoto.", code: `type Failure = "chunk" | "offline" | "unauthorized" | "forbidden" | "unknown-mutation" | "storage" | "render";
type Recovery = "reload-once" | "wait-network" | "refresh-once" | "stop" | "lookup-operation" | "quarantine" | "reset-subtree";
export function recoveryFor(failure: Failure): Recovery {
  switch (failure) {
    case "chunk": return "reload-once"; case "offline": return "wait-network";
    case "unauthorized": return "refresh-once"; case "forbidden": return "stop";
    case "unknown-mutation": return "lookup-operation"; case "storage": return "quarantine";
    case "render": return "reset-subtree";
  }
}` },
    { lang: "typescript", purpose: "Reload guard permite uma única tentativa por release e expira automaticamente.", code: `type ReloadRecord = Readonly<{ release: string; attemptedAt: number }>;
export function mayRecoverChunk(storage: Storage, release: string, now: number, ttlMs = 300_000): boolean {
  const raw = storage.getItem("chiron:chunk-recovery");
  if (raw) {
    const previous = JSON.parse(raw) as Partial<ReloadRecord>;
    if (previous.release === release && typeof previous.attemptedAt === "number" && now - previous.attemptedAt < ttlMs) return false;
  }
  storage.setItem("chiron:chunk-recovery", JSON.stringify({ release, attemptedAt: now } satisfies ReloadRecord));
  return true;
}` },
  ],
  "Arquitetura Vue do Quíron": [
    { lang: "typescript", purpose: "Application service mantém Vue fora da regra e preserva operationId em outcomes.", code: `type Reserve = Readonly<{ sessionId: string; quantity: number; operationId: string; fingerprint: string }>;
type Outcome = { type: "created" | "replayed"; reservationId: string; eventId: string } | { type: "sold-out" | "conflict" } | { type: "unknown"; operationId: string };
interface Gateway { reserve(command: Reserve, signal: AbortSignal): Promise<Outcome>; lookup(operationId: string, signal: AbortSignal): Promise<Outcome>; }
export class ReservationService {
  constructor(private readonly gateway: Gateway) {}
  async execute(command: Reserve, signal: AbortSignal): Promise<Outcome> {
    if (!command.operationId || !command.fingerprint || command.quantity < 1) throw new TypeError("reserve command");
    return await this.gateway.reserve(Object.freeze({ ...command }), signal);
  }
  lookup(operationId: string, signal: AbortSignal) { return this.gateway.lookup(operationId, signal); }
}` },
    { lang: "typescript", purpose: "Composition root recusa adapters fake em produção e devolve cleanup explícito.", code: `type Adapter = Readonly<{ kind: "real" | "fake"; dispose?: () => void }>;
type Dependencies = Readonly<{ gateway: Adapter; realtime: Adapter; telemetry: Adapter }>;
export function compose(environment: "production" | "test", dependencies: Dependencies) {
  const entries = Object.entries(dependencies) as [keyof Dependencies, Adapter][];
  if (environment === "production") {
    const fake = entries.filter(([, adapter]) => adapter.kind !== "real").map(([name]) => name);
    if (fake.length) throw new Error(\`fake adapters in production: \${fake.join(",")}\`);
  }
  return { dependencies, dispose: () => { for (const [, adapter] of entries.reverse()) adapter.dispose?.(); } };
}` },
  ],
  "Última vaga e replay Vue": [
    { lang: "typescript", purpose: "Reducer de workflow ignora attempt antiga e mantém identity em unknown e replay.", code: `type State = { tag: "editing" } | { tag: "submitting" | "unknown"; operationId: string; fingerprint: string; generation: number } | { tag: "confirmed"; operationId: string; reservationId: string; eventId: string } | { tag: "sold-out" | "conflict" };
type Response = Readonly<{ generation: number; operationId: string; outcome: "created" | "replayed" | "sold-out" | "conflict"; reservationId?: string; eventId?: string }>;
export function applyResponse(state: State, response: Response): State {
  if ((state.tag !== "submitting" && state.tag !== "unknown") || state.operationId !== response.operationId || state.generation !== response.generation) return state;
  if (response.outcome === "created" || response.outcome === "replayed") {
    if (!response.reservationId || !response.eventId) throw new TypeError("confirmed identity");
    return { tag: "confirmed", operationId: state.operationId, reservationId: response.reservationId, eventId: response.eventId };
  }
  return { tag: response.outcome };
}` },
    { lang: "typescript", purpose: "Oráculo final cruza respostas, banco, outbox e provider por identidade estável.", code: `type Oracle = Readonly<{ initialCapacity: number; remaining: number; createdResponses: number; soldOutResponses: number; reservations: number; outboxEvents: number; logicalProviderEffects: number; replayReservationIds: readonly string[]; replayEventIds: readonly string[] }>;
export function assertLastSeat(value: Oracle): void {
  if (value.initialCapacity !== 1 || value.remaining !== 0) throw new Error("capacity invariant");
  if (value.createdResponses !== 1 || value.soldOutResponses !== 1) throw new Error("race outcomes");
  if (value.reservations !== 1 || value.outboxEvents !== 1 || value.logicalProviderEffects !== 1) throw new Error("state/effect divergence");
  if (new Set(value.replayReservationIds).size !== 1 || new Set(value.replayEventIds).size !== 1) throw new Error("replay identity");
}` },
  ],
  "Segurança, testes e carga Vue": [
    { lang: "typescript", purpose: "Gate pós-carga exige correção, isolamento, privacy e recursos antes de considerar desempenho.", code: `type LoadReport = Readonly<{ initial: number; remaining: number; created: number; reservations: number; outbox: number; effects: number; unknown: number; crossTenant: number; secretCanaries: number; p75InpMs: number; listenerGrowth: number }>;
export function approveLoad(report: LoadReport): string[] {
  const failures: string[] = [];
  if (report.remaining !== report.initial - report.created || report.created !== report.reservations || report.created !== report.outbox || report.created !== report.effects) failures.push("state-effect");
  if (report.remaining < 0 || report.unknown || report.crossTenant) failures.push("invariant-or-isolation");
  if (report.secretCanaries) failures.push("privacy");
  if (report.p75InpMs > 200 || report.listenerGrowth > 0) failures.push("resource-budget");
  return failures;
}` },
    { lang: "typescript", purpose: "Corpus runner impõe deadline e conserva seed/case sem registrar payload sensível.", code: `type CorpusCase = Readonly<{ id: string; payload: unknown }>;
export async function runCorpus(cases: readonly CorpusCase[], exercise: (payload: unknown, signal: AbortSignal) => Promise<void>, timeoutMs = 1000): Promise<ReadonlyArray<{ id: string; outcome: "passed" | "failed" | "timeout" }>> {
  const results = [];
  for (const testCase of cases) {
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), timeoutMs);
    try { await exercise(testCase.payload, controller.signal); results.push({ id: testCase.id, outcome: "passed" as const }); }
    catch { results.push({ id: testCase.id, outcome: controller.signal.aborted ? "timeout" as const : "failed" as const }); }
    finally { clearTimeout(timer); }
  }
  return results;
}` },
  ],
  "Banca, deploy e recovery Vue": [
    { lang: "typescript", purpose: "Matriz de evidência bloqueia aprovação quando gate essencial está Pending ou em digest diferente.", code: `type Gate = Readonly<{ name: string; essential: boolean; status: "passed" | "failed" | "pending"; artifactDigest?: string }>;
export function acceptance(gates: readonly Gate[], expectedDigest: string): { approved: boolean; blockers: string[] } {
  const blockers = gates.flatMap(gate => {
    if (gate.essential && gate.status !== "passed") return [\`\${gate.name}:\${gate.status}\`];
    if (gate.status === "passed" && gate.artifactDigest !== expectedDigest) return [\`\${gate.name}:wrong-artifact\`];
    return [];
  });
  return { approved: blockers.length === 0, blockers };
}` },
    { lang: "typescript", purpose: "Recovery de restore mantém operations egress-safe até reconciliação e epoch válidos.", code: `type RecoveryEvidence = Readonly<{ manifestOk: boolean; storageOk: boolean; operationsReconciled: boolean; providerEffectsMatched: boolean; newEpoch: number; oldEpoch: number; egressEnabled: boolean }>;
export function mayEnableAfterRecovery(value: RecoveryEvidence): boolean {
  if (value.egressEnabled) throw new Error("egress enabled before recovery gate");
  if (value.newEpoch <= value.oldEpoch) return false;
  return value.manifestOk && value.storageOk && value.operationsReconciled && value.providerEffectsMatched;
}
console.assert(mayEnableAfterRecovery({ manifestOk: true, storageOk: true, operationsReconciled: true, providerEffectsMatched: true, newEpoch: 8, oldEpoch: 7, egressEnabled: false }));` },
  ],
};
