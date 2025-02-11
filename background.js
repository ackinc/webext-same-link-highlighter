chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes("chrome://")) return;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"],
  });
});
