/**
 * Utilities for extracting and sanitizing filenames from node content
 */

/**
 * Extracts a filename from node text content.
 * Priority: heading > first 3 words > fallback
 */
export function extractFilename(text: string, nodeId: string): string {
	if (!text || text.trim().length === 0) {
		return `Untitled ${nodeId.substring(0, 8)}`;
	}

	// Look for heading (##, ###, etc.)
	const headingMatch = text.match(/^#{1,6}\s+(.+)$/m);
	
	if (headingMatch) {
		return sanitizeFilename(headingMatch[1]);
	}
	
	// No heading: take first 3 words
	const words = text.trim().split(/\s+/).filter(w => w.length > 0).slice(0, 3);
	
	if (words.length === 0) {
		return `Untitled ${nodeId.substring(0, 8)}`;
	}
	
	return sanitizeFilename(words.join(' '));
}

/**
 * Sanitizes a filename by removing invalid characters
 */
export function sanitizeFilename(filename: string): string {
	// Remove invalid characters: /\:*?"<>|
	return filename
		.replace(/[/\\:*?"<>|]/g, '')
		.trim();
}

/**
 * Handles duplicate filenames by appending a number suffix
 */
export function getUniqueFilename(
	baseFilename: string,
	existingFilenames: Map<string, number>
): string {
	const count = existingFilenames.get(baseFilename) || 0;
	existingFilenames.set(baseFilename, count + 1);
	
	if (count === 0) {
		return baseFilename;
	}
	
	return `${baseFilename} ${count + 1}`;
}
