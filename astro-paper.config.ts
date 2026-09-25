import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://knot.gheb.dev/",
    title: "Grégoire Hébert",
    description:
      "Principal Engineer chez Les-Tilleuls.coop. Articles sur PHP, Symfony, API Platform, l'architecture logicielle, les API — et quelques détours.",
    author: "Grégoire Hébert",
    profile: "https://knot.gheb.dev/",
    ogImage: "default-og.jpg",
    lang: "fr",
    timezone: "Europe/Paris",
    dir: "ltr",
  },
  posts: {
    perPage: 8,
    perIndex: 5,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    // The posts predate this repo layout, so "edit on GitHub" links would 404.
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/GregoireHebert" },
    { name: "mastodon", url: "https://piaille.fr/@gheb_dev" },
    { name: "x", url: "https://www.twitter.com/gheb_dev" },
    { name: "linkedin", url: "https://www.linkedin.com/in/gregoirehebert/" },
    { name: "mail", url: "mailto:contact@gheb.dev" },
  ],
  shareLinks: [
    { name: "mastodon", url: "https://toot.kytta.dev/?text=" },
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "linkedin", url: "https://www.linkedin.com/sharing/share-offsite/?url=" },
    { name: "mail", url: "mailto:?subject=À%20lire&body=" },
  ],
});
