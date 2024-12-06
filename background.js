importScripts("utils/storage.js", "utils/domainUtils.js");

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0) return;

  const isEnabled = await getBlockerEnabled();

  console.log({ isEnabled });
  if (!isEnabled) return;

  const url = new URL(details.url);
  const domain = url.hostname.toLowerCase();

  if (url.protocol === "chrome:" || url.protocol === "extension:") return;

  const allowedDomains = await getAllowedDomains();

  if (!isDomainAllowed(domain, allowedDomains)) {
    chrome.tabs.update(details.tabId, {
      url: `blocked.html?blocked=${encodeURIComponent(details.url)}`,
    });
  }
});
