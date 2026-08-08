const fs = require('fs');
const path = require('path');

const webSrcDir = path.join(__dirname, '..', 'apps', 'web', 'src');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('.ts') || name.endsWith('.tsx')) {
      files.push(name);
    }
  }
  return files;
}

const allFiles = getFiles(webSrcDir);
let violationsCount = 0;

console.log('🔒 Auditing auth security & credential storage in frontend codebase...');

const forbiddenPatterns = [
  { pattern: 'defaultPassword', desc: 'Hardcoded staff default password field' },
  { pattern: 'afreen_pass_', desc: 'LocalStorage password caching key' },
  { pattern: 'afreen_custom_staff', desc: 'LocalStorage custom staff credential storage' },
  { pattern: 'timeout: 100', desc: '100ms auth timeout race' },
];

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(webSrcDir, filePath);
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    for (const rule of forbiddenPatterns) {
      if (line.includes(rule.pattern)) {
        console.error(`❌ [AUTH SECURITY VIOLATION] ${relPath}:${idx + 1}: ${rule.desc}`);
        console.error(`   ${line.trim()}`);
        violationsCount++;
      }
    }
  });
}

if (violationsCount > 0) {
  console.error(`\n🚨 Auth security audit failed: ${violationsCount} violation(s) detected.`);
  process.exit(1);
} else {
  console.log('\n✅ Auth security audit passed: 0 hardcoded passwords, localStorage credentials, or 100ms timeout races found.');
}
