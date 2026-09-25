import fr from "./lang/fr";
import en from "./lang/en";
import { tplStr } from "./format";
import type { UIStrings } from "./types";

export const DICTS: Record<"fr" | "en", UIStrings> = { fr, en };
export type UILang = keyof typeof DICTS;

/** Look up a dotted key such as "nav.posts" in one language. */
export function tr(
  lang: UILang,
  key: string,
  vars?: Record<string, string | number>
): string {
  const value = key
    .split(".")
    .reduce<unknown>(
      (acc, part) => (acc as Record<string, unknown>)?.[part],
      DICTS[lang]
    );
  const str = typeof value === "string" ? value : key;
  return vars ? tplStr(str, vars) : str;
}

/** Both languages for a key, for markup that ships each and lets CSS choose. */
export function both(
  key: string,
  vars?: Record<string, string | number>
): Record<UILang, string> {
  return { fr: tr("fr", key, vars), en: tr("en", key, vars) };
}

/**
 * Attributes cannot be rendered twice, so the French value goes in the real
 * attribute (what no-JS and crawlers get) and the English one rides along in
 * a data-* attribute for the runtime swap.
 *
 *   <button {...i18nAttrs({ "aria-label": "a11y.openMenu" })}>
 */
export function i18nAttrs(
  map: Record<string, string | [string, string]>
): Record<string, string> {
  const out: Record<string, string> = {};
  const names: string[] = [];
  for (const [attr, spec] of Object.entries(map)) {
    const [frValue, enValue] = Array.isArray(spec)
      ? spec
      : [tr("fr", spec), tr("en", spec)];
    out[attr] = frValue;
    out[`data-l-${attr}-en`] = enValue;
    names.push(attr);
  }
  out["data-l-attrs"] = names.join(",");
  return out;
}
