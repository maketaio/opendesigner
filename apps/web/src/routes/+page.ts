import { redirect } from "@sveltejs/kit";

export function load() {
  redirect(307, "/doc-1/page-1");
}
