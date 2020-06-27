import * as path from "path";

export const CONTENT_DIR = path.resolve(__dirname, "..", "content");
export const PAGES_OUT_DIR = path.resolve(__dirname, "..", "public");

export const COMPONENTS_DIR = path.join(CONTENT_DIR, "components");
export const POSTS_IN_DIR = path.join(CONTENT_DIR, "posts");
export const SCSS_DIR = path.join(CONTENT_DIR, "style");
export const PAGES_IN_DIR = path.join(CONTENT_DIR, "pages");
export const ICONS_DIR = path.join(CONTENT_DIR, "icons");
export const IMAGES_DIR = path.join(CONTENT_DIR, "images");

export const ROOT_SASS_DOC = path.join(SCSS_DIR, "main.scss");
export const CSS_DOC = path.join(PAGES_OUT_DIR, "main.css");
export const ICONS_OUT = path.join(PAGES_OUT_DIR, "icons");
export const POSTS_OUT_DIR = path.join(PAGES_OUT_DIR, "log");
export const IMAGES_OUT = path.join(PAGES_OUT_DIR, "images");