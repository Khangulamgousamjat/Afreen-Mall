const fs = require('fs');
const path = require('path');

const srcDark = `C:\\Users\\Xerox\\.gemini\\antigravity\\brain\\4c2b612a-8547-4b45-a1ba-c1070314d582\\afreen_mall_dmart_dark_logo_1785159823965.jpg`;
const srcLight = `C:\\Users\\Xerox\\.gemini\\antigravity\\brain\\4c2b612a-8547-4b45-a1ba-c1070314d582\\afreen_mall_dmart_light_logo_1785159838813.jpg`;

const destDir = `D:\\WORK\\afreen mall\\apps\\web\\public`;

if (fs.existsSync(srcDark)) {
  fs.copyFileSync(srcDark, path.join(destDir, 'dmart-logo-dark.jpg'));
  console.log('Copied dark logo');
}
if (fs.existsSync(srcLight)) {
  fs.copyFileSync(srcLight, path.join(destDir, 'dmart-logo-light.jpg'));
  console.log('Copied light logo');
}
