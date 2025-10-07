// Build guard: abort build if VITE_API_URL is missing or clearly wrong in production
// Run via: ts-node or ts-node/register; we will call it from an npm script.

// Access through globalThis to avoid needing @types/node
const g: any = globalThis as any;
const envVal = g.process?.env?.VITE_API_URL;
if (!envVal) {
  console.error('ERROR: VITE_API_URL is not set for the build.');
  g.process?.exit(1);
}
if (/localhost|127\.0\.0\.1/i.test(envVal) && g.process?.env?.NODE_ENV === 'production') {
  console.error('ERROR: VITE_API_URL points to localhost in a production build:', envVal);
  g.process?.exit(1);
}
console.log('VITE_API_URL OK ->', envVal);
