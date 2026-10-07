import { test, describe } from 'node:test';
import assert from 'node:assert';
import { analyzeUrl } from '../src/services/urlAnalyzer';
import { normalizeAndValidateUrl } from '../src/utils/validation';

describe('URL Validation & Normalization', () => {
  test('rejects empty input', () => {
    const res = normalizeAndValidateUrl('');
    assert.strictEqual(res.isValid, false);
  });

  test('rejects dangerous javascript: scheme', () => {
    const res = normalizeAndValidateUrl('javascript:alert(1)');
    assert.strictEqual(res.isValid, false);
    assert.match(res.error || '', /Disallowed URL scheme/);
  });

  test('rejects data: URI', () => {
    const res = normalizeAndValidateUrl('data:text/html,<script>alert(1)</script>');
    assert.strictEqual(res.isValid, false);
  });

  test('normalizes domain without scheme to https://', () => {
    const res = normalizeAndValidateUrl('example.com');
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.normalizedUrl, 'https://example.com/');
  });

  test('retains http:// protocol when explicitly specified', () => {
    const res = normalizeAndValidateUrl('http://insecure-site.org');
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.normalizedUrl, 'http://insecure-site.org/');
  });
});

describe('URL Risk Analyzer & Scoring Engine', () => {
  test('evaluates safe HTTPS URL with LOW risk', () => {
    const result = analyzeUrl('https://example.com');
    assert.strictEqual(result.riskLevel, 'LOW');
    assert.ok(result.riskScore < 30);
    assert.strictEqual(result.domain, 'example.com');
    assert.ok(result.findings.some(f => f.category === 'Protocol & Encryption' && f.severity === 'SAFE'));
  });

  test('flags HTTP with elevated risk', () => {
    const result = analyzeUrl('http://example.com');
    assert.ok(result.riskScore >= 20);
    assert.ok(result.findings.some(f => f.title === 'Unencrypted HTTP Protocol' && f.riskPoints === 20));
  });

  test('flags IP address hostname with HIGH risk finding', () => {
    const result = analyzeUrl('http://192.168.1.10/login');
    // HTTP (+20) + IP (+25) + login keyword (+5) = at least 50 points (MEDIUM or HIGH)
    assert.ok(result.riskScore >= 50);
    assert.ok(result.findings.some(f => f.title === 'IP Address Used as Hostname' && f.severity === 'HIGH'));
    assert.ok(result.findings.some(f => f.category === 'Content Indicators'));
  });

  test('flags embedded userinfo / @ symbol', () => {
    const result = analyzeUrl('https://paypal.com@malicious-redirect.com/update');
    assert.ok(result.riskScore >= 20);
    assert.ok(result.findings.some(f => f.title.includes('@ Symbol')));
  });

  test('flags Punycode domain', () => {
    const result = analyzeUrl('https://xn--pple-43d.com');
    assert.ok(result.findings.some(f => f.title.includes('Punycode')));
  });

  test('flags excessive subdomains and multiple keywords', () => {
    const result = analyzeUrl('http://login.secure.verify.account.paypal.portal.fake.com/password/claim-bonus');
    assert.strictEqual(result.riskLevel, 'HIGH');
    assert.ok(result.riskScore >= 60);
    assert.ok(result.findings.some(f => f.title === 'Excessive Subdomain Hierarchy'));
    assert.ok(result.findings.some(f => f.title.includes('Sensitive / Authentication Keywords')));
  });

  test('flags non-standard port and suspicious file download', () => {
    const result = analyzeUrl('http://update-system.org:8080/setup-installer.exe');
    assert.ok(result.riskScore >= 45);
    assert.ok(result.findings.some(f => f.title === 'Non-Standard Port Specified'));
    assert.ok(result.findings.some(f => f.title.includes('Executable File Pattern Detected')));
  });

  test('clamps risk score between 0 and 100', () => {
    // Highly exaggerated suspicious URL
    const extremeUrl = 'http://10.0.0.1:8888/verify/login/update/password/banking/wallet/claim/bonus/urgent.exe?redirect=evil.com&user=%20%20%20';
    const result = analyzeUrl(extremeUrl);
    assert.ok(result.riskScore <= 100);
    assert.strictEqual(result.riskLevel, 'HIGH');
  });
});
