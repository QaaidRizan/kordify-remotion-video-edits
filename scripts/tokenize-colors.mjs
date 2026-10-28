// One-time migration of legacy component colors to the shared brand palette.
import ts from "typescript";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";
const palette = {
  "theme.bg": "0c1018",
  "theme.surface": "171e2b",
  "theme.surfaceRaised": "232e40",
  "theme.border": "35435a",
  "theme.text": "fdfbf7",
  "theme.muted": "adb8c9",
  "theme.accent": "ff4d4d",
  "theme.accentSoft": "ff8585",
  "theme.blueSoft": "8db8ff",
  "theme.mood.fix": "2d5da1",
  "theme.mood.success": "22c55e",
  "theme.mood.warn": "f59e0b",
  "theme.black": "000000",
  "theme.white": "ffffff",
};
const rgb = (x) => [0, 2, 4].map((i) => parseInt(x.slice(i, i + 2), 16));
function ref(hex) {
  let raw = hex.slice(1).toLowerCase();
  if (raw.length <= 4) raw = [...raw].map((x) => x + x).join("");
  const opacity = raw.length === 8 ? raw.slice(6) : "";
  raw = raw.slice(0, 6);
  const exact = {
    ff7a3d: "theme.accent",
    fa5959: "theme.accent",
    "3b82ff": "theme.mood.fix",
    ff3b3b: "theme.mood.problem",
    ff0000: "theme.mood.problem",
    ff5959: "theme.mood.problem",
  };
  const c = rgb(raw);
  const closest =
    exact[raw] ??
    Object.entries(palette).sort(
      (a, b) =>
        rgb(a[1]).reduce((s, v, i) => s + (v - c[i]) ** 2, 0) -
        rgb(b[1]).reduce((s, v, i) => s + (v - c[i]) ** 2, 0),
    )[0][0];
  return "${" + closest + "}" + opacity;
}
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((x) =>
    x.isDirectory() ? walk(path.join(dir, x.name)) : [path.join(dir, x.name)],
  );
}
for (const file of walk("src").filter((f) => f.endsWith(".tsx"))) {
  let source = readFileSync(file, "utf8");
  const ast = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const edits = [];
  function visit(node) {
    if (
      ts.isTemplateExpression(node) ||
      ts.isNoSubstitutionTemplateLiteral(node) ||
      ts.isStringLiteral(node)
    ) {
      const original = node.getText(ast);
      if (/#[a-f\d]{3,8}\b/i.test(original)) {
        let next = original.replace(/#[a-f\d]{3,8}\b/gi, ref);
        if (ts.isStringLiteral(node)) {
          next = "`" + next.slice(1, -1) + "`";
          if (ts.isJsxAttribute(node.parent)) next = "{" + next + "}";
        }
        edits.push([node.getStart(ast), node.getEnd(), next]);
        return;
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  for (const [start, end, next] of edits.sort((a, b) => b[0] - a[0]))
    source = source.slice(0, start) + next + source.slice(end);
  if (edits.length) {
    if (!/import\s*\{[^}]*\btheme\b[^}]*\}\s*from/.test(source)) {
      let relative = path
        .relative(path.dirname(file), "src/theme")
        .replaceAll("\\", "/");
      if (!relative.startsWith(".")) relative = "./" + relative;
      source = `import { theme } from "${relative}";\n` + source;
    }
    writeFileSync(file, source);
    console.log(file, edits.length);
  }
}
