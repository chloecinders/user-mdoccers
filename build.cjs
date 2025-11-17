const { execSync } = require("node:child_process");
const { readdirSync, existsSync, mkdirSync, copyFileSync, symlinkSync, unlinkSync } = require("node:fs");
const { join, resolve, basename } = require("path");

const projectDir = resolve(__dirname);
const preprocessorsDir = join(projectDir, "preprocessors");
const distDir = join(projectDir, "dist", "preprocessors");

mkdirSync(distDir, { recursive: true });

const projects = readdirSync(preprocessorsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => join(preprocessorsDir, d.name))
  .filter(dir => existsSync(join(dir, "Cargo.toml")));

for (const project of projects) {
  const crateName = basename(project);
  console.log(`Building ${crateName}...`);
  execSync("cargo build --release", { stdio: "inherit", cwd: project });

  const exe = crateName + (process.platform === "win32" ? ".exe" : "");

  const targetDir = join(project, "target");
  const releaseDir = readdirSync(targetDir)
    .map(f => join(targetDir, f, "release", exe))
    .filter(p => !!p && p != "/")
    .find(p => existsSync(p));

  if (!releaseDir) throw new Error(`No release folder found for ${crateName}`);

  const binaryPath = releaseDir;

  console.log(binaryPath);

  if (!existsSync(binaryPath)) throw new Error(`Binary not found at ${binaryPath}`);

  const destBinary = join(distDir, crateName);

  if (process.platform === "win32") {
    try { unlinkSync(destBinary); } catch {}
    symlinkSync(binaryPath, destBinary, "file");
    console.log(`Created symlink ${binaryPath} -> ${destBinary}`);
  } else {
    copyFileSync(binaryPath, destBinary);
    console.log(`Copied ${binaryPath} -> ${destBinary}`);
  }
}

execSync("npx vite build", { stdio: "inherit", cwd: projectDir });
execSync("mdbook build", { stdio: "inherit", cwd: projectDir });
