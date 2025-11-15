import { spawn } from 'child_process';

const args = ['playwright', 'test', '-c', 'tests/e2e/playwright.config.ts'];
const cp = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', args, { stdio: 'inherit' });
cp.on('exit', (code) => process.exit(code ?? 1));
