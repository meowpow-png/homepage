# Content

## Adding a project

Projects live in `src/content/projects/` as `.mdx` files.
Each file is one project: a bit of info about it up top, and a short write-up below.

You don't need to register a new project anywhere else.
Just add the file, and it shows up on the Projects page automatically.

Here's what a project file looks like:

```mdx
---
id: my-cool-project
title: My Cool Project
date: 2026-05-12
status: Active
languages:
  - Java
links:
  - label: GitHub
    href: https://github.com/you/my-cool-project
---

A sentence or two about what this project is and why it exists.

You can keep writing here, it's just regular Markdown.
```

A quick rundown of the fields:

- **id** — a short, unique slug for the project. Used internally, doesn't need to be pretty
- **title** — the name shown on the page
- **date** — when the project happened. Controls the sort order (newest first)
- **status** — a short label like `Active`, `Finished`, or `Experiment`
- **languages** — optional, shown as small badges. Each one must already be listed
- **pinned** — optional. Set to `true` to pin the project above the rest
- **pinIndex** — optional. Breaks ties between pinned projects, lower goes first
- **links** — a list of links shown with the project, each with a `label` and `href`

> [!NOTE]
> Using a language that isn't listed yet? Add it to [languages.ts](../src/sections/Projects/languages.ts)
> first, or the build fails.

Everything after the `---` is the project description, and it's rendered as-is on the page.

That's it. No code changes needed.

## Adding a blog post

Same idea as projects. Blog posts live in `src/content/blog/` as `.mdx` files,
and dropping a new one in makes it show up on the Blog page automatically.

Here's what a post file looks like:

```mdx
---
title: A Title For The Post
slug: a-title-for-the-post
publishedAt: 2026-05-12T10:00
description: One sentence summing up the post.
---

Your post starts here. Regular Markdown, so headings, code blocks, links, all of that works.
```

A quick rundown of the fields:

- **title** — the post's title
- **slug** — becomes the post's URL, as in `/blog/<slug>`. Keep it short and URL-friendly
- **publishedAt** — when the post went live. Controls the order posts appear in, and which post is
  "next" or "previous"
- **description** — one sentence summing up the post. Used as the page's meta description,
  so keep it short and skip the clickbait

You might notice a few other fields on published posts, like `createdAt` or `size`.
You don't need to add those yourself — they're filled in automatically
based on the file itself, so just leave them out.

That's it here too. No code changes needed, just add the file.

## Adding an image

Images live in `src/shared/assets/images/`. Prefer using `.webp` format
for photos and screenshots, `.svg` for vector art and diagrams.

Import it and reference it like any other asset.

Set width and height to the image's real pixel dimensions,
so the browser reserves the right amount of space before the
image loads instead of shifting the layout once it does

Then register the image in [prefetchImages.ts](../src/shared/routing/prefetchImages.ts):

```ts
import myImage from '@/shared/assets/images/my-image.webp'

const imageUrls = [otherImage, myImage]
```

This warms the image in the background on whatever page the visitor
lands on first, so it's already decoded and cached by the time
they reach the page that actually uses it.

> [!NOTE]
> Skipping this step isn't a bug, the image still loads fine.
> It just means visitors see it pop in instead of it being ready ahead of time.

## Adding a diagram

Add a mermaid source file to `design/diagrams/source/`, then generate the SVG:

```text
npm run generate:diagram-svgs
```

Note that it needs Chromium, so if you don't have it installed locally,
just run it through Docker Compose rather than installing on your host:

```bash
docker compose run --rm diagrams
```

That renders every file in source directory and writes
the result to `src/shared/assets/images/`.

Commit the SVG, then reference it like any other image, including registering
it in `prefetchImages.ts` (see [Adding an image](#adding-an-image)):

```mdx
import myDiagram from '@/shared/assets/images/my-diagram.svg'

<img src={myDiagram} alt="What the diagram shows" />
```

> [!NOTE]
> There's no mermaid running in the browser. The SVG is intended
> to be generated once locally, and committed. Re-run the script
> and commit the new file whenever the source changes.

## Adding a question

Questions work a little differently. There's no field to sort by here,
since the order is chosen on purpose rather than based on a date.

> [!NOTE]
> Questions aren't picked up automatically. You register them by hand in
> [index.ts](../src/content/questions/index.ts).

To add one create a new `.mdx` file in `src/content/questions/`,
with the question as the frontmatter `prompt` and the answer as the body:

```mdx
---
prompt: Why do you do that?
---

Because it seemed like a good idea at the time.
```

Then import it in [index.ts](../src/content/questions/index.ts)
and add it to the `questions` array, in whatever position makes sense.

Yes, this means an extra step compared to projects and blog posts. That's intentional.
