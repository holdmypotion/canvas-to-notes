/**
 * Main converter logic for canvas-to-notes transformation
 */

import { App, Notice, TFile } from 'obsidian';
import { parseCanvasFile } from './canvas-parser';
import { extractFilename, getUniqueFilename } from './filename-utils';
import { buildLinkGraph } from './link-graph';
import { generateNoteContent } from './note-generator';
import { NodeMapping } from './types';

/**
 * Converts a canvas file into a folder of linked markdown notes
 */
export async function convertCanvasToNotes(app: App, file: TFile): Promise<void> {
	try {
		// Parse canvas file
		const canvasData = await parseCanvasFile(file, app.vault);
		
		// Create folder name (handle duplicates)
		const baseFolderName = file.basename;
		let folderName = baseFolderName;
		let suffix = 2;
		let folderPath = `${file.parent?.path || ''}/${folderName}`.replace(/^\//, '');
		
		// Check if folder exists and create unique name
		while (await app.vault.adapter.exists(folderPath)) {
			folderName = `${baseFolderName} ${suffix}`;
			folderPath = `${file.parent?.path || ''}/${folderName}`.replace(/^\//, '');
			suffix++;
		}
		
		// Create the folder
		await app.vault.createFolder(folderPath);
		
		// Build node mappings
		const nodeMappings = new Map<string, NodeMapping>();
		const filenameCount = new Map<string, number>();
		
		for (const node of canvasData.nodes) {
			// Extract and sanitize filename
			const baseFilename = extractFilename(node.text, node.id);
			const filename = getUniqueFilename(baseFilename, filenameCount);
			
			// Create node mapping
			const mapping: NodeMapping = {
				nodeId: node.id,
				filename: filename,
				content: node.text,
				children: [],
				parents: []
			};
			
			nodeMappings.set(node.id, mapping);
		}
		
		// Build link graph from edges
		buildLinkGraph(canvasData.edges, nodeMappings);
		
		// Generate and save notes
		let createdCount = 0;
		for (const mapping of nodeMappings.values()) {
			const noteContent = generateNoteContent(mapping, nodeMappings);
			const notePath = `${folderPath}/${mapping.filename}.md`;
			
			await app.vault.create(notePath, noteContent);
			createdCount++;
		}
		
		new Notice(`✅ Created ${createdCount} notes in folder: ${folderName}`);
		
	} catch (error) {
		console.error('Error converting canvas to notes:', error);
		new Notice(`❌ Error: ${error.message}`);
		throw error;
	}
}

/**
 * Validates that the active file is a canvas file
 */
export function validateCanvasFile(file: TFile | null): { valid: boolean; message?: string } {
	if (!file) {
		return {
			valid: false,
			message: 'No active file. Please open a canvas file first.'
		};
	}
	
	if (file.extension !== 'canvas') {
		return {
			valid: false,
			message: 'Active file is not a canvas file. Please open a .canvas file.'
		};
	}
	
	return { valid: true };
}
