# Obsidian Canvas-to-Notes Plugin - Implementation Plan

## 📋 Requirements Summary

**What the plugin does:**
- Adds a command to the command palette
- When executed on a `.canvas` file, it:
  1. Creates a folder named after the canvas (with suffix if folder exists)
  2. Converts each canvas node into a `.md` file
  3. Creates bidirectional links between notes based on canvas edges
  4. Uses frontmatter to track parent nodes

---

## 🔧 Technical Implementation Details

### 1. Command Registration

```typescript
// Register command in command palette
this.addCommand({
  id: 'convert-canvas-to-notes',
  name: 'Convert Canvas to Notes',
  callback: async () => { /* implementation */ }
});
```

### 2. Active File Validation

- Check if `app.workspace.getActiveFile()` exists
- Verify file extension is `.canvas`
- Show notice if invalid

### 3. Canvas Parsing

The canvas file structure:

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

### 4. Filename Extraction Logic

For each node:

```typescript
function extractFilename(text: string): string {
  // 1. Look for heading (##, ###, etc.)
  const headingMatch = text.match(/^#{1,6}\s+(.+)$/m);
  
  if (headingMatch) {
    return sanitize(headingMatch[1]);
  }
  
  // 2. No heading: take first 3 words
  const words = text.split(/\s+/).slice(0, 3);
  return sanitize(words.join(' '));
}
```

### 5. Duplicate Filename Handling

```typescript
// Track filenames: "Apache Flink.md" -> 1
// Next duplicate: "Apache Flink 2.md"
const filenameCount = new Map<string, number>();
```

### 6. Folder Creation

```typescript
// Canvas: "Concept - Apache Flink.canvas"
// Folder: "Concept - Apache Flink" (or "Concept - Apache Flink 2" if exists)
const baseName = canvasFile.basename; // Without extension
let folderName = baseName;
let suffix = 2;

while (await app.vault.adapter.exists(folderPath)) {
  folderName = `${baseName} ${suffix}`;
  suffix++;
}

await app.vault.createFolder(folderPath);
```

### 7. Note Generation with Bidirectional Links

For each edge `fromNode -> toNode`:
- **fromNode file**: Add `[[toNode filename]]` in content
- **toNode file**: Add frontmatter:
  ```yaml
  ---
  parent: [[fromNode filename]]
  ---
  ```

**Multiple parents:** If a node has multiple incoming edges:

```yaml
---
parents:
  - [[Parent 1]]
  - [[Parent 2]]
---
```

### 8. Note Content Structure

```markdown
---
parents:
  - [[Parent Node 1]]
  - [[Parent Node 2]]
---

## Original Heading
Content from canvas node...

## Child
- [[Child Node 1]]
- [[Child Node 2]]
```

---

## 📐 Data Structures

```typescript
interface CanvasData {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

interface CanvasNode {
  id: string;
  type: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CanvasEdge {
  id: string;
  fromNode: string;
  fromSide?: string;
  toNode: string;
  toSide?: string;
}

interface NodeMapping {
  nodeId: string;
  filename: string;
  content: string;
  children: string[]; // Node IDs this connects to
  parents: string[];  // Node IDs that connect to this
}
```

---

## 🔄 Processing Flow

1. **Parse Canvas** → Extract nodes and edges
2. **Build Node Mappings** → Map node IDs to filenames
3. **Handle Duplicates** → Resolve duplicate filenames
4. **Build Link Graph** → Map parent-child relationships from edges
5. **Generate Notes** → Create files with:
   - Frontmatter (parents)
   - Original content
   - Links section (children)
6. **Save Files** → Write all notes to folder

---

## ⚠️ Edge Cases to Handle

| Case | Solution |
|------|----------|
| Node with no heading | Use first 3 words as filename |
| Duplicate filenames | Append number suffix (e.g., "Note 2.md") |
| Empty node | Use "Untitled [nodeId]" |
| Special chars in filename | Sanitize (remove `/\:*?"<>|`) |
| Image references | Keep as-is in content |
| Existing folder | Create folder with number suffix |
| No active file | Show error notice |
| Not a canvas file | Show error notice |

---

## 🎯 Expected Output for Apache Flink Canvas

```
Sandbox/
├── Concept - Apache Flink.canvas
└── Concept - Apache Flink/
    ├── Apache Flink.md
    ├── How Flink Works.md
    ├── Cluster Architecture.md
    ├── Job Manager.md
    ├── Task Managers.md
    ├── Task Slots and Parallelism.md
    ├── Kafka.md
    ├── Transform Svc.md
    ├── Database.md
    ├── Why flink.md
    ├── Basic Concepts.md
    ├── Basic Use.md
    ├── Windows.md
    ├── Watermarks.md
    └── ... (all other nodes)
```

### Example Note: `Apache Flink.md`

```markdown
---
parents: []
---

## Apache Flink
- Tool for stateful stream processing

## Child
- [[Note]]
- [[When Flink]]
- [[Basic Concepts]]
- [[Basic Use]]
- [[How Flink Works]]
```

### Example Note with Parent: `How Flink Works.md`

```markdown
---
parents:
  - [[Apache Flink]]
---

## How Flink Works?

## Child
- [[Cluster Architecture]]
- [[State Management]]
```

---

## 📝 Implementation Tasks

### Phase 1: Project Setup & Understanding
- [x] Examine starter repo structure and understand the plugin setup

### Phase 2: Core Logic Development
- [ ] Implement command registration in command palette
- [ ] Add active file validation (check if current file is .canvas)
- [ ] Implement canvas JSON parsing to extract nodes and edges
- [ ] Build filename extraction logic (heading or first 3 words)
- [ ] Handle duplicate filename detection and numbering
- [ ] Create folder with canvas name (handle existing folder with suffix)
- [ ] Generate note files with content from nodes
- [ ] Implement bidirectional linking: wiki-links in content + frontmatter parents

### Phase 3: Edge Cases & Validation
- [ ] Add error handling and user notifications
- [ ] Test with Apache Flink canvas and verify all features

---

## 🚀 Next Steps

Ready to implement! The plugin will:
1. Parse the canvas JSON structure
2. Extract meaningful filenames from node content
3. Build a complete link graph
4. Generate well-formatted markdown notes with proper linking
5. Handle all edge cases gracefully

---

## Questions Answered

1. **Nodes without headings**: Use first 3 words as filename
2. **Duplicate headings**: Append number suffix (e.g., "Note 2.md")
3. **Image references**: Keep as-is in the created notes
4. **Link direction**: Bidirectional - fromNode links to toNode, toNode has parent frontmatter
5. **Existing folder**: Create new folder with number suffix
