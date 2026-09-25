import fs from "node:fs";
import path from "node:path";
import type { AstroIntegration } from "astro";

/**
 * With `build.format: "file"` a page is written as `<name>.html`, which
 * GitHub Pages serves at `/<name>` with a plain 200 — no trailing slash and
 * no redirect hop. The trailing-slash form has no file behind it and would
 * 404, so for every built page we also emit `<name>/index.html` that sends
 * the visitor to the canonical, slash-free URL.
 *
 * GitHub Pages resolves `/<name>` to `<name>.html` in preference to
 * `<name>/index.html`, so the stub is only ever reached through the
 * trailing-slash form. The redirect is still written defensively — guarded on
 * a trailing slash and fired at most once per session — so that a host with
 * the opposite precedence degrades to a visible link rather than a redirect
 * loop. `<link rel="canonical">` points crawlers at the real URL either way.
 */
export default function trailingSlashRedirects(): AstroIntegration {
  return {
    name: "trailing-slash-redirects",
    hooks: {
      "astro:build:done": ({ pages, dir, logger }) => {
        let written = 0;

        for (const { pathname } of pages) {
          const clean = pathname.replace(/^\/+|\/+$/g, "");
          // the root is already index.html, and 404 is served by its own path
          if (clean === "" || clean === "404") continue;

          const target = `/${clean}`;
          const stubDir = path.join(fileURLToPathSafe(dir), clean);
          const stub = path.join(stubDir, "index.html");
          if (fs.existsSync(stub)) continue; // a real page lives here already

          fs.mkdirSync(stubDir, { recursive: true });
          fs.writeFileSync(stub, redirectHtml(target), "utf8");
          written++;
        }

        logger.info(`Wrote ${written} trailing-slash redirect stubs`);
      },
    },
  };
}

function fileURLToPathSafe(dir: URL | string): string {
  return typeof dir === "string" ? dir : new URL(dir).pathname;
}

function redirectHtml(target: string): string {
  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>Redirection</title>
    <link rel="canonical" href="${target}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script>
      (function () {
        var p = location.pathname;
        if (p.length < 2 || p.charAt(p.length - 1) !== "/") return;
        // Fire once per session: if a host ever served this stub at the
        // slash-free URL too, a second hop would bounce forever.
        try {
          var k = "tsr:" + p;
          if (sessionStorage.getItem(k)) return;
          sessionStorage.setItem(k, "1");
        } catch (e) {}
        location.replace(
          p.replace(/\\/+$/, "") + location.search + location.hash
        );
      })();
    </script>
  </head>
  <body>
    <p>Cette page se trouve ici : <a href="${target}">${target}</a></p>
  </body>
</html>
`;
}
