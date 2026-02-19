# xontable Developer Guide

This document is for package developers/maintainers.

## Architecture
- `XOnTable.tsx`: composition layer (wires hooks + components)
- `components/`: grid, header, filter menu, status bar, select menu
- `hooks/`: selection, clipboard, table model, editor overlay, filters
- `utils/`: tsv, cellKey
- `styles/`: base, filter, theme, bundle entry

## Build

```bash
cd packages/xontable
npm run build
```

Build outputs:
- `dist/*.js` and `dist/*.d.ts`
- `dist/styles/*` (copied from `src/styles`)

## Publish

```bash
cd packages/xontable
npm run build
npm publish
```

## Key Behaviors
- Selection + keyboard navigation
- Edit overlay (fixed position)
- Clipboard TSV via hidden textarea
- Fill handle drag
- Validation map by cell key
- Column groups + resizable columns
- Optional status bar

## Styling Notes
- All public styles come from `src/styles/*`
- Dark theme supports `darkThemeColors` overrides
- Status bar uses `.xontable-status*` classes

## Testing
- Run `npm run build` in `packages/xontable`
- Run `npm run build` in `apps/playground` to validate integration

## Troubleshooting
- Vite `Outdated Optimize Dep`: clear `node_modules/.vite` and run `npm run dev -- --force`
- Missing CSS: ensure `dist/styles` is copied in build
