/**
 * Custom DocumentSymbolProviders + cursor-position symbol path resolver.
 * Supports JS/TS (via typescript worker), Python, Markdown, HTML, CSS (via regex).
 */

const localProviders = {};
let registered = false;

function rangeOf(startLine, startCol, endLine, endCol) {
  return {
    startLineNumber: startLine,
    startColumn: startCol,
    endLineNumber: endLine,
    endColumn: endCol,
  };
}

// ────────── Python ──────────
function pythonProvider(monaco, model) {
  const lines = model.getLinesContent();
  const total = lines.length;
  const result = [];
  const stack = [];

  lines.forEach((raw, i) => {
    const line = i + 1;
    const indent = raw.match(/^\s*/)[0].length;
    const m = raw.match(/^\s*(async\s+def|def|class)\s+([A-Za-z_]\w*)/);
    if (!m) return;
    const isClass = m[1] === "class";
    const node = {
      name: m[2],
      kind: isClass
        ? monaco.languages.SymbolKind.Class
        : monaco.languages.SymbolKind.Function,
      range: rangeOf(line, 1, total, raw.length + 1),
      selectionRange: rangeOf(line, 1, line, raw.length + 1),
      children: [],
    };
    while (stack.length && stack[stack.length - 1].indent >= indent) {
      const popped = stack.pop();
      popped.node.range.endLineNumber = line - 1;
    }
    if (stack.length) stack[stack.length - 1].node.children.push(node);
    else result.push(node);
    stack.push({ indent, node });
  });
  return result;
}

// ────────── JSON ──────────
function jsonProvider(monaco, model) {
  const lines = model.getLinesContent();
  const total = lines.length;
  const result = [];
  const stack = [];

  lines.forEach((raw, i) => {
    const line = i + 1;
    const indent = raw.match(/^\s*/)[0].length;
    const m = raw.match(/^\s*"([^"]+)"\s*:/);
    if (!m) return;
    const node = {
      name: m[1],
      kind: monaco.languages.SymbolKind.Property,
      range: rangeOf(line, 1, total, raw.length + 1),
      selectionRange: rangeOf(line, 1, line, raw.length + 1),
      children: [],
    };
    while (stack.length && stack[stack.length - 1].indent >= indent) {
      const popped = stack.pop();
      popped.node.range.endLineNumber = line - 1;
    }
    if (stack.length) stack[stack.length - 1].node.children.push(node);
    else result.push(node);
    stack.push({ indent, node });
  });
  return result;
}

// ────────── YAML ──────────
function yamlProvider(monaco, model) {
  const lines = model.getLinesContent();
  const total = lines.length;
  const result = [];
  const stack = [];

  lines.forEach((raw, i) => {
    const line = i + 1;
    if (/^\s*#/.test(raw)) return;
    if (/^\s*$/.test(raw)) return;

    const indent = raw.match(/^\s*-?\s*/)[0].length;
    const m = raw.match(/^\s*-?\s*["']?([^"':\s][^:"']*?)["']?\s*:(?:\s|$)/);
    if (!m) return;

    const node = {
      name: m[1].trim(),
      kind: monaco.languages.SymbolKind.Property,
      range: rangeOf(line, 1, total, raw.length + 1),
      selectionRange: rangeOf(line, 1, line, raw.length + 1),
      children: [],
    };
    while (stack.length && stack[stack.length - 1].indent >= indent) {
      const popped = stack.pop();
      popped.node.range.endLineNumber = line - 1;
    }
    if (stack.length) stack[stack.length - 1].node.children.push(node);
    else result.push(node);
    stack.push({ indent, node });
  });
  return result;
}

// ────────── Markdown ──────────
function markdownProvider(monaco, model) {
  const lines = model.getLinesContent();
  const total = lines.length;
  const result = [];
  const stack = [];

  lines.forEach((raw, i) => {
    const line = i + 1;
    const m = raw.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (!m) return;
    const level = m[1].length;
    const node = {
      name: m[2],
      kind: monaco.languages.SymbolKind.String,
      range: rangeOf(line, 1, total, raw.length + 1),
      selectionRange: rangeOf(line, 1, line, raw.length + 1),
      children: [],
    };
    while (stack.length && stack[stack.length - 1].level >= level) {
      const popped = stack.pop();
      popped.node.range.endLineNumber = line - 1;
    }
    if (stack.length) stack[stack.length - 1].node.children.push(node);
    else result.push(node);
    stack.push({ level, node });
  });
  return result;
}

// ────────── HTML ──────────
function htmlProvider(monaco, model) {
  const lines = model.getLinesContent();
  const total = lines.length;
  const result = [];
  const stack = [];

  for (let i = 0; i < lines.length; i++) {
    const line = i + 1;
    const raw = lines[i];
    const tagRegex = /<\/?([a-zA-Z][\w-]*)([^>]*)>/g;
    let m;
    while ((m = tagRegex.exec(raw)) !== null) {
      const tagFull = m[0];
      const tag = m[1].toLowerCase();
      const attrs = m[2];
      const isClose = tagFull.startsWith("</");
      const isSelfClose = tagFull.endsWith("/>") || /^(br|hr|img|input|meta|link)$/i.test(tag);

      if (isClose) {
        for (let j = stack.length - 1; j >= 0; j--) {
          if (stack[j].node._tag === tag) {
            stack[j].node.range.endLineNumber = line;
            stack.length = j;
            break;
          }
        }
        continue;
      }

      const idMatch = attrs.match(/\bid\s*=\s*["']([^"']+)["']/);
      const classMatch = attrs.match(/\bclass\s*=\s*["']([^"']+)["']/);
      let label = tag;
      if (idMatch) label += `#${idMatch[1]}`;
      else if (classMatch) label += `.${classMatch[1].split(/\s+/)[0]}`;

      const node = {
        name: label,
        kind: monaco.languages.SymbolKind.Module,
        range: rangeOf(line, m.index + 1, total, raw.length + 1),
        selectionRange: rangeOf(line, m.index + 1, line, m.index + tagFull.length + 1),
        children: [],
        _tag: tag,
      };
      if (stack.length) stack[stack.length - 1].node.children.push(node);
      else result.push(node);
      if (!isSelfClose) stack.push({ node });
    }
  }
  // strip internal _tag
  const strip = (nodes) => {
    nodes.forEach((n) => {
      delete n._tag;
      if (n.children?.length) strip(n.children);
    });
  };
  strip(result);
  return result;
}

// ────────── CSS ──────────
function cssProvider(monaco, model) {
  const text = model.getValue();
  const result = [];
  const stack = [];
  let depth = 0;
  let lineNumber = 1;
  let buffer = "";

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "\n") lineNumber++;

    if (ch === "{") {
      const selector = buffer.trim().replace(/\s+/g, " ");
      buffer = "";
      if (!selector) {
        depth++;
        continue;
      }
      const node = {
        name: selector,
        kind: monaco.languages.SymbolKind.Class,
        range: rangeOf(lineNumber, 1, lineNumber, 1),
        selectionRange: rangeOf(lineNumber, 1, lineNumber, 1),
        children: [],
      };
      if (stack.length) stack[stack.length - 1].node.children.push(node);
      else result.push(node);
      stack.push({ node, depth });
      depth++;
    } else if (ch === "}") {
      depth--;
      if (stack.length && stack[stack.length - 1].depth === depth) {
        stack[stack.length - 1].node.range.endLineNumber = lineNumber;
        stack.pop();
      }
      buffer = "";
    } else if (ch === ";") {
      buffer = "";
    } else {
      buffer += ch;
    }
  }
  return result;
}

