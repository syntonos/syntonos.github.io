export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
// Resolve a path from /public (works on GitHub Pages sub-paths too).
export const asset = (p) => (/^(https?:|data:)/.test(p) ? p : import.meta.env.BASE_URL + p.replace(/^\//, ''));
