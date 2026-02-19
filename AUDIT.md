# Audit Report (xontable)

Date: 2026-02-19
Scope: `packages/xontable` library and consumer integration notes.

## Summary
The codebase is generally stable, but there are a few operational and publish-time risks that can cause consumer errors if steps are missed. No in-repo TODO/FIXME markers found.

## Findings
1. **Publish pipeline dependency on build step**
   - The package exports point to `dist/*`, so `npm run build` must be run before publishing. If `dist` is missing or stale, consumers will fail at runtime.

2. **CSS assets must be published**
   - The library imports `./styles/xontable.css` from `dist`. The build step must copy **all** CSS files into `dist/styles` to avoid module resolution errors in Vite/ESBuild.

3. **Peer dependency strictness**
   - `react`, `react-dom`, and `lucide-react` are peer dependencies. Consumer apps that do not have them installed (or are on an incompatible React version) will fail.

4. **Vite optimize cache false errors**
   - Consumers may see `Outdated Optimize Dep` after upgrading. This is a tooling cache issue, not a package issue. Clearing `node_modules/.vite` and running `npm run dev -- --force` resolves it.

## Recommendations
- Always run `npm run build` before `npm publish`.
- Ensure `dist/styles` is present in the published package.
- Mention required peer dependencies in docs and error guidance.
- Provide troubleshooting steps for Vite cache in README.

## Checklist (Pre-Publish)
- [ ] `npm run build` succeeded
- [ ] `dist/` exists and includes `dist/styles/xontable.css` + related CSS
- [ ] Version bumped in `packages/xontable/package.json`
- [ ] `CHANGELOG.md` updated for the version
- [ ] `npm pack` contents verified (optional)
- [ ] `npm publish` executed from `packages/xontable`

## Checklist (Consumer Debug)
- [ ] `import "xontable/styles";` present
- [ ] `react`, `react-dom`, `lucide-react` installed
- [ ] Clear Vite cache: remove `node_modules/.vite` then `npm run dev -- --force`

## Status
- No TODO/FIXME markers found in source.
- Build checks run:
  - `packages/xontable`: `npm run build` (OK)
  - `apps/playground`: `npm run build` (OK)
