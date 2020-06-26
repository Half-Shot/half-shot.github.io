import { render } from "nunjucks";
import { WriteStream } from "fs";

export async function renderPage(templateFilename: string, stream: WriteStream, globals: {[key: string]: string}) {
    stream.write(render(templateFilename, globals));
}