import { Notice, Plugin } from 'obsidian';
import { convertCanvasToNotes, validateCanvasFile } from './converter';

/**
 * Canvas to Notes Plugin
 * Converts Obsidian canvas files into folders of linked markdown notes
 */
export default class CanvasToNotesPlugin extends Plugin {
	async onload() {
		// Register the main conversion command
		this.addCommand({
			id: 'convert-canvas-to-notes',
			name: 'Convert Canvas to Notes',
			callback: async () => {
				const activeFile = this.app.workspace.getActiveFile();
				
				// Validate the active file is a canvas
				const validation = validateCanvasFile(activeFile);
				if (!validation.valid) {
					new Notice(validation.message || 'Invalid file');
					return;
				}
				
				// Perform conversion
				try {
					await convertCanvasToNotes(this.app, activeFile!);
				} catch (error) {
					// Error already handled in converter with Notice
					console.error('Canvas conversion failed:', error);
				}
			}
		});
	}

	onunload() {
		// Clean up if needed
	}
}
