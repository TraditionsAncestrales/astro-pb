import { allowUndefined } from "@/lib/pocketbase/utils";
import {
  getRecordOrThrow,
  getRecords,
  type EventsRecord,
  type KnowledgesRecord,
  type PagesRecord,
  type PostsRecord,
  type ProductsRecord,
  type ServicesRecord,
} from "pocketbase:astro";

// EVENTS **********************************************************************************************************************************
async function strictEventFrom(record: EventsRecord) {
  const [image, places, service] = await Promise.all([
    getRecordOrThrow(record.image),
    getRecords(record.places),
    getRecordOrThrow(record.service, serviceFrom),
  ]);
  return { ...record, image, places, service };
}
export type Event = Awaited<ReturnType<typeof strictEventFrom>>;
export const eventFrom = allowUndefined(strictEventFrom);

// KNOWLEDGE *******************************************************************************************************************************
async function strictKnowledgeFrom(record: KnowledgesRecord) {
  const image = await getRecordOrThrow(record.image);
  return { ...record, image };
}
export type Knowledge = Awaited<ReturnType<typeof strictKnowledgeFrom>>;
export const knowledgeFrom = allowUndefined(strictKnowledgeFrom);

// PAGE ************************************************************************************************************************************
async function strictPageFrom(record: PagesRecord) {
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
  const [image, knowledge] = await Promise.all([
    record.image ? getRecordOrThrow(record.image) : undefined,
    getRecordOrThrow(record.knowledge, knowledgeFrom),
  ]);
  return { ...record, image, knowledge };
}
export type Post = Awaited<ReturnType<typeof strictPostFrom>>;
export const postFrom = allowUndefined(strictPostFrom);

// PRODUCT *********************************************************************************************************************************
async function strictProductFrom(record: ProductsRecord) {
  const image = await getRecordOrThrow(record.image);
  return { ...record, image };
}
export type Product = Awaited<ReturnType<typeof strictProductFrom>>;
export const productFrom = allowUndefined(strictProductFrom);

// SERVICES ********************************************************************************************************************************
async function strictServiceFrom(record: ServicesRecord) {
  const [image, knowledge, places] = await Promise.all([
    getRecordOrThrow(record.image),
    getRecordOrThrow(record.knowledge, knowledgeFrom),
    getRecords(record.places),
  ]);
  return { ...record, image, knowledge, places };
}
export type Service = Awaited<ReturnType<typeof strictServiceFrom>>;
export const serviceFrom = allowUndefined(strictServiceFrom);
