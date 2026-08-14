const path = require('path');
const fs = require('fs');

async function main() {
  const publicDir = path.join(__dirname, '..', 'apps', 'web', 'public');
  const darkInput = path.join(publicDir, 'logo-dark.jpg');
  const lightInput = path.join(publicDir, 'logo-light.jpg');

  console.log('Verifying canonical logo assets:');
  console.log(`- logo-dark.jpg: ${fs.existsSync(darkInput)}`);
  console.log(`- logo-light.jpg: ${fs.existsSync(lightInput)}`);
}

main().catch(err => {
  console.error('Error verifying logos:', err);
  process.exit(1);
});
