import { spawn } from 'child_process';

const cp = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['vitest', 'run', '-c', 'tests/api/vitest.config.ts'], {
  stdio: 'inherit',
});

cp.on('exit', (code) => process.exit(code ?? 1));
