// SHA-256 hash of the default password "BaharFilm2024"
const DEFAULT_PASSWORD_HASH = '36330a59b083a69f56f0cc5cd71c4299c69d41c4a3b58385fd1d04be2a20e4ac';

const PASSWORD_HASH_KEY = 'baharfilm_pw_hash';
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
  return localStorage.getItem(PASSWORD_HASH_KEY) ?? DEFAULT_PASSWORD_HASH;
}

export async function adminLogin(password: string): Promise<boolean> {
  const hash = await sha256(password);
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

export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ ok: boolean; error?: string }> {
  if (newPassword.length < 8) {
    return { ok: false, error: 'Password must be at least 8 characters.' };
  }
  const currentHash = await sha256(currentPassword);
  if (currentHash !== getStoredHash()) {
    return { ok: false, error: 'Current password is incorrect.' };
  }
  localStorage.setItem(PASSWORD_HASH_KEY, await sha256(newPassword));
  return { ok: true };
}
