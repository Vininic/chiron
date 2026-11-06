import { FIGMA_CURRICULUM } from "./figmaCurriculum";
export interface FigmaExample { lang: "javascript"; scope: "local-rule" | "local-transform" | "local-geometry" | "model"; purpose: string; code: string }
// Exemplos autônomos; nenhum objeto figma falso, editor, renderer ou provider é simulado como real.
const PAIRS: [FigmaExample, FigmaExample][] = [
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Identidade única, nomes contextuais",
      "code": "const assert = require('node:assert/strict');\nconst check = rows => { assert.equal(new Set(rows.map(x => x.id)).size, rows.length); return rows.length; };\nassert.equal(check([{ id: 'a', name: 'Reserva', page: 'draft' }, { id: 'b', name: 'Reserva', page: 'approved' }]), 2);\nassert.throws(() => check([{ id: 'a' }, { id: 'a' }]));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Referência por arquivo, node e revisão",
      "code": "const assert = require('node:assert/strict');\nconst inventory = [{ file: 'f1', node: 'n1', revision: 'r2' }];\nconst resolve = ref => { const row = inventory.find(x => x.file === ref.file && x.node === ref.node && x.revision === ref.revision); assert(row); return row; };\nassert.equal(resolve({ file: 'f1', node: 'n1', revision: 'r2' }).node, 'n1');\nassert.throws(() => resolve({ file: 'f2', node: 'n1', revision: 'r2' }));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Árvore sem órfãos ou ciclos",
      "code": "const assert = require('node:assert/strict');\nconst validate = rows => { const byId = new Map(rows.map(x => [x.id, x])); assert.equal(byId.size, rows.length); for (const row of rows) {\n    const seen = new Set();\n    let current = row;\n    while (current) {\n        assert(!seen.has(current.id));\n        seen.add(current.id);\n        if (current.parent) {\n            assert(byId.has(current.parent));\n            current = byId.get(current.parent);\n        }\n        else\n            current = null;\n    }\n} };\nvalidate([{ id: 'root' }, { id: 'text', parent: 'root' }]);\nassert.throws(() => validate([{ id: 'child', parent: 'missing' }]));\nassert.throws(() => validate([{ id: 'a', parent: 'b' }, { id: 'b', parent: 'a' }]));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "União de bounds e região explícita",
      "code": "const assert = require('node:assert/strict');\nconst union = rects => ({ x: Math.min(...rects.map(r => r.x)), y: Math.min(...rects.map(r => r.y)), right: Math.max(...rects.map(r => r.x + r.w)), bottom: Math.max(...rects.map(r => r.y + r.h)) });\nconst group = union([{ x: 10, y: 5, w: 20, h: 10 }, { x: 35, y: 8, w: 5, h: 20 }]);\nassert.deepEqual(group, { x: 10, y: 5, right: 40, bottom: 28 });\nassert.notEqual(group.right - group.x, 100);\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "Matriz afim sobre ponto",
      "code": "const assert = require('node:assert/strict');\nconst transform = (m, p) => ({ x: m[0] * p.x + m[2] * p.y + m[4], y: m[1] * p.x + m[3] * p.y + m[5] });\nassert.deepEqual(transform([1, 0, 0, 1, 10, 20], { x: 2, y: 3 }), { x: 12, y: 23 });\nassert.deepEqual(transform([0, 1, -1, 0, 0, 0], { x: 2, y: 3 }), { x: -3, y: 2 });\nassert.notDeepEqual(transform([0, 1, -1, 0, 0, 0], { x: 2, y: 3 }), { x: 2, y: 3 });\n"
    },
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "Interseção retangular sem rotação",
      "code": "const assert = require('node:assert/strict');\nconst area = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));\nconst a = { x: 0, y: 0, w: 10, h: 10 };\nassert.equal(area(a, { x: 5, y: 5, w: 10, h: 10 }), 25);\nassert.equal(area(a, { x: 10, y: 0, w: 4, h: 4 }), 0);\nassert.equal(area(a, { x: 20, y: 20, w: 1, h: 1 }), 0);\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Brief com critério observável",
      "code": "const assert = require('node:assert/strict');\nconst validate = x => { assert(x.objective && x.population); assert(Array.isArray(x.constraints) && x.constraints.length); assert(x.criteria.every(c => c.method && c.expected)); assert(x.criteria.length); };\nconst brief = { objective: 'Entender resultado', population: 'pessoas reservando', constraints: ['sem dados privados'], criteria: [{ method: 'tarefa conhecida', expected: 'distingue desconhecido' }] };\nvalidate(brief);\nassert.throws(() => validate({ ...brief, criteria: [{ method: 'bonito' }] }));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Coverage de fixtures por estado",
      "code": "const assert = require('node:assert/strict');\nconst required = ['available', 'loading', 'rejected', 'unknown'];\nconst check = rows => assert(required.every(state => rows.some(r => r.state === state)));\ncheck(required.map(state => ({ state })));\nassert.throws(() => check([{ state: 'available' }, { state: 'loading' }, { state: 'rejected' }]));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "Linha com gap e padding",
      "code": "const assert = require('node:assert/strict');\nconst line = (widths, padding, gap) => { let cursor = padding; const positions = widths.map(w => { assert(w >= 0); const x = cursor; cursor += w + gap; return x; }); return { positions, width: widths.reduce((a, b) => a + b, 0) + padding * 2 + Math.max(0, widths.length - 1) * gap }; };\nassert.deepEqual(line([20, 80], 16, 8), { positions: [16, 44], width: 140 });\nassert.throws(() => line([-1], 16, 8));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "Coluna com filho opcional",
      "code": "const assert = require('node:assert/strict');\nconst layout = rows => { let y = 12; return rows.filter(r => r.visible).map(r => { const out = { id: r.id, y }; y += r.height + 6; return out; }); };\nassert.deepEqual(layout([{ id: 'title', height: 20, visible: true }, { id: 'hint', height: 10, visible: false }, { id: 'action', height: 30, visible: true }]), [{ id: 'title', y: 12 }, { id: 'action', y: 38 }]);\nassert(!layout([{ id: 'hidden', height: 10, visible: false }]).length);\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "Hug com conteúdo explicitamente medido",
      "code": "const assert = require('node:assert/strict');\nconst hug = (textWidth, iconWidth, padding, gap) => { assert(textWidth >= 0 && iconWidth >= 0); return textWidth + iconWidth + padding * 2 + (iconWidth ? gap : 0); };\nassert.equal(hug(60, 16, 12, 8), 108);\nassert.equal(hug(60, 0, 12, 8), 84);\nassert.throws(() => hug(-1, 16, 12, 8));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "Fill com espaço restante válido",
      "code": "const assert = require('node:assert/strict');\nconst fill = (total, fixed, padding, gap, count) => { assert(Number.isInteger(count) && count > 0); const available = total - fixed - padding * 2 - gap * count; assert(available >= 0); return Array(count).fill(available / count); };\nassert.deepEqual(fill(300, 80, 10, 10, 2), [90, 90]);\nassert.throws(() => fill(50, 80, 10, 10, 2));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "Wrap simplificado conserva cobertura",
      "code": "const assert = require('node:assert/strict');\nconst wrap = (items, width, gap) => { const rows = []; let row = [], used = 0; for (const item of items) {\n    assert(item.w <= width);\n    if (row.length && used + gap + item.w > width) {\n        rows.push(row);\n        row = [];\n        used = 0;\n    }\n    used += (row.length ? gap : 0) + item.w;\n    row.push(item);\n} if (row.length)\n    rows.push(row); return rows; };\nconst items = [{ id: 'a', w: 40 }, { id: 'b', w: 40 }, { id: 'c', w: 30 }];\nassert.deepEqual(wrap(items, 90, 10).map(row => row.map(x => x.id)), [['a', 'b'], ['c']]);\nassert.deepEqual(wrap(items, 90, 10).flat(), items);\nassert.throws(() => wrap([{ id: 'big', w: 91 }], 90, 10));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "Spans e colisão na grade sintética",
      "code": "const assert = require('node:assert/strict');\nconst check = (items, columns) => { const cells = new Set(); for (const item of items) {\n    assert(item.column >= 0 && item.column + item.span <= columns);\n    for (let c = item.column; c < item.column + item.span; c++) {\n        const key = item.row + ':' + c;\n        assert(!cells.has(key));\n        cells.add(key);\n    }\n} };\ncheck([{ row: 0, column: 0, span: 2 }, { row: 0, column: 2, span: 1 }], 3);\nassert.throws(() => check([{ row: 0, column: 2, span: 2 }], 3));\nassert.throws(() => check([{ row: 0, column: 0, span: 2 }, { row: 0, column: 1, span: 1 }], 3));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "Âncora direita no resize",
      "code": "const assert = require('node:assert/strict');\nconst anchor = (rect, oldWidth, newWidth) => { const margin = oldWidth - rect.x - rect.w; return { ...rect, x: newWidth - margin - rect.w }; };\nconst result = anchor({ x: 70, y: 5, w: 20, h: 10 }, 100, 160);\nassert.equal(result.x, 130);\nassert.equal(160 - result.x - result.w, 10);\nassert.notEqual(result.x, 70);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "Clipping diferencia visibilidade",
      "code": "const assert = require('node:assert/strict');\nconst visible = (child, parent) => Math.max(0, Math.min(child.x + child.w, parent.x + parent.w) - Math.max(child.x, parent.x));\nconst parent = { x: 0, w: 100 };\nassert.equal(visible({ x: 20, w: 40 }, parent), 40);\nassert.equal(visible({ x: 80, w: 40 }, parent), 20);\nassert.equal(visible({ x: 120, w: 40 }, parent), 0);\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Escala modular com arredondamento",
      "code": "const assert = require('node:assert/strict');\nconst scale = (base, ratio, count) => { assert(base > 0 && ratio > 1 && count > 0); return Array.from({ length: count }, (_, i) => Math.round(base * ratio ** i)); };\nconst sizes = scale(16, 1.25, 4);\nassert.deepEqual(sizes, [16, 20, 25, 31]);\nassert(sizes.every((x, i) => i === 0 || x > sizes[i - 1]));\nassert.throws(() => scale(16, 1, 4));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Fonte e estilo no manifesto",
      "code": "const assert = require('node:assert/strict');\nconst installed = new Set(['Fixture Sans:Regular', 'Fixture Sans:Bold']);\nconst check = roles => { for (const role of roles)\n    assert(installed.has(role.family + ':' + role.style)); };\ncheck([{ family: 'Fixture Sans', style: 'Regular' }]);\nassert.throws(() => check([{ family: 'Missing Sans', style: 'Bold' }]));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "Quebra por budget de caracteres, sem medir fonte",
      "code": "const assert = require('node:assert/strict');\nconst wrap = (text, limit) => { const lines = []; let line = ''; for (const word of text.split(' ')) {\n    assert(word.length <= limit);\n    if (line && line.length + 1 + word.length > limit) {\n        lines.push(line);\n        line = '';\n    }\n    line += (line ? ' ' : '') + word;\n} if (line)\n    lines.push(line); return lines; };\nassert.deepEqual(wrap('Reserva ainda não confirmada', 12), ['Reserva', 'ainda não', 'confirmada']);\nassert.equal(wrap('Reserva ainda não confirmada', 12).join(' '), 'Reserva ainda não confirmada');\nassert.throws(() => wrap('extraordinariamente', 5));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Texto obrigatório não perde acesso",
      "code": "const assert = require('node:assert/strict');\nconst check = x => { assert(!x.required || !x.truncated || x.fullTextAccessible); return true; };\nassert(check({ required: true, truncated: false, fullTextAccessible: false }));\nassert(check({ required: true, truncated: true, fullTextAccessible: true }));\nassert.throws(() => check({ required: true, truncated: true, fullTextAccessible: false }));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Papéis editoriais têm estilo",
      "code": "const assert = require('node:assert/strict');\nconst styles = new Set(['page-title', 'field-label', 'hint']);\nconst check = roles => { for (const r of roles)\n    assert(styles.has(r.style)); };\ncheck([{ role: 'title', style: 'page-title' }, { role: 'label', style: 'field-label' }]);\nassert.throws(() => check([{ role: 'error', style: 'unknown' }]));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Override com motivo",
      "code": "const assert = require('node:assert/strict');\nconst expected = { size: 16, weight: 400 };\nconst validate = x => { if (x.size !== expected.size || x.weight !== expected.weight)\n    assert(x.reason && x.reason.length > 8); };\nvalidate({ size: 16, weight: 400 });\nvalidate({ size: 18, weight: 600, reason: 'Título contextual revisado' });\nassert.throws(() => validate({ size: 18, weight: 600 }));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "Intl conserva centavos e moeda",
      "code": "const assert = require('node:assert/strict');\nconst format = (cents, locale) => { assert(Number.isInteger(cents) && cents >= 0); return new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).formatToParts(cents / 100); };\nconst parts = format(1299, 'pt-BR');\nassert.equal(parts.find(p => p.type === 'integer').value, '12');\nassert.equal(parts.find(p => p.type === 'fraction').value, '99');\nassert.throws(() => format(-1, 'pt-BR'));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Chaves por locale e fallback aprovado",
      "code": "const assert = require('node:assert/strict');\nconst required = ['confirmed', 'rejected', 'unknown'];\nconst check = locales => { for (const entries of Object.values(locales))\n    assert(required.every(key => typeof entries[key] === 'string' && entries[key])); };\ncheck({ pt: { confirmed: 'Confirmada', rejected: 'Recusada', unknown: 'Consultar resultado' } });\nassert.throws(() => check({ pt: { confirmed: 'Confirmada', rejected: 'Recusada' } }));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Luminância sRGB e razão de contraste",
      "code": "const assert = require('node:assert/strict');\nconst linear = x => { const c = x / 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; };\nconst luminance = rgb => rgb.map(linear).reduce((sum, c, i) => sum + c * [.2126, .7152, .0722][i], 0);\nconst ratio = (a, b) => { const l = [luminance(a), luminance(b)].sort((x, y) => y - x); return (l[0] + .05) / (l[1] + .05); };\nassert.equal(ratio([0, 0, 0], [255, 255, 255]), 21);\nassert(ratio([180, 180, 180], [255, 255, 255]) < 4.5);\nassert.equal(ratio([90, 90, 90], [90, 90, 90]), 1);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Alpha antes da avaliação do par",
      "code": "const assert = require('node:assert/strict');\nconst composite = (fg, bg, alpha) => { assert(alpha >= 0 && alpha <= 1); return fg.map((v, i) => v * alpha + bg[i] * (1 - alpha)); };\nassert.deepEqual(composite([0, 0, 0], [255, 255, 255], .5), [127.5, 127.5, 127.5]);\nassert.deepEqual(composite([0, 0, 0], [255, 255, 255], 1), [0, 0, 0]);\nassert.throws(() => composite([0, 0, 0], [255, 255, 255], 1.1));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "Bounds de stroke em retângulo simples",
      "code": "const assert = require('node:assert/strict');\nconst bounds = (w, h, stroke, align) => { assert(w > 0 && h > 0 && stroke >= 0); assert(['inside', 'center', 'outside'].includes(align)); const extra = align === 'outside' ? stroke : align === 'center' ? stroke / 2 : 0; return { x: -extra, y: -extra, w: w + extra * 2, h: h + extra * 2 }; };\nassert.deepEqual(bounds(20, 10, 2, 'outside'), { x: -2, y: -2, w: 24, h: 14 });\nassert.equal(bounds(20, 10, 2, 'inside').w, 20);\nassert.equal(bounds(20, 10, 2, 'center').w, 22);\nassert.throws(() => bounds(20, 10, 2, 'unknown'));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "Ordem de camadas altera cor composta",
      "code": "const assert = require('node:assert/strict');\nconst over = (top, bottom) => top.color.map((v, i) => v * top.alpha + bottom[i] * (1 - top.alpha));\nconst red = { color: [255, 0, 0], alpha: .5 }, blue = { color: [0, 0, 255], alpha: .5 }, white = [255, 255, 255];\nconst a = over(red, over(blue, white)), b = over(blue, over(red, white));\nassert.deepEqual(a, [191.25, 63.75, 127.5]);\nassert.notDeepEqual(a, b);\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "Booleanos discretos, sem curvas",
      "code": "const assert = require('node:assert/strict');\nconst a = new Set(['0:0', '0:1', '1:0']), b = new Set(['0:1', '1:1']);\nconst union = new Set([...a, ...b]), intersection = new Set([...a].filter(x => b.has(x))), difference = new Set([...a].filter(x => !b.has(x)));\nassert.equal(union.size, 4);\nassert.deepEqual([...intersection], ['0:1']);\nassert.deepEqual([...difference], ['0:0', '1:0']);\nassert(!difference.has('0:1'));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "Normalização uniforme de bounds",
      "code": "const assert = require('node:assert/strict');\nconst normalize = (w, h, box) => { assert(w > 0 && h > 0 && box > 0); const scale = Math.min(box / w, box / h); return { w: w * scale, h: h * scale, scale }; };\nassert.deepEqual(normalize(40, 20, 24), { w: 24, h: 12, scale: .6 });\nassert.equal(normalize(20, 40, 24).h, 24);\nassert.throws(() => normalize(0, 20, 24));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "Cover e contain com proporção conhecida",
      "code": "const assert = require('node:assert/strict');\nconst fit = (image, frame, mode) => { assert(image.w > 0 && image.h > 0); assert(['cover', 'contain'].includes(mode)); const scale = (mode === 'cover' ? Math.max : Math.min)(frame.w / image.w, frame.h / image.h); return { scale, w: image.w * scale, h: image.h * scale, x: (frame.w - image.w * scale) / 2, y: (frame.h - image.h * scale) / 2 }; };\nassert.deepEqual(fit({ w: 200, h: 100 }, { w: 100, h: 100 }, 'cover'), { scale: 1, w: 200, h: 100, x: -50, y: 0 });\nassert.equal(fit({ w: 200, h: 100 }, { w: 100, h: 100 }, 'contain').h, 50);\nassert.throws(() => fit({ w: 0, h: 100 }, { w: 100, h: 100 }, 'cover'));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Asset com origem e dimensão",
      "code": "const assert = require('node:assert/strict');\nconst validate = x => { assert(x.id && x.revision && x.origin && x.licenseRef); assert(x.width > 0 && x.height > 0); };\nconst asset = { id: 'photo', revision: 'r1', origin: 'synthetic-fixture', licenseRef: 'fixture-permission', width: 200, height: 100 };\nvalidate(asset);\nassert.throws(() => validate({ ...asset, licenseRef: null }));\nassert.throws(() => validate({ ...asset, width: 0 }));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "Instance resolve override sem mutar main",
      "code": "const assert = require('node:assert/strict');\nconst main = { id: 'button-main', label: 'Reservar', icon: true };\nconst instance = { mainId: main.id, overrides: { label: 'Consultar' } };\nconst resolve = i => { assert.equal(i.mainId, main.id); return { ...main, ...i.overrides }; };\nassert.equal(resolve(instance).label, 'Consultar');\nassert.equal(main.label, 'Reservar');\nassert.throws(() => resolve({ ...instance, mainId: 'missing' }));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Consumidores ligados à referência",
      "code": "const assert = require('node:assert/strict');\nconst references = new Set(['button-main']);\nconst check = rows => { for (const x of rows) {\n    assert(references.has(x.mainId));\n    assert.equal(x.linked, true);\n} };\ncheck([{ mainId: 'button-main', linked: true }]);\nassert.throws(() => check([{ mainId: 'button-main', linked: false }]));\nassert.throws(() => check([{ mainId: 'missing', linked: true }]));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Matriz de variants sem falta ou duplicata",
      "code": "const assert = require('node:assert/strict');\nconst required = ['small:idle', 'small:focus', 'large:idle', 'large:focus'];\nconst check = rows => { const keys = rows.map(r => r.size + ':' + r.state); assert.equal(new Set(keys).size, keys.length); assert(required.every(key => keys.includes(key))); };\nconst rows = required.map(key => { const [size, state] = key.split(':'); return { size, state }; });\ncheck(rows);\nassert.throws(() => check(rows.slice(1)));\nassert.throws(() => check([...rows, rows[0]]));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Combinação não inventa confirmação",
      "code": "const assert = require('node:assert/strict');\nconst allowed = x => { assert(['idle', 'loading', 'result'].includes(x.visual)); assert(['pending', 'confirmed', 'unknown'].includes(x.domain)); if (x.visual === 'result')\n    assert.equal(x.domain, 'confirmed'); return true; };\nassert(allowed({ visual: 'loading', domain: 'pending' }));\nassert(allowed({ visual: 'result', domain: 'confirmed' }));\nassert.throws(() => allowed({ visual: 'result', domain: 'unknown' }));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Schema didático de component properties",
      "code": "const assert = require('node:assert/strict');\nconst check = p => { assert.equal(typeof p.label, 'string'); assert.equal(typeof p.showIcon, 'boolean'); assert(['primary', 'secondary'].includes(p.intent)); };\ncheck({ label: 'Reservar', showIcon: true, intent: 'primary' });\nassert.throws(() => check({ label: 'Reservar', showIcon: 'false', intent: 'primary' }));\nassert.throws(() => check({ label: 'Reservar', showIcon: false, intent: 'dangerous-unknown' }));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Slot com substitutos permitidos",
      "code": "const assert = require('node:assert/strict');\nconst components = { status: { width: 80 }, icon: { width: 24 }, wideAdmin: { width: 300 } };\nconst allowed = new Set(['status', 'icon']);\nconst swap = id => { assert(allowed.has(id)); assert(components[id].width <= 100); return components[id]; };\nassert.equal(swap('icon').width, 24);\nassert.throws(() => swap('wideAdmin'));\nassert.throws(() => swap('missing'));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Diff de contrato de library",
      "code": "const assert = require('node:assert/strict');\nconst classify = (before, after) => { const breaking = Object.keys(before).filter(key => !Object.hasOwn(after, key) || before[key] !== after[key]); return breaking.length ? 'migration-required' : 'compatible'; };\nassert.equal(classify({ label: 'string', disabled: 'boolean' }, { label: 'string', disabled: 'boolean', icon: 'reference' }), 'compatible');\nassert.equal(classify({ label: 'string', disabled: 'boolean' }, { label: 'string' }), 'migration-required');\nassert.equal(classify({ disabled: 'boolean' }, { disabled: 'enum' }), 'migration-required');\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Depreciação sem ciclo ou substituto ausente",
      "code": "const assert = require('node:assert/strict');\nconst check = (map, existing) => { for (const origin of Object.keys(map)) {\n    const seen = new Set();\n    let id = origin;\n    while (map[id]) {\n        assert(!seen.has(id));\n        seen.add(id);\n        id = map[id];\n        assert(existing.has(id));\n    }\n} };\ncheck({ old: 'new' }, new Set(['old', 'new']));\nassert.throws(() => check({ old: 'missing' }, new Set(['old'])));\nassert.throws(() => check({ a: 'b', b: 'a' }, new Set(['a', 'b'])));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "Alias compatível e sem ciclo",
      "code": "const assert = require('node:assert/strict');\nconst resolve = (id, vars, seen = new Set()) => { assert(!seen.has(id)); seen.add(id); const v = vars[id]; assert(v); if (v.alias) {\n    assert.equal(vars[v.alias]?.type, v.type);\n    return resolve(v.alias, vars, seen);\n} return v.value; };\nassert.equal(resolve('text', { text: { type: 'color', alias: 'ink' }, ink: { type: 'color', value: '#141c26' } }), '#141c26');\nassert.throws(() => resolve('x', { x: { type: 'color', alias: 'n' }, n: { type: 'number', value: 8 } }));\nassert.throws(() => resolve('a', { a: { type: 'number', alias: 'b' }, b: { type: 'number', alias: 'a' } }));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Collection com modos e unidades",
      "code": "const assert = require('node:assert/strict');\nconst validate = vars => { assert.equal(new Set(vars.map(v => v.id)).size, vars.length); for (const v of vars) {\n    assert(Object.hasOwn(v.values, 'default'));\n    if (v.type === 'number')\n        assert(v.unit);\n} };\nvalidate([{ id: 'gap', type: 'number', unit: 'px', values: { default: 8 } }]);\nassert.throws(() => validate([{ id: 'gap', type: 'number', values: { default: 8 } }]));\nassert.throws(() => validate([{ id: 'color', type: 'color', values: {} }]));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "Herança e override explícito de modo",
      "code": "const assert = require('node:assert/strict');\nconst effective = (node, inherited) => node.mode === 'auto' ? inherited : node.mode;\nassert.equal(effective({ mode: 'auto' }, 'dark'), 'dark');\nassert.equal(effective({ mode: 'light' }, 'dark'), 'light');\nassert.notEqual(effective({ mode: 'light' }, 'dark'), effective({ mode: 'auto' }, 'dark'));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Coverage por tema e troca de default",
      "code": "const assert = require('node:assert/strict');\nconst check = tokens => { for (const v of Object.values(tokens))\n    assert(v.light && v.dark); };\ncheck({ text: { light: '#141c26', dark: '#ffffff' } });\nassert.throws(() => check({ text: { light: '#141c26' } }));\nlet defaultMode = 'light';\nconst resolve = choice => choice === 'auto' ? defaultMode : choice;\nassert.equal(resolve('auto'), 'light');\ndefaultMode = 'dark';\nassert.equal(resolve('auto'), 'dark');\nassert.equal(resolve('light'), 'light');\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Binding compatível por tipo e unidade",
      "code": "const assert = require('node:assert/strict');\nconst bind = (token, property) => { assert.equal(token.type, property.type); assert.equal(token.unit, property.unit); return token.id; };\nassert.equal(bind({ id: 'gap', type: 'number', unit: 'px' }, { type: 'number', unit: 'px' }), 'gap');\nassert.throws(() => bind({ id: 'duration', type: 'number', unit: 'ms' }, { type: 'number', unit: 'px' }));\nassert.throws(() => bind({ id: 'color', type: 'color' }, { type: 'number', unit: 'px' }));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Valor literal não comprova binding",
      "code": "const assert = require('node:assert/strict');\nconst validate = x => { assert(x.bindingId || x.exceptionReason); };\nvalidate({ value: '#141c26', bindingId: 'text-primary' });\nvalidate({ value: '#141c26', exceptionReason: 'Marca externa fixa' });\nassert.throws(() => validate({ value: '#141c26' }));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "Tokens para CSS com unidade e colisão",
      "code": "const assert = require('node:assert/strict');\nconst css = rows => { const seen = new Set(); return rows.map(r => { const key = r.name.toLowerCase().replace(/[\\s/]+/g, '-'); assert(!seen.has(key)); seen.add(key); assert(['px', 'unitless'].includes(r.unit)); return '--' + key + ': ' + r.value + (r.unit === 'px' ? 'px' : '') + ';'; }).join('\\n'); };\nassert.equal(css([{ name: 'space/gap', value: 8, unit: 'px' }, { name: 'opacity', value: .5, unit: 'unitless' }]), '--space-gap: 8px;\\n--opacity: 0.5;');\nassert.throws(() => css([{ name: 'a/b', value: 1, unit: 'px' }, { name: 'a-b', value: 2, unit: 'px' }]));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Migração cobre consumidores antigos",
      "code": "const assert = require('node:assert/strict');\nconst verify = (used, mapping, current) => { for (const old of used) {\n    const target = mapping[old] ?? old;\n    assert(current.has(target));\n} };\nverify(['text-old', 'gap'], { 'text-old': 'text-primary' }, new Set(['text-primary', 'gap']));\nassert.throws(() => verify(['text-old'], {}, new Set(['text-primary'])));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Grafo de flow com entrada e destinos",
      "code": "const assert = require('node:assert/strict');\nconst check = (nodes, edges, start) => { const ids = new Set(nodes); assert(ids.has(start)); for (const edge of edges)\n    assert(ids.has(edge.from) && ids.has(edge.to)); };\ncheck(['list', 'result'], [{ from: 'list', to: 'result' }], 'list');\nassert.throws(() => check(['list'], [{ from: 'list', to: 'removed' }], 'list'));\nassert.throws(() => check(['list'], [], 'unknown'));\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "Navegação só confirma com decisão",
      "code": "const assert = require('node:assert/strict');\nconst next = (state, event) => { if (event === 'submit')\n    return 'loading'; if (state === 'loading' && event === 'decision-confirmed')\n    return 'success'; if (state === 'loading' && event === 'decision-rejected')\n    return 'rejected'; throw new Error('transition unavailable'); };\nassert.equal(next('list', 'submit'), 'loading');\nassert.equal(next('loading', 'decision-confirmed'), 'success');\nassert.throws(() => next('list', 'decision-confirmed'));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "Pilha de overlays conserva contexto",
      "code": "const assert = require('node:assert/strict');\nconst stack = ['page'];\nconst open = id => stack.push(id);\nconst close = () => { assert(stack.length > 1); return stack.pop(); };\nopen('dialog');\nopen('help');\nassert.equal(close(), 'help');\nassert.equal(stack.at(-1), 'dialog');\nassert.equal(close(), 'dialog');\nassert.equal(stack.at(-1), 'page');\nassert.throws(close);\n"
    },
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "Alvo visível após scroll",
      "code": "const assert = require('node:assert/strict');\nconst visible = (target, scroll, viewport, content) => { assert(scroll >= 0 && scroll <= content - viewport); return target.top >= scroll && target.bottom <= scroll + viewport; };\nassert(visible({ top: 180, bottom: 200 }, 120, 100, 300));\nassert(!visible({ top: 180, bottom: 200 }, 0, 100, 300));\nassert.throws(() => visible({ top: 180, bottom: 200 }, 250, 100, 300));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "Controle com tabela de transições",
      "code": "const assert = require('node:assert/strict');\nconst transitions = { idle: { focus: 'focused', hover: 'hovered' }, focused: { blur: 'idle', press: 'pressed' }, hovered: { leave: 'idle', press: 'pressed' }, pressed: { release: 'idle' } };\nconst step = (state, event) => { const out = transitions[state]?.[event]; assert(out); return out; };\nassert.equal(step(step('idle', 'focus'), 'press'), 'pressed');\nassert.equal(step('pressed', 'release'), 'idle');\nassert.throws(() => step('idle', 'release'));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "Interpolação e movimento reduzido",
      "code": "const assert = require('node:assert/strict');\nconst interpolate = (a, b, t) => { assert(t >= 0 && t <= 1); return a + (b - a) * t; };\nassert.equal(interpolate(10, 30, 0), 10);\nassert.equal(interpolate(10, 30, .5), 20);\nassert.equal(interpolate(10, 30, 1), 30);\nassert.throws(() => interpolate(10, 30, 1.1));\nconst duration = reduced => reduced ? 0 : 200;\nassert.equal(duration(true), 0);\nassert.equal(duration(false), 200);\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "Reserva simulada exige evento confirmado",
      "code": "const assert = require('node:assert/strict');\nconst apply = (state, event) => { if (event === 'submit' && state === 'draft')\n    return 'sending'; if (event === 'confirmed' && state === 'sending')\n    return 'confirmed'; if (event === 'timeout' && state === 'sending')\n    return 'unknown'; throw new Error('invalid event'); };\nassert.equal(apply('draft', 'submit'), 'sending');\nassert.equal(apply('sending', 'timeout'), 'unknown');\nassert.throws(() => apply('draft', 'confirmed'));\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "Reset e limite de simulação",
      "code": "const assert = require('node:assert/strict');\nconst initial = () => ({ quantity: 1, steps: 0, status: 'draft' });\nlet state = initial();\nstate.quantity = 3;\nstate.steps = 4;\nconst reset = () => state = initial();\nreset();\nassert.deepEqual(state, { quantity: 1, steps: 0, status: 'draft' });\nconst step = () => { state.steps++; assert(state.steps <= 3); };\nstep();\nstep();\nstep();\nassert.throws(step);\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "Colunas por mínimo, gap e padding",
      "code": "const assert = require('node:assert/strict');\nconst columns = (width, min, gap, padding) => { assert(width > 0 && min > 0 && gap >= 0 && padding >= 0); const available = width - padding * 2; assert(available >= min); return Math.floor((available + gap) / (min + gap)); };\nassert.equal(columns(430, 200, 10, 10), 2);\nassert.equal(columns(429, 200, 10, 10), 1);\nassert.throws(() => columns(100, 200, 10, 10));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Matriz de viewports e conteúdos",
      "code": "const assert = require('node:assert/strict');\nconst required = [['narrow', 'normal'], ['narrow', 'long'], ['wide', 'normal'], ['wide', 'long']];\nconst coverage = rows => assert(required.every(([viewport, content]) => rows.some(r => r.viewport === viewport && r.content === content)));\nconst rows = required.map(([viewport, content]) => ({ viewport, content }));\ncoverage(rows);\nassert.throws(() => coverage(rows.slice(1)));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Sequência de foco do contrato",
      "code": "const assert = require('node:assert/strict');\nconst essential = ['resource', 'quantity', 'submit'];\nconst validate = sequence => { assert.equal(new Set(sequence).size, sequence.length); assert(essential.every(id => sequence.includes(id))); assert(sequence.every(id => essential.includes(id))); };\nvalidate(['resource', 'quantity', 'submit']);\nassert.throws(() => validate(['resource', 'submit']));\nassert.throws(() => validate(['resource', 'quantity', 'submit', 'submit']));\nassert.throws(() => validate(['resource', 'quantity', 'submit', 'missing']));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "Policy de alvo 44, distinta do ícone",
      "code": "const assert = require('node:assert/strict');\nconst check = control => { assert(control.target.w >= 44 && control.target.h >= 44); assert(control.icon.w <= control.target.w && control.icon.h <= control.target.h); };\ncheck({ target: { w: 44, h: 44 }, icon: { w: 16, h: 16 } });\nassert.throws(() => check({ target: { w: 16, h: 16 }, icon: { w: 16, h: 16 } }));\nassert.throws(() => check({ target: { w: 44, h: 44 }, icon: { w: 50, h: 16 } }));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "Mensagem conserva desconhecido e consulta",
      "code": "const assert = require('node:assert/strict');\nconst messages = { confirmed: { text: 'Reserva confirmada', action: 'view' }, rejected: { text: 'Sem vaga para este pedido', action: 'choose-another' }, unknown: { text: 'Resultado ainda não conhecido', action: 'query' } };\nconst present = x => { assert(x.commandId); assert(messages[x.state]); return { ...messages[x.state], commandId: x.commandId }; };\nassert.equal(present({ state: 'unknown', commandId: 'c1' }).action, 'query');\nassert.notEqual(present({ state: 'unknown', commandId: 'c1' }).text, messages.confirmed.text);\nassert.throws(() => present({ state: 'invented', commandId: 'c1' }));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Semântica e resultado não divergem",
      "code": "const assert = require('node:assert/strict');\nconst validate = x => { assert(['button', 'link'].includes(x.role)); if (x.role === 'link')\n    assert(x.href); if (x.label === 'Confirmada')\n    assert.equal(x.decision, 'confirmed'); };\nvalidate({ role: 'button', label: 'Consultar', decision: 'unknown' });\nassert.throws(() => validate({ role: 'button', label: 'Confirmada', decision: 'unknown' }));\nassert.throws(() => validate({ role: 'link', label: 'Ver reserva' }));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Claim de auditoria tem fonte e método",
      "code": "const assert = require('node:assert/strict');\nconst check = rows => { for (const r of rows)\n    assert(r.criterion && r.method && r.population && r.revision && r.evidence); };\ncheck([{ criterion: 'contrast-fixture', method: 'calculation', population: 'pair-1', revision: 'r1', evidence: 'digest-1' }]);\nassert.throws(() => check([{ criterion: 'accessible', method: 'looks-good', population: 'all', revision: 'r1' }]));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Resumo conserva falha e pendência",
      "code": "const assert = require('node:assert/strict');\nconst summarize = rows => { const counts = { passed: 0, failed: 0, pending: 0 }; for (const state of rows) {\n    assert(Object.hasOwn(counts, state));\n    counts[state]++;\n} return { ...counts, total: rows.length }; };\nassert.deepEqual(summarize(['passed', 'passed', 'passed', 'failed', 'pending']), { passed: 3, failed: 1, pending: 1, total: 5 });\nassert.throws(() => summarize(['assumed-passed']));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Roles de fixture, sem sharing real",
      "code": "const assert = require('node:assert/strict');\nconst rights = { viewer: ['read'], commenter: ['read', 'comment'], editor: ['read', 'comment', 'edit'] };\nconst can = (role, action) => rights[role]?.includes(action) ?? false;\nassert(can('viewer', 'read'));\nassert(!can('viewer', 'edit'));\nassert(can('editor', 'edit'));\nassert(!can('unknown', 'read'));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "Handoff projetado e dependência acessível",
      "code": "const assert = require('node:assert/strict');\nconst project = x => ({ file: x.file, revision: x.revision, owner: x.owner });\nconst input = { file: 'f1', revision: 'r1', owner: 'design-team', token: 'public-fixture-secret' };\nconst out = project(input);\nassert(!JSON.stringify(out).includes(input.token));\nconst check = deps => assert(deps.every(d => d.accessible));\ncheck([{ id: 'file', accessible: true }]);\nassert.throws(() => check([{ id: 'file', accessible: true }, { id: 'library', accessible: false }]));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Decisão com motivo e revisão",
      "code": "const assert = require('node:assert/strict');\nconst check = x => { for (const key of ['node', 'revision', 'reason', 'owner', 'criterion'])\n    assert(typeof x[key] === 'string' && x[key]); };\ncheck({ node: 'n1', revision: 'r2', reason: 'Preservar estado desconhecido', owner: 'content-team', criterion: 'domain-state' });\nassert.throws(() => check({ node: 'n1', revision: 'r2', reason: 'looks-good', criterion: 'appearance' }));\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "Achado só verificado com evidência",
      "code": "const assert = require('node:assert/strict');\nconst transition = (finding, next) => { assert(['open', 'implemented', 'verified'].includes(next)); if (next === 'verified') {\n    assert.equal(finding.status, 'implemented');\n    assert(finding.evidence && finding.revision === finding.evidenceRevision);\n} return { ...finding, status: next }; };\nassert.equal(transition({ status: 'implemented', evidence: 'trace-1', revision: 'r2', evidenceRevision: 'r2' }, 'verified').status, 'verified');\nassert.throws(() => transition({ status: 'open' }, 'verified'));\nassert.throws(() => transition({ status: 'implemented', evidence: 'trace', revision: 'r2', evidenceRevision: 'r1' }, 'verified'));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Diff destaca remoção e propriedade",
      "code": "const assert = require('node:assert/strict');\nconst diff = (a, b) => Object.keys(a).filter(key => !Object.hasOwn(b, key) || a[key] !== b[key]);\nassert.deepEqual(diff({ label: 'Enviar', gap: 8 }, { label: 'Consultar', gap: 8 }), ['label']);\nassert.deepEqual(diff({ label: 'Enviar', state: 'unknown' }, { label: 'Enviar' }), ['state']);\nassert.deepEqual(diff({ gap: 8 }, { gap: 8 }), []);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "Merge simplificado de três vias",
      "code": "const assert = require('node:assert/strict');\nconst merge = (base, left, right) => { const out = {}; for (const key of new Set([...Object.keys(base), ...Object.keys(left), ...Object.keys(right)])) {\n    const l = left[key], r = right[key], b = base[key];\n    assert(l === r || l === b || r === b);\n    const value = l === b ? r : l;\n    if (value !== undefined)\n        out[key] = value;\n} return out; };\nassert.deepEqual(merge({ label: 'A', gap: 8 }, { label: 'B', gap: 8 }, { label: 'A', gap: 10 }), { label: 'B', gap: 10 });\nassert.deepEqual(merge({ label: 'A' }, { label: 'B' }, { label: 'B' }), { label: 'B' });\nassert.throws(() => merge({ label: 'A' }, { label: 'B' }, { label: 'C' }));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "Naming detecta colisão de normalização",
      "code": "const assert = require('node:assert/strict');\nconst names = rows => { const map = new Map(); for (const row of rows) {\n    const normalized = row.name.normalize('NFC').toLowerCase().replace(/[\\s/]+/g, '-');\n    assert(!map.has(normalized));\n    map.set(normalized, row.id);\n} return map; };\nassert.equal(names([{ id: 'a', name: 'Card / Result' }]).get('card-result'), 'a');\nassert.throws(() => names([{ id: 'a', name: 'Ações/Primary' }, { id: 'b', name: 'Ações-Primary' }]));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Referência vigente não usa objeto arquivado",
      "code": "const assert = require('node:assert/strict');\nconst catalog = new Map([['live', { archived: false }], ['old', { archived: true }]]);\nconst check = refs => { for (const id of refs) {\n    const x = catalog.get(id);\n    assert(x && !x.archived);\n} };\ncheck(['live']);\nassert.throws(() => check(['old']));\nassert.throws(() => check(['missing']));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Contrato de implementação completo",
      "code": "const assert = require('node:assert/strict');\nconst check = x => { assert(x.layout && x.tokens && x.semantics && x.extremeContent); assert(['loading', 'confirmed', 'rejected', 'unknown'].every(s => x.states.includes(s))); };\nconst spec = { layout: 'column', tokens: ['gap'], semantics: 'button-and-status', extremeContent: 'long-label', states: ['loading', 'confirmed', 'rejected', 'unknown'] };\ncheck(spec);\nassert.throws(() => check({ ...spec, extremeContent: null }));\nassert.throws(() => check({ ...spec, states: ['confirmed'] }));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "Tolerância por medida declarada",
      "code": "const assert = require('node:assert/strict');\nconst compare = (expected, actual, tolerances) => { for (const key of Object.keys(expected))\n    assert(Math.abs(expected[key] - actual[key]) <= tolerances[key]); };\ncompare({ padding: 16, gap: 8 }, { padding: 16.2, gap: 8 }, { padding: .5, gap: 0 });\nassert.throws(() => compare({ padding: 16 }, { padding: 24 }, { padding: .5 }));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Policy de prontidão com owner e evidência",
      "code": "const assert = require('node:assert/strict');\nconst ready = x => { assert(x.owner && x.revision); for (const gate of ['contract', 'content', 'dependencies'])\n    assert.equal(x.gates[gate], 'verified'); return true; };\nconst pack = { owner: 'design-team', revision: 'r1', gates: { contract: 'verified', content: 'verified', dependencies: 'verified' } };\nassert(ready(pack));\nassert.throws(() => ready({ ...pack, gates: { ...pack.gates, dependencies: 'pending' } }));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Revisão mudou depois de aprovação",
      "code": "const assert = require('node:assert/strict');\nconst crypto = require('node:crypto');\nconst digest = x => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');\nconst candidate = { node: 'n1', message: 'Consultar resultado' };\nconst approved = digest(candidate);\nconst verify = x => assert.equal(digest(x), approved);\nverify(candidate);\nassert.throws(() => verify({ ...candidate, message: 'Confirmada' }));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "Props de design mapeadas para código",
      "code": "const assert = require('node:assert/strict');\nconst map = x => { assert(['Small', 'Large'].includes(x.Size)); assert.equal(typeof x.Disabled, 'boolean'); assert.equal(typeof x.Label, 'string'); return { size: x.Size === 'Small' ? 'sm' : 'lg', disabled: x.Disabled, children: x.Label }; };\nassert.deepEqual(map({ Size: 'Small', Disabled: false, Label: 'Reservar' }), { size: 'sm', disabled: false, children: 'Reservar' });\nassert.throws(() => map({ Size: 'Small', Disabled: 'false', Label: 'Reservar' }));\nassert.throws(() => map({ Size: 'Huge', Disabled: false, Label: 'Reservar' }));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Import e export em catálogo declarado",
      "code": "const assert = require('node:assert/strict');\nconst catalog = { 'components/Button': { exports: ['Button'], version: 2 } };\nconst check = x => { const module = catalog[x.module]; assert(module && module.exports.includes(x.export) && module.version === x.version); };\ncheck({ module: 'components/Button', export: 'Button', version: 2 });\nassert.throws(() => check({ module: 'components/Removed', export: 'Button', version: 2 }));\nassert.throws(() => check({ module: 'components/Button', export: 'Button', version: 1 }));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-geometry",
      "purpose": "QA de bounds por eixo",
      "code": "const assert = require('node:assert/strict');\nconst check = (a, b, tolerance) => { for (const key of ['x', 'y', 'w', 'h'])\n    assert(Number.isFinite(b[key]) && Math.abs(a[key] - b[key]) <= tolerance[key]); };\nconst baseline = { x: 10, y: 20, w: 100, h: 40 };\ncheck(baseline, { x: 10.2, y: 20, w: 100, h: 40 }, { x: .5, y: .5, w: 1, h: 1 });\nassert.throws(() => check(baseline, { ...baseline, w: 90 }, { x: .5, y: .5, w: 1, h: 1 }));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Diff de pixels sintéticos, sem screenshots",
      "code": "const assert = require('node:assert/strict');\nconst diff = (a, b) => { assert.equal(a.length, b.length); assert(a.length > 0); return a.reduce((sum, p, i) => sum + Math.abs(p - b[i]), 0) / a.length; };\nassert.equal(diff([0, 100, 255], [0, 100, 255]), 0);\nassert.equal(diff([0, 100, 255], [0, 90, 255]), 10 / 3);\nassert.throws(() => diff([0, 100], [0]));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "Serializer SVG restrito, sem sanitização arbitrária",
      "code": "const assert = require('node:assert/strict');\nconst escape = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&apos;');\nconst svg = (w, h, text) => { assert(Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0); return '<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 ' + w + ' ' + h + '\"><rect width=\"' + w + '\" height=\"' + h + '\" fill=\"#fff\"/><text x=\"4\" y=\"16\">' + escape(text) + '</text></svg>'; };\nconst artifact = svg(100, 24, 'A & <B>');\nassert(artifact.includes('viewBox=\"0 0 100 24\"'));\nassert(artifact.includes('A &amp; &lt;B&gt;'));\nassert(!artifact.includes('<B>'));\nassert.throws(() => svg(0, 24, 'A'));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Digest de bytes do export de fixture",
      "code": "const assert = require('node:assert/strict');\nconst crypto = require('node:crypto');\nconst hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');\nconst bytes = Buffer.from('<svg viewBox=\"0 0 24 24\"></svg>');\nconst manifest = { format: 'svg', revision: 'r1', length: bytes.length, digest: hash(bytes) };\nconst check = data => { assert.equal(data.length, manifest.length); assert.equal(hash(data), manifest.digest); };\ncheck(Buffer.from(bytes));\nassert.throws(() => check(Buffer.from('<svg viewBox=\"0 0 25 24\"></svg>')));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Plano de mutation com pré-condição",
      "code": "const assert = require('node:assert/strict');\nconst nodes = new Map([['n1', { type: 'TEXT', value: 'A' }]]);\nconst validate = plan => { for (const step of plan) {\n    const node = nodes.get(step.id);\n    assert(node && node.type === step.type);\n    assert.equal(node.value, step.expectedValue);\n    assert.equal(typeof step.newValue, 'string');\n} };\nvalidate([{ id: 'n1', type: 'TEXT', expectedValue: 'A', newValue: 'B' }]);\nassert.throws(() => validate([{ id: 'n2', type: 'TEXT', expectedValue: 'A', newValue: 'B' }]));\nassert.throws(() => validate([{ id: 'n1', type: 'TEXT', expectedValue: 'old', newValue: 'B' }]));\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "Fontes declaradas antes de mutation",
      "code": "const assert = require('node:assert/strict');\nconst loaded = new Set(['Fixture Sans:Regular']);\nconst validate = fonts => assert(fonts.every(font => loaded.has(font)));\nvalidate(['Fixture Sans:Regular']);\nassert.throws(() => validate(['Fixture Sans:Regular', 'Fixture Sans:Bold']));\nloaded.add('Fixture Sans:Bold');\nvalidate(['Fixture Sans:Regular', 'Fixture Sans:Bold']);\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "Cursor e budget de transcript paginado",
      "code": "const assert = require('node:assert/strict');\nconst pages = { start: { ids: ['n1'], next: 'b' }, b: { ids: ['n2'], next: null } };\nconst walk = (source, budget) => { let cursor = 'start', calls = 0; const seen = new Set(), ids = []; while (cursor) {\n    assert(++calls <= budget);\n    assert(!seen.has(cursor));\n    seen.add(cursor);\n    const page = source[cursor];\n    assert(page);\n    ids.push(...page.ids);\n    cursor = page.next;\n} return ids; };\nassert.deepEqual(walk(pages, 2), ['n1', 'n2']);\nassert.throws(() => walk(pages, 1));\nassert.throws(() => walk({ start: { ids: [], next: 'start' } }, 3));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "429 e deadline sem retry de 401",
      "code": "const assert = require('node:assert/strict');\nconst policy = (response, elapsed, deadline) => { if (response.status === 401)\n    return 'refuse'; if (response.status === 429) {\n    assert(response.retryAfter >= 0);\n    return elapsed + response.retryAfter <= deadline ? 'wait' : 'stop';\n} return response.status === 200 ? 'accept' : 'investigate'; };\nassert.equal(policy({ status: 429, retryAfter: 2 }, 1, 5), 'wait');\nassert.equal(policy({ status: 429, retryAfter: 5 }, 1, 5), 'stop');\nassert.equal(policy({ status: 401 }, 0, 5), 'refuse');\nassert.throws(() => policy({ status: 429, retryAfter: -1 }, 0, 5));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Proposta não inventa sistema",
      "code": "const assert = require('node:assert/strict');\nconst components = new Set(['Card', 'Button', 'Result']);\nconst tokens = new Set(['text-primary', 'surface']);\nconst check = x => { assert(components.has(x.component)); assert(x.tokens.every(t => tokens.has(t))); assert(['pending', 'confirmed', 'rejected', 'unknown'].includes(x.state)); };\ncheck({ component: 'Result', tokens: ['text-primary'], state: 'unknown' });\nassert.throws(() => check({ component: 'Invented', tokens: ['text-primary'], state: 'unknown' }));\nassert.throws(() => check({ component: 'Result', tokens: ['invented'], state: 'unknown' }));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Review vincula plano e quantidade de alvos",
      "code": "const assert = require('node:assert/strict');\nconst crypto = require('node:crypto');\nconst hash = x => crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');\nconst plan = { destination: 'f1', targets: ['n1'], changes: { label: 'Consultar' } };\nconst approval = { digest: hash(plan), count: 1 };\nconst validate = x => { assert.equal(hash(x), approval.digest); assert.equal(x.targets.length, approval.count); };\nvalidate(plan);\nassert.throws(() => validate({ ...plan, targets: ['n1', 'n2'] }));\nassert.throws(() => validate({ ...plan, changes: { label: 'Confirmada' } }));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Manifest de sistema cobre estados e referências",
      "code": "const assert = require('node:assert/strict');\nconst check = system => { assert(system.components.includes('Result')); assert(system.tokens.includes('text-primary')); assert(['loading', 'confirmed', 'rejected', 'unknown'].every(s => system.resultStates.includes(s))); };\nconst system = { components: ['Card', 'Button', 'Result'], tokens: ['text-primary'], resultStates: ['loading', 'confirmed', 'rejected', 'unknown'] };\ncheck(system);\nassert.throws(() => check({ ...system, resultStates: ['confirmed', 'rejected'] }));\nassert.throws(() => check({ ...system, components: ['Card', 'Button'] }));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-transform",
      "purpose": "Dados de reserva viram conteúdo coerente",
      "code": "const assert = require('node:assert/strict');\nconst project = x => { assert(Number.isInteger(x.quantity) && x.quantity > 0); assert(Number.isInteger(x.cents) && x.cents >= 0); assert(['available', 'unavailable'].includes(x.state)); return { name: x.name || 'Recurso sem nome', quantity: x.quantity, amount: x.cents / 100, state: x.state }; };\nassert.deepEqual(project({ name: 'Recurso de fixture muito longo', quantity: 1, cents: 1299, state: 'available' }), { name: 'Recurso de fixture muito longo', quantity: 1, amount: 12.99, state: 'available' });\nassert.equal(project({ quantity: 1, cents: 0, state: 'unavailable' }).name, 'Recurso sem nome');\nassert.throws(() => project({ quantity: 0, cents: 1299, state: 'available' }));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "Última vaga serial e mensagens distintas",
      "code": "const assert = require('node:assert/strict');\nlet capacity = 1;\nconst decide = () => capacity > 0 ? (capacity--, 'confirmed') : 'rejected';\nconst messages = { confirmed: 'Reserva confirmada', rejected: 'Sem vaga' };\nconst states = [decide(), decide()];\nassert.deepEqual(states, ['confirmed', 'rejected']);\nassert.deepEqual(states.map(s => messages[s]), ['Reserva confirmada', 'Sem vaga']);\nassert.equal(capacity, 0);\n"
    },
    {
      "lang": "javascript",
      "scope": "model",
      "purpose": "Replay, fingerprint e desconhecido",
      "code": "const assert = require('node:assert/strict');\nconst ledger = new Map();\nconst submit = (id, quantity) => { if (ledger.has(id)) {\n    assert.equal(ledger.get(id).quantity, quantity);\n    return ledger.get(id).state;\n} ledger.set(id, { quantity, state: 'unknown' }); return 'unknown'; };\nassert.equal(submit('c1', 1), 'unknown');\nassert.equal(submit('c1', 1), 'unknown');\nassert.equal(ledger.size, 1);\nassert.throws(() => submit('c1', 2));\nconst action = state => state === 'unknown' ? 'query-original-command' : 'view-result';\nassert.equal(action(submit('c1', 1)), 'query-original-command');\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Pacote de handoff com contratos e dependências",
      "code": "const assert = require('node:assert/strict');\nconst check = x => { assert(x.file && x.node && x.revision && x.owner); assert(x.components.length && x.tokens.length && x.assets.length); assert(x.criteria.every(c => c.method && c.expected)); assert(x.dependencies.every(d => d.reference)); };\nconst pack = { file: 'f1', node: 'n1', revision: 'r1', owner: 'team', components: ['Button'], tokens: ['gap'], assets: ['icon'], criteria: [{ method: 'fixture', expected: 'unknown preserved' }], dependencies: [{ reference: 'library-1' }] };\ncheck(pack);\nassert.throws(() => check({ ...pack, revision: null }));\nassert.throws(() => check({ ...pack, dependencies: [{}] }));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Digest e gates conservam pendências",
      "code": "const assert = require('node:assert/strict');\nconst accept = x => { assert.equal(x.digest, x.reviewedDigest); assert(x.gates.every(g => ['Verified', 'Failed', 'Pending'].includes(g))); return x.gates.every(g => g === 'Verified') ? 'complete' : 'limited'; };\nassert.equal(accept({ digest: 'd1', reviewedDigest: 'd1', gates: ['Verified', 'Pending'] }), 'limited');\nassert.equal(accept({ digest: 'd1', reviewedDigest: 'd1', gates: ['Verified'] }), 'complete');\nassert.throws(() => accept({ digest: 'd2', reviewedDigest: 'd1', gates: ['Verified'] }));\n"
    }
  ],
  [
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Mutantes de identidade e estado detectados",
      "code": "const assert = require('node:assert/strict');\nconst oracle = (input, output) => { assert.equal(output.commandId, input.commandId); assert.equal(output.state, input.decision); };\nconst input = { commandId: 'c1', decision: 'unknown' };\noracle(input, { commandId: 'c1', state: 'unknown' });\nassert.throws(() => oracle(input, { commandId: 'c2', state: 'unknown' }));\nassert.throws(() => oracle(input, { commandId: 'c1', state: 'confirmed' }));\n"
    },
    {
      "lang": "javascript",
      "scope": "local-rule",
      "purpose": "Banca operacional exige gates obrigatórios",
      "code": "const assert = require('node:assert/strict');\nconst conclude = report => { const required = ['native-editor', 'runtime', 'human-task']; assert(required.every(name => Object.hasOwn(report, name))); return required.every(name => report[name] === 'Verified') ? 'operationally-complete' : 'operationally-pending'; };\nassert.equal(conclude({ 'native-editor': 'Pending', runtime: 'Pending', 'human-task': 'Pending' }), 'operationally-pending');\nassert.equal(conclude({ 'native-editor': 'Verified', runtime: 'Verified', 'human-task': 'Verified' }), 'operationally-complete');\nassert.throws(() => conclude({ runtime: 'Verified' }));\n"
    }
  ]
];
if (PAIRS.length !== 48) throw new Error("Figma: corpus incompleto");
export const FIGMA_EXAMPLES: Record<string,[FigmaExample,FigmaExample]> = Object.fromEntries(FIGMA_CURRICULUM.flatMap(chapter=>chapter.sections).map((title,index)=>[title,PAIRS[index]]));

