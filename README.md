# Canvas to Notes Plugin

Convert Obsidian canvas files into folders of linked markdown notes with bidirectional linking and frontmatter.

## Overview

This plugin transforms your Obsidian canvas files into well-structured note collections:

- **Extracts canvas nodes** into individual markdown files
- **Preserves relationships** through bidirectional links
- **Adds parent and child sections** to maintain the graph structure
- **Handles duplicates** intelligently with numbered suffixes
- **Creates organized folders** based on canvas names

## Features

### 🎯 Smart Filename Extraction
- Extracts filenames from **headings** (##, ###, etc.) in node content
- Falls back to **first 3 words** if no heading exists
- Handles **empty nodes** gracefully with unique identifiers

### 🔗 Bidirectional Linking
- **Parent references** in a "Parents" section at the top of each note
- **Child links** in a "Links" section at the end of each note
- Maintains the **relationship graph** from your canvas

### 📁 Intelligent Organization
- Creates a **folder** named after the canvas file
- **Handles duplicates** by appending numeric suffixes
- Sanitizes filenames by removing invalid characters

### ✨ Edge Case Handling
- Duplicate filenames get numbered (e.g., "Note 2.md", "Note 3.md")
- Special characters are sanitized from filenames
- Image references are preserved in note content
- Empty or missing nodes are handled gracefully

## Usage

1. Open a `.canvas` file in Obsidian
2. Open the **Command Palette** (Cmd/Ctrl + P)
3. Run **"Convert Canvas to Notes"**
4. A new folder will be created with all your notes!

## Example Output

### Canvas Structure
```
Apache Flink.canvas
├─ Node: "## Apache Flink"
├─ Node: "## How Flink Works?"
├─ Node: "## Basic Concepts"
└─ Edges connecting them
```

### Generated Files
```
Apache Flink/
├─ Apache Flink.md
├─ How Flink Works.md
└─ Basic Concepts.md
```

### Apache Flink.md
```markdown
## Apache Flink
- Tool for stateful stream processing

## Child
- [[How Flink Works]]
- [[Basic Concepts]]
```

### How Flink Works.md
```markdown
## Parents
- [[Apache Flink]]

## How Flink Works?
Content from canvas node...

## Child
- [[Basic Concepts]]
```

## Installation

### Manual Installation
1. Download `main.js`, `manifest.json`, and `styles.css` (if present)
2. Create folder: `<vault>/.obsidian/plugins/canvas-to-notes/`
3. Copy the files into this folder
4. Reload Obsidian
5. Enable the plugin in **Settings → Community plugins**

### Building from Source
```bash
# Install dependencies
npm install

# Development build (watch mode)
npm run dev

# Production build
npm run build
```

## Development

### Project Structure
```
canvas-to-notes/
├─ main.ts                 # Plugin entry point
├─ types.ts               # TypeScript interfaces
├─ canvas-parser.ts       # Canvas file parsing
├─ filename-utils.ts      # Filename extraction & sanitization
├─ link-graph.ts          # Relationship graph builder
├─ note-generator.ts      # Note content generation
└─ converter.ts           # Main conversion logic
```

### Code Organization
The plugin follows best practices for Obsidian plugin development:
- **Minimal `main.ts`**: Only handles plugin lifecycle
- **Modular architecture**: Each file has a single responsibility
- **Type safety**: Full TypeScript with strict mode
- **Error handling**: Comprehensive validation and user notifications

## Technical Details

### Canvas File Format
Canvas files are JSON with this structure:
```json
{
  "nodes": [
    {"id": "...", "type": "text", "text": "## Heading\nContent", ...}
  ],
  "edges": [
    {"id": "...", "fromNode": "nodeId1", "toNode": "nodeId2", ...}
  ]
}
```

### Processing Flow
1. **Parse Canvas** → Extract nodes and edges
2. **Build Node Mappings** → Map node IDs to filenames
3. **Handle Duplicates** → Resolve duplicate filenames
4. **Build Link Graph** → Map parent-child relationships
5. **Generate Notes** → Create files with frontmatter and links
6. **Save Files** → Write all notes to folder

## Requirements

- Obsidian v0.15.0 or higher
- Node.js v16+ (for development)

## AI Disclosure

This plugin was **fully created by AI** using **Claude Sonnet 4.5**. The complete implementation plan and development process can be found in `.ai/thoughts/Canvas-to-Notes-Plugin-Plan.md`.

The AI:
- Designed the architecture and modular code structure
- Implemented all features following Obsidian plugin best practices
- Handled edge cases and error scenarios
- Generated comprehensive documentation

This demonstrates the capability of AI-assisted development for creating production-ready Obsidian plugins from concept to completion.

## License

MIT

## Support

If you encounter any issues or have feature requests, please create an issue on GitHub.
