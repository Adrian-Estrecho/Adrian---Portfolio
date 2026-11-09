// Prints the resume page to public/Adrian-Estrecho-Resume.pdf with Chrome or Edge,
// which keeps the text selectable for hiring software. Run it with `npm run resume`.
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createServer } from 'vite';

const OUTPUT = resolve('public/Adrian-Estrecho-Resume.pdf');
const wait = (ms) => new Promise((done) => setTimeout(done, ms));

const browser = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((path) => path && existsSync(path));

if (!browser) {
  console.error('Chrome or Edge was not found. Set CHROME_PATH to its location, then run this again.');
  process.exit(1);
}

const server = await createServer({ server: { port: 0 }, logLevel: 'error' });
await server.listen();
const page = new URL('resume.html', server.resolvedUrls.local[0]).href;

rmSync(OUTPUT, { force: true });
const profile = mkdtempSync(join(tmpdir(), 'resume-pdf-'));
const chrome = spawn(
  browser,
  ['--headless=new', '--disable-gpu', '--no-first-run', '--no-pdf-header-footer', '--virtual-time-budget=8000', `--user-data-dir=${profile}`, `--print-to-pdf=${OUTPUT}`, page],
  { stdio: 'ignore' },
);

// The browser can hand off to another process, so watch for the finished file.
let size = -1;
let done = false;
for (let i = 0; i < 120 && !done; i += 1) {
  await wait(500);
  const current = existsSync(OUTPUT) ? statSync(OUTPUT).size : 0;
  done = current > 0 && current === size;
  size = current;
}

chrome.kill();
await server.close();
await wait(500);
rmSync(profile, { recursive: true, force: true, maxRetries: 3 });

if (!done) {
  console.error('The PDF was not created.');
  process.exit(1);
}
console.log(`Saved ${OUTPUT}`);
process.exit(0);
