// md2fig - Markdown to Figma Resume Plugin
// https://github.com/t1c1/md2fig

figma.showUI(__html__, { width: 420, height: 580 });

// Page dimensions (US Letter)
const PAGE_WIDTH = 8.5 * 96;
const PAGE_HEIGHT = 11 * 96;
const PAGE_GAP = 20;

// Template configurations
const TEMPLATES = {
  classic: {
    name: "Classic",
    font: "Inter",
    margin: 0.5 * 96,
    colors: {
      text: { r: 0.1, g: 0.1, b: 0.1 },
      heading: { r: 0, g: 0, b: 0 },
      link: { r: 0, g: 0.4, b: 0.8 },
      divider: { r: 0.7, g: 0.7, b: 0.7 },
    },
    sizes: {
      h1: 24,
      h2: 18,
      h3: 14,
      h4: 12,
      body: 10,
    },
    spacing: {
      h1: 10,
      h2: 10,
      h3: 8,
      h4: 6,
      body: 2,
      list: 4,
      empty: 8,
      afterLine: 4,
    },
  },
  modern: {
    name: "Modern",
    font: "Inter",
    margin: 0.75 * 96,
    colors: {
      text: { r: 0.2, g: 0.2, b: 0.25 },
      heading: { r: 0.15, g: 0.15, b: 0.2 },
      link: { r: 0.2, g: 0.5, b: 0.7 },
      divider: { r: 0.85, g: 0.85, b: 0.9 },
    },
    sizes: {
      h1: 28,
      h2: 16,
      h3: 13,
      h4: 11,
      body: 10,
    },
    spacing: {
      h1: 16,
      h2: 14,
      h3: 10,
      h4: 8,
      body: 4,
      list: 6,
      empty: 12,
      afterLine: 6,
    },
  },
  compact: {
    name: "Compact",
    font: "Inter",
    margin: 0.4 * 96,
    colors: {
      text: { r: 0.15, g: 0.15, b: 0.15 },
      heading: { r: 0, g: 0, b: 0 },
      link: { r: 0.1, g: 0.3, b: 0.6 },
      divider: { r: 0.6, g: 0.6, b: 0.6 },
    },
    sizes: {
      h1: 20,
      h2: 14,
      h3: 11,
      h4: 10,
      body: 9,
    },
    spacing: {
      h1: 6,
      h2: 6,
      h3: 4,
      h4: 3,
      body: 1,
      list: 2,
      empty: 4,
      afterLine: 2,
    },
  },
};

let currentTemplate = TEMPLATES.classic;

function getContentWidth() {
  return PAGE_WIDTH - 2 * currentTemplate.margin;
}

// Parse formatted text: **bold**, *italic*, [link](url)
function parseFormattedText(text) {
  const parts = [];
  let currentIndex = 0;
  // Match bold (**text**), italic (*text* but not **), and links [text](url)
  const regex = /(\*\*.*?\*\*|\*(?!\*).*?\*(?!\*)|\[.*?\]\(.*?\))/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > currentIndex) {
      parts.push({
        text: text.slice(currentIndex, match.index),
        bold: false,
        italic: false,
        link: null,
      });
    }

    const segment = match[0];
    if (segment.startsWith("**") && segment.endsWith("**")) {
      parts.push({
        text: segment.slice(2, -2),
        bold: true,
        italic: false,
        link: null,
      });
    } else if (segment.startsWith("*") && segment.endsWith("*") && !segment.startsWith("**")) {
      parts.push({
        text: segment.slice(1, -1),
        bold: false,
        italic: true,
        link: null,
      });
    } else {
      const linkMatch = segment.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        parts.push({
          text: linkMatch[1],
          bold: false,
          italic: false,
          link: linkMatch[2],
        });
      }
    }

    currentIndex = regex.lastIndex;
  }

  if (currentIndex < text.length) {
    parts.push({
      text: text.slice(currentIndex),
      bold: false,
      italic: false,
      link: null,
    });
  }

  return parts;
}

async function loadFonts() {
  const font = currentTemplate.font;
  await figma.loadFontAsync({ family: font, style: "Regular" });
  await figma.loadFontAsync({ family: font, style: "Bold" });
  await figma.loadFontAsync({ family: font, style: "Italic" });
  await figma.loadFontAsync({ family: font, style: "Bold Italic" });
}

async function createFormattedTextNode(content, fontSize, defaultBold, x, y, color) {
  const textNode = figma.createText();
  const font = currentTemplate.font;
  const contentWidth = getContentWidth();

  textNode.fontSize = fontSize;
  textNode.x = x;
  textNode.y = y;
  textNode.textAutoResize = "WIDTH_AND_HEIGHT";

  const parts = parseFormattedText(content);
  let currentIndex = 0;

  for (const part of parts) {
    if (part.text.length === 0) continue;

    textNode.insertCharacters(currentIndex, part.text);

    // Determine font style
    let style = "Regular";
    if ((part.bold || defaultBold) && part.italic) {
      style = "Bold Italic";
    } else if (part.bold || defaultBold) {
      style = "Bold";
    } else if (part.italic) {
      style = "Italic";
    }

    textNode.setRangeFontName(currentIndex, currentIndex + part.text.length, {
      family: font,
      style: style,
    });

    // Apply color
    const fillColor = part.link ? currentTemplate.colors.link : color;
    textNode.setRangeFills(currentIndex, currentIndex + part.text.length, [
      { type: "SOLID", color: fillColor },
    ]);

    // Apply hyperlink
    if (part.link) {
      textNode.setRangeHyperlink(currentIndex, currentIndex + part.text.length, {
        type: "URL",
        value: part.link,
      });
    }

    currentIndex += part.text.length;
  }

  // Constrain width if needed
  if (textNode.width > contentWidth) {
    textNode.textAutoResize = "HEIGHT";
    textNode.resize(contentWidth, textNode.height);
  }

  return textNode;
}

