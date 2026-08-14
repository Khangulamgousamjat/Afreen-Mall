const fs = require('fs');
const path = require('path');

const pubDir = path.join(__dirname, '../apps/web/public');
const files = fs.readdirSync(pubDir);
console.log('Public files:', files);

files.forEach(f => {
  const stat = fs.statSync(path.join(pubDir, f));
  console.log(`${f}: ${(stat.size / 1024).toFixed(1)} KB`);
});
