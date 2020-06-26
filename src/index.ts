import { readConfig, AppConfig } from "./config";
import { renderPage } from "./PageRender";
import { promises as fs,  watch, writeFile, writeFileSync } from "fs";
import * as path from "path";
import { createWriteStream } from "fs";
import express from "express";
import sass from "sass";
import { promisify } from "util";

const renderSass = promisify(sass.render);

const CONTENT_DIR = path.resolve(__dirname, "..", "content");
const SCSS_DIR = path.join(CONTENT_DIR, "style");
const ROOT_SASS_DOC = path.join(SCSS_DIR, "main.scss");
const PAGES_IN_DIR = path.join(CONTENT_DIR, "pages");
const PAGES_OUT_DIR = path.resolve(__dirname, "..", "public");
const CSS_DOC = path.join(PAGES_OUT_DIR, "main.css");

async function buildSite() {
    const config = await readConfig("./site.toml");
    const pages = await fs.readdir(PAGES_IN_DIR, { withFileTypes: true });
    writeFileSync(CSS_DOC, (await renderSass({ file: ROOT_SASS_DOC })).css);
    for (const dirEntry of pages) {
        if (!dirEntry.isFile()) {
            continue;
        }
        if (!dirEntry.name.endsWith(".njk")) {
            continue;
        }
        const inFile = path.join(PAGES_IN_DIR, dirEntry.name);
        await buildFile(inFile, config);
        const outFile = path.join(PAGES_OUT_DIR, path.basename(dirEntry.name, ".njk"));
        console.log(`Rendering ${dirEntry.name} to ${outFile}`);
        const stream = createWriteStream(outFile, { flags: "w", encoding: "utf-8"});
        await renderPage(path.join(PAGES_IN_DIR, dirEntry.name), stream, config.globals);
    }
    return config;
}

async function buildFile(inFile: string, config: AppConfig) {
    const baseName = path.basename(inFile, ".njk");
    const outFile = path.join(PAGES_OUT_DIR, baseName);
    console.log(`Rendering ${baseName} to ${outFile}`);
    const stream = createWriteStream(outFile, { flags: "w", encoding: "utf-8"});
    await renderPage(inFile, stream, config.globals);
}

async function watchSite() {
    const config = await buildSite();
    const app = express();
    app.use(express.static('public'));
    app.listen(8000, '127.0.0.1');
    console.log(`Watching for changes in ${CONTENT_DIR}. Listening on http://127.0.0.1:8000/`);
    watch(PAGES_IN_DIR, { recursive: true, }, async (eventType: string, fileName: string) => {
        console.log(eventType, fileName);
        try {
            await buildFile(path.join(PAGES_IN_DIR, fileName), config);
        } catch (ex) {
            console.log(`Error building: ${fileName}`, ex);
        }
    });
    watch(SCSS_DIR, { recursive: true, }, async (eventType: string, fileName: string) => {
        console.log(eventType, fileName);
        writeFileSync(CSS_DOC, (await renderSass({ file: ROOT_SASS_DOC })).css);
    });
}

function main(): Promise<unknown> {
    if (process.argv.includes("--watch")) {
        return watchSite();
    } else {
        return buildSite();
    }
}

main().then(() => {
    console.log("Site built");
}).catch((ex) => {
    console.error("Build failed:", ex);
});
