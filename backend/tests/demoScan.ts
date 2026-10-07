import { analyzeUrl } from '../src/services/urlAnalyzer';

const sampleUrls = [
  {
    label: '1. Legitimate Secure Website',
    url: 'https://github.com/features/security'
  },
  {
    label: '2. Suspicious HTTP Site with Multiple Sensitive Keywords',
    url: 'http://login.secure-account-verification.service-update.xyz/login'
  },
  {
    label: '3. High-Risk IP Phishing URL with Executable Download',
    url: 'http://192.168.1.50/paypal.com@verify-login/secure/update-wallet.exe'
  }
];

console.log('='.repeat(70));
console.log('       FAKESHIELD - URL SECURITY SCANNER DEMO EXECUTION');
console.log('='.repeat(70));

for (const sample of sampleUrls) {
  console.log(`\n▶ [SAMPLE] ${sample.label}`);
  console.log(`  Target URL: ${sample.url}`);
  console.log('-'.repeat(70));

  try {
    const result = analyzeUrl(sample.url);

    console.log(`  Domain:          ${result.domain}`);
    console.log(`  Risk Level:      [${result.riskLevel}]`);
    console.log(`  Risk Score:      ${result.riskScore} / 100`);
    console.log(`  Analyzed At:     ${result.analyzedAt}`);
    console.log(`  Summary:         ${result.explanation}`);

    console.log('\n  Findings Detected:');
    result.findings.forEach((finding, index) => {
      const tag = `[${finding.severity}]`.padEnd(9);
      console.log(`    ${index + 1}. ${tag} ${finding.title} (+${finding.riskPoints} pts)`);
      console.log(`       Category: ${finding.category}`);
      console.log(`       Details:  ${finding.description}`);
    });

    console.log('\n  Safety Recommendations:');
    result.recommendations.forEach((rec, idx) => {
      console.log(`    • ${rec}`);
    });
  } catch (err: any) {
    console.error(`  Scan Error: ${err.message}`);
  }

  console.log('='.repeat(70));
}
