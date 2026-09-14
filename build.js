const { execSync } = require('child_process');
const builder = require('electron-builder');
const rm = require('del');
const fs = require('fs');
const path = require('path');
const pkg = require('./package.json');

const outDir = path.resolve(__dirname, "electron-build/");

async function cleanBuildDir() {
    if (fs.existsSync(outDir)) {
        await rm(outDir, { force: true });
    }
}

async function cleanAndBuildTSC() {
    await cleanBuildDir();
    fs.mkdirSync(outDir, { recursive: true });
    execSync(`cp -r src/ ${outDir}/src/`);
    await rm(`${outDir}/**/*.ts`, { force: true });
}

async function init() {
    console.log("Starting SlackDesk build...");
    await cleanAndBuildTSC();
    try {
        await builder.build({
            config: {
                ...pkg.build,
            }
        });
        console.log("SlackDesk build completed successfully!");
    } catch (ex) {
        console.error("Build failed:", ex);
    }
}

init();
