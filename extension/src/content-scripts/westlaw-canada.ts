import { TabState } from "src/store/tabs";
import { Connections, Message } from "../messaging";

function getSearchQuery(location: Location): string | null {
  const searchParams = new URLSearchParams(location.search);

  const query = searchParams.get("query");

  if (!query) {
    return null;
  }

  return `westlaw ${query} ${searchParams.get("startIndex")} ${searchParams.get(
    "contentType",
  )}`;
}

function getDocumentId(href: string): string {
  const url = new URL(href);
  const urlPathParts = url.pathname.split("/");

  // "linkouts" have titleId encoded in the URL search params
  const searchParamsTitleId = url.searchParams.get("titleID");
  if (searchParamsTitleId) {
    return `westlaw-linkout-${searchParamsTitleId}`;
  }

  // internal urls are in the following format:
  // {host}/Document/{id}/View/FullText.html?{search}
  const documentPartIndex = urlPathParts.indexOf("Document");
  if (documentPartIndex === -1) {
    console.warn("cannot find ID from the URL, using URL instead");
    return href;
  }

  const id = urlPathParts[documentPartIndex + 1];
  if (!id) {
    console.warn("cannot find ID from the URL, using URL instead");
    return href;
  }

  return `westlaw-${id}`;
}

function getDocumentParagraphsFromAnchor(
  anchor: HTMLAnchorElement,
): Promise<string[]> {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";

    iframe.onload = function () {
      const tables =
        iframe.contentWindow?.document.querySelectorAll(".crsw_fancyTable");
      tables?.forEach((t) => t.remove());

      const end =
        iframe.contentWindow?.document.getElementById("co_endOfDocument");
      end?.remove();

      const doc = iframe.contentWindow?.document.getElementById("co_document");
      iframe.remove();

      const paragraphs = doc?.querySelectorAll<HTMLElement>(
        ":is(.co_paragraph, .co_paragraphText):not(:has(.co_paragraph, .co_paragraphText))",
      );

      resolve(Array.from(paragraphs || []).map((p) => p.innerText));
    };

    iframe.src = anchor.href;
    document.body.appendChild(iframe);
  });
}

async function getDocumentAnchors(
  doc: Document,
): Promise<NodeListOf<HTMLAnchorElement>> {
  return new Promise((resolve) => {
    function getAnchors() {
      const searchResults = doc.querySelectorAll<HTMLAnchorElement>(
        ".co_searchContent h3 a",
      );

      if (searchResults.length > 0) {
        resolve(searchResults);
      } else {
        setTimeout(getAnchors, 250);
      }
    }

    getAnchors();
  });
}

async function pageHandler(): Promise<void> {
  let data: TabState;
  const query = getSearchQuery(document.location);

  if (query) {
    const anchors = await getDocumentAnchors(document);

    port.postMessage({
      type: "tab-loaded",
      documents: Array.from(anchors).map((anchor) => ({
        id: getDocumentId(anchor.href),
        url: anchor.href,
        title: anchor.innerText,
        isProcessed: false,
      })),
    } as Message);
  }
}

const port = chrome.runtime.connect({ name: Connections.ContentScript });
port.onMessage.addListener(async (message: Message) => {
  switch (message.type) {
    case "start-extraction":
      const searchResultAhcnors = await getDocumentAnchors(document);

      searchResultAhcnors.forEach((anchor) => {
        const documentId = getDocumentId(anchor.href);

        if (message.documentIdsToIgnore.includes(documentId)) {
          return;
        }

        getDocumentParagraphsFromAnchor(anchor).then((paragraphs) =>
          port.postMessage({
            type: "document-extracted",
            data: {
              documentId,
              paragraphs,
            },
          } as Message),
        );
      });
  }
});

window.addEventListener("load", pageHandler, false);
