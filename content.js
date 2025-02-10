// Function to add event listeners to a link
function addLinkListeners(link) {
  link.addEventListener("mouseenter", () => highlightMatchingLinks(link));
  link.addEventListener("mouseleave", () => removeHighlights());
}

// Initialize observers and listeners for both existing and future links
function initializeLinkHighlighting() {
  // Add listeners to any existing links
  document.querySelectorAll("a").forEach(addLinkListeners);

  // Create a mutation observer to watch for new links
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        // Check if the added node is an element
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Look for links within the added element
          const links = node.querySelectorAll("a");
          links.forEach(addLinkListeners);

          // Check if the node itself is a link
          if (node.tagName === "A") {
            addLinkListeners(node);
          }
        }
      });
    });
  });

  // Start observing the document with the configured parameters
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function highlightMatchingLinks(hoveredLink) {
  const targetHref = hoveredLink.href;

  document.querySelectorAll("a").forEach((link) => {
    // Only highlight links that match AND are not the hovered link
    if (link.href === targetHref && link !== hoveredLink) {
      link.classList.add("doc-link-highlight");
    }
  });
}

function removeHighlights() {
  document.querySelectorAll(".doc-link-highlight").forEach((link) => {
    link.classList.remove("doc-link-highlight");
  });
}

// Add styles dynamically
const style = document.createElement("style");
style.textContent = `
  .doc-link-highlight {
    background-color: yellow !important;
    transition: background-color 0.2s ease;
  }
`;
document.head.appendChild(style);

// Start the initialization
initializeLinkHighlighting();
