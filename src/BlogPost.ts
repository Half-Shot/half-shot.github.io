import { readFile } from "fs/promises";
import MarkdownIt from "markdown-it";
import frontmatter from "front-matter";
import readingTime from "reading-time";
import { TemplateCallback, renderString } from "nunjucks";
import { promisify } from "util";
import { BuildContext } from "./pageRender";
import path from "path";
import { PAGES_OUT_DIR } from "./directories";

export interface BlogPostAttributes {
    title: string;
    published: string;
    url: string;
}

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
});

md.use(require("markdown-it-prism"));

const renderStrfunc: (data: string, globals: {[key: string]: string|object}) => Promise<string> = promisify(renderString);

export class BlogPost {
    public static async readFromFile(filename: string): Promise<BlogPost> {
        const text = await readFile(filename, "utf-8");
        const content = frontmatter<object>(text);
        return new BlogPost(content.attributes as any, content.body, filename);
    }

    constructor(public readonly attributes: BlogPostAttributes, private markdown: string, public readonly sourceFile: string) {
        attributes.url = `/log/${path.basename(sourceFile, ".md")}.html`;
    }


    public async render(buildContext: BuildContext): Promise<string> {
        const htmlContent = md.render(this.markdown);

        const blogTemplate = `
        {% extends "components/blogpost.html.njk" %}
        {% block content %}
        ${htmlContent}
        {% endblock %}
        `;

        const context =  { ...buildContext, post: {
            ...this.attributes,
            readingTime: readingTime(this.markdown),
        }};

        return renderStrfunc(blogTemplate, context);
    }
}