import { configure, Environment, TemplateCallback } from "nunjucks";
import { WriteStream } from "fs";
import { promisify } from "util";
import MarkdownIt from "markdown-it";
import { BlogPostAttributes } from "./BlogPost";

let env: Environment;
let renderfunc: (page: string, globals: any) => Promise<TemplateCallback<string>>;

export interface BuildContext {
    globals: {[key: string]: string|object};
    blogPosts: BlogPostAttributes[];
}

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
});

export function configureRenderer(isWatching: boolean, rootPath: string) {
    env = configure(rootPath, {
        noCache: isWatching,
    });
    renderfunc = promisify(env.render).bind(env) as any;
}


export async function renderPage(templateFilename: string, stream: WriteStream, context: BuildContext) {
    const data = await renderfunc(templateFilename, context);
    stream.write(data);
}