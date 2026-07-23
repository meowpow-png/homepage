# MDX Content Model

## Conventions

- Content root: `src/content/`
- Authored copy and frontmatter: MDX
- Layout, routing, and shared UI: React
- Collection entries use their frontmatter for lists and their MDX body for detail pages

## About — `/about`

- File: `src/content/about.mdx`
- Model: singleton page

```mdx
---
name: Marin
summary: Short hero introduction
---

About page prose.
```

- `name`: hero display name
- `summary`: hero summary
- Body: About prose

## Projects — `/projects` and `/projects/:slug`

- Files: `src/content/projects/*.mdx`
- Model: collection of project case studies

```mdx
---
title: Project title
slug: project-slug
summary: Short project description
cover: ./cover.png
tags:
  - TypeScript
---

Project prose and screenshots.
```

- `title`, `slug`, `summary`: project listing and detail route
- `cover`: optional listing image
- `tags`: optional project labels
- Body: case-study prose and screenshots

## Blog — `/blog` and `/blog/:slug`

- Files: `src/content/blog/*.mdx`
- Model: collection of blog posts

```mdx
---
title: Post title
slug: post-slug
summary: Short post description
publishedAt: 2026-07-23
tags:
  - Engineering
---

Post body.
```

- `title`, `slug`, `summary`: post listing and detail route
- `publishedAt`: publication date
- `tags`: optional post labels
- Body: article content

## Questions — `/questions`

- File: `src/content/questions.mdx`
- Model: singleton FAQ page

```mdx
---
title: Questions
---

<Question prompt="Question">
  Answer.
</Question>
```

- `title`: page heading
- `Question`: disclosure component supplied by the Questions section
- `prompt`: question text
- Component body: answer content

## Non-Content Pages

- Not Found: React-only
- App shell, navigation, footer, and routing: React-only
