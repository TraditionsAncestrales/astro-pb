import { resend } from "@/lib/resend";
import { type Message, zContactValues, zNewsletterValues } from "@/lib/utils";
import mailchimp from "@mailchimp/mailchimp_marketing";
import { MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID, MAILCHIMP_SERVER } from "astro:env/server";
import md5 from "md5";
import { defineAsfAction } from "superforms:astro";
import { message } from "sveltekit-superforms";

export const server = {
  sendMessage: defineAsfAction({
    input: zContactValues,
    handler: async ({ email, fullname, message: content }, { form }) => {
      const { error } = await resend.emails.send({
        from: "contact@traditionsancestrales.fr",
        to: "niama.traditions.ancestrales@gmail.com",
        subject: "Formulaire de contact",
        html: `<dl><dt>Nom :</dt><dd>${fullname}</dd><dt>Courriel :</dt><dd>${email}</dd><dt>Message :</dt><dd>${content}</dd></dl>`,
      });
      if (error) return message<Message>(form, "BAD_REQUEST", { status: 400 });
      return message<Message>(form, "SUCCESS");
    },
  }),
  subscribeToNewsletter: defineAsfAction({
    input: zNewsletterValues,
    handler: async ({ email }, { form }) => {
      const listId = MAILCHIMP_LIST_ID;
      if (!listId) return message<Message>(form, "BAD_REQUEST", { status: 400 });
      const subscriberHash = md5(email.toLowerCase());
      mailchimp.setConfig({ apiKey: MAILCHIMP_API_KEY, server: MAILCHIMP_SERVER });
      try {
        const { status } = await mailchimp.lists.getListMember(listId, subscriberHash);
        if (status !== "unsubscribed") return message<Message>(form, "CONFLICT", { status: 409 });
        await mailchimp.lists.updateListMember(listId, subscriberHash, { status: "subscribed" });
      } catch (error) {
        try {
          await mailchimp.lists.addListMember(listId, { email_address: email, status: "subscribed" });
        } catch (error) {
          return message<Message>(form, "BAD_REQUEST", { status: 400 });
        }
      }
      return message<Message>(form, "SUCCESS");
    },
  }),
};
