export function normalizeAndValidateUrl(inputUrl: string): { isValid: boolean; normalizedUrl?: string; error?: string } {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { isValid: false, error: 'URL cannot be empty.' };
  }

  let trimmed = inputUrl.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: 'URL cannot be empty.' };
  }

  // Reject dangerous schemes
  const lower = trimmed.toLowerCase();
  const dangerousSchemes = ['javascript:', 'data:', 'file:', 'vbscript:', 'blob:', 'about:'];
  for (const scheme of dangerousSchemes) {
    if (lower.startsWith(scheme)) {
      return { isValid: false, error: `Disallowed URL scheme: ${scheme}. Only HTTP and HTTPS are permitted.` };
    }
  }

  // Auto-prefix protocol if missing (e.g. "example.com" or "example.com/test")
  if (!lower.startsWith('http://') && !lower.startsWith('https://')) {
    // If it has a protocol like ftp://, reject it
    if (lower.includes('://')) {
      return { isValid: false, error: 'Only HTTP and HTTPS protocols are supported.' };
    }
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, error: 'Only HTTP and HTTPS protocols are supported.' };
    }

    if (!parsed.hostname || parsed.hostname.length === 0) {
      return { isValid: false, error: 'The URL must include a valid hostname.' };
    }

    // Hostname must contain at least a dot (unless it is localhost or an IP address)
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(parsed.hostname);
    if (!isIp && !parsed.hostname.includes('.') && parsed.hostname !== 'localhost') {
      return { isValid: false, error: 'Hostname must be a valid domain or IP address.' };
    }

    return { isValid: true, normalizedUrl: parsed.toString() };
  } catch (err) {
    return { isValid: false, error: 'Invalid URL format. Please enter a valid web address (e.g., https://example.com).' };
  }
}

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required.' };
  }
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long.' };
  }
  return { isValid: true };
}
