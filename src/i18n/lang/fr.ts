import type { UIStrings } from "../types";

export default {
  nav: {
    home: "Accueil",
    posts: "Articles",
    tags: "Tags",
    about: "À propos",
    memex: "Memex",
    hireMe: "Me recruter",
    archives: "Archives",
    search: "Rechercher",
  },
  post: {
    publishedAt: "Publié le",
    updatedAt: "Mis à jour le",
    sharePostIntro: "Partager cet article :",
    sharePostOn: "Partager cet article sur {{platform}}",
    sharePostViaEmail: "Partager cet article par e-mail",
    tagLabel: "Tags",
    backToTop: "Haut de page",
    goBack: "Retour",
    editPage: "Modifier la page",
    previousPost: "Article précédent",
    nextPost: "Article suivant",
  },
  pagination: {
    prev: "Précédent",
    next: "Suivant",
    page: "Page",
  },
  home: {
    socialLinks: "Me suivre",
    featured: "À la une",
    recentPosts: "Articles récents",
    allPosts: "Tous les articles",
  },
  footer: {
    copyright: "Copyright",
    allRightsReserved: "Tous droits réservés.",
  },
  pages: {
    tagTitle: "Tag",
    tagDesc: "Tous les articles portant le tag",

    tagsTitle: "Tags",
    tagsDesc: "Tous les tags utilisés dans les articles.",

    postsTitle: "Articles",
    postsDesc: "Tous les articles publiés ici.",

    archivesTitle: "Archives",
    archivesDesc: "Tous les articles, classés par date.",

    searchTitle: "Rechercher",
    searchDesc: "Rechercher un article…",
  },
  a11y: {
    skipToContent: "Aller au contenu",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    toggleTheme: "Changer de thème",
    searchPlaceholder: "Rechercher un article…",
    noResults: "Aucun résultat",
    goToPreviousPage: "Aller à la page précédente",
    goToNextPage: "Aller à la page suivante",
  },
  notFound: {
    title: "404 — Page introuvable",
    message: "Mamaaaan ? Je suis perdu !",
    goHome: "Revenir à l'accueil",
  },
} satisfies UIStrings;
