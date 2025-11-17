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

  const targetDir = join(project, "target");
  const releaseDirs = readdirSync(targetDir)
    .map(d => join(targetDir, d, "release"))
    .filter(p => existsSync(p));

  if (releaseDirs.length === 0) throw new Error(`No release folder found for ${crateName}`);

  const releaseDir = releaseDirs[0];
  const exeExt = process.platform === "win32" ? ".exe" : "";
  const binaryPath = join(releaseDir, crateName + exeExt);

  if (!existsSync(binaryPath)) throw new Error(`Binary not found at ${binaryPath}`);

  const destBinary = join(distDir, crateName);

  // On Windows, also create a symlink without the .exe extension
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
