import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

/* This sandbox has no root/sudo, so Chrome's usual "apt install <deps>" story does not work.
   `apt-get download <pkg>` and `dpkg-deb -x` both work unprivileged, so we vendor the handful
   of shared libraries the puppeteer-managed Chrome needs into a user-cache directory once, and
   point LD_LIBRARY_PATH at it. Safe to run every time, it skips work once the cache exists. */

const PUPPETEER_CACHE = join(homedir(), ".cache", "puppeteer", "chrome");
const LIBS_ROOT = join(homedir(), ".cache", "qa-chrome-libs", "root");
// exact set proven to satisfy `ldd` on this Chrome build (6 direct + 3 transitive deps of libcups)
const REQUIRED_DEBS = [
  "libatk1.0-0t64",
  "libatk-bridge2.0-0t64",
  "libatspi2.0-0t64",
  "libcups2t64",
  "libasound2t64",
  "libxdamage1",
  "libxres1",
  "libavahi-client3",
  "libavahi-common3",
];

function findChrome() {
  if (!existsSync(PUPPETEER_CACHE)) return null;
  const versions = readdirSync(PUPPETEER_CACHE).sort().reverse();
  for (const v of versions) {
    const p = join(PUPPETEER_CACHE, v, "chrome-linux64", "chrome");
    if (existsSync(p)) return p;
  }
  return null;
}

function installChrome() {
  execSync("npx --yes puppeteer browsers install chrome", { stdio: "inherit" });
  const p = findChrome();
  if (!p) throw new Error("puppeteer browsers install chrome did not produce a chrome binary");
  return p;
}

function libDirsResolve(execPath, extraLibDir) {
  const env = extraLibDir ? { ...process.env, LD_LIBRARY_PATH: extraLibDir } : process.env;
  const out = execFileSync("ldd", [execPath], { env }).toString();
  return !out.includes("not found");
}

function vendorLibs() {
  const debDir = join(homedir(), ".cache", "qa-chrome-libs", "debs");
  mkdirSync(debDir, { recursive: true });
  mkdirSync(LIBS_ROOT, { recursive: true });
  for (const pkg of REQUIRED_DEBS) {
    const already = readdirSync(debDir).some((f) => f.startsWith(pkg + "_"));
    if (!already) {
      execSync(`apt-get download ${pkg}`, { cwd: debDir, stdio: "inherit" });
    }
  }
  for (const f of readdirSync(debDir)) {
    if (f.endsWith(".deb")) execSync(`dpkg-deb -x ${JSON.stringify(f)} ${JSON.stringify(LIBS_ROOT)}`, { cwd: debDir });
  }
  const candidates = [
    join(LIBS_ROOT, "usr", "lib", "x86_64-linux-gnu"),
    join(LIBS_ROOT, "lib", "x86_64-linux-gnu"),
  ].filter((d) => existsSync(d));
  return candidates.join(":");
}

export async function ensureBrowser() {
  const executablePath = findChrome() || installChrome();
  if (libDirsResolve(executablePath)) {
    return { executablePath, env: process.env };
  }
  const ldPath = vendorLibs();
  if (!libDirsResolve(executablePath, ldPath)) {
    throw new Error(`vendored libs at ${ldPath} still do not satisfy ldd for ${executablePath}`);
  }
  return { executablePath, env: { ...process.env, LD_LIBRARY_PATH: ldPath } };
}
