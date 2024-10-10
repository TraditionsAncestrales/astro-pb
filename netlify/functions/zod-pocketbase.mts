import { purgeCache } from "@netlify/functions";
import { z } from "zod";

export default async (request: Request) => {
  try {
    const payload = await request.json();
    const { tags } = z.object({ tags: z.string().array() }).parse(payload);
    console.log("purging", tags);
    await purgeCache({ tags });
    return new Response(JSON.stringify("ok"), { status: 200 });
  } catch (error_) {
    console.error(error_);
    return new Response(JSON.stringify("error"), { status: 500 });
  }
};
