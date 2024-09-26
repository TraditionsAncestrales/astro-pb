import type { Loader } from "astro/loaders";
import PocketBase from "pocketbase";
import type { AstroPocketbase, PocketbaseLoaderOptions } from "pocketbase:astro";

let pocketbase: AstroPocketbase;

export function pocketbaseLoader({ collection }: PocketbaseLoaderOptions): Loader {
  return {
    name: "pocketbase-loader",
    load: async ({ store, logger, meta, parseData }) => {
      const { ASTRO_POCKETBASE_ADMIN_EMAIL, ASTRO_POCKETBASE_ADMIN_PASSWORD, PUBLIC_ASTRO_POCKETBASE_URL } = import.meta.env;
      if (!ASTRO_POCKETBASE_ADMIN_EMAIL || !ASTRO_POCKETBASE_ADMIN_PASSWORD || !PUBLIC_ASTRO_POCKETBASE_URL)
        return logger.error("Environment variables not set");

      logger.info(`Loading ${collection}`);

      if (!pocketbase) {
        pocketbase = new PocketBase(PUBLIC_ASTRO_POCKETBASE_URL);
        pocketbase.autoCancellation(false);
      }

      try {
        await pocketbase.admins.authWithPassword(ASTRO_POCKETBASE_ADMIN_EMAIL, ASTRO_POCKETBASE_ADMIN_PASSWORD);

        const lastUpdatedItems = await pocketbase
          .collection(collection)
          .getList(1, 1, { fields: "updated", skipTotal: true, sort: "updated", order: "desc" });
        const lastUpdated = lastUpdatedItems.items[0]?.updated;

        if (lastUpdated !== meta.get("last-updated")) {
          logger.info(`Refreshing ${collection}`);

          meta.set("last-updated", lastUpdated);
          const items = await pocketbase.collection(collection).getFullList();
          for (const { id, updated, ...rest } of items) {
            const data = await parseData({ id, data: { id, updated, ...rest } });
            store.set({ data, digest: updated, id });
          }
        }

        logger.info(`Loaded ${collection}`);
      } catch (error) {
        logger.error(`Error fetching ${collection}: ${error}`);
        return;
      }
    },
  };
}
