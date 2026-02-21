import { getDocument } from "$lib/data/mock";

export function load({ params }) {
  return {
    document: getDocument(params.docId),
  };
}
