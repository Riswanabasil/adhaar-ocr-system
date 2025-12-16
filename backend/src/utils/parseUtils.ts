import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, 
});


// ---------- Common regex
const AADHAAR_RE = /\b(\d{4}[ -]?\d{4}[ -]?\d{4})\b/;
const PINCODE_RE = /\b(\d{6})\b/;
const DOB_LINE_RE =
  /\b(?:DOB|D\.O\.B\.?|Year of Birth)[:\s-]*([0-3]?\d[\/\-\.][01]?\d[\/\-\.](?:19|20)\d{2}|(19|20)\d{2})\b/i;
const GENDER_RE_FULL = /\b(FEMALE|MALE|TRANSGENDER|OTHERS)\b/i;

// ---------- Noise control
// const CLEAN_CHARS = /[^A-Za-z0-9,\-\/().\s:]/g;
// const MULTISPACE = /\s{2,}/g;
const MULTICOMMA = /,\s*,+/g;

const FOOTER_PATTERNS = [
  /uidai/i,
  /help@/i,
  /www\./i,
  /1800/i,
  /1947/i,
  /P\.?O\./i,
  /unique identification authority/i,
  /government of india/i,
  /authority/i,
];


// ---------- Simple numeric fields
export function findAadhaarIn(text) {
  const m = text.match(AADHAAR_RE);
  return m ? m[1].replace(/[ -]/g, '') : null;
}
export function findPincode(text) {
  const m = text.match(PINCODE_RE);
  return m ? m[1] : null;
}
export function findDob(text) {
  const m = text.match(DOB_LINE_RE);
  if (!m) return null;
  return m[1] || m[2] || null;
}
export function findGender(text) {
  const m = text.match(GENDER_RE_FULL);
  return m ? m[1].toUpperCase() : null;
}


const CLEAN_CHARS = /[^\p{L}\p{N} .,'()-:/]/gu;   
const MULTISPACE  = /\s+/g;

function isFooter(l) {
  return /(unique identification|authority|government of india|help@uidai|uidai\.gov\.in|1947)/i.test(l);
}

export function extractNameFromFront(frontText) {
  const rawLines = frontText.split('\n');

  const lines = rawLines
    .map(l => l.replace(CLEAN_CHARS, '').replace(MULTISPACE, ' ').trim())
    .filter(Boolean)
    .filter(l => !isFooter(l));

  const yobIdx = lines.findIndex(l => /year of birth|dob/i.test(l));
  const windowStart = yobIdx > 0 ? Math.max(0, yobIdx - 4) : 0;
  const windowEnd   = yobIdx > 0 ? yobIdx : Math.min(lines.length, 6);
  const windowLines = lines.slice(windowStart, windowEnd);

  function scoreLine(l) {
    if (!l) return -1;
    // Names rarely contain digits on Aadhaar
    if (/\d/.test(l)) return -1;

    // Heuristic: 2–5 tokens with most tokens TitleCased
    const parts = l.split(' ').filter(Boolean);
    if (parts.length < 2 || parts.length > 5) return -1;

    const caps = parts.filter(p => /^[A-Z][a-zA-Z'.-]*$/.test(p)).length;
    if (caps < 2) return -1;

    // Prefer shorter, cleaner lines
    const letters = (l.match(/[A-Za-z]/g) || []).length;
    const ratio = letters / Math.max(1, l.length);
    return ratio + caps * 0.25 - parts.length * 0.05;
  }

  let best = null, bestScore = -1;
  for (const l of windowLines) {
    const s = scoreLine(l);
    if (s > bestScore) { best = l; bestScore = s; }
  }
  if (!best) return null;

  // ---- FINAL CLEANUPS ----
  // 1) Drop any leading single stray token like "i ", "l ", "1 "
  best = best.replace(/^[iIl1]\s+(?=[A-Z][a-z]+)/, '');

  // 2) Remove any leading non-letter noise
  best = best.replace(/^[^A-Za-z]+/, '').trim();

  // 3) Ensure at least two TitleCase words remain
  const capWords = best.split(' ').filter(p => /^[A-Z][a-zA-Z'.-]*$/.test(p));
  if (capWords.length < 2) return null;

  return best;
}


export function extractAddressFromBack(backText) {
  const cleanedLines = backText
    .split('\n')
    .map((l) =>
      l.replace(CLEAN_CHARS, '').replace(MULTISPACE, ' ').trim()
    )
    .filter(Boolean);

  let start = cleanedLines.findIndex((l) => /^address\b/i.test(l));
  if (start === -1) start = cleanedLines.findIndex((l) => /(d\/o|s\/o|c\/o)/i.test(l));
  if (start === -1) return null;

  const out = [];
  for (let i = start; i < cleanedLines.length; i += 1) {
    const line = cleanedLines[i];
    if (isFooter(line)) break;

    // stop if this looks like a header/garbage preceding Address
    if (/unique identification|authority|government/i.test(line)) continue;

    // remove leading "Address:"
    const normalized = line.replace(/^address[: ]/i, '').trim();

    // Ignore obvious garbage words that slipped through OCR (common prefixes in your sample)
    if (/^comnflanmo|^daaen|^aflo|^0s/i.test(normalized)) continue;

    if (normalized) out.push(normalized);

    // break after we captured a pincode somewhere
    if (PINCODE_RE.test(out.join(' '))) break;
  }

  const joined = out
    .join(', ')
    .replace(MULTICOMMA, ', ')
    .replace(/\s+,/g, ',')
    .trim();

  return joined || null;
}

// ---------- High-level combined parse
export function parseAadhaarData(fullText) {
  const aadhaarNumber = findAadhaarIn(fullText);
  const pincode = findPincode(fullText);
  const dob = findDob(fullText);
  const gender = findGender(fullText);
  return { aadhaarNumber, pincode, dob, gender, name: null, address: null };
}
