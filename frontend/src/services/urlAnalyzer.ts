import { AnalysisResult, RiskLevel, ScanFinding } from '../types/scanner';
import { normalizeAndValidateUrl } from '../utils/validation';

const SENSITIVE_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'account', 'secure',
  'security', 'update', 'password', 'wallet', 'banking', 'payment',
  'confirm', 'credential', 'bonus', 'free', 'prize', 'claim'
];

const SUSPICIOUS_EXTENSIONS = ['.exe', '.scr', '.bat', '.cmd', '.vbs', '.apk', '.msi', '.ps1'];

export function analyzeUrl(inputUrl: string): AnalysisResult {
  const validation = normalizeAndValidateUrl(inputUrl);
  if (!validation.isValid || !validation.normalizedUrl) {
    throw new Error(validation.error || 'Invalid URL provided.');
  }

  const urlObj = new URL(validation.normalizedUrl);
  const findings: ScanFinding[] = [];
  let calculatedScore = 0;

  const url = validation.normalizedUrl;
  const domain = urlObj.hostname;
  const protocol = urlObj.protocol.toLowerCase();
  const pathname = urlObj.pathname.toLowerCase();
  const fullHref = urlObj.href.toLowerCase();

  // 1. HTTPS vs HTTP Check
  if (protocol === 'https:') {
    findings.push({
      category: 'Protocol & Encryption',
      title: 'HTTPS Encryption Enabled',
      severity: 'SAFE',
      description: 'The submitted URL uses encrypted HTTPS, ensuring communication between the client and server is encrypted in transit.',
      riskPoints: 0
    });
  } else if (protocol === 'http:') {
    calculatedScore += 20;
    findings.push({
      category: 'Protocol & Encryption',
      title: 'Unencrypted HTTP Protocol',
      severity: 'HIGH',
      description: 'The URL uses unencrypted HTTP. Data transmitted over this connection is unencrypted and vulnerable to eavesdropping, tampering, and interception.',
      riskPoints: 20
    });
  }

  // 2. IP Address Hostname Check (IPv4 / IPv6)
  const isIpv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(domain);
  const isIpv6 = domain.startsWith('[') && domain.endsWith(']');
  if (isIpv4 || isIpv6) {
    calculatedScore += 25;
    findings.push({
      category: 'Host Identity',
      title: 'IP Address Used as Hostname',
      severity: 'HIGH',
      description: 'The URL specifies a numeric IP address directly instead of a registered domain name. Legitimate public services almost always use standard domain names.',
      riskPoints: 25
    });
  }

  // 3. Userinfo / @ Symbol Check
  if (urlObj.username || urlObj.password || url.includes('@')) {
    calculatedScore += 20;
    findings.push({
      category: 'URL Structure',
      title: 'Embedded User Information (@ Symbol)',
      severity: 'HIGH',
      description: 'The URL contains an "@" symbol or user credentials in the authority segment. This technique is often used to deceive users regarding the actual host being visited.',
      riskPoints: 20
    });
  }

  // 4. Punycode / IDN Spoofing Check
  if (domain.includes('xn--')) {
    calculatedScore += 15;
    findings.push({
      category: 'Domain Structure',
      title: 'Punycode / Internationalized Domain Detected',
      severity: 'WARNING',
      description: 'The domain uses Punycode ("xn--") encoding. While legitimate for international characters, it is commonly exploited in homograph attacks to impersonate trusted brand names.',
      riskPoints: 15
    });
  }

  // 5. Hostname Length Check
  if (domain.length > 30) {
    calculatedScore += 5;
    findings.push({
      category: 'Domain Structure',
      title: 'Unusually Long Hostname',
      severity: 'INFO',
      description: `The hostname contains ${domain.length} characters (exceeds the 30-character baseline). Abnormally long domains are sometimes engineered to mimic legitimate service names.`,
      riskPoints: 5
    });
  }

  // 6. Excessive Subdomains Check
  const hostParts = domain.split('.');
  if (hostParts.length > 4 && !isIpv4) {
    calculatedScore += 10;
    findings.push({
      category: 'Domain Structure',
      title: 'Excessive Subdomain Hierarchy',
      severity: 'WARNING',
      description: `The hostname contains ${hostParts.length - 2} levels of subdomains (${domain}). Deep subdomain trees are frequently used to stack brand names ahead of unrelated domains.`,
      riskPoints: 10
    });
  }

  // 7. Domain Hyphen Stuffing Check
  const hyphenCount = (domain.match(/-/g) || []).length;
  if (hyphenCount >= 3) {
    calculatedScore += 10;
    findings.push({
      category: 'Domain Structure',
      title: 'Multiple Hyphens in Hostname',
      severity: 'WARNING',
      description: `The domain contains ${hyphenCount} hyphens. Excessive hyphens are commonly used in deceptive lookalike domains (e.g., "secure-login-account-update").`,
      riskPoints: 10
    });
  }

  // 8. Overall URL Length Check
  if (url.length > 120) {
    calculatedScore += 15;
    findings.push({
      category: 'URL Length',
      title: 'Excessive Total URL Length',
      severity: 'WARNING',
      description: `The entire URL is ${url.length} characters long. Unusually lengthy URLs are often employed to conceal the true destination in mobile browsers or embed complex payloads.`,
      riskPoints: 15
    });
  } else if (url.length > 75) {
    calculatedScore += 10;
    findings.push({
      category: 'URL Length',
      title: 'Elevated URL Length',
      severity: 'INFO',
      description: `The URL is ${url.length} characters long, which is longer than typical web addresses.`,
      riskPoints: 10
    });
  }

  // 9. Non-Standard Port Check
  if (urlObj.port && urlObj.port !== '80' && urlObj.port !== '443') {
    calculatedScore += 10;
    findings.push({
      category: 'Network Configuration',
      title: 'Non-Standard Port Specified',
      severity: 'WARNING',
      description: `The URL connects to a non-standard port (:${urlObj.port}). Most official public consumer web applications operate on default ports (80 or 443).`,
      riskPoints: 10
    });
  }

  // 10. URL Encoding (% Hex) Check
  const percentMatches = url.match(/%[0-9a-fA-F]{2}/g) || [];
  if (percentMatches.length >= 3) {
    calculatedScore += 10;
    findings.push({
      category: 'Encoding',
      title: 'Excessive URL Percent-Encoding',
      severity: 'WARNING',
      description: `The URL contains ${percentMatches.length} hex-encoded character sequences. Attackers sometimes utilize heavy percent-encoding to evade simple text inspection filters.`,
      riskPoints: 10
    });
  }

  // 11. Sensitive / Lure Keywords Check
  const matchedKeywords: string[] = [];
  for (const kw of SENSITIVE_KEYWORDS) {
    if (fullHref.includes(kw)) {
      matchedKeywords.push(kw);
    }
  }

  if (matchedKeywords.length > 0) {
    const points = matchedKeywords.length >= 3 ? 15 : matchedKeywords.length === 2 ? 10 : 5;
    calculatedScore += points;
    findings.push({
      category: 'Content Indicators',
      title: 'Sensitive / Authentication Keywords Present',
      severity: matchedKeywords.length >= 2 ? 'WARNING' : 'INFO',
      description: `The URL contains keywords commonly associated with sensitive actions or promotional lures: [${matchedKeywords.slice(0, 5).join(', ')}]. Note: These words alone do not prove malice, but warrant closer inspection.`,
      riskPoints: points
    });
  }

  // 12. Suspicious File Extensions in Path
  const matchedExt = SUSPICIOUS_EXTENSIONS.find(ext => pathname.endsWith(ext) || pathname.includes(`${ext}/`));
  if (matchedExt) {
    calculatedScore += 15;
    findings.push({
      category: 'Executable File Download',
      title: `Executable File Pattern Detected (${matchedExt})`,
      severity: 'HIGH',
      description: `The URL path references an executable or installer file extension (${matchedExt}). Direct downloads of executable files from untrusted links carry significant security risks.`,
      riskPoints: 15
    });
  }

  // 13. Suspicious Redirect Parameters in Query String
  const redirectParams = ['redirect', 'return', 'url', 'goto', 'target', 'dest', 'next'];
  const hasRedirectQuery = redirectParams.some(param => urlObj.searchParams.has(param));
  if (hasRedirectQuery) {
    calculatedScore += 8;
    findings.push({
      category: 'Navigation & Redirection',
      title: 'Open Redirection Parameters Detected',
      severity: 'INFO',
      description: 'The query string contains URL redirection parameter names (such as "redirect", "url", or "goto"), which can sometimes be exploited in open-redirect attacks.',
      riskPoints: 8
    });
  }

  // If no negative findings were recorded, add baseline positive finding
  if (findings.length === 1 && findings[0].severity === 'SAFE') {
    findings.push({
      category: 'URL Structure',
      title: 'Conventional Domain Structure',
      severity: 'SAFE',
      description: 'The domain format and URL path adhere to standard, transparent web conventions with no anomalous syntactic structures detected.',
      riskPoints: 0
    });
  }

  // Clamp score between 0 and 100
  const finalScore = Math.min(Math.max(calculatedScore, 0), 100);

  // Determine Risk Level
  let riskLevel: RiskLevel = 'LOW';
  if (finalScore >= 60) {
    riskLevel = 'HIGH';
  } else if (finalScore >= 30) {
    riskLevel = 'MEDIUM';
  }

  // Generate standardized explanations
  let explanation = '';
  if (riskLevel === 'LOW') {
    explanation = 'The submitted URL uses HTTPS and follows a conventional domain structure. No major suspicious URL characteristics were identified by the current analysis rules.';
  } else if (riskLevel === 'MEDIUM') {
    explanation = 'The URL contains some characteristics that require caution. Review the domain carefully before entering credentials or personal information.';
  } else {
    explanation = 'The URL contains multiple characteristics commonly associated with suspicious links. Exercise strong caution and independently verify the website before entering sensitive information.';
  }

  // Generate recommendations
  const recommendations: string[] = [];
  if (riskLevel === 'LOW') {
    recommendations.push(
      'No major suspicious URL characteristics were detected. Continue to use normal browsing precautions.',
      'Always double-check the browser address bar to verify that the domain name matches your intended destination.',
      'Ensure your browser and operating system security updates are kept current.'
    );
  } else if (riskLevel === 'MEDIUM') {
    recommendations.push(
      'Use caution. Verify the domain independently before entering credentials, financial information, or personal data.',
      'Check if the domain name has unusual spellings, unexpected subdomains, or extra hyphens compared to the official brand.',
      'If you received this URL via an unexpected email, SMS, or direct message, navigate to the service directly via a bookmark or trusted search engine.'
    );
  } else {
    recommendations.push(
      'Exercise strong caution. Avoid entering passwords, financial information, or sensitive personal data unless the website\'s legitimacy is independently verified.',
      'Do not download or execute files from this link.',
      'Never trust security alerts, urgent account suspension notices, or unexpected prize claims received via unsolicited messages.',
      'If this link claims to be from your bank, email provider, or workplace, contact them through an official, verified support channel.'
    );
  }

  return {
    url,
    domain,
    riskScore: finalScore,
    riskLevel,
    findings,
    explanation,
    recommendations,
    analyzedAt: new Date().toISOString()
  };
}

