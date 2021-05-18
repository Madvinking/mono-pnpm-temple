const { execSync } = require('child_process');
const { join } = require('path');

const [dest] = process.argv.splice(2);
const rootDir = join(__dirname, '../');
const filesToCopy = ['.eslintrc.cjs', 'jest.config.cjs', '.prettierrc.cjs'].map(f => join(rootDir, f)).join(' ');

execSync(`mkdir -p ${dest} && cp -r ${filesToCopy} ${join(process.cwd(), dest)}`);
