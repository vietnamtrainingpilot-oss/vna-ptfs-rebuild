// Minimal SHA-256 helper for the admin password gate.
//
// IMPORTANT CONTEXT: this is a static site with no server, so there is no
// way to keep a secret truly secret from someone willing to read the
// shipped JS bundle — anything compared against in the browser is, in
// principle, recoverable. Hashing the password (instead of storing it in
// plaintext in public/content.json and in source) removes the *trivial*
// exposure — no one can open Network tab or view-source and read the
// password directly — but it is not a substitute for real auth. See the
// "A note on security" card in Admin → Settings, and the README.
export async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}
