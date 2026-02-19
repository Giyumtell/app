// Stored hash is SHA-256 of (username + password) concatenated.
// Neither the username nor the password is ever stored — only the hash.
// Default credentials: username "admin", password "BaharFilm2024"
const DEFAULT_CREDENTIAL_HASH = '40e366c4298ac84366c925c79e694f400d49f5ab21ec2217b9b6aac7e846291d';

const CREDENTIAL_HASH_KEY = 'baharfilm_cred_hash';
const SESSION_KEY = 'baharfilm_admin_session';
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

async function sha256(text: string): Promise<string> {
  const buffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text)
  );
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function getStoredHash(): string {
  return localStorage.getItem(CREDENTIAL_HASH_KEY) ?? DEFAULT_CREDENTIAL_HASH;
}

export async function adminLogin(username: string, password: string): Promise<boolean> {
  const hash = await sha256(username + password);
  if (hash !== getStoredHash()) return false;

  const session = { expires: Date.now() + SESSION_DURATION_MS };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return true;
}

export function isAdminAuthenticated(): boolean {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw) as { expires: number };
    return typeof session.expires === 'number' && session.expires > Date.now();
  } catch {
    return false;
  }
}

export function adminLogout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

/** Verify current credentials then store hash of new username+password. */
export async function changeAdminCredentials(
  currentUsername: string,
  currentPassword: string,
  newUsername: string,
  newPassword: string
): Promise<{ ok: boolean; error?: string }> {
  if (!newUsername.trim()) {
    return { ok: false, error: 'Username cannot be empty.' };
  }
  if (newPassword.length < 8) {
    return { ok: false, error: 'New password must be at least 8 characters.' };
  }
  const currentHash = await sha256(currentUsername + currentPassword);
  if (currentHash !== getStoredHash()) {
    return { ok: false, error: 'Current username or password is incorrect.' };
  }
  localStorage.setItem(CREDENTIAL_HASH_KEY, await sha256(newUsername + newPassword));
  return { ok: true };
}