export function getExplanationsAndRecommendations(riskLevel: RiskLevel) {
  let explanation = '';
  const recommendations: string[] = [];

  if (riskLevel === 'LOW') {
    explanation = 'The submitted URL uses HTTPS and follows a conventional domain structure. No major suspicious URL characteristics were identified by the current analysis rules.';
    recommendations.push(
      'No major suspicious URL characteristics were detected. Continue to use normal browsing precautions.',
      'Always double-check the browser address bar to verify that the domain name matches your intended destination.',
      'Ensure your browser and operating system security updates are kept current.'
    );
  } else if (riskLevel === 'MEDIUM') {
    explanation = 'The URL contains some characteristics that require caution. Review the domain carefully before entering credentials or personal information.';
    recommendations.push(
      'Use caution. Verify the domain independently before entering credentials, financial information, or personal data.',
      'Check if the domain name has unusual spellings, unexpected subdomains, or extra hyphens compared to the official brand.',
      'If you received this URL via an unexpected email, SMS, or direct message, navigate to the service directly via a bookmark or trusted search engine.'
    );
  } else {
    explanation = 'The URL contains multiple characteristics commonly associated with suspicious links. Exercise strong caution and independently verify the website before entering sensitive information.';
    recommendations.push(
      'Exercise strong caution. Avoid entering passwords, financial information, or sensitive personal data unless the website\'s legitimacy is independently verified.',
      'Do not download or execute files from this link.',
      'Never trust security alerts, urgent account suspension notices, or unexpected prize claims received via unsolicited messages.',
      'If this link claims to be from your bank, email provider, or workplace, contact them through an official, verified support channel.'
    );
  }

  return { explanation, recommendations };
}
