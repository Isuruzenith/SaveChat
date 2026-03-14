// This script runs in the background, waiting for the user to click the extension's icon.

/**
 * Listens for a click on the extension's action icon in the toolbar.
 */
chrome.action.onClicked.addListener((tab) => {
  if (tab.url.startsWith("https://gemini.google.com/")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content_script.js"]
    });
  } else if (tab.url.startsWith("https://claude.ai/")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["claude_content_script.js"]
    });
  } else if (tab.url.startsWith("https://grok.com/")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["grok_content_script.js"]
    });
  } else {
    console.log("AI Chat Exporter: This extension only works on gemini.google.com, claude.ai, or grok.com");
  }
});
