"use server";

import { suggestProducts as suggest } from "@/lib/search";

export async function suggestProducts(q: string) {
  return suggest(q);
}