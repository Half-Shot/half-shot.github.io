import { readConfig, AppConfig } from "./config";
import { renderPage, configureRenderer, BuildContext } from "./pageRender";
import { createWriteStream, promises as fs } from "fs";
import { PAGES_IN_DIR, ROOT_SASS_DOC, CSS_DOC, CONTENT_DIR, COMPONENTS_DIR, SCSS_DIR, ICONS_DIR, ICONS_OUT, PAGES_OUT_DIR, POSTS_IN_DIR, POSTS_OUT_DIR, IMAGES_DIR, IMAGES_OUT } from "./directories";
import ncpSync from "ncp";
import chokidar from "chokidar";
import { BlogPost } from "./BlogPost";
import * as path from "path";
import express from "express";
import sass from "sass";
import { promisify } from "util";

const renderSass = promisify(sass.render);
const ncp = promisify(ncpSync);

async function findAllInDir(dir: string, extension: string) {
    const files = await fs.readdir(dir, { withFileTypes: true });
    return files.filter((dirEntry) => 
        dirEntry.isFile() && dirEntry.name.endsWith(extension)
    ).map((dirEntry) => path.join(dir, dirEntry.name));
}

async function buildSite(config: AppConfig): Promise<BuildContext> {
    const blogPosts = await Promise.all((await findAllInDir(POSTS_IN_DIR, ".md")).map(name => BlogPost.readFromFile(name)));
    const context = {
        globals: config.globals,
        blogPosts: blogPosts.sort((postA, postB) => postB.creationTime - postA.creationTime).map(b => b.attributes),
    };
    for (const post of blogPosts) {
        await buildBlogPost(post, context);
    }
    for (const page of await findAllInDir(PAGES_IN_DIR, ".njk")) {
        await buildPage(page, context);
    }
    await fs.writeFile(CSS_DOC, (await renderSass({ file: ROOT_SASS_DOC })).css);
    await ncp(IMAGES_DIR, IMAGES_OUT);
    await ncp(ICONS_DIR, ICONS_OUT);
    return context;
}

async function buildPage(inFile: string, context: BuildContext) {
    const baseName = path.basename(inFile, ".njk");
    const outFile = path.join(PAGES_OUT_DIR, baseName);
    console.log(`Rendering page ${baseName} to ${outFile}`);
    const stream = createWriteStream(outFile, { flags: "w", encoding: "utf-8"});
    try {
        await renderPage(inFile, stream, context);
    } finally {
        stream.close();
    }
}

async function buildBlogPost(blogPost: BlogPost, context: BuildContext) {
    const baseName = path.basename(blogPost.sourceFile, ".md");
    const outFile = path.join(POSTS_OUT_DIR, baseName) + ".html";
    console.log(`Rendering post ${baseName} to ${outFile}`);
    const stream = createWriteStream(outFile, { flags: "w", encoding: "utf-8"});
    try {
        stream.write(await blogPost.render(context));
        return blogPost;
    } finally {
        stream.close();
    }
}

async function watchSite(config: AppConfig) {
    let context = await buildSite(config);
    const app = express();
    app.use(express.static('public'));
    app.listen(8000, '127.0.0.1');
    console.log(`Watching for changes in ${CONTENT_DIR}. Listening on http://127.0.0.1:8000/`);
    chokidar.watch(PAGES_IN_DIR).on('all', async (eventType, fileName) => {
        console.log("page", eventType, fileName);
        if (eventType === "addDir" || eventType === "unlinkDir") {
            return;
        }
        try {
            await buildPage(fileName, context);
        } catch (ex) {
            console.log(`Error building: ${fileName}`, ex);
        }
    });
    chokidar.watch(POSTS_IN_DIR).on('all', async (eventType: string, fileName: string) => {
        console.log("post", eventType, fileName);
        if (eventType === "addDir" || eventType === "unlinkDir") {
            return;
        }
        try {
            const blogPost = await BlogPost.readFromFile(fileName);
            await buildBlogPost(blogPost, context);
        } catch (ex) {
            console.log(`Error building: ${fileName}`, ex);
        }
    });
    let buildInProgress = false;
    chokidar.watch(COMPONENTS_DIR).on('all', async (eventType: string, fileName: string) => {
        if (buildInProgress) {
            return;
        }
        console.log("component", eventType, fileName);
        try {
            buildInProgress = true;
            context = await buildSite(config);
        } catch (ex) {
            console.log(`Error building site`, ex);
        } finally {
            buildInProgress = false;
        }
    });
    chokidar.watch(SCSS_DIR).on('all', async (eventType: string, fileName: string) => {
        console.log(eventType, fileName);
        await fs.writeFile(CSS_DOC, (await renderSass({ file: ROOT_SASS_DOC })).css);
    });
    chokidar.watch("./site.toml").on('all', async (eventType: string, fileName: string) => {
        console.log(eventType, fileName);
        config = await readConfig("./site.toml");
    });
}

async function main(): Promise<unknown> {
    const config = await readConfig("./site.toml");
    if (process.argv.includes("--watch")) {
        configureRenderer(true, CONTENT_DIR);
        return watchSite(config);
    } else {
        configureRenderer(false, CONTENT_DIR);
        return buildSite(config);
    }
}

main().then(() => {
    console.log("Site built");
}).catch((ex) => {
    console.error("Build failed:", ex);
});
