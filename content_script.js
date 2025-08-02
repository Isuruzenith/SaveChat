/**
 * This function is the main entry point for the content script.
 * It scrapes the chat data, formats it, and triggers a download.
 */
function exportChatToMarkdown() {
  console.log("Gemini Exporter: Script injected and running.");

  // --- IMPORTANT ---
  // These selectors are the most likely part of this script to break if Google
  // updates the Gemini website. If the export fails, you will need to inspect
  // the page and find the new correct selectors for these elements.
  //
  // To find them:
  // 1. Right-click on a user prompt or a Gemini response on the page.
  // 2. Click "Inspect".
  // 3. Look at the HTML structure to find the class names or attributes that
  //    uniquely identify the user prompts and the model's answers.
  const chatContainerSelector = 'response-container'; // The class for each response block
  const userPromptSelector = 'user-query'; // The class for the user's prompt text
  const modelResponseSelector = '.markdown'; // The class for the main markdown content of the response

  // Find all the chat turn containers on the page.
  const chatTurns = document.querySelectorAll(`.${chatContainerSelector}`);

  if (chatTurns.length === 0) {
    alert("Gemini Exporter: Could not find any chat content. Make sure you are on a Gemini chat page.");
    return;
  }

  let markdownContent = "# Gemini Chat Export\n\n";

  // Loop through each "turn" in the conversation.
  chatTurns.forEach((turn, index) => {
    const userPromptElement = turn.querySelector(`.${userPromptSelector}`);
    const modelResponseElement = turn.querySelector(modelResponseSelector);

    // Add the user's prompt to the markdown string.
    if (userPromptElement) {
      const userText = userPromptElement.textContent.trim();
      markdownContent += `**User:**\n> ${userText}\n\n`;
    }

    // Add the model's response to the markdown string.
    if (modelResponseElement) {
      // We get innerHTML to preserve the markdown formatting from Gemini.
      const modelText = modelResponseElement.innerHTML;
      markdownContent += `**Gemini:**\n${modelText}\n\n`;
    }

    // Add a separator between turns, but not after the last one.
    if (index < chatTurns.length - 1) {
      markdownContent += "---\n\n";
    }
  });

  // Trigger the download.
  downloadMarkdownFile(markdownContent);
}

/**
 * Creates a file from the markdown text and triggers a browser download.
 * @param {string} text - The markdown content to be downloaded.
 */
function downloadMarkdownFile(text) {
  // Create a Blob (a file-like object) from the text.
  const blob = new Blob([text], { type: 'text/markdown' });
  
  // Create a URL for the Blob.
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor (<a>) element to trigger the download.
  const a = document.createElement('a');
  a.href = url;
  
  // Suggest a filename for the download.
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  a.download = `gemini-chat-${timestamp}.md`;
  
  // Programmatically click the anchor element to start the download.
  document.body.appendChild(a);
  a.click();
  
  // Clean up by removing the anchor element and revoking the object URL.
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log("Gemini Exporter: Download triggered.");
}

// Run the main function.
exportChatToMarkdown();
