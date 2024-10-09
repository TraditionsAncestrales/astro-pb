import type { TypedPocketbase } from "@/lib/pocketbase/generated";

declare global {
  namespace App {
    interface Locals {
      pocketbase: TypedPocketbase;
    }
  }
}
