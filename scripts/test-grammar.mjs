import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

import oniguruma from "vscode-oniguruma";
import textmate from "vscode-textmate";

const { loadWASM, OnigScanner, OnigString } = oniguruma;
const { Registry } = textmate;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const grammarPath = path.join(root, "syntaxes", "culsma.tmLanguage.json");
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));
const fixtureLines = fs.readFileSync(path.join(root, "test", "current-surface.culs"), "utf8").split("\n");

assert.equal(packageJson.contributes.languages[0].id, "culsma");
assert.equal(packageJson.contributes.grammars[0].scopeName, "source.culsma");
assert.equal(packageJson.license, "Apache-2.0");
assert.equal(packageJson.icon, "images/culsma-logo.png");
assert.equal(grammar.scopeName, "source.culsma");
assert.ok(!JSON.stringify(grammar).includes("labword"));

for (const requiredFile of [
  "LICENSE",
  "THIRD_PARTY_NOTICES.md",
  "third_party/licenses/Orbitron-OFL-1.1.txt",
  "images/culsma-logo.png",
  "images/culsma-wordmark.png"
]) {
  assert.ok(fs.existsSync(path.join(root, requiredFile)), `Missing ${requiredFile}`);
}
const icon = fs.readFileSync(path.join(root, packageJson.icon));
assert.equal(icon.subarray(1, 4).toString("ascii"), "PNG");
assert.ok(icon.readUInt32BE(16) >= 128 && icon.readUInt32BE(20) >= 128, "Marketplace icon must be at least 128x128");

const require = createRequire(import.meta.url);
const wasmBytes = fs.readFileSync(require.resolve("vscode-oniguruma/release/onig.wasm"));
await loadWASM(wasmBytes.buffer.slice(wasmBytes.byteOffset, wasmBytes.byteOffset + wasmBytes.byteLength));

const registry = new Registry({
  onigLib: Promise.resolve({
    createOnigScanner: (sources) => new OnigScanner(sources),
    createOnigString: (value) => new OnigString(value)
  }),
  loadGrammar: async (scopeName) => (scopeName === "source.culsma" ? grammar : null)
});
const loadedGrammar = await registry.loadGrammar("source.culsma");
assert.ok(loadedGrammar);

const tokenized = [];
let ruleStack = null;
for (const line of fixtureLines) {
  const result = loadedGrammar.tokenizeLine(line, ruleStack);
  tokenized.push({ line, tokens: result.tokens });
  ruleStack = result.ruleStack;
}

function scopesFor(needle, occurrence = 0) {
  let seen = 0;
  for (const { line, tokens } of tokenized) {
    let from = 0;
    while (true) {
      const index = line.indexOf(needle, from);
      if (index < 0) break;
      if (seen++ === occurrence) {
        const token = tokens.find((candidate) => candidate.startIndex <= index && candidate.endIndex >= index + needle.length);
        assert.ok(token, `No token covers ${needle}`);
        return token.scopes;
      }
      from = index + needle.length;
    }
  }
  assert.fail(`Fixture does not contain ${needle}`);
}

const expectations = [
  ["import", "keyword.control.culsma"],
  ["returns", "keyword.control.culsma"],
  ["plate", "support.function.culsma"],
  ["content", "support.function.culsma"],
  ["500cells", "constant.numeric.quantity.culsma"],
  ["centrifuge_program", "support.function.program.culsma"],
  ["partition", "entity.name.function.member.culsma"],
  ["<<", "keyword.operator.mutation.culsma"],
  ["1day", "constant.numeric.quantity.culsma"],
  ["constraint", "keyword.control.culsma"]
];
for (const [text, expectedScope] of expectations) {
  assert.ok(scopesFor(text).includes(expectedScope), `${text} is missing ${expectedScope}`);
}

console.log(`Validated ${expectations.length} Culsma TextMate scopes.`);
