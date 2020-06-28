import { promises as fs } from "fs";
import MarkdownIt from "markdown-it";
import frontmatter from "front-matter";
import readingTime from "reading-time";
import { renderString } from "nunjucks";
import { promisify } from "util";
import { BuildContext } from "./pageRender";
import path from "path";
import moment from "moment";

export interface BlogPostAttributes {
    title: string;
    subtitle?: string;
    published: string;
    url: string;
    tags?: string[];
}

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
});

type FrontMatterAttributes = {[key: string]: string};

md.use(require("markdown-it-prism"));

const renderStrfunc: (data: string, globals: {[key: string]: string|object}) => Promise<string> = promisify(renderString);

export class BlogPost {
    public static async readFromFile(filename: string): Promise<BlogPost> {
        const text = await fs.readFile(filename, "utf-8");
        const content = frontmatter<object>(text);
        const attributes: FrontMatterAttributes = content.attributes as FrontMatterAttributes;
        const tags = attributes.tags ? attributes.tags.split(" ") : [];
        return new BlogPost({
            title: attributes.title,
            subtitle: attributes.subtitle,
            tags: tags,
            published: attributes.published,
            url: "" // To be filled in,
        }, content.body, filename);
    }

    public readonly creationTime: number = 0;

    constructor(public readonly attributes: BlogPostAttributes, private markdown: string, public readonly sourceFile: string) {
        attributes.url = `/log/${path.basename(sourceFile, ".md")}.html`;
        if (this.attributes.published) {
            const ts = moment(this.attributes.published.trim());
            this.creationTime = ts.unix();
            this.attributes.published = moment(this.attributes.published.trim()).format("dddd, MMMM Do YYYY");
        }
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