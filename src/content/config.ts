import { defineCollection } from "astro:content";
import {
  pocketbaseLoader,
  zConfigRecord,
  zEventsRecord,
  zImagesRecord,
  zKnowledgesRecord,
  zPagesRecord,
  zPlacesRecord,
  zPostsRecord,
  zProductsRecord,
  zServicesRecord,
  zTestimoniesRecord,
} from "pocketbase:astro";
import { imageFrom } from "./utils";

const config = defineCollection({
  loader: pocketbaseLoader({ collection: "config" }),
  schema: zConfigRecord,
});

const events = defineCollection({
  loader: pocketbaseLoader({ collection: "events" }),
  schema: zEventsRecord,
});

const images = defineCollection({
  loader: pocketbaseLoader({ collection: "images" }),
  schema: zImagesRecord.transform(imageFrom),
});

const knowledges = defineCollection({
  loader: pocketbaseLoader({ collection: "knowledges" }),
  schema: zKnowledgesRecord,
});

const places = defineCollection({
  loader: pocketbaseLoader({ collection: "places" }),
  schema: zPlacesRecord,
});

const pages = defineCollection({
  loader: pocketbaseLoader({ collection: "pages" }),
  schema: zPagesRecord,
});

const posts = defineCollection({
  loader: pocketbaseLoader({ collection: "posts" }),
  schema: zPostsRecord,
});

const products = defineCollection({
  loader: pocketbaseLoader({ collection: "products" }),
  schema: zProductsRecord,
});

const services = defineCollection({
  loader: pocketbaseLoader({ collection: "services" }),
  schema: zServicesRecord,
});

const testimonies = defineCollection({
  loader: pocketbaseLoader({ collection: "testimonies" }),
  schema: zTestimoniesRecord,
});

export const collections = { config, events, images, knowledges, pages, places, posts, products, services, testimonies };
