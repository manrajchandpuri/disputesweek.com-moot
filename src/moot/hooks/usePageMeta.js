import { useEffect } from "react";

export function usePageMeta(title, description) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · IIDW Moot 2027` : "IIDW Moot 2027 · India International Disputes Week";

    let tag = document.querySelector('meta[name="description"]');
    const previousDescription = tag ? tag.getAttribute("content") : null;
    if (description) {
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }

    return () => {
      document.title = previous;
      if (tag && previousDescription !== null) tag.setAttribute("content", previousDescription);
    };
  }, [title, description]);
}
