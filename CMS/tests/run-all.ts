import { spawn, ChildProcess } from 'child_process';
import http from 'http';

function waitForUrl(url: string, timeoutMs = 300000): Promise<void> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get(url, (res) => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 500) {
          res.resume();
          resolve();
        } else {
          res.resume();
          retry();
        }
      });
      req.on('error', retry);
      req.end();
    };
    const retry = () => {
      if (Date.now() - start > timeoutMs) return reject(new Error(`Timeout waiting for ${url}`));
      setTimeout(attempt, 800);
    };
    attempt();
  });
}

function start(cmd: string, cwd: string): ChildProcess {
  const [exec, ...args] = process.platform === 'win32' ? ['cmd', '/c', cmd] : ['/bin/sh', '-lc', cmd];
  const cp = spawn(exec, args, { cwd, stdio: 'inherit' });
  return cp;
}

async function main() {
  // 1) Start backend
  const be = start('npm run dev', 'backend');
  await waitForUrl('http://localhost:3011/api/health');

  // 2) Run API tests
  const api = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['vitest', 'run', '-c', 'tests/api/vitest.config.ts'], { stdio: 'inherit' });
  const apiCode: number = await new Promise((resolve) => api.on('exit', (c) => resolve(c ?? 1)));
  if (apiCode !== 0) {
    be.kill('SIGTERM');
    process.exit(apiCode);
  }

  // 3) Start frontend
  const fe = start('npm run dev', 'frontend/admin');
  await waitForUrl('http://localhost:3010');

  // 4) Run E2E
  const e2e = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['playwright', 'test', '-c', 'tests/e2e/playwright.config.ts', '--reporter=line'], { stdio: 'inherit' });
  const e2eCode: number = await new Promise((resolve) => e2e.on('exit', (c) => resolve(c ?? 1)));

  // Cleanup
  be.kill('SIGTERM');
  fe.kill('SIGTERM');
  process.exit(e2eCode);
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
