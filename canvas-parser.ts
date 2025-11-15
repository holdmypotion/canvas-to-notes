/**
 * Canvas file parsing utilities
 */

import { TFile, Vault } from 'obsidian';
import { CanvasData } from './types';

/**
 * Parses a canvas file and returns the canvas data
 */
export async function parseCanvasFile(file: TFile, vault: Vault): Promise<CanvasData> {
	const content = await vault.read(file);
	const canvasData = JSON.parse(content) as CanvasData;
	
	// Validate structure
	if (!canvasData.nodes || !Array.isArray(canvasData.nodes)) {
		throw new Error('Invalid canvas file: missing or invalid nodes array');
	}
	
	if (!canvasData.edges || !Array.isArray(canvasData.edges)) {
		throw new Error('Invalid canvas file: missing or invalid edges array');
	}
	
	return canvasData;
}
