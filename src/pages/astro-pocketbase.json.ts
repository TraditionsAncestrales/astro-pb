import { purgeCache } from "@netlify/functions";
import type { APIRoute } from "astro";
import { z } from "zod";

export const POST: APIRoute = async ({ request }) => {
  try {
    const payload = await request.json();
    const { tags } = z.object({ tags: z.string().array() }).parse(payload);
    await purgeCache({ tags });
    return new Response(JSON.stringify("ok"), { status: 200 });
  } catch (error_) {
    console.error(error_);
    return new Response(JSON.stringify("error"), { status: 500 });
  }
};
