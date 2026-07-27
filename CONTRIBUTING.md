# Contributing

Notes for anyone poking around this repo, including future me.

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
- **languages** — optional, shown as small badges. Each one has to already 
  be listed in `src/sections/Projects/languages.ts`, or the build fails
- **pinned** / **pinIndex** — both optional. Set `pinned: true` to pin the 
  project above the rest; `pinIndex` breaks ties between pinned projects, lower goes first
- **links** — a list of links shown with the project, each with a `label` and `href`

Everything after the `---` is the project description, and it's rendered as-is on the page.

That's it. No code changes needed, unless you're using a language 
that isn't in listed yet. In that case, add it there first, or the build fails.

## Adding a blog post

Same idea as projects. Blog posts live in `src/content/blog/` as `.mdx` files, 
and dropping a new one in makes it show up on the Blog page automatically.

Here's what a post file looks like:

```mdx
---
title: A Title For The Post
slug: a-title-for-the-post
publishedAt: 2026-05-12T10:00
---

Your post starts here. Regular Markdown, so headings, code blocks, links, all of that works.
```

A quick rundown of the fields:

- **title** — the post's title
- **slug** — becomes the post's URL, as in `/blog/<slug>`. Keep it short and URL-friendly
- **publishedAt** — when the post went live Controls the order posts appear in, and which post is "next" or "previous"

You might notice a few other fields on published posts, like `createdAt` or `size`. You don't need 
to add those yourself — they're filled in automatically based on the file itself, so just leave them out.

That's it here too. No code changes needed, just add the file.

## Adding a question

Questions work a little differently. There's no field to sort by here, since the order 
is chosen on purpose rather than based on a date. Because of that, questions aren't picked 
up  automatically — you register them by hand in `src/content/questions/index.ts`.

To add one create a new `.mdx` file in `src/content/questions/`, 
with the question as the frontmatter `prompt` and the answer as the body:

```mdx
---
prompt: Why do you do that?
---

Because it seemed like a good idea at the time.
```

Then import it in `src/content/questions/index.ts` and add
it to the `questions` array, in whatever position makes sense.

Yes, this means an extra step compared to projects and blog posts. That's intentional.
