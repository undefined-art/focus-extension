const params = new URLSearchParams(window.location.search);
const blockedUrl = params.get("blocked");
document.getElementById("blockedUrl").textContent = blockedUrl || "Unknown URL";

const handleGoBack = async () => {
  try {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      chrome.tabs.remove(tab.id);
    }
  } catch (error) {
    console.log(error);

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.tabs.remove(tab.id);
  }
};

document.getElementById("goBackButton").addEventListener("click", handleGoBack);
