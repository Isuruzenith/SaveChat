/**
 * This function is the main entry point for the Grok content script.
 * It scrapes the chat data, formats it, and triggers a download.
 */
function exportGrokChatToMarkdown() {
  console.log("AI Chat Exporter: Grok script injected and running.");

  // --- IMPORTANT ---
  // These selectors may break if xAI updates the Grok website.
  // If the export fails, inspect the page and update the selectors below.
  //
  // Current structure (as inspected):
  // - All message bubbles share the class: .message-bubble
  // - User messages: their parent container has class "items-end"
  // - Grok messages: their parent container has class "items-start"
  // - Message content (rendered markdown) is directly inside .message-bubble
  const messageBubbles = document.querySelectorAll('.message-bubble');

  if (messageBubbles.length === 0) {
    alert("AI Chat Exporter: Could not find any chat content. Make sure you are on a Grok chat page with a conversation.");
    return;
  }

  let markdownContent = "# Grok Chat Export\n\n";

  messageBubbles.forEach((bubble, index) => {
    const isUser = bubble.parentElement && bubble.parentElement.classList.contains('items-end');

    if (isUser) {
      const userText = bubble.textContent.trim();
      markdownContent += `**User:**\n> ${userText}\n\n`;
    } else {
      markdownContent += `**Grok:**\n${bubble.innerHTML}\n\n`;
    }

    if (index < messageBubbles.length - 1) {
      markdownContent += "---\n\n";
    }
  });

  downloadGrokMarkdownFile(markdownContent);
}

/**
 * Creates a file from the markdown text and triggers a browser download.
 * @param {string} text - The markdown content to be downloaded.
 */
function downloadGrokMarkdownFile(text) {
  const blob = new Blob([text], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  a.download = `grok-chat-${timestamp}.md`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log("AI Chat Exporter: Grok download triggered.");
}

// Run the main function.
exportGrokChatToMarkdown();
