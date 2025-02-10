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

function createArrow() {
  const arrow = document.createElement("div");
  arrow.className = "doc-link-arrow";
  document.body.appendChild(arrow);
  return arrow;
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
}

function positionArrow(arrow, element) {
  const elementRect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  const OFFSET = 40;

  // Calculate element's center point
  const elementX = elementRect.left + elementRect.width / 2;
  const elementY = elementRect.top + elementRect.height / 2;

  // Determine which edge to place the arrow on
  if (elementY < 0) {
    // Element is above viewport - point arrow upward
    arrow.style.top = `${OFFSET}px`;
    arrow.style.left = `${Math.max(
      OFFSET,
      Math.min(viewportWidth - OFFSET, elementX)
    )}px`;
    // arrow.style.transform = "rotate(180deg)";
  } else if (elementY > viewportHeight) {
    // Element is below viewport - point arrow downward
    arrow.style.bottom = `${OFFSET}px`;
    arrow.style.left = `${Math.max(
      OFFSET,
      Math.min(viewportWidth - OFFSET, elementX)
    )}px`;
    arrow.style.transform = "rotate(180deg)";
  } else if (elementX < 0) {
    // Element is to the left - point arrow leftward
    arrow.style.left = `${OFFSET}px`;
    arrow.style.top = `${Math.max(
      OFFSET,
      Math.min(viewportHeight - OFFSET, elementY)
    )}px`;
    arrow.style.transform = "rotate(90deg)";
  } else {
    // Element is to the right - point arrow rightward
    arrow.style.right = `${OFFSET}px`;
    arrow.style.top = `${Math.max(
      OFFSET,
      Math.min(viewportHeight - OFFSET, elementY)
    )}px`;
    arrow.style.transform = "rotate(-90deg)";
  }
}

function highlightMatchingLinks(hoveredLink) {
  const targetHref = hoveredLink.href;
  const arrows = [];

  document.querySelectorAll("a").forEach((link) => {
    if (link.href === targetHref && link !== hoveredLink) {
      link.classList.add("doc-link-highlight");

      // If link is not in viewport, create an arrow pointing to it
      if (!isInViewport(link)) {
        const arrow = createArrow();
        positionArrow(arrow, link);
        arrows.push(arrow);
      }
    }
  });

  // Store arrows on the hoveredLink element for cleanup
  hoveredLink.docLinkArrows = arrows;
}

function removeHighlights() {
  document.querySelectorAll(".doc-link-highlight").forEach((link) => {
    link.classList.remove("doc-link-highlight");
  });

  // Remove all arrows
  document.querySelectorAll(".doc-link-arrow").forEach((arrow) => {
    arrow.remove();
  });
}

// Update styles to include arrow styling
const style = document.createElement("style");
style.textContent = `
  .doc-link-highlight {
    background-color: yellow !important;
    transition: background-color 0.2s ease;
  }
  .doc-link-arrow {
    position: fixed;
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 25px solid #ffeb3b;
    z-index: 10000;
    pointer-events: none;
    filter: drop-shadow(0 0 2px rgba(0,0,0,0.3));
  }
`;
document.head.appendChild(style);

// Start the initialization
initializeLinkHighlighting();
