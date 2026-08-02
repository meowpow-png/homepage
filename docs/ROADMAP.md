# Roadmap

## Milestone 1 — Deployment

### CI

Automate quality checks to ensure every change is production-ready.

- [x] Configure GitHub Actions
- [x] Build project
- [x] Run formatting checks
- [x] Run linting checks
- [x] Run type checks
- [x] Run file/dependency checks
- [x] Run tests (unit, integration, e2e)
- [x] Track and update code coverage
- [x] Generate and render job summaries

### Deployment

Prepare and automate the production deployment process.

- [x] Choose hosting platform
- [x] Configure deployment workflow
- [x] Configure production environment
- [x] Configure custom domain
- [x] Configure HTTPS

### Discoverability

Ensure the site is discoverable and displays correctly when shared.

- [x] Block staging from indexing
- [x] Prerender per-route HTML
- [x] Configure page metadata (title, description, canonical)
- [x] Configure Open Graph and Twitter/X metadata
- [x] Generate sitemap
- [x] Configure robots.txt
- [x] Configure favicon
- [x] Validate with Lighthouse SEO audit

### Performance

Validate that the site loads quickly and efficiently.

- [x] Run Lighthouse audit
- [x] Optimize images
- [x] Review bundle size
- [x] Verify caching headers
- [x] Verify compression

### Repository

Finalize the repository for long-term maintenance.

- [x] Review README and LICENSE
- [x] Block force-push and deletion on `main`

### Versioning

Set up version tracking ahead of the first release.

- [x] Create CHANGELOG.md
- [x] Set first version in package.json
- [x] Start displaying version in Footer

### Release

Perform final validation before making the site public.

- [x] Configure release automation
- [x] Verify navigation
- [x] Verify responsive layouts
- [x] Verify accessibility
- [x] Verify browser compatibility
- [x] Verify 404 handling
- [x] Verify redirects
- [ ] Publish first release
- [ ] Verify production deployment
- [ ] Validate Google indexing (Search Console)
- [ ] Verify social card previews

## Milestone 2 — Monitoring

Add visibility into production behavior and reliability.

- [ ] Configure analytics
- [ ] Configure error reporting
- [ ] Configure uptime monitoring
