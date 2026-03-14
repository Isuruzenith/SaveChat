/**
 * This function is the main entry point for the Claude content script.
 * It scrapes the chat data, formats it, and triggers a download.
 */
function exportClaudeChatToMarkdown() {
  console.log("AI Chat Exporter: Claude script injected and running.");

  // --- IMPORTANT ---
  // These selectors may break if Anthropic updates the Claude website.
  // If the export fails, inspect the page and update the selectors below.
  //
  // To find them:
  // 1. Right-click on a user message or a Claude response on the page.
  // 2. Click "Inspect".
  // 3. Look at the HTML structure to find the class names or data-testid attributes
  //    that uniquely identify the user messages and Claude's answers.
  const userMessageSelector = '[data-testid="user-message"]';
  const claudeMessageSelector = '.font-claude-message';
  const claudeMessageContentSelector = '.prose'; // Rendered markdown content inside Claude's message

  const userMessages = document.querySelectorAll(userMessageSelector);
  const claudeMessages = document.querySelectorAll(claudeMessageSelector);

  if (userMessages.length === 0 && claudeMessages.length === 0) {
    alert("AI Chat Exporter: Could not find any chat content. Make sure you are on a Claude chat page with a conversation.");
    return;
  }

  // Collect all messages with their type, then sort by DOM position to preserve order.
  const allMessages = [];

  userMessages.forEach(el => {
    allMessages.push({ type: 'user', element: el });
  });

  claudeMessages.forEach(el => {
    allMessages.push({ type: 'claude', element: el });
  });

  allMessages.sort((a, b) => {
    const pos = a.element.compareDocumentPosition(b.element);
    return pos & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });

  let markdownContent = "# Claude Chat Export\n\n";

  allMessages.forEach((msg, index) => {
    if (msg.type === 'user') {
      const userText = msg.element.textContent.trim();
      markdownContent += `**User:**\n> ${userText}\n\n`;
    } else {
      const contentEl = msg.element.querySelector(claudeMessageContentSelector) || msg.element;
      markdownContent += `**Claude:**\n${contentEl.innerHTML}\n\n`;
    }

    if (index < allMessages.length - 1) {
      markdownContent += "---\n\n";
    }
  });

  downloadClaudeMarkdownFile(markdownContent);
}

/**
 * Creates a file from the markdown text and triggers a browser download.
 * @param {string} text - The markdown content to be downloaded.
 */
function downloadClaudeMarkdownFile(text) {
  const blob = new Blob([text], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  a.download = `claude-chat-${timestamp}.md`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log("AI Chat Exporter: Claude download triggered.");
}

// Run the main function.
exportClaudeChatToMarkdown();
