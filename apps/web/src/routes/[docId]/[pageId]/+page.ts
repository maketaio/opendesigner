import { error } from "@sveltejs/kit";

import { getPage } from "$lib/data/mock";

import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
  const page = getPage(params.docId, params.pageId);
  if (!page) error(404, "Page not found");
  return { page };
};
