import { format } from "@formkit/tempo";
import { PUBLIC_IMGIX_URL } from "astro:env/server";
import {
  getRecordOrThrow,
  getRecords,
  type ConfigRecord,
  type EventsRecord,
  type ImagesRecord,
  type KnowledgesRecord,
  type PagesRecord,
  type PostsRecord,
  type ProductsRecord,
  type ServicesRecord,
  type TestimoniesRecord,
} from "pocketbase:astro";

type Narrow<FROM, TO> = FROM extends undefined ? (TO extends Promise<any> ? Promise<undefined> : undefined) : TO;
export function allowUndefined<FROM, TO>(method: (defined: FROM) => TO) {
  return <F extends FROM | undefined>(possiblyUndefined: F) => (possiblyUndefined ? method(possiblyUndefined) : undefined) as Narrow<F, TO>;
}

// CONFIG **********************************************************************************************************************************
function strictConfigFrom({ collectionId, collectionName, created, updated, ...record }: ConfigRecord) {
  return record;
}
export type Config = ReturnType<typeof strictConfigFrom>;
export const configFrom = allowUndefined(strictConfigFrom);

// EVENTS **********************************************************************************************************************************
export async function strictEventFrom({ collectionId, collectionName, created, updated, ...record }: EventsRecord) {
  const [image, places, service] = await Promise.all([
    getRecordOrThrow(record.image),
    getRecords(record.places),
    getRecordOrThrow(record.service, serviceFrom),
  ]);
  return { ...record, image, places, service };
}
export type Event = Awaited<ReturnType<typeof strictEventFrom>>;
export const eventFrom = allowUndefined(strictEventFrom);

function strictItemFromEvent(event: Event) {
  const { excerpt: text, from, image, name: title, places, service, slug, to, url: href } = event;
  const features = [
    { key: "Type", value: service.name },
    { key: "Du", value: format(from, "full") },
    { key: "Au", value: format(to, "full") },
    { key: "Endroits", value: places.map(({ name }) => name).join(" ou ") },
  ];
  return { features, href, image, slug, text, title };
}
export const itemFromEvent = allowUndefined(strictItemFromEvent);

// IMAGES **********************************************************************************************************************************
function strictImageFrom({ alt, height, id, src, width }: ImagesRecord) {
  return { alt, aspectRatio: width / height, src: `${PUBLIC_IMGIX_URL}/${id}/${src}` };
}
export type Image = ReturnType<typeof strictImageFrom>;
export const imageFrom = allowUndefined(strictImageFrom);

// KNOWLEDGE *******************************************************************************************************************************
async function strictKnowledgeFrom({ collectionId, collectionName, created, updated, ...record }: KnowledgesRecord) {
  const image = await getRecordOrThrow(record.image);
  return { ...record, image };
}
export type Knowledge = Awaited<ReturnType<typeof strictKnowledgeFrom>>;
export const knowledgeFrom = allowUndefined(strictKnowledgeFrom);

function strictItemFromKnowledge(knowledge: Knowledge) {
  const { image, name: title, slug, text } = knowledge;
  return { href: `/${slug}`, image, slug, text, title };
}
export const itemFromKnowledge = allowUndefined(strictItemFromKnowledge);

export function fragmentFromKnowledge({ slug }: Knowledge) {
  return slug !== "traditions-ancestrales" ? slug : undefined;
}

export function hrefFromKnowledge({ slug }: Knowledge) {
  return "/" + (slug !== "traditions-ancestrales" ? `${slug}/` : "");
}

export function pathFromKnowledge(knowledge: Knowledge) {
  return { params: { knowledge: fragmentFromKnowledge(knowledge) } };
}

// PAGE ************************************************************************************************************************************
async function strictPageFrom({ collectionId, collectionName, created, updated, ...record }: PagesRecord) {
  const [knowledge, post, services, testimoniesImage] = await Promise.all([
    getRecordOrThrow(record.knowledge, knowledgeFrom),
    getRecordOrThrow(record.post, postFrom),
    record.services ? getRecords(record.services, { map: serviceFrom }) : [],
    record.testimoniesImage ? getRecordOrThrow(record.testimoniesImage) : undefined,
  ]);
  return { ...record, knowledge, post, services, testimoniesImage };
}
export type Page = Awaited<ReturnType<typeof strictPageFrom>>;
export const pageFrom = allowUndefined(strictPageFrom);

