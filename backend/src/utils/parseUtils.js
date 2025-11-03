import multer from 'multer';

// // Very first-pass extractor. We’ll refine later.
// const AADHAAR_RE = /\b(\d{4}[ -]?\d{4}[ -]?\d{4})\b/;
// const PINCODE_RE = /\b(\d{6})\b/;
// const DOB_RE =
//   /\b(?:DOB|D\.O\.B\.?|Date\s*of\s*Birth)[:\s-]*([0-3]?\d[\/\-\.][01]?\d[\/\-\.](?:19|20)\d{2})\b/i;
// const GENDER_RE = /\b(MALE|FEMALE|TRANSGENDER|OTHERS|M|F)\b/i;


// export function parseAadhaarData(fullText) {
//   const text = fullText.replace(/\s{2,}/g, ' ');

//   const aadhaarMatch = text.match(AADHAAR_RE);
//   const pincodeMatch = text.match(PINCODE_RE);
//   const dobMatch = text.match(DOB_RE);
//   const genderMatch = text.match(GENDER_RE);

//   // Name is tricky—placeholder: take an uppercase line near "DOB" or "Male"
//   // We’ll refine later. For now, leave null if unsure.
//   let name = null;

//   return {
//     aadhaarNumber: aadhaarMatch ? aadhaarMatch[1].replace(/[ -]/g, '') : null,
//     pincode: pincodeMatch ? pincodeMatch[1] : null,
//     dob: dobMatch ? dobMatch[1] : null,
//     gender: genderMatch ? genderMatch[1].toUpperCase() : null,
//     name,
//     address: null, // to be refined by heuristics later
//   };
// }

// export function extractName(text) {
//   // This line commonly looks like: "i Riswana M Yacoob"
//   const nameLine = text
//     .split('\n')
//     .find(line => /[A-Z][a-z]+/.test(line) && !line.includes('GOVERNMENT') && !line.includes('Year'));

//   if (!nameLine) return null;
  
//   // Extract alphabet characters only
//   const cleaned = nameLine.replace(/[^A-Za-z\s]/g, '').trim();
//   return cleaned.length > 3 ? cleaned : null;
// }


// export function extractAddress(text) {
//   const lines = text.split('\n');
//   const startIndex = lines.findIndex(line => line.toLowerCase().includes('address'));
//   if (startIndex === -1) return null;

//   const addressLines = [];
//   for (let i = startIndex + 1; i < lines.length; i++) {
//     if (lines[i].trim() === '' || lines[i].length < 4) break;
//     addressLines.push(lines[i].replace(/[^A-Za-z0-9,\s]/g, '').trim());
//   }

//   return addressLines.join(', ');
// }

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

// utils/parseUtils.js

// ---------- helpers
// const CLEAN_RE = /[^A-Za-z0-9,\-\(\)\/\s]/g;
// const MULTISPACE_RE = /\s{2,}/g;
// const MULTICOMMA_RE = /,\s*,+/g;

// const STOP_WORDS = [
//   'GOVERNMENT', 'UNIQUE IDENTIFICATION AUTHORITY', 'UIDAI',
//   'Year of Birth', 'DOB', 'Female', 'Male', 'Government of India',
//   'help@uidai.gov.in', 'www.uidai.gov.in', 'P.O.', '1800', '1947',
// ];

// const isNoise = (line) =>
//   !line || line.length < 3 ||
//   STOP_WORDS.some(k => line.toLowerCase().includes(k.toLowerCase()));

// // ---------- UID / pincodes / dob / gender (numbers are reliable)
// const AADHAAR_RE = /\b(\d{4}[ -]?\d{4}[ -]?\d{4})\b/;
// const PINCODE_RE = /\b(\d{6})\b/;
// const DOB_LINE_RE = /\b(?:DOB|D\.O\.B\.?|Year of Birth)[:\s-]*([0-3]?\d[\/\-\.][01]?\d[\/\-\.](?:19|20)\d{2}|(19|20)\d{2})\b/i;
// const GENDER_RE_FULL = /\b(FEMALE|MALE|TRANSGENDER|OTHERS)\b/i;

// export function findAadhaarIn(text) {
//   const m = text.match(AADHAAR_RE);
//   return m ? m[1].replace(/[ -]/g, '') : null;
// }

// export function findPincode(text) {
//   const m = text.match(PINCODE_RE);
//   return m ? m[1] : null;
// }

// export function findDob(text) {
//   const m = text.match(DOB_LINE_RE);
//   if (!m) return null;
//   // m[1] could be DD/MM/YYYY etc., or only the year
//   const v = m[1] || m[2];
//   return v || null;
// }

// export function findGender(text) {
//   const m = text.match(GENDER_RE_FULL);
//   return m ? m[1].toUpperCase() : null;
// }

// // ---------- Name (from FRONT)
// export function extractNameFromFront(frontText) {
//   const lines = frontText
//     .split('\n')
//     .map(l => l.replace(CLEAN_RE, '').replace(MULTISPACE_RE, ' ').trim())
//     .filter(l => !isNoise(l));

//   // Prefer a line immediately above the DOB / Year-of-birth line
//   const yobIdx = lines.findIndex(l => /year of birth|dob/i.test(l));
//   const candidates = [];

//   if (yobIdx > 0) {
//     for (let i = Math.max(0, yobIdx - 3); i < yobIdx; i += 1) {
//       candidates.push(lines[i]);
//     }
//   } else {
//     candidates.push(...lines);
//   }

