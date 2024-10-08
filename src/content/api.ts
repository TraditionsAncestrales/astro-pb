import { eventFrom, knowledgeFrom, pageFrom, postFrom, productFrom, serviceFrom } from "@/content/utils";
import { isAfter } from "@formkit/tempo";
import { getRecord, getRecordOrThrow, getRecords } from "pocketbase:astro";
import type { HelpersFromOpts } from "zod-pocketbase";

// LAYOUT **********************************************************************************************************************************
export async function getLayoutRecords(_opts: HelpersFromOpts) {
  // const zKnowledge = select(zKnowledgesRecord, ["name", "slug", "text"], { image: zRef.transform(getRecord) });

  const [config, knowledges, organizationPost] = await Promise.all([
    getRecordOrThrow({ collection: "config", id: "fedcba987654321" }),
    getRecords("knowledges", { map: (record) => knowledgeFrom(record) }),
    getRecordOrThrow({ collection: "posts", slug: "l-association" }, postFrom),
  ]);
  return { config, knowledges, organizationPost };
}

// KNOWLEDGE PAGE **************************************************************************************************************************
export async function getKnowledgePageEntriesRecords(_opts: HelpersFromOpts) {
  const knowledges = await getRecords("knowledges", { map: (record) => knowledgeFrom(record) });
  return { knowledges };
}

export async function getKnowledgePageRecords(knowledge: string, _opts: HelpersFromOpts) {
  const [events, page, testimonies] = await Promise.all([
    getRecords("events", {
      filter: ({ from }) => isAfter(from, new Date()),
      map: (record) => eventFrom(record),
    }),
    getRecordOrThrow({ collection: "pages", slug: knowledge }, pageFrom),
    knowledge === "traditions-ancestrales" ? getRecords("testimonies") : [],
  ]);
  return { events, page, testimonies };
}

// KNOWLEDGE COLLECTION SLUG PAGE **********************************************************************************************************
export async function getKnowledgeCollectionSlugPageEntriesRecords(_opts: HelpersFromOpts) {
  const [posts, services] = await Promise.all([
    getRecords("posts", { map: (record) => postFrom(record) }),
    getRecords("services", { map: (record) => serviceFrom(record) }),
  ]);
  return { posts, services };
}

export async function getKnowledgeCollectionSlugPageRecords(collection: string, slug: string, _opts: HelpersFromOpts) {
  const entry = await (collection === "articles"
    ? getRecord({ collection: "posts", slug }, postFrom)
    : getRecord({ collection: "services", slug }, serviceFrom));
  return { entry };
}

// SHOP PAGE *******************************************************************************************************************************
export async function getShopPageRecords(_opts: HelpersFromOpts) {
  const products = await getRecords("products", { map: (record) => productFrom(record) });
  return { products };
}
