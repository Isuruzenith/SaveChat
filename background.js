// This script runs in the background, waiting for the user to click the extension's icon.

/**
 * Listens for a click on the extension's action icon in the toolbar.
 */
chrome.action.onClicked.addListener((tab) => {
  // Check if the tab's URL is the Gemini website.
  // This is a good practice to ensure the script only runs where it's intended.
  if (tab.url.startsWith("https://gemini.google.com/")) {
    // Execute the content script on the active tab.
    // The script will have access to the page's DOM.
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content_script.js"]
    });
  } else {
    // Optional: You could inform the user that the extension only works on Gemini.
    // For simplicity, we'll just log to the background console.
    console.log("Gemini Exporter: This extension only works on gemini.google.com");
  }
});
