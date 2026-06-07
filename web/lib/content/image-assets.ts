import { TEAM_MEMBERS } from "./team";

/** Local static image paths under public/ — single source of truth */
export const ABOUT_IMAGES = {
  hero: "/about/hero.webp",
  intro: "/about/intro.webp",
  concept: "/about/concept.webp",
  vision: "/about/vision.webp",
  mission: "/about/mission.webp",
  objectives: "/about/objectives.webp",
  policies: "/about/policies.webp",
  gallery1: "/about/gallery-1.webp",
  gallery2: "/about/gallery-2.webp",
  gallery3: "/about/gallery-3.webp",
  gallery4: "/about/gallery-4.webp",
  gallery5: "/about/gallery-5.webp",
  gallery6: "/about/gallery-6.webp",
  placeholder: "/about/placeholder.webp",
  uniqueness: "/about/uniqueness.webp",
  contact: "/about/contact.webp",
  legal: "/about/legal.webp",
  auth: "/about/auth.webp",
  authorDefault: "/about/author-default.webp",
  servicesHero: "/about/hero.webp",
  servicesBibliography: "/about/vision.webp",
  aboutHero1: "/about/gallery-1.webp",
  aboutHero2: "/about/gallery-2.webp",
  aboutHero3: "/about/gallery-3.webp",
  aboutHero4: "/about/gallery-4.webp",
  aboutHero5: "/about/gallery-5.webp",
  aboutHero6: "/about/gallery-6.webp",
  aboutHero7: "/about/concept.webp",
  aboutHero8: "/about/intro.webp",
} as const;

/** Source URLs for one-time download (Unsplash) */
export const ABOUT_IMAGE_SOURCES: Record<keyof typeof ABOUT_IMAGES, string> = {
  hero: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80&fm=webp",
  intro: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80&fm=webp",
  concept: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80&fm=webp",
  vision: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80&fm=webp",
  mission: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80&fm=webp",
  objectives: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80&fm=webp",
  policies: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80&fm=webp",
  gallery1: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80&fm=webp",
  gallery2: "https://images.unsplash.com/photo-1516979187450-637abb88f58e?w=600&q=80&fm=webp",
  gallery3: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80&fm=webp",
  gallery4: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&q=80&fm=webp",
  gallery5: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80&fm=webp",
  gallery6: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&q=80&fm=webp",
  placeholder: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=60&fm=webp",
  uniqueness: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80&fm=webp",
  contact: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&q=80&fm=webp",
  legal: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80&fm=webp",
  auth: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80&fm=webp",
  authorDefault: "https://images.unsplash.com/photo-1516979187450-637abb88f58e?w=600&q=80&fm=webp",
  servicesHero: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=80&fm=webp",
  servicesBibliography: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80&fm=webp",
  aboutHero1: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=700&q=80&fm=webp",
  aboutHero2: "https://images.unsplash.com/photo-1516979187450-637abb88f58e?w=500&q=80&fm=webp",
  aboutHero3: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&q=80&fm=webp",
  aboutHero4: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=700&q=80&fm=webp",
  aboutHero5: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=500&q=80&fm=webp",
  aboutHero6: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=500&q=80&fm=webp",
  aboutHero7: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80&fm=webp",
  aboutHero8: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=500&q=80&fm=webp",
};

export const TEAM_IMAGE_PATHS = TEAM_MEMBERS.map((m) => m.photoUrl).filter(
  (p): p is string => Boolean(p),
);

export const VERIFIED_STATIC_IMAGES: string[] = [
  ...Object.values(ABOUT_IMAGES),
  ...TEAM_IMAGE_PATHS,
];
