# md2fig

A Figma plugin that converts Markdown into professionally designed resumes.

![Plugin Icon](assets/icon.png)

## Features

- **Multiple Templates**: Choose from Classic, Modern, or Compact layouts
- **Rich Markdown Support**: Headers, bold, italic, links, lists, and horizontal dividers
- **Auto Pagination**: Automatically creates new pages when content exceeds page height
- **Easy Editing**: Modify generated resumes directly within Figma

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/t1c1/md2fig.git
   ```

2. Load into Figma:
   - Open Figma
   - Go to Plugins > Development > Import Plugin from Manifest...
   - Select the `src/manifest.json` file

## Usage

1. Open the plugin in Figma (Plugins > Development > md2fig)

2. Select a template:
   - **Classic** - Traditional resume layout
   - **Modern** - Clean with more whitespace
   - **Compact** - Dense layout for more content

3. Paste your Markdown:

   ```markdown
   # Jane Smith

   ## Summary
   Senior software engineer with 8+ years of experience building *scalable* systems.

   ## Experience

   ### Lead Engineer, Tech Corp
   *2020 - Present*
   - Led team of 5 engineers on **core platform** rebuild
   - Reduced infrastructure costs by 40%

   ### Software Engineer, Startup Inc
   *2016 - 2020*
   - Built real-time data pipeline processing 1M events/day
   - Mentored 3 junior developers

   ---

   ## Education

   ### BS Computer Science, State University
   2012 - 2016

   ## Skills
   - Python, Go, TypeScript
   - AWS, Kubernetes, PostgreSQL
   - System design, technical leadership
   ```

4. Click "Generate Resume"

## Markdown Support

| Syntax | Result |
|--------|--------|
| `# Heading` | H1 (name) |
| `## Heading` | H2 (section) |
| `### Heading` | H3 (job title) |
| `#### Heading` | H4 (subsection) |
| `**bold**` | **bold text** |
| `*italic*` | *italic text* |
| `[text](url)` | hyperlink |
| `- item` | bullet list |
| `  - nested` | nested list |
| `---` | horizontal divider |

## Templates

### Classic
Traditional resume style with standard margins and spacing. Good for most use cases.

### Modern
More whitespace and larger section headers. Creates a cleaner, more contemporary look.

### Compact
Smaller margins and tighter spacing. Fits more content on a single page.

## Troubleshooting

**Plugin not generating correctly?**
Ensure your Markdown syntax is correct. Check that headers have a space after the `#`.

**Text overflowing?**
Long words without spaces may overflow. Try breaking up long URLs or technical terms.

**Need more pages?**
The plugin automatically creates additional pages when content exceeds the page height.

## Changelog

### v1.1.0 - 2026-01-16
- Added template selection (Classic, Modern, Compact)
- Added italic text support (`*italic*`)
- Added horizontal divider support (`---`)
- Added nested list support
- Improved UI with template picker
- Added keyboard shortcut (Cmd/Ctrl + Enter)

### v1.0.0 - 2024-10-08
- Initial release
- Basic Markdown to resume conversion
- Auto pagination

## Roadmap

- [ ] Custom color themes
- [ ] Font selection
- [ ] Import from JSON Resume format (jsonresume.org)
- [ ] Section reordering in UI
- [ ] Two-column layout template

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a pull request

## Contact

Questions or feedback? Open an issue on GitHub or email t@thomas.tc.

## Links

- [Figma Plugin Docs](https://www.figma.com/plugin-docs/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Report an Issue](https://github.com/t1c1/md2fig/issues)

## License

MIT
