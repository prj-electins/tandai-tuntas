import fs from 'node:fs';
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const source = fs.readFileSync('lib/version.ts', 'utf8');
if (!source.includes(`APP_VERSION = '${pkg.version}'`) && !source.includes(`APP_VERSION='${pkg.version}'`)) {
  if (!new RegExp(`APP_VERSION\\s*=\\s*['\"]${pkg.version.replaceAll('.', '\\.')}['\"]`).test(source)) throw new Error('Versi tampilan tidak sesuai package.json');
}
const tag = process.env.RELEASE_TAG;
if (tag && tag !== `v${pkg.version}`) throw new Error('Tag harus v' + pkg.version);
console.log('Version verified:', pkg.version);
