chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === "checkBlocked") {
    sendResponse({ received: true });
  }
});
