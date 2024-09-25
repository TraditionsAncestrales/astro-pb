import { purgeCache, type Config } from "@netlify/functions";
import { z } from "zod";

export default async (request: Request) => {
  try {
    const payload = await request.json();
    const { tags } = z.object({ tags: z.string().array() }).parse(payload);
    await purgeCache({ tags });
  } catch (error_) {
    console.error(error_);
  }
};

export const config: Config = {
  path: "/astro-pocketbase",
};
