import netlify from "@astrojs/netlify";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import { imageService } from "@unpic/astro/service";
import icon from "astro-icon";
import superforms from "astro-superforms";
import { defineConfig, envField } from "astro/config";
import { FontaineTransform } from "fontaine";
import simpleStackQuery from "simple-stack-query";

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  output: "server",

  image: {
    service: imageService({
      placeholder: "blurhash",
    }),
  },

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    svelte(),
    icon({
      include: {
        bi: ["envelope-plus", "phone", "pin-map"],
        ph: ["at", "facebook-logo-thin", "instagram-logo-thin", "list", "youtube-logo-thin"],
      },
    }),
    simpleStackQuery(),
    superforms(),
  ],

  vite: {
    plugins: [
      //@ts-expect-error
      FontaineTransform.vite({
        fallbacks: ["Arial"],
        resolvePath: (id) => new URL(id.startsWith("/") ? `public/${id.slice(1)}` : `node_modules/${id}`, import.meta.url),
      }),
    ],
  },

  env: {
    schema: {
      MAILCHIMP_API_KEY: envField.string({ context: "server", access: "secret" }),
      MAILCHIMP_LIST_ID: envField.string({ context: "server", access: "secret" }),
      MAILCHIMP_SERVER: envField.string({ context: "server", access: "secret" }),
      PUBLIC_IMGIX_URL: envField.string({ context: "server", access: "public" }),
      RESEND_API_KEY: envField.string({ context: "server", access: "secret" }),
      ZOD_POCKETBASE_ADMIN_EMAIL: envField.string({ context: "server", access: "secret" }),
      ZOD_POCKETBASE_ADMIN_PASSWORD: envField.string({ context: "server", access: "secret" }),
      ZOD_POCKETBASE_URL: envField.string({ context: "server", access: "public" }),
    },
  },
});
