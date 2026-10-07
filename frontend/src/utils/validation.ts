export function normalizeUrl(input: string): string {
  if (!input) return '';
  let trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  // If no scheme, default to https://
  if (!lower.startsWith('http://') && !lower.startsWith('https://')) {
    if (!lower.includes('://')) {
      trimmed = `https://${trimmed}`;
    }
  }

  return trimmed;
}

export function validateUrlInput(input: string): { isValid: boolean; error?: string; normalized?: string } {
  if (!input || !input.trim()) {
    return { isValid: false, error: 'Please enter a website URL to analyze.' };
  }

  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  const disallowed = ['javascript:', 'data:', 'file:', 'vbscript:', 'blob:'];
  for (const scheme of disallowed) {
    if (lower.startsWith(scheme)) {
      return { isValid: false, error: `Disallowed URL scheme (${scheme}). Only HTTP/HTTPS websites are supported.` };
    }
  }

  const normalized = normalizeUrl(trimmed);

  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, error: 'Only HTTP and HTTPS websites can be analyzed.' };
    }

    if (!parsed.hostname || parsed.hostname.length === 0) {
      return { isValid: false, error: 'Please provide a valid hostname or domain name.' };
    }

    return { isValid: true, normalized };
  } catch {
    return { isValid: false, error: 'Invalid URL format. Example: https://example.com' };
  }
}

export function validateEmailInput(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