//   // A likely name: 2–4 words, mostly letters, starts with capitals
//   const likely = candidates.find(l => {
//     if (/\d/.test(l)) return false;
//     const parts = l.split(' ').filter(Boolean);
//     if (parts.length < 2 || parts.length > 5) return false;
//     const caps = parts.filter(p => /^[A-Z][a-zA-Z'.-]*$/.test(p)).length;
//     return caps >= 2;
//   });

//   return likely || null;
// }

// // ---------- Address (from BACK)
// export function extractAddressFromBack(backText) {
//   const lines = backText
//     .split('\n')
//     .map(l => l.replace(CLEAN_RE, '').replace(MULTISPACE_RE, ' ').trim());

//   let i = lines.findIndex(l => l.toLowerCase().startsWith('address'));
//   if (i === -1) {
//     // fallback: first line that looks like D/O:, S/O:, C/O:
//     i = lines.findIndex(l => /(^|\s)(d\/o|s\/o|c\/o)\b/i.test(l));
//     if (i === -1) return null;
//   }

//   const out = [];
//   for (let j = i; j < lines.length; j += 1) {
//     const line = lines[j];
//     if (isNoise(line)) break;
//     // stop if we hit URL/phone/footer-ish lines
//     if (/uidai\.gov\.in|help@|www\.|P\.O\./i.test(line)) break;

//     // allow commas, letters, digits, slashes and hyphens; trim extra commas
//     const cleaned = line.replace(MULTICOMMA_RE, ', ').replace(/\s+,/g, ',').trim();
//     if (cleaned && cleaned.length > 3) out.push(cleaned);

//     // stop once we have a pincode captured anywhere in the collected text
//     if (PINCODE_RE.test(out.join(' '))) break;
//   }

//   // Remove the leading "Address:" tag if present
//   if (out.length && /^address[: ]/i.test(out[0])) {
//     out[0] = out[0].replace(/^address[: ]/i, '').trim();
//   }

//   // Final tidy: collapse duplicate commas/spaces
//   const joined = out.join(', ').replace(MULTICOMMA_RE, ', ').replace(MULTISPACE_RE, ' ').trim();
//   return joined || null;
// }

// // ---------- High-level combined parse (still used by controller)
// export function parseAadhaarData(fullText) {
//   const aadhaarNumber = findAadhaarIn(fullText);
//   const pincode = findPincode(fullText);
//   const dob = findDob(fullText);
//   const gender = findGender(fullText);
//   return { aadhaarNumber, pincode, dob, gender, name: null, address: null };
// }

// utils/parseUtils.js

// ---------- Common regex
const AADHAAR_RE = /\b(\d{4}[ -]?\d{4}[ -]?\d{4})\b/;
const PINCODE_RE = /\b(\d{6})\b/;
const DOB_LINE_RE =
  /\b(?:DOB|D\.O\.B\.?|Year of Birth)[:\s-]*([0-3]?\d[\/\-\.][01]?\d[\/\-\.](?:19|20)\d{2}|(19|20)\d{2})\b/i;
const GENDER_RE_FULL = /\b(FEMALE|MALE|TRANSGENDER|OTHERS)\b/i;

// ---------- Noise control
const CLEAN_CHARS = /[^A-Za-z0-9,\-\/().\s:]/g;
const MULTISPACE = /\s{2,}/g;
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

// lines we never want to use as name/address seeds
function isFooter(line) {
  return (
    !line ||
    line.length < 3 ||
    FOOTER_PATTERNS.some((re) => re.test(line))
  );
}

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

// ---------- NAME (front)
// Strategy:
// 1) Look in a small window above the "Year of Birth/DOB" line.
// 2) Score candidate lines by: (letters ratio) + (2–5 capitalized words) + (no digits).
// 3) Strip leading non-letters (like stray "i") and extra tokens.
export function extractNameFromFront(frontText) {
  const rawLines = frontText.split('\n');

  // clean & normalize
  const lines = rawLines
    .map((l) => l.replace(CLEAN_CHARS, '').replace(MULTISPACE, ' ').trim())
    .filter((l) => !isFooter(l));

  const yobIdx = lines.findIndex((l) => /year of birth|dob/i.test(l));
  const windowStart = yobIdx > 0 ? Math.max(0, yobIdx - 4) : 0;
  const windowEnd = yobIdx > 0 ? yobIdx : Math.min(lines.length, 6);

  const windowLines = lines.slice(windowStart, windowEnd);

  function scoreLine(l) {
    if (!l) return -1;
    if (/\d/.test(l)) return -1; // names shouldn’t include digits
    const parts = l.split(' ').filter(Boolean);
    if (parts.length < 2 || parts.length > 5) return -1;

    const caps = parts.filter((p) => /^[A-Z][a-zA-Z'.-]*$/.test(p)).length;
    if (caps < 2) return -1;

    const letters = (l.match(/[A-Za-z]/g) || []).length;
    const ratio = letters / Math.max(1, l.length); // 0..1

    return ratio + caps * 0.2; // simple heuristic
  }

  let best = null;
  let bestScore = -1;
  for (const l of windowLines) {
    const s = scoreLine(l);
    if (s > bestScore) {
      best = l;
      bestScore = s;
    }
  }

  if (!best) return null;

  // remove stray leading chars like "i "
  best = best.replace(/^[^A-Za-z]+/, '').trim();

  // final sanity: require at least two capitalized words
  const capWords = best.split(' ').filter((p) => /^[A-Z][a-zA-Z'.-]*$/.test(p));
  if (capWords.length < 2) return null;

  return best;
}

// ---------- ADDRESS (back)
// Strategy:
// - Start at "Address" OR first D/O|S/O|C/O line.
// - Collect lines until pincode seen or footer hit.
// - Clean punctuation and collapse duplicates.
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
