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

console.log('🔍 Auditing frontend source files for fake-success and client-side ID generation in catch blocks...');

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(webSrcDir, filePath);
  const lines = content.split('\n');

  // Check 1: Date.now().toString().slice(-6) in files
  lines.forEach((line, idx) => {
    if (line.includes('Date.now().toString().slice(-6)')) {
      console.error(`❌ [FAKE ID GENERATION] ${relPath}:${idx + 1}: ${line.trim()}`);
      violationsCount++;
    }
  });

  // Check 2: catch blocks containing onSuccess or onClose without checking errors
  const catchRegex = /catch\s*(?:\([^)]*\))?\s*\{([^}]*)\}/g;
  let match;
  while ((match = catchRegex.exec(content)) !== null) {
    const catchBody = match[1];
    if (
      (catchBody.includes('onSuccess(') || catchBody.includes('onClose(')) &&
      !catchBody.includes('setError(') &&
      !catchBody.includes('getApiErrorMessage(')
    ) {
      // Find line number
      const lineNo = content.substring(0, match.index).split('\n').length;
      console.error(`❌ [FABRICATED SUCCESS IN CATCH] ${relPath}:${lineNo}: Catch block executes success callback on error:`);
      console.error(`   ${match[0].replace(/\n/g, ' ')}`);
      violationsCount++;
    }
  }
}

if (violationsCount > 0) {
  console.error(`\n🚨 Audit failed: ${violationsCount} fake-success violation(s) detected.`);
  process.exit(1);
} else {
  console.log('\n✅ Audit passed: 0 fake-success or client-side fake ID generation violations found.');
}