function createDivider(x, y) {
  const line = figma.createLine();
  line.x = x;
  line.y = y;
  line.resize(getContentWidth(), 0);
  line.strokes = [{ type: "SOLID", color: currentTemplate.colors.divider }];
  line.strokeWeight = 1;
  return line;
}

function createNewPage(pageNumber, xPosition) {
  const page = figma.createFrame();
  page.resize(PAGE_WIDTH, PAGE_HEIGHT);
  page.x = xPosition;
  page.y = 0;
  page.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  page.name = `Resume Page ${pageNumber}`;
  return page;
}

// Parse line to determine type and content
function parseLine(line) {
  const trimmed = line.trimEnd();

  // Horizontal rule
  if (/^-{3,}$/.test(trimmed) || /^\*{3,}$/.test(trimmed) || /^_{3,}$/.test(trimmed)) {
    return { type: "divider", content: "" };
  }

  // Headers
  if (trimmed.startsWith("#### ")) {
    return { type: "h4", content: trimmed.replace(/^####\s*/, "") };
  }
  if (trimmed.startsWith("### ")) {
    return { type: "h3", content: trimmed.replace(/^###\s*/, "") };
  }
  if (trimmed.startsWith("## ")) {
    return { type: "h2", content: trimmed.replace(/^##\s*/, "") };
  }
  if (trimmed.startsWith("# ")) {
    return { type: "h1", content: trimmed.replace(/^#\s*/, "") };
  }

  // Nested list (2+ spaces or tab before -)
  if (/^(\s{2,}|\t)-\s/.test(line)) {
    return { type: "nested-list", content: "  - " + line.replace(/^(\s{2,}|\t)-\s*/, "") };
  }

  // List item
  if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
    return { type: "list", content: trimmed.replace(/^[-*]\s*/, "") };
  }

  // Empty line
  if (trimmed === "") {
    return { type: "empty", content: "" };
  }

  // Regular text
  return { type: "body", content: trimmed };
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === "create-resume") {
    try {
      // Set template
      currentTemplate = TEMPLATES[msg.template] || TEMPLATES.classic;

      await loadFonts();

      const lines = msg.markdown.split("\n");
      const margin = currentTemplate.margin;
      const spacing = currentTemplate.spacing;
      const sizes = currentTemplate.sizes;
      const colors = currentTemplate.colors;

      let yOffset = margin;
      let pageNumber = 1;
      let xPosition = 0;

      let currentPage = createNewPage(pageNumber, xPosition);
      let allPages = [currentPage];

      for (const line of lines) {
        const parsed = parseLine(line);

        // Handle empty lines
        if (parsed.type === "empty") {
          yOffset += spacing.empty;
          continue;
        }

        // Handle dividers
        if (parsed.type === "divider") {
          yOffset += 6;
          const divider = createDivider(margin, yOffset);

          if (yOffset + 10 > PAGE_HEIGHT - margin) {
            pageNumber += 1;
            xPosition += PAGE_WIDTH + PAGE_GAP;
            currentPage = createNewPage(pageNumber, xPosition);
            allPages.push(currentPage);
            yOffset = margin;
            divider.x = margin;
            divider.y = yOffset;
          }

          currentPage.appendChild(divider);
          yOffset += 10;
          continue;
        }

        // Determine styling based on type
        let fontSize = sizes.body;
        let isBold = false;
        let content = parsed.content;
        let preSpacing = spacing.body;
        let color = colors.text;

        switch (parsed.type) {
          case "h1":
            fontSize = sizes.h1;
            isBold = true;
            preSpacing = spacing.h1;
            color = colors.heading;
            break;
          case "h2":
            fontSize = sizes.h2;
            isBold = true;
            preSpacing = spacing.h2;
            color = colors.heading;
            break;
          case "h3":
            fontSize = sizes.h3;
            isBold = true;
            preSpacing = spacing.h3;
            color = colors.heading;
            break;
          case "h4":
            fontSize = sizes.h4;
            isBold = true;
            preSpacing = spacing.h4;
            color = colors.heading;
            break;
          case "list":
            content = "• " + parsed.content;
            preSpacing = spacing.list;
            break;
          case "nested-list":
            content = "    - " + parsed.content.replace(/^\s*-\s*/, "");
            preSpacing = spacing.list;
            break;
        }

        yOffset += preSpacing;

        const textNode = await createFormattedTextNode(
          content,
          fontSize,
          isBold,
          margin,
          yOffset,
          color
        );

        // Check pagination
        if (yOffset + textNode.height + margin > PAGE_HEIGHT) {
          pageNumber += 1;
          xPosition += PAGE_WIDTH + PAGE_GAP;
          currentPage = createNewPage(pageNumber, xPosition);
          allPages.push(currentPage);
          yOffset = margin;

          textNode.x = margin;
          textNode.y = yOffset;
        }

        currentPage.appendChild(textNode);
        yOffset += textNode.height + spacing.afterLine;
      }

      figma.viewport.scrollAndZoomIntoView(allPages);
      figma.closePlugin();
    } catch (error) {
      console.error("Error:", error);
      figma.ui.postMessage({ type: "error", message: error.message });
    }
  }
};
