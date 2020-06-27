---
title: Test Post
subtitle: Testing all the way
published: Friday
---

This is a post to test out the new blogging engine for my site!

Here is my BlogPost class:

```typescript
import { readFile } from "fs/promises";
import MarkdownIt from "markdown-it";
import frontmatter from "front-matter";
import readingTime from "reading-time";
import { renderString } from "nunjucks";
import { promisify } from "util";
import { BuildContext } from "./pageRender";
import path from "path";
```