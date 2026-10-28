// Flags em dashes, en dashes and colons in user-visible copy inside src/moot.
// It checks JSX text, string literals and template text, and skips code-only strings
// such as URLs, CSS values, class names and import paths.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/moot", import.meta.url));
const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    // The vendored Claude Design scripts are checked by hand when a new export arrives.
    if (statSync(path).isDirectory()) { if (name !== "vendor") walk(path); }
    else if ([".js", ".jsx"].includes(extname(path))) files.push(path);
  }
})(root);

const CODE_LIKE = [
  /^https?:\/\//, /^mailto:/, /^\//, /^\.\.?\//, /^#/, /^[a-z-]+\s*:\s*\S+;?$/, // css-ish, such as "color: red"
  /^\(prefers-/, /^[a-z]+:[a-z]/i, /^data:/, /^M[\d\s.,CSLQTZ-]+/i,
];
const isCodeLike = (s) => CODE_LIKE.some((re) => re.test(s.trim()));

let problems = 0;
for (const file of files) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*") || trimmed.startsWith("{/*")) return;
    const report = (why, text) => {
      problems += 1;
      console.log(`${file.replace(root, "src/moot")} line ${i + 1} ${why} -> ${text.trim().slice(0, 100)}`);
    };
    if (/[—–]/.test(line)) report("contains an em or en dash", line);
    // String literals and JSX text that contain a colon followed by a space or end.
    const strings = [...line.replace(/\$\{[^}]*\}/g, "").matchAll(/"([^"]*)"|`([^`]*)`/g)].map((m) => m[1] ?? m[2]);
    const jsxText = [...line.matchAll(/>([^<>{}]+)</g)].map((m) => m[1]);
    const bareText = /^[A-Z][^=<>{}();]*$/.test(trimmed) ? [trimmed] : [];
    for (const raw of [...strings, ...jsxText, ...bareText]) {
      const text = (raw || "").replace(/\$\{[^}]*\}/g, "");
      if (!text.trim() || isCodeLike(text)) continue;
      if (/\s/.test(text) && /:(\s|$)/.test(text)) report("contains a colon", text);
    }
  });
}

if (problems) {
  console.log(`\n${problems} copy problem(s) found.`);
  process.exit(1);
}
console.log(`Copy check passed across ${files.length} files.`);
