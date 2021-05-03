const { execSync } = require('child_process');
const path = require('path');

const tabScript = path.join(__dirname, 'tab.sh');
const args = process.argv.slice(2);

args.forEach(command => {
  execSync(`${tabScript} "cd ${process.cwd()} && pnpm run '${command}'"`);
});
