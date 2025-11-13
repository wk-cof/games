import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const appsDir = path.join(rootDir, 'apps');
const distDir = path.join(rootDir, 'dist');

async function directoryNames(baseDir) {
  const entries = await readdir(baseDir, { withFileTypes: true });
  return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
}

async function ensureBuilt(appName) {
  const appDist = path.join(appsDir, appName, 'dist');
  try {
    const info = await stat(appDist);
    if (!info.isDirectory()) {
      throw new Error(`Expected ${appDist} to be a directory.`);
    }
  } catch (error) {
    throw new Error(`Missing build output for app \"${appName}\". Run pnpm -C apps/${appName} build first.`, { cause: error });
  }
}

async function copyHomeContents(from, to) {
  const entries = await readdir(from, { withFileTypes: true });
  for (const entry of entries) {
    const sourcePath = path.join(from, entry.name);
    const targetPath = path.join(to, entry.name);
    await cp(sourcePath, targetPath, { recursive: entry.isDirectory() });
  }
}

async function copyApp(appName) {
  const from = path.join(appsDir, appName, 'dist');
  if (appName === 'home') {
    await copyHomeContents(from, distDir);
    return 'root';
  }
  const to = path.join(distDir, appName);
  await cp(from, to, { recursive: true });
  return appName;
}

async function main() {
  const apps = await directoryNames(appsDir);
  if (apps.length === 0) {
    console.warn('No apps directory found to bundle.');
    return;
  }

  await rm(distDir, { recursive: true, force: true });
  await mkdir(distDir, { recursive: true });

  for (const app of apps) {
    await ensureBuilt(app);
    const target = await copyApp(app);
    console.log(`✔ packaged ${app}${target === 'root' ? ' (root)' : ''}`);
  }

  console.log(`All apps bundled into ${path.relative(rootDir, distDir)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