// ────────── JS/TS via typescript worker ──────────
async function tsSymbols(monaco, model) {
  try {
    const lang = model.getLanguageId();
    const getWorker =
      lang === "typescript"
        ? await monaco.languages.typescript.getTypeScriptWorker()
        : await monaco.languages.typescript.getJavaScriptWorker();
    const client = await getWorker(model.uri);
    const tree = await client.getNavigationTree(model.uri.toString());
    if (!tree) return [];
    return navTreeToSymbols(tree, model).children || [];
  } catch (err) {
    return [];
  }
}

function navTreeToSymbols(node, model) {
  const span = node.spans?.[0] || node.nameSpan;
  const range = span ? spanToRange(span, model) : rangeOf(1, 1, 1, 1);
  return {
    name: node.text,
    kind: node.kind,
    range,
    selectionRange: range,
    children: (node.childItems || []).map((c) => navTreeToSymbols(c, model)),
  };
}

function spanToRange(span, model) {
  const start = model.getPositionAt(span.start);
  const end = model.getPositionAt(span.start + span.length);
  return rangeOf(start.lineNumber, start.column, end.lineNumber, end.column);
}

// ────────── public API ──────────
export function registerSymbolProviders(monaco) {
  if (registered) return;
  registered = true;
  const make = (fn) => ({
    provideDocumentSymbols: (model) => fn(monaco, model),
  });
  localProviders.python = make(pythonProvider);
  localProviders.json = make(jsonProvider);
  localProviders.yaml = make(yamlProvider);
  localProviders.markdown = make(markdownProvider);
  localProviders.html = make(htmlProvider);
  localProviders.css = make(cssProvider);

  monaco.languages.registerDocumentSymbolProvider("python", localProviders.python);
  monaco.languages.registerDocumentSymbolProvider("json", localProviders.json);
  monaco.languages.registerDocumentSymbolProvider("yaml", localProviders.yaml);
  monaco.languages.registerDocumentSymbolProvider("markdown", localProviders.markdown);
  monaco.languages.registerDocumentSymbolProvider("html", localProviders.html);
  monaco.languages.registerDocumentSymbolProvider("css", localProviders.css);
}

export async function getEnclosingPath(monaco, model, position) {
  if (!model || !position) return [];
  const lang = model.getLanguageId();

  let symbols = [];
  if (lang === "javascript" || lang === "typescript") {
    symbols = await tsSymbols(monaco, model);
  } else if (localProviders[lang]) {
    symbols = await localProviders[lang].provideDocumentSymbols(model);
  } else {
    return [];
  }

  return findChain(symbols, position).map((s) => ({ ...s, lang }));
}

function findChain(symbols, position) {
  const path = [];
  let nodes = symbols;
  while (nodes && nodes.length) {
    const found = nodes.find((s) => isInRange(position, s.range));
    if (!found) break;
    if (found.name) path.push({ name: found.name, kind: found.kind });
    nodes = found.children || [];
  }
  return path;
}

function isInRange(pos, range) {
  if (!range) return false;
  const { lineNumber: line, column: col } = pos;
  if (line < range.startLineNumber) return false;
  if (line > range.endLineNumber) return false;
  if (line === range.startLineNumber && col < range.startColumn) return false;
  if (line === range.endLineNumber && col > range.endColumn) return false;
  return true;
}
