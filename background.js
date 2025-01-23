function isBlockedURL(url, blockedDomains) {
  try {
    const urlObj = new URL(url);

    return blockedDomains.some((domain) => {
      const hostname = urlObj.hostname.toLowerCase();
      const blockedDomain = domain.toLowerCase();

      return (
        hostname === blockedDomain || hostname.endsWith("." + blockedDomain)
      );
    });
  } catch {
    return false;
  }
}

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.frameId !== 0) return;

  chrome.storage.sync.get(["isEnabled", "blockedDomains"], (result) => {
    const { isEnabled = true, blockedDomains = [] } = result;

    if (isEnabled && isBlockedURL(details.url, blockedDomains)) {
      chrome.tabs.update(details.tabId, {
        url:
          chrome.runtime.getURL("blocked.html") +
          `?url=${encodeURIComponent(details.url)}`,
      });
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    chrome.storage.sync.get(["isEnabled", "blockedDomains"], (result) => {
      const { isEnabled = true, blockedDomains = [] } = result;

      if (isEnabled && isBlockedURL(changeInfo.url, blockedDomains)) {
        chrome.tabs.update(tabId, {
          url:
            chrome.runtime.getURL("blocked.html") +
            `?url=${encodeURIComponent(changeInfo.url)}`,
        });
      }
    });
  }
});
