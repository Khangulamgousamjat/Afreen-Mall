const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'apps', 'web', 'public');
const darkLogo = path.join(publicDir, 'logo-dark.jpg');
const lightLogo = path.join(publicDir, 'logo-light.jpg');

console.log('Logo Asset Pipeline Status:');
console.log(`- Dark Logo exists: ${fs.existsSync(darkLogo)} (${darkLogo})`);
console.log(`- Light Logo exists: ${fs.existsSync(lightLogo)} (${lightLogo})`);
