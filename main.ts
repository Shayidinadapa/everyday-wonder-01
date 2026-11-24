// everyday-wonder-01: writes one sentence about a small everyday moment
// of wonder to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR / $OUTPUT_DIR).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "The lift mirror catches me mid-yawn, and the stranger I have been avoiding all week turns out to be me.";

function validate(text: string): void {
  const chars = [...text];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`entry must be 1-200 characters, got ${chars.length}`);
  }
  if (text.trim() !== text) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  if (/[\n\r\t]/.test(text)) {
    throw new Error("entry must be a single line with no tab or newline");
  }
  // Reject control characters and invisible zero-width characters.
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2060\uFEFF]/.test(text)) {
    throw new Error("entry must not contain control or zero-width characters");
  }
  if (/\s{2,}/.test(text)) {
    throw new Error("entry must not contain repeated whitespace");
  }
}

validate(ENTRY);

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Round-trip check: what we wrote must read back byte-identical.
const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== ENTRY) {
  throw new Error("round-trip check failed: entry.txt differs from ENTRY");
}

console.log(ENTRY);
