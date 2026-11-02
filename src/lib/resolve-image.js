/**
 * Turns an image name written in a project file into a path inside /public.
 * (Shared by the site and by the build plugin, so both always agree.)
 *
 *   'vamp.png'                    -> images/<category>/<project>/vamp.png   (the usual case)
 *   'images/hardware/other/x.png' -> images/hardware/other/x.png            (an explicit path, used as it is)
 *   '/images/x.png'               -> images/x.png
 *   'https://example.com/x.png'   -> unchanged
 */
export function resolveRef(ref, category, slug) {
  if (typeof ref !== 'string') return ref;
  if (/^(https?:|data:|\/\/)/i.test(ref)) return ref;
  if (ref.startsWith('/')) return ref.replace(/^\/+/, '');
  if (ref.startsWith('images/')) return ref;
  return `images/${category}/${slug}/${ref}`;
}