// POST ************************************************************************************************************************************
async function strictPostFrom(record: PostsRecord) {
  const { collectionId, collectionName, created, updated, ...rest } = record;
  const [image, knowledge] = await Promise.all([
    rest.image ? getRecordOrThrow(rest.image) : undefined,
    getRecordOrThrow(rest.knowledge, knowledgeFrom),
  ]);
  return { ...rest, image, knowledge };
}
export type Post = Awaited<ReturnType<typeof strictPostFrom>>;
export const postFrom = allowUndefined(strictPostFrom);

function strictEntryFromPost(post: Post) {
  const { image, text, title } = post;
  return { features: [], image, text, title };
}
export const entryFromPost = allowUndefined(strictEntryFromPost);

function strictItemFromPost(post: Post) {
  const { excerpt: text, image, slug, title } = post;
  if (!image) throw new Error(`Post ${slug} has no image`);
  return { href: hrefFromPost(post), image, slug, text, title };
}
export const itemFromPost = allowUndefined(strictItemFromPost);

export function hrefFromPost(post: Post) {
  return `${hrefFromKnowledge(post.knowledge)}articles/${post.slug}`;
}

export function pathFromPost({ knowledge, slug }: Post) {
  return { params: { knowledge: fragmentFromKnowledge(knowledge), collection: "articles", slug } };
}

// PRODUCT *********************************************************************************************************************************
async function strictProductFrom(record: ProductsRecord) {
  const { collectionId, collectionName, created, updated, ...rest } = record;
  const image = await getRecordOrThrow(rest.image);
  return { ...rest, image };
}
export type Product = Awaited<ReturnType<typeof strictProductFrom>>;
export const productFrom = allowUndefined(strictProductFrom);

function strictItemFromProduct(product: Product) {
  const { excerpt: text, image, name: title, slug, url: href } = product;
  if (!image) throw new Error(`Product ${slug} has no image`);
  return { features: featuresFromProduct(product), href, image, slug, text, title };
}
export const itemFromProduct = allowUndefined(strictItemFromProduct);

export function featuresFromProduct({ price }: Product) {
  return [{ key: "Tarif", value: price }];
}

// SERVICES ********************************************************************************************************************************
async function strictServiceFrom({ collectionId, collectionName, created, updated, ...record }: ServicesRecord) {
  const [image, knowledge, places] = await Promise.all([
    getRecordOrThrow(record.image),
    getRecordOrThrow(record.knowledge, knowledgeFrom),
    getRecords(record.places),
  ]);
  return { ...record, image, knowledge, places };
}
export type Service = Awaited<ReturnType<typeof strictServiceFrom>>;
export const serviceFrom = allowUndefined(strictServiceFrom);

function strictEntryFromService(service: Service) {
  const { image, name: title, text } = service;
  return { features: featuresFromService(service), image, text, title };
}
export const entryFromService = allowUndefined(strictEntryFromService);

function strictItemFromService(service: Service) {
  const { category, excerpt: text, image, name: title, slug } = service;
  return { extra: { category }, features: featuresFromService(service), href: hrefFromService(service), image, slug, text, title };
}
export const itemFromService = allowUndefined(strictItemFromService);

export function featuresFromService({ price, duration, places }: Service) {
  return [
    { key: "Tarif", value: price },
    { key: "Durée", value: duration },
    { key: "Endroits", value: places.map(({ name }) => name).join(" ou ") },
  ];
}

export function fragmentFromService({ category }: Service) {
  return { consult: "consultations" as const, training: "formations" as const, workshop: "ateliers" as const }[category];
}

export function hrefFromService(service: Service) {
  return `${hrefFromKnowledge(service.knowledge)}${fragmentFromService(service)}/${service.slug}`;
}

export function pathFromService(service: Service) {
  return { params: { knowledge: fragmentFromKnowledge(service.knowledge), collection: fragmentFromService(service), slug: service.slug } };
}

// TESTIMONIES *****************************************************************************************************************************
function strictTestimonyFrom({ collectionId, collectionName, created, updated, ...record }: TestimoniesRecord) {
  return record;
}
export type Testimony = Awaited<ReturnType<typeof strictTestimonyFrom>>;
export const testimonyFrom = allowUndefined(strictTestimonyFrom);

// TYPES ***********************************************************************************************************************************
export type Feature = {
  key: string;
  value: string;
};

export type Extra = Record<string, any> | undefined;

type StrictItem = {
  features?: Feature[];
  href: string;
  image: Image;
  slug: string;
  text: string;
  title: string;
};

export type Item<E extends Extra | undefined = undefined> = E extends undefined ? StrictItem : StrictItem & { extra: E };
export type ServiceItem = Awaited<ReturnType<typeof itemFromService>>;
